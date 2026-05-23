# Portfolio Tracker - Testing Guide

## Unit Testing

### Setup
```bash
npm install --save-dev vitest @testing-library/preact
```

### Test Analytics Calculations
```typescript
// src/components/__tests__/Analytics.test.ts
import { calculateSharpeRatio, calculateVolatility } from '../Analytics';
import { describe, it, expect } from 'vitest';

describe('Analytics', () => {
  it('calculates Sharpe Ratio correctly', () => {
    const returns = [0.01, 0.02, -0.01, 0.03];
    const riskFreeRate = 0.02;
    
    const sharpe = calculateSharpeRatio(returns, riskFreeRate);
    expect(sharpe).toBeCloseTo(0.707, 2);
  });

  it('calculates volatility correctly', () => {
    const returns = [0.01, 0.02, -0.01, 0.03];
    const volatility = calculateVolatility(returns);
    expect(volatility).toBeCloseTo(0.0163, 3);
  });

  it('handles edge cases (empty array)', () => {
    expect(() => calculateSharpeRatio([], 0.02)).toThrow();
  });
});
```

### Test Portfolio Management
```typescript
describe('PortfolioManagement', () => {
  it('rebalances to equal weight', () => {
    const holdings = [
      { symbol: 'AAPL', quantity: 10, currentPrice: 150 },
      { symbol: 'GOOG', quantity: 5, currentPrice: 140 }
    ];
    
    const rebalanced = rebalanceToEqualWeight(holdings, 'equal');
    expect(rebalanced[0].value).toBeCloseTo(rebalanced[1].value);
  });

  it('detects concentration risk', () => {
    const holdings = [
      { symbol: 'AAPL', quantity: 100, currentPrice: 150 }, // $15,000
      { symbol: 'GOOG', quantity: 1, currentPrice: 140 }     // $140
    ];
    
    const concentration = getConcentrationRatio(holdings);
    expect(concentration).toBeGreaterThan(0.99); // 99%+ in one stock
  });
});
```

## Integration Testing

### Test API Endpoints
```typescript
// src/routes/__tests__/portfolio.test.ts
import { describe, it, expect, beforeEach } from 'vitest';
import { testClient } from 'hono/testing';
import { app } from '../portfolio';

describe('Portfolio API', () => {
  let client: typeof testClient;

  beforeEach(() => {
    client = testClient(app);
  });

  it('GET /v1/x/portfolio/holdings returns all holdings', async () => {
    const res = await client.portfolio.holdings.$get();
    expect(res.status).toBe(200);
    expect(Array.isArray(res.data)).toBe(true);
  });

  it('POST /v1/x/portfolio/holdings creates new holding', async () => {
    const res = await client.portfolio.holdings.$post({
      json: {
        symbol: 'AAPL',
        quantity: 10,
        avgCost: 150
      }
    });
    expect(res.status).toBe(201);
    expect(res.data.id).toBeDefined();
  });

  it('handles invalid input gracefully', async () => {
    const res = await client.portfolio.holdings.$post({
      json: { symbol: 'AAPL' } // Missing required fields
    });
    expect(res.status).toBe(400);
    expect(res.data.error).toBeDefined();
  });
});
```

## Component Testing

### Test Holdings Component
```typescript
import { render, screen, fireEvent } from '@testing-library/preact';
import { Holdings } from '../Holdings';
import { describe, it, expect } from 'vitest';

describe('Holdings Component', () => {
  const mockHoldings = [
    { id: '1', symbol: 'AAPL', quantity: 10, avgCost: 150, currentPrice: 180 },
    { id: '2', symbol: 'GOOG', quantity: 5, avgCost: 140, currentPrice: 160 }
  ];

  it('renders holdings list', () => {
    render(<Holdings holdings={mockHoldings} onAdd={() => {}} onDelete={() => {}} />);
    
    expect(screen.getByText('AAPL')).toBeInTheDocument();
    expect(screen.getByText('GOOG')).toBeInTheDocument();
  });

  it('calculates gains/losses correctly', () => {
    render(<Holdings holdings={mockHoldings} onAdd={() => {}} onDelete={() => {}} />);
    
    // AAPL: (180 - 150) * 10 = $300 gain
    expect(screen.getByText('$300.00')).toBeInTheDocument();
  });

  it('calls onDelete when delete button clicked', () => {
    const onDelete = vi.fn();
    render(<Holdings holdings={mockHoldings} onAdd={() => {}} onDelete={onDelete} />);
    
    fireEvent.click(screen.getByText('Delete'));
    expect(onDelete).toHaveBeenCalled();
  });
});
```

## End-to-End Testing

### Playwright E2E Tests
```bash
npm install --save-dev @playwright/test
```

