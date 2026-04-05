import React, { useState } from 'react'
import {
  MessageCircle,
  X,
  Send,
  Minimize2,
  Maximize2,
  Smartphone,
  Monitor,
  Copy,
  Check,
  Palette,
  Settings,
  Bot,
  User,
  Sparkles
} from 'lucide-react'
import { Button, Card, Input } from '../ui'

interface WidgetConfig {
  primaryColor: string
  position: 'bottom-right' | 'bottom-left'
  greeting: string
  placeholder: string
  botName: string
  botAvatar: string
  showBranding: boolean
  autoOpen: boolean
  soundEnabled: boolean
}

const defaultConfig: WidgetConfig = {
  primaryColor: '#6366f1',
  position: 'bottom-right',
  greeting: 'Hi there! 👋 How can I help you today?',
  placeholder: 'Type your message...',
  botName: 'AI Assistant',
  botAvatar: '🤖',
  showBranding: true,
  autoOpen: false,
  soundEnabled: true
}

const colorPresets = [
  { name: 'Indigo', value: '#6366f1' },
  { name: 'Purple', value: '#8b5cf6' },
  { name: 'Blue', value: '#3b82f6' },
  { name: 'Teal', value: '#14b8a6' },
  { name: 'Green', value: '#22c55e' },
  { name: 'Orange', value: '#f97316' },
  { name: 'Pink', value: '#ec4899' },
  { name: 'Red', value: '#ef4444' }
]

interface WidgetPreviewProps {
  className?: string
  onConfigChange?: (config: WidgetConfig) => void
}

