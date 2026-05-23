import { useState, useEffect } from 'preact/hooks';
import './styles.css';
import { Holdings } from './components/Holdings';
import { Dashboard } from './components/Dashboard';
import { Watchlist } from './components/Watchlist';
import { Transactions } from './components/Transactions';
import { Analytics } from './components/Analytics';
import { Reports } from './components/Reports';
import { AdvancedAnalytics } from './components/AdvancedAnalytics';
import { PortfolioManager } from './components/PortfolioManager';
import { AdvancedPositions } from './components/AdvancedPositions';
import { TaxReporting } from './components/TaxReporting';
import { security } from './utils/Security';

type TabType = 'dashboard' | 'holdings' | 'watchlist' | 'transactions' | 'analytics' | 'reports' | 'advanced-analytics' | 'portfolio-manager' | 'advanced-positions' | 'tax-reporting' | 'security';

export function App() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [holdings, setHoldings] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [darkMode, setDarkMode] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
    security.init();
  }, []);

  const loadData = async () => {
    try {
      const [hRes, wRes, tRes] = await Promise.all([
        window.vellum.fetch('/v1/x/portfolio?resource=holdings'),
        window.vellum.fetch('/v1/x/portfolio?resource=watchlist'),
        window.vellum.fetch('/v1/x/portfolio?resource=transactions')
      ]);
      if (hRes.ok) setHoldings(await hRes.json());
      if (wRes.ok) setWatchlist(await wRes.json());
      if (tRes.ok) setTransactions(await tRes.json());
      const savedDarkMode = localStorage.getItem('darkMode') === 'true';
      setDarkMode(savedDarkMode);
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

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', String(newMode));
  };

  if (loading) {
    return <div class="container"><div class="spinner">Loading portfolio...</div></div>;
  }

  return (
    <div class={`app ${darkMode ? 'dark-mode' : ''}`}>
      <header class="header">
        <div class="header-content">
          <h1>💰 Portfolio Tracker</h1>
          <p>Multi-asset investment dashboard</p>
        </div>
        <button class="theme-toggle" onClick={toggleDarkMode}>
          {darkMode ? '☀️' : '🌙'}
        </button>
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
          class={`tab-btn ${activeTab === 'transactions' ? 'active' : ''}`}
          onClick={() => setActiveTab('transactions')}
        >
          📝 Transactions
        </button>
        <button 
          class={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('analytics')}
        >
          📊 Analytics
        </button>
        <button 
          class={`tab-btn ${activeTab === 'advanced-analytics' ? 'active' : ''}`}
          onClick={() => setActiveTab('advanced-analytics')}
        >
          📈 Advanced
        </button>
        <button 
          class={`tab-btn ${activeTab === 'portfolio-manager' ? 'active' : ''}`}
          onClick={() => setActiveTab('portfolio-manager')}
        >
          ⚙️ Manager
        </button>
        <button 
          class={`tab-btn ${activeTab === 'advanced-positions' ? 'active' : ''}`}
          onClick={() => setActiveTab('advanced-positions')}
        >
          🎯 Advanced
        </button>
        <button 
          class={`tab-btn ${activeTab === 'tax-reporting' ? 'active' : ''}`}
          onClick={() => setActiveTab('tax-reporting')}
        >
          🧾 Tax
        </button>
        <button 
          class={`tab-btn ${activeTab === 'reports' ? 'active' : ''}`}
          onClick={() => setActiveTab('reports')}
        >
          📋 Reports
        </button>
        <button 
          class={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          🔒 Security
        </button>
        <button 
          class={`tab-btn ${activeTab === 'watchlist' ? 'active' : ''}`}
          onClick={() => setActiveTab('watchlist')}
        >
          👁️ Watchlist
        </button>
      </div>

      <main class="content">
        {activeTab === 'dashboard' && <Dashboard holdings={holdings} transactions={transactions} />}
        {activeTab === 'holdings' && <Holdings holdings={holdings} onAdd={handleAddHolding} onDelete={handleDeleteHolding} />}
        {activeTab === 'transactions' && <Transactions transactions={transactions} holdings={holdings} />}
        {activeTab === 'analytics' && <Analytics holdings={holdings} transactions={transactions} />}
        {activeTab === 'advanced-analytics' && <AdvancedAnalytics holdings={holdings} transactions={transactions} />}
        {activeTab === 'portfolio-manager' && <PortfolioManager holdings={holdings} transactions={transactions} />}
        {activeTab === 'advanced-positions' && <AdvancedPositions holdings={holdings} />}
        {activeTab === 'tax-reporting' && <TaxReporting holdings={holdings} transactions={transactions} />}
        {activeTab === 'reports' && <Reports holdings={holdings} transactions={transactions} />}
        {activeTab === 'security' && <SecuritySettings />}
        {activeTab === 'watchlist' && <Watchlist items={watchlist} />}
      </main>
    </div>
  );
}
}

