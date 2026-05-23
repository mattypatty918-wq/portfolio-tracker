import { useState } from 'preact/hooks';

export function Analytics({ holdings, transactions }: any) {
  const [timeframe, setTimeframe] = useState('all');

  // Calculate performance metrics
  const totalValue = holdings.reduce((sum: number, h: any) => sum + (h.quantity * h.currentPrice), 0);
  const totalCost = holdings.reduce((sum: number, h: any) => sum + (h.quantity * h.avgCost), 0);
  const unrealizedGains = totalValue - totalCost;

  const realizedGains = transactions
    .filter((t: any) => t.type === 'sell')
    .reduce((sum: number, t: any) => sum + (t.quantity * (t.price - (holdings.find((h: any) => h.symbol === t.symbol)?.avgCost || 0))), 0);

  const totalReturn = unrealizedGains + realizedGains;
  const totalReturnPercent = totalCost > 0 ? (totalReturn / totalCost) * 100 : 0;

  // Win/Loss ratio
  const winners = holdings.filter((h: any) => h.quantity * h.currentPrice > h.quantity * h.avgCost).length;
  const losers = holdings.filter((h: any) => h.quantity * h.currentPrice < h.quantity * h.avgCost).length;
  const winRate = (winners + losers > 0) ? (winners / (winners + losers)) * 100 : 0;

  // Best and worst
  const holdings_sorted = [...holdings].sort((a: any, b: any) => {
    const aReturn = ((a.currentPrice - a.avgCost) / a.avgCost) * 100;
    const bReturn = ((b.currentPrice - b.avgCost) / b.avgCost) * 100;
    return bReturn - aReturn;
  });

  const bestPerformer = holdings_sorted[0];
  const worstPerformer = holdings_sorted[holdings_sorted.length - 1];

  // Volatility (simplified)
  const avgPrice = holdings.length > 0
    ? holdings.reduce((sum: number, h: any) => sum + h.currentPrice, 0) / holdings.length
    : 0;
  const volatility = holdings.length > 0
    ? Math.sqrt(
        holdings.reduce((sum: number, h: any) => 
          sum + Math.pow(h.currentPrice - avgPrice, 2), 0) / holdings.length
      )
    : 0;

  // Sharpe Ratio (simplified, assuming 2% risk-free rate)
  const riskFreeRate = 0.02;
  const returnAboveRiskFree = (totalReturnPercent / 100) - riskFreeRate;
  const sharpeRatio = volatility > 0 ? returnAboveRiskFree / volatility : 0;

  // Diversification score (0-100)
  const diversificationScore = Math.min(holdings.length * 10, 100);

  return (
    <div class="analytics">
      <div class="analytics-header">
        <h3>Advanced Analytics</h3>
        <select value={timeframe} onChange={(e: any) => setTimeframe(e.target.value)}>
          <option value="all">All Time</option>
          <option value="ytd">Year to Date</option>
          <option value="1y">Last 12 Months</option>
          <option value="3m">Last 3 Months</option>
        </select>
      </div>

      <div class="metrics-grid">
        <div class="metric-card">
          <div class="metric-label">Total Return</div>
          <div class="metric-value">${totalReturn.toFixed(2)}</div>
          <div class={`metric-pct ${totalReturnPercent >= 0 ? 'positive' : 'negative'}`}>
            {totalReturnPercent.toFixed(2)}%
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-label">Win Rate</div>
          <div class="metric-value">{winners}/{winners + losers}</div>
          <div class="metric-pct">{winRate.toFixed(1)}%</div>
        </div>

        <div class="metric-card">
          <div class="metric-label">Sharpe Ratio</div>
          <div class="metric-value">{sharpeRatio.toFixed(2)}</div>
          <div class="metric-pct">(Risk-Adjusted Return)</div>
        </div>

        <div class="metric-card">
          <div class="metric-label">Volatility</div>
          <div class="metric-value">{volatility.toFixed(2)}</div>
          <div class="metric-pct">Price Variance</div>
        </div>

        <div class="metric-card">
          <div class="metric-label">Diversification</div>
          <div class="metric-value">{diversificationScore.toFixed(0)}/100</div>
          <div class="progress-bar">
            <div class="progress-fill" style={{ width: diversificationScore + '%' }}></div>
          </div>
        </div>

        <div class="metric-card">
          <div class="metric-label">Realized Gains</div>
          <div class={`metric-value ${realizedGains >= 0 ? 'positive' : 'negative'}`}>
            ${realizedGains.toFixed(2)}
          </div>
          <div class="metric-pct">From Closed Positions</div>
        </div>
      </div>

      <div class="analytics-breakdown">
        <div class="breakdown-section">
          <h4>Best Performer</h4>
          {bestPerformer ? (
            <div class="performer-card positive">
              <div class="symbol">{bestPerformer.symbol}</div>
              <div class="return">{(((bestPerformer.currentPrice - bestPerformer.avgCost) / bestPerformer.avgCost) * 100).toFixed(2)}%</div>
              <div class="detail">${bestPerformer.avgCost.toFixed(2)} → ${bestPerformer.currentPrice.toFixed(2)}</div>
            </div>
          ) : <div class="empty-state">No holdings</div>}
        </div>

        <div class="breakdown-section">
          <h4>Worst Performer</h4>
          {worstPerformer ? (
            <div class={`performer-card ${(((worstPerformer.currentPrice - worstPerformer.avgCost) / worstPerformer.avgCost) * 100) >= 0 ? 'positive' : 'negative'}`}>
              <div class="symbol">{worstPerformer.symbol}</div>
              <div class="return">{(((worstPerformer.currentPrice - worstPerformer.avgCost) / worstPerformer.avgCost) * 100).toFixed(2)}%</div>
              <div class="detail">${worstPerformer.avgCost.toFixed(2)} → ${worstPerformer.currentPrice.toFixed(2)}</div>
            </div>
          ) : <div class="empty-state">No holdings</div>}
        </div>
      </div>
    </div>
  );
}