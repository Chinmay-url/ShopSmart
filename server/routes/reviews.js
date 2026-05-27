const express = require('express');
const axios = require('axios');
const { analyzeReviews } = require('../utils/sentiment');
const { getProductHistory } = require('../utils/priceHistory');
const { analyzePriceIntegrity, analyzeStoreDisparity, generateAIRecommendation, analyzeAspects, analyzeReviewCredibility, calculateVFMIndex } = require('../utils/researchAI');

const router = express.Router();

router.get('/', async (req, res) => {
  try {
    const { product_id, q } = req.query;

    if (!product_id && !q) {
      return res.status(400).json({ message: 'Product ID or query is required' });
    }

    const searchQuery = q || product_id;

    // Step 1: Search google_shopping to find the immersive_product_page_token
    const searchParams = {
      engine: 'google_shopping',
      q: searchQuery,
      gl: 'in',
      hl: 'en',
      api_key: process.env.SERP_API_KEY,
    };

    const searchResponse = await axios.get('https://serpapi.com/search', { params: searchParams });
    const shoppingResults = searchResponse.data.shopping_results || [];

    let pageToken = null;

    if (product_id) {
      // Find the exact product by product_id
      const match = shoppingResults.find((r) => r.product_id === product_id);
      if (match && match.immersive_product_page_token) {
        pageToken = match.immersive_product_page_token;
      }
    }

    // Fallback: use first result's token if no exact match
    if (!pageToken && shoppingResults.length > 0 && shoppingResults[0].immersive_product_page_token) {
      pageToken = shoppingResults[0].immersive_product_page_token;
    }

    if (!pageToken) {
      return res.status(404).json({ message: 'No product found' });
    }

    // Step 2: Fetch detailed product data using google_immersive_product
    const immersiveParams = {
      engine: 'google_immersive_product',
      page_token: pageToken,
      gl: 'in',
      hl: 'en',
      api_key: process.env.SERP_API_KEY,
    };

    const immersiveResponse = await axios.get('https://serpapi.com/search', { params: immersiveParams });
    const productData = immersiveResponse.data.product_results;

    if (!productData) {
      return res.status(404).json({ message: 'No product data found' });
    }

    // Step 3: Perform sentiment analysis on user reviews if they exist
    if (productData.user_reviews && productData.user_reviews.length > 0) {
      console.log(`Analyzing sentiment for ${productData.user_reviews.length} reviews...`);
      productData.user_reviews = await analyzeReviews(productData.user_reviews);
    }

    // Step 4: Research AI Features
    // 1. Store Disparity
    productData.store_disparity = analyzeStoreDisparity(productData.user_reviews);

    // 2. Price Integrity
    const historyResult = getProductHistory(productData.title || searchQuery);
    const history = historyResult.success ? historyResult.data : [];
    productData.price_integrity = analyzePriceIntegrity(history);

    // 3. XAI Recommendation
    if (historyResult.success) {
      productData.ai_advisor = generateAIRecommendation(
        historyResult.analysis,
        productData.price_integrity,
        productData.store_disparity
      );
    }

    // 4. Aspect-Based Sentiment Analysis (ABSA)
    productData.aspect_sentiment = analyzeAspects(productData.user_reviews);

    // 5. Review Credibility
    productData.review_credibility = analyzeReviewCredibility(productData.user_reviews);

    // 6. Value-for-Money Index
    const currentPrice = shoppingResults.find(r => r.product_id === product_id)?.extracted_price || 
                        (shoppingResults.length > 0 ? shoppingResults[0].extracted_price : 0);
    productData.vfm_index = calculateVFMIndex(currentPrice, shoppingResults);

    res.json(productData);
  } catch (error) {
    console.error('Reviews fetch error:', error.message);
    res.status(500).json({ message: 'Failed to fetch reviews', error: error.message });
  }
});

module.exports = router;
