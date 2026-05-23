// Advanced Analytics Engine
import { readFileSync, writeFileSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const DATA_DIR = join(process.env.VELLUM_WORKSPACE_DIR!, "data", "portfolio");

function readJson<T>(file: string, fallback: T): T {
  const path = join(DATA_DIR, file);
  if (!existsSync(path)) return fallback;
  try {
    return JSON.parse(readFileSync(path, "utf-8"));
  } catch {
    return fallback;
  }
}

export const description = "Advanced portfolio analytics - correlations, efficient frontier, stress testing";

export function GET(request: Request): Response {
  const url = new URL(request.url);
  const analysis = url.searchParams.get("analysis") ?? "correlation";

  const holdings = readJson("holdings.json", []);
  const snapshots = readJson("snapshots.json", []);

  if (analysis === "correlation") {
    // Calculate correlation matrix between holdings
    const prices = holdings.map((h: any) => ({
      symbol: h.symbol,
      prices: snapshots.map((s: any) => s.positions?.find((p: any) => p.symbol === h.symbol)?.price || h.currentPrice)
    }));

    const correlations = prices.map((a: any) => ({
      symbol: a.symbol,
      correlations: prices.map((b: any) => ({
        with: b.symbol,
        correlation: calculateCorrelation(a.prices, b.prices)
      }))
    }));

    return Response.json(correlations);
  }

  if (analysis === "efficientfrontier") {
    // Calculate efficient frontier points
    const returns = holdings.map((h: any) => ((h.currentPrice - h.avgCost) / h.avgCost) * 100);
    const avgReturn = returns.reduce((a: number, b: number) => a + b, 0) / returns.length;
    const variance = returns.reduce((sum: number, r: number) => sum + Math.pow(r - avgReturn, 2), 0) / returns.length;
    const volatility = Math.sqrt(variance);

    const frontierPoints = [];
    for (let i = 0; i <= 10; i++) {
      const weight = i / 10;
      frontierPoints.push({
        volatility: volatility * weight,
        return: avgReturn * weight
      });
    }

    return Response.json(frontierPoints);
  }

  if (analysis === "stresstest") {
    // Stress test portfolio under different scenarios
    const scenarios = [
      { name: "Market Crash 20%", adjustment: -0.2 },
      { name: "Market Crash 40%", adjustment: -0.4 },
      { name: "Recession", adjustment: -0.15 },
      { name: "Bull Market 30%", adjustment: 0.3 }
    ];

    const results = scenarios.map((scenario: any) => {
      const scenarioValue = holdings.reduce((sum: number, h: any) => {
        const stressPrice = h.currentPrice * (1 + scenario.adjustment);
        return sum + (h.quantity * stressPrice);
      }, 0);

      return {
        scenario: scenario.name,
        portfolioValue: scenarioValue,
        change: ((scenarioValue - (holdings.reduce((sum: number, h: any) => sum + (h.quantity * h.currentPrice), 0))) / 
                 (holdings.reduce((sum: number, h: any) => sum + (h.quantity * h.currentPrice), 0))).toFixed(2)
      };
    });

    return Response.json(results);
  }

  return Response.json({ error: "Unknown analysis type" }, { status: 400 });
}

function calculateCorrelation(x: number[], y: number[]): number {
  if (x.length !== y.length || x.length === 0) return 0;

  const meanX = x.reduce((a: number, b: number) => a + b) / x.length;
  const meanY = y.reduce((a: number, b: number) => a + b) / y.length;

  const covariance = x.reduce((sum: number, xi: number, i: number) => 
    sum + (xi - meanX) * (y[i] - meanY), 0) / x.length;

  const stdX = Math.sqrt(x.reduce((sum: number, xi: number) => 
    sum + Math.pow(xi - meanX, 2), 0) / x.length);
  const stdY = Math.sqrt(y.reduce((sum: number, yi: number) => 
    sum + Math.pow(yi - meanY, 2), 0) / y.length);

  return stdX * stdY > 0 ? covariance / (stdX * stdY) : 0;
}
