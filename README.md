# AI STAFFING AGENCY

AI Agent Staffing - deploy virtual employee fleets for businesses

## Features
- AI-powered automation
- SaaS ready
- Scalable architecture
- Stripe integration ready

## Tech Stack
- Claude API (Sonnet 4.6)
- Node.js / TypeScript
- PostgreSQL
- Docker

## Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env

# Run locally
npm run dev

# Deploy
npm run build && npm start
```

## Environment Variables

Required:
- `ANTHROPIC_API_KEY` - Claude API key
- `STRIPE_SECRET_KEY` - Stripe payment key
- `DATABASE_URL` - PostgreSQL connection
- `GITHUB_TOKEN` - For API access

## Business Model

**Pricing:** $500-$5,000/month SaaS
**Target:** SMBs and enterprises
**Revenue Model:** Subscription + usage fees
**Margins:** 85-90%

## Deployment

Deploy on Railway with one click:
```bash
railway up
```

## License

MIT
