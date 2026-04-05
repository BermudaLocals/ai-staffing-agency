import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { 
  MessageCircle, 
  Building2, 
  Upload, 
  Palette, 
  Code, 
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Globe,
  FileText,
  Link as LinkIcon,
  Copy,
  Check
} from 'lucide-react'
import { Button, Input, Card } from '../components/ui'

interface SetupData {
  businessName: string
  website: string
  industry: string
  knowledgeFiles: File[]
  websiteUrl: string
  primaryColor: string
  welcomeMessage: string
  position: 'bottom-right' | 'bottom-left'
}

const industries = [
  'E-commerce',
  'SaaS',
  'Healthcare',
  'Finance',
  'Education',
  'Real Estate',
  'Travel',
  'Other',
]

export default function SetupPage() {
  const navigate = useNavigate()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [copied, setCopied] = useState(false)
  const [setupData, setSetupData] = useState<SetupData>({
    businessName: '',
    website: '',
    industry: '',
    knowledgeFiles: [],
    websiteUrl: '',
    primaryColor: '#4F46E5',
    welcomeMessage: 'Hi! 👋 How can I help you today?',
    position: 'bottom-right',
  })

  const totalSteps = 5

  const updateSetupData = (updates: Partial<SetupData>) => {
    setSetupData(prev => ({ ...prev, ...updates }))
  }

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    updateSetupData({ knowledgeFiles: [...setupData.knowledgeFiles, ...files] })
  }

  const removeFile = (index: number) => {
    updateSetupData({
      knowledgeFiles: setupData.knowledgeFiles.filter((_, i) => i !== index)
    })
  }

  const handleNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  const handleComplete = async () => {
    setIsLoading(true)
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000))
    setIsLoading(false)
    navigate('/dashboard')
  }

  const copyEmbedCode = () => {
    const code = `<script src="https://cdn.aisupport.com/widget.js" data-api-key="YOUR_API_KEY" async></script>`
    navigator.clipboard.writeText(code)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const embedCode = `<!-- AI Support Widget -->
<script 
  src="https://cdn.aisupport.com/widget.js" 
  data-api-key="sk_live_xxxxxxxxxxxxx"
  async>
</script>`

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Building2 className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Tell us about your business
              </h2>
              <p className="text-gray-600">
                This helps us customize the AI for your needs
              </p>
            </div>

            <Input
              label="Business name"
              value={setupData.businessName}
              onChange={(e) => updateSetupData({ businessName: e.target.value })}
              placeholder="Acme Inc."
              required
            />

            <Input
              label="Website URL"
              value={setupData.website}
              onChange={(e) => updateSetupData({ website: e.target.value })}
              placeholder="https://www.example.com"
              leftIcon={<Globe className="w-5 h-5" />}
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Industry
              </label>
              <div className="grid grid-cols-2 gap-3">
                {industries.map((industry) => (
                  <button
                    key={industry}
                    type="button"
                    onClick={() => updateSetupData({ industry })}
                    className={`
                      px-4 py-3 rounded-lg border-2 text-sm font-medium transition-all
                      ${setupData.industry === industry
                        ? 'border-primary-600 bg-primary-50 text-primary-700'
                        : 'border-gray-200 hover:border-gray-300 text-gray-700'
                      }
                    `}
                  >
                    {industry}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Upload className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Train your AI assistant
              </h2>
              <p className="text-gray-600">
                Upload documents or add your website to train the AI
              </p>
            </div>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload documents
              </label>
              <div
                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-500 transition-colors cursor-pointer"
                onClick={() => document.getElementById('file-upload')?.click()}
              >
                <input
                  id="file-upload"
                  type="file"
                  multiple
                  accept=".pdf,.doc,.docx,.txt,.csv"
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 mb-2">
                  Drag and drop files here, or click to browse
                </p>
                <p className="text-sm text-gray-400">
                  Supports PDF, DOC, DOCX, TXT, CSV (max 10MB each)
                </p>
              </div>

              {/* Uploaded Files */}
              {setupData.knowledgeFiles.length > 0 && (
                <div className="mt-4 space-y-2">
                  {setupData.knowledgeFiles.map((file, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-gray-50 rounded-lg px-4 py-3"
                    >
                      <div className="flex items-center gap-3">
                        <FileText className="w-5 h-5 text-gray-400" />
                        <span className="text-sm text-gray-700">{file.name}</span>
                        <span className="text-xs text-gray-400">
                          {(file.size / 1024).toFixed(1)} KB
                        </span>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="text-gray-400 hover:text-red-500"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Website Crawl */}
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-200" />
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white text-gray-500">Or</span>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Crawl your website
              </label>
              <div className="flex gap-3">
                <Input
                  value={setupData.websiteUrl}
                  onChange={(e) => updateSetupData({ websiteUrl: e.target.value })}
                  placeholder="https://www.example.com/docs"
                  leftIcon={<LinkIcon className="w-5 h-5" />}
                  className="flex-1"
                />
                <Button variant="outline">
                  Crawl
                </Button>
              </div>
              <p className="text-xs text-gray-400 mt-2">
                We'll automatically extract content from your website
              </p>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Palette className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Customize your widget
              </h2>
              <p className="text-gray-600">
                Match the chat widget to your brand
              </p>
            </div>

            {/* Color Picker */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Brand color
              </label>
              <div className="flex items-center gap-4">
                <input
                  type="color"
                  value={setupData.primaryColor}
                  onChange={(e) => updateSetupData({ primaryColor: e.target.value })}
                  className="w-12 h-12 rounded-lg cursor-pointer border-0"
                />
                <Input
                  value={setupData.primaryColor}
                  onChange={(e) => updateSetupData({ primaryColor: e.target.value })}
                  className="w-32"
                />
                <div className="flex gap-2">
                  {['#4F46E5', '#059669', '#DC2626', '#7C3AED', '#2563EB'].map((color) => (
                    <button
                      key={color}
                      onClick={() => updateSetupData({ primaryColor: color })}
                      className={`w-8 h-8 rounded-full border-2 ${
                        setupData.primaryColor === color ? 'border-gray-900' : 'border-transparent'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Welcome Message */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Welcome message
              </label>
              <textarea
                value={setupData.welcomeMessage}
                onChange={(e) => updateSetupData({ welcomeMessage: e.target.value })}
                className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                rows={3}
                placeholder="Hi! How can I help you today?"
              />
            </div>

            {/* Position */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Widget position
              </label>
              <div className="grid grid-cols-2 gap-4">
                {(['bottom-right', 'bottom-left'] as const).map((position) => (
                  <button
                    key={position}
                    onClick={() => updateSetupData({ position })}
                    className={`
                      p-4 rounded-lg border-2 transition-all
                      ${setupData.position === position
                        ? 'border-primary-600 bg-primary-50'
                        : 'border-gray-200 hover:border-gray-300'
                      }
                    `}
                  >
                    <div className="h-24 bg-gray-100 rounded relative mb-2">
                      <div
                        className={`absolute bottom-2 ${position === 'bottom-right' ? 'right-2' : 'left-2'} w-8 h-8 rounded-full`}
                        style={{ backgroundColor: setupData.primaryColor }}
                      />
                    </div>
                    <p className="text-sm font-medium text-gray-700 capitalize">
                      {position.replace('-', ' ')}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* Preview */}
            <div className="bg-gray-100 rounded-xl p-6">
              <p className="text-sm font-medium text-gray-700 mb-4">Preview</p>
              <div className="bg-white rounded-lg shadow-lg overflow-hidden max-w-xs">
                <div
                  className="px-4 py-3 text-white flex items-center gap-3"
                  style={{ backgroundColor: setupData.primaryColor }}
                >
                  <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                    <MessageCircle className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="font-medium text-sm">{setupData.businessName || 'Support'}</p>
                    <p className="text-xs opacity-80">Online</p>
                  </div>
                </div>
                <div className="p-4">
                  <div className="bg-gray-100 rounded-lg rounded-bl-sm p-3 max-w-[80%]">
                    <p className="text-sm text-gray-700">{setupData.welcomeMessage}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-primary-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                <Code className="w-8 h-8 text-primary-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Install the widget
              </h2>
              <p className="text-gray-600">
                Add this code to your website to enable the chat widget
              </p>
            </div>

            {/* Embed Code */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium text-gray-700">
                  Embed code
                </label>
                <button
                  onClick={copyEmbedCode}
                  className="flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700"
                >
                  {copied ? (
                    <>
                      <Check className="w-4 h-4" />
                      Copied!
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      Copy code
                    </>
                  )}
                </button>
              </div>
              <pre className="bg-gray-900 text-gray-100 rounded-xl p-4 overflow-x-auto text-sm">
                <code>{embedCode}</code>
              </pre>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 rounded-xl p-4">
              <h4 className="font-medium text-blue-900 mb-2">Installation instructions</h4>
              <ol className="text-sm text-blue-800 space-y-2">
                <li>1. Copy the code above</li>
                <li>2. Paste it before the closing <code className="bg-blue-100 px-1 rounded">&lt;/body&gt;</code> tag on your website</li>
                <li>3. Save and publish your changes</li>
                <li>4. The chat widget will appear on your website!</li>
              </ol>
            </div>

            {/* Platform-specific */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-3">Or use our integrations</p>
              <div className="grid grid-cols-3 gap-3">
                {['WordPress', 'Shopify', 'Webflow'].map((platform) => (
                  <button
                    key={platform}
                    className="p-4 border border-gray-200 rounded-lg hover:border-primary-500 hover:bg-primary-50 transition-all text-center"
                  >
                    <p className="text-sm font-medium text-gray-700">{platform}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
        )

      case 5:
        return (
          <div className="text-center">
            <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              You're all set! 🎉
            </h2>
            <p className="text-gray-600 mb-8">
              Your AI support assistant is ready to help your customers
            </p>

            <div className="bg-gray-50 rounded-xl p-6 mb-8">
              <h3 className="font-medium text-gray-900 mb-4">What's next?</h3>
              <div className="space-y-3 text-left">
                {[
                  'Test the chat widget on your website',
                  'Add more knowledge base documents',
                  'Invite your team members',
                  'Set up email notifications',
                ].map((item, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-6 h-6 bg-primary-100 rounded-full flex items-center justify-center text-xs font-medium text-primary-600">
                      {index + 1}
                    </div>
                    <span className="text-gray-700">{item}</span>
                  </div>
                ))}
              </div>
            </div>

            <Button size="lg" onClick={handleComplete} isLoading={isLoading}>
              Go to Dashboard
            </Button>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-3xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-primary-600 rounded-lg flex items-center justify-center">
                <MessageCircle className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-gray-900">AI Support</span>
            </div>
            <div className="flex items-center gap-2">
              {Array.from({ length: totalSteps }).map((_, index) => (
                <div
                  key={index}
                  className={`w-8 h-1 rounded-full transition-colors ${
                    index + 1 <= currentStep ? 'bg-primary-600' : 'bg-gray-200'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-xl mx-auto px-4 py-12">
        <Card padding="lg">
          {renderStep()}

          {/* Navigation */}
          {currentStep < 5 && (
            <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-100">
              <Button
                variant="ghost"
                onClick={handleBack}
                disabled={currentStep === 1}
                leftIcon={<ArrowLeft className="w-4 h-4" />}
              >
                Back
              </Button>
              <Button
                onClick={handleNext}
                rightIcon={<ArrowRight className="w-4 h-4" />}
              >
                {currentStep === 4 ? 'Complete Setup' : 'Continue'}
              </Button>
            </div>
          )}
        </Card>
      </main>
    </div>
  )
}
