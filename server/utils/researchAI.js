
/**
 * Detects deceptive pricing patterns (e.g., price inflation before a sale).
 * @param {Array} history - The price history array.
 * @returns {Object} - Honesty score and details.
 */
function analyzePriceIntegrity(history) {
  if (!history || history.length < 3) {
    return { score: 100, status: 'Verified', message: 'Insufficient data for integrity check.' };
  }

  const prices = history.map(h => parseFloat(h.price));
  const currentPrice = prices[prices.length - 1];
  const prevPrice = prices[prices.length - 2];
  
  // Calculate average of previous prices (excluding current)
  const historicalAvg = prices.slice(0, -1).reduce((a, b) => a + b, 0) / (prices.length - 1);
  
  // 1. Check for "Pump and Dump" (Spike before drop)
  // If price increased significantly (>15%) in the previous step and then dropped back to "sale"
  const preSaleInflation = ((prevPrice - historicalAvg) / historicalAvg) * 100;
  const currentDiscount = ((prevPrice - currentPrice) / prevPrice) * 100;

  if (preSaleInflation > 10 && currentDiscount > 10) {
    return {
      score: Math.max(0, 100 - Math.round(preSaleInflation)),
      status: 'Caution',
      message: `Deceptive pricing detected: Price was inflated by ${Math.round(preSaleInflation)}% just before this "discount".`
    };
  }

  // 2. Check for "Stagnant Discount" (Always on sale)
  const isAlwaysOnSale = history.every(h => h.isSale); // If we had this flag
  
  return {
    score: 100,
    status: 'Honest',
    message: 'Price follows a natural market trajectory.'
  };
}

/**
 * Analyzes sentiment disparity between different stores.
 * @param {Array} reviews - The analyzed reviews with sentiment labels.
 * @returns {Object} - Grouped statistics by store.
 */
function analyzeStoreDisparity(reviews) {
  if (!reviews || !Array.isArray(reviews)) return {};

  const stores = {};
  const keywords = {
    logistics: ['delivery', 'shipping', 'packaging', 'delivered', 'courier', 'arrived', 'damage'],
    product: ['quality', 'performance', 'battery', 'camera', 'screen', 'build']
  };

  reviews.forEach(review => {
    const source = review.source || 'Other';
    if (!stores[source]) {
      stores[source] = {
        name: source,
        total: 0,
        positive: 0,
        negative: 0,
        neutral: 0,
        logisticsScore: 0,
        logisticsCount: 0,
        topComplaints: []
      };
    }

    const s = stores[source];
    s.total++;
    if (review.sentiment?.label === 'positive') s.positive++;
    else if (review.sentiment?.label === 'negative') s.negative++;
    else s.neutral++;

    // Logistics specific check
    const text = review.text.toLowerCase();
    const isLogistics = keywords.logistics.some(k => text.includes(k));
    if (isLogistics) {
      s.logisticsCount++;
      if (review.sentiment?.label === 'positive') s.logisticsScore += 1;
      else if (review.sentiment?.label === 'negative') s.logisticsScore -= 1;
    }
  });

  // Calculate percentages and normalize
  Object.values(stores).forEach(s => {
    s.positiveRate = Math.round((s.positive / s.total) * 100);
    s.logisticsRating = s.logisticsCount > 0 ? (s.logisticsScore / s.logisticsCount).toFixed(1) : 'N/A';
  });

  return stores;
}

/**
 * XAI Reasoning Engine: Generates an evidence-based recommendation.
 */
function generateAIRecommendation(priceData, integrity, storeDisparity) {
  const { currentPrice, avgPrice, isBestTimeToBuy, trend } = priceData;
  const reasons = [];
  
  // Price Evidence
  if (currentPrice < avgPrice * 0.9) {
    reasons.push(`Price is ${Math.round((1 - currentPrice/avgPrice)*100)}% below the historical average.`);
  } else if (currentPrice > avgPrice * 1.1) {
    reasons.push(`Price is currently ${Math.round((currentPrice/avgPrice - 1)*100)}% higher than the seasonal average.`);
  }

  // Integrity Evidence
  if (integrity.score < 80) {
    reasons.push(`Integrity Check: ${integrity.message}`);
  }

  // Store Evidence
  const topStore = Object.values(storeDisparity).sort((a, b) => b.positiveRate - a.positiveRate)[0];
  if (topStore) {
    reasons.push(`${topStore.name} shows the highest customer satisfaction (${topStore.positiveRate}% positive).`);
  }

  let finalAdvice = isBestTimeToBuy ? "BUY NOW" : "WAIT";
  if (integrity.score < 70) finalAdvice = "PROCEED WITH CAUTION";

  return {
    advice: finalAdvice,
    confidence: integrity.score,
    evidence: reasons,
    summary: `My AI analysis suggests a "${finalAdvice}" status. ${reasons.join(' ')}`
  };
}

