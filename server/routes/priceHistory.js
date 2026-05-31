const express = require('express');
const { getStoreProductHistory, getAllStoresProductHistory, getKnownStores } = require('../utils/storePriceHistory');

const router = express.Router();

// GET /price-history/stores - list all known stores
router.get('/stores', async (req, res) => {
  try {
    const stores = getKnownStores();
    res.json({ stores });
  } catch (error) {
    console.error('Error fetching stores:', error);
    res.status(500).json({ message: 'Failed to fetch stores', error: error.message });
  }
});

// GET /price-history/:productName?store=Amazon
// Returns history for that product filtered by store (if provided)
router.get('/:productName', async (req, res) => {
  try {
    const { productName } = req.params;
    const { store } = req.query;

    let result;
    if (store) {
      // Fetch history for that specific store only
      result = getStoreProductHistory(productName, store);
    } else {
      // Fetch from all stores
      result = getAllStoresProductHistory(productName);
    }

    // Transform the data for the frontend
    const history = (result.data || []).map((row) => ({
      date: row.Date,
      time: row.Time,
      price: parseFloat(row['Price (INR)']) || 0,
      store: row.Store || 'Unknown',
      image: row['Image URL'] || '',
      link: row['Product Link'] || '',
    }));

    res.json({
      productName,
      store: store || 'All Stores',
      history,
      analysis: result.analysis,
      hasHistory: history.length > 0,
    });
  } catch (error) {
    console.error('Error fetching price history:', error);
    res.status(500).json({ message: 'Failed to fetch price history', error: error.message });
  }
});

// GET /price-history - list all known products across all stores
router.get('/', async (req, res) => {
  try {
    const stores = getKnownStores();
    res.json({ stores, message: 'Use /price-history/:productName?store=StoreName to get history' });
  } catch (error) {
    console.error('Error fetching price history index:', error);
    res.status(500).json({ message: 'Failed to fetch price history', error: error.message });
  }
});

module.exports = router;
