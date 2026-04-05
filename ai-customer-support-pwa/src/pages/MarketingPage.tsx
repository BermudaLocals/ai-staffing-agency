import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import {
  MessageCircle,
  Zap,
  Shield,
  BarChart3,
  Clock,
  Users,
  Globe,
  Sparkles,
  Check,
  ChevronDown,
  ChevronUp,
  Star,
  ArrowRight,
  Play,
  Menu,
  X,
  Sun,
  Moon,
  Bot,
  Headphones,
  TrendingUp,
  DollarSign,
  Send
} from 'lucide-react'

// Dark mode hook
function useDarkMode() {
  const [isDark, setIsDark] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('darkMode') === 'true' ||
        (!localStorage.getItem('darkMode') && window.matchMedia('(prefers-color-scheme: dark)').matches)
    }
    return false
  })

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', String(isDark))
  }, [isDark])

  return [isDark, setIsDark] as const
}

// Animated counter component
function AnimatedCounter({ end, duration = 2000, suffix = '' }: { end: number; duration?: number; suffix?: string }) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    let startTime: number
    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp
      const progress = Math.min((timestamp - startTime) / duration, 1)
      setCount(Math.floor(progress * end))
      if (progress < 1) requestAnimationFrame(animate)
    }
    requestAnimationFrame(animate)
  }, [end, duration])

  return <span>{count.toLocaleString()}{suffix}</span>
}

// Chat widget preview component
function ChatWidgetPreview() {
  const [messages, setMessages] = useState([
    { type: 'bot', text: 'Hi! 👋 How can I help you today?' }
  ])
  const [isTyping, setIsTyping] = useState(false)

  useEffect(() => {
    const timer1 = setTimeout(() => {
      setMessages(prev => [...prev, { type: 'user', text: 'What are your pricing plans?' }])
      setIsTyping(true)
    }, 2000)

    const timer2 = setTimeout(() => {
      setIsTyping(false)
      setMessages(prev => [...prev, { 
        type: 'bot', 
        text: 'We have 4 plans starting at $297/mo. Would you like me to explain each one?' 
      }])
    }, 4000)

    return () => {
      clearTimeout(timer1)
      clearTimeout(timer2)
    }
  }, [])

  return (
    <div className="w-80 bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden border border-gray-200 dark:border-gray-700">
      {/* Header */}
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <Bot className="w-6 h-6 text-white" />
          </div>
          <div>
            <h4 className="text-white font-semibold">AI Support</h4>
            <p className="text-white/80 text-sm">Always online</p>
          </div>
          <div className="ml-auto w-3 h-3 bg-green-400 rounded-full animate-pulse" />
        </div>
      </div>

      {/* Messages */}
      <div className="p-4 h-64 overflow-y-auto space-y-3">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
          >
            <div
              className={`max-w-[80%] px-4 py-2 rounded-2xl text-sm ${
                msg.type === 'user'
                  ? 'bg-indigo-600 text-white rounded-br-md'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-md'
              }`}
            >
              {msg.text}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 px-4 py-3 rounded-2xl rounded-bl-md">
              <div className="flex gap-1">
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center gap-2">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button className="w-10 h-10 bg-indigo-600 rounded-full flex items-center justify-center hover:bg-indigo-700 transition-colors">
            <Send className="w-5 h-5 text-white" />
          </button>
        </div>
      </div>
    </div>
  )
}

// FAQ Item component
function FAQItem({ question, answer }: { question: string; answer: string }) {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <div className="border-b border-gray-200 dark:border-gray-700">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full py-5 flex items-center justify-between text-left"
      >
        <span className="text-lg font-medium text-gray-900 dark:text-white">{question}</span>
        {isOpen ? (
          <ChevronUp className="w-5 h-5 text-gray-500" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-500" />
        )}
      </button>
      {isOpen && (
        <div className="pb-5 text-gray-600 dark:text-gray-400 animate-fade-in">
          {answer}
        </div>
      )}
    </div>
  )
}

