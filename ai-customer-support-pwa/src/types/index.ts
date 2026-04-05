// Core Types for AI Customer Support PWA

// ============================================
// Business Types
// ============================================

export interface Business {
  id: string
  name: string
  website?: string
  industry?: string
  apiKey: string
  plan: 'starter' | 'growth' | 'pro' | 'enterprise'
  stripeCustomerId?: string
  stripeSubscriptionId?: string
  widgetSettings: WidgetSettings
  aiSettings: AISettings
  logoUrl?: string
  timezone: string
  language: string
  knowledgeBaseUpdatedAt?: string
  createdAt: string
  updatedAt: string
}

export interface WidgetSettings {
  primaryColor: string
  position: 'bottom-right' | 'bottom-left'
  welcomeMessage: string
  offlineMessage: string
  showBranding: boolean
}

export interface AISettings {
  model: string
  temperature: number
  maxTokens: number
  escalationThreshold: number
  brandVoice: string
}

// ============================================
// User Types
// ============================================

export interface User {
  id: string
  email: string
  fullName?: string
  avatarUrl?: string
  role: 'owner' | 'admin' | 'agent' | 'viewer'
  businessId: string
  status: 'online' | 'away' | 'busy' | 'offline'
  lastSeenAt?: string
  preferences: UserPreferences
  authId?: string
  createdAt: string
  updatedAt: string
}

export interface UserPreferences {
  notifications: boolean
  sound: boolean
  emailDigest: 'daily' | 'weekly' | 'never'
}

// ============================================
// Conversation Types
// ============================================

export interface Conversation {
  id: string
  businessId: string
  customerEmail?: string
  customerName?: string
  customerMetadata: Record<string, any>
  status: 'active' | 'waiting' | 'resolved' | 'escalated' | 'archived'
  priority: 'low' | 'normal' | 'high' | 'urgent'
  assignedAgentId?: string
  assignedAgent?: User
  isAiHandled: boolean
  tags: string[]
  category?: string
  intent?: string
  satisfactionScore?: number
  firstResponseTimeSeconds?: number
  resolutionTimeSeconds?: number
  messageCount: number
  source: 'widget' | 'email' | 'sms' | 'whatsapp' | 'messenger' | 'api'
  sourceUrl?: string
  startedAt: string
  lastMessageAt: string
  resolvedAt?: string
  createdAt: string
  messages?: Message[]
}

// ============================================
// Message Types
// ============================================

export interface Message {
  id: string
  conversationId: string
  senderType: 'customer' | 'ai' | 'agent' | 'system'
  senderId?: string
  senderName?: string
  content: string
  contentType: 'text' | 'image' | 'file' | 'audio' | 'video' | 'rich'
  aiConfidence?: number
  aiSources?: string[]
  aiIntent?: string
  aiSentiment?: 'positive' | 'neutral' | 'negative'
  aiSentimentScore?: number
  attachments: Attachment[]
  status: 'sending' | 'sent' | 'delivered' | 'read' | 'failed'
  readAt?: string
  metadata: Record<string, any>
  createdAt: string
}

export interface Attachment {
  id: string
  name: string
  type: string
  size: number
  url: string
}

// ============================================
// Knowledge Base Types
// ============================================

export interface KnowledgeBaseItem {
  id: string
  businessId: string
  sourceType: 'file' | 'url' | 'text' | 'faq' | 'api'
  sourceName?: string
  sourceUrl?: string
  title?: string
  content: string
  contentHash?: string
  metadata: Record<string, any>
  wordCount?: number
  language: string
  status: 'processing' | 'active' | 'error' | 'archived'
  errorMessage?: string
  lastSyncedAt?: string
  createdAt: string
  updatedAt: string
}

export interface FAQ {
  id: string
  businessId: string
  question: string
  answer: string
  category?: string
  usageCount: number
  helpfulCount: number
  isActive: boolean
  createdAt: string
  updatedAt: string
}

// ============================================
// Analytics Types
// ============================================

export interface AnalyticsEvent {
  id: string
  businessId: string
  eventType: string
  eventCategory?: string
  conversationId?: string
  userId?: string
  properties: Record<string, any>
  sessionId?: string
  ipAddress?: string
  userAgent?: string
  referrer?: string
  pageUrl?: string
  createdAt: string
}

export interface AnalyticsSummary {
  period: string
  totalConversations: number
  resolvedConversations: number
  resolutionRate: number
  aiHandledRate: number
  totalMessages: number
  avgSatisfaction: number
  avgResolutionTimeMinutes: number
  conversationsByDay: Array<{ date: string; count: number }>
}

// ============================================
// API Types
// ============================================

export interface ChatRequest {
  apiKey: string
  conversationId?: string
  message: string
  customerEmail?: string
  customerName?: string
  metadata?: Record<string, any>
}

export interface ChatResponse {
  success: boolean
  conversationId: string
  message: {
    id: string
    content: string
    confidence: number
    timestamp: string
  }
  shouldEscalate: boolean
}

export interface APIError {
  error: string
  details?: string
  code?: string
}

// ============================================
// Component Props Types
// ============================================

export interface WidgetConfig {
  apiKey: string
  primaryColor?: string
  position?: 'bottom-right' | 'bottom-left'
  welcomeMessage?: string
  businessName?: string
  agentName?: string
  agentAvatar?: string
}

export interface DashboardStats {
  totalConversations: number
  activeConversations: number
  resolvedToday: number
  avgResponseTime: string
  satisfactionScore: number
  aiResolutionRate: number
}

// ============================================
// Form Types
// ============================================

export interface LoginFormData {
  email: string
  password: string
}

export interface SignupFormData {
  email: string
  password: string
  confirmPassword: string
  fullName: string
  businessName: string
  website?: string
  industry?: string
}

export interface SetupWizardData {
  step: number
  businessName: string
  website: string
  industry: string
  knowledgeFiles: File[]
  widgetSettings: Partial<WidgetSettings>
  completed: boolean
}
