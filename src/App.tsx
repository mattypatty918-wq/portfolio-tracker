import { useState, useEffect } from 'preact/hooks';
import './styles.css';
import { Holdings } from './components/Holdings';
import { Dashboard } from './components/Dashboard';
import { Watchlist } from './components/Watchlist';

type TabType = 'dashboard' | 'holdings' | 'watchlist';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [holdings, setHoldings] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const [hRes, wRes] = await Promise.all([
        window.vellum.fetch('/v1/x/portfolio?resource=holdings'),
        window.vellum.fetch('/v1/x/portfolio?resource=watchlist')
      ]);
      if (hRes.ok) setHoldings(await hRes.json());
      if (wRes.ok) setWatchlist(await wRes.json());
    } catch (err) {
      console.error('Failed to load data:', err);
      window.vellum.widgets.toast('Failed to load portfolio', 'error', 4000);
    } finally {
      setLoading(false);
    }
  };

  const handleAddHolding = async (holding: any) => {
    try {
      const res = await window.vellum.fetch('/v1/x/portfolio?resource=holdings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(holding)
      });
      if (res.ok) {
        setHoldings(await res.json());
        window.vellum.widgets.toast('Position added!', 'success', 3000);
      }
    } catch (err) {
      window.vellum.widgets.toast('Failed to add position', 'error');
    }
  };

  const handleDeleteHolding = async (id: string) => {
    if (!await window.vellum.confirm('Delete Position', 'Remove this holding from your portfolio?')) return;
    try {
      const res = await window.vellum.fetch('/v1/x/portfolio?resource=holdings&id=' + id, {
        method: 'DELETE'
      });
      if (res.ok) {
        setHoldings(holdings.filter(h => h.id !== id));
        window.vellum.widgets.toast('Position deleted', 'success');
      }
    } catch (err) {
      window.vellum.widgets.toast('Failed to delete position', 'error');
    }
  };

  if (loading) {
    return <div class="container"><div class="spinner">Loading portfolio...</div></div>;
  }

  return (
    <div class="app">
      <header class="header">
        <div class="header-content">
          <h1>💰 Portfolio Tracker</h1>
          <p>Multi-asset investment dashboard</p>
        </div>
      </header>

      <div class="tabs">
        <button 
          class={`tab-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          📊 Dashboard
        </button>
        <button 
          class={`tab-btn ${activeTab === 'holdings' ? 'active' : ''}`}
          onClick={() => setActiveTab('holdings')}
        >
          📈 Holdings
        </button>
        <button 
          class={`tab-btn ${activeTab === 'watchlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('watchlist')}
        >
          👁️ Watchlist
        </button>
      </div>

      <main class="content">
        {activeTab === 'dashboard' && <Dashboard holdings={holdings} />}
        {activeTab === 'holdings' && <Holdings holdings={holdings} onAdd={handleAddHolding} onDelete={handleDeleteHolding} />}
        {activeTab === 'watchlist' && <Watchlist items={watchlist} />}
      </main>
    </div>
  );
}