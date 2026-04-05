import { createClient } from '@supabase/supabase-js'
import Anthropic from '@anthropic-ai/sdk'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY!,
})

export const config = {
  runtime: 'edge',
}

interface ChatRequest {
  apiKey: string
  conversationId?: string
  message: string
  customerEmail?: string
  customerName?: string
  metadata?: Record<string, any>
}

export default async function handler(req: Request) {
  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ error: 'Method not allowed' }), {
      status: 405,
      headers: { 'Content-Type': 'application/json' },
    })
  }

  try {
    const body: ChatRequest = await req.json()
    const { apiKey, conversationId, message, customerEmail, customerName, metadata } = body

    if (!apiKey || !message) {
      return new Response(
        JSON.stringify({ error: 'Missing required fields: apiKey, message' }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Verify API key and get business
    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .select('*')
      .eq('api_key', apiKey)
      .single()

    if (businessError || !business) {
      return new Response(
        JSON.stringify({ error: 'Invalid API key' }),
        { status: 401, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // Get or create conversation
    let conversation
    if (conversationId) {
      const { data } = await supabase
        .from('conversations')
        .select('*')
        .eq('id', conversationId)
        .eq('business_id', business.id)
        .single()
      conversation = data
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
        .single()

      if (error) throw error
      conversation = data
    }

    // Save customer message
    await supabase.from('messages').insert({
      conversation_id: conversation.id,
      sender_type: 'customer',
      sender_name: customerName || 'Customer',
      content: message,
    })

    // Get conversation history
    const { data: messages } = await supabase
      .from('messages')
      .select('*')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true })
      .limit(20)

    // Get knowledge base content
    const { data: knowledge } = await supabase
      .from('knowledge_base')
      .select('content')
      .eq('business_id', business.id)
      .eq('status', 'active')
      .limit(10)

    const knowledgeContent = knowledge?.map(k => k.content).join('

') || ''

    // Build conversation history for Claude
    const conversationHistory = messages?.map(m => ({
      role: m.sender_type === 'customer' ? 'user' as const : 'assistant' as const,
      content: m.content,
    })) || []

    // Generate AI response
    const systemPrompt = `You are an AI customer support assistant for ${business.name}.

Knowledge Base:
${knowledgeContent || 'No specific knowledge base provided.'}

Guidelines:
1. Be helpful, friendly, and professional
2. Answer based ONLY on the knowledge base
3. If unsure, offer to connect with a human
4. Keep responses concise (2-3 sentences)
5. Be empathetic and understanding

At the end, include: [CONFIDENCE: X%] where X is 0-100.`

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages: conversationHistory,
    })

    const aiContent = response.content[0].type === 'text' ? response.content[0].text : ''

    // Parse confidence
    const confidenceMatch = aiContent.match(/\[CONFIDENCE:\s*(\d+)%\]/i)
    const confidence = confidenceMatch ? parseInt(confidenceMatch[1]) / 100 : 0.7
    const cleanContent = aiContent.replace(/\[CONFIDENCE:\s*\d+%\]/i, '').trim()

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
      .single()

    // Check if should escalate
    const shouldEscalate = confidence < 0.6
    if (shouldEscalate) {
      await supabase
        .from('conversations')
        .update({ status: 'escalated', is_ai_handled: false })
        .eq('id', conversation.id)
    }

    // Track analytics
    await supabase.from('analytics_events').insert({
      business_id: business.id,
      event_type: 'message_received',
      conversation_id: conversation.id,
      properties: {
        ai_confidence: confidence,
        escalated: shouldEscalate,
      },
    })

    return new Response(
      JSON.stringify({
        success: true,
        conversationId: conversation.id,
        message: {
          id: aiMessage?.id,
          content: cleanContent,
          confidence,
          timestamp: new Date().toISOString(),
        },
        shouldEscalate,
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*',
        },
      }
    )
  } catch (error: any) {
    console.error('Chat API Error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error', details: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
