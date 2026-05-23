// Phase 3: Portfolio Management (51-75)
import { useState } from 'preact/hooks';

export function PortfolioManager({ holdings, transactions }: any) {
  const [rebalanceMode, setRebalanceMode] = useState(false);
  const [targetAllocations, setTargetAllocations] = useState<any>({});

  // Calculate current allocations
  const totalValue = holdings.reduce((sum: number, h: any) => sum + (h.quantity * h.currentPrice), 0);
  const allocations = holdings.map((h: any) => ({
    ...h,
    currentValue: h.quantity * h.currentPrice,
    currentPercent: totalValue > 0 ? ((h.quantity * h.currentPrice) / totalValue * 100) : 0
  }));

  // Wash sale detection (same position bought/sold within 30 days)
  const washSales = transactions.filter((t: any) => {
    if (t.type !== 'sell') return false;
    const saleDate = new Date(t.date);
    return transactions.some((t2: any) => {
      if (t2.type !== 'buy' || t2.symbol !== t.symbol) return false;
      const buyDate = new Date(t2.date);
      const daysDiff = Math.abs((saleDate.getTime() - buyDate.getTime()) / (1000 * 60 * 60 * 24));
      return daysDiff <= 30;
    });
  });

  // Position sizing recommendations (Kelly Criterion - simplified)
  const winners = holdings.filter((h: any) => h.quantity * h.currentPrice > h.quantity * h.avgCost);
  const losers = holdings.filter((h: any) => h.quantity * h.currentPrice < h.quantity * h.avgCost);
  const winRate = holdings.length > 0 ? winners.length / holdings.length : 0;
  
  const avgWin = winners.length > 0 
    ? winners.reduce((sum: number, h: any) => sum + ((h.currentPrice - h.avgCost) / h.avgCost), 0) / winners.length
    : 0;
  const avgLoss = losers.length > 0 
    ? Math.abs(losers.reduce((sum: number, h: any) => sum + ((h.currentPrice - h.avgCost) / h.avgCost), 0) / losers.length)
    : 0;
  
  const kellyPercent = avgLoss > 0 ? ((winRate * avgWin) - ((1 - winRate) * avgLoss)) / avgWin : 0;
  const kellyPosition = Math.max(0, Math.min(0.25, kellyPercent));

  // Concentration risk
  const topHolding = allocations.length > 0 ? allocations.sort((a: any, b: any) => b.currentPercent - a.currentPercent)[0] : null;
  const concentrationRisk = topHolding ? topHolding.currentPercent : 0;

  const rebalancingSuggestions = allocations
    .filter((a: any) => Math.abs(a.currentPercent - (targetAllocations[a.symbol] || 0)) > 5)
    .map((a: any) => ({
      ...a,
      targetPercent: targetAllocations[a.symbol] || 0,
      rebalanceAmount: (targetAllocations[a.symbol] || 0) - a.currentPercent
    }));

  return (
    <div class="portfolio-manager">
      <div class="manager-section">
        <h3>Current Allocations</h3>
        <div class="allocations-grid">
          {allocations.map((a: any) => (
            <div key={a.id} class="allocation-card">
              <div class="allocation-header">
                <div class="symbol">{a.symbol}</div>
                <div class={`percent ${a.currentPercent > 20 ? 'warning' : ''}`}>{a.currentPercent.toFixed(1)}%</div>
              </div>
              <div class="allocation-bar">
                <div class="allocation-fill" style={{ width: a.currentPercent + '%' }}></div>
              </div>
              <div class="allocation-detail">${a.currentValue.toFixed(2)}</div>
            </div>
          ))}
        </div>
      </div>

      <div class="manager-section">
        <h3>Risk Analysis</h3>
        <div class="risk-metrics">
          <div class="risk-card">
            <div class="risk-label">Concentration Risk</div>
            <div class={`risk-value ${concentrationRisk > 30 ? 'high' : concentrationRisk > 20 ? 'medium' : 'low'}`}>
              {concentrationRisk.toFixed(1)}%
            </div>
            <div class="risk-desc">{topHolding?.symbol || 'N/A'} is {concentrationRisk.toFixed(1)}% of portfolio</div>
          </div>

          <div class="risk-card">
            <div class="risk-label">Kelly Criterion Position</div>
            <div class="risk-value">{(kellyPosition * 100).toFixed(2)}%</div>
            <div class="risk-desc">Recommended max per position (win rate {(winRate * 100).toFixed(0)}%)</div>
          </div>

          <div class="risk-card">
            <div class="risk-label">Wash Sales</div>
            <div class="risk-value">{washSales.length}</div>
            <div class="risk-desc">Positions with same buys/sells within 30 days</div>
          </div>
        </div>

        {washSales.length > 0 && (
          <div class="wash-sales-warning">
            <strong>⚠️ Wash Sale Alert:</strong> {washSales.map((t: any) => t.symbol).join(', ')}
          </div>
        )}
      </div>

      <div class="manager-section">
        <h3>Rebalancing</h3>
        <button class="btn-primary" onClick={() => setRebalanceMode(!rebalanceMode)}>
          {rebalanceMode ? 'Done Editing' : 'Set Target Allocation'}
        </button>

        {rebalanceMode && (
          <div class="rebalance-form">
            {allocations.map((a: any) => (
              <div key={a.id} class="allocation-input">
                <label>{a.symbol}</label>
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="1"
                  value={targetAllocations[a.symbol] || ''}
                  onChange={(e: any) => setTargetAllocations({
                    ...targetAllocations,
                    [a.symbol]: parseFloat(e.target.value)
                  })}
                />
                <span>%</span>
              </div>
            ))}
          </div>
        )}

        {rebalancingSuggestions.length > 0 && !rebalanceMode && (
          <div class="rebalance-suggestions">
            <h4>Rebalancing Needed</h4>
            {rebalancingSuggestions.map((s: any) => (
              <div key={s.id} class={`suggestion-card ${s.rebalanceAmount > 0 ? 'buy' : 'sell'}`}>
                <div class="symbol">{s.symbol}</div>
                <div class="action">{s.rebalanceAmount > 0 ? '🔼 BUY' : '🔽 SELL'}</div>
                <div class="detail">Current: {s.currentPercent.toFixed(1)}% → Target: {s.targetPercent.toFixed(1)}%</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
