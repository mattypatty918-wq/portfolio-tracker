// Phase 2: Advanced Analytics (26-50)
import { useState } from 'preact/hooks';

export function AdvancedAnalytics({ holdings, transactions }: any) {
  const [selectedMetric, setSelectedMetric] = useState('all');

  // Core calculations
  const prices = holdings.map((h: any) => h.currentPrice);
  const avgPrice = prices.length > 0 ? prices.reduce((a: number, b: number) => a + b) / prices.length : 0;
  
  // Volatility (Standard Deviation)
  const variance = prices.length > 0 
    ? prices.reduce((sum: number, p: number) => sum + Math.pow(p - avgPrice, 2), 0) / prices.length
    : 0;
  const volatility = Math.sqrt(variance);
  
  // Return metrics
  const totalValue = holdings.reduce((sum: number, h: any) => sum + (h.quantity * h.currentPrice), 0);
  const totalCost = holdings.reduce((sum: number, h: any) => sum + (h.quantity * h.avgCost), 0);
  const totalReturn = totalValue - totalCost;
  const returnPercent = totalCost > 0 ? (totalReturn / totalCost) : 0;
  
  // Sharpe Ratio (risk-free rate = 2%)
  const riskFreeRate = 0.02;
  const sharpeRatio = volatility > 0 ? (returnPercent - riskFreeRate) / volatility : 0;
  
  // Sortino Ratio (downside volatility only)
  const downsideReturns = prices.filter((p: number) => p < avgPrice);
  const downsideVariance = downsideReturns.length > 0
    ? downsideReturns.reduce((sum: number, p: number) => sum + Math.pow(p - avgPrice, 2), 0) / downsideReturns.length
    : 0;
  const downsideVolatility = Math.sqrt(downsideVariance);
  const sortinoRatio = downsideVolatility > 0 ? (returnPercent - riskFreeRate) / downsideVolatility : 0;
  
  // Calmar Ratio (return / max drawdown)
  const maxPrice = Math.max(...prices);
  const drawdown = maxPrice > 0 ? (maxPrice - avgPrice) / maxPrice : 0;
  const calmarRatio = drawdown > 0 ? returnPercent / drawdown : 0;
  
  // Skewness (symmetry of returns)
  const cubedDifferences = prices.reduce((sum: number, p: number) => sum + Math.pow(p - avgPrice, 3), 0);
  const skewness = volatility > 0 ? cubedDifferences / (prices.length * Math.pow(volatility, 3)) : 0;
  
  // Kurtosis (tail risk)
  const fourthMoment = prices.reduce((sum: number, p: number) => sum + Math.pow(p - avgPrice, 4), 0);
  const kurtosis = volatility > 0 ? (fourthMoment / (prices.length * Math.pow(volatility, 4))) - 3 : 0;
  
  // Value at Risk (95% confidence, 1-day)
  const sortedReturns = holdings.map((h: any) => ((h.currentPrice - h.avgCost) / h.avgCost) * 100).sort((a: number, b: number) => a - b);
  const var95Index = Math.floor(sortedReturns.length * 0.05);
  const var95 = sortedReturns.length > 0 ? sortedReturns[var95Index] : 0;

  return (
    <div class="advanced-analytics">
      <div class="metrics-selector">
        <button class={`metric-btn ${selectedMetric === 'all' ? 'active' : ''}`} onClick={() => setSelectedMetric('all')}>All Metrics</button>
        <button class={`metric-btn ${selectedMetric === 'risk' ? 'active' : ''}`} onClick={() => setSelectedMetric('risk')}>Risk Metrics</button>
        <button class={`metric-btn ${selectedMetric === 'performance' ? 'active' : ''}`} onClick={() => setSelectedMetric('performance')}>Performance</button>
      </div>

      <div class="metrics-grid">
        {(selectedMetric === 'all' || selectedMetric === 'risk') && (
          <>
            <div class="metric-card">
              <div class="metric-label">Volatility (σ)</div>
              <div class="metric-value">{volatility.toFixed(4)}</div>
              <div class="metric-desc">Standard deviation of prices</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Sharpe Ratio</div>
              <div class="metric-value">{sharpeRatio.toFixed(3)}</div>
              <div class="metric-desc">Risk-adjusted return</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Sortino Ratio</div>
              <div class="metric-value">{sortinoRatio.toFixed(3)}</div>
              <div class="metric-desc">Downside risk-adjusted</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Value at Risk (95%)</div>
              <div class="metric-value">{var95.toFixed(2)}%</div>
              <div class="metric-desc">Worst case loss</div>
            </div>
          </>
        )}
        
        {(selectedMetric === 'all' || selectedMetric === 'performance') && (
          <>
            <div class="metric-card">
              <div class="metric-label">Calmar Ratio</div>
              <div class="metric-value">{calmarRatio.toFixed(3)}</div>
              <div class="metric-desc">Return / Max Drawdown</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Skewness</div>
              <div class="metric-value">{skewness.toFixed(3)}</div>
              <div class="metric-desc">Return distribution symmetry</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Kurtosis</div>
              <div class="metric-value">{kurtosis.toFixed(3)}</div>
              <div class="metric-desc">Tail risk indicator</div>
            </div>
            <div class="metric-card">
              <div class="metric-label">Total Return</div>
              <div class="metric-value">{(returnPercent * 100).toFixed(2)}%</div>
              <div class="metric-desc">Overall performance</div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
