import React from 'react'
import { Link } from 'react-router-dom'
import { 
  MessageCircle, 
  Zap, 
  Shield, 
  BarChart3, 
  Globe, 
  Clock,
  CheckCircle,
  ArrowRight,
  Star,
  Users,
  Bot
} from 'lucide-react'
import { Button } from '../components/ui'

const features = [
  {
    icon: Bot,
    title: 'AI-Powered Responses',
    description: 'Claude AI handles 80% of customer queries instantly with human-like conversations.',
  },
  {
    icon: Zap,
    title: '10-Minute Setup',
    description: 'Copy one line of code to your website and start supporting customers immediately.',
  },
  {
    icon: Globe,
    title: '50+ Languages',
    description: "Automatically detect and respond in your customer's preferred language.",
  },
  {
    icon: Clock,
    title: '24/7 Availability',
    description: 'Never miss a customer query. AI support works around the clock.',
  },
  {
    icon: Shield,
    title: 'Enterprise Security',
    description: 'SOC 2 compliant with end-to-end encryption and GDPR compliance.',
  },
  {
    icon: BarChart3,
    title: 'Real-Time Analytics',
    description: 'Track resolution rates, response times, and customer satisfaction.',
  },
]

const testimonials = [
  {
    name: 'Sarah Chen',
    role: 'CEO, TechStart',
    content: 'Reduced our support tickets by 70% in the first month. Game changer!',
    avatar: 'SC',
  },
  {
    name: 'Michael Roberts',
    role: 'Support Lead, E-Shop',
    content: 'Our customers love the instant responses. CSAT scores are through the roof.',
    avatar: 'MR',
  },
  {
    name: 'Emily Watson',
    role: 'Founder, SaaS Pro',
    content: "Setup took literally 5 minutes. Best ROI on any tool we've purchased.",
    avatar: 'EW',
  },
]

