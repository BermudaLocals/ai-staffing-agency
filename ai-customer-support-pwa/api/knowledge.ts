import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!
)

export const config = {
  runtime: 'edge',
}

export default async function handler(req: Request) {
  const url = new URL(req.url)
  const apiKey = req.headers.get('x-api-key') || url.searchParams.get('apiKey')

  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: 'API key required' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }

  // Verify API key
  const { data: business, error: businessError } = await supabase
    .from('businesses')
    .select('id')
    .eq('api_key', apiKey)
    .single()

  if (businessError || !business) {
    return new Response(
      JSON.stringify({ error: 'Invalid API key' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }

  try {
    switch (req.method) {
      case 'GET': {
        const { data, error } = await supabase
          .from('knowledge_base')
          .select('id, source_type, source_name, title, status, created_at')
          .eq('business_id', business.id)
          .order('created_at', { ascending: false })

        if (error) throw error
        return new Response(JSON.stringify({ data }), {
          headers: { 'Content-Type': 'application/json' },
        })
      }

      case 'POST': {
        const body = await req.json()
        const { sourceType, sourceName, title, content } = body

        if (!content) {
          return new Response(
            JSON.stringify({ error: 'Content is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          )
        }

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
          .single()

        if (error) throw error

        // Update business knowledge base timestamp
        await supabase
          .from('businesses')
          .update({ knowledge_base_updated_at: new Date().toISOString() })
          .eq('id', business.id)

        return new Response(JSON.stringify({ data }), {
          status: 201,
          headers: { 'Content-Type': 'application/json' },
        })
      }

      case 'DELETE': {
        const id = url.searchParams.get('id')
        if (!id) {
          return new Response(
            JSON.stringify({ error: 'ID is required' }),
            { status: 400, headers: { 'Content-Type': 'application/json' } }
          )
        }

        const { error } = await supabase
          .from('knowledge_base')
          .delete()
          .eq('id', id)
          .eq('business_id', business.id)

        if (error) throw error
        return new Response(JSON.stringify({ success: true }), {
          headers: { 'Content-Type': 'application/json' },
        })
      }

      default:
        return new Response(
          JSON.stringify({ error: 'Method not allowed' }),
          { status: 405, headers: { 'Content-Type': 'application/json' } }
        )
    }
  } catch (error: any) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
