import { useState } from 'preact/hooks';

export function Reports({ holdings, transactions }: any) {
  const [reportType, setReportType] = useState('holdings');

  // Calculate capital gains
  const capitalGains = transactions
    .filter((t: any) => t.type === 'sell')
    .map((t: any) => ({
      symbol: t.symbol,
      quantity: t.quantity,
      salePrice: t.price,
      costBasis: holdings.find((h: any) => h.symbol === t.symbol)?.avgCost || 0,
      gain: (t.price - (holdings.find((h: any) => h.symbol === t.symbol)?.avgCost || 0)) * t.quantity
    }));

  const generatePDF = () => {
    const content = `
PORTFOLIO REPORT
Generated: ${new Date().toLocaleDateString()}

HOLDINGS SUMMARY
${holdings.map((h: any) => `${h.symbol}: ${h.quantity} @ ${h.currentPrice} = $${(h.quantity * h.currentPrice).toFixed(2)}`).join('\n')}

CAPITAL GAINS
${capitalGains.map((g: any) => `${g.symbol}: $${g.gain.toFixed(2)}`).join('\n')}

TRANSACTIONS
${transactions.map((t: any) => `${t.date} ${t.symbol} ${t.type} ${t.quantity} @ $${t.price}`).join('\n')}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-report-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    window.vellum.widgets.toast('Report downloaded!', 'success');
  };

  const exportCSV = () => {
    let csv = '';
    
    if (reportType === 'holdings') {
      csv = 'Symbol,Type,Quantity,Avg Cost,Current Price,Value,Gain/Loss\n';
      holdings.forEach((h: any) => {
        const value = h.quantity * h.currentPrice;
        const gain = value - (h.quantity * h.avgCost);
        csv += `${h.symbol},${h.assetType},${h.quantity},${h.avgCost},${h.currentPrice},${value},${gain}\n`;
      });
    } else if (reportType === 'transactions') {
      csv = 'Date,Symbol,Type,Quantity,Price,Total\n';
      transactions.forEach((t: any) => {
        csv += `${t.date},${t.symbol},${t.type},${t.quantity},${t.price},${t.quantity * t.price}\n`;
      });
    } else if (reportType === 'gains') {
      csv = 'Symbol,Quantity,Cost Basis,Sale Price,Gain\n';
      capitalGains.forEach((g: any) => {
        csv += `${g.symbol},${g.quantity},${g.costBasis},${g.salePrice},${g.gain}\n`;
      });
    }

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-${reportType}-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    window.vellum.widgets.toast('CSV exported!', 'success');
  };

  return (
    <div class="reports">
      <div class="report-controls">
        <select value={reportType} onChange={(e: any) => setReportType(e.target.value)}>
          <option value="holdings">Holdings Report</option>
          <option value="transactions">Transactions Report</option>
          <option value="gains">Capital Gains Report</option>
        </select>
        <button class="btn-primary" onClick={generatePDF}>📄 Export PDF</button>
        <button class="btn-secondary" onClick={exportCSV}>📊 Export CSV</button>
      </div>

      {reportType === 'holdings' && (
        <div class="report-content">
          <h3>Holdings Report</h3>
          <table class="report-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Avg Cost</th>
                <th>Current Price</th>
                <th>Value</th>
                <th>Gain/Loss</th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h: any) => {
                const value = h.quantity * h.currentPrice;
                const gain = value - (h.quantity * h.avgCost);
                return (
                  <tr key={h.id} class={gain >= 0 ? 'gain' : 'loss'}>
                    <td>{h.symbol}</td>
                    <td>{h.assetType}</td>
                    <td>{h.quantity}</td>
                    <td>${h.avgCost.toFixed(2)}</td>
                    <td>${h.currentPrice.toFixed(2)}</td>
                    <td>${value.toFixed(2)}</td>
                    <td>${gain.toFixed(2)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {reportType === 'transactions' && (
        <div class="report-content">
          <h3>Transactions Report</h3>
          <table class="report-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Symbol</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((t: any, idx: number) => (
                <tr key={idx}>
                  <td>{new Date(t.date).toLocaleDateString()}</td>
                  <td>{t.symbol}</td>
                  <td>{t.type}</td>
                  <td>{t.quantity}</td>
                  <td>${t.price.toFixed(2)}</td>
                  <td>${(t.quantity * t.price).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {reportType === 'gains' && (
        <div class="report-content">
          <h3>Capital Gains Report</h3>
          {capitalGains.length === 0 ? (
            <div class="empty-state">No realized gains yet</div>
          ) : (
            <table class="report-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Quantity</th>
                  <th>Cost Basis</th>
                  <th>Sale Price</th>
                  <th>Gain/Loss</th>
                </tr>
              </thead>
              <tbody>
                {capitalGains.map((g: any, idx: number) => (
                  <tr key={idx} class={g.gain >= 0 ? 'gain' : 'loss'}>
                    <td>{g.symbol}</td>
                    <td>{g.quantity}</td>
                    <td>${g.costBasis.toFixed(2)}</td>
                    <td>${g.salePrice.toFixed(2)}</td>
                    <td>${g.gain.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}