import Anthropic from '@anthropic-ai/sdk'

const anthropicApiKey = import.meta.env.VITE_ANTHROPIC_API_KEY || ''

// Note: In production, API calls should go through your backend
// to protect your API key. This is for demonstration purposes.

interface AIResponse {
  content: string
  confidence: number
  suggestedArticles?: string[]
  sentiment?: 'positive' | 'neutral' | 'negative'
  shouldEscalate: boolean
}

interface KnowledgeContext {
  documents: string[]
  faqs: { question: string; answer: string }[]
  businessName: string
  brandVoice?: string
}

export class AIService {
  private client: Anthropic | null = null

  constructor() {
    if (anthropicApiKey) {
      this.client = new Anthropic({
        apiKey: anthropicApiKey,
        dangerouslyAllowBrowser: true, // Only for demo - use backend in production
      })
    }
  }

  async generateResponse(
    message: string,
    conversationHistory: { role: 'user' | 'assistant'; content: string }[],
    knowledgeContext: KnowledgeContext
  ): Promise<AIResponse> {
    if (!this.client) {
      return {
        content: "I apologize, but I'm currently unable to process your request. Please try again later or contact support.",
        confidence: 0,
        shouldEscalate: true,
      }
    }

    const systemPrompt = this.buildSystemPrompt(knowledgeContext)

    try {
      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 1024,
        system: systemPrompt,
        messages: [
          ...conversationHistory.map(msg => ({
            role: msg.role as 'user' | 'assistant',
            content: msg.content,
          })),
          { role: 'user', content: message },
        ],
      })

      const content = response.content[0].type === 'text' 
        ? response.content[0].text 
        : ''

      // Analyze the response for confidence and sentiment
      const analysis = this.analyzeResponse(content, message)

      return {
        content,
        confidence: analysis.confidence,
        sentiment: analysis.sentiment,
        shouldEscalate: analysis.confidence < 0.6,
        suggestedArticles: analysis.suggestedArticles,
      }
    } catch (error) {
      console.error('AI Service Error:', error)
      return {
        content: "I apologize, but I encountered an error processing your request. Let me connect you with a human agent who can help.",
        confidence: 0,
        shouldEscalate: true,
      }
    }
  }

  private buildSystemPrompt(context: KnowledgeContext): string {
    const knowledgeBase = context.documents.join('

---

')
    const faqSection = context.faqs
      .map(faq => `Q: ${faq.question}
A: ${faq.answer}`)
      .join('

')

    return `You are an AI customer support assistant for ${context.businessName}.

Your knowledge base:
${knowledgeBase}

Frequently Asked Questions:
${faqSection}

Guidelines:
1. Be helpful, friendly, and professional
2. Answer questions accurately based ONLY on the knowledge base provided
3. If you don't know something or the information isn't in your knowledge base, say "I don't have that specific information, but let me connect you with a human who can help"
4. Keep responses concise (2-3 sentences max unless more detail is specifically needed)
5. Use the customer's name if they've provided it
${context.brandVoice ? `6. Match this brand voice: ${context.brandVoice}` : ''}
7. Never make up information or provide details not in your knowledge base
8. Always be empathetic and understanding
9. If a customer seems frustrated, acknowledge their feelings
10. Use formatting (bold, bullets) for clarity when listing multiple items
11. End responses with a helpful follow-up question when appropriate

IMPORTANT: If you cannot confidently answer based on the knowledge base, indicate that you should escalate to a human agent.`
  }

  private analyzeResponse(
    response: string,
    originalMessage: string
  ): {
    confidence: number
    sentiment: 'positive' | 'neutral' | 'negative'
    suggestedArticles: string[]
  } {
    // Simple heuristic-based analysis
    // In production, you might use a separate AI call or ML model

    let confidence = 0.8 // Default confidence

    // Lower confidence if response contains uncertainty phrases
    const uncertaintyPhrases = [
      "i don't have",
      "i'm not sure",
      "i cannot find",
      "let me connect you",
      "human agent",
      "i apologize",
      "unfortunately",
    ]

    const lowerResponse = response.toLowerCase()
    for (const phrase of uncertaintyPhrases) {
      if (lowerResponse.includes(phrase)) {
        confidence -= 0.15
      }
    }

    // Analyze sentiment of original message
    const negativePhrases = [
      'angry', 'frustrated', 'terrible', 'awful', 'hate',
      'worst', 'horrible', 'unacceptable', 'ridiculous', 'furious'
    ]
    const positivePhrases = [
      'thank', 'great', 'awesome', 'excellent', 'love',
      'amazing', 'helpful', 'appreciate', 'wonderful', 'fantastic'
    ]

    const lowerMessage = originalMessage.toLowerCase()
    let sentiment: 'positive' | 'neutral' | 'negative' = 'neutral'

    for (const phrase of negativePhrases) {
      if (lowerMessage.includes(phrase)) {
        sentiment = 'negative'
        break
      }
    }

    if (sentiment === 'neutral') {
      for (const phrase of positivePhrases) {
        if (lowerMessage.includes(phrase)) {
          sentiment = 'positive'
          break
        }
      }
    }

    return {
      confidence: Math.max(0, Math.min(1, confidence)),
      sentiment,
      suggestedArticles: [], // Would be populated by semantic search in production
    }
  }

  async summarizeConversation(
    messages: { role: string; content: string }[]
  ): Promise<string> {
    if (!this.client) {
      return 'Unable to generate summary'
    }

    try {
      const conversationText = messages
        .map(m => `${m.role}: ${m.content}`)
        .join('
')

      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 256,
        messages: [
          {
            role: 'user',
            content: `Summarize this customer support conversation in 2-3 sentences, highlighting the main issue and resolution:

${conversationText}`,
          },
        ],
      })

      return response.content[0].type === 'text'
        ? response.content[0].text
        : 'Unable to generate summary'
    } catch (error) {
      console.error('Summary Error:', error)
      return 'Unable to generate summary'
    }
  }

  async suggestResponse(
    message: string,
    context: string
  ): Promise<string[]> {
    if (!this.client) {
      return []
    }

    try {
      const response = await this.client.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 512,
        messages: [
          {
            role: 'user',
            content: `Given this customer message: "${message}"

And this context: ${context}

Suggest 3 brief, professional response options for a support agent. Format as a JSON array of strings.`,
          },
        ],
      })

      const text = response.content[0].type === 'text'
        ? response.content[0].text
        : '[]'

      try {
        return JSON.parse(text)
      } catch {
        return []
      }
    } catch (error) {
      console.error('Suggestion Error:', error)
      return []
    }
  }
}

export const aiService = new AIService()
