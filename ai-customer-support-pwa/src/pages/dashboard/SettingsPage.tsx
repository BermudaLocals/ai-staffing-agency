import React, { useState } from 'react'
import {
  Settings,
  Palette,
  Bell,
  Shield,
  CreditCard,
  Code,
  Globe,
  MessageCircle,
  Copy,
  Check,
  Eye,
  EyeOff,
  RefreshCw,
  ExternalLink
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Button, Input, Badge } from '../../components/ui'

const tabs = [
  { id: 'widget', label: 'Widget', icon: MessageCircle },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'integrations', label: 'Integrations', icon: Code },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'billing', label: 'Billing', icon: CreditCard },
]

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('widget')
  const [copied, setCopied] = useState(false)
  const [showApiKey, setShowApiKey] = useState(false)

  // Widget settings
  const [widgetSettings, setWidgetSettings] = useState({
    primaryColor: '#4F46E5',
    position: 'bottom-right',
    welcomeMessage: 'Hi! 👋 How can I help you today?',
    offlineMessage: "We're currently offline. Leave a message and we'll get back to you.",
    showBranding: true,
    autoOpen: false,
    autoOpenDelay: 5,
  })

  // Notification settings
  const [notifications, setNotifications] = useState({
    emailNewConversation: true,
    emailEscalation: true,
    emailDailySummary: false,
    pushNewMessage: true,
    pushEscalation: true,
    slackIntegration: false,
  })

  const apiKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY || 'your-stripe-key-here'

  const copyApiKey = () => {
    navigator.clipboard.writeText(apiKey)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const embedCode = `<!-- AI Support Widget -->
<script 
  src="https://cdn.aisupport.com/widget.js" 
  data-api-key="${apiKey}"
  async>
</script>`

  const renderTabContent = () => {
    switch (activeTab) {
      case 'widget':
        return (
          <div className="space-y-6">
            {/* Appearance */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Palette className="w-5 h-5" />
                  Appearance
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Color */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Brand Color
                  </label>
                  <div className="flex items-center gap-4">
                    <input
                      type="color"
                      value={widgetSettings.primaryColor}
                      onChange={(e) => setWidgetSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-12 h-12 rounded-lg cursor-pointer border-0"
                    />
                    <Input
                      value={widgetSettings.primaryColor}
                      onChange={(e) => setWidgetSettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                      className="w-32"
                    />
                    <div className="flex gap-2">
                      {['#4F46E5', '#059669', '#DC2626', '#7C3AED', '#2563EB', '#D97706'].map((color) => (
                        <button
                          key={color}
                          onClick={() => setWidgetSettings(prev => ({ ...prev, primaryColor: color }))}
                          className={`w-8 h-8 rounded-full border-2 ${
                            widgetSettings.primaryColor === color ? 'border-gray-900' : 'border-transparent'
                          }`}
                          style={{ backgroundColor: color }}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Position */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Widget Position
                  </label>
                  <div className="grid grid-cols-2 gap-4 max-w-md">
                    {(['bottom-right', 'bottom-left'] as const).map((position) => (
                      <button
                        key={position}
                        onClick={() => setWidgetSettings(prev => ({ ...prev, position }))}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          widgetSettings.position === position
                            ? 'border-primary-600 bg-primary-50'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="h-16 bg-gray-100 rounded relative mb-2">
                          <div
                            className={`absolute bottom-2 ${position === 'bottom-right' ? 'right-2' : 'left-2'} w-6 h-6 rounded-full`}
                            style={{ backgroundColor: widgetSettings.primaryColor }}
                          />
                        </div>
                        <p className="text-sm font-medium text-gray-700 capitalize">
                          {position.replace('-', ' ')}
                        </p>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Show Branding */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Show "Powered by" branding</p>
                    <p className="text-sm text-gray-500">Display AI Support branding on widget</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={widgetSettings.showBranding}
                      onChange={(e) => setWidgetSettings(prev => ({ ...prev, showBranding: e.target.checked }))}
                      className="sr-only peer"
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                  </label>
                </div>
              </CardContent>
            </Card>

            {/* Messages */}
            <Card>
              <CardHeader>
                <CardTitle>Messages</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Welcome Message
                  </label>
                  <textarea
                    value={widgetSettings.welcomeMessage}
                    onChange={(e) => setWidgetSettings(prev => ({ ...prev, welcomeMessage: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Offline Message
                  </label>
                  <textarea
                    value={widgetSettings.offlineMessage}
                    onChange={(e) => setWidgetSettings(prev => ({ ...prev, offlineMessage: e.target.value }))}
                    className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                    rows={2}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Embed Code */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Code className="w-5 h-5" />
                  Embed Code
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Add this code to your website before the closing &lt;/body&gt; tag.
                </p>
                <div className="relative">
                  <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 overflow-x-auto text-sm">
                    <code>{embedCode}</code>
                  </pre>
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(embedCode)
                      setCopied(true)
                      setTimeout(() => setCopied(false), 2000)
                    }}
                    className="absolute top-3 right-3 p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    {copied ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <Copy className="w-4 h-4 text-gray-400" />
                    )}
                  </button>
                </div>
              </CardContent>
            </Card>

            {/* Preview */}
            <Card>
              <CardHeader>
                <CardTitle>Preview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-100 rounded-xl p-8 flex justify-center">
                  <div className="bg-white rounded-2xl shadow-xl overflow-hidden w-80">
                    <div
                      className="px-4 py-3 text-white flex items-center gap-3"
                      style={{ backgroundColor: widgetSettings.primaryColor }}
                    >
                      <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <MessageCircle className="w-5 h-5" />
                      </div>
                      <div>
                        <p className="font-medium">Support</p>
                        <p className="text-xs opacity-80">Online</p>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="bg-gray-100 rounded-2xl rounded-bl-md p-3 max-w-[80%]">
                        <p className="text-sm text-gray-700">{widgetSettings.welcomeMessage}</p>
                      </div>
                    </div>
                    <div className="p-4 border-t border-gray-100">
                      <div className="bg-gray-100 rounded-full px-4 py-2 text-sm text-gray-400">
                        Type a message...
                      </div>
                    </div>
                    {widgetSettings.showBranding && (
                      <div className="px-4 py-2 text-center border-t border-gray-100">
                        <p className="text-xs text-gray-400">Powered by AI Support</p>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end">
              <Button>Save Changes</Button>
            </div>
          </div>
        )

      case 'notifications':
        return (
          <Card>
            <CardHeader>
              <CardTitle>Notification Preferences</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-4">Email Notifications</h3>
                <div className="space-y-4">
                  {[
                    { key: 'emailNewConversation', label: 'New conversation started', desc: 'Get notified when a customer starts a new chat' },
                    { key: 'emailEscalation', label: 'Conversation escalated', desc: 'Get notified when AI escalates to human' },
                    { key: 'emailDailySummary', label: 'Daily summary', desc: 'Receive a daily summary of support activity' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications[item.key as keyof typeof notifications]}
                          onChange={(e) => setNotifications(prev => ({ ...prev, [item.key]: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h3 className="font-medium text-gray-900 mb-4">Push Notifications</h3>
                <div className="space-y-4">
                  {[
                    { key: 'pushNewMessage', label: 'New messages', desc: 'Get push notifications for new messages' },
                    { key: 'pushEscalation', label: 'Escalations', desc: 'Get push notifications for escalations' },
                  ].map((item) => (
                    <div key={item.key} className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">{item.label}</p>
                        <p className="text-sm text-gray-500">{item.desc}</p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={notifications[item.key as keyof typeof notifications]}
                          onChange={(e) => setNotifications(prev => ({ ...prev, [item.key]: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <Button>Save Preferences</Button>
              </div>
            </CardContent>
          </Card>
        )

      case 'integrations':
        return (
          <div className="space-y-6">
            {/* API Key */}
            <Card>
              <CardHeader>
                <CardTitle>API Key</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-500 mb-4">
                  Use this API key to authenticate requests to the AI Support API.
                </p>
                <div className="flex gap-3">
                  <div className="flex-1 relative">
                    <input
                      type={showApiKey ? 'text' : 'password'}
                      value={apiKey}
                      readOnly
                      className="w-full px-4 py-2 pr-20 rounded-lg border border-gray-300 bg-gray-50 font-mono text-sm"
                    />
                    <button
                      onClick={() => setShowApiKey(!showApiKey)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showApiKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  <Button variant="outline" onClick={copyApiKey}>
                    {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                  </Button>
                  <Button variant="outline">
                    <RefreshCw className="w-4 h-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Integrations */}
            <Card>
              <CardHeader>
                <CardTitle>Available Integrations</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  {[
                    { name: 'Slack', desc: 'Get notifications in Slack', connected: false, icon: '💬' },
                    { name: 'Zapier', desc: 'Connect to 5000+ apps', connected: false, icon: '⚡' },
                    { name: 'Stripe', desc: 'Payment processing', connected: true, icon: '💳' },
                    { name: 'Shopify', desc: 'E-commerce integration', connected: false, icon: '🛒' },
                    { name: 'WordPress', desc: 'WordPress plugin', connected: false, icon: '📝' },
                    { name: 'HubSpot', desc: 'CRM integration', connected: false, icon: '🎯' },
                  ].map((integration) => (
                    <div key={integration.name} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg">
                      <div className="flex items-center gap-3">
                        <span className="text-2xl">{integration.icon}</span>
                        <div>
                          <p className="font-medium text-gray-900">{integration.name}</p>
                          <p className="text-sm text-gray-500">{integration.desc}</p>
                        </div>
                      </div>
                      {integration.connected ? (
                        <Badge variant="success">Connected</Badge>
                      ) : (
                        <Button variant="outline" size="sm">Connect</Button>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'security':
        return (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Security Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="font-medium text-gray-900 mb-4">Two-Factor Authentication</h3>
                  <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">2FA is disabled</p>
                      <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                    </div>
                    <Button>Enable 2FA</Button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-medium text-gray-900 mb-4">Change Password</h3>
                  <div className="space-y-4 max-w-md">
                    <Input label="Current Password" type="password" />
                    <Input label="New Password" type="password" />
                    <Input label="Confirm New Password" type="password" />
                    <Button>Update Password</Button>
                  </div>
                </div>

                <div className="border-t border-gray-200 pt-6">
                  <h3 className="font-medium text-gray-900 mb-4">Active Sessions</h3>
                  <div className="space-y-3">
                    {[
                      { device: 'Chrome on MacOS', location: 'San Francisco, US', current: true },
                      { device: 'Safari on iPhone', location: 'San Francisco, US', current: false },
                    ].map((session, index) => (
                      <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                        <div>
                          <p className="font-medium text-gray-900">
                            {session.device}
                            {session.current && <Badge variant="success" size="sm" className="ml-2">Current</Badge>}
                          </p>
                          <p className="text-sm text-gray-500">{session.location}</p>
                        </div>
                        {!session.current && (
                          <Button variant="outline" size="sm">Revoke</Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )

      case 'billing':
        return (
          <div className="space-y-6">
            {/* Current Plan */}
            <Card>
              <CardHeader>
                <CardTitle>Current Plan</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-6 bg-primary-50 rounded-xl border-2 border-primary-200">
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="text-xl font-bold text-gray-900">Growth Plan</h3>
                      <Badge variant="info">Current</Badge>
                    </div>
                    <p className="text-gray-600 mt-1">5,000 conversations/month</p>
                    <p className="text-3xl font-bold text-gray-900 mt-4">$79<span className="text-lg font-normal text-gray-500">/month</span></p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-500">Next billing date</p>
                    <p className="font-medium text-gray-900">February 22, 2026</p>
                    <Button variant="outline" className="mt-4">Change Plan</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Usage */}
            <Card>
              <CardHeader>
                <CardTitle>Usage This Month</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Conversations</span>
                      <span className="font-medium">3,245 / 5,000</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-primary-600 rounded-full" style={{ width: '65%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">AI Messages</span>
                      <span className="font-medium">12,456 / 25,000</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-green-500 rounded-full" style={{ width: '50%' }} />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span className="text-gray-600">Knowledge Base Storage</span>
                      <span className="font-medium">45 MB / 100 MB</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div className="h-full bg-purple-500 rounded-full" style={{ width: '45%' }} />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle>Payment Method</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-800 rounded flex items-center justify-center text-white text-xs font-bold">
                      VISA
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                      <p className="text-sm text-gray-500">Expires 12/2027</p>
                    </div>
                  </div>
                  <Button variant="outline" size="sm">Update</Button>
                </div>
              </CardContent>
            </Card>

            {/* Invoices */}
            <Card>
              <CardHeader>
                <CardTitle>Billing History</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { date: 'Jan 22, 2026', amount: '$79.00', status: 'Paid' },
                    { date: 'Dec 22, 2025', amount: '$79.00', status: 'Paid' },
                    { date: 'Nov 22, 2025', amount: '$79.00', status: 'Paid' },
                  ].map((invoice, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                      <div>
                        <p className="font-medium text-gray-900">{invoice.date}</p>
                        <p className="text-sm text-gray-500">{invoice.amount}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant="success" size="sm">{invoice.status}</Badge>
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-500 mt-1">Manage your account and widget settings</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="flex gap-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 py-4 border-b-2 text-sm font-medium transition-colors ${
                activeTab === tab.id
                  ? 'border-primary-600 text-primary-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              }`}
            >
              <tab.icon className="w-4 h-4" />
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      {/* Content */}
      {renderTabContent()}
    </div>
  )
}
