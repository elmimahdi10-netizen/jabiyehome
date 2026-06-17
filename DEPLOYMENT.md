# Jabiyehome — Deployment Guide (Hostinger VPS)

## Prerequisites
- Node.js 20+ on VPS
- PostgreSQL 15+ database on Hostinger
- PM2 for process management
- Nginx as reverse proxy

## Initial VPS Setup

```bash
# 1. Install Node.js 20
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt-get install -y nodejs

# 2. Install PM2
npm install -g pm2

# 3. Clone repo
git clone https://github.com/your-org/Jabiyehome.git /var/www/Jabiyehome
cd /var/www/Jabiyehome

# 4. Create .env.local from .env.example and fill in values
cp .env.example .env.local
nano .env.local

# 5. Install dependencies
npm ci

# 6. Generate Prisma client
npx prisma generate

# 7. Run migrations
npx prisma migrate deploy

# 8. Seed initial data
npx ts-node prisma/seed.ts

# 9. Build
npm run build

# 10. Start with PM2
pm2 start npm --name Jabiyehome -- start
pm2 startup
pm2 save
```

## Nginx Configuration

```nginx
server {
    listen 80;
    server_name Jabiyehome.com www.Jabiyehome.com;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name Jabiyehome.com;

    ssl_certificate /etc/letsencrypt/live/Jabiyehome.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/Jabiyehome.com/privkey.pem;

    # Security headers (additional to app-level headers)
    add_header X-Frame-Options DENY always;
    add_header X-Content-Type-Options nosniff always;

    # Proxy to Next.js
    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    # Cache static Next.js files
    location /_next/static/ {
        proxy_pass http://localhost:3000;
        add_header Cache-Control "public, max-age=31536000, immutable";
    }
}
```

## Stripe Webhooks

Register your webhook endpoint in the Stripe dashboard:
- URL: `https://Jabiyehome.com/api/webhooks/stripe`
- Events: `checkout.session.completed`, `payment_intent.payment_failed`, `charge.refunded`

## Environment Variables

All secrets are set in `.env.local` on the server. See `.env.example` for required variables.

## GitHub Actions Deployment

Add these secrets to your GitHub repository (Settings → Secrets):
- `DATABASE_URL`
- `AUTH_SECRET`
- `VPS_HOST`
- `VPS_USER`
- `VPS_SSH_KEY`

The CI/CD pipeline (`.github/workflows/ci.yml`) automatically:
1. Type-checks and lints on every push
2. Builds on every PR
3. Runs migrations on merge to main
4. Deploys to VPS via SSH on merge to main
