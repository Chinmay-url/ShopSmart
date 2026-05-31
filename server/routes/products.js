const express = require('express');
const User = require('../models/User');
const auth = require('../middleware/auth');

const router = express.Router();

// Save product to favorites
router.post('/save', auth, async (req, res) => {
  try {
    const { productId, productName, price, image, link, store } = req.body;

    // Validate required fields
    if (!productId || !productName || !price) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if product already saved
    const productExists = user.savedProducts.some(
      (p) => p.productId === productId
    );

    if (productExists) {
      return res.status(400).json({ message: 'Product already saved' });
    }

    user.savedProducts.push({
      productId: productId.toString(),
      productName,
      price: price.toString(),
      image: image || '',
      link: link || '',
      store: store || 'Unknown',
      savedAt: new Date(),
    });

    await user.save();

    res.status(200).json({ 
      message: 'Product saved successfully', 
      savedProducts: user.savedProducts 
    });
  } catch (error) {
    console.error('Save product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get saved products
router.get('/saved', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user.savedProducts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Remove saved product
router.delete('/saved/:productId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.savedProducts = user.savedProducts.filter(
      (p) => p.productId !== req.params.productId
    );

    await user.save();

    res.json({ message: 'Product removed', savedProducts: user.savedProducts });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// Get product by ID
router.get('/:productId', async (req, res) => {
  try {
    const { productId } = req.params;
    
    // This is a simplified example. In a real application, you would typically query a database
    // to find the product by ID. Here we're just returning a mock response.
    // You should replace this with your actual database query.
    
    // Mock product data - replace with your actual database query
    const product = {
      id: productId,
      name: `Product ${productId}`,
      price: (Math.random() * 1000).toFixed(2),
      store: 'Example Store',
      image: 'https://via.placeholder.com/300',
      link: '#',
      category: 'Electronics',
      updatedAt: new Date().toISOString()
    };

    res.json(product);
  } catch (error) {
    console.error('Get product error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

module.exports = router;
