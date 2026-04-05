import React, { useState } from 'react'
import {
  Search,
  Filter,
  MoreVertical,
  Bot,
  User,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Paperclip,
  Smile,
  Phone,
  Video,
  Info,
  ArrowLeft
} from 'lucide-react'
import { Card, Badge, Avatar, Button, Input } from '../../components/ui'
import { useChatStore } from '../../stores/chatStore'
import { format } from 'date-fns'

const mockConversations = [
  {
    id: '1',
    customer: { name: 'John Smith', email: 'john@example.com', avatar: null },
    lastMessage: 'How do I reset my password?',
    status: 'active',
    handler: 'ai',
    unread: 2,
    updatedAt: new Date(Date.now() - 5 * 60000),
    messages: [
      { id: '1', sender: 'customer', content: 'Hi, I need help', timestamp: new Date(Date.now() - 10 * 60000) },
        { id: '2', sender: 'ai', content: "Hello! I'd be happy to help. What can I assist you with today?", timestamp: new Date(Date.now() - 9 * 60000), confidence: 0.95 },
      { id: '3', sender: 'customer', content: 'How do I reset my password?', timestamp: new Date(Date.now() - 5 * 60000) },
    ]
  },
  {
    id: '2',
    customer: { name: 'Sarah Johnson', email: 'sarah@example.com', avatar: null },
    lastMessage: 'I need help with my order #12345',
    status: 'escalated',
    handler: 'agent',
    unread: 0,
    updatedAt: new Date(Date.now() - 15 * 60000),
    messages: [
      { id: '1', sender: 'customer', content: 'I need help with my order #12345', timestamp: new Date(Date.now() - 20 * 60000) },
      { id: '2', sender: 'ai', content: "I'd be happy to help with your order. Let me look that up for you.", timestamp: new Date(Date.now() - 19 * 60000), confidence: 0.72 },
      { id: '3', sender: 'ai', content: "I'm having trouble finding specific details. Let me connect you with a human agent who can better assist you.", timestamp: new Date(Date.now() - 18 * 60000), confidence: 0.45 },
      { id: '4', sender: 'agent', content: "Hi Sarah, I'm taking over from our AI. Let me check on order #12345 for you.", timestamp: new Date(Date.now() - 15 * 60000) },
    ]
  },
  {
    id: '3',
    customer: { name: 'Mike Wilson', email: 'mike@example.com', avatar: null },
    lastMessage: 'Thanks for your help!',
    status: 'resolved',
    handler: 'ai',
    unread: 0,
    updatedAt: new Date(Date.now() - 60 * 60000),
    messages: [
      { id: '1', sender: 'customer', content: 'What are your business hours?', timestamp: new Date(Date.now() - 65 * 60000) },
      { id: '2', sender: 'ai', content: "Our business hours are Monday to Friday, 9 AM to 6 PM EST. We're also available on Saturdays from 10 AM to 4 PM.", timestamp: new Date(Date.now() - 64 * 60000), confidence: 0.98 },
      { id: '3', sender: 'customer', content: 'Thanks for your help!', timestamp: new Date(Date.now() - 60 * 60000) },
    ]
  },
]

