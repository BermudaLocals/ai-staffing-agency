import React, { useState } from 'react'
import {
  Mail,
  Copy,
  Check,
  Search,
  Filter,
  ChevronDown,
  Sparkles,
  Send,
  UserPlus,
  RefreshCw,
  Calendar,
  Star,
  Edit3,
  Trash2,
  Plus,
  X
} from 'lucide-react'
import { Button, Card, Input, Badge, Modal } from '../../components/ui'

interface EmailTemplate {
  id: string
  name: string
  category: 'cold-outreach' | 'follow-up' | 'onboarding' | 'check-in' | 'upsell'
  subject: string
  body: string
  variables: string[]
  starred: boolean
}

const defaultTemplates: EmailTemplate[] = [
  {
    id: '1',
    name: 'Initial Cold Outreach',
    category: 'cold-outreach',
    subject: 'Quick question about {{company_name}}\'s customer support',
    body: `Hi {{first_name}},

I noticed {{company_name}} is growing fast – congrats on the recent {{recent_achievement}}!

Quick question: How is your team handling the increased support volume?

I ask because we help companies like yours automate 70% of customer inquiries with AI, cutting response times from hours to seconds.

Would you be open to a 15-minute call to see if this could help {{company_name}}?

Best,
{{your_name}}
{{your_title}}

P.S. Here's a quick 2-min demo: {{demo_link}}`,
    variables: ['first_name', 'company_name', 'recent_achievement', 'your_name', 'your_title', 'demo_link'],
    starred: true
  },
  {
    id: '2',
    name: 'Follow-up #1 (3 days)',
    category: 'follow-up',
    subject: 'Re: Quick question about {{company_name}}\'s customer support',
    body: `Hi {{first_name}},

Just floating this back to the top of your inbox.

I know you're busy, so I'll keep this short: We helped {{similar_company}} reduce their support costs by 50% while improving response times.

Worth a quick chat?

Best,
{{your_name}}`,
    variables: ['first_name', 'company_name', 'similar_company', 'your_name'],
    starred: true
  },
  {
    id: '3',
    name: 'Follow-up #2 (7 days)',
    category: 'follow-up',
    subject: 'One last thing, {{first_name}}',
    body: `Hi {{first_name}},

I don't want to be a pest, so this will be my last email.

If improving customer support efficiency isn't a priority right now, no worries at all.

But if you'd like to see how {{company_name}} could handle 70% more inquiries without hiring – I'm here when you're ready.

Just reply "interested" and I'll send over some times.

Best,
{{your_name}}`,
    variables: ['first_name', 'company_name', 'your_name'],
    starred: false
  },
  {
    id: '4',
    name: 'New Client Welcome',
    category: 'onboarding',
    subject: 'Welcome to AI Support! 🎉 Let\'s get you set up',
    body: `Hi {{first_name}},

Welcome to AI Support! We're thrilled to have {{company_name}} on board.

Here's what happens next:

1. **Account Setup** (Today)
   Your dashboard is ready at: {{dashboard_link}}
   Login: {{login_email}}

2. **Onboarding Call** (This week)
   Let's schedule a 30-min call to:
   - Configure your AI agent
   - Upload your knowledge base
   - Customize your widget
   
   Book a time here: {{calendar_link}}

3. **Go Live** (Within 7 days)
   We'll have you up and running with full AI support!

Questions? Just reply to this email or reach me at {{support_email}}.

Excited to help {{company_name}} transform customer support!

Best,
{{your_name}}
Customer Success Manager`,
    variables: ['first_name', 'company_name', 'dashboard_link', 'login_email', 'calendar_link', 'support_email', 'your_name'],
    starred: true
  },
  {
    id: '5',
    name: 'Onboarding Checklist',
    category: 'onboarding',
    subject: 'Your AI Support setup checklist ✅',
    body: `Hi {{first_name}},

Great chatting with you! Here's your personalized setup checklist:

**Week 1 Checklist:**
☐ Upload FAQ document
☐ Add product/service descriptions
☐ Customize widget colors & branding
☐ Set up team member accounts
☐ Configure notification preferences
☐ Test AI responses
☐ Embed widget on website

**Resources:**
- Setup Guide: {{setup_guide_link}}
- Video Tutorials: {{tutorials_link}}
- Knowledge Base: {{kb_link}}

**Your dedicated support:**
- Email: {{support_email}}
- Slack: {{slack_channel}}

Let me know if you hit any snags!

Best,
{{your_name}}`,
    variables: ['first_name', 'setup_guide_link', 'tutorials_link', 'kb_link', 'support_email', 'slack_channel', 'your_name'],
    starred: false
  },
  {
    id: '6',
    name: '30-Day Check-in',
    category: 'check-in',
    subject: 'How\'s AI Support working for {{company_name}}?',
    body: `Hi {{first_name}},

It's been 30 days since {{company_name}} went live with AI Support – time flies!

**Your stats so far:**
- Conversations handled: {{total_conversations}}
- AI resolution rate: {{resolution_rate}}%
- Avg response time: {{avg_response_time}}
- Customer satisfaction: {{csat_score}}

Pretty impressive! 🎉

**Quick questions:**
1. What's working well?
2. Anything you'd like to improve?
3. Any features you wish you had?

I'd love to hop on a quick 15-min call to review your results and share some optimization tips.

Book a time: {{calendar_link}}

Best,
{{your_name}}`,
    variables: ['first_name', 'company_name', 'total_conversations', 'resolution_rate', 'avg_response_time', 'csat_score', 'calendar_link', 'your_name'],
    starred: true
  },
  {
    id: '7',
    name: '90-Day Review',
    category: 'check-in',
    subject: '{{company_name}}\'s 90-day AI Support results 📊',
    body: `Hi {{first_name}},

Wow – 90 days already! Let's look at what {{company_name}} has achieved:

**🎯 Key Metrics:**
- Total conversations: {{total_conversations}}
- AI handled: {{ai_handled}}%
- Time saved: {{hours_saved}} hours
- Estimated cost savings: ${{cost_savings}}

**📈 Trends:**
- Resolution rate: {{resolution_trend}}
- Response time: {{response_trend}}
- CSAT: {{csat_trend}}

**💡 Recommendations:**
1. {{recommendation_1}}
2. {{recommendation_2}}
3. {{recommendation_3}}

I'd love to do a quarterly business review to discuss:
- ROI analysis
- Optimization opportunities
- Upcoming features

Book your QBR: {{calendar_link}}

Best,
{{your_name}}`,
    variables: ['first_name', 'company_name', 'total_conversations', 'ai_handled', 'hours_saved', 'cost_savings', 'resolution_trend', 'response_trend', 'csat_trend', 'recommendation_1', 'recommendation_2', 'recommendation_3', 'calendar_link', 'your_name'],
    starred: false
  },
  {
    id: '8',
    name: 'Upgrade Offer',
    category: 'upsell',
    subject: 'Unlock more power for {{company_name}} 🚀',
    body: `Hi {{first_name}},

I've been looking at {{company_name}}'s usage, and I think you might be ready for the next level.

**Current plan:** {{current_plan}}
**Current usage:** {{current_usage}} conversations/month
**Plan limit:** {{plan_limit}} conversations/month

You're at {{usage_percentage}}% capacity! 📈

**Why upgrade to {{recommended_plan}}:**
✅ {{upgrade_benefit_1}}
✅ {{upgrade_benefit_2}}
✅ {{upgrade_benefit_3}}
✅ {{upgrade_benefit_4}}

**Special offer:** Upgrade this week and get {{discount}}% off your first 3 months.

Want to discuss? Reply to this email or book a call: {{calendar_link}}

Best,
{{your_name}}`,
    variables: ['first_name', 'company_name', 'current_plan', 'current_usage', 'plan_limit', 'usage_percentage', 'recommended_plan', 'upgrade_benefit_1', 'upgrade_benefit_2', 'upgrade_benefit_3', 'upgrade_benefit_4', 'discount', 'calendar_link', 'your_name'],
    starred: false
  }
]

