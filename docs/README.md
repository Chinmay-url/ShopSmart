# Screenshots

The main `README.md` embeds the images below. They are **not** committed yet —
capture them locally and drop them into this folder, then `git add docs/`.

## Required filenames

| File | What to capture |
| --- | --- |
| `home.png` | Home / landing page with the search bar |
| `search-results.png` | `Results` page after searching a product — show the price comparison cards across multiple stores |
| `product-details.png` | `ProductDetails` page — SerpApi product info, merchant list, specs |
| `price-history.png` | `PriceHistory` page — the Recharts price-trend graph |
| `sentiment.png` | The sentiment / review-credibility panel on `ProductDetails` (star breakdown + ABSA aspects) |
| `price-alerts.png` | `PriceAlerts` page — a created alert with its target price |
| `chatbot.png` | The "Rupees" chatbot panel mid-conversation |

Six or seven is the sweet spot. Do not add more than that.

## How to capture

1. Start the app:

   ```bash
   npm run install-all
   npm run dev
   ```

2. Open `http://localhost:3000`.
3. Walk through the flow: search a product -> open a result -> view price
   history -> set an alert -> open the chatbot.
4. Capture with a screenshot tool (Win+Shift+S on Windows, Cmd+Shift+4 on macOS).
5. Save into this `docs/` folder using the exact filenames above.
6. Crop tightly, keep file size reasonable, and **blur or avoid** anything
   containing a real API key, email address, or `.env` content.

## Note on the bundled price-history data

`server/data/price-history/` contains ~110 pre-collected XLSX price-history
files across categories and individual stores. The `PriceHistory` page renders
straight from these, so the price-history screenshot works even before you have
generated new history through live searches.