function SecuritySettings() {
const [show2FA, setShow2FA] = useState(false);
const [selectedMethod, setSelectedMethod] = useState('authenticator');

const handleEnableTwoFactor = () => {
  const result = security.enableTwoFactorAuth(selectedMethod as any);
  window.vellum.widgets.toast(`2FA enabled with ${selectedMethod}!`, 'success');
};

const handleExportData = () => {
  security.exportUserData();
  window.vellum.widgets.toast('Your data has been exported', 'success');
};

const handleBackup = () => {
  security.createBackup();
  window.vellum.widgets.toast('Backup created', 'success');
};

const handleRestoreBackup = async (file: File) => {
  const result = await security.restoreFromBackup(file);
  window.vellum.widgets.toast(result.message, result.success ? 'success' : 'error');
};

return (
  <div class="security-settings">
    <div class="security-section">
      <h3>🔒 Security Settings</h3>
        
      <div class="setting-card">
        <div class="setting-header">
          <h4>Two-Factor Authentication</h4>
          <button class="btn-secondary" onClick={() => setShow2FA(!show2FA)}>
            {show2FA ? 'Hide' : 'Setup'}
          </button>
        </div>
          
        {show2FA && (
          <div class="setting-form">
            <p>Choose your 2FA method:</p>
            <select value={selectedMethod} onChange={(e: any) => setSelectedMethod(e.target.value)}>
              <option value="authenticator">Authenticator App</option>
              <option value="sms">SMS</option>
              <option value="email">Email</option>
            </select>
            <button class="btn-primary" onClick={handleEnableTwoFactor}>Enable 2FA</button>
          </div>
        )}
      </div>

      <div class="setting-card">
        <div class="setting-header">
          <h4>Data Management</h4>
        </div>
        <div class="setting-actions">
          <button class="btn-secondary" onClick={handleBackup}>📥 Create Backup</button>
          <button class="btn-secondary" onClick={() => {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.json';
            input.onchange = (e: any) => handleRestoreBackup(e.target.files[0]);
            input.click();
          }}>📤 Restore Backup</button>
          <button class="btn-secondary" onClick={handleExportData}>📊 Export Data (GDPR)</button>
        </div>
      </div>

      <div class="setting-card warning">
        <div class="setting-header">
          <h4>Danger Zone</h4>
        </div>
        <button class="btn-danger" onClick={() => {
          if (window.vellum.confirm('Delete Account', 'This will permanently delete all your data. Are you sure?')) {
            security.deleteUserData();
            window.vellum.widgets.toast('Deletion request submitted. You will receive a confirmation email.', 'success');
          }
        }}>🗑️ Delete Account</button>
      </div>
    </div>

    <div class="security-info">
      <h4>Security Features Enabled</h4>
      <ul>
        <li>✅ AES-256 Data Encryption</li>
        <li>✅ TLS/SSL Transport Security</li>
        <li>✅ Session Management (30 min timeout)</li>
        <li>✅ Activity Audit Logging</li>
        <li>✅ GDPR Compliance</li>
        <li>✅ Regular Backups</li>
      </ul>
    </div>
  </div>
);
}