export default function ConversationsPage() {
  const [selectedConversation, setSelectedConversation] = useState<typeof mockConversations[0] | null>(null)
  const [messageInput, setMessageInput] = useState('')
  const [filter, setFilter] = useState<'all' | 'active' | 'resolved' | 'escalated'>('all')
  const [searchQuery, setSearchQuery] = useState('')

  const filteredConversations = mockConversations.filter(conv => {
    if (filter !== 'all' && conv.status !== filter) return false
    if (searchQuery && !conv.customer.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !conv.lastMessage.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  const handleSendMessage = () => {
    if (!messageInput.trim() || !selectedConversation) return
    // In real app, this would send to API
    setMessageInput('')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'info'
      case 'resolved': return 'success'
      case 'escalated': return 'warning'
      default: return 'default'
    }
  }

  const formatTime = (date: Date) => {
    const now = new Date()
    const diff = now.getTime() - date.getTime()
    const minutes = Math.floor(diff / 60000)
    const hours = Math.floor(diff / 3600000)

    if (minutes < 60) return `${minutes}m ago`
    if (hours < 24) return `${hours}h ago`
    return format(date, 'MMM d')
  }

  return (
    <div className="h-[calc(100vh-8rem)]">
      <div className="flex h-full bg-white rounded-xl border border-gray-200 overflow-hidden">
        {/* Conversations List */}
        <div className={`w-full md:w-96 border-r border-gray-200 flex flex-col ${selectedConversation ? 'hidden md:flex' : 'flex'}`}>
          {/* Header */}
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Conversations</h2>

            {/* Search */}
            <div className="relative mb-4">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              {(['all', 'active', 'escalated', 'resolved'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setFilter(f)}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-colors ${
                    filter === f
                      ? 'bg-primary-100 text-primary-700'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  {f.charAt(0).toUpperCase() + f.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Conversation List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.map((conv) => (
              <div
                key={conv.id}
                onClick={() => setSelectedConversation(conv)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors ${
                  selectedConversation?.id === conv.id ? 'bg-primary-50' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <Avatar name={conv.customer.name} size="md" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-medium text-gray-900 truncate">
                        {conv.customer.name}
                      </p>
                      <span className="text-xs text-gray-400 whitespace-nowrap">
                        {formatTime(conv.updatedAt)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate mt-0.5">
                      {conv.lastMessage}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge variant={getStatusColor(conv.status)} size="sm">
                        {conv.status}
                      </Badge>
                      {conv.handler === 'ai' ? (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <Bot className="w-3 h-3" /> AI
                        </span>
                      ) : (
                        <span className="text-xs text-gray-400 flex items-center gap-1">
                          <User className="w-3 h-3" /> Agent
                        </span>
                      )}
                      {conv.unread > 0 && (
                        <span className="ml-auto bg-primary-600 text-white text-xs px-2 py-0.5 rounded-full">
                          {conv.unread}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        {selectedConversation ? (
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b border-gray-200 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedConversation(null)}
                  className="md:hidden p-2 hover:bg-gray-100 rounded-lg"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
                <Avatar name={selectedConversation.customer.name} size="md" status="online" />
                <div>
                  <p className="font-medium text-gray-900">
                    {selectedConversation.customer.name}
                  </p>
                  <p className="text-sm text-gray-500">
                    {selectedConversation.customer.email}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Phone className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Video className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <Info className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm">
                  <MoreVertical className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {selectedConversation.messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex ${msg.sender === 'customer' ? 'justify-start' : 'justify-end'}`}
                >
                  <div className={`max-w-[70%] ${
                    msg.sender === 'customer'
                      ? 'bg-gray-100 rounded-2xl rounded-bl-md'
                      : msg.sender === 'ai'
                      ? 'bg-primary-600 text-white rounded-2xl rounded-br-md'
                      : 'bg-green-600 text-white rounded-2xl rounded-br-md'
                  } px-4 py-3`}>
                    {msg.sender !== 'customer' && (
                      <div className="flex items-center gap-1 mb-1 text-xs opacity-80">
                        {msg.sender === 'ai' ? (
                          <><Bot className="w-3 h-3" /> AI Assistant</>
                        ) : (
                          <><User className="w-3 h-3" /> Agent</>
                        )}
                      </div>
                    )}
                    <p className="text-sm">{msg.content}</p>
                    <div className={`flex items-center gap-2 mt-1 text-xs ${
                      msg.sender === 'customer' ? 'text-gray-400' : 'opacity-70'
                    }`}>
                      <span>{format(msg.timestamp, 'h:mm a')}</span>
                      {msg.confidence && (
                        <span className="flex items-center gap-1">
                          • {Math.round(msg.confidence * 100)}% confidence
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Input Area */}
            <div className="p-4 border-t border-gray-200">
              <div className="flex items-end gap-3">
                <div className="flex-1 bg-gray-100 rounded-2xl px-4 py-3">
                  <textarea
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    placeholder="Type a message..."
                    className="w-full bg-transparent resize-none focus:outline-none text-sm"
                    rows={1}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' && !e.shiftKey) {
                        e.preventDefault()
                        handleSendMessage()
                      }
                    }}
                  />
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center gap-2">
                      <button className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors">
                        <Paperclip className="w-4 h-4 text-gray-500" />
                      </button>
                      <button className="p-1.5 hover:bg-gray-200 rounded-lg transition-colors">
                        <Smile className="w-4 h-4 text-gray-500" />
                      </button>
                    </div>
                    <Button
                      size="sm"
                      onClick={handleSendMessage}
                      disabled={!messageInput.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="flex items-center gap-2 mt-3">
                <Button variant="outline" size="sm">
                  <Bot className="w-4 h-4 mr-1" />
                  Let AI respond
                </Button>
                <Button variant="outline" size="sm">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Mark resolved
                </Button>
                <Button variant="outline" size="sm">
                  <AlertCircle className="w-4 h-4 mr-1" />
                  Escalate
                </Button>
              </div>
            </div>
          </div>
        ) : (
          <div className="hidden md:flex flex-1 items-center justify-center bg-gray-50">
            <div className="text-center">
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">Select a conversation to view</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

const MessageSquare = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
  </svg>
)
