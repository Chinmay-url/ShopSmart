# ShopSmart - Price Comparison Platform

ShopSmart is a full-stack price comparison platform built with the MERN stack. Users can search products across Indian e-commerce stores, track price history, set email alerts, and get AI-powered shopping assistance.

## Features

- **Product Search** — Search across e-commerce stores via SerpApi
- **Price Tracking** — Interactive price history charts (Recharts)
- **Price History** — Historical data by category and store (XLSX / MongoDB)
- **Email Alerts** — Get notified when a product drops below your target price
- **AI Chatbot** — "Rupees Chatbot" powered by Groq API for personalized shopping advice
- **Sentiment Analysis** — On-device review sentiment using Hugging Face Transformers.js (Xenova/bert-base-multilingual-uncased-sentiment)
- **Aspect-Based Sentiment** — Extract opinions on specific product aspects (price, quality, delivery, etc.)
- **Review Credibility Scoring** — Identify fake/spam reviews
- **Value-for-Money Index** — Compare product value across sellers
- **User Authentication** — JWT-based signup/login with bcrypt
- **Responsive UI** — Tailwind CSS with Framer Motion animations

## Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React, Tailwind CSS, Lucide React, Recharts, Axios, Framer Motion |
| Backend | Node.js, Express |
| Database | MongoDB (Mongoose) |
| APIs | SerpApi (Search & Reviews), Groq AI (Chatbot) |
| ML (On-Device) | [@xenova/transformers](https://github.com/xenova/transformers.js) — `bert-base-multilingual-uncased-sentiment` |
| Utilities | Nodemailer (alerts), Node-cron (scheduled checks), XLSX (data processing) |

## Model Notes

Sentiment analysis runs **entirely on-device** using Transformers.js — no external API calls. The `Xenova/bert-base-multilingual-uncased-sentiment` model (~161 MB) is downloaded automatically into `node_modules/@xenova/transformers/.cache/` on first use. It is excluded from version control by `.gitignore`.

## Prerequisites

- Node.js v18+
- MongoDB (local or Atlas)
- API keys: [SerpApi](https://serpapi.com/), [Groq Cloud](https://console.groq.com/)

## Setup

1. Clone the repo:
   ```bash
   git clone https://github.com/Chinmay-url/ShopSmart.git
   cd ShopSmart
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file (see `.env` or `.env.sample`):
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/shopsmart
   JWT_SECRET=your_jwt_secret
   SERP_API_KEY=your_serpapi_key
   GROQ_API_KEY=your_groq_api_key
   EMAIL_USER=your_email@gmail.com
   EMAIL_PASS=your_app_password
   ```

4. Start both server and client:
   ```bash
   npm run dev
   ```
   Server: `http://localhost:5000` | Client: `http://localhost:3000`

## Project Structure

```
client/              React frontend
  src/components/    Reusable UI components
  src/pages/         Route pages
  src/context/       Auth context
server/              Express backend
  routes/            API endpoints
  models/            Mongoose schemas
  utils/             Helpers (sentiment, email scheduler, price history)
  data/price-history/ XLSX data files
```


