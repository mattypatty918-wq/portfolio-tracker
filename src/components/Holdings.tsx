import { useState } from 'preact/hooks';

interface HoldingForm {
  symbol: string;
  assetType: string;
  quantity: number;
  avgCost: number;
  currentPrice: number;
  notes: string;
}

export function Holdings({ holdings, onAdd, onDelete }: any) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<HoldingForm>({
    symbol: '',
    assetType: 'stock',
    quantity: 1,
    avgCost: 0,
    currentPrice: 0,
    notes: ''
  });

  const handleSubmit = (e: any) => {
    e.preventDefault();
    if (!form.symbol || form.quantity <= 0 || form.avgCost <= 0) {
      window.vellum.widgets.toast('Please fill all required fields', 'error');
      return;
    }
    onAdd(form);
    setForm({ symbol: '', assetType: 'stock', quantity: 1, avgCost: 0, currentPrice: 0, notes: '' });
    setShowForm(false);
  };

  return (
    <div class="holdings">
      {!showForm ? (
        <button class="btn-primary" onClick={() => setShowForm(true)}>+ Add Position</button>
      ) : (
        <form class="form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Symbol (e.g., AAPL)"
            value={form.symbol}
            onChange={(e: any) => setForm({ ...form, symbol: e.target.value.toUpperCase() })}
            required
          />
          <select value={form.assetType} onChange={(e: any) => setForm({ ...form, assetType: e.target.value })}>
            <option value="stock">Stock</option>
            <option value="crypto">Crypto</option>
            <option value="etf">ETF</option>
            <option value="bond">Bond</option>
          </select>
          <input
            type="number"
            placeholder="Quantity"
            value={form.quantity}
            onChange={(e: any) => setForm({ ...form, quantity: parseFloat(e.target.value) })}
            step="0.0001"
            required
          />
          <input
            type="number"
            placeholder="Avg Cost per Share"
            value={form.avgCost}
            onChange={(e: any) => setForm({ ...form, avgCost: parseFloat(e.target.value) })}
            step="0.01"
            required
          />
          <input
            type="number"
            placeholder="Current Price"
            value={form.currentPrice}
            onChange={(e: any) => setForm({ ...form, currentPrice: parseFloat(e.target.value) })}
            step="0.01"
            required
          />
          <input
            type="text"
            placeholder="Notes (optional)"
            value={form.notes}
            onChange={(e: any) => setForm({ ...form, notes: e.target.value })}
          />
          <div class="form-actions">
            <button type="submit" class="btn-primary">Save Position</button>
            <button type="button" class="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div class="holdings-list">
        {holdings.length === 0 ? (
          <div class="empty-state">📭 No positions yet. Add your first holding above.</div>
        ) : (
          <table class="holdings-table">
            <thead>
              <tr>
                <th>Symbol</th>
                <th>Type</th>
                <th>Qty</th>
                <th>Avg Cost</th>
                <th>Current</th>
                <th>Value</th>
                <th>Gain/Loss</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {holdings.map((h: any) => {
                const value = h.quantity * h.currentPrice;
                const gainLoss = value - (h.quantity * h.avgCost);
                const gainLossPercent = ((gainLoss / (h.quantity * h.avgCost)) * 100).toFixed(2);
                return (
                  <tr key={h.id}>
                    <td class="symbol">{h.symbol}</td>
                    <td>{h.assetType}</td>
                    <td>{h.quantity}</td>
                    <td>${h.avgCost.toFixed(2)}</td>
                    <td>${h.currentPrice.toFixed(2)}</td>
                    <td>${value.toFixed(2)}</td>
                    <td class={gainLoss >= 0 ? 'positive' : 'negative'}>
                      ${gainLoss.toFixed(2)} ({gainLossPercent}%)
                    </td>
                    <td>
                      <button class="btn-delete" onClick={() => onDelete(h.id)}>🗑️</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}