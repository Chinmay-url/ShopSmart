<div align="center">

# ShopSmart

### AI-Assisted Price Comparison & Market Intelligence for Indian E-Commerce

<p>
  <strong>Compare prices. Understand reviews. Track trends. Know when to buy.</strong>
</p>

<p>
  <a href="https://serpapi.com/">
    <img src="https://img.shields.io/badge/Powered%20by-SerpApi-4568e4" alt="Powered by SerpApi">
  </a>
  <img src="https://img.shields.io/badge/Track-Commerce%20%26%20Market%20Intelligence-orange" alt="Hackathon Track">
  <img src="https://img.shields.io/badge/Stack-MERN-green" alt="MERN Stack">
  <img src="https://img.shields.io/badge/License-MIT-green" alt="MIT License">
</p>

</div>

---

## Overview

**ShopSmart** is a full-stack shopping intelligence platform designed for Indian e-commerce.

Instead of simply showing search results or sorting products by price, ShopSmart combines **live shopping data, price history, review analysis, merchant comparison, and buying signals** to help users understand:

> **Is this a good product, is this a good price, and is now a good time to buy?**

ShopSmart uses **SerpApi as its core source of live shopping and product-review data**. The retrieved data powers the platform's comparison, analysis, recommendation, and price-alert features.

---

## The Problem

Online shopping in India is highly fragmented. The same product can have significantly different prices across merchants, while prices and promotions can change frequently.

At the same time:

* A discount percentage does not necessarily tell you whether the current price is actually good.
* A high average rating can hide recurring complaints about specific product aspects.
* Comparing multiple merchants manually is time-consuming.
* Historical prices are often separated from the current shopping experience.
* Users usually have to decide for themselves whether they should buy now or wait.

ShopSmart brings these signals together in one place.

---

## The Solution

ShopSmart retrieves current Google Shopping data through **SerpApi** and applies additional analysis to turn raw marketplace results into useful purchasing intelligence.

The platform can:

* Compare offers across multiple merchants.
* Track product prices over time.
* Analyze whether a discount appears genuine based on historical prices.
* Analyze real user reviews using sentiment and aspect-based analysis.
* Evaluate review credibility.
* Compare value across competing offers.
* Generate explainable buying recommendations.
* Monitor prices and send alerts when a target price is reached.
* Provide an AI-powered shopping assistant.

---

# Key Features

| Feature                             | Description                                                                                                         |
| ----------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| **Multi-Store Product Search**      | Retrieves current Google Shopping results across Indian merchants and normalizes them into a comparable format.     |
| **Price Comparison**                | Compares merchant price, previous price, discount, rating, review count, and seller information.                    |
| **Price History**                   | Tracks historical prices and displays interactive trends using Recharts.                                            |
| **Price Integrity Analysis**        | Detects potential price inflation before a promotional discount.                                                    |
| **Store Disparity Analysis**        | Identifies unusual differences between store-level ratings and overall product consensus.                           |
| **Sentiment Analysis**              | Uses a local multilingual BERT model to classify reviews as positive, neutral, or negative.                         |
| **Aspect-Based Sentiment**          | Extracts opinions about specific aspects such as battery, build quality, delivery, and price.                       |
| **Review Credibility Scoring**      | Identifies suspicious or unusually uniform review patterns.                                                         |
| **Value-for-Money Index**           | Evaluates a product against competing offers rather than using an absolute score.                                   |
| **AI Buying Recommendations**       | Combines price, review, historical, and merchant signals into a buy/wait/avoid recommendation.                      |
| **Price Alerts**                    | Monitors tracked products and sends email notifications when target prices are reached.                             |
| **Rupees AI Chatbot**               | Provides conversational shopping assistance using Groq.                                                             |
| **Authentication & Saved Products** | JWT-based authentication, OTP verification, and saved-product management.                                           |
| **Offline Price Dataset**           | Includes pre-collected XLSX price-history data so historical analysis is available without requiring a live search. |

---

# SerpApi Integration

## SerpApi is a Core Data Source

SerpApi is not a cosmetic integration in ShopSmart.

It is a **core part of the application's data pipeline**, with multiple features depending directly on SerpApi's live shopping and product-review data.

### SerpApi Engines Used

| SerpApi Engine             | Purpose                                                                                                             | Implementation                        |
| -------------------------- | ------------------------------------------------------------------------------------------------------------------- | ------------------------------------- |
| `google_shopping`          | Product listings, current prices, previous prices, merchants, ratings, review counts, thumbnails, and product links | `server/routes/search.js`             |
| `google_shopping`          | Finds a product's `immersive_product_page_token`                                                                    | `server/routes/reviews.js`            |
| `google_immersive_product` | Retrieves product details, specifications, merchant offers, and user reviews                                        | `server/routes/reviews.js`            |
| `google_shopping`          | Re-checks current prices for price alerts                                                                           | `server/routes/alerts.js`             |
| `google_shopping`          | Performs scheduled price checks for tracked products                                                                | `server/utils/priceAlertScheduler.js` |

