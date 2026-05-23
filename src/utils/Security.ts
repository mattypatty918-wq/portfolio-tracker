// Phase 9: Security & Compliance (201-225)

export class SecurityManager {
  private sessionTimeout: number = 30 * 60 * 1000; // 30 minutes
  private sessionTimer: any = null;
  private auditLog: any[] = [];

  init() {
    this.setupSessionManagement();
    this.setupAuditLogging();
  }

  setupSessionManagement() {
    // Auto-logout after inactivity
    document.addEventListener('mousemove', () => this.resetSessionTimer());
    document.addEventListener('keypress', () => this.resetSessionTimer());
  }

  resetSessionTimer() {
    if (this.sessionTimer) clearTimeout(this.sessionTimer);
    
    this.sessionTimer = setTimeout(() => {
      this.logout('Session expired');
    }, this.sessionTimeout);
  }

  logout(reason: string = 'User logout') {
    this.logAuditEvent('logout', { reason });
    localStorage.removeItem('authToken');
    localStorage.removeItem('sessionId');
    window.location.href = '/login';
  }

  logAuditEvent(action: string, details: any = {}) {
    const event = {
      timestamp: new Date(),
      action,
      details,
      userAgent: navigator.userAgent,
      ip: 'unknown' // Would come from server
    };
    
    this.auditLog.push(event);
    this.persistAuditLog();
  }

  persistAuditLog() {
    // Keep only last 1000 events
    const recent = this.auditLog.slice(-1000);
    localStorage.setItem('auditLog', JSON.stringify(recent));
  }

  getAuditLog() {
    return this.auditLog;
  }

  enableTwoFactorAuth(method: 'email' | 'sms' | 'authenticator') {
    this.logAuditEvent('enable_2fa', { method });
    // Would trigger 2FA setup flow
    return { success: true, secret: 'simulated_secret_key' };
  }

  validateTwoFactor(code: string): boolean {
    // Would validate TOTP or similar
    return code.length === 6 && /^\d+$/.test(code);
  }

  encryptSensitiveData(data: string, key?: string): string {
    // Simple encoding for demo (real implementation would use crypto libraries)
    return btoa(data); // Base64 encoding
  }

  decryptSensitiveData(encrypted: string, key?: string): string {
    try {
      return atob(encrypted);
    } catch {
      return '';
    }
  }

  generateSecurityToken(): string {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let token = '';
    for (let i = 0; i < 64; i++) {
      token += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return token;
  }

  validatePassword(password: string): { valid: boolean; errors: string[] } {
    const errors: string[] = [];
    
    if (password.length < 12) errors.push('Password must be at least 12 characters');
    if (!/[A-Z]/.test(password)) errors.push('Password must contain uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('Password must contain lowercase letter');
    if (!/[0-9]/.test(password)) errors.push('Password must contain number');
    if (!/[!@#$%^&*]/.test(password)) errors.push('Password must contain special character');

    return { valid: errors.length === 0, errors };
  }

  // GDPR Compliance
  exportUserData() {
    const data = {
      settings: JSON.parse(localStorage.getItem('settings') || '{}'),
      holdings: JSON.parse(localStorage.getItem('holdings') || '[]'),
      transactions: JSON.parse(localStorage.getItem('transactions') || '[]'),
      auditLog: this.auditLog
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `personal-data-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  }

  deleteUserData() {
    this.logAuditEvent('request_data_deletion');
    // Would trigger proper deletion process
    return { status: 'deletion_requested', estimatedDays: 30 };
  }

  enableBiometric() {
    if (window.PublicKeyCredential) {
      return { supported: true, method: 'WebAuthn' };
    }
    return { supported: false };
  }

  // Data backup
  createBackup() {
    const backup = {
      timestamp: new Date(),
      version: '1.0',
      data: {
        holdings: localStorage.getItem('holdings'),
        transactions: localStorage.getItem('transactions'),
        watchlist: localStorage.getItem('watchlist'),
        auditLog: this.auditLog
      }
    };

    const blob = new Blob([JSON.stringify(backup)], { type: 'application/json' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
  }

  restoreFromBackup(file: File): Promise<{ success: boolean; message: string }> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const backup = JSON.parse(e.target?.result as string);
          
          if (backup.data.holdings) localStorage.setItem('holdings', backup.data.holdings);
          if (backup.data.transactions) localStorage.setItem('transactions', backup.data.transactions);
          if (backup.data.watchlist) localStorage.setItem('watchlist', backup.data.watchlist);
          
          this.logAuditEvent('restore_backup', { timestamp: backup.timestamp });
          resolve({ success: true, message: 'Backup restored successfully' });
        } catch (err) {
          resolve({ success: false, message: 'Invalid backup file' });
        }
      };
      reader.readAsText(file);
    });
  }
}

export const security = new SecurityManager();
