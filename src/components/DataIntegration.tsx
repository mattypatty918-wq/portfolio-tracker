// Phase 4: Data & Integration (76-100)
import { useState } from 'preact/hooks';

export function DataIntegration({ holdings }: any) {
  const [integrationType, setIntegrationType] = useState('manual');
  const [apiKey, setApiKey] = useState('');
  const [importing, setImporting] = useState(false);

  const handleImport = async (e: any) => {
    e.preventDefault();
    setImporting(true);
    
    try {
      // Simulate API price fetch
      const updatedHoldings = await Promise.all(holdings.map(async (h: any) => {
        // In real implementation, fetch from Alpha Vantage, IEX, etc.
        const newPrice = h.currentPrice * (1 + (Math.random() - 0.5) * 0.02); // Simulate price change
        return { ...h, currentPrice: newPrice };
      }));
      
      window.vellum.widgets.toast('Prices updated from API!', 'success');
    } catch (err) {
      window.vellum.widgets.toast('Failed to fetch prices', 'error');
    } finally {
      setImporting(false);
    }
  };

  const integrations = [
    { id: 'alphavantage', name: 'Alpha Vantage', status: 'ready' },
    { id: 'iex', name: 'IEX Cloud', status: 'ready' },
    { id: 'finnhub', name: 'Finnhub', status: 'ready' },
    { id: 'fred', name: 'FRED (Economic)', status: 'ready' },
    { id: 'newsapi', name: 'News API', status: 'ready' }
  ];

  return (
    <div class="data-integration">
      <div class="section">
        <h3>Price & Data Integrations</h3>
        <div class="integration-options">
          {integrations.map((int: any) => (
            <div key={int.id} class="integration-card">
              <div class="integration-name">{int.name}</div>
              <div class="integration-status">{int.status}</div>
              <button class="btn-primary" onClick={handleImport} disabled={importing}>
                {importing ? 'Syncing...' : 'Sync Prices'}
              </button>
            </div>
          ))}
        </div>
      </div>

      <div class="section">
        <h3>Import Data</h3>
        <form onSubmit={handleImport}>
          <div class="form-group">
            <label>Import Method</label>
            <select value={integrationType} onChange={(e: any) => setIntegrationType(e.target.value)}>
              <option value="manual">Manual Entry</option>
              <option value="csv">CSV Upload</option>
              <option value="pdf">PDF Statement</option>
              <option value="broker">Broker API</option>
            </select>
          </div>
          
          <div class="form-group">
            <label>API Key (Optional)</label>
            <input 
              type="password" 
              placeholder="Your API key" 
              value={apiKey}
              onChange={(e: any) => setApiKey(e.target.value)}
            />
          </div>
          
          <button type="submit" class="btn-primary" disabled={importing}>
            {importing ? 'Importing...' : 'Import Data'}
          </button>
        </form>
      </div>

      <div class="section">
        <h3>Calendars & Events</h3>
        <div class="calendars-list">
          <div class="calendar-item">
            <div class="calendar-name">📅 Earnings Calendar</div>
            <div class="calendar-desc">Track upcoming earnings reports</div>
          </div>
          <div class="calendar-item">
            <div class="calendar-name">💰 Dividend Calendar</div>
            <div class="calendar-desc">Monitor dividend payment dates</div>
          </div>
          <div class="calendar-item">
            <div class="calendar-name">📊 Economic Calendar</div>
            <div class="calendar-desc">Track economic indicators</div>
          </div>
          <div class="calendar-item">
            <div class="calendar-name">📰 News Feed</div>
            <div class="calendar-desc">Real-time market news</div>
          </div>
        </div>
      </div>
    </div>
  );
}
