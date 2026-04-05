import React, { useState, useEffect, useRef } from 'react'
import { MessageCircle, X, Minimize2, Maximize2 } from 'lucide-react'
import { ChatMessage } from './ChatMessage'
import { ChatInput } from './ChatInput'
import { TypingIndicator } from './TypingIndicator'
import { Message, WidgetSettings } from '../../types'
import { aiService } from '../../lib/ai'

interface ChatWidgetProps {
  apiKey: string
  settings?: Partial<WidgetSettings>
  onReady?: () => void
  onOpen?: () => void
  onClose?: () => void
}

const defaultSettings: WidgetSettings = {
  primaryColor: '#4F46E5',
  secondaryColor: '#818CF8',
  textColor: '#1F2937',
  backgroundColor: '#FFFFFF',
  position: 'bottom-right',
  welcomeMessage: 'Hi! 👋 How can I help you today?',
  bubbleIcon: 'chat',
  showBranding: true,
  autoOpen: false,
  autoOpenDelay: 5000,
  offlineMessage: 'We're currently offline. Leave a message and we'll get back to you!',
  collectEmail: false,
  collectName: false,
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({
  apiKey,
  settings: customSettings,
  onReady,
  onOpen,
  onClose,
}) => {
  const settings = { ...defaultSettings, ...customSettings }
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [isTyping, setIsTyping] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [customerInfo, setCustomerInfo] = useState<{ name?: string; email?: string }>({})
  const [showInfoForm, setShowInfoForm] = useState(settings.collectEmail || settings.collectName)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const conversationId = useRef<string>(`conv_${Date.now()}`)

  useEffect(() => {
    onReady?.()

    // Auto-open after delay
    if (settings.autoOpen) {
      const timer = setTimeout(() => {
        setIsOpen(true)
        onOpen?.()
      }, settings.autoOpenDelay)
      return () => clearTimeout(timer)
    }
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Add welcome message when chat opens for the first time
    if (isOpen && messages.length === 0 && !showInfoForm) {
      const welcomeMessage: Message = {
        id: `msg_${Date.now()}`,
        conversationId: conversationId.current,
        senderType: 'ai',
        content: settings.welcomeMessage,
        createdAt: new Date().toISOString(),
        metadata: {},
      }
      setMessages([welcomeMessage])
    }
  }, [isOpen, showInfoForm])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleOpen = () => {
    setIsOpen(true)
    setIsMinimized(false)
    onOpen?.()
  }

  const handleClose = () => {
    setIsOpen(false)
    onClose?.()
  }

  const handleMinimize = () => {
    setIsMinimized(!isMinimized)
  }

  const handleInfoSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setShowInfoForm(false)
  }

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    // Add customer message
    const customerMessage: Message = {
      id: `msg_${Date.now()}`,
      conversationId: conversationId.current,
      senderType: 'customer',
      content,
      createdAt: new Date().toISOString(),
      metadata: {},
    }
    setMessages(prev => [...prev, customerMessage])
    setIsTyping(true)
    setIsLoading(true)

    try {
      // Get AI response
      const conversationHistory = messages.map(m => ({
        role: m.senderType === 'customer' ? 'user' as const : 'assistant' as const,
        content: m.content,
      }))

      const response = await aiService.generateResponse(
        content,
        conversationHistory,
        {
          documents: [], // Would be loaded from knowledge base
          faqs: [],
          businessName: 'Support',
        }
      )

      // Add AI response
      const aiMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        conversationId: conversationId.current,
        senderType: 'ai',
        content: response.content,
        aiConfidence: response.confidence,
        createdAt: new Date().toISOString(),
        metadata: {
          sentiment: response.sentiment,
          suggestedArticles: response.suggestedArticles,
        },
      }
      setMessages(prev => [...prev, aiMessage])

      // Handle escalation if needed
      if (response.shouldEscalate) {
        setTimeout(() => {
          const escalationMessage: Message = {
            id: `msg_${Date.now() + 2}`,
            conversationId: conversationId.current,
            senderType: 'ai',
            content: "I'm connecting you with a human agent who can better assist you. Please hold on...",
            createdAt: new Date().toISOString(),
            metadata: {},
          }
          setMessages(prev => [...prev, escalationMessage])
        }, 1000)
      }
    } catch (error) {
      console.error('Error sending message:', error)
      const errorMessage: Message = {
        id: `msg_${Date.now() + 1}`,
        conversationId: conversationId.current,
        senderType: 'ai',
        content: "I apologize, but I'm having trouble processing your request. Please try again or contact support directly.",
        createdAt: new Date().toISOString(),
        metadata: {},
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
      setIsLoading(false)
    }
  }

  const positionStyles = settings.position === 'bottom-right'
    ? 'right-4 bottom-4'
    : 'left-4 bottom-4'

  return (
    <div className={`fixed ${positionStyles} z-[9999] font-sans`}>
      {/* Chat Window */}
      {isOpen && (
        <div
          className={`
            mb-4 bg-white rounded-2xl shadow-2xl overflow-hidden
            transition-all duration-300 ease-out
            ${isMinimized ? 'h-14' : 'h-[500px]'}
            w-[380px] max-w-[calc(100vw-2rem)]
            flex flex-col
          `}
          style={{
            boxShadow: '0 10px 40px rgba(0,0,0,0.15)',
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-4 py-3 text-white"
            style={{ backgroundColor: settings.primaryColor }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <MessageCircle className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-semibold">Support</h3>
                <p className="text-xs opacity-80">We typically reply instantly</p>
              </div>
            </div>
            <div className="flex items-center gap-1">
              <button
                onClick={handleMinimize}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                {isMinimized ? <Maximize2 className="w-4 h-4" /> : <Minimize2 className="w-4 h-4" />}
              </button>
              <button
                onClick={handleClose}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Content */}
          {!isMinimized && (
            <>
              {/* Info Form */}
              {showInfoForm ? (
                <div className="flex-1 p-4 flex flex-col justify-center">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Before we start...
                  </h4>
                  <p className="text-sm text-gray-500 mb-4">
                    Please provide your details so we can assist you better.
                  </p>
                  <form onSubmit={handleInfoSubmit} className="space-y-3">
                    {settings.collectName && (
                      <input
                        type="text"
                        placeholder="Your name"
                        value={customerInfo.name || ''}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, name: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required={settings.collectName}
                      />
                    )}
                    {settings.collectEmail && (
                      <input
                        type="email"
                        placeholder="Your email"
                        value={customerInfo.email || ''}
                        onChange={(e) => setCustomerInfo(prev => ({ ...prev, email: e.target.value }))}
                        className="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
                        required={settings.collectEmail}
                      />
                    )}
                    <button
                      type="submit"
                      className="w-full py-2.5 rounded-lg text-white font-medium transition-colors"
                      style={{ backgroundColor: settings.primaryColor }}
                    >
                      Start Chat
                    </button>
                  </form>
                </div>
              ) : (
                <>
                  {/* Messages */}
                  <div className="flex-1 overflow-y-auto p-4" style={{ backgroundColor: '#F9FAFB' }}>
                    {messages.map((message) => (
                      <ChatMessage
                        key={message.id}
                        message={message}
                        isCustomerView={true}
                      />
                    ))}
                    {isTyping && <TypingIndicator />}
                    <div ref={messagesEndRef} />
                  </div>

                  {/* Input */}
                  <ChatInput
                    onSend={handleSendMessage}
                    disabled={isLoading}
                    placeholder="Type your message..."
                    showAttachments={false}
                  />
                </>
              )}

              {/* Branding */}
              {settings.showBranding && (
                <div className="text-center py-2 text-xs text-gray-400 border-t border-gray-100">
                  Powered by <span className="font-medium">AI Support</span>
                </div>
              )}
            </>
          )}
        </div>
      )}

      {/* Chat Bubble */}
      {!isOpen && (
        <button
          onClick={handleOpen}
          className="
            w-14 h-14 rounded-full shadow-lg
            flex items-center justify-center
            transition-all duration-300 hover:scale-110
            animate-bounce-slow
          "
          style={{ backgroundColor: settings.primaryColor }}
        >
          <MessageCircle className="w-6 h-6 text-white" />
        </button>
      )}
    </div>
  )
}
