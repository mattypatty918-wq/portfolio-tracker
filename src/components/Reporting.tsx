// Phase 6: Reporting & Export (126-150)
import { useState } from 'preact/hooks';

export function Reporting({ holdings, transactions }: any) {
  const [reportPeriod, setReportPeriod] = useState('annual');

  const reports = [
    { id: 'annual', name: 'Annual Report', icon: '📊' },
    { id: 'quarterly', name: 'Quarterly Report', icon: '📈' },
    { id: 'monthly', name: 'Monthly Statement', icon: '📅' },
    { id: 'tax', name: 'Tax Report (Form 8949)', icon: '🏛️' },
    { id: 'performance', name: 'Performance Attribution', icon: '🎯' },
    { id: 'risk', name: 'Risk Analysis Report', icon: '⚠️' }
  ];

  return (
    <div class="reporting">
      <h3>Report Generator</h3>
      <div class="report-grid">
        {reports.map((report: any) => (
          <div key={report.id} class="report-card">
            <div class="report-icon">{report.icon}</div>
            <div class="report-name">{report.name}</div>
            <button class="btn-primary" onClick={() => window.vellum.widgets.toast(`Generating ${report.name}...`, 'success')}>
              Generate
            </button>
            <button class="btn-secondary">Download PDF</button>
          </div>
        ))}
      </div>

      <div class="report-options">
        <h3>Report Settings</h3>
        <div class="form-group">
          <label>Period</label>
          <select value={reportPeriod} onChange={(e: any) => setReportPeriod(e.target.value)}>
            <option value="annual">Annual</option>
            <option value="quarterly">Quarterly</option>
            <option value="monthly">Monthly</option>
            <option value="custom">Custom Date Range</option>
          </select>
        </div>
        <button class="btn-primary">Generate All Reports</button>
      </div>
    </div>
  );
}