## Two-Stage Product & Review Retrieval

A standard Google Shopping search provides enough information for product and price comparison, but deeper review analysis requires additional product information.

ShopSmart therefore uses a two-stage SerpApi workflow:

```text
User Search
     │
     ▼
google_shopping
     │
     ├── Product ID
     ├── Price
     ├── Merchant
     ├── Rating
     └── immersive_product_page_token
                 │
                 ▼
       google_immersive_product
                 │
                 ├── Product specifications
                 ├── Merchant offers
                 └── User review text
                 │
                 ▼
       ShopSmart Analysis Layer
```

This allows ShopSmart to perform sentiment and review analysis on **actual retrieved review text**, rather than attempting to infer review sentiment from star ratings alone.

---

## SerpApi Data Flow

```text
                    User
                     │
                     ▼
              ShopSmart Frontend
                 (React)
                     │
                     ▼
              Express Backend
                     │
                     ▼
                  SerpApi
                     │
          ┌──────────┴──────────┐
          ▼                     ▼
   google_shopping     google_immersive_product
          │                     │
          ▼                     ▼
 Products / Prices       Specs / Offers / Reviews
          │                     │
          └──────────┬──────────┘
                     ▼
              Analysis Layer
                     │
       ┌─────────────┼─────────────┐
       ▼             ▼             ▼
 Price Analysis   Review AI    Store Analysis
       │             │             │
       └─────────────┼─────────────┘
                     ▼
              ShopSmart Insights
                     │
       ┌─────────────┼─────────────┐
       ▼             ▼             ▼
  Comparison     Price History   Recommendation
```

---

## Data Used from SerpApi

ShopSmart consumes information such as:

* Product title
* Product ID
* Product links
* Merchant/source
* Current price
* Previous price
* Discount information
* Product rating
* Review count
* Product thumbnails
* Product position
* Multiple-source information
* Product-page token
* Product details
* Merchant offers
* User reviews

---

# How ShopSmart Works

### Product Search

A user enters a product query.

```text
GET /search?query=<product>
```

The backend queries SerpApi's `google_shopping` engine and normalizes the returned shopping results.

The results are then used for:

* merchant comparison
* price comparison
* product discovery
* price-history logging

---

### Product Analysis

When a user opens a product, ShopSmart retrieves deeper product information and reviews through the two-stage SerpApi workflow.

The analysis layer then evaluates:

1. Price integrity
2. Store disparity
3. Buying recommendation
4. Aspect-based sentiment
5. Review credibility
6. Value-for-money

---

### Local Sentiment Analysis

Review sentiment is processed locally using:

**Transformers.js + `Xenova/bert-base-multilingual-uncased-sentiment`**

The model runs inside the application process, meaning review text does not need to be sent to an external AI service for sentiment scoring.

---

### Price Alerts

Users can create price alerts for tracked products.

The scheduler periodically re-checks prices through SerpApi:

```text
Tracked Product
      ↓
Scheduled Check
      ↓
SerpApi Google Shopping
      ↓
Current Price
      ↓
Compare with Target
      ↓
Target Reached?
   ↙         ↘
 YES          NO
  ↓            ↓
Email        Continue
Alert         Monitoring
```

The scheduler performs checks twice daily, while users can also trigger an immediate check.

---

# Tech Stack

### Frontend

* React 18
* React Router 6
* Tailwind CSS
* Recharts
* Framer Motion
* Lucide React
* Axios
* Barba.js

### Backend

* Node.js
* Express 4
* Mongoose 7
* Node-cron
* Nodemailer
* dotenv

### Database & Data

* MongoDB
* XLSX price-history datasets

### Search & AI

* **SerpApi** — live shopping and product-review data
* **Groq API** — conversational shopping assistant
* **Transformers.js** — local review sentiment analysis
* **Multilingual BERT** — sentiment classification

---

# Project Structure