const pricingPlans = [
  {
    name: 'Starter',
    price: 29,
    description: 'Perfect for small businesses',
    features: [
      '100 conversations/month',
      '2 team members',
      'Basic analytics',
      'Email support',
    ],
  },
  {
    name: 'Growth',
    price: 79,
    description: 'For growing teams',
    features: [
      '1,000 conversations/month',
      '5 team members',
      'Advanced analytics',
      'Custom branding',
      'Priority support',
    ],
    popular: true,
  },
  {
    name: 'Pro',
    price: 199,
    description: 'For large organizations',
    features: [
      '10,000 conversations/month',
      '20 team members',
      'Full analytics suite',
      'API access',
      'Dedicated support',
      'Custom integrations',
    ],
  },
]

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md z-50 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">AI Support</span>
            </div>
            <div className="hidden md:flex items-center gap-8">
              <a href="#features" className="text-gray-600 hover:text-gray-900">Features</a>
              <a href="#pricing" className="text-gray-600 hover:text-gray-900">Pricing</a>
              <a href="#testimonials" className="text-gray-600 hover:text-gray-900">Testimonials</a>
            </div>
            <div className="flex items-center gap-4">
              <Link to="/login">
                <Button variant="ghost">Log in</Button>
              </Link>
              <Link to="/signup">
                <Button>Start Free Trial</Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-primary-50 text-primary-700 px-4 py-2 rounded-full text-sm font-medium mb-6">
            <Zap className="w-4 h-4" />
            Now powered by Claude AI
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            AI Customer Support<br />
            <span className="text-primary-600">That Actually Works</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Deploy intelligent AI support in 10 minutes. Handle 80% of customer queries automatically.
            Delight customers 24/7 while reducing support costs by 60%.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link to="/signup">
              <Button size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Start Free 14-Day Trial
              </Button>
            </Link>
            <Button variant="outline" size="lg">
              Watch Demo
            </Button>
          </div>
          <p className="text-sm text-gray-500 mt-4">
            No credit card required • Setup in under 10 minutes
          </p>

          {/* Hero Image/Demo */}
          <div className="mt-16 relative">
            <div className="bg-gradient-to-b from-primary-50 to-white rounded-2xl p-8 shadow-xl">
              <div className="bg-white rounded-xl shadow-lg overflow-hidden max-w-4xl mx-auto">
                <div className="bg-gray-100 px-4 py-3 flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-red-400" />
                  <div className="w-3 h-3 rounded-full bg-yellow-400" />
                  <div className="w-3 h-3 rounded-full bg-green-400" />
                </div>
                <div className="p-6 bg-gray-50">
                  <div className="flex gap-4">
                    {/* Chat Preview */}
                    <div className="flex-1 bg-white rounded-lg shadow p-4">
                      <div className="flex items-center gap-3 mb-4 pb-4 border-b">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <Bot className="w-5 h-5 text-primary-600" />
                        </div>
                        <div>
                          <p className="font-medium">AI Assistant</p>
                          <p className="text-xs text-green-500">Online</p>
                        </div>
                      </div>
                      <div className="space-y-3">
                        <div className="bg-gray-100 rounded-lg rounded-bl-sm p-3 max-w-[80%]">
                          <p className="text-sm">Hi! How can I help you today?</p>
                        </div>
                        <div className="bg-primary-600 text-white rounded-lg rounded-br-sm p-3 max-w-[80%] ml-auto">
                          <p className="text-sm">What's your return policy?</p>
                        </div>
                        <div className="bg-gray-100 rounded-lg rounded-bl-sm p-3 max-w-[80%]">
                          <p className="text-sm">We offer a 30-day money-back guarantee on all products! Simply contact us within 30 days of purchase for a full refund. 🎉</p>
                        </div>
                      </div>
                    </div>
                    {/* Stats Preview */}
                    <div className="w-64 space-y-4">
                      <div className="bg-white rounded-lg shadow p-4">
                        <p className="text-sm text-gray-500">Resolution Rate</p>
                        <p className="text-2xl font-bold text-green-600">94%</p>
                      </div>
                      <div className="bg-white rounded-lg shadow p-4">
                        <p className="text-sm text-gray-500">Avg Response Time</p>
                        <p className="text-2xl font-bold text-primary-600">1.2s</p>
                      </div>
                      <div className="bg-white rounded-lg shadow p-4">
                        <p className="text-sm text-gray-500">CSAT Score</p>
                        <p className="text-2xl font-bold text-yellow-600">4.8/5</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-12 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16">
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">10,000+</p>
              <p className="text-sm text-gray-500">Businesses</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">5M+</p>
              <p className="text-sm text-gray-500">Conversations</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">98%</p>
              <p className="text-sm text-gray-500">Satisfaction</p>
            </div>
            <div className="text-center">
              <p className="text-3xl font-bold text-gray-900">60%</p>
              <p className="text-sm text-gray-500">Cost Reduction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Everything you need for world-class support
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Powerful features that help you deliver exceptional customer experiences
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-shadow"
              >
                <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center mb-4">
                  <feature.icon className="w-6 h-6 text-primary-600" />
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 px-4 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Simple, transparent pricing
            </h2>
            <p className="text-xl text-gray-600">
              Start free, upgrade when you're ready
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <div
                key={index}
                className={`
                  bg-white rounded-2xl p-8 border-2 transition-all
                  ${plan.popular ? 'border-primary-600 shadow-xl scale-105' : 'border-gray-100'}
                `}
              >
                {plan.popular && (
                  <div className="bg-primary-600 text-white text-sm font-medium px-3 py-1 rounded-full inline-block mb-4">
                    Most Popular
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900">{plan.name}</h3>
                <p className="text-gray-500 mb-4">{plan.description}</p>
                <div className="mb-6">
                  <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                  <span className="text-gray-500">/month</span>
                </div>
                <ul className="space-y-3 mb-8">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center gap-2">
                      <CheckCircle className="w-5 h-5 text-green-500" />
                      <span className="text-gray-600">{feature}</span>
                    </li>
                  ))}
                </ul>
                <Link to="/signup">
                  <Button
                    variant={plan.popular ? 'primary' : 'outline'}
                    className="w-full"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section id="testimonials" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
              Loved by businesses worldwide
            </h2>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 border border-gray-100 shadow-sm"
              >
                <div className="flex items-center gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  ))}
                </div>
                <p className="text-gray-600 mb-4">"{testimonial.content}"</p>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center text-primary-700 font-medium">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{testimonial.name}</p>
                    <p className="text-sm text-gray-500">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-primary-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to transform your customer support?
          </h2>
          <p className="text-xl text-primary-100 mb-8">
            Join 10,000+ businesses using AI Support to delight their customers
          </p>
          <Link to="/signup">
            <Button
              size="lg"
              variant="secondary"
              rightIcon={<ArrowRight className="w-5 h-5" />}
            >
              Start Your Free Trial
            </Button>
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-gray-400 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                  <MessageCircle className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl font-bold text-white">AI Support</span>
              </div>
              <p className="text-sm">
                AI-powered customer support that actually works.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Features</a></li>
                <li><a href="#" className="hover:text-white">Pricing</a></li>
                <li><a href="#" className="hover:text-white">Integrations</a></li>
                <li><a href="#" className="hover:text-white">API</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">About</a></li>
                <li><a href="#" className="hover:text-white">Blog</a></li>
                <li><a href="#" className="hover:text-white">Careers</a></li>
                <li><a href="#" className="hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-white mb-4">Legal</h4>
              <ul className="space-y-2 text-sm">
                <li><a href="#" className="hover:text-white">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-white">Terms of Service</a></li>
                <li><a href="#" className="hover:text-white">Security</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 pt-8 text-sm text-center">
            © 2024 AI Support. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
