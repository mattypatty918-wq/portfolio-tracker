// Phase 5: Advanced Features (101-125)
import { useState } from 'preact/hooks';

export function AdvancedFeatures({ holdings }: any) {
  const [featureTab, setFeatureTab] = useState('options');

  return (
    <div class="advanced-features">
      <div class="feature-tabs">
        <button class={`tab ${featureTab === 'options' ? 'active' : ''}`} onClick={() => setFeatureTab('options')}>Options</button>
        <button class={`tab ${featureTab === 'crypto' ? 'active' : ''}`} onClick={() => setFeatureTab('crypto')}>Crypto</button>
        <button class={`tab ${featureTab === 'bonds' ? 'active' : ''}`} onClick={() => setFeatureTab('bonds')}>Bonds</button>
        <button class={`tab ${featureTab === 'margin' ? 'active' : ''}`} onClick={() => setFeatureTab('margin')}>Margin</button>
      </div>

      {featureTab === 'options' && (
        <div class="feature-content">
          <h3>Options Portfolio</h3>
          <div class="info-box">
            <p>Track covered calls, spreads, collars, and other option strategies.</p>
            <div class="features-list">
              <div>✓ Covered Call Portfolio</div>
              <div>✓ Collar Strategy</div>
              <div>✓ Put/Call Spreads</div>
              <div>✓ Greeks Calculation (Delta, Gamma, Theta, Vega)</div>
              <div>✓ Options Chain Data</div>
            </div>
          </div>
        </div>
      )}

      {featureTab === 'crypto' && (
        <div class="feature-content">
          <h3>Cryptocurrency Tracking</h3>
          <div class="info-box">
            <p>Monitor crypto holdings and staking rewards.</p>
            <div class="features-list">
              <div>✓ Real-time Crypto Prices</div>
              <div>✓ Staking Rewards Tracking</div>
              <div>✓ Multi-chain Support</div>
              <div>✓ DeFi Protocol Integration</div>
              <div>✓ Tax Loss Harvesting</div>
            </div>
          </div>
        </div>
      )}

      {featureTab === 'bonds' && (
        <div class="feature-content">
          <h3>Fixed Income Analysis</h3>
          <div class="info-box">
            <p>Advanced bond portfolio analytics.</p>
            <div class="features-list">
              <div>✓ Duration Analysis</div>
              <div>✓ Yield Curve Tracking</div>
              <div>✓ Credit Rating Integration</div>
              <div>✓ Interest Rate Risk</div>
              <div>✓ Convexity Analysis</div>
            </div>
          </div>
        </div>
      )}

      {featureTab === 'margin' && (
        <div class="feature-content">
          <h3>Margin & Leverage</h3>
          <div class="info-box">
            <p>Track leveraged positions and margin requirements.</p>
            <div class="features-list">
              <div>✓ Margin Account Tracking</div>
              <div>✓ Leverage Calculation</div>
              <div>✓ Short Position Monitoring</div>
              <div>✓ Interest Costs Tracking</div>
              <div>✓ Margin Call Alerts</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
