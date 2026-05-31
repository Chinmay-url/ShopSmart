const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Directory to store category-based price history Excel files
const PRICE_HISTORY_DIR = path.join(__dirname, '../data/price-history');

// Product categories
const CATEGORIES = {
  ELECTRONICS: 'Electronics',
  FASHION: 'Fashion',
  HOME: 'Home & Kitchen',
  BEAUTY: 'Beauty & Personal Care',
  SPORTS: 'Sports & Outdoors',
  BOOKS: 'Books & Media',
  TOYS: 'Toys & Games',
  GROCERY: 'Grocery & Food',
  OTHER: 'Other'
};

// Ensure the price history directory exists
const ensureDirectoryExists = () => {
  if (!fs.existsSync(PRICE_HISTORY_DIR)) {
    fs.mkdirSync(PRICE_HISTORY_DIR, { recursive: true });
    console.log('Created price history directory:', PRICE_HISTORY_DIR);
  }
};

// Get category for a product based on keywords
const getProductCategory = (productName) => {
  const name = productName.toLowerCase();
  
  if (name.includes('phone') || name.includes('laptop') || name.includes('computer') || 
      name.includes('tablet') || name.includes('camera') || name.includes('headphone') ||
      name.includes('speaker') || name.includes('tv') || name.includes('monitor') ||
      name.includes('keyboard') || name.includes('mouse') || name.includes('charger') ||
      name.includes('electronics') || name.includes('gadget')) {
    return CATEGORIES.ELECTRONICS;
  }
  
  if (name.includes('shirt') || name.includes('pants') || name.includes('dress') ||
      name.includes('shoes') || name.includes('jacket') || name.includes('watch') ||
      name.includes('bag') || name.includes('fashion') || name.includes('clothing')) {
    return CATEGORIES.FASHION;
  }
  
  if (name.includes('kitchen') || name.includes('furniture') || name.includes('home') ||
      name.includes('decor') || name.includes('bed') || name.includes('sofa') ||
      name.includes('table') || name.includes('chair')) {
    return CATEGORIES.HOME;
  }
  
  if (name.includes('cream') || name.includes('shampoo') || name.includes('makeup') ||
      name.includes('soap') || name.includes('perfume') || name.includes('beauty') ||
      name.includes('skin') || name.includes('hair')) {
    return CATEGORIES.BEAUTY;
  }
  
  if (name.includes('sport') || name.includes('gym') || name.includes('fitness') ||
      name.includes('outdoor') || name.includes('camping') || name.includes('bicycle')) {
    return CATEGORIES.SPORTS;
  }
  
  if (name.includes('book') || name.includes('novel') || name.includes('movie') ||
      name.includes('music') || name.includes('game') || name.includes('media')) {
    return CATEGORIES.BOOKS;
  }
  
  if (name.includes('toy') || name.includes('game') || name.includes('puzzle') ||
      name.includes('lego') || name.includes('doll')) {
    return CATEGORIES.TOYS;
  }
  
  if (name.includes('food') || name.includes('grocery') || name.includes('snack') ||
      name.includes('drink') || name.includes('meal')) {
    return CATEGORIES.GROCERY;
  }
  
  return CATEGORIES.OTHER;
};

/**
 * Log product price to category-specific Excel file
 * @param {Object} product - Product object with id, name, price, store, image, link
 * @param {string} query - Search query used
 */
