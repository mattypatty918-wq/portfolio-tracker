// Phase 3: Portfolio Management (51-75)
import { useState } from 'preact/hooks';

export function PortfolioManagement({ holdings }: any) {
  const [rebalanceTarget, setRebalanceTarget] = useState('equal');
  
  const totalValue = holdings.reduce((sum: number, h: any) => sum + (h.quantity * h.currentPrice), 0);
  
  // Current allocations
  const allocations = holdings.map((h: any) => ({
    ...h,
    value: h.quantity * h.currentPrice,
    percentage: totalValue > 0 ? (h.quantity * h.currentPrice) / totalValue : 0
  }));
  
  // Rebalancing suggestions
  const targetPercentage = 100 / holdings.length;
  const suggestions = allocations.map((a: any) => ({
    ...a,
    targetValue: (targetPercentage / 100) * totalValue,
    difference: (targetPercentage / 100) * totalValue - a.value,
    action: a.percentage * 100 > targetPercentage ? 'SELL' : 'BUY'
  }));
  
  // Concentration analysis
  const topHolding = allocations.sort((a: any, b: any) => b.percentage - a.percentage)[0];
  const concentrationRatio = topHolding ? topHolding.percentage : 0;
  
  // Position sizing
  const avgPositionSize = totalValue / holdings.length;
  
  // Risk metrics
  const leverage = 0; // TODO: Calculate from margin accounts
  const diversificationScore = Math.min(holdings.length * 10, 100);

  return (
    <div class="portfolio-management">
      <div class="section">
        <h3>Rebalancing Simulator</h3>
        <div class="rebalance-options">
          <label>
            <input type="radio" value="equal" checked={rebalanceTarget === 'equal'} onChange={(e: any) => setRebalanceTarget(e.target.value)} />
            Equal Weight (All positions equal size)
          </label>
          <label>
            <input type="radio" value="cap" checked={rebalanceTarget === 'cap'} onChange={(e: any) => setRebalanceTarget(e.target.value)} />
            Market Cap Weight
          </label>
          <label>
            <input type="radio" value="risk" checked={rebalanceTarget === 'risk'} onChange={(e: any) => setRebalanceTarget(e.target.value)} />
            Risk Parity
          </label>
        </div>

        <table class="rebalance-table">
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Current Value</th>
              <th>Current %</th>
              <th>Target %</th>
              <th>Action</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {suggestions.map((s: any) => (
              <tr key={s.id} class={`action-${s.action.toLowerCase()}`}>
                <td>{s.symbol}</td>
                <td>${s.value.toFixed(2)}</td>
                <td>{(s.percentage * 100).toFixed(1)}%</td>
                <td>{targetPercentage.toFixed(1)}%</td>
                <td class="action">{s.action}</td>
                <td>${Math.abs(s.difference).toFixed(2)}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div class="section">
        <h3>Risk Analysis</h3>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-label">Concentration Ratio</div>
            <div class="metric-value">{(concentrationRatio * 100).toFixed(1)}%</div>
            <div class="metric-desc">Largest position weight</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Diversification Score</div>
            <div class="metric-value">{diversificationScore.toFixed(0)}/100</div>
            <div class="metric-desc">Portfolio diversity</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Avg Position Size</div>
            <div class="metric-value">${avgPositionSize.toFixed(2)}</div>
            <div class="metric-desc">Average per position</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Number of Holdings</div>
            <div class="metric-value">{holdings.length}</div>
            <div class="metric-desc">Total positions</div>
          </div>
        </div>
      </div>
    </div>
  );
}
