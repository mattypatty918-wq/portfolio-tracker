// Phase 7: Social & Collaboration (151-175)
import { useState } from 'preact/hooks';

export function Social({ holdings }: any) {
  const [shareType, setShareType] = useState('private');
  const [portfolioVisibility, setPortfolioVisibility] = useState('private');

  const totalValue = holdings.reduce((sum: number, h: any) => sum + (h.quantity * h.currentPrice), 0);
  const totalCost = holdings.reduce((sum: number, h: any) => sum + (h.quantity * h.avgCost), 0);
  const return_ = ((totalValue - totalCost) / totalCost * 100).toFixed(2);

  return (
    <div class="social">
      <div class="section">
        <h3>Share Your Portfolio</h3>
        <div class="form-group">
          <label>Visibility</label>
          <select value={portfolioVisibility} onChange={(e: any) => setPortfolioVisibility(e.target.value)}>
            <option value="private">Private (Only me)</option>
            <option value="link">Shareable Link</option>
            <option value="public">Public Profile</option>
            <option value="anonymous">Anonymous (Performance only)</option>
          </select>
        </div>

        <div class="share-options">
          <button class="btn-primary">Generate Share Link</button>
          <button class="btn-secondary">Copy Portfolio Link</button>
        </div>
      </div>

      <div class="section">
        <h3>Community & Leaderboards</h3>
        <div class="leaderboards">
          <div class="leaderboard">
            <h4>🏆 Monthly Leaders</h4>
            <div class="rank">1. Portfolio A: +15.2%</div>
            <div class="rank">2. Portfolio B: +12.8%</div>
            <div class="rank">3. Portfolio C: +10.1%</div>
          </div>
          <div class="leaderboard">
            <h4>📈 YTD Leaders</h4>
            <div class="rank">1. Portfolio X: +32.5%</div>
            <div class="rank">2. Portfolio Y: +28.3%</div>
            <div class="rank">3. Portfolio Z: +24.7%</div>
          </div>
        </div>
      </div>

      <div class="section">
        <h3>Collaboration</h3>
        <div class="collaboration-features">
          <div class="feature">✓ Multiple Users per Portfolio</div>
          <div class="feature">✓ Role-Based Permissions (Viewer/Editor/Admin)</div>
          <div class="feature">✓ Discussion Threads</div>
          <div class="feature">✓ Portfolio Comparison</div>
          <div class="feature">✓ Strategy Cloning</div>
        </div>
      </div>
    </div>
  );
}
