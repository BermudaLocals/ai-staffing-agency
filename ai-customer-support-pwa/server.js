import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { createClient } from '@supabase/supabase-js';
import Anthropic from '@anthropic-ai/sdk';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// CORS headers for API routes
app.use('/api', (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Content-Type, x-api-key, Authorization');
  if (req.method === 'OPTIONS') return res.sendStatus(200);
  next();
});

// Security headers
app.use((req, res, next) => {
  res.header('X-Content-Type-Options', 'nosniff');
  res.header('X-Frame-Options', 'DENY');
  res.header('X-XSS-Protection', '1; mode=block');
  next();
});

// Initialize Supabase
function getSupabase() {
  return createClient(
    process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL || '',
    process.env.SUPABASE_SERVICE_KEY || process.env.VITE_SUPABASE_ANON_KEY || ''
  );
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', service: 'AI Customer Support PWA' });
});

// ============================================
// API: Chat Endpoint
// ============================================
app.post('/api/chat', async (req, res) => {
  try {
    const supabase = getSupabase();
    const { apiKey, conversationId, message, customerEmail, customerName, metadata } = req.body;

    if (!apiKey || !message) {
      return res.status(400).json({ error: 'Missing required fields: apiKey, message' });
    }

    // Verify API key and get business
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('*')
      .eq('api_key', apiKey)
      .single();

    if (businessError || !business) {
      return res.status(401).json({ error: 'Invalid API key' });
    }

    // Get or create conversation
    let conversation;
    if (conversationId) {
      const { data } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .eq('business_id', business.id)
        .single();
      conversation = data;
    }

    if (!conversation) {
      const { data, error } = await supabase
        .from('conversations')
        .insert({
          business_id: business.id,
          customer_email: customerEmail,
          customer_name: customerName,
          customer_metadata: metadata || {},
          status: 'active',
          is_ai_handled: true,
        })
        .select()
        .single();
      if (error) throw error;
      conversation = data;
    }

    // Save customer message
    await supabase.from('messages').insert({
      conversation_id: conversation.id,
      sender_type: 'customer',
      sender_name: customerName || 'Customer',
      content: message,
    });

    // Get conversation history
    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true })
      .limit(20);

    // Get knowledge base content
    const { data: knowledge } = await supabase
      .from('knowledge_base')
      .select('content')
      .eq('business_id', business.id)
      .eq('status', 'active')
      .limit(10);

    const knowledgeContent = knowledge?.map(k => k.content).join('\n\n') || '';

    // Build conversation history for Claude
    const conversationHistory = messages?.map(m => ({
      role: m.sender_type === 'customer' ? 'user' : 'assistant',
      content: m.content,
    })) || [];

    // Generate AI response
    const anthropic = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });
    const systemPrompt = `You are an AI customer support assistant for ${business.name}.

Knowledge Base:
${knowledgeContent || 'No specific knowledge base provided.'}

Guidelines:
1. Be helpful, friendly, and professional
2. Answer based ONLY on the knowledge base
3. If unsure, offer to connect with a human
4. Keep responses concise (2-3 sentences)
5. Be empathetic and understanding

At the end, include: [CONFIDENCE: X%] where X is 0-100.`;

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: conversationHistory,
    });

    const aiContent = response.content[0].type === 'text' ? response.content[0].text : '';
    const confidenceMatch = aiContent.match(/\[CONFIDENCE:\s*(\d+)%\]/i);
    const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) / 100 : 0.7;
    const cleanContent = aiContent.replace(/\[CONFIDENCE:\s*\d+%\]/i, '').trim();

    // Save AI response
    const { data: aiMessage } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversation.id,
        sender_type: 'ai',
        sender_name: 'AI Assistant',
        content: cleanContent,
        ai_confidence: confidence,
      })
      .select()
      .single();

    // Check if should escalate
    const shouldEscalate = confidence < 0.6;
    if (shouldEscalate) {
      await supabase
        .from('conversations')
        .update({ status: 'escalated', is_ai_handled: false })
        .eq('id', conversation.id);
    }

    // Track analytics
    await supabase.from('analytics_events').insert({
      business_id: business.id,
      event_type: 'message_received',
      conversation_id: conversation.id,
      properties: { ai_confidence: confidence, escalated: shouldEscalate },
    });

    res.json({
      success: true,
      conversationId: conversation.id,
      message: {
        id: aiMessage?.id,
        content: cleanContent,
        confidence,
        timestamp: new Date().toISOString(),
      },
      shouldEscalate,
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    res.status(500).json({ error: 'Internal server error', details: error.message });
  }
});

