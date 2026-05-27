<div align="center">

# ShopSmart

**AI-assisted price comparison and market intelligence for Indian e-commerce**

[![SerpApi](https://img.shields.io/badge/Powered%20by-SerpApi-4568e4)](https://serpapi.com)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

</div>

---

## Problem

Buying online in India is fragmented. The same pair of headphones can be ₹7,499
on one store and ₹5,299 on another, and by the time you have opened eight tabs
and discovered the difference, the price has already changed. On top of that:

- **Prices move constantly.** A "30% off" badge is meaningless if the price was
  inflated a week earlier to make the discount look real.
- **Reviews are not trustworthy at a glance.** A product can show a 4.3-star
  average while the actual complaints cluster around one specific flaw.
- **Nobody tells you when to buy.** Price tracking tools usually show you a
  chart after the fact, not an alert that says "this is the good moment."

ShopSmart exists to answer one question: **is now a good time to buy this, and
from where?**

## Solution

ShopSmart pulls live Google Shopping data through **SerpApi**, then layers real
analysis on top of the raw listings instead of just sorting them by price:

- Compares every merchant for a product side by side, not just the cheapest hit.
- Keeps a **price history** per product and per store, so a "discount" can be
  checked against the real trajectory.
- Flags **deceptive pricing** — when a store raised the price right before a sale.
- Runs **aspect-based sentiment analysis** on real user reviews to surface
  recurring complaints and praises, not just an average star rating.
- Generates a plain-English **buy / wait / avoid recommendation**.
- Sends **email alerts** when a tracked product crosses your target price.

## Key Features

| Feature | What it does |
| --- | --- |
| **Multi-store product search** | Live Google Shopping results across Indian merchants, normalised into one comparable shape |
| **Price comparison** | Every store for a product in one view — price, discount %, rating, review count, seller |
| **Price history** | Per-product and per-store historical series, charts rendered with Recharts |
| **Price integrity analysis** | Detects "pump and dump" inflation before a fake sale |
| **Store disparity analysis** | Flags stores whose ratings diverge sharply from the product's overall consensus |
| **Sentiment analysis** | A local BERT model scores each review positive / neutral / negative |
| **Aspect-Based Sentiment (ABSA)** | Breaks sentiment down by aspect (battery, build, delivery…) so specific flaws surface |
| **Review credibility scoring** | Weights reviews to discount suspiciously uniform praise |
| **Value-for-Money index** | Scores a product against its own competing offers, not an absolute scale |
| **AI buying recommendations** | Synthesises the above into a single verdict |
| **Price alerts** | Cron-scheduled checks twice daily + on-demand checks, with email notification |
| **"Rupees" AI chatbot** | Groq-powered shopping assistant that can search and compare inside the conversation |
| **Auth & saved products** | JWT auth with OTP verification, plus a saved-products list |
| **Offline dataset** | ~110 pre-collected XLSX price-history files so the app is useful before any live query |

## SerpApi Integration

SerpApi is the **core data source** for ShopSmart. Nearly every intelligent
feature in the product is downstream of it.

### What SerpApi provides

| SerpApi engine | Used for | Where in the code |
| --- | --- | --- |
| `google_shopping` | Product listings, current price, old price, merchant, rating, review count, thumbnails, product links | `server/routes/search.js` |
| `google_shopping` | Locating a product's `immersive_product_page_token` | `server/routes/reviews.js` |
| `google_immersive_product` | Full product detail, specifications, merchant offers, and raw user reviews | `server/routes/reviews.js` |
| `google_shopping` | Re-checking live price when evaluating a price alert | `server/routes/alerts.js` |
| `google_shopping` | Scheduled twice-daily price re-check per tracked product | `server/utils/priceAlertScheduler.js` |

### Why two SerpApi engines

A plain `google_shopping` query returns enough to build a comparison table, but
not enough to analyse reviews. ShopSmart therefore makes a **two-stage call**:

1. Query `google_shopping` for the search term and match the requested
   `product_id` to obtain its `immersive_product_page_token`.
2. Feed that token into `google_immersive_product` to get the deep product page,
   including real user review text.

This is what makes genuine sentiment analysis possible rather than faking it from
a star rating.

### Data flow

```text
User types a query
        |
        v
ShopSmart Frontend (React)
        |
        v
Backend API (Express)
        |
        +--> google_shopping  ---------> listings, prices, merchants, ratings
        |
        +--> google_immersive_product -> specs, offers, user review text
        |
        v
SerpApi  ->  Google Shopping
        |
        v
Data processing layer
  - normalise price / extracted_old_price / discount %
  - append each result to per-store XLSX price history
  - local BERT sentiment on every review
  - ABSA by aspect
  - review credibility weighting
  - price-integrity + store-disparity checks
        |
        v
ShopSmart recommendation  ->  comparison table, charts, buy/wait verdict
```

### Fields ShopSmart consumes from SerpApi

`shopping_results[]` → `title`, `product_id`, `product_link`, `link`,
`serpapi_link`, `serpapi_thumbnail`, `thumbnail`, `source`, `source_icon`,
`extracted_price`, `extracted_old_price`, `price`, `rating`, `reviews`,
`position`, `tag`, `extensions`, `multiple_sources`, `second_hand_condition`,
`immersive_product_page_token`

`product_results` → full product detail, `user_reviews[]`, merchant offers

### Graceful degradation

- No `SERP_API_KEY` → search and reviews fail cleanly with an HTTP error; the
  offline price-history pages still work.
- No `GROQ_API_KEY` → the chatbot route returns `503` with a clear message and
  the rest of the app is unaffected.
- No `EMAIL_USER` / `EMAIL_PASS` → the alert scheduler logs a warning and skips
  sending instead of crashing.

## How It Works

### Request lifecycle for a product page

1. `GET /search?query=...` hits `google_shopping` and normalises every result
   into a common shape (numeric price, old price, computed discount %, store,
   rating, links).
2. The first 20 results are written to per-store XLSX files via
   `logProductPriceToStore`, so history accumulates automatically as people
   search.
3. `GET /reviews?product_id=...` performs the two-stage SerpApi lookup described
   above, then enriches the payload with six analyses from `server/utils/researchAI.js`:
   - `analyzePriceIntegrity` — deceptive-pricing detection
   - `analyzeStoreDisparity` — outlier store detection
   - `generateAIRecommendation` — synthesised buy/wait/avoid verdict
   - `analyzeAspects` — aspect-level sentiment
   - `analyzeReviewCredibility` — review weighting
   - `calculateVFMIndex` — value-for-money against competing offers
4. Reviews are scored locally by a multilingual BERT sentiment model
   (`@xenova/transformers`), running fully in-process — no review text is sent
   to a third-party AI service.

### Price alerts

`server/utils/priceAlertScheduler.js` registers a `node-cron` job at
`0 0,12 * * *` (twice daily). It re-queries SerpApi for each active alert,
compares the live price to the user's target, and emails on a match.
`POST /alerts/:id/check-now` runs the same check on demand.

## Tech Stack

**Frontend** — React 18, React Router 6, Tailwind CSS, Recharts, Framer Motion,
Lucide React, Axios, Barba.js page transitions

**Backend** — Node.js, Express 4, Mongoose 7, node-cron, Nodemailer, dotenv

**Data & AI** — MongoDB (users, alerts, saved products), SerpApi (live shopping
data), Groq API (chatbot), Transformers.js + multilingual BERT (local sentiment
analysis), XLSX (price-history store)

## Project Structure

```text
shopsmart-main/
|-- client/                        # React frontend
|   |-- public/                    # static assets
|   `-- src/
|       |-- components/            # Navbar, Footer, PrivateRoute
|       |   `-- chatbot/           # Rupees chatbot UI
|       |-- context/               # AuthContext
|       |-- lib/                   # shared utilities
|       `-- pages/                 # Home, Results, ProductDetails,
|                                  # PriceHistory, PriceAlerts, Profile,
|                                  # Login, Signup, About, Contact
|
|-- server/                        # Express backend
|   |-- data/price-history/        # ~110 XLSX history files (per-store)
|   |-- middleware/                # JWT auth guard
|   |-- models/                    # User, PriceAlert
|   |-- routes/                    # auth, search, products, priceHistory,
|   |                              # alerts, reviews, chat
|   |-- utils/
|   |   |-- researchAI.js          # 6 explainable analysis functions
|   |   |-- sentiment.js           # local BERT sentiment pipeline
|   |   |-- priceHistory.js        # history reads + statistics
|   |   |-- categoryPriceHistory.js
|   |   |-- storePriceHistory.js   # per-store XLSX writer
|   |   |-- priceAlertScheduler.js # node-cron job
|   |   `-- emailService.js        # Nodemailer transport
|   `-- server.js                  # entry point
|
|-- docs/                          # screenshots
|-- .env.example                   # environment variable template
`-- package.json
```

## Installation

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher (tested on v18/v20)
- [MongoDB](https://www.mongodb.com/) — local install or a free Atlas cluster
- A free [SerpApi](https://serpapi.com/) API key (about 100 free searches/month)
- Optional: a [Groq](https://console.groq.com/) API key for the chatbot
- Optional: a Gmail **App Password** for price-alert emails

### Steps

```bash
git clone https://github.com/Chinmay-url/shopsmart.git
cd shopsmart

# install server + client dependencies
npm run install-all

# create your environment file
cp .env.example .env        # macOS / Linux
# copy .env.example .env    # Windows

# then edit .env and fill in your keys
```

## Environment Variables

| Variable | Required | Default | Purpose |
| --- | --- | --- | --- |
| `SERP_API_KEY` | **Yes** | — | SerpApi key. Core data source for all live shopping data. |
| `MONGODB_URI` | **Yes** | — | MongoDB connection string. |
| `JWT_SECRET` | **Yes** | — | Signs auth tokens. Use a long random string. |
| `PORT` | No | `5000` | Express server port. |
| `NODE_ENV` | No | `development` | Node environment. |
| `GROQ_API_KEY` | No | — | Groq key. Without it the chatbot returns 503; everything else works. |
| `EMAIL_USER` | No | — | Gmail address for price alerts. |
| `EMAIL_PASS` | No | — | Gmail **App Password** (not your normal password). |

Generate a strong JWT secret with:

```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

`.env` is git-ignored. Only `.env.example` (a value-free template) is committed.

## Running the Project

```bash
# development: runs server and client together
npm run dev
```

| Service | URL |
| --- | --- |
| Frontend | http://localhost:3000 |
| Backend API | http://localhost:5000 |
| Health check | http://localhost:5000/api/health |

Run them separately if you prefer:

```bash
npm run server    # nodemon on :5000
npm run client    # CRA dev server on :3000
```

Client requests are proxied to the backend via the `proxy` field in
`client/package.json`, so no client-side environment variable is needed.

Production build of the frontend:

```bash
npm run build
```

### API reference

| Method | Endpoint | Description |
| --- | --- | --- |
| `GET` | `/search?query=` | SerpApi `google_shopping` search |
| `GET` | `/reviews?product_id=` or `?q=` | SerpApi immersive product + AI analysis |
| `GET` | `/price-history` | All history series |
| `GET` | `/price-history/:productName` | History for one product |
| `GET` | `/price-history/stores` | History broken down per store |
| `GET` | `/products/:productId` | Single product detail |
| `POST` | `/products/save` | Save a product *(auth)* |
| `GET` | `/products/saved` | List saved products *(auth)* |
| `DELETE` | `/products/saved/:productId` | Remove a saved product *(auth)* |
| `POST` | `/auth/send-otp` | Request login OTP |
| `POST` | `/auth/verify-otp` | Verify OTP and issue JWT |
| `POST` | `/auth/signup` | Register |
| `POST` | `/auth/login` | Email + password login |
| `GET` | `/auth/me` | Current user *(auth)* |
| `POST` | `/alerts` | Create a price alert *(auth)* |
| `GET` | `/alerts` | List alerts *(auth)* |
| `PATCH` | `/alerts/:id/toggle` | Enable/disable an alert *(auth)* |
| `DELETE` | `/alerts/:id` | Delete an alert *(auth)* |
| `POST` | `/alerts/:id/check-now` | Re-check price immediately *(auth)* |
| `POST` | `/chat` | Rupees chatbot (Groq) |

## AI Tools Used

- **SerpApi** — live Google Shopping, immersive product pages, and user review
  retrieval. The backbone of the product.
- **Groq API** — powers the "Rupees" shopping chatbot.
- **Transformers.js (`@xenova/transformers`)** with
  `Xenova/bert-base-multilingual-uncased-sentiment` — in-process sentiment
  scoring. Runs locally, so review text never leaves the machine.
- **Cursor / Claude-assisted development** — used for code writing, refactoring,
  and debugging during the build.

The analytical layer in `server/utils/researchAI.js` is **deterministic
explainable logic**, not a black box: every recommendation can be traced back to
the specific price, store, or review signals that produced it. That is a
deliberate choice — for a buying decision, "why" matters as much as "what".

## Screenshots

<!-- Drop the images listed in docs/README.md into docs/ to activate these. -->

| | |
| --- | --- |
| ![Home](docs/home.png) | ![Search results](docs/search-results.png) |
| ![Product details](docs/product-details.png) | ![Price history](docs/price-history.png) |
| ![Sentiment analysis](docs/sentiment.png) | ![Price alerts](docs/price-alerts.png) |

See [`docs/README.md`](docs/README.md) for the capture guide.

## Future Improvements

- Cache SerpApi responses in MongoDB to cut API usage and speed up repeat searches
- Switch price history from XLSX to a proper time-series store
- Add a browser extension for in-page price comparison
- Expand beyond `google_shopping` to SerpApi's `google_play_apps` and
  `google_maps` for local pickup pricing
- Push alerts to mobile via a PWA instead of email only
- Multi-currency support and region-aware `google_domain` selection
- Personalised price forecasts instead of purely historical charts

## Notes for Judges

This is an **existing project** that predates the hackathon and was submitted as
an improvement entry. Git history has been left intact and reflects the project's
real development timeline.

## License

[MIT](LICENSE)
