// Phase 5: Advanced Features (101-125)
// Options, Crypto, Margin, Leverage, Bonds

import { useState } from 'preact/hooks';

export function AdvancedPositions({ holdings }: any) {
  const [positionType, setPositionType] = useState('stocks');
  const [showForm, setShowForm] = useState(false);

  // Separate holdings by type
  const stocks = holdings.filter((h: any) => h.assetType === 'stock');
  const cryptos = holdings.filter((h: any) => h.assetType === 'crypto');
  const options = holdings.filter((h: any) => h.assetType === 'option');
  const bonds = holdings.filter((h: any) => h.assetType === 'bond');
  const margins = holdings.filter((h: any) => h.leveraged === true);

  // Options Greeks calculator (simplified Black-Scholes)
  const calculateGreeks = (option: any) => {
    const S = option.currentPrice; // Stock price
    const K = option.strikePrice; // Strike price
    const T = option.daysToExpiry / 365; // Time to expiry
    const r = 0.02; // Risk-free rate
    const sigma = 0.2; // Volatility

    // Simplified delta
    const delta = (S - K) / (S * 2);
    
    // Simplified theta (time decay per day)
    const theta = -0.05 / T;
    
    // Simplified vega (change per 1% volatility)
    const vega = S * Math.sqrt(T) * 0.01;
    
    // Simplified gamma
    const gamma = 1 / (S * sigma * Math.sqrt(T));

    return { delta, theta, vega, gamma };
  };

  // Margin calculator
  const calculateMarginRequirement = (position: any) => {
    const value = position.quantity * position.currentPrice;
    const marginPercent = position.marginRate || 0.5; // 50% margin by default
    return value * marginPercent;
  };

  // Bond duration calculator
  const calculateDuration = (bond: any) => {
    if (!bond.couponRate || !bond.yearsToMaturity) return 0;
    const duration = bond.yearsToMaturity * (1 + bond.couponRate) / (1 + bond.currentPrice);
    return duration;
  };

  // Staking rewards calculator (for crypto)
  const calculateStakingRewards = (crypto: any) => {
    const dailyRate = (crypto.stakingAPY || 5) / 365 / 100;
    const monthlyReward = crypto.quantity * crypto.currentPrice * dailyRate * 30;
    const yearlyReward = crypto.quantity * crypto.currentPrice * dailyRate * 365;
    return { daily: crypto.quantity * crypto.currentPrice * dailyRate, monthly: monthlyReward, yearly: yearlyReward };
  };

  const [form, setForm] = useState({
    symbol: '',
    assetType: positionType,
    quantity: 0,
    currentPrice: 0,
    strikePrice: 0,
    daysToExpiry: 30,
    couponRate: 0,
    yearsToMaturity: 5,
    stakingAPY: 5,
    leverageRatio: 1,
    marginRate: 50
  });

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    try {
      const res = await window.vellum.fetch('/v1/x/portfolio?resource=holdings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        window.vellum.widgets.toast(`${form.assetType} position added!`, 'success');
        setShowForm(false);
      }
    } catch (err) {
      window.vellum.widgets.toast('Failed to add position', 'error');
    }
  };

  return (
    <div class="advanced-positions">
      <div class="position-type-selector">
        <button class={`type-btn ${positionType === 'stocks' ? 'active' : ''}`} onClick={() => setPositionType('stocks')}>
          📈 Stocks ({stocks.length})
        </button>
        <button class={`type-btn ${positionType === 'crypto' ? 'active' : ''}`} onClick={() => setPositionType('crypto')}>
          ₿ Crypto ({cryptos.length})
        </button>
        <button class={`type-btn ${positionType === 'option' ? 'active' : ''}`} onClick={() => setPositionType('option')}>
          📊 Options ({options.length})
        </button>
        <button class={`type-btn ${positionType === 'bond' ? 'active' : ''}`} onClick={() => setPositionType('bond')}>
          🔐 Bonds ({bonds.length})
        </button>
        <button class={`type-btn ${positionType === 'margin' ? 'active' : ''}`} onClick={() => setPositionType('margin')}>
          ⚡ Margin ({margins.length})
        </button>
      </div>

      {!showForm ? (
        <button class="btn-primary" onClick={() => setShowForm(true)}>+ Add {positionType}</button>
      ) : (
        <form class="advanced-form" onSubmit={handleSubmit}>
          <input type="text" placeholder="Symbol" value={form.symbol} onChange={(e: any) => setForm({ ...form, symbol: e.target.value.toUpperCase() })} required />
          <input type="number" placeholder="Quantity" value={form.quantity} onChange={(e: any) => setForm({ ...form, quantity: parseFloat(e.target.value) })} step="0.0001" required />
          <input type="number" placeholder="Current Price" value={form.currentPrice} onChange={(e: any) => setForm({ ...form, currentPrice: parseFloat(e.target.value) })} step="0.01" required />
          
          {positionType === 'option' && (
            <>
              <input type="number" placeholder="Strike Price" value={form.strikePrice} onChange={(e: any) => setForm({ ...form, strikePrice: parseFloat(e.target.value) })} step="0.01" />
              <input type="number" placeholder="Days to Expiry" value={form.daysToExpiry} onChange={(e: any) => setForm({ ...form, daysToExpiry: parseFloat(e.target.value) })} />
            </>
          )}

          {positionType === 'bond' && (
            <>
              <input type="number" placeholder="Coupon Rate (%)" value={form.couponRate} onChange={(e: any) => setForm({ ...form, couponRate: parseFloat(e.target.value) })} step="0.01" />
              <input type="number" placeholder="Years to Maturity" value={form.yearsToMaturity} onChange={(e: any) => setForm({ ...form, yearsToMaturity: parseFloat(e.target.value) })} step="0.1" />
            </>
          )}

          {positionType === 'crypto' && (
            <input type="number" placeholder="Staking APY (%)" value={form.stakingAPY} onChange={(e: any) => setForm({ ...form, stakingAPY: parseFloat(e.target.value) })} step="0.1" />
          )}

          {positionType === 'margin' && (
            <>
              <input type="number" placeholder="Leverage Ratio" value={form.leverageRatio} onChange={(e: any) => setForm({ ...form, leverageRatio: parseFloat(e.target.value) })} step="0.1" />
              <input type="number" placeholder="Margin Rate (%)" value={form.marginRate} onChange={(e: any) => setForm({ ...form, marginRate: parseFloat(e.target.value) })} step="1" />
            </>
          )}

          <div class="form-actions">
            <button type="submit" class="btn-primary">Save Position</button>
            <button type="button" class="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </form>
      )}

      <div class="positions-list">
        {positionType === 'option' && options.map((opt: any) => {
          const greeks = calculateGreeks(opt);
          return (
            <div key={opt.id} class="position-card option-card">
              <div class="position-header">
                <div class="symbol">{opt.symbol}</div>
                <div class="type">OPTION</div>
              </div>
              <div class="position-details">
                <div class="detail">Strike: ${opt.strikePrice?.toFixed(2)}</div>
                <div class="detail">Expires: {opt.daysToExpiry} days</div>
              </div>
              <div class="greeks">
                <div class="greek">Δ {greeks.delta.toFixed(3)}</div>
                <div class="greek">Θ {greeks.theta.toFixed(3)}</div>
                <div class="greek">ν {greeks.vega.toFixed(3)}</div>
                <div class="greek">Γ {greeks.gamma.toFixed(3)}</div>
              </div>
            </div>
          );
        })}

        {positionType === 'crypto' && cryptos.map((c: any) => {
          const rewards = calculateStakingRewards(c);
          return (
            <div key={c.id} class="position-card crypto-card">
              <div class="position-header">
                <div class="symbol">{c.symbol}</div>
                <div class="price">${c.currentPrice.toFixed(2)}</div>
              </div>
              <div class="position-details">
                <div class="detail">Holdings: {c.quantity}</div>
                <div class="detail">Value: ${(c.quantity * c.currentPrice).toFixed(2)}</div>
              </div>
              {c.stakingAPY && (
                <div class="staking-rewards">
                  <div class="reward">Daily: ${rewards.daily.toFixed(2)}</div>
                  <div class="reward">Monthly: ${rewards.monthly.toFixed(2)}</div>
                  <div class="reward">Yearly: ${rewards.yearly.toFixed(2)}</div>
                </div>
              )}
            </div>
          );
        })}

        {positionType === 'bond' && bonds.map((b: any) => {
          const duration = calculateDuration(b);
          return (
            <div key={b.id} class="position-card bond-card">
              <div class="position-header">
                <div class="symbol">{b.symbol}</div>
                <div class="yield">{b.couponRate?.toFixed(2)}%</div>
              </div>
              <div class="position-details">
                <div class="detail">Matures: {b.yearsToMaturity} years</div>
                <div class="detail">Duration: {duration.toFixed(2)} years</div>
              </div>
              <div class="bond-metrics">
                <div class="metric">Face Value: ${(b.quantity * 1000).toFixed(2)}</div>
              </div>
            </div>
          );
        })}

        {positionType === 'margin' && margins.map((m: any) => {
          const requirement = calculateMarginRequirement(m);
          return (
            <div key={m.id} class="position-card margin-card">
              <div class="position-header">
                <div class="symbol">{m.symbol}</div>
                <div class={`leverage ${m.leverageRatio > 2 ? 'high-risk' : ''}`}>
                  {m.leverageRatio}x
                </div>
              </div>
              <div class="position-details">
                <div class="detail">Position: ${(m.quantity * m.currentPrice).toFixed(2)}</div>
                <div class="detail">Margin Req: ${requirement.toFixed(2)}</div>
              </div>
            </div>
          );
        })}

        {positionType === 'stocks' && stocks.map((s: any) => (
          <div key={s.id} class="position-card stock-card">
            <div class="position-header">
              <div class="symbol">{s.symbol}</div>
              <div class="price">${s.currentPrice.toFixed(2)}</div>
            </div>
            <div class="position-details">
              <div class="detail">Qty: {s.quantity}</div>
              <div class="detail">Value: ${(s.quantity * s.currentPrice).toFixed(2)}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
