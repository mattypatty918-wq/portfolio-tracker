# Portfolio Tracker API Documentation

## Base URL
```
https://api.portfolio-tracker.dev/v1/x
```

## Authentication
All endpoints require a bearer token (when deployed with auth):
```
Authorization: Bearer YOUR_API_KEY
```

---

## Endpoints

### Holdings

#### GET /portfolio?resource=holdings
Fetch all holdings

**Response:**
```json
[
  {
    "id": "uuid",
    "symbol": "AAPL",
    "assetType": "stock",
    "quantity": 10,
    "avgCost": 150.00,
    "currentPrice": 175.00,
    "notes": "Growth position",
    "createdAt": "2026-05-23T00:00:00Z",
    "updatedAt": "2026-05-23T06:00:00Z"
  }
]
```

#### POST /portfolio?resource=holdings
Add a new holding

**Request:**
```json
{
  "symbol": "AAPL",
  "assetType": "stock",
  "quantity": 10,
  "avgCost": 150.00,
  "currentPrice": 175.00,
  "notes": "Initial position"
}
```

#### PUT /portfolio?resource=holdings&id=UUID
Update a holding

#### DELETE /portfolio?resource=holdings&id=UUID
Delete a holding

---

### Transactions

#### GET /portfolio?resource=transactions
Fetch all transactions

**Response:**
```json
[
  {
    "id": "uuid",
    "symbol": "AAPL",
    "type": "buy",
    "quantity": 10,
    "price": 150.00,
    "date": "2026-05-20",
    "notes": "Entry position",
    "createdAt": "2026-05-23T00:00:00Z"
  }
]
```

#### POST /portfolio?resource=transactions
Record a transaction

**Request:**
```json
{
  "symbol": "AAPL",
  "type": "buy|sell|dividend",
  "quantity": 10,
  "price": 150.00,
  "date": "2026-05-20",
  "notes": "Optional notes"
}
```

---

### Watchlist

#### GET /portfolio?resource=watchlist
Fetch watchlist

#### POST /portfolio?resource=watchlist
Add to watchlist

**Request:**
```json
{
  "symbol": "TSLA",
  "assetType": "stock"
}
```

#### DELETE /portfolio?resource=watchlist&id=UUID
Remove from watchlist

---

### Snapshots

#### GET /portfolio?resource=snapshots
Fetch portfolio snapshots (daily records)

#### POST /portfolio?resource=snapshots
Create a snapshot

**Request:**
```json
{
  "totalValue": 50000,
  "totalCost": 45000,
  "gainLoss": 5000,
  "positions": [...]
}
```

---

### Advanced Analytics

#### GET /portfolio?analysis=correlation
Calculate correlation matrix between holdings

**Response:**
```json
[
  {
    "symbol": "AAPL",
    "correlations": [
      {"with": "MSFT", "correlation": 0.85},
      {"with": "GOOGL", "correlation": 0.72}
    ]
  }
]
```

#### GET /portfolio?analysis=efficientfrontier
Calculate efficient frontier points

**Response:**
```json
[
  {"volatility": 0, "return": 0},
  {"volatility": 0.05, "return": 0.02},
  {"volatility": 0.1, "return": 0.04}
]
```

#### GET /portfolio?analysis=stresstest
Stress test portfolio under scenarios

**Response:**
```json
[
  {"scenario": "Market Crash 20%", "portfolioValue": 40000, "change": "-20.00"},
  {"scenario": "Bull Market 30%", "portfolioValue": 65000, "change": "+30.00"}
]
```

---

## Error Handling

All errors follow standard HTTP status codes:

```json
{
  "error": "Invalid request",
  "message": "Detailed error message"
}
```

### Status Codes
- `200` - OK
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `404` - Not Found
- `429` - Rate Limited
- `500` - Server Error

---

## Rate Limiting

- **Limit:** 100 requests per minute per IP
- **Header:** `X-RateLimit-Remaining`
- **Reset:** `X-RateLimit-Reset`

---

## Examples

### JavaScript/Fetch
```javascript
// Get all holdings
const response = await fetch('https://api.portfolio-tracker.dev/v1/x/portfolio?resource=holdings', {
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY'
  }
});
const holdings = await response.json();

// Add a new holding
await fetch('https://api.portfolio-tracker.dev/v1/x/portfolio?resource=holdings', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer YOUR_API_KEY',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    symbol: 'AAPL',
    assetType: 'stock',
    quantity: 10,
    avgCost: 150,
    currentPrice: 175
  })
});
```

### Python/Requests
```python
import requests

headers = {'Authorization': 'Bearer YOUR_API_KEY'}

# Get holdings
response = requests.get(
  'https://api.portfolio-tracker.dev/v1/x/portfolio?resource=holdings',
  headers=headers
)
holdings = response.json()

# Add holding
requests.post(
  'https://api.portfolio-tracker.dev/v1/x/portfolio?resource=holdings',
  headers={**headers, 'Content-Type': 'application/json'},
  json={
    'symbol': 'AAPL',
    'assetType': 'stock',
    'quantity': 10,
    'avgCost': 150,
    'currentPrice': 175
  }
)
```

### cURL
```bash
# Get holdings
curl -H "Authorization: Bearer YOUR_API_KEY" \
  https://api.portfolio-tracker.dev/v1/x/portfolio?resource=holdings

# Add holding
curl -X POST \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "symbol":"AAPL",
    "assetType":"stock",
    "quantity":10,
    "avgCost":150,
    "currentPrice":175
  }' \
  https://api.portfolio-tracker.dev/v1/x/portfolio?resource=holdings
```

---

## Webhooks (Coming Soon)

Subscribe to portfolio events:
- Holdings updated
- New transactions
- Portfolio milestone reached
- Price alerts triggered

---

## Pagination (Coming Soon)

Endpoints will support pagination:
- `?limit=50&offset=0`

---

## Filtering (Coming Soon)

Advanced filtering:
- `?assetType=stock`
- `?symbol=AAPL`
- `?dateFrom=2026-01-01&dateTo=2026-05-31`

