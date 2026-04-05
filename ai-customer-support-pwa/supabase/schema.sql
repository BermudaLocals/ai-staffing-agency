-- AI Customer Support PWA Database Schema
-- Run this in Supabase SQL Editor

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enable vector extension for semantic search
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================
-- BUSINESSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS businesses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  website TEXT,
  industry TEXT,
  api_key TEXT UNIQUE NOT NULL DEFAULT ('ak_' || replace(uuid_generate_v4()::text, '-', '')),
  plan TEXT DEFAULT 'starter' CHECK (plan IN ('starter', 'growth', 'pro', 'enterprise')),
  stripe_customer_id TEXT,
  stripe_subscription_id TEXT,

  -- Widget Settings
  widget_settings JSONB DEFAULT '{
    "primaryColor": "#4F46E5",
    "position": "bottom-right",
    "welcomeMessage": "Hi! 👋 How can I help you today?",
    "offlineMessage": "We are currently offline. Leave a message and we will get back to you.",
    "showBranding": true
  }'::jsonb,

  -- AI Settings
  ai_settings JSONB DEFAULT '{
    "model": "claude-sonnet-4-20250514",
    "temperature": 0.7,
    "maxTokens": 1024,
    "escalationThreshold": 0.6,
    "brandVoice": "professional and friendly"
  }'::jsonb,

  -- Metadata
  logo_url TEXT,
  timezone TEXT DEFAULT 'UTC',
  language TEXT DEFAULT 'en',
  knowledge_base_updated_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- USERS TABLE (Team Members)
