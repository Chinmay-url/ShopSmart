const cron = require('node-cron');
const axios = require('axios');
const PriceAlert = require('../models/PriceAlert');
const { sendPriceAlertEmail } = require('./emailService');
const { logProductPriceToStore } = require('./storePriceHistory');

/**
 * Fetch current price for a product query from SerpAPI
 * @param {string} query - Search query
 * @returns {Array} - Array of product results
 */
const fetchCurrentPrices = async (query) => {
  try {
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        q: query,
        engine: 'google_shopping',
        google_domain: 'google.co.in',
        gl: 'in',
        hl: 'en',
        api_key: process.env.SERP_API_KEY,
      },
      timeout: 30000,
    });

    const products = response.data.shopping_results || [];
    return products.slice(0, 10).map((product) => {
      let price = product.price || '0';
      let currency = product.currency || 'INR';

      if (typeof price === 'string') {
        price = price.replace(/[^\d.]/g, '');
      }

      let numPrice = parseFloat(price) || 0;
      if (currency && currency.toUpperCase() === 'USD' && numPrice > 0) {
        numPrice = Math.round(numPrice * 83);
      }

      return {
        id: product.product_id,
        name: product.title,
        price: numPrice.toString(),
        numPrice,
        image: product.image || product.thumbnail,
        link: product.product_link || product.link || product.serpapi_link || null,
        store: product.source || 'Unknown',
      };
    });
  } catch (error) {
    console.error(`[PriceAlert Scheduler] Error fetching prices for "${query}":`, error.message);
    return [];
  }
};

/**
 * Check all active price alerts and send emails if target price is reached
 */
const checkPriceAlerts = async () => {
  console.log('[PriceAlert Scheduler] Starting price alert check...', new Date().toISOString());

  try {
    const activeAlerts = await PriceAlert.find({ isActive: true });
    console.log(`[PriceAlert Scheduler] Found ${activeAlerts.length} active alerts to check.`);

    if (activeAlerts.length === 0) return;

    // Group alerts by searchQuery to batch API calls
    const queryGroups = {};
    for (const alert of activeAlerts) {
      const key = alert.searchQuery;
      if (!queryGroups[key]) queryGroups[key] = [];
      queryGroups[key].push(alert);
    }

    for (const [query, alerts] of Object.entries(queryGroups)) {
      console.log(`[PriceAlert Scheduler] Fetching prices for query: "${query}"`);
      const products = await fetchCurrentPrices(query);

      if (products.length === 0) {
        console.log(`[PriceAlert Scheduler] No products found for "${query}", skipping.`);
        continue;
      }

      // Log the fetched products to store Excel files
      for (const product of products) {
        await logProductPriceToStore(product, query).catch(() => {});
      }

      // Check each alert against fetched products
      for (const alert of alerts) {
        try {
          let matchedProducts = products;

          // Filter by specific store if set
          if (alert.store && alert.store !== 'Any') {
            matchedProducts = products.filter(
              (p) => p.store.toLowerCase().includes(alert.store.toLowerCase())
            );
          }

          if (matchedProducts.length === 0) {
            console.log(`[PriceAlert Scheduler] No matching products for store "${alert.store}" in alert ${alert._id}`);
            continue;
          }

          // Find the cheapest matching product
          const cheapest = matchedProducts.reduce((a, b) => (a.numPrice < b.numPrice ? a : b));

          // Update last checked & current price
          alert.lastChecked = new Date();
          alert.currentPrice = cheapest.numPrice;

          if (cheapest.numPrice <= alert.targetPrice) {
            // Price target reached!
            console.log(`[PriceAlert Scheduler] 🎉 Alert triggered for "${alert.productName}" - Current: ₹${cheapest.numPrice}, Target: ₹${alert.targetPrice}`);

            // Send email
            await sendPriceAlertEmail({
              userEmail: alert.userEmail,
              userName: alert.userName,
              productName: cheapest.name || alert.productName,
              targetPrice: alert.targetPrice,
              currentPrice: cheapest.numPrice,
              store: cheapest.store,
              productLink: cheapest.link,
              productImage: cheapest.image,
            });

            alert.isTriggered = true;
            alert.lastAlertSent = new Date();
            // Keep alert active so it keeps notifying on every check
          }

          await alert.save();
        } catch (alertError) {
          console.error(`[PriceAlert Scheduler] Error processing alert ${alert._id}:`, alertError.message);
        }

        // Small delay between alerts to avoid rate limiting
        await new Promise((resolve) => setTimeout(resolve, 500));
      }

      // Delay between different query groups to avoid API rate limiting
      await new Promise((resolve) => setTimeout(resolve, 2000));
    }

    console.log('[PriceAlert Scheduler] Price alert check completed.', new Date().toISOString());
  } catch (error) {
    console.error('[PriceAlert Scheduler] Fatal error:', error);
  }
};

/**
 * Initialize the price alert scheduler
 * Runs every 12 hours: at midnight (00:00) and noon (12:00)
 */
const initPriceAlertScheduler = () => {
  console.log('[PriceAlert Scheduler] Initializing price alert scheduler (runs every 12 hours)...');

  // Cron: "0 0,12 * * *" = every day at 00:00 and 12:00
  cron.schedule('0 0,12 * * *', async () => {
    await checkPriceAlerts();
  }, {
    timezone: 'Asia/Kolkata',
  });

  console.log('[PriceAlert Scheduler] ✓ Scheduler is running. Next checks at 00:00 and 12:00 IST.');
};

module.exports = { initPriceAlertScheduler, checkPriceAlerts };
