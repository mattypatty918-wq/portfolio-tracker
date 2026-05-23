# Portfolio Tracker - Deployment Guide

## Quick Start (Local Development)

```bash
git clone https://github.com/mattypatty918-wq/portfolio-tracker.git
cd portfolio-tracker
npm install
npm run dev
```

Visit `http://localhost:5173` (Vite default port)

---

## Deployment Options

### Option 1: Vercel (Recommended - Zero Config)
**Benefits:** Zero-config, serverless, auto-scaling, free tier, built-in CI/CD

```bash
npm i -g vercel
vercel
```

Your app goes live instantly at `portfolio-tracker-{username}.vercel.app`

### Option 2: Netlify
```bash
npm i -g netlify-cli
netlify deploy --prod --dir=dist
```

### Option 3: Docker + Cloud Run (Google Cloud)

```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build
EXPOSE 3000
ENV NODE_ENV=production
CMD ["npm", "run", "preview"]
```

Deploy:
```bash
gcloud builds submit --tag gcr.io/PROJECT_ID/portfolio-tracker
gcloud run deploy portfolio-tracker --image gcr.io/PROJECT_ID/portfolio-tracker
```

### Option 4: AWS Lambda (Serverless)

Uses SAM template - runs on Lambda + API Gateway, pay only for requests

### Option 5: Traditional VPS (DigitalOcean, Linode, AWS EC2)

```bash
ssh user@your-server.com
git clone https://github.com/mattypatty918-wq/portfolio-tracker.git
cd portfolio-tracker
npm install
npm run build
npm i -g pm2
pm2 start "npm run preview" --name "portfolio-tracker"
pm2 save && pm2 startup
```

---

## Environment Variables

Create `.env.local`:

```env
# API Integration Keys (optional)
VITE_ALPHA_VANTAGE_KEY=your_key
VITE_IEX_CLOUD_KEY=your_key
VITE_FINNHUB_KEY=your_key
VITE_NEWSAPI_KEY=your_key
VITE_FRED_API_KEY=your_key

# Database (if using real backend)
DATABASE_URL=postgresql://user:pass@localhost/portfolio_tracker
DATABASE_POOL_SIZE=20

# Authentication
JWT_SECRET=your_super_secret_key
SESSION_SECRET=another_secret

# Encryption
ENCRYPTION_KEY=32_character_base64_encoded_key

# Security
CORS_ORIGIN=https://yourdomain.com
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## Production Checklist

### Infrastructure
- [ ] Enable HTTPS/TLS (Let's Encrypt free)
- [ ] Configure firewall rules (ufw/iptables)
- [ ] Set up VPN for admin access
- [ ] Enable DDoS protection (Cloudflare)

### Application
- [ ] CORS configured properly
- [ ] Rate limiting enabled (100 req/15min per IP)
- [ ] Request validation on all endpoints
- [ ] Error logging to Sentry/DataDog
- [ ] Audit logging enabled

### Data
- [ ] Database backups (daily)
- [ ] Automated backup rotation
- [ ] Backup recovery testing
- [ ] Data encryption at rest (AES-256)

### Security
- [ ] Password hashing with bcrypt (12 rounds)
- [ ] 2FA implementation
- [ ] API key rotation strategy
- [ ] Secrets management (AWS Secrets Manager/Vault)
- [ ] SSL/TLS certificate monitoring

### Monitoring
- [ ] Uptime monitoring (StatusPage)
- [ ] Performance monitoring (New Relic)
- [ ] Error tracking (Sentry)
- [ ] Log aggregation (CloudWatch/ELK)
- [ ] Alerting rules configured

---

## Performance Optimization

### Build Size Analysis
```bash
npm run analyze
```

Current metrics:
- Main bundle: ~85KB (gzipped)
- Preact core: ~4KB
- Zero external dependencies (lightweight)
- CSS: ~12KB

### Caching Strategy

```javascript
// Service Worker for offline support
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/sw.js').then(reg => {
    console.log('Service Worker registered');
  });
}
```

### Database Query Optimization
```sql
-- Add indexes for frequent queries
CREATE INDEX idx_holdings_user_id ON holdings(user_id);
CREATE INDEX idx_transactions_user_id ON transactions(user_id);
CREATE INDEX idx_snapshots_user_id_date ON snapshots(user_id, recorded_at DESC);
```

### CDN Setup
```javascript
// Use CDN for static assets
const cdnUrl = 'https://cdn.portfolio-tracker.com';
// Point /dist/* to CDN in production
```

---

## Monitoring & Observability

### Recommended Services
| Service | Purpose | Cost |
|---------|---------|------|
| Sentry | Error tracking | $29/month |
| New Relic | Performance monitoring | Free tier |
| Plausible | Privacy-focused analytics | $29/month |
| StatusPage | Uptime monitoring | $29/month |
| PagerDuty | On-call alerting | $29/month |

### Health Check Endpoint
```bash
curl https://api.portfolio-tracker.com/health
# Returns: { status: "ok", uptime: 3600, version: "1.0.0" }
```

### Key Metrics to Monitor
- Page load time (target: <2s)
- API response time (target: <500ms)
- Error rate (target: <0.1%)
- Database connection pool usage
- Memory usage
- CPU usage

---

## Database Backup Strategy

### Automated Daily Backups
```bash
# Add to crontab
0 2 * * * /usr/local/bin/backup-portfolio-tracker.sh
```

### Backup Script
```bash
#!/bin/bash
DATE=$(date +%Y-%m-%d)
BACKUP_DIR="/backups/portfolio-tracker"
mkdir -p $BACKUP_DIR

