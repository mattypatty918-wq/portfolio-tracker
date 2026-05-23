export function Dashboard({ holdings }: { holdings: any[] }) {
  const totalValue = holdings.reduce((sum, h) => sum + (h.quantity * h.currentPrice), 0);
  const totalCost = holdings.reduce((sum, h) => sum + (h.quantity * h.avgCost), 0);
  const gainLoss = totalValue - totalCost;
  const gainLossPercent = totalCost > 0 ? (gainLoss / totalCost * 100).toFixed(2) : '0.00';

  const byAsset = holdings.reduce((acc: any, h: any) => {
    acc[h.assetType] = (acc[h.assetType] || 0) + (h.quantity * h.currentPrice);
    return acc;
  }, {});

  return (
    <div class="dashboard">
      <div class="metric-grid">
        <div class="metric-card">
          <div class="metric-label">Total Value</div>
          <div class="metric-value">${totalValue.toFixed(2)}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Total Cost</div>
          <div class="metric-value">${totalCost.toFixed(2)}</div>
        </div>
        <div class={`metric-card ${gainLoss >= 0 ? 'positive' : 'negative'}`}>
          <div class="metric-label">Gain/Loss</div>
          <div class="metric-value">${gainLoss.toFixed(2)}</div>
          <div class="metric-pct">{gainLossPercent}%</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Positions</div>
          <div class="metric-value">{holdings.length}</div>
        </div>
      </div>

      <div class="allocation">
        <h3>Asset Allocation</h3>
        <div class="allocation-breakdown">
          {Object.entries(byAsset).map(([type, value]: [string, any]) => {
            const pct = ((value / totalValue) * 100).toFixed(1);
            return (
              <div class="alloc-bar" key={type}>
                <div class="alloc-label">{type.toUpperCase()}</div>
                <div class="bar-container">
                  <div class="bar-fill" style={{ width: pct + '%' }}></div>
                  <div class="bar-label">{pct}%</div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}