const logProductPriceToCategory = async (product, query) => {
  try {
    ensureDirectoryExists();
    
    const category = getProductCategory(product.name);
    const filename = `${category.toLowerCase().replace(/\s+/g, '_')}_price_history.xlsx`;
    const filePath = path.join(PRICE_HISTORY_DIR, filename);

    const timestamp = new Date().toISOString();
    const date = new Date().toLocaleDateString('en-IN');
    const time = new Date().toLocaleTimeString('en-IN');

    const newRow = {
      Timestamp: timestamp,
      Date: date,
      Time: time,
      'Product ID': product.id || 'N/A',
      'Product Name': product.name || 'Unknown',
      'Price (INR)': product.price || '0',
      Store: product.store || 'Unknown',
      'Search Query': query || 'N/A',
      'Image URL': product.image || '',
      'Product Link': product.link || '',
      Category: category
    };

    let workbook;
    let worksheet;
    let existingData = [];

    // Check if file exists
    if (fs.existsSync(filePath)) {
      // Read existing file
      workbook = XLSX.readFile(filePath);
      worksheet = workbook.Sheets[workbook.SheetNames[0]];
      existingData = XLSX.utils.sheet_to_json(worksheet);
    } else {
      // Create new workbook
      workbook = XLSX.utils.book_new();
    }

    // Add new row to existing data
    existingData.push(newRow);

    // Create new worksheet with all data
    const newWorksheet = XLSX.utils.json_to_sheet(existingData);

    // Set column widths for better readability
    newWorksheet['!cols'] = [
      { wch: 25 }, // Timestamp
      { wch: 12 }, // Date
      { wch: 12 }, // Time
      { wch: 15 }, // Product ID
      { wch: 40 }, // Product Name
      { wch: 12 }, // Price
      { wch: 15 }, // Store
      { wch: 20 }, // Search Query
      { wch: 30 }, // Image URL
      { wch: 30 }, // Product Link
      { wch: 15 }  // Category
    ];

    // Replace or add the worksheet
    if (workbook.SheetNames.length > 0) {
      workbook.Sheets[workbook.SheetNames[0]] = newWorksheet;
    } else {
      XLSX.utils.book_append_sheet(workbook, newWorksheet, 'Price History');
    }

    // Write to file
    XLSX.writeFile(workbook, filePath);
    console.log(`✓ Logged price for "${product.name}" to ${filename}`);

    return { success: true, filePath, category };
  } catch (error) {
    console.error('Error logging product price to category:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Get price history for a specific product from category files
 * @param {string} productName - The product name
 * @returns {Object} - Historical price data and analysis
 */
const getProductHistoryFromCategories = (productName) => {
  try {
    ensureDirectoryExists();
    
    const category = getProductCategory(productName);
    const filename = `${category.toLowerCase().replace(/\s+/g, '_')}_price_history.xlsx`;
    const filePath = path.join(PRICE_HISTORY_DIR, filename);

    if (!fs.existsSync(filePath)) {
      // Try to find in other category files
      const files = fs.readdirSync(PRICE_HISTORY_DIR).filter(f => f.endsWith('.xlsx'));
      for (const file of files) {
        const fileData = searchProductInFile(path.join(PRICE_HISTORY_DIR, file), productName);
        if (fileData.length > 0) {
          return analyzeProductData(fileData, productName);
        }
      }
      return { success: false, message: 'No price history found for this product' };
    }

    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const allData = XLSX.utils.sheet_to_json(worksheet);

    // Filter data for this specific product (case-insensitive partial match)
    const productData = allData.filter(row =>
      row['Product Name'] &&
      row['Product Name'].toLowerCase().includes(productName.toLowerCase())
    );

    if (productData.length === 0) {
      return { success: false, message: 'No price history found for this product' };
    }

    return analyzeProductData(productData, productName);
  } catch (error) {
    console.error('Error reading product history from categories:', error);
    return { success: false, error: error.message };
  }
};

/**
 * Search for product in a specific Excel file
 */
const searchProductInFile = (filePath, productName) => {
  try {
    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const allData = XLSX.utils.sheet_to_json(worksheet);
    
    return allData.filter(row =>
      row['Product Name'] &&
      row['Product Name'].toLowerCase().includes(productName.toLowerCase())
    );
  } catch (error) {
    console.error(`Error searching in file ${filePath}:`, error);
    return [];
  }
};

/**
 * Analyze product data and generate insights
 */
const analyzeProductData = (productData, productName) => {
  // Sort by timestamp
  productData.sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));

  // Calculate price statistics
  const prices = productData.map(row => parseFloat(row['Price (INR)']) || 0);
  const currentPrice = prices[prices.length - 1];
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

  // Determine if it's a good time to buy
  const priceRange = maxPrice - minPrice;
  const priceThreshold = minPrice + priceRange * 0.2; // Within 20% of min price
  const isBestTimeToBuy = currentPrice <= priceThreshold;

  // Calculate trend (comparing last 3 prices if available)
  let trend = 'stable';
  let trendPercentage = 0;
  if (prices.length >= 3) {
    const recentPrices = prices.slice(-3);
    if (recentPrices[2] < recentPrices[1] && recentPrices[1] < recentPrices[0]) {
      trend = 'decreasing';
      trendPercentage = ((recentPrices[0] - recentPrices[2]) / recentPrices[0] * 100).toFixed(1);
    } else if (recentPrices[2] > recentPrices[1] && recentPrices[1] > recentPrices[0]) {
      trend = 'increasing';
      trendPercentage = ((recentPrices[2] - recentPrices[0]) / recentPrices[0] * 100).toFixed(1);
    }
  }

  // Generate review score based on price stability and trend
  let reviewScore = 5;
  if (trend === 'increasing') reviewScore -= 2;
  if (trend === 'decreasing') reviewScore += 1;
  if (currentPrice > avgPrice) reviewScore -= 1;
  if (isBestTimeToBuy) reviewScore += 1;
  reviewScore = Math.max(1, Math.min(5, reviewScore));

  return {
    success: true,
    data: productData,
    analysis: {
      currentPrice,
      minPrice,
      maxPrice,
      avgPrice: Math.round(avgPrice),
      isBestTimeToBuy,
      trend,
      trendPercentage,
      totalRecords: productData.length,
      reviewScore,
      recommendation: isBestTimeToBuy
        ? `🎉 Great time to buy! Current price (₹${currentPrice}) is near the lowest recorded price (₹${minPrice}).`
        : trend === 'increasing'
        ? `⚠️ Prices are rising! Consider buying soon. Current price (₹${currentPrice}) is higher than usual.`
        : `📊 Price is stable. Current price (₹${currentPrice}) is around average (₹${Math.round(avgPrice)}).`
    }
  };
};

/**
 * Get all products from all category files
 * @returns {Array} - Array of unique product names with categories
 */
const getAllProductsFromCategories = () => {
  try {
    ensureDirectoryExists();
    
    const files = fs.readdirSync(PRICE_HISTORY_DIR).filter(f => f.endsWith('.xlsx'));
    const allProducts = [];

    for (const file of files) {
      const filePath = path.join(PRICE_HISTORY_DIR, file);
      const workbook = XLSX.readFile(filePath);
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const data = XLSX.utils.sheet_to_json(worksheet);

      data.forEach(row => {
        if (row['Product Name'] && row['Product Name'] !== 'Unknown') {
          allProducts.push({
            name: row['Product Name'],
            category: row.Category || CATEGORIES.OTHER
          });
        }
      });
    }

    // Remove duplicates
    const uniqueProducts = allProducts.filter((product, index, self) =>
      index === self.findIndex((p) => p.name === product.name)
    );

    return uniqueProducts;
  } catch (error) {
    console.error('Error reading products from categories:', error);
    return [];
  }
};

/**
 * Get products by category
 * @param {string} category - The category to filter by
 * @returns {Array} - Array of product names in the category
 */
const getProductsByCategory = (category) => {
  try {
    ensureDirectoryExists();
    
    const filename = `${category.toLowerCase().replace(/\s+/g, '_')}_price_history.xlsx`;
    const filePath = path.join(PRICE_HISTORY_DIR, filename);

    if (!fs.existsSync(filePath)) {
      return [];
    }

    const workbook = XLSX.readFile(filePath);
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data = XLSX.utils.sheet_to_json(worksheet);

    // Get unique product names
    const uniqueProducts = [...new Set(data.map(row => row['Product Name']))];
    return uniqueProducts.filter(name => name && name !== 'Unknown');
  } catch (error) {
    console.error(`Error reading products from category ${category}:`, error);
    return [];
  }
};

module.exports = {
  CATEGORIES,
  logProductPriceToCategory,
  getProductHistoryFromCategories,
  getAllProductsFromCategories,
  getProductsByCategory,
  getProductCategory
};