# PostgreSQL backup
pg_dump portfolio_tracker > $BACKUP_DIR/db_$DATE.sql

# Compress
gzip $BACKUP_DIR/db_$DATE.sql

# Upload to S3
aws s3 cp $BACKUP_DIR/db_$DATE.sql.gz s3://portfolio-tracker-backups/

# Keep only last 30 days
find $BACKUP_DIR -name "db_*.sql.gz" -mtime +30 -delete
```

### Restore Procedure
```bash
# From S3
aws s3 cp s3://portfolio-tracker-backups/db_2026-05-23.sql.gz .
gunzip db_2026-05-23.sql.gz

# Restore to database
psql portfolio_tracker < db_2026-05-23.sql
```

---

## Security Hardening

### API Rate Limiting
```typescript
import rateLimit from 'express-rate-limit';

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per 15 min
  message: 'Too many requests',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);
```

### HTTPS Enforcement
```typescript
app.use((req, res, next) => {
  if (req.header('x-forwarded-proto') !== 'https') {
    return res.redirect(301, `https://${req.get('host')}${req.originalUrl}`);
  }
  next();
});
```

### Security Headers
```typescript
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', 
    "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'");
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
  next();
});
```

### CORS Configuration
```typescript
app.use(cors({
  origin: process.env.CORS_ORIGIN,
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  maxAge: 3600
}));
```

---

## Scaling Architecture

### Phase 1: Single Server (0-1000 users)
- Single Node.js instance
- SQLite or single PostgreSQL
- Local file storage

### Phase 2: Database Separation (1000-10k users)
- Load balancer (Nginx)
- 2-3 app instances
- Dedicated PostgreSQL server
- Redis cache layer

### Phase 3: Horizontal Scaling (10k+ users)
- Auto-scaling groups
- Read replicas for analytics
- Write master for transactions
- Separate API/background job servers
- ElasticSearch for search

### Phase 4: Global Scaling (100k+ users)
- Multi-region deployment
- Database replication
- CDN for static files
- Micro-services architecture
- Message queue for async jobs

---

## Maintenance Schedule

### Daily
- Monitor error logs
- Check system health
- Verify backups completed

### Weekly
- Review performance metrics
- Check security alerts
- Update dependencies (minor)

### Monthly
- Full security audit
- Capacity planning
- User feedback review
- Documentation update

### Quarterly
- Major version upgrades
- Performance optimization
- Security penetration test
- Disaster recovery drill

---

## Rollback Procedure

### If Deployment Fails
```bash
# Check deployment history
git log --oneline | head -10

# Revert to last stable version
git revert HEAD --no-edit
git push origin master

# Or use blue-green deployment
kubectl rollout undo deployment/portfolio-tracker
```

### Zero-Downtime Deployments
```bash
# Using Kubernetes
kubectl set image deployment/portfolio-tracker \
  app=portfolio-tracker:v2.0.0 --record
  
# Wait for health checks
kubectl rollout status deployment/portfolio-tracker
```

---

## Support & Troubleshooting

### Common Issues

**High Memory Usage**
```bash
# Check process memory
ps aux | grep node
# Restart service
systemctl restart portfolio-tracker
```

**Slow Database Queries**
```sql
-- Check slow query log
SELECT query, time FROM mysql.slow_log ORDER BY time DESC;
-- Add missing indexes
ANALYZE TABLE holdings, transactions;
```

**API Rate Limiting Too Strict**
```env
# Adjust in .env
RATE_LIMIT_MAX_REQUESTS=200
RATE_LIMIT_WINDOW_MS=600000
```

### Getting Help
- **Issues:** GitHub Issues (https://github.com/mattypatty918-wq/portfolio-tracker/issues)
- **Discussions:** GitHub Discussions
- **Security:** security@portfolio-tracker.dev
- **Status:** https://status.portfolio-tracker.com

---

## License

MIT License - See LICENSE file in repository

Generated: May 23, 2026
