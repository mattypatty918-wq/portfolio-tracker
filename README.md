# Portfolio Tracker

A multi-asset investment portfolio dashboard with real-time P&L, allocation tracking, and persistent storage.

## Features

- **Dashboard**: Total value, cost basis, P&L with percentage, and asset allocation breakdown
- **Holdings Management**: Add/edit/delete positions across stocks, crypto, ETFs, and bonds
- **Real-time Calculations**: Automatic gain/loss tracking based on current prices
- **Persistent Storage**: JSON-based backend with Node.js filesystem persistence
- **Responsive Design**: Works on desktop and mobile with full functionality

## Project Structure

```
src/
  main.tsx          # Entry point
  App.tsx           # Main app container with tab navigation
  styles.css        # Complete CSS styling
  components/
    Dashboard.tsx   # Portfolio metrics and allocation view
    Holdings.tsx    # Position management and table
    Watchlist.tsx   # Placeholder for watchlist feature

routes/
  portfolio.ts      # Backend CRUD routes (GET, POST, PUT, DELETE)
```

## Architecture

### Frontend
- Built with Preact and TypeScript
- Three main tabs: Dashboard, Holdings, Watchlist
- Real-time calculations for P&L and allocations
- Toast notifications for all user actions

### Backend
- Node.js Express-style route handlers in `/routes/portfolio.ts`
- Persistent JSON storage in workspace `data/portfolio/` directory
- Support for multiple resources: holdings, transactions, watchlist, snapshots
- RESTful API via `/v1/x/portfolio?resource=<type>`

## API Routes

All routes are accessed via `window.vellum.fetch('/v1/x/portfolio?resource=<resource>')`

### Holdings
- `GET ?resource=holdings` - Fetch all positions
- `POST ?resource=holdings` - Add new position
- `PUT ?resource=holdings&id=<id>` - Update position
- `DELETE ?resource=holdings&id=<id>` - Delete position

### Watchlist
- `GET ?resource=watchlist` - Fetch watchlist
- `POST ?resource=watchlist` - Add to watchlist
- `DELETE ?resource=watchlist&id=<id>` - Remove from watchlist

### Transactions & Snapshots
- `GET ?resource=transactions` - Fetch transaction history
- `POST ?resource=transactions` - Log transaction
- `GET ?resource=snapshots` - Fetch portfolio snapshots
- `POST ?resource=snapshots` - Record portfolio snapshot

## Data Schema

### Holdings
```typescript
{
  id: string;
  symbol: string;           // e.g. "AAPL", "BTC"
  assetType: "stock" | "crypto" | "etf" | "bond";
  quantity: number;
  avgCost: number;         // Entry price per unit
  currentPrice: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}
```

## Development

To use this in the Vellum assistant:

1. Copy the entire repo contents into your project
2. Ensure the backend route is in `/routes/portfolio.ts`
3. The frontend will automatically fetch from `/v1/x/portfolio`
4. Data persists to `data/portfolio/` in the workspace

## Features Coming Soon

- Watchlist with price alerts
- Historical performance charts
- Transaction logging and analysis
- Portfolio benchmarking
- CSV export
- Mobile app version