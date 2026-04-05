import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export const config = {
  runtime: 'edge',
}

export default async function handler(req: Request) {
  if (req.method !== 'GET') {
    return new Response(
      JSON.stringify({ error: 'Method not allowed' }),
      { status: 405, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const url = new URL(req.url)
  const apiKey = req.headers.get('x-api-key') || url.searchParams.get('apiKey')
  const period = url.searchParams.get('period') || '7d'

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'API key required' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // Verify API key
  const { data: business } = await supabase
    .from('businesses')
    .select('id')
    .eq('api_key', apiKey)
    .single()

  if (!business) {
    return new Response(
      JSON.stringify({ error: 'Invalid API key' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    // Calculate date range
    const now = new Date()
    let startDate = new Date()
    switch (period) {
      case '24h':
        startDate.setHours(startDate.getHours() - 24)
        break
      case '7d':
        startDate.setDate(startDate.getDate() - 7)
        break
      case '30d':
        startDate.setDate(startDate.getDate() - 30)
        break
      case '90d':
        startDate.setDate(startDate.getDate() - 90)
        break
    }

    // Get conversations stats
    const { data: conversations } = await supabase
      .from('conversations')
      .select('id, status, satisfaction_score, resolution_time_seconds, is_ai_handled, started_at')
      .eq('business_id', business.id)
      .gte('started_at', startDate.toISOString())

    // Get messages count
    const { count: messageCount } = await supabase
      .from('messages')
      .select('id', { count: 'exact' })
      .in('conversation_id', conversations?.map(c => c.id) || [])

    // Calculate metrics
    const totalConversations = conversations?.length || 0
    const resolvedConversations = conversations?.filter(c => c.status === 'resolved').length || 0
    const aiHandledConversations = conversations?.filter(c => c.is_ai_handled).length || 0
    const avgSatisfaction = conversations?.filter(c => c.satisfaction_score)
      .reduce((sum, c) => sum + (c.satisfaction_score || 0), 0) / 
      (conversations?.filter(c => c.satisfaction_score).length || 1)
    const avgResolutionTime = conversations?.filter(c => c.resolution_time_seconds)
      .reduce((sum, c) => sum + (c.resolution_time_seconds || 0), 0) /
      (conversations?.filter(c => c.resolution_time_seconds).length || 1)

    const analytics = {
      period,
      totalConversations,
      resolvedConversations,
      resolutionRate: totalConversations > 0 ? (resolvedConversations / totalConversations * 100).toFixed(1) : 0,
      aiHandledRate: totalConversations > 0 ? (aiHandledConversations / totalConversations * 100).toFixed(1) : 0,
      totalMessages: messageCount || 0,
      avgSatisfaction: avgSatisfaction.toFixed(1),
      avgResolutionTimeMinutes: (avgResolutionTime / 60).toFixed(1),
      conversationsByDay: groupByDay(conversations || [], 'started_at'),
    }

    return new Response(JSON.stringify(analytics), {
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}

function groupByDay(items: any[], dateField: string) {
  const groups: Record<string, number> = {}
  items.forEach(item => {
    const date = new Date(item[dateField]).toISOString().split('T')[0]
    groups[date] = (groups[date] || 0) + 1
  })
  return Object.entries(groups).map(([date, count]) => ({ date, count }))
}
