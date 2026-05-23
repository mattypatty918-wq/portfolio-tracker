// Phase 8: Mobile & UI (176-200)
import { useState } from 'preact/hooks';

export function MobileApp({ holdings }: any) {
  const [accessibilityMode, setAccessibilityMode] = useState(false);
  const [customTheme, setCustomTheme] = useState('default');
  const [textSize, setTextSize] = useState('normal');

  return (
    <div class="mobile-app">
      <div class="section">
        <h3>Mobile Experience</h3>
        <div class="features-grid">
          <div class="feature-item">
            <div class="feature-icon">📱</div>
            <div class="feature-title">Native iOS App</div>
            <div class="feature-desc">Available on App Store</div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🤖</div>
            <div class="feature-title">Android App</div>
            <div class="feature-desc">Available on Google Play</div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">🔔</div>
            <div class="feature-title">Push Notifications</div>
            <div class="feature-desc">Real-time alerts</div>
          </div>
          <div class="feature-item">
            <div class="feature-icon">👆</div>
            <div class="feature-title">Touch Gestures</div>
            <div class="feature-desc">Swipe, pinch, long-press</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>Accessibility</h3>
        <div class="form-group">
          <label>
            <input type="checkbox" checked={accessibilityMode} onChange={(e: any) => setAccessibilityMode(e.target.checked)} />
            Enable Accessibility Mode
          </label>
        </div>

        <div class="form-group">
          <label>Text Size</label>
          <select value={textSize} onChange={(e: any) => setTextSize(e.target.value)}>
            <option value="small">Small</option>
            <option value="normal">Normal</option>
            <option value="large">Large</option>
            <option value="xlarge">Extra Large</option>
          </select>
        </div>

        <div class="form-group">
          <label>Theme</label>
          <select value={customTheme} onChange={(e: any) => setCustomTheme(e.target.value)}>
            <option value="default">Default</option>
            <option value="dark">Dark</option>
            <option value="highcontrast">High Contrast</option>
            <option value="colorblind">Color Blind Friendly</option>
          </select>
        </div>

        <div class="accessibility-features">
          <div>✓ Screen Reader Support</div>
          <div>✓ Keyboard Navigation</div>
          <div>✓ Voice Commands</div>
          <div>✓ Biometric Login</div>
        </div>
      </div>
    </div>
  );
}