// Pricing data
const pricingPlans = [
  {
    name: 'Starter',
    price: 297,
    description: 'Perfect for small businesses just getting started',
    features: [
      '1,000 conversations/month',
      '1 AI agent',
      'Basic analytics',
      'Email support',
      'Widget customization',
      '5 knowledge base articles'
    ],
    cta: 'Start Free Trial',
    popular: false
  },
  {
    name: 'Growth',
    price: 597,
    description: 'For growing teams that need more power',
    features: [
      '5,000 conversations/month',
      '3 AI agents',
      'Advanced analytics',
      'Priority support',
      'Custom branding',
      '25 knowledge base articles',
      'Team collaboration',
      'API access'
    ],
    cta: 'Start Free Trial',
    popular: true
  },
  {
    name: 'Pro',
    price: 1297,
    description: 'For established businesses with high volume',
    features: [
      '25,000 conversations/month',
      '10 AI agents',
      'Full analytics suite',
      '24/7 phone support',
      'White-label solution',
      'Unlimited knowledge base',
      'Advanced integrations',
      'Dedicated success manager',
      'Custom AI training'
    ],
    cta: 'Start Free Trial',
    popular: false
  },
  {
    name: 'Enterprise',
    price: 2997,
    description: 'For large organizations with custom needs',
    features: [
      'Unlimited conversations',
      'Unlimited AI agents',
      'Enterprise analytics',
      'Dedicated support team',
      'Full customization',
      'On-premise option',
      'SLA guarantee',
      'Custom integrations',
      'Security audit',
      'Training & onboarding'
    ],
    cta: 'Contact Sales',
    popular: false
  }
]

// Features data
const features = [
  {
    icon: Bot,
    title: 'AI-Powered Responses',
    description: 'Our AI understands context and provides human-like responses 24/7'
  },
  {
    icon: Zap,
    title: 'Instant Setup',
    description: 'Get up and running in minutes with our simple embed code'
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'SOC 2 compliant with end-to-end encryption for all data'
  },
  {
    icon: BarChart3,
    title: 'Deep Analytics',
    description: 'Track performance, satisfaction scores, and conversation insights'
  },
  {
    icon: Globe,
    title: 'Multi-Language',
    description: 'Support customers in 50+ languages automatically'
  },
  {
    icon: Users,
    title: 'Team Collaboration',
    description: 'Seamlessly hand off to human agents when needed'
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Never miss a customer inquiry, even outside business hours'
  },
  {
    icon: Sparkles,
    title: 'Smart Learning',
    description: 'AI improves over time by learning from your knowledge base'
  }
]

// Testimonials data
const testimonials = [
  {
    name: 'Sarah Johnson',
    role: 'CEO, TechStart Inc.',
    image: 'https://randomuser.me/api/portraits/women/44.jpg',
    quote: 'AI Support reduced our response time by 80% and our customers love the instant help. Best investment we made this year.',
    rating: 5
  },
  {
    name: 'Michael Chen',
    role: 'Head of Support, CloudScale',
    image: 'https://randomuser.me/api/portraits/men/32.jpg',
    quote: 'We went from 5 support agents to 2, while actually improving our customer satisfaction scores. The ROI is incredible.',
    rating: 5
  },
  {
    name: 'Emily Rodriguez',
    role: 'Founder, ShopEasy',
    image: 'https://randomuser.me/api/portraits/women/68.jpg',
    quote: 'The AI handles 70% of our inquiries automatically. My team can now focus on complex issues that really need human touch.',
    rating: 5
  }
]