// ============================================
// API: Knowledge Base Endpoint
// ============================================
app.get('/api/knowledge', async (req, res) => {
  try {
    const supabase = getSupabase();
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;
    if (!apiKey) return res.status(401).json({ error: 'API key required' });

    const { data: business, error: bErr } = await supabase
      .from('businesses').select('id').eq('api_key', apiKey).single();
    if (bErr || !business) return res.status(401).json({ error: 'Invalid API key' });

    const { data, error } = await supabase
      .from('knowledge_base')
      .select('id, source_type, source_name, title, status, created_at')
      .eq('business_id', business.id)
      .order('created_at', { ascending: false });
    if (error) throw error;
    res.json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/knowledge', async (req, res) => {
  try {
    const supabase = getSupabase();
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;
    if (!apiKey) return res.status(401).json({ error: 'API key required' });

    const { data: business, error: bErr } = await supabase
      .from('businesses').select('id').eq('api_key', apiKey).single();
    if (bErr || !business) return res.status(401).json({ error: 'Invalid API key' });

    const { sourceType, sourceName, title, content } = req.body;
    if (!content) return res.status(400).json({ error: 'Content is required' });

    const { data, error } = await supabase
      .from('knowledge_base')
      .insert({
        business_id: business.id,
        source_type: sourceType || 'text',
        source_name: sourceName,
        title,
        content,
        word_count: content.split(/\s+/).length,
        status: 'active',
      })
      .select()
      .single();
    if (error) throw error;

    await supabase
      .from('businesses')
      .update({ knowledge_base_updated_at: new Date().toISOString() })
      .eq('id', business.id);

    res.status(201).json({ data });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.delete('/api/knowledge', async (req, res) => {
  try {
    const supabase = getSupabase();
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;
    if (!apiKey) return res.status(401).json({ error: 'API key required' });

    const { data: business, error: bErr } = await supabase
      .from('businesses').select('id').eq('api_key', apiKey).single();
    if (bErr || !business) return res.status(401).json({ error: 'Invalid API key' });

    const id = req.query.id;
    if (!id) return res.status(400).json({ error: 'ID is required' });

    const { error } = await supabase
      .from('knowledge_base')
      .delete()
      .eq('id', id)
      .eq('business_id', business.id);
    if (error) throw error;
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// API: Analytics Endpoint
// ============================================
app.get('/api/analytics', async (req, res) => {
  try {
    const supabase = getSupabase();
    const apiKey = req.headers['x-api-key'] || req.query.apiKey;
    if (!apiKey) return res.status(401).json({ error: 'API key required' });

    const { data: business } = await supabase
      .from('businesses').select('id').eq('api_key', apiKey).single();
    if (!business) return res.status(401).json({ error: 'Invalid API key' });

    const period = req.query.period || '7d';
    const now = new Date();
    let startDate = new Date();
    switch (period) {
      case '24h': startDate.setHours(startDate.getHours() - 24); break;
      case '7d': startDate.setDate(startDate.getDate() - 7); break;
      case '30d': startDate.setDate(startDate.getDate() - 30); break;
      case '90d': startDate.setDate(startDate.getDate() - 90); break;
    }

    const { data: conversations } = await supabase
      .from('conversations')
      .select('id, status, satisfaction_score, resolution_time_seconds, is_ai_handled, started_at')
      .eq('business_id', business.id)
      .gte('started_at', startDate.toISOString());

    const { count: messageCount } = await supabase
      .from('messages')
      .select('id', { count: 'exact' })
      .in('conversation_id', conversations?.map(c => c.id) || []);

    const totalConversations = conversations?.length || 0;
    const resolvedConversations = conversations?.filter(c => c.status === 'resolved').length || 0;
    const aiHandledConversations = conversations?.filter(c => c.is_ai_handled).length || 0;
    const avgSatisfaction = conversations?.filter(c => c.satisfaction_score)
      .reduce((sum, c) => sum + (c.satisfaction_score || 0), 0) /
      (conversations?.filter(c => c.satisfaction_score).length || 1);
    const avgResolutionTime = conversations?.filter(c => c.resolution_time_seconds)
      .reduce((sum, c) => sum + (c.resolution_time_seconds || 0), 0) /
      (conversations?.filter(c => c.resolution_time_seconds).length || 1);

    function groupByDay(items, dateField) {
      const groups = {};
      items.forEach(item => {
        const date = new Date(item[dateField]).toISOString().split('T')[0];
        groups[date] = (groups[date] || 0) + 1;
      });
      return Object.entries(groups).map(([date, count]) => ({ date, count }));
    }

    res.json({
      period,
      totalConversations,
      resolvedConversations,
      resolutionRate: totalConversations > 0 ? (resolvedConversations / totalConversations * 100).toFixed(1) : 0,
      aiHandledRate: totalConversations > 0 ? (aiHandledConversations / totalConversations * 100).toFixed(1) : 0,
      totalMessages: messageCount || 0,
      avgSatisfaction: avgSatisfaction.toFixed(1),
      avgResolutionTimeMinutes: (avgResolutionTime / 60).toFixed(1),
      conversationsByDay: groupByDay(conversations || [], 'started_at'),
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// ============================================
// Static Files - Serve Vite Build
// ============================================
app.use(express.static(path.join(__dirname, 'dist')));

// Widget route with CORS
app.get('/widget.js', (req, res) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Cache-Control', 'public, max-age=3600');
  res.sendFile(path.join(__dirname, 'dist', 'widget.js'));
});

// SPA fallback - all other routes serve index.html
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// ============================================
// Start Server
// ============================================
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 AI Customer Support PWA running on port ${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/health`);
  console.log(`   API:    http://localhost:${PORT}/api/chat`);
});

// ============================================
// API: SMS Endpoint (Coming Soon)
// ============================================
app.post('/api/sms', (req, res) => {
  res.status(403).json({
    error: 'Coming Soon',
    message: 'SMS support is coming soon. Upgrade to PRO tier for early access.',
    tier_required: 'PRO',
    price: '$499/month'
  });
});

// ============================================
// API: Voice Endpoint (Coming Soon)
// ============================================
app.post('/api/voice', (req, res) => {
  res.status(403).json({
    error: 'Coming Soon',
    message: 'Voice support is coming soon. Upgrade to PRO tier for early access.',
    tier_required: 'PRO',
    price: '$499/month'
  });
});
