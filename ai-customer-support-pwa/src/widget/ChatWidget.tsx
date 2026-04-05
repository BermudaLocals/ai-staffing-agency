import React, { useState, useRef, useEffect } from 'react'
import { MessageCircle, X, Send, Paperclip, Smile, Minimize2, User, Bot } from 'lucide-react'

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai' | 'agent'
  timestamp: Date
  status?: 'sending' | 'sent' | 'error'
}

interface WidgetConfig {
  apiKey: string
  primaryColor?: string
  position?: 'bottom-right' | 'bottom-left'
  welcomeMessage?: string
  businessName?: string
  agentName?: string
  agentAvatar?: string
}

const defaultConfig: WidgetConfig = {
  apiKey: '',
  primaryColor: '#4F46E5',
  position: 'bottom-right',
  welcomeMessage: 'Hi! 👋 How can I help you today?',
  businessName: 'Support',
  agentName: 'AI Assistant',
}

export default function ChatWidget({ config = defaultConfig }: { config?: WidgetConfig }) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  const mergedConfig = { ...defaultConfig, ...config }

  // Add welcome message on first open
  useEffect(() => {
    if (isOpen && !hasInteracted && messages.length === 0) {
      setMessages([{
        id: '1',
        content: mergedConfig.welcomeMessage || defaultConfig.welcomeMessage!,
        sender: 'ai',
        timestamp: new Date(),
      }])
      setHasInteracted(true)
    }
  }, [isOpen, hasInteracted, messages.length, mergedConfig.welcomeMessage])

  // Scroll to bottom on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [isOpen])

  const sendMessage = async () => {
    if (!inputValue.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      content: inputValue,
      sender: 'user',
      timestamp: new Date(),
      status: 'sending',
    }

    setMessages(prev => [...prev, userMessage])
    setInputValue('')
    setIsTyping(true)

    try {
      // Simulate AI response - replace with actual API call
      await new Promise(resolve => setTimeout(resolve, 1000 + Math.random() * 1000))

      // Mock AI response
      const responses = [
        "I'd be happy to help you with that! Could you provide more details?",
        "Thanks for reaching out! Let me look into that for you.",
        "Great question! Here's what I found...",
        "I understand your concern. Let me help you resolve this.",
        "Sure thing! Is there anything specific you'd like to know?",
      ]

      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: responses[Math.floor(Math.random() * responses.length)],
        sender: 'ai',
        timestamp: new Date(),
      }

      setMessages(prev => [
        ...prev.map(m => m.id === userMessage.id ? { ...m, status: 'sent' as const } : m),
        aiMessage,
      ])
    } catch (error) {
      setMessages(prev =>
        prev.map(m => m.id === userMessage.id ? { ...m, status: 'error' as const } : m)
      )
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
  }

  const positionClasses = mergedConfig.position === 'bottom-left'
    ? 'left-4 sm:left-6'
    : 'right-4 sm:right-6'

  return (
    <div className={`fixed bottom-4 sm:bottom-6 ${positionClasses} z-[9999] font-sans`}>
      {/* Chat Window */}
      {isOpen && (
        <div
          className="mb-4 bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col"
          style={{
            width: 'min(380px, calc(100vw - 32px))',
            height: 'min(600px, calc(100vh - 120px))',
          }}
        >
          {/* Header */}
          <div
            className="px-4 py-3 flex items-center justify-between text-white"
            style={{ backgroundColor: mergedConfig.primaryColor }}
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5" />
              </div>
              <div>
                <p className="font-semibold">{mergedConfig.businessName}</p>
                <p className="text-xs opacity-80 flex items-center gap-1">
                  <span className="w-2 h-2 bg-green-400 rounded-full" />
                  Online
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-2.5 ${
                    message.sender === 'user'
                      ? 'rounded-br-md text-white'
                      : 'bg-white rounded-bl-md text-gray-800 shadow-sm'
                  }`}
                  style={{
                    backgroundColor: message.sender === 'user' ? mergedConfig.primaryColor : undefined,
                  }}
                >
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  <p
                    className={`text-xs mt-1 ${
                      message.sender === 'user' ? 'text-white/70' : 'text-gray-400'
                    }`}
                  >
                    {formatTime(message.timestamp)}
                    {message.status === 'sending' && ' • Sending...'}
                    {message.status === 'error' && ' • Failed to send'}
                  </p>
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-2xl rounded-bl-md px-4 py-3 shadow-sm">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 bg-white border-t border-gray-100">
            <div className="flex items-center gap-2">
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Paperclip className="w-5 h-5" />
              </button>
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type a message..."
                className="flex-1 px-4 py-2.5 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Smile className="w-5 h-5" />
              </button>
              <button
                onClick={sendMessage}
                disabled={!inputValue.trim()}
                className="p-2.5 rounded-full text-white transition-colors disabled:opacity-50"
                style={{ backgroundColor: mergedConfig.primaryColor }}
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Powered by */}
          <div className="px-4 py-2 text-center border-t border-gray-100">
            <p className="text-xs text-gray-400">
              Powered by <span className="font-medium">AI Support</span>
            </p>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full shadow-lg flex items-center justify-center text-white transition-transform hover:scale-110 active:scale-95"
        style={{ backgroundColor: mergedConfig.primaryColor }}
      >
        {isOpen ? (
          <X className="w-6 h-6" />
        ) : (
          <MessageCircle className="w-6 h-6" />
        )}
      </button>
    </div>
  )
}
