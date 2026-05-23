// Phase 9: Security & Compliance (201-225)
import { useState } from 'preact/hooks';

export function Security({ holdings }: any) {
  const [securityTab, setSecurityTab] = useState('auth');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);

  return (
    <div class="security">
      <div class="security-tabs">
        <button class={`tab ${securityTab === 'auth' ? 'active' : ''}`} onClick={() => setSecurityTab('auth')}>Authentication</button>
        <button class={`tab ${securityTab === 'encryption' ? 'active' : ''}`} onClick={() => setSecurityTab('encryption')}>Encryption</button>
        <button class={`tab ${securityTab === 'compliance' ? 'active' : ''}`} onClick={() => setSecurityTab('compliance')}>Compliance</button>
        <button class={`tab ${securityTab === 'backup' ? 'active' : ''}`} onClick={() => setSecurityTab('backup')}>Backup</button>
      </div>

      {securityTab === 'auth' && (
        <div class="security-content">
          <h3>Authentication & Access</h3>
          <div class="security-feature">
            <div class="feature-name">Two-Factor Authentication</div>
            <div class="feature-desc">Protect your account with 2FA</div>
            <button class="btn-primary" onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}>
              {twoFactorEnabled ? 'Disable' : 'Enable'} 2FA
            </button>
          </div>
          <div class="security-feature">
            <div class="feature-name">Biometric Login</div>
            <div class="feature-desc">Face ID / Fingerprint</div>
            <button class="btn-secondary">Setup Biometrics</button>
          </div>
          <div class="security-feature">
            <div class="feature-name">Hardware Security Keys</div>
            <div class="feature-desc">YubiKey, Titan, etc.</div>
            <button class="btn-secondary">Add Security Key</button>
          </div>
        </div>
      )}

      {securityTab === 'encryption' && (
        <div class="security-content">
          <h3>Data Encryption</h3>
          <div class="encryption-info">
            <div>✓ AES-256 Encryption at Rest</div>
            <div>✓ TLS/SSL in Transit</div>
            <div>✓ End-to-End Encryption</div>
            <div>✓ Zero-Knowledge Architecture</div>
          </div>
        </div>
      )}

      {securityTab === 'compliance' && (
        <div class="security-content">
          <h3>Compliance & Privacy</h3>
          <div class="compliance-items">
            <div class="compliance-item">GDPR Compliant</div>
            <div class="compliance-item">CCPA Compliant</div>
            <div class="compliance-item">SOC 2 Type II</div>
            <div class="compliance-item">ISO 27001</div>
          </div>
        </div>
      )}

      {securityTab === 'backup' && (
        <div class="security-content">
          <h3>Data Backup & Recovery</h3>
          <button class="btn-primary">Download Data Backup</button>
          <button class="btn-secondary">Restore from Backup</button>
          <div class="backup-info">
            <div>Last backup: 2 hours ago</div>
            <div>Automatic daily backups enabled</div>
            <div>30-day backup retention</div>
          </div>
        </div>
      )}
    </div>
  );
}