export default function WidgetPreview({
  className = '',
  onConfigChange
}: WidgetPreviewProps) {
  const [config, setConfig] = useState<WidgetConfig>(defaultConfig)
  const [viewMode, setViewMode] = useState<'desktop' | 'mobile'>('desktop')
  const [isWidgetOpen, setIsWidgetOpen] = useState(true)
  const [copiedCode, setCopiedCode] = useState(false)
  const [activeTab, setActiveTab] = useState<'preview' | 'customize' | 'code'>('preview')

  const updateConfig = (updates: Partial<WidgetConfig>) => {
    const newConfig = { ...config, ...updates }
    setConfig(newConfig)
    onConfigChange?.(newConfig)
  }

  const generateEmbedCode = () => {
    return `<!-- AI Support Widget -->
<script>
  window.AISupportConfig = {
    apiKey: 'YOUR_API_KEY',
    primaryColor: '${config.primaryColor}',
    position: '${config.position}',
    greeting: '${config.greeting}',
    placeholder: '${config.placeholder}',
    botName: '${config.botName}',
    showBranding: ${config.showBranding},
    autoOpen: ${config.autoOpen},
    soundEnabled: ${config.soundEnabled}
  };
</script>
<script src="https://cdn.aisupport.com/widget.js" async></script>`
  }

  const copyEmbedCode = async () => {
    await navigator.clipboard.writeText(generateEmbedCode())
    setCopiedCode(true)
    setTimeout(() => setCopiedCode(false), 2000)
  }

  // Mock conversation for preview
  const mockMessages = [
    { role: 'bot', content: config.greeting },
    { role: 'user', content: 'I need help with my order' },
    { role: 'bot', content: 'I\'d be happy to help you with your order! Could you please provide your order number so I can look it up?' }
  ]

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Tabs */}
      <div className="flex gap-2 border-b border-gray-200 dark:border-gray-700">
        {[
          { id: 'preview', label: 'Preview', icon: <Monitor className="w-4 h-4" /> },
          { id: 'customize', label: 'Customize', icon: <Palette className="w-4 h-4" /> },
          { id: 'code', label: 'Embed Code', icon: <Settings className="w-4 h-4" /> }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`flex items-center gap-2 px-4 py-3 border-b-2 transition-colors ${
              activeTab === tab.id
                ? 'border-primary-500 text-primary-600'
                : 'border-transparent text-gray-500 hover:text-gray-700'
            }`}
          >
            {tab.icon}
            {tab.label}
          </button>
        ))}
      </div>

      {/* Preview Tab */}
      {activeTab === 'preview' && (
        <div className="space-y-4">
          {/* View Mode Toggle */}
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-gray-900 dark:text-white">Widget Preview</h3>
            <div className="flex items-center gap-2 bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
              <button
                onClick={() => setViewMode('desktop')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'desktop'
                    ? 'bg-white dark:bg-gray-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Monitor className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('mobile')}
                className={`p-2 rounded-md transition-colors ${
                  viewMode === 'mobile'
                    ? 'bg-white dark:bg-gray-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Smartphone className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Preview Container */}
          <div
            className={`relative bg-gradient-to-br from-gray-100 to-gray-200 dark:from-gray-800 dark:to-gray-900 rounded-xl overflow-hidden transition-all ${
              viewMode === 'mobile' ? 'max-w-sm mx-auto' : ''
            }`}
            style={{ height: viewMode === 'mobile' ? '600px' : '500px' }}
          >
            {/* Mock Website Background */}
            <div className="absolute inset-0 p-4">
              <div className="h-8 bg-white dark:bg-gray-700 rounded-lg mb-4 flex items-center px-4 gap-2">
                <div className="w-3 h-3 rounded-full bg-red-400" />
                <div className="w-3 h-3 rounded-full bg-yellow-400" />
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <div className="flex-1 bg-gray-100 dark:bg-gray-600 rounded h-4 ml-4" />
              </div>
              <div className="space-y-3">
                <div className="h-4 bg-white/50 dark:bg-gray-700/50 rounded w-3/4" />
                <div className="h-4 bg-white/50 dark:bg-gray-700/50 rounded w-1/2" />
                <div className="h-32 bg-white/30 dark:bg-gray-700/30 rounded" />
                <div className="h-4 bg-white/50 dark:bg-gray-700/50 rounded w-2/3" />
                <div className="h-4 bg-white/50 dark:bg-gray-700/50 rounded w-1/2" />
              </div>
            </div>

            {/* Widget */}
            <div
              className={`absolute ${
                config.position === 'bottom-right' ? 'right-4' : 'left-4'
              } bottom-4 z-10`}
            >
              {isWidgetOpen ? (
                <div
                  className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl overflow-hidden transition-all"
                  style={{ width: viewMode === 'mobile' ? '300px' : '380px' }}
                >
                  {/* Widget Header */}
                  <div
                    className="p-4 text-white"
                    style={{ backgroundColor: config.primaryColor }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center text-xl">
                          {config.botAvatar}
                        </div>
                        <div>
                          <h4 className="font-semibold">{config.botName}</h4>
                          <p className="text-sm text-white/80 flex items-center gap-1">
                            <span className="w-2 h-2 bg-green-400 rounded-full" />
                            Online
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <button className="p-2 hover:bg-white/20 rounded-lg transition-colors">
                          <Minimize2 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setIsWidgetOpen(false)}
                          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Messages */}
                  <div className="h-64 overflow-y-auto p-4 space-y-4">
                    {mockMessages.map((msg, idx) => (
                      <div
                        key={idx}
                        className={`flex gap-2 ${
                          msg.role === 'user' ? 'flex-row-reverse' : ''
                        }`}
                      >
                        {msg.role === 'bot' && (
                          <div
                            className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm flex-shrink-0"
                            style={{ backgroundColor: config.primaryColor }}
                          >
                            {config.botAvatar}
                          </div>
                        )}
                        <div
                          className={`max-w-[80%] p-3 rounded-2xl ${
                            msg.role === 'user'
                              ? 'text-white rounded-br-md'
                              : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white rounded-bl-md'
                          }`}
                          style={{
                            backgroundColor: msg.role === 'user' ? config.primaryColor : undefined
                          }}
                        >
                          <p className="text-sm">{msg.content}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Input */}
                  <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={config.placeholder}
                        className="flex-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
                      />
                      <button
                        className="p-2 rounded-full text-white transition-colors"
                        style={{ backgroundColor: config.primaryColor }}
                      >
                        <Send className="w-4 h-4" />
                      </button>
                    </div>
                    {config.showBranding && (
                      <p className="text-center text-xs text-gray-400 mt-2">
                        Powered by <span className="font-medium">AI Support</span>
                      </p>
                    )}
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => setIsWidgetOpen(true)}
                  className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-transform hover:scale-110"
                  style={{ backgroundColor: config.primaryColor }}
                >
                  <MessageCircle className="w-6 h-6" />
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Customize Tab */}
      {activeTab === 'customize' && (
        <div className="grid md:grid-cols-2 gap-6">
          {/* Color */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Primary Color
            </label>
            <div className="flex flex-wrap gap-2 mb-3">
              {colorPresets.map(color => (
                <button
                  key={color.value}
                  onClick={() => updateConfig({ primaryColor: color.value })}
                  className={`w-8 h-8 rounded-full transition-transform hover:scale-110 ${
                    config.primaryColor === color.value ? 'ring-2 ring-offset-2 ring-gray-400' : ''
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
            <div className="flex items-center gap-2">
              <input
                type="color"
                value={config.primaryColor}
                onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                className="w-10 h-10 rounded cursor-pointer"
              />
              <Input
                value={config.primaryColor}
                onChange={(e) => updateConfig({ primaryColor: e.target.value })}
                className="flex-1 font-mono"
              />
            </div>
          </div>

          {/* Position */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Widget Position
            </label>
            <div className="flex gap-2">
              {[
                { value: 'bottom-right', label: 'Bottom Right' },
                { value: 'bottom-left', label: 'Bottom Left' }
              ].map(pos => (
                <button
                  key={pos.value}
                  onClick={() => updateConfig({ position: pos.value as WidgetConfig['position'] })}
                  className={`flex-1 px-4 py-2 rounded-lg border transition-colors ${
                    config.position === pos.value
                      ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20 text-primary-600'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-800'
                  }`}
                >
                  {pos.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bot Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bot Name
            </label>
            <Input
              value={config.botName}
              onChange={(e) => updateConfig({ botName: e.target.value })}
              placeholder="AI Assistant"
            />
          </div>

          {/* Bot Avatar */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Bot Avatar (emoji)
            </label>
            <Input
              value={config.botAvatar}
              onChange={(e) => updateConfig({ botAvatar: e.target.value })}
              placeholder="🤖"
              maxLength={2}
            />
          </div>

          {/* Greeting */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Welcome Message
            </label>
            <textarea
              value={config.greeting}
              onChange={(e) => updateConfig({ greeting: e.target.value })}
              placeholder="Hi there! How can I help you today?"
              rows={2}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>

          {/* Placeholder */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Input Placeholder
            </label>
            <Input
              value={config.placeholder}
              onChange={(e) => updateConfig({ placeholder: e.target.value })}
              placeholder="Type your message..."
            />
          </div>

          {/* Toggles */}
          <div className="md:col-span-2 space-y-4">
            <label className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Show "Powered by" branding</span>
              <button
                onClick={() => updateConfig({ showBranding: !config.showBranding })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  config.showBranding ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    config.showBranding ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </label>

            <label className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Auto-open widget on page load</span>
              <button
                onClick={() => updateConfig({ autoOpen: !config.autoOpen })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  config.autoOpen ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    config.autoOpen ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </label>

            <label className="flex items-center justify-between">
              <span className="text-gray-700 dark:text-gray-300">Enable notification sounds</span>
              <button
                onClick={() => updateConfig({ soundEnabled: !config.soundEnabled })}
                className={`relative w-12 h-6 rounded-full transition-colors ${
                  config.soundEnabled ? 'bg-primary-500' : 'bg-gray-300 dark:bg-gray-600'
                }`}
              >
                <span
                  className={`absolute top-1 w-4 h-4 bg-white rounded-full transition-transform ${
                    config.soundEnabled ? 'left-7' : 'left-1'
                  }`}
                />
              </button>
            </label>
          </div>
        </div>
      )}

      {/* Code Tab */}
      {activeTab === 'code' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-medium text-gray-900 dark:text-white">Embed Code</h3>
              <p className="text-sm text-gray-500">Copy and paste this code into your website's HTML</p>
            </div>
            <Button onClick={copyEmbedCode}>
              {copiedCode ? (
                <><Check className="w-4 h-4 mr-2" /> Copied!</>
              ) : (
                <><Copy className="w-4 h-4 mr-2" /> Copy Code</>
              )}
            </Button>
          </div>

          <div className="relative">
            <pre className="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
              <code>{generateEmbedCode()}</code>
            </pre>
          </div>

          <Card className="p-4 bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800">
            <div className="flex gap-3">
              <Sparkles className="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-yellow-800 dark:text-yellow-400">Installation Tips</h4>
                <ul className="text-sm text-yellow-700 dark:text-yellow-500 mt-2 space-y-1">
                  <li>• Place the code just before the closing <code className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">&lt;/body&gt;</code> tag</li>
                  <li>• Replace <code className="bg-yellow-200 dark:bg-yellow-800 px-1 rounded">YOUR_API_KEY</code> with your actual API key</li>
                  <li>• The widget will load asynchronously and won't block your page</li>
                  <li>• Test on a staging environment before deploying to production</li>
                </ul>
              </div>
            </div>
          </Card>
        </div>
      )}
    </div>
  )
}
