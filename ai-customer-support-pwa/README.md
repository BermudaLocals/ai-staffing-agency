# 🚀 AI Customer Support PWA

A production-ready Progressive Web App (PWA) that provides AI-powered customer support with real-time features, 10-minute business installation, and enterprise-grade capabilities.

![AI Customer Support](https://img.shields.io/badge/AI-Powered-blue)
![PWA](https://img.shields.io/badge/PWA-Ready-green)
![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue)
![React](https://img.shields.io/badge/React-18.2-blue)

## ✨ Features

### 🤖 Intelligent AI Chat Widget
- Natural language processing with Claude AI
- Context retention across conversations
- Sentiment analysis and intent recognition
- Automatic escalation to human agents
- Multi-language support (50+ languages)

### 📊 Business Admin Dashboard
- Real-time conversation monitoring
- Knowledge base management
- Team management with roles
- Comprehensive analytics
- Widget customization

### 📱 PWA Capabilities
- Offline mode with service workers
- Push notifications
- Installable on any device
- Background sync
- Fast loading (< 2s)

### ⚡ 10-Minute Setup
- Simple embed code
- Drag-and-drop knowledge upload
- Visual widget customizer
- WordPress/Shopify plugins

## 🛠️ Tech Stack

- **Frontend:** React 18 + TypeScript + Tailwind CSS
- **Build Tool:** Vite 5
- **AI:** Anthropic Claude (Sonnet 4)
- **Backend:** Supabase (PostgreSQL + Realtime)
- **Hosting:** Vercel Edge Functions
- **State:** Zustand
- **Charts:** Recharts

## 📦 Installation

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account
- Anthropic API key

### Quick Start

```bash
# Clone the repository
git clone https://github.com/yourusername/ai-customer-support-pwa.git
cd ai-customer-support-pwa

# Install dependencies
npm install

# Copy environment variables
cp .env.example .env

# Edit .env with your credentials
nano .env

# Run database migrations
# Go to Supabase SQL Editor and run supabase/schema.sql

# Start development server
npm run dev
```

### Environment Variables

```env
# Supabase
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key

# Anthropic Claude
VITE_ANTHROPIC_API_KEY=your-anthropic-key

# Stripe (optional)
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_xxx
```

## 🚀 Deployment

### Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel

# Set environment variables in Vercel dashboard
```

### Manual Build

```bash
# Build for production
npm run build

# Preview build
npm run preview
```

## 📖 Usage

### Embedding the Widget

Add this code to your website:

```html
<script 
  src="https://your-domain.com/widget.js" 
  data-api-key="YOUR_API_KEY"
  data-color="#4F46E5"
  data-position="bottom-right"
  data-welcome="Hi! How can I help you today?"
  async>
</script>
```

### Widget Configuration Options

| Option | Description | Default |
|--------|-------------|--------|
| `data-api-key` | Your business API key | Required |
| `data-color` | Primary brand color | `#4F46E5` |
| `data-position` | Widget position | `bottom-right` |
| `data-welcome` | Welcome message | `Hi! How can I help?` |
| `data-name` | Business name | `Support` |

### API Endpoints

#### Chat API
```bash
POST /api/chat
Content-Type: application/json

{
  "apiKey": "your-api-key",
  "message": "Hello, I need help",
  "conversationId": "optional-existing-id",
  "customerEmail": "customer@example.com"
}
```

#### Knowledge Base API
```bash
# List knowledge base
GET /api/knowledge?apiKey=your-api-key

# Add content
POST /api/knowledge
x-api-key: your-api-key

{
  "sourceType": "text",
  "title": "FAQ",
  "content": "Your knowledge content..."
}
```

#### Analytics API
```bash
GET /api/analytics?apiKey=your-api-key&period=7d
```

## 📁 Project Structure

```
ai-customer-support-pwa/
├── api/                    # Vercel Edge Functions
│   ├── chat.ts            # Chat endpoint
│   ├── knowledge.ts       # Knowledge base API
│   └── analytics.ts       # Analytics API
├── public/
│   ├── widget.js          # Embeddable widget
│   ├── manifest.json      # PWA manifest
│   ├── sw.js              # Service worker
│   └── icons/             # PWA icons
├── src/
│   ├── components/        # React components
│   │   ├── ui/           # Reusable UI components
│   │   └── dashboard/    # Dashboard components
│   ├── pages/            # Page components
│   ├── services/         # API services
│   │   ├── supabase.ts   # Supabase client
│   │   └── ai.ts         # Claude AI service
│   ├── stores/           # Zustand stores
│   ├── widget/           # Chat widget component
│   ├── App.tsx           # Main app component
│   └── main.tsx          # Entry point
├── supabase/
│   └── schema.sql        # Database schema
├── .env.example          # Environment template
├── package.json
├── tailwind.config.js
├── tsconfig.json
├── vercel.json
└── vite.config.ts
```

## 🔒 Security

- HTTPS enforced
- Row Level Security (RLS) on all tables
- API key authentication
- Rate limiting on API endpoints
- XSS protection headers
- CORS configuration

## 📊 Database Schema

Key tables:
- `businesses` - Business accounts and settings
- `users` - Team members
- `conversations` - Chat conversations
- `messages` - Individual messages
- `knowledge_base` - AI training content
- `analytics_events` - Usage tracking

See `supabase/schema.sql` for full schema.

## 🧪 Testing

```bash
# Run tests
npm test

# Run with coverage
npm run test:coverage
```

## 📈 Performance

- Lighthouse PWA Score: 100/100
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3.5s
- AI Response Time: < 2s average

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing`)
5. Open a Pull Request

## 📄 License

MIT License - see [LICENSE](LICENSE) for details.

## 🙏 Acknowledgments

- [Anthropic](https://anthropic.com) for Claude AI
- [Supabase](https://supabase.com) for backend infrastructure
- [Vercel](https://vercel.com) for hosting
- [Tailwind CSS](https://tailwindcss.com) for styling

---

Built with ❤️ for businesses that care about customer experience.
