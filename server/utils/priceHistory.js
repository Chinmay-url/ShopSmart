const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Directory to store price history Excel file
const PRICE_HISTORY_DIR = path.join(__dirname, '../data/price-history');
const PRICE_HISTORY_FILE = path.join(PRICE_HISTORY_DIR, 'price_history.xlsx');

// Ensure the price history directory exists
const ensureDirectoryExists = () => {
    if (!fs.existsSync(PRICE_HISTORY_DIR)) {
        fs.mkdirSync(PRICE_HISTORY_DIR, { recursive: true });
        console.log('Created price history directory:', PRICE_HISTORY_DIR);
    }
};

/**
 * Log product price to single Excel file
 * @param {Object} product - Product object with id, name, price, store, image, link
 * @param {string} query - Search query used
 */
const logProductPrice = async (product, query) => {
    try {
        ensureDirectoryExists();

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
            'Product Link': product.link || ''
        };

        let workbook;
        let worksheet;
        let existingData = [];

        // Check if file exists
        if (fs.existsSync(PRICE_HISTORY_FILE)) {
            // Read existing file
            workbook = XLSX.readFile(PRICE_HISTORY_FILE);
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
            { wch: 30 }  // Product Link
        ];

        // Replace or add the worksheet
        if (workbook.SheetNames.length > 0) {
            workbook.Sheets[workbook.SheetNames[0]] = newWorksheet;
        } else {
            XLSX.utils.book_append_sheet(workbook, newWorksheet, 'Price History');
        }

        // Write to file
        XLSX.writeFile(workbook, PRICE_HISTORY_FILE);
        console.log(`✓ Logged price for "${product.name}" to price_history.xlsx`);

        return { success: true, filePath: PRICE_HISTORY_FILE };
    } catch (error) {
        console.error('Error logging product price:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get price history for a specific product
 * @param {string} productName - The product name
 * @returns {Object} - Historical price data and analysis
 */
const getProductHistory = (productName) => {
    try {
        ensureDirectoryExists();

        if (!fs.existsSync(PRICE_HISTORY_FILE)) {
            return { success: false, message: 'No price history found' };
        }

        const workbook = XLSX.readFile(PRICE_HISTORY_FILE);
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

        // Sort by timestamp
        productData.sort((a, b) => new Date(a.Timestamp) - new Date(b.Timestamp));

        // Calculate price statistics
        const prices = productData.map(row => parseFloat(row['Price (INR)']) || 0);
        const currentPrice = prices[prices.length - 1];
        const minPrice = Math.min(...prices);
        const maxPrice = Math.max(...prices);
        const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;

        // Determine if it's a good time to buy
        const priceThreshold = minPrice + (maxPrice - minPrice) * 0.3; // Within 30% of min price
        const isBestTimeToBuy = currentPrice <= priceThreshold;

        // Calculate trend (comparing last 3 prices if available)
        let trend = 'stable';
        if (prices.length >= 3) {
            const recentPrices = prices.slice(-3);
            if (recentPrices[2] < recentPrices[1] && recentPrices[1] < recentPrices[0]) {
                trend = 'decreasing';
            } else if (recentPrices[2] > recentPrices[1] && recentPrices[1] > recentPrices[0]) {
                trend = 'increasing';
            }
        }

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
                totalRecords: productData.length,
                recommendation: isBestTimeToBuy
                    ? `Great time to buy! Current price (₹${currentPrice}) is near the lowest recorded price (₹${minPrice}).`
                    : `Consider waiting. Current price (₹${currentPrice}) is higher than usual. Average price is ₹${Math.round(avgPrice)}.`
            }
        };
    } catch (error) {
        console.error('Error reading product history:', error);
        return { success: false, error: error.message };
    }
};

/**
 * Get all unique products from price history
 * @returns {Array} - Array of unique product names
 */
const getAllProducts = () => {
    try {
        ensureDirectoryExists();

        if (!fs.existsSync(PRICE_HISTORY_FILE)) {
            return [];
        }

        const workbook = XLSX.readFile(PRICE_HISTORY_FILE);
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const allData = XLSX.utils.sheet_to_json(worksheet);

        // Get unique product names
        const uniqueProducts = [...new Set(allData.map(row => row['Product Name']))];
        return uniqueProducts.filter(name => name && name !== 'Unknown');
    } catch (error) {
        console.error('Error reading products:', error);
        return [];
    }
};

module.exports = {
    logProductPrice,
    getProductHistory,
    getAllProducts
};