-- ============================================
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email TEXT UNIQUE NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'agent' CHECK (role IN ('owner', 'admin', 'agent', 'viewer')),
  business_id UUID REFERENCES businesses(id) ON DELETE CASCADE,

  -- Status
  status TEXT DEFAULT 'offline' CHECK (status IN ('online', 'away', 'busy', 'offline')),
  last_seen_at TIMESTAMP WITH TIME ZONE,

  -- Preferences
  preferences JSONB DEFAULT '{
    "notifications": true,
    "sound": true,
    "emailDigest": "daily"
  }'::jsonb,

  -- Auth (linked to Supabase Auth)
  auth_id UUID UNIQUE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CONVERSATIONS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS conversations (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,

  -- Customer Info
  customer_email TEXT,
  customer_name TEXT,
  customer_metadata JSONB DEFAULT '{}'::jsonb,

  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'waiting', 'resolved', 'escalated', 'archived')),
  priority TEXT DEFAULT 'normal' CHECK (priority IN ('low', 'normal', 'high', 'urgent')),

  -- Assignment
  assigned_agent_id UUID REFERENCES users(id) ON DELETE SET NULL,
  is_ai_handled BOOLEAN DEFAULT true,

  -- Categorization
  tags TEXT[] DEFAULT '{}',
  category TEXT,
  intent TEXT,

  -- Metrics
  satisfaction_score INTEGER CHECK (satisfaction_score >= 1 AND satisfaction_score <= 5),
  first_response_time_seconds INTEGER,
  resolution_time_seconds INTEGER,
  message_count INTEGER DEFAULT 0,

  -- Source
  source TEXT DEFAULT 'widget' CHECK (source IN ('widget', 'email', 'sms', 'whatsapp', 'messenger', 'api')),
  source_url TEXT,

  -- Timestamps
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_message_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  resolved_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- MESSAGES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS messages (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,

  -- Sender
  sender_type TEXT NOT NULL CHECK (sender_type IN ('customer', 'ai', 'agent', 'system')),
  sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
  sender_name TEXT,

  -- Content
  content TEXT NOT NULL,
  content_type TEXT DEFAULT 'text' CHECK (content_type IN ('text', 'image', 'file', 'audio', 'video', 'rich')),

  -- AI Metadata
  ai_confidence FLOAT CHECK (ai_confidence >= 0 AND ai_confidence <= 1),
  ai_sources TEXT[],
  ai_intent TEXT,
  ai_sentiment TEXT CHECK (ai_sentiment IN ('positive', 'neutral', 'negative')),
  ai_sentiment_score FLOAT,

  -- Attachments
  attachments JSONB DEFAULT '[]'::jsonb,

  -- Status
  status TEXT DEFAULT 'sent' CHECK (status IN ('sending', 'sent', 'delivered', 'read', 'failed')),
  read_at TIMESTAMP WITH TIME ZONE,

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- KNOWLEDGE BASE TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS knowledge_base (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,

  -- Source
  source_type TEXT NOT NULL CHECK (source_type IN ('file', 'url', 'text', 'faq', 'api')),
  source_name TEXT,
  source_url TEXT,

  -- Content
  title TEXT,
  content TEXT NOT NULL,
  content_hash TEXT, -- For deduplication

  -- Vector Embedding for Semantic Search
  embedding vector(1536),

  -- Metadata
  metadata JSONB DEFAULT '{}'::jsonb,
  word_count INTEGER,
  language TEXT DEFAULT 'en',

  -- Status
  status TEXT DEFAULT 'active' CHECK (status IN ('processing', 'active', 'error', 'archived')),
  error_message TEXT,

  -- Timestamps
  last_synced_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- FAQ TABLE (Quick Q&A pairs)
-- ============================================
CREATE TABLE IF NOT EXISTS faqs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,

  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT,

  -- Vector Embedding
  embedding vector(1536),

  -- Metrics
  usage_count INTEGER DEFAULT 0,
  helpful_count INTEGER DEFAULT 0,

  -- Status
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- CANNED RESPONSES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS canned_responses (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,

  title TEXT NOT NULL,
  content TEXT NOT NULL,
  shortcut TEXT, -- e.g., "/thanks" triggers this response
  category TEXT,

  -- Personalization
  variables TEXT[] DEFAULT '{}', -- e.g., ['customer_name', 'order_id']

  usage_count INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT true,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- ANALYTICS EVENTS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS analytics_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,

  -- Event Info
  event_type TEXT NOT NULL,
  event_category TEXT,

  -- Related Entities
  conversation_id UUID REFERENCES conversations(id) ON DELETE SET NULL,
  user_id UUID REFERENCES users(id) ON DELETE SET NULL,

  -- Event Data
  properties JSONB DEFAULT '{}'::jsonb,

  -- Context
  session_id TEXT,
  ip_address INET,
  user_agent TEXT,
  referrer TEXT,
  page_url TEXT,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INVITES TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS invites (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,

  email TEXT NOT NULL,
  role TEXT DEFAULT 'agent' CHECK (role IN ('admin', 'agent', 'viewer')),

  invited_by UUID REFERENCES users(id) ON DELETE SET NULL,
  token TEXT UNIQUE NOT NULL DEFAULT replace(uuid_generate_v4()::text, '-', ''),

  status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'accepted', 'expired', 'revoked')),

  expires_at TIMESTAMP WITH TIME ZONE DEFAULT (NOW() + INTERVAL '7 days'),
  accepted_at TIMESTAMP WITH TIME ZONE,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- WEBHOOKS TABLE
-- ============================================
CREATE TABLE IF NOT EXISTS webhooks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  business_id UUID NOT NULL REFERENCES businesses(id) ON DELETE CASCADE,

  url TEXT NOT NULL,
  events TEXT[] NOT NULL, -- e.g., ['conversation.created', 'message.received']
  secret TEXT NOT NULL DEFAULT replace(uuid_generate_v4()::text, '-', ''),

  is_active BOOLEAN DEFAULT true,
  last_triggered_at TIMESTAMP WITH TIME ZONE,
  failure_count INTEGER DEFAULT 0,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ============================================
-- INDEXES
-- ============================================

-- Businesses
CREATE INDEX idx_businesses_api_key ON businesses(api_key);
CREATE INDEX idx_businesses_stripe_customer ON businesses(stripe_customer_id);

-- Users
CREATE INDEX idx_users_business ON users(business_id);
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_auth ON users(auth_id);

-- Conversations
CREATE INDEX idx_conversations_business ON conversations(business_id);
CREATE INDEX idx_conversations_status ON conversations(business_id, status);
CREATE INDEX idx_conversations_agent ON conversations(assigned_agent_id);
CREATE INDEX idx_conversations_customer_email ON conversations(customer_email);
CREATE INDEX idx_conversations_started ON conversations(started_at DESC);

-- Messages
CREATE INDEX idx_messages_conversation ON messages(conversation_id);
CREATE INDEX idx_messages_created ON messages(conversation_id, created_at);

-- Knowledge Base
CREATE INDEX idx_knowledge_business ON knowledge_base(business_id);
CREATE INDEX idx_knowledge_status ON knowledge_base(business_id, status);

-- FAQs
CREATE INDEX idx_faqs_business ON faqs(business_id);

-- Analytics
CREATE INDEX idx_analytics_business ON analytics_events(business_id);
CREATE INDEX idx_analytics_type ON analytics_events(business_id, event_type);
CREATE INDEX idx_analytics_created ON analytics_events(created_at DESC);
CREATE INDEX idx_analytics_conversation ON analytics_events(conversation_id);

-- ============================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================

-- Enable RLS on all tables
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE knowledge_base ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE canned_responses ENABLE ROW LEVEL SECURITY;
ALTER TABLE analytics_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE webhooks ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users
CREATE POLICY "Users can view their own business" ON businesses
  FOR SELECT USING (
    id IN (SELECT business_id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY "Users can view team members" ON users
  FOR SELECT USING (
    business_id IN (SELECT business_id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY "Users can view business conversations" ON conversations
  FOR SELECT USING (
    business_id IN (SELECT business_id FROM users WHERE auth_id = auth.uid())
  );

CREATE POLICY "Users can view conversation messages" ON messages
  FOR SELECT USING (
    conversation_id IN (
      SELECT id FROM conversations WHERE business_id IN (
        SELECT business_id FROM users WHERE auth_id = auth.uid()
      )
    )
  );

-- ============================================
-- FUNCTIONS & TRIGGERS
-- ============================================

-- Update timestamp function
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply to tables
CREATE TRIGGER update_businesses_updated_at
  BEFORE UPDATE ON businesses
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER update_knowledge_base_updated_at
  BEFORE UPDATE ON knowledge_base
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Update conversation message count
CREATE OR REPLACE FUNCTION update_conversation_message_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE conversations
  SET 
    message_count = message_count + 1,
    last_message_at = NOW()
  WHERE id = NEW.conversation_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_message_count
  AFTER INSERT ON messages
  FOR EACH ROW EXECUTE FUNCTION update_conversation_message_count();

-- ============================================
-- SEED DATA (Optional)
-- ============================================

-- Insert demo business (uncomment to use)
-- INSERT INTO businesses (name, website, industry) VALUES
-- ('Demo Company', 'https://demo.example.com', 'Technology');