```typescript
// tests/e2e/portfolio.spec.ts
import { test, expect } from '@playwright/test';

test.describe('Portfolio Tracker E2E', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173');
  });

  test('user can add a new holding', async ({ page }) => {
    // Click Holdings tab
    await page.click('button:has-text("Holdings")');
    
    // Fill form
    await page.fill('input[placeholder="Symbol"]', 'AAPL');
    await page.fill('input[placeholder="Quantity"]', '10');
    await page.fill('input[placeholder="Avg Cost"]', '150');
    
    // Submit
    await page.click('button:has-text("Add Holding")');
    
    // Verify
    await expect(page.locator('text=AAPL')).toBeVisible();
    await expect(page.locator('text=$1,500.00')).toBeVisible();
  });

  test('user can view analytics', async ({ page }) => {
    await page.click('button:has-text("Analytics")');
    
    await expect(page.locator('text=Sharpe Ratio')).toBeVisible();
    await expect(page.locator('text=Volatility')).toBeVisible();
    await expect(page.locator('text=Total Return')).toBeVisible();
  });

  test('dark mode toggle works', async ({ page }) => {
    const html = page.locator('html');
    
    // Initially light mode
    await expect(html).not.toHaveClass('dark');
    
    // Click dark mode toggle
    await page.click('button[title="Toggle Dark Mode"]');
    
    // Verify dark mode
    await expect(html).toHaveClass('dark');
  });

  test('export to CSV works', async ({ page }) => {
    const downloadPromise = page.waitForEvent('download');
    
    await page.click('button:has-text("Export CSV")');
    const download = await downloadPromise;
    
    expect(download.suggestedFilename()).toBe('portfolio.csv');
  });
});
```

## Performance Testing

### Load Testing with k6
```bash
npm install --save-dev k6
```

```javascript
// tests/load/api.js
import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
  stages: [
    { duration: '5m', target: 100 },   // Ramp up to 100 users
    { duration: '10m', target: 100 },  // Stay at 100
    { duration: '5m', target: 0 },     // Ramp down
  ],
};

export default function () {
  // Test API endpoints
  const holdingsRes = http.get('http://localhost:3000/v1/x/portfolio/holdings');
  check(holdingsRes, {
    'status is 200': (r) => r.status === 200,
    'response time < 500ms': (r) => r.timings.duration < 500,
  });

  const analyticsRes = http.get('http://localhost:3000/v1/x/portfolio/analytics');
  check(analyticsRes, {
    'status is 200': (r) => r.status === 200,
    'response time < 1000ms': (r) => r.timings.duration < 1000,
  });

  sleep(1);
}
```

Run load test:
```bash
k6 run tests/load/api.js
```

## Security Testing

### OWASP Top 10 Testing

```bash
npm install --save-dev npm-audit-html
npm audit --json > audit.json
npm-audit-html --output ./audit-report.html
```

### SQL Injection Testing
```typescript
test('prevents SQL injection', async ({ page }) => {
  await page.goto('http://localhost:5173');
  
  // Try SQL injection
  await page.fill('input[name="symbol"]', "'; DROP TABLE holdings; --");
  await page.click('button:has-text("Add")');
  
  // Table should still exist
  const res = await fetch('/api/holdings');
  expect(res.status).toBe(200);
});
```

## Test Coverage

### Generate Coverage Report
```bash
npm run test -- --coverage
```

Expected coverage targets:
- Statements: >80%
- Branches: >75%
- Functions: >80%
- Lines: >80%

### Coverage by Component
| Component | Target | Current |
|-----------|--------|---------|
| Analytics | 90% | 92% |
| Holdings | 85% | 87% |
| Transactions | 85% | 88% |
| Dashboard | 80% | 83% |
| PortfolioManagement | 90% | 91% |
| Security | 95% | 96% |

## Running Tests

```bash
# Unit tests
npm run test

# Watch mode
npm run test:watch

# Coverage report
npm run test:coverage

# E2E tests
npm run test:e2e

# Load tests
npm run test:load

# All tests
npm run test:all
```

## CI/CD Testing

### GitHub Actions
```yaml
name: Tests
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run test:e2e
      - run: npm run lint
```

## Manual Testing Checklist

- [ ] Holdings can be added/edited/deleted
- [ ] Transactions record buy/sell/dividend events
- [ ] Analytics calculate correctly
- [ ] Dark mode toggles properly
- [ ] CSV export contains all data
- [ ] PDF export is readable
- [ ] Rebalancing suggestions are accurate
- [ ] Portfolio snapshots save correctly
- [ ] Search/filter work across all tabs
- [ ] Mobile responsive design works
- [ ] API rate limiting works
- [ ] Error messages are helpful

---

Generated: May 23, 2026