// FAQ data
const faqs = [
  {
    question: 'How does the AI learn about my business?',
    answer: 'You can upload documents, FAQs, and product information to our knowledge base. The AI uses this to provide accurate, contextual responses. You can also train it with example conversations.'
  },
  {
    question: 'Can I customize the chat widget appearance?',
    answer: 'Absolutely! You can customize colors, fonts, position, welcome messages, and even add your logo. The widget seamlessly matches your brand identity.'
  },
  {
    question: 'What happens when the AI can\'t answer a question?',
    answer: 'The AI gracefully hands off to a human agent with full conversation context. You can set custom triggers for when this should happen.'
  },
  {
    question: 'Is my data secure?',
    answer: 'Yes, we are SOC 2 Type II compliant. All data is encrypted at rest and in transit. We never use your data to train our models without explicit consent.'
  },
  {
    question: 'How long does setup take?',
    answer: 'Most customers are up and running within 30 minutes. Just add our embed code to your website and configure your knowledge base.'
  },
  {
    question: 'Do you offer a free trial?',
    answer: 'Yes! All plans come with a 14-day free trial. No credit card required to start.'
  },
  {
    question: 'Can I integrate with my existing tools?',
    answer: 'We integrate with Slack, Zendesk, Salesforce, HubSpot, Intercom, and many more. We also offer a REST API for custom integrations.'
  },
  {
    question: 'What languages does the AI support?',
    answer: 'Our AI supports 50+ languages including English, Spanish, French, German, Chinese, Japanese, and more. It auto-detects the customer\'s language.'
  }
]

// Company logos for social proof
const companyLogos = [
  'Stripe', 'Shopify', 'Notion', 'Figma', 'Linear', 'Vercel'
]