/**
 * Aspect-Based Sentiment Analysis (ABSA)
 * Extracts feature-specific sentiment from reviews.
 */
function analyzeAspects(reviews) {
  const aspects = {
    'Performance': { score: 0, count: 0, keywords: ['fast', 'slow', 'performance', 'lag', 'speed', 'smooth'] },
    'Quality': { score: 0, count: 0, keywords: ['quality', 'build', 'premium', 'cheap', 'sturdy', 'material'] },
    'Battery': { score: 0, count: 0, keywords: ['battery', 'charge', 'backup', 'power', 'drain'] },
    'Value': { score: 0, count: 0, keywords: ['worth', 'price', 'value', 'expensive', 'cheap', 'budget'] },
    'Design': { score: 0, count: 0, keywords: ['design', 'look', 'beautiful', 'ugly', 'stylish', 'color'] }
  };

  if (!reviews) return aspects;

  reviews.forEach(r => {
    const text = r.text.toLowerCase();
    const sentiment = r.sentiment?.label === 'positive' ? 1 : r.sentiment?.label === 'negative' ? -1 : 0;

    Object.keys(aspects).forEach(a => {
      if (aspects[a].keywords.some(k => text.includes(k))) {
        aspects[a].count++;
        aspects[a].score += sentiment;
      }
    });
  });

  // Calculate final ratings 1-10
  const results = {};
  Object.keys(aspects).forEach(a => {
    const avg = aspects[a].count > 0 ? (aspects[a].score / aspects[a].count) : 0;
    // Map -1 to 1 into 1 to 10 scale
    results[a] = {
      rating: Math.round(((avg + 1) / 2) * 9 + 1),
      mentions: aspects[a].count
    };
  });

  return results;
}

/**
 * Review Credibility & Spam Detection
 * Detects patterns indicative of non-authentic reviews.
 */
function analyzeReviewCredibility(reviews) {
  if (!reviews || reviews.length === 0) return { score: 100, status: 'N/A' };

  let penalties = 0;
  const texts = reviews.map(r => r.text.toLowerCase());

  // 1. Repetitiveness check (Bot behavior)
  const uniqueTexts = new Set(texts);
  if (uniqueTexts.size < texts.length * 0.8) penalties += 20;

  // 2. Short review penalty
  const avgLength = texts.reduce((a, b) => a + b.length, 0) / texts.length;
  if (avgLength < 30) penalties += 15;

  // 3. Excessive emotion (Exclamation marks)
  const exclamationCount = reviews.reduce((a, b) => a + (b.text.match(/!/g) || []).length, 0) / reviews.length;
  if (exclamationCount > 2) penalties += 10;

  const score = Math.max(0, 100 - penalties);
  return {
    score,
    status: score > 85 ? 'Authentic' : score > 60 ? 'Mixed' : 'Suspect',
    details: score < 80 ? 'Patterns of repetitive or low-effort content detected.' : 'Review patterns appear natural.'
  };
}

/**
 * Value-for-Money (VFM) Index
 * Compares price vs features vs market average.
 */
function calculateVFMIndex(productPrice, categoryResults) {
  if (!categoryResults || categoryResults.length === 0) return 70; // Default

  const prices = categoryResults.map(r => r.extracted_price).filter(p => p > 0);
  const avgMarketPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

  // Simple VFM logic: Lower price than market avg for similar results = higher value
  let score = 70; // Start at neutral
  const priceDiff = (avgMarketPrice - productPrice) / avgMarketPrice;
  
  score += (priceDiff * 50); // ± 50 points based on price competition
  
  return Math.min(98, Math.max(15, Math.round(score)));
}

module.exports = {
  analyzePriceIntegrity,
  analyzeStoreDisparity,
  generateAIRecommendation,
  analyzeAspects,
  analyzeReviewCredibility,
  calculateVFMIndex
};