```text
ShopSmart/
│
├── client/
│   ├── public/
│   └── src/
│       ├── components/
│       ├── context/
│       ├── lib/
│       └── pages/
│
├── server/
│   ├── data/
│   │   └── price-history/
│   ├── middleware/
│   ├── models/
│   ├── routes/
│   ├── utils/
│   │   ├── researchAI.js
│   │   ├── sentiment.js
│   │   ├── priceHistory.js
│   │   ├── categoryPriceHistory.js
│   │   ├── storePriceHistory.js
│   │   ├── priceAlertScheduler.js
│   │   └── emailService.js
│   └── server.js
│
├── docs/
│   └── screenshots/
│
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

---

# Getting Started

## Prerequisites

* Node.js 18 or higher
* MongoDB — local installation or MongoDB Atlas
* SerpApi API key
* Optional: Groq API key
* Optional: Gmail App Password for email alerts

---

## 1. Clone the Repository

```bash
git clone https://github.com/Chinmay-url/ShopSmart.git
cd ShopSmart
```

## 2. Install Dependencies

```bash
npm run install-all
```

## 3. Configure Environment Variables

Create a `.env` file from the provided template:

### macOS / Linux

```bash
cp .env.example .env
```

### Windows

```powershell
copy .env.example .env
```

Then configure the required values:

```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/shopsmart
JWT_SECRET=your_jwt_secret
SERP_API_KEY=your_serpapi_key

# Optional
GROQ_API_KEY=your_groq_api_key
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

**Never commit your `.env` file or API keys to GitHub.**

---

## 4. Start the Application

```bash
npm run dev
```

The application runs at:

| Service      | URL                                |
| ------------ | ---------------------------------- |
| Frontend     | `http://localhost:3000`            |
| Backend      | `http://localhost:5000`            |
| Health Check | `http://localhost:5000/api/health` |

You can also run the services separately:

```bash
npm run server
npm run client
```

---

# Environment Variables

| Variable       | Required | Purpose                                               |
| -------------- | -------- | ----------------------------------------------------- |
| `SERP_API_KEY` | **Yes**  | Core source for live shopping and product-review data |
| `MONGODB_URI`  | **Yes**  | MongoDB connection string                             |
| `JWT_SECRET`   | **Yes**  | Signs authentication tokens                           |
| `PORT`         | No       | Backend port; defaults to `5000`                      |
| `NODE_ENV`     | No       | Node environment                                      |
| `GROQ_API_KEY` | No       | Powers the Rupees AI chatbot                          |
| `EMAIL_USER`   | No       | Gmail account used for price alerts                   |
| `EMAIL_PASS`   | No       | Gmail App Password used for email alerts              |

Generate a strong JWT secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

---

# API Overview

| Method   | Endpoint                      | Purpose                        |
| -------- | ----------------------------- | ------------------------------ |
| `GET`    | `/search?query=`              | SerpApi Google Shopping search |
| `GET`    | `/reviews?product_id=`        | Product reviews and analysis   |
| `GET`    | `/price-history`              | Price-history data             |
| `GET`    | `/price-history/:productName` | Product-specific price history |
| `GET`    | `/price-history/stores`       | Store-specific price history   |
| `GET`    | `/products/:productId`        | Product details                |
| `POST`   | `/products/save`              | Save a product                 |
| `GET`    | `/products/saved`             | Retrieve saved products        |
| `POST`   | `/alerts`                     | Create a price alert           |
| `GET`    | `/alerts`                     | Retrieve price alerts          |
| `PATCH`  | `/alerts/:id/toggle`          | Enable/disable an alert        |
| `DELETE` | `/alerts/:id`                 | Delete an alert                |
| `POST`   | `/alerts/:id/check-now`       | Immediately check a price      |
| `POST`   | `/chat`                       | Rupees AI shopping assistant   |
| `POST`   | `/auth/send-otp`              | Send authentication OTP        |
| `POST`   | `/auth/verify-otp`            | Verify OTP                     |
| `POST`   | `/auth/signup`                | Register user                  |
| `POST`   | `/auth/login`                 | Login                          |
| `GET`    | `/auth/me`                    | Retrieve current user          |

---

# AI & Development Tools

### AI / Data Tools

* **SerpApi** — live Google Shopping, immersive product data, and review retrieval
* **Groq API** — powers the Rupees shopping chatbot
* **Transformers.js** — local sentiment inference
* **Xenova multilingual BERT** — review sentiment classification

### Development Assistance

* **Cursor**
* **Claude**

AI-assisted development was used for code writing, refactoring, debugging, and development support.

The analytical logic in `server/utils/researchAI.js` is implemented as deterministic, explainable logic. The recommendation output can therefore be traced back to the underlying price, merchant, historical, and review signals used by the system.

---

# Screenshots

Screenshots are available in the `docs/` directory.

Recommended views:

* Home
* Search Results
* Product Details
* Price History
* Review & Sentiment Analysis
* Price Alerts

---

# Future Improvements

* Cache SerpApi responses to reduce repeated API usage.
* Move price history from XLSX files to a dedicated time-series data store.
* Add a browser extension for in-page price comparison.
* Expand product discovery with additional SerpApi engines.
* Add local-pickup pricing and location-aware shopping information.
* Add mobile push notifications through a PWA.
* Add multi-currency and region-aware search.
* Explore personalized price forecasting.

# License

This project is licensed under the **MIT License**.

See [`LICENSE`](LICENSE) for details.
