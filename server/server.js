const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();
const { initPriceAlertScheduler } = require('./utils/priceAlertScheduler');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => {
    console.log('MongoDB connected');
    // Start price alert scheduler after DB is connected
    initPriceAlertScheduler();
  })
  .catch(err => console.log('MongoDB connection error:', err));

// Routes
app.use('/auth', require('./routes/auth'));
app.use('/search', require('./routes/search'));
app.use('/products', require('./routes/products'));
app.use('/price-history', require('./routes/priceHistory'));
app.use('/alerts', require('./routes/alerts'));
app.use('/reviews', require('./routes/reviews'));
app.use('/chat', require('./routes/chat'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'Server is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
