const express = require('express');
const axios = require('axios');
const PriceAlert = require('../models/PriceAlert');
const auth = require('../middleware/auth');
const User = require('../models/User');
const { sendPriceAlertEmail } = require('../utils/emailService');

const router = express.Router();

router.post('/', auth, async (req, res) => {
  try {
    const { productName, searchQuery, targetPrice, store } = req.body;

    if (!productName || !searchQuery || !targetPrice) {
      return res.status(400).json({ message: 'productName, searchQuery and targetPrice are required' });
    }
    if (isNaN(targetPrice) || Number(targetPrice) <= 0) {
      return res.status(400).json({ message: 'targetPrice must be a positive number' });
    }

    const user = await User.findById(req.userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    const duplicate = await PriceAlert.findOne({
      userId: req.userId,
      productName,
      store: store || 'Any',
      isActive: true,
    });
    if (duplicate) {
      return res.status(400).json({ message: 'You already have an active alert for this product on this store.' });
    }

    const alert = new PriceAlert({
      userId: req.userId,
      userEmail: user.email,
      userName: user.name,
      productName,
      searchQuery,
      targetPrice: Number(targetPrice),
      store: store || 'Any',
    });

    await alert.save();

    res.status(201).json({ message: 'Price alert created successfully!', alert });
  } catch (error) {
    console.error('Create alert error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.get('/', auth, async (req, res) => {
  try {
    const alerts = await PriceAlert.find({ userId: req.userId }).sort({ createdAt: -1 });
    res.json({ alerts });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const alert = await PriceAlert.findOne({ _id: req.params.id, userId: req.userId });
    if (!alert) return res.status(404).json({ message: 'Alert not found' });

    await alert.deleteOne();
    res.json({ message: 'Alert deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.patch('/:id/toggle', auth, async (req, res) => {
  try {
    const alert = await PriceAlert.findOne({ _id: req.params.id, userId: req.userId });
    if (!alert) return res.status(404).json({ message: 'Alert not found' });

    alert.isActive = !alert.isActive;
    await alert.save();
    res.json({ message: `Alert ${alert.isActive ? 'activated' : 'paused'}`, alert });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

router.post('/:id/check-now', auth, async (req, res) => {
  try {
    const alert = await PriceAlert.findOne({ _id: req.params.id, userId: req.userId });
    if (!alert) return res.status(404).json({ message: 'Alert not found' });

    alert.lastChecked = new Date();
    await alert.save();

    const searchResponse = await axios.get('https://serpapi.com/search', {
      params: {
        engine: 'google_shopping',
        q: alert.searchQuery,
        gl: 'in',
        hl: 'en',
        api_key: process.env.SERP_API_KEY,
      },
    });

    const shoppingResults = searchResponse.data.shopping_results || [];
    if (shoppingResults.length === 0) {
      return res.json({ status: 'not_found', message: 'Product not found in current search results. The product may be unavailable.' });
    }

    let matchedProduct = null;
    const storeLower = alert.store.toLowerCase();

    if (alert.store && alert.store !== 'Any') {
      matchedProduct = shoppingResults.find((p) => {
        const sourceLower = (p.source || '').toLowerCase();
        return sourceLower.includes(storeLower) || storeLower.includes(sourceLower);
      });
    }

    if (!matchedProduct) {
      matchedProduct = shoppingResults[0];
    }

    const currentPrice = matchedProduct.extracted_price;
    alert.currentPrice = currentPrice;
    await alert.save();

    if (currentPrice <= alert.targetPrice) {
      try {
        await sendPriceAlertEmail({
          userEmail: alert.userEmail,
          userName: alert.userName,
          productName: alert.productName,
          targetPrice: alert.targetPrice,
          currentPrice,
          store: matchedProduct.source || alert.store,
          productLink: matchedProduct.product_link || '',
          productImage: matchedProduct.thumbnail || '',
        });

        alert.isTriggered = true;
        alert.lastAlertSent = new Date();
        await alert.save();

        return res.json({
          status: 'price_met',
          message: `Price dropped to ₹${currentPrice}! Email notification sent.`,
          currentPrice,
          targetPrice: alert.targetPrice,
          savings: alert.targetPrice - currentPrice,
          store: matchedProduct.source || alert.store,
          productLink: matchedProduct.product_link,
        });
      } catch (emailError) {
        console.error('Email send error:', emailError);
        return res.json({
          status: 'price_met',
          message: `Price dropped to ₹${currentPrice}! However, email notification failed. Please check your alert settings.`,
          currentPrice,
          targetPrice: alert.targetPrice,
          savings: alert.targetPrice - currentPrice,
          store: matchedProduct.source || alert.store,
          productLink: matchedProduct.product_link,
        });
      }
    }

    const diff = currentPrice - alert.targetPrice;
    return res.json({
      status: 'waiting',
      message: `Current price is ₹${currentPrice}. Please wait — it's ₹${diff} above your target price of ₹${alert.targetPrice}.`,
      currentPrice,
      targetPrice: alert.targetPrice,
      difference: diff,
      store: matchedProduct.source || alert.store,
    });
  } catch (error) {
    console.error('Check now error:', error);
    res.status(500).json({ message: 'Failed to check price. Please try again later.', error: error.message });
  }
});

module.exports = router;
