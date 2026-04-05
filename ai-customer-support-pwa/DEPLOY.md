# 🚀 AI CUSTOMER SUPPORT PWA - DEPLOYMENT GUIDE

## 📋 Pre-Deployment Checklist

- [ ] Supabase account created
- [ ] Anthropic API key obtained
- [ ] Vercel account created
- [ ] (Optional) Stripe account for payments
- [ ] (Optional) PostHog account for analytics

---

## 🔧 STEP 1: Set Up Supabase

### 1.1 Create Project
1. Go to [supabase.com](https://supabase.com)
2. Click "New Project"
3. Choose organization and name your project
4. Set a strong database password (save it!)
5. Select region closest to your users
6. Click "Create new project"

### 1.2 Get API Keys
1. Go to Settings → API
2. Copy these values:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGciOiJIUzI1...`

### 1.3 Run Database Schema
1. Go to SQL Editor in Supabase dashboard
2. Click "New Query"
3. Copy contents of `supabase/schema.sql`
4. Click "Run"

---

## 🤖 STEP 2: Get Anthropic API Key

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Sign up or log in
3. Go to API Keys
4. Create new key
5. Copy and save: `sk-ant-api03-...`

---

## 🌐 STEP 3: Deploy to Vercel

### Option A: GitHub Integration (Recommended)

#### 3A.1 Push to GitHub
```bash
cd ai-customer-support-pwa
git init
git add .
git commit -m "Initial commit - AI Customer Support PWA"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/ai-customer-support-pwa.git
git push -u origin main
```

#### 3A.2 Connect Vercel
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New" → "Project"
3. Import your GitHub repository
4. Vercel auto-detects Vite configuration
5. Click "Deploy"

### Option B: Vercel CLI

```bash
# Install Vercel CLI
npm install -g vercel

# Login
vercel login

# Deploy (from project directory)
cd ai-customer-support-pwa
vercel

# Follow prompts, then deploy to production
vercel --prod
```

### Option C: Drag & Drop
1. Go to [vercel.com/new](https://vercel.com/new)
2. Drag the project folder to upload
3. Configure and deploy

---

## 🔑 STEP 4: Configure Environment Variables

In Vercel Dashboard → Your Project → Settings → Environment Variables:

| Variable | Value | Required |
|----------|-------|----------|
| `VITE_SUPABASE_URL` | `https://xxxxx.supabase.co` | ✅ Yes |
| `VITE_SUPABASE_ANON_KEY` | `eyJhbGciOiJIUzI1...` | ✅ Yes |
| `ANTHROPIC_API_KEY` | `sk-ant-api03-...` | ✅ Yes |
| `VITE_APP_URL` | `https://your-app.vercel.app` | ✅ Yes |
| `STRIPE_SECRET_KEY` | `sk_live_...` | Optional |
| `STRIPE_WEBHOOK_SECRET` | `whsec_...` | Optional |
| `POSTHOG_API_KEY` | `phc_...` | Optional |

**After adding variables, redeploy!**

---

## ✅ STEP 5: Verify Deployment

### 5.1 Test the App
1. Visit your Vercel URL
2. You should see the landing page
3. Click "Get Started" or "Sign Up"
4. Create an account
5. Complete the setup wizard

### 5.2 Test the Chat Widget
1. Go to Dashboard → Settings → Widget
2. Copy the embed code
3. Add to a test HTML page
4. Verify chat widget appears and responds

### 5.3 Test AI Responses
1. Open the chat widget
2. Ask a question
3. Verify AI responds (may say "I don\'t have info" if no knowledge base yet)
4. Add knowledge base articles
5. Test again

---

## 🔧 Troubleshooting

### Build Fails
- Check all dependencies in package.json
- Ensure Node.js version is 18+
- Check for TypeScript errors

### API Errors
- Verify environment variables are set correctly
- Check Supabase is running
- Verify Anthropic API key is valid

### Widget Not Loading
- Check CORS settings in Supabase
- Verify VITE_APP_URL matches your domain
- Check browser console for errors

### Database Errors
- Ensure schema.sql was run successfully
- Check RLS policies in Supabase
- Verify anon key has correct permissions

---

## 📁 Project Structure

```
ai-customer-support-pwa/
├── api/                    # Vercel Edge Functions
│   ├── chat.ts            # AI chat endpoint
│   ├── knowledge.ts       # Knowledge base API
│   └── analytics.ts       # Analytics API
├── src/
│   ├── components/        # React components
│   ├── pages/            # Page components
│   ├── services/         # API services
│   ├── stores/           # State management
│   ├── types/            # TypeScript types
│   └── widget/           # Embeddable widget
├── public/               # Static assets
├── supabase/            # Database schema
├── docs/                # Documentation
└── vercel.json          # Vercel config
```

---

## 🎉 You\'re Live!

Once deployed, share your app URL with clients and start onboarding!

Need help? Check the README.md for more details.
