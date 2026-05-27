const mongoose = require('mongoose');

const priceAlertSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  userEmail: {
    type: String,
    required: true,
  },
  userName: {
    type: String,
    required: true,
  },
  productName: {
    type: String,
    required: true,
  },
  searchQuery: {
    type: String,
    required: true,
  },
  targetPrice: {
    type: Number,
    required: true,
  },
  currentPrice: {
    type: Number,
    default: null,
  },
  store: {
    type: String,
    default: 'Any',
  },
  isActive: {
    type: Boolean,
    default: true,
  },
  isTriggered: {
    type: Boolean,
    default: false,
  },
  lastChecked: {
    type: Date,
    default: null,
  },
  lastAlertSent: {
    type: Date,
    default: null,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('PriceAlert', priceAlertSchema);
