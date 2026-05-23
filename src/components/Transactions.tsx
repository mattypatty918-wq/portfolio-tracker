import { useState } from 'preact/hooks';

export function Transactions({ transactions, holdings }: any) {
  const [showForm, setShowForm] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [form, setForm] = useState({
    symbol: '',
    type: 'buy',
    quantity: 0,
    price: 0,
    date: new Date().toISOString().split('T')[0],
    notes: ''
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await window.vellum.fetch('/v1/x/portfolio?resource=transactions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        window.vellum.widgets.toast('Transaction recorded!', 'success');
        setForm({ symbol: '', type: 'buy', quantity: 0, price: 0, date: new Date().toISOString().split('T')[0], notes: '' });
        setShowForm(false);
      }
    } catch (err) {
      window.vellum.widgets.toast('Failed to record transaction', 'error');
    }
  };

  const filtered = transactions.filter((t: any) => {
    const matchType = filter === 'all' || t.type === filter;
    const matchSearch = t.symbol.toLowerCase().includes(searchTerm.toLowerCase());
    return matchType && matchSearch;
  });

  const totalBuys = transactions
    .filter((t: any) => t.type === 'buy')
    .reduce((sum: number, t: any) => sum + (t.quantity * t.price), 0);

  const totalSells = transactions
    .filter((t: any) => t.type === 'sell')
    .reduce((sum: number, t: any) => sum + (t.quantity * t.price), 0);

  const realizedGains = totalSells - totalBuys;

  return (
    <div class="transactions">
      <div class="transaction-metrics">
        <div class="metric-card">
          <div class="metric-label">Total Buys</div>
          <div class="metric-value">${totalBuys.toFixed(2)}</div>
        </div>
        <div class="metric-card">
          <div class="metric-label">Total Sells</div>
          <div class="metric-value">${totalSells.toFixed(2)}</div>
        </div>
        <div class={`metric-card ${realizedGains >= 0 ? 'positive' : 'negative'}`}>
          <div class="metric-label">Realized Gains</div>
          <div class="metric-value">${realizedGains.toFixed(2)}</div>
        </div>
      </div>

      {!showForm ? (
        <button class="btn-primary" onClick={() => setShowForm(true)}>+ Record Transaction</button>
      ) : (
        <form class="form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Symbol" value={form.symbol} onChange={(e: any) => setForm({ ...form, symbol: e.target.value.toUpperCase() })} required />
          <select value={form.type} onChange={(e: any) => setForm({ ...form, type: e.target.value })}>
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
            <option value="dividend">Dividend</option>
          </select>
          <input type="number" placeholder="Quantity" value={form.quantity} onChange={(e: any) => setForm({ ...form, quantity: parseFloat(e.target.value) })} step="0.0001" required />
          <input type="number" placeholder="Price per Unit" value={form.price} onChange={(e: any) => setForm({ ...form, price: parseFloat(e.target.value) })} step="0.01" required />
          <input type="date" value={form.date} onChange={(e: any) => setForm({ ...form, date: e.target.value })} required />
          <input type="text" placeholder="Notes (optional)" value={form.notes} onChange={(e: any) => setForm({ ...form, notes: e.target.value })} />
          <div class="form-actions">
            <button type="submit" class="btn-primary">Save Transaction</button>
            <button type="button" class="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div class="filter-controls">
        <select value={filter} onChange={(e: any) => setFilter(e.target.value)}>
          <option value="all">All Transactions</option>
          <option value="buy">Buys Only</option>
          <option value="sell">Sells Only</option>
          <option value="dividend">Dividends Only</option>
        </select>
        <input type="text" placeholder="Search symbol..." value={searchTerm} onChange={(e: any) => setSearchTerm(e.target.value)} class="search-input" />
      </div>

      <table class="transactions-table">
        <thead>
          <tr>
            <th>Date</th>
            <th>Symbol</th>
            <th>Type</th>
            <th>Quantity</th>
            <th>Price</th>
            <th>Total</th>
            <th>Notes</th>
          </tr>
        </thead>
        <tbody>
          {filtered.length === 0 ? (
            <tr><td colSpan={7} class="empty">No transactions</td></tr>
          ) : (
            filtered.sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()).map((t: any, idx: number) => (
              <tr key={idx} class={`type-${t.type}`}>
                <td>{new Date(t.date).toLocaleDateString()}</td>
                <td class="symbol">{t.symbol}</td>
                <td class="type">{t.type.toUpperCase()}</td>
                <td>{t.quantity}</td>
                <td>${t.price.toFixed(2)}</td>
                <td>${(t.quantity * t.price).toFixed(2)}</td>
                <td class="notes">{t.notes}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}