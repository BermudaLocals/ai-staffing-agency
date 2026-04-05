import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic({
  apiKey: import.meta.env.VITE_ANTHROPIC_API_KEY || '',
})

export interface AIResponse {
  content: string
  confidence: number
  sources?: string[]
  shouldEscalate: boolean
}

export interface ConversationContext {
  businessName: string
  businessInfo?: string
  knowledgeBase: string
  brandVoice?: string
  previousMessages: Array<{
    role: 'user' | 'assistant'
    content: string
  }>
}

// System prompt template
const createSystemPrompt = (context: ConversationContext): string => {
  return `You are an AI customer support assistant for ${context.businessName}.

Your knowledge base:
${context.knowledgeBase || 'No specific knowledge base provided.'}

${context.businessInfo ? `Business Information:
${context.businessInfo}` : ''}

Guidelines:
1. Be helpful, friendly, and professional
2. Answer questions accurately based ONLY on the knowledge base provided
3. If you don't know something or the answer isn't in the knowledge base, say "I don't have that specific information, but let me connect you with a human who can help"
4. Keep responses concise (2-3 sentences max unless more detail is specifically needed)
5. Use the customer's name if they provide it
6. ${context.brandVoice || 'Maintain a professional yet friendly tone'}
7. If you're less than 60% confident in your answer, indicate that a human agent might be better suited to help
8. Never make up information or provide inaccurate details
9. Always be empathetic and understanding
10. Use formatting (bold, bullets) for clarity when listing multiple items

IMPORTANT: At the end of each response, include a confidence score in this exact format:
[CONFIDENCE: X%] where X is your confidence level (0-100) in the accuracy of your response.

If the query is:
- A greeting or simple question: respond naturally
- About something not in your knowledge base: politely offer to connect with a human
- A complaint or frustrated customer: be extra empathetic and offer escalation
- Technical or complex: provide what you can and offer human assistance`
}

// Parse confidence from response
const parseConfidence = (response: string): { content: string; confidence: number } => {
  const confidenceMatch = response.match(/\[CONFIDENCE:\s*(\d+)%\]/i)
  let confidence = 70 // default confidence
  let content = response

  if (confidenceMatch) {
    confidence = parseInt(confidenceMatch[1], 10)
    content = response.replace(/\[CONFIDENCE:\s*\d+%\]/i, '').trim()
  }

  return { content, confidence }
}

// Main AI chat function
export async function generateAIResponse(
  userMessage: string,
  context: ConversationContext
): Promise<AIResponse> {
  try {
    const systemPrompt = createSystemPrompt(context)

    const messages = [
      ...context.previousMessages.map((msg) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content,
      })),
      {
        role: 'user' as const,
        content: userMessage,
      },
    ]

    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1024,
      system: systemPrompt,
      messages,
    })

    const rawContent = response.content[0].type === 'text' 
      ? response.content[0].text 
      : ''

    const { content, confidence } = parseConfidence(rawContent)

    // Determine if we should escalate
    const shouldEscalate = 
      confidence < 60 ||
      content.toLowerCase().includes('connect you with a human') ||
      content.toLowerCase().includes('human agent') ||
      content.toLowerCase().includes('speak to someone')

    return {
      content,
      confidence,
      shouldEscalate,
    }
  } catch (error) {
    console.error('AI Response Error:', error)
    return {
      content: "I apologize, but I'm having trouble processing your request right now. Let me connect you with a human agent who can help.",
      confidence: 0,
      shouldEscalate: true,
    }
  }
}

// Summarize conversation
export async function summarizeConversation(
  messages: Array<{ role: string; content: string }>
): Promise<string> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 256,
      system: 'You are a helpful assistant that summarizes customer support conversations. Provide a brief, factual summary in 2-3 sentences.',
      messages: [
        {
          role: 'user',
          content: `Please summarize this customer support conversation:

${messages
            .map((m) => `${m.role}: ${m.content}`)
            .join('
')}`,
        },
      ],
    })

    return response.content[0].type === 'text' ? response.content[0].text : ''
  } catch (error) {
    console.error('Summarization Error:', error)
    return 'Unable to generate summary'
  }
}

// Analyze sentiment
export async function analyzeSentiment(
  message: string
): Promise<{ sentiment: 'positive' | 'neutral' | 'negative'; score: number }> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 64,
      system: 'Analyze the sentiment of the message. Respond with ONLY a JSON object: {"sentiment": "positive|neutral|negative", "score": 0.0-1.0}',
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
    return JSON.parse(text)
  } catch (error) {
    console.error('Sentiment Analysis Error:', error)
    return { sentiment: 'neutral', score: 0.5 }
  }
}

// Generate suggested responses
export async function generateSuggestedResponses(
  customerMessage: string,
  context: string
): Promise<string[]> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 512,
      system: `You are helping a customer support agent. Based on the customer message and context, suggest 3 brief, professional responses the agent could use. Return ONLY a JSON array of strings.`,
      messages: [
        {
          role: 'user',
          content: `Customer message: "${customerMessage}"

Context: ${context}

Provide 3 suggested responses as a JSON array.`,
        },
      ],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : '[]'
    return JSON.parse(text)
  } catch (error) {
    console.error('Suggested Responses Error:', error)
    return [
      "Thank you for reaching out. I'd be happy to help you with this.",
      "I understand your concern. Let me look into this for you.",
      "I appreciate your patience. Here's what I can do to help...",
    ]
  }
}

// Extract intent from message
export async function extractIntent(
  message: string
): Promise<{ intent: string; entities: Record<string, string> }> {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 256,
      system: `Extract the customer's intent and any relevant entities from their message. Common intents: greeting, question, complaint, request, feedback, cancellation, refund, technical_issue, billing, shipping, other. Return ONLY a JSON object: {"intent": "string", "entities": {}}`,
      messages: [
        {
          role: 'user',
          content: message,
        },
      ],
    })

    const text = response.content[0].type === 'text' ? response.content[0].text : '{}'
    return JSON.parse(text)
  } catch (error) {
    console.error('Intent Extraction Error:', error)
    return { intent: 'other', entities: {} }
  }
}

export default {
  generateAIResponse,
  summarizeConversation,
  analyzeSentiment,
  generateSuggestedResponses,
  extractIntent,
}
