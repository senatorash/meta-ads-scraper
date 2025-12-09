# Meta Ads Library Scraper

A high-performance **Node.js + TypeScript** system for scraping, storing, and incrementally syncing ads from the **Meta (Facebook) Ads Library**.

---

# Overview

This project provides a reliable scraping framework that:

- Scrapes ads from any **Meta Ads Library URL**
- Stores ads in folder‑organized **JSON databases**
- Supports **incremental syncing** to fetch only new or changed ads
- Uses **Puppeteer** to capture Meta’s internal GraphQL API responses
- Provides **unit tests** to detect API changes or malformed data

This system is designed to be scalable, maintainable, and production‑ready.

---

# Features

### 1. Initial Sync — `initialSync(url, max?)`

Fetches **all ads** (active + inactive) from any Meta Ads Library page.

- Uses Puppeteer to intercept GraphQL responses
- Extracts normalized ad data
- Saves ads into a folder named after the `page_id`
- Stores:
  - `ads.json`
  - `meta.json` (with timestamps such as `last_synced`)
- Optional `max` to limit number of ads

---

### 🔄 2. Incremental Sync — `incrementalSync(pageId)`

Fetches **only updated or newly created ads**.

- Detects changes in:
  - `is_active`
  - `end_date`
  - Creative changes
  - Any field in the GraphQL payload
- Updates `ads.json` without duplicating entries
- Updates `meta.json` to reflect new sync time

---

### 🧪 3. Unit Tests

Included tests verify:

#### ✔ Incremental sync correctness

- New ads detected correctly
- Updated ads merged without corruption
- No duplicates
- Meta file updated correctly

#### ✔ JSON integrity

- `ads.json` and `meta.json` never malformed
- No empty or corrupted JSON
- Folder structure is always valid

---

# Project Structure

```
meta-ads-scraper/
│
├── src/
│   ├── scr/
│   │    ├── browser/
│   │    ├── sync/
│   │    ├── parser/
│   │    ├── fetchAds.ts
│   │    └── initialSync.ts
│   ├── db/
│   │    ├── saveAd.ts
│   │    ├── readAds.ts
│   │    └── meta.ts
│   ├── interfaces/
│   │    └── ads.ts
│   └── index.ts
│
├── database/
│   └── {pageId}/ads.json
│   └── {pageId}/meta.json
│
├── tests/
│   ├── incrementalSync.test.ts
│   └── jsonIntegrity.test.ts
│
├── tsconfig.json
├── package.json
└── README.md
```

---

# Installation

### 1. Clone the repo

```sh
git clone https://github.com/senatorash/meta-ads-scraper.git
cd meta-ads-scraper
```

### 2. Install dependencies

```sh
npm install
```

### 3. Run the build

```sh
npm run dev
```

### 4. Run tests

```sh
npm run test
```

---

# ▶ Usage Examples

## 🔹 Initial Sync

Scrape all ads from any page:

````ts
npm run dev -- initialSync "https://www.facebook.com/ads/library/?active_status=all&ad_type=all&country=ALL&view_all_page_id=282592881929497" 200


---

## 🔹 Incremental Sync

Fetch new + updated ads without re-scraping everything:

```ts
npm run dev -- incrementalSync "282592881929497"

````

---

# JSON Storage Format

### ads.json

```json
[
  {
    "data": {
      "ad_library_main": {
        "search_results_connection": {
          "edges": [
            {
              "node": {
                "collated_results": [
                  {
                    "ad_id": "434343",
                    "ad_archive_id": "1234567890",
                    "collation_id": "2837461827364",
                    "page_id": "0987654321",
                    "snapshot": {
                      "body": {
                        "text": "This is a sample ad text for testing purposes."
                      },
                      "cards": [
                        {
                          "original_image_url": "https://example.com/image.jpg"
                        }
                      ]
                    },

                    "is_active": true,
                    "start_date": 48754878454,
                    "end_date": 78084795884
                  }
                ]
              }
            }
          ]
        }
      }
    }
  },
  {
    "data": {
      "ad_library_main": {
        "search_results_connection": {
          "edges": [
            {
              "node": {
                "collated_results": [
                  {
                    "ad_id": "434343",
                    "ad_archive_id": "1234567890",
                    "collation_id": "2837461827364",
                    "page_id": "0987654321",
                    "snapshot": {
                      "body": {
                        "text": "This is a sample ad text for testing purposes."
                      },
                      "cards": [
                        {
                          "original_image_url": "https://example.com/image.jpg"
                        }
                      ]
                    },

                    "is_active": true,
                    "start_date": 48754878454,
                    "end_date": 78084795884
                  }
                ]
              }
            }
          ]
        }
      }
    }
  }
]
```

### meta.json

```json
{
  "page_id": "282592881929497",
  "source_url": "https://web.facebook.com/ads/library/?active_status=active&ad_type=all&country=ALL&is_targeted_country=false&media_type=all&search_type=page&view_all_page_id=282592881929497",
  "last_synced": "2025-12-08T23:06:24.817Z",
  "last_ad_count": 110
}
```

---

# 👨‍🔬 Testing Strategy

### ✔ API Change Detection

If Meta modifies their GraphQL responses, tests will fail — alerting you to update the scraper.

### ✔ No corrupted files

Tests ensure JSON files are always valid, correctly structured, and non‑empty.

---

# 🤝 Contributing

Pull requests are welcome.  
If you need help implementing additional features, feel free to ask!

---
