// Phase 6: Reporting & Export (126-150)
// Tax reports, quarterly statements, detailed analysis

import { useState } from 'preact/hooks';

export function TaxReporting({ holdings, transactions }: any) {
  const [reportYear, setReportYear] = useState(new Date().getFullYear());
  const [reportType, setReportType] = useState('form8949');

  // Calculate capital gains (short vs long term)
  const capitalGains = transactions
    .filter((t: any) => t.type === 'sell')
    .map((sell: any) => {
      const buy = transactions.find((t: any) => t.type === 'buy' && t.symbol === sell.symbol && new Date(t.date) < new Date(sell.date));
      if (!buy) return null;

      const holdingPeriod = (new Date(sell.date).getTime() - new Date(buy.date).getTime()) / (1000 * 60 * 60 * 24);
      const isLongTerm = holdingPeriod > 365;
      const gain = (sell.price - buy.price) * sell.quantity;

      return {
        symbol: sell.symbol,
        quantity: sell.quantity,
        description: `${sell.quantity} shares of ${sell.symbol}`,
        dateAcquired: buy.date,
        dateSold: sell.date,
        proceedsOfSale: sell.price * sell.quantity,
        costBasis: buy.price * buy.quantity,
        adjustedGainOrLoss: gain,
        isLongTerm,
        holdingPeriod
      };
    })
    .filter((g: any) => g !== null);

  const shortTermGains = capitalGains.filter((g: any) => !g.isLongTerm);
  const longTermGains = capitalGains.filter((g: any) => g.isLongTerm);

  const totalShortTermGain = shortTermGains.reduce((sum: number, g: any) => sum + g.adjustedGainOrLoss, 0);
  const totalLongTermGain = longTermGains.reduce((sum: number, g: any) => sum + g.adjustedGainOrLoss, 0);

  // Dividend income
  const dividends = transactions.filter((t: any) => t.type === 'dividend');
  const totalDividends = dividends.reduce((sum: number, d: any) => sum + (d.quantity * d.price), 0);

  // Quarterly performance
  const quarters = {
    Q1: transactions.filter((t: any) => new Date(t.date).getMonth() < 3),
    Q2: transactions.filter((t: any) => {
      const month = new Date(t.date).getMonth();
      return month >= 3 && month < 6;
    }),
    Q3: transactions.filter((t: any) => {
      const month = new Date(t.date).getMonth();
      return month >= 6 && month < 9;
    }),
    Q4: transactions.filter((t: any) => {
      const month = new Date(t.date).getMonth();
      return month >= 9 && month < 12;
    })
  };

  const generateForm8949 = () => {
    let csv = 'Form 8949 - Sales of Capital Assets\n\n';
    csv += `Description,Date Acquired,Date Sold,Proceeds,Cost Basis,Gain/Loss,Long-Term\n`;
    
    capitalGains.forEach((g: any) => {
      csv += `${g.description},${g.dateAcquired},${g.dateSold},${g.proceedsOfSale.toFixed(2)},${g.costBasis.toFixed(2)},${g.adjustedGainOrLoss.toFixed(2)},${g.isLongTerm ? 'Yes' : 'No'}\n`;
    });

    csv += `\nSummary:\n`;
    csv += `Short-Term Gains/Losses: $${totalShortTermGain.toFixed(2)}\n`;
    csv += `Long-Term Gains/Losses: $${totalLongTermGain.toFixed(2)}\n`;

    return csv;
  };

  const generateScheduleD = () => {
    let csv = 'Schedule D - Capital Gains and Losses\n\n';
    csv += `PART I - SHORT-TERM CAPITAL GAINS AND LOSSES\n`;
    csv += `Description,Date Acquired,Date Sold,Proceeds,Cost,Gain/Loss\n`;
    
    shortTermGains.forEach((g: any) => {
      csv += `${g.description},${g.dateAcquired},${g.dateSold},${g.proceedsOfSale.toFixed(2)},${g.costBasis.toFixed(2)},${g.adjustedGainOrLoss.toFixed(2)}\n`;
    });

    csv += `\nPART II - LONG-TERM CAPITAL GAINS AND LOSSES\n`;
    csv += `Description,Date Acquired,Date Sold,Proceeds,Cost,Gain/Loss\n`;
    
    longTermGains.forEach((g: any) => {
      csv += `${g.description},${g.dateAcquired},${g.dateSold},${g.proceedsOfSale.toFixed(2)},${g.costBasis.toFixed(2)},${g.adjustedGainOrLoss.toFixed(2)}\n`;
    });

    return csv;
  };

  const downloadReport = (type: string) => {
    let content = '';
    let filename = '';

    if (type === 'form8949') {
      content = generateForm8949();
      filename = `Form-8949-${reportYear}.csv`;
    } else if (type === 'scheduled') {
      content = generateScheduleD();
      filename = `Schedule-D-${reportYear}.csv`;
    } else if (type === 'dividends') {
      content = `Dividend Income Report - ${reportYear}\n\n`;
      content += `Symbol,Date,Amount\n`;
      dividends.forEach((d: any) => {
        content += `${d.symbol},${d.date},${(d.quantity * d.price).toFixed(2)}\n`;
      });
      content += `\nTotal Dividend Income: $${totalDividends.toFixed(2)}\n`;
      filename = `Dividend-Report-${reportYear}.csv`;
    }

    const blob = new Blob([content], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    window.vellum.widgets.toast('Report downloaded!', 'success');
  };

  return (
    <div class="tax-reporting">
      <div class="report-header">
        <h3>Tax Reporting</h3>
        <input type="number" min="2020" max={new Date().getFullYear()} value={reportYear} onChange={(e: any) => setReportYear(parseInt(e.target.value))} />
      </div>

      <div class="tax-summary">
        <div class="tax-card positive">
          <div class="label">Short-Term Gains</div>
          <div class="value">${totalShortTermGain.toFixed(2)}</div>
          <div class="desc">{shortTermGains.length} transactions</div>
        </div>
        <div class={`tax-card ${totalLongTermGain >= 0 ? 'positive' : 'negative'}`}>
          <div class="label">Long-Term Gains</div>
          <div class="value">${totalLongTermGain.toFixed(2)}</div>
          <div class="desc">{longTermGains.length} transactions</div>
        </div>
        <div class="tax-card">
          <div class="label">Dividend Income</div>
          <div class="value">${totalDividends.toFixed(2)}</div>
          <div class="desc">{dividends.length} dividend payments</div>
        </div>
        <div class={`tax-card ${(totalShortTermGain + totalLongTermGain) >= 0 ? 'positive' : 'negative'}`}>
          <div class="label">Total Tax Gain</div>
          <div class="value">${(totalShortTermGain + totalLongTermGain).toFixed(2)}</div>
          <div class="desc">All realized gains/losses</div>
        </div>
      </div>

      <div class="report-selector">
        <button class={`report-btn ${reportType === 'form8949' ? 'active' : ''}`} onClick={() => setReportType('form8949')}>
          Form 8949
        </button>
        <button class={`report-btn ${reportType === 'scheduled' ? 'active' : ''}`} onClick={() => setReportType('scheduled')}>
          Schedule D
        </button>
        <button class={`report-btn ${reportType === 'dividends' ? 'active' : ''}`} onClick={() => setReportType('dividends')}>
          Dividends
        </button>
      </div>

      <div class="report-content">
        {reportType === 'form8949' && (
          <div>
            <h4>Form 8949 - Sales of Capital Assets</h4>
            <p>Used to report gains and losses from sales of securities.</p>
            <table class="report-table">
              <thead>
                <tr>
                  <th>Description</th>
                  <th>Date Acquired</th>
                  <th>Date Sold</th>
                  <th>Proceeds</th>
                  <th>Cost Basis</th>
                  <th>Gain/Loss</th>
                </tr>
              </thead>
              <tbody>
                {capitalGains.map((g: any, idx: number) => (
                  <tr key={idx} class={g.adjustedGainOrLoss >= 0 ? 'gain' : 'loss'}>
                    <td>{g.description}</td>
                    <td>{g.dateAcquired}</td>
                    <td>{g.dateSold}</td>
                    <td>${g.proceedsOfSale.toFixed(2)}</td>
                    <td>${g.costBasis.toFixed(2)}</td>
                    <td>${g.adjustedGainOrLoss.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <button class="btn-primary" onClick={() => downloadReport('form8949')}>📥 Download Form 8949</button>
          </div>
        )}

        {reportType === 'scheduled' && (
          <div>
            <h4>Schedule D - Capital Gains and Losses</h4>
            <p>Summary report of short-term and long-term capital gains/losses.</p>
            <div class="schedule-sections">
              <div class="section">
                <h5>Part I - Short-Term Gains/Losses</h5>
                {shortTermGains.length === 0 ? (
                  <p>No short-term transactions</p>
                ) : (
                  <table class="report-table">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Proceeds</th>
                        <th>Cost Basis</th>
                        <th>Gain/Loss</th>
                      </tr>
                    </thead>
                    <tbody>
                      {shortTermGains.map((g: any, idx: number) => (
                        <tr key={idx}>
                          <td>{g.description}</td>
                          <td>${g.proceedsOfSale.toFixed(2)}</td>
                          <td>${g.costBasis.toFixed(2)}</td>
                          <td>${g.adjustedGainOrLoss.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
              <div class="section">
                <h5>Part II - Long-Term Gains/Losses</h5>
                {longTermGains.length === 0 ? (
                  <p>No long-term transactions</p>
                ) : (
                  <table class="report-table">
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Proceeds</th>
                        <th>Cost Basis</th>
                        <th>Gain/Loss</th>
                      </tr>
                    </thead>
                    <tbody>
                      {longTermGains.map((g: any, idx: number) => (
                        <tr key={idx}>
                          <td>{g.description}</td>
                          <td>${g.proceedsOfSale.toFixed(2)}</td>
                          <td>${g.costBasis.toFixed(2)}</td>
                          <td>${g.adjustedGainOrLoss.toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
            <button class="btn-primary" onClick={() => downloadReport('scheduled')}>📥 Download Schedule D</button>
          </div>
        )}

        {reportType === 'dividends' && (
          <div>
            <h4>Dividend Income Report</h4>
            <table class="report-table">
              <thead>
                <tr>
                  <th>Symbol</th>
                  <th>Date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {dividends.map((d: any, idx: number) => (
                  <tr key={idx}>
                    <td>{d.symbol}</td>
                    <td>{d.date}</td>
                    <td>${(d.quantity * d.price).toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div class="dividend-total">
              <strong>Total Dividend Income: ${totalDividends.toFixed(2)}</strong>
            </div>
            <button class="btn-primary" onClick={() => downloadReport('dividends')}>📥 Download Dividend Report</button>
          </div>
        )}
      </div>
    </div>
  );
}