export default function MarketingPage() {
  const [isDark, setIsDark] = useDarkMode()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [email, setEmail] = useState('')

  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900 dark:text-white">AI Support</span>
            </div>

            {/* Desktop nav */}
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Features</a>
              <a href="#pricing" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Pricing</a>
              <a href="#testimonials" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">Testimonials</a>
              <a href="#faq" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">FAQ</a>
            </div>

            <div className="hidden md:flex items-center gap-4">
              <button
                onClick={() => setIsDark(!isDark)}
                className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
              >
                {isDark ? <Sun className="w-5 h-5 text-gray-400" /> : <Moon className="w-5 h-5 text-gray-600" />}
              </button>
              <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors">
                Sign In
              </Link>
              <Link
                to="/signup"
                className="px-4 py-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium hover:opacity-90 transition-opacity"
              >
                Start Free Trial
              </Link>
            </div>

            {/* Mobile menu button */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="md:hidden bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" className="block py-2 text-gray-600 dark:text-gray-300">Features</a>
              <a href="#pricing" className="block py-2 text-gray-600 dark:text-gray-300">Pricing</a>
              <a href="#testimonials" className="block py-2 text-gray-600 dark:text-gray-300">Testimonials</a>
              <a href="#faq" className="block py-2 text-gray-600 dark:text-gray-300">FAQ</a>
              <div className="pt-4 flex flex-col gap-3">
                <Link to="/login" className="py-2 text-center text-gray-600 dark:text-gray-300">
                  Sign In
                </Link>
                <Link
                  to="/signup"
                  className="py-2 text-center bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg font-medium"
                >
                  Start Free Trial
                </Link>
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-indigo-100 dark:bg-indigo-900/30 rounded-full text-indigo-700 dark:text-indigo-300 text-sm font-medium mb-6">
                <Sparkles className="w-4 h-4" />
                Powered by Advanced AI
              </div>
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                Customer Support That
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"> Never Sleeps</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-xl mx-auto lg:mx-0">
                Deploy an AI-powered support agent that handles 70% of inquiries instantly. 
                Reduce costs, increase satisfaction, and scale without limits.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <Link
                  to="/signup"
                  className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-semibold text-lg hover:opacity-90 transition-opacity shadow-lg shadow-indigo-500/25"
                >
                  Start Free Trial
                  <ArrowRight className="w-5 h-5" />
                </Link>
                <button className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-xl font-semibold text-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors">
                  <Play className="w-5 h-5" />
                  Watch Demo
                </button>
              </div>
              <p className="mt-6 text-sm text-gray-500 dark:text-gray-400">
                No credit card required • 14-day free trial • Setup in 5 minutes
              </p>
            </div>

            <div className="relative flex justify-center lg:justify-end">
              <div className="absolute -top-10 -right-10 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
              <div className="absolute -bottom-10 -left-10 w-72 h-72 bg-indigo-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />
              <ChatWidgetPreview />
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-500 dark:text-gray-400 mb-8">
            Trusted by <span className="font-semibold text-gray-900 dark:text-white">500+</span> businesses worldwide
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16">
            {companyLogos.map((logo) => (
              <div key={logo} className="text-2xl font-bold text-gray-300 dark:text-gray-600">
                {logo}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                <AnimatedCounter end={70} suffix="%" />
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Queries Automated</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                <AnimatedCounter end={3} suffix="s" />
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Avg Response Time</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                <AnimatedCounter end={98} suffix="%" />
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Customer Satisfaction</p>
            </div>
            <div className="text-center">
              <div className="text-4xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">
                <AnimatedCounter end={50} suffix="%" />
              </div>
              <p className="mt-2 text-gray-600 dark:text-gray-400">Cost Reduction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem/Solution */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              The Support Problem, Solved
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Traditional support is broken. We fixed it.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Problems */}
            <div className="bg-red-50 dark:bg-red-900/20 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-red-700 dark:text-red-400 mb-6 flex items-center gap-2">
                <X className="w-6 h-6" />
                Without AI Support
              </h3>
              <ul className="space-y-4">
                {[
                  'Long wait times frustrate customers',
                  'High costs for 24/7 coverage',
                  'Inconsistent response quality',
                  'Agents burned out on repetitive questions',
                  'Scaling requires hiring more staff',
                  'Limited language support'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-red-700 dark:text-red-300">
                    <X className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            {/* Solutions */}
            <div className="bg-green-50 dark:bg-green-900/20 rounded-2xl p-8">
              <h3 className="text-xl font-bold text-green-700 dark:text-green-400 mb-6 flex items-center gap-2">
                <Check className="w-6 h-6" />
                With AI Support
              </h3>
              <ul className="space-y-4">
                {[
                  'Instant responses, 24/7/365',
                  'Reduce support costs by 50%+',
                  'Consistent, accurate answers every time',
                  'Agents focus on high-value interactions',
                  'Scale instantly without hiring',
                  'Support in 50+ languages'
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-3 text-green-700 dark:text-green-300">
                    <Check className="w-5 h-5 mt-0.5 flex-shrink-0" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need to Deliver
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"> Exceptional Support</span>
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Powerful features that work together seamlessly
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((feature, i) => (
              <div
                key={i}
                className="group p-6 bg-white dark:bg-gray-800 rounded-2xl border border-gray-200 dark:border-gray-700 hover:border-indigo-500 dark:hover:border-indigo-500 hover:shadow-lg transition-all"
              >
                <div className="w-12 h-12 bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/50 dark:to-purple-900/50 rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <feature.icon className="w-6 h-6 text-indigo-600 dark:text-indigo-400" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Up and Running in Minutes
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Three simple steps to transform your customer support
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                step: '01',
                icon: Zap,
                title: 'Add Your Knowledge',
                description: 'Upload FAQs, docs, and product info. Our AI learns your business in minutes.'
              },
              {
                step: '02',
                icon: Globe,
                title: 'Embed the Widget',
                description: 'Copy one line of code to your website. Works with any platform.'
              },
              {
                step: '03',
                icon: TrendingUp,
                title: 'Watch It Work',
                description: 'Your AI agent starts helping customers immediately. Monitor and improve over time.'
              }
            ].map((item, i) => (
              <div key={i} className="relative">
                <div className="text-center">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl mb-6 shadow-lg shadow-indigo-500/25">
                    <item.icon className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-6xl font-bold text-gray-100 dark:text-gray-800 -z-10">
                    {item.step}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-3">
                    {item.title}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {item.description}
                  </p>
                </div>
                {i < 2 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-gray-300 dark:border-gray-600" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Simple, Transparent Pricing
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Choose the plan that fits your business. All plans include a 14-day free trial.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingPlans.map((plan, i) => (
              <div
                key={i}
                className={`relative p-6 rounded-2xl border-2 transition-all ${
                  plan.popular
                    ? 'border-indigo-600 bg-gradient-to-b from-indigo-50 to-white dark:from-indigo-900/20 dark:to-gray-800 shadow-xl'
                    : 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600'
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="px-4 py-1 bg-gradient-to-r from-indigo-600 to-purple-600 text-white text-sm font-medium rounded-full">
                      Most Popular
                    </span>
                  </div>
                )}
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">{plan.name}</h3>
                  <div className="flex items-baseline justify-center gap-1">
                    <span className="text-4xl font-bold text-gray-900 dark:text-white">${plan.price}</span>
                    <span className="text-gray-500 dark:text-gray-400">/month</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{plan.description}</p>
                </div>
                <ul className="space-y-3 mb-6">
                  {plan.features.map((feature, j) => (
                    <li key={j} className="flex items-start gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Link
                  to="/signup"
                  className={`block w-full py-3 text-center rounded-xl font-semibold transition-all ${
                    plan.popular
                      ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white hover:opacity-90'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white hover:bg-gray-200 dark:hover:bg-gray-600'
                  }`}
                >
                  {plan.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-gray-800/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Loved by Support Teams Everywhere
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              See what our customers have to say
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-lg border border-gray-100 dark:border-gray-700"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, j) => (
                    <Star key={j} className="w-5 h-5 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700 dark:text-gray-300 mb-6 italic">
                  "{testimonial.quote}"
                </p>
                <div className="flex items-center gap-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Everything you need to know about AI Support
            </p>
          </div>

          <div className="divide-y divide-gray-200 dark:divide-gray-700">
            {faqs.map((faq, i) => (
              <FAQItem key={i} question={faq.question} answer={faq.answer} />
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl p-8 md:p-12 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to Transform Your Support?
            </h2>
            <p className="text-xl text-indigo-100 mb-8 max-w-2xl mx-auto">
              Join 500+ businesses already using AI Support to delight their customers.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 px-6 py-4 rounded-xl text-gray-900 focus:outline-none focus:ring-4 focus:ring-white/25"
              />
              <Link
                to="/signup"
                className="px-8 py-4 bg-white text-indigo-600 rounded-xl font-semibold hover:bg-gray-100 transition-colors whitespace-nowrap"
              >
                Start Free Trial
              </Link>
            </div>
            <p className="mt-4 text-sm text-indigo-200">
              No credit card required • 14-day free trial
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-12">
            <div className="col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <MessageCircle className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white">AI Support</span>
              </div>
              <p className="text-gray-400 mb-4 max-w-xs">
                AI-powered customer support that never sleeps. Reduce costs, increase satisfaction.
              </p>
              <div className="flex gap-4">
                {['twitter', 'linkedin', 'github'].map((social) => (
                  <a
                    key={social}
                    href={`https://${social}.com`}
                    className="w-10 h-10 bg-gray-800 rounded-lg flex items-center justify-center hover:bg-gray-700 transition-colors"
                  >
                    <span className="sr-only">{social}</span>
                    <div className="w-5 h-5 bg-gray-400 rounded" />
                  </a>
                ))}
              </div>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Product</h4>
              <ul className="space-y-2">
                <li><a href="#features" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#pricing" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                <li><a href="#" className="hover:text-white transition-colors">API</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Company</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
              </ul>
            </div>

            <div>
              <h4 className="text-white font-semibold mb-4">Legal</h4>
              <ul className="space-y-2">
                <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm">
              © 2024 AI Support. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Cookie Policy</a>
            </div>
          </div>
        </div>
      </footer>

      {/* Custom styles for animations */}
      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          25% { transform: translate(20px, -30px) scale(1.1); }
          50% { transform: translate(-20px, 20px) scale(0.9); }
          75% { transform: translate(30px, 30px) scale(1.05); }
        }
        .animate-blob {
          animation: blob 8s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes fade-in {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fade-in 0.3s ease-out;
        }
      `}</style>
    </div>
  )
}