const categoryColors: Record<string, string> = {
  'cold-outreach': 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  'follow-up': 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
  'onboarding': 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  'check-in': 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400',
  'upsell': 'bg-pink-100 text-pink-700 dark:bg-pink-900/30 dark:text-pink-400'
}

const categoryIcons: Record<string, React.ReactNode> = {
  'cold-outreach': <Send className="w-4 h-4" />,
  'follow-up': <RefreshCw className="w-4 h-4" />,
  'onboarding': <UserPlus className="w-4 h-4" />,
  'check-in': <Calendar className="w-4 h-4" />,
  'upsell': <Sparkles className="w-4 h-4" />
}

export default function EmailTemplatesPage() {
  const [templates, setTemplates] = useState<EmailTemplate[]>(defaultTemplates)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [copiedId, setCopiedId] = useState<string | null>(null)
  const [showVariables, setShowVariables] = useState(false)
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<EmailTemplate | null>(null)

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      template.subject.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === 'all' || template.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const copyToClipboard = async (text: string, id: string) => {
    await navigator.clipboard.writeText(text)
    setCopiedId(id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  const toggleStar = (id: string) => {
    setTemplates(templates.map(t =>
      t.id === id ? { ...t, starred: !t.starred } : t
    ))
  }

  const deleteTemplate = (id: string) => {
    setTemplates(templates.filter(t => t.id !== id))
    if (selectedTemplate?.id === id) {
      setSelectedTemplate(null)
    }
  }

  const categories = [
    { value: 'all', label: 'All Templates' },
    { value: 'cold-outreach', label: 'Cold Outreach' },
    { value: 'follow-up', label: 'Follow-up' },
    { value: 'onboarding', label: 'Onboarding' },
    { value: 'check-in', label: 'Check-in' },
    { value: 'upsell', label: 'Upsell' }
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Email Templates</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Pre-built templates for client outreach and communication
          </p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search templates..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="appearance-none w-full sm:w-48 px-4 py-2 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {categories.map(cat => (
              <option key={cat.value} value={cat.value}>{cat.label}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Main Content */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Template List */}
        <div className="lg:col-span-1 space-y-3">
          {filteredTemplates.length === 0 ? (
            <Card className="p-8 text-center">
              <Mail className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No templates found</p>
            </Card>
          ) : (
            filteredTemplates.map(template => (
              <Card
                key={template.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  selectedTemplate?.id === template.id
                    ? 'ring-2 ring-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : ''
                }`}
                onClick={() => setSelectedTemplate(template)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${categoryColors[template.category]}`}>
                        {categoryIcons[template.category]}
                        {template.category.replace('-', ' ')}
                      </span>
                      {template.starred && (
                        <Star className="w-4 h-4 text-yellow-500 fill-current" />
                      )}
                    </div>
                    <h3 className="font-medium text-gray-900 dark:text-white truncate">
                      {template.name}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 truncate mt-1">
                      {template.subject}
                    </p>
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Template Preview */}
        <div className="lg:col-span-2">
          {selectedTemplate ? (
            <Card className="p-6">
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-sm font-medium ${categoryColors[selectedTemplate.category]}`}>
                      {categoryIcons[selectedTemplate.category]}
                      {selectedTemplate.category.replace('-', ' ')}
                    </span>
                  </div>
                  <h2 className="text-xl font-bold text-gray-900 dark:text-white">
                    {selectedTemplate.name}
                  </h2>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => toggleStar(selectedTemplate.id)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Star className={`w-5 h-5 ${selectedTemplate.starred ? 'text-yellow-500 fill-current' : 'text-gray-400'}`} />
                  </button>
                  <button
                    onClick={() => setEditingTemplate(selectedTemplate)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Edit3 className="w-5 h-5 text-gray-400" />
                  </button>
                  <button
                    onClick={() => deleteTemplate(selectedTemplate.id)}
                    className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <Trash2 className="w-5 h-5 text-gray-400 hover:text-red-500" />
                  </button>
                </div>
              </div>

              {/* Subject */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Subject Line</label>
                  <button
                    onClick={() => copyToClipboard(selectedTemplate.subject, `subject-${selectedTemplate.id}`)}
                    className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                  >
                    {copiedId === `subject-${selectedTemplate.id}` ? (
                      <><Check className="w-4 h-4" /> Copied!</>
                    ) : (
                      <><Copy className="w-4 h-4" /> Copy</>
                    )}
                  </button>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                  <p className="text-gray-900 dark:text-white font-medium">{selectedTemplate.subject}</p>
                </div>
              </div>

              {/* Body */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Email Body</label>
                  <button
                    onClick={() => copyToClipboard(selectedTemplate.body, `body-${selectedTemplate.id}`)}
                    className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                  >
                    {copiedId === `body-${selectedTemplate.id}` ? (
                      <><Check className="w-4 h-4" /> Copied!</>
                    ) : (
                      <><Copy className="w-4 h-4" /> Copy</>
                    )}
                  </button>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 max-h-96 overflow-y-auto">
                  <pre className="text-gray-900 dark:text-white whitespace-pre-wrap font-sans text-sm leading-relaxed">
                    {selectedTemplate.body}
                  </pre>
                </div>
              </div>

              {/* Variables */}
              <div>
                <button
                  onClick={() => setShowVariables(!showVariables)}
                  className="flex items-center gap-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  <ChevronDown className={`w-4 h-4 transition-transform ${showVariables ? 'rotate-180' : ''}`} />
                  Personalization Variables ({selectedTemplate.variables.length})
                </button>
                {showVariables && (
                  <div className="flex flex-wrap gap-2">
                    {selectedTemplate.variables.map(variable => (
                      <span
                        key={variable}
                        className="px-3 py-1 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 rounded-full text-sm font-mono cursor-pointer hover:bg-primary-200 dark:hover:bg-primary-900/50 transition-colors"
                        onClick={() => copyToClipboard(`{{${variable}}}`, variable)}
                      >
                        {`{{${variable}}}`}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Copy All Button */}
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <Button
                  onClick={() => copyToClipboard(
                    `Subject: ${selectedTemplate.subject}\n\n${selectedTemplate.body}`,
                    `all-${selectedTemplate.id}`
                  )}
                  className="w-full"
                >
                  {copiedId === `all-${selectedTemplate.id}` ? (
                    <><Check className="w-4 h-4 mr-2" /> Copied to Clipboard!</>
                  ) : (
                    <><Copy className="w-4 h-4 mr-2" /> Copy Full Email</>
                  )}
                </Button>
              </div>
            </Card>
          ) : (
            <Card className="p-12 text-center">
              <Mail className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                Select a Template
              </h3>
              <p className="text-gray-500 dark:text-gray-400">
                Choose a template from the list to preview and copy
              </p>
            </Card>
          )}
        </div>
      </div>

      {/* Create/Edit Modal */}
      {(isCreateModalOpen || editingTemplate) && (
        <TemplateModal
          template={editingTemplate}
          onClose={() => {
            setIsCreateModalOpen(false)
            setEditingTemplate(null)
          }}
          onSave={(template) => {
            if (editingTemplate) {
              setTemplates(templates.map(t => t.id === template.id ? template : t))
              setSelectedTemplate(template)
            } else {
              const newTemplate = { ...template, id: Date.now().toString() }
              setTemplates([...templates, newTemplate])
            }
            setIsCreateModalOpen(false)
            setEditingTemplate(null)
          }}
        />
      )}
    </div>
  )
}

// Template Modal Component
function TemplateModal({
  template,
  onClose,
  onSave
}: {
  template: EmailTemplate | null
  onClose: () => void
  onSave: (template: EmailTemplate) => void
}) {
  const [formData, setFormData] = useState<Partial<EmailTemplate>>(template || {
    name: '',
    category: 'cold-outreach',
    subject: '',
    body: '',
    variables: [],
    starred: false
  })

  const extractVariables = (text: string): string[] => {
    const matches = text.match(/\{\{([^}]+)\}\}/g) || []
    return [...new Set(matches.map(m => m.replace(/\{\{|\}\}/g, '')))]
  }

  const handleSave = () => {
    const variables = extractVariables(`${formData.subject} ${formData.body}`)
    onSave({
      ...formData,
      id: template?.id || '',
      variables
    } as EmailTemplate)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {template ? 'Edit Template' : 'Create Template'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Template Name
            </label>
            <Input
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Initial Cold Outreach"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Category
            </label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as EmailTemplate['category'] })}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="cold-outreach">Cold Outreach</option>
              <option value="follow-up">Follow-up</option>
              <option value="onboarding">Onboarding</option>
              <option value="check-in">Check-in</option>
              <option value="upsell">Upsell</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Subject Line
            </label>
            <Input
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Use {{variable}} for personalization"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Email Body
            </label>
            <textarea
              value={formData.body}
              onChange={(e) => setFormData({ ...formData, body: e.target.value })}
              placeholder="Write your email content here. Use {{variable}} for personalization."
              rows={12}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              <strong>Tip:</strong> Use {`{{variable_name}}`} syntax for personalization. Variables will be automatically detected.
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            {template ? 'Save Changes' : 'Create Template'}
          </Button>
        </div>
      </div>
    </div>
  )
}
