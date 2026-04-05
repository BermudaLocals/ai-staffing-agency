import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Auth helpers
export const auth = {
  signUp: async (email: string, password: string, metadata?: { name?: string }) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: metadata,
      },
    })
    if (error) throw error
    return data
  },

  signIn: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
    return data
  },

  signOut: async () => {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
  },

  getSession: async () => {
    const { data, error } = await supabase.auth.getSession()
    if (error) throw error
    return data.session
  },

  getUser: async () => {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    return data.user
  },

  onAuthStateChange: (callback: (event: string, session: any) => void) => {
    return supabase.auth.onAuthStateChange(callback)
  },
}

// Database helpers
export const db = {
  // Businesses
  businesses: {
    get: async (id: string) => {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },

    getByApiKey: async (apiKey: string) => {
      const { data, error } = await supabase
        .from('businesses')
        .select('*')
        .eq('api_key', apiKey)
        .single()
      if (error) throw error
      return data
    },

    create: async (business: any) => {
      const { data, error } = await supabase
        .from('businesses')
        .insert(business)
        .select()
        .single()
      if (error) throw error
      return data
    },

    update: async (id: string, updates: any) => {
      const { data, error } = await supabase
        .from('businesses')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
  },

  // Conversations
  conversations: {
    list: async (businessId: string, options?: { status?: string; limit?: number }) => {
      let query = supabase
        .from('conversations')
        .select('*, messages(count)')
        .eq('business_id', businessId)
        .order('started_at', { ascending: false })

      if (options?.status) {
        query = query.eq('status', options.status)
      }
      if (options?.limit) {
        query = query.limit(options.limit)
      }

      const { data, error } = await query
      if (error) throw error
      return data
    },

    get: async (id: string) => {
      const { data, error } = await supabase
        .from('conversations')
        .select('*, messages(*)')
        .eq('id', id)
        .single()
      if (error) throw error
      return data
    },

    create: async (conversation: any) => {
      const { data, error } = await supabase
        .from('conversations')
        .insert(conversation)
        .select()
        .single()
      if (error) throw error
      return data
    },

    update: async (id: string, updates: any) => {
      const { data, error } = await supabase
        .from('conversations')
        .update(updates)
        .eq('id', id)
        .select()
        .single()
      if (error) throw error
      return data
    },
  },

  // Messages
  messages: {
    list: async (conversationId: string) => {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true })
      if (error) throw error
      return data
    },

    create: async (message: any) => {
      const { data, error } = await supabase
        .from('messages')
        .insert(message)
        .select()
        .single()
      if (error) throw error
      return data
    },
  },

  // Knowledge Base
  knowledgeBase: {
    list: async (businessId: string) => {
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .eq('business_id', businessId)
        .order('created_at', { ascending: false })
      if (error) throw error
      return data
    },

    create: async (item: any) => {
      const { data, error } = await supabase
        .from('knowledge_base')
        .insert(item)
        .select()
        .single()
      if (error) throw error
      return data
    },

    delete: async (id: string) => {
      const { error } = await supabase
        .from('knowledge_base')
        .delete()
        .eq('id', id)
      if (error) throw error
    },

    search: async (businessId: string, query: string, limit = 5) => {
      // This would use vector similarity search in production
      const { data, error } = await supabase
        .from('knowledge_base')
        .select('*')
        .eq('business_id', businessId)
        .textSearch('content', query)
        .limit(limit)
      if (error) throw error
      return data
    },
  },

  // Analytics
  analytics: {
    trackEvent: async (event: any) => {
      const { error } = await supabase
        .from('analytics_events')
        .insert(event)
      if (error) throw error
    },

    getStats: async (businessId: string, dateRange: { start: Date; end: Date }) => {
      const { data, error } = await supabase
        .from('analytics_events')
        .select('*')
        .eq('business_id', businessId)
        .gte('created_at', dateRange.start.toISOString())
        .lte('created_at', dateRange.end.toISOString())
      if (error) throw error
      return data
    },
  },

  // Users/Team
  users: {
    list: async (businessId: string) => {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('business_id', businessId)
      if (error) throw error
      return data
    },

    invite: async (email: string, businessId: string, role: string) => {
      // In production, this would send an invite email
      const { data, error } = await supabase
        .from('users')
        .insert({
          email,
          business_id: businessId,
          role,
          status: 'pending',
        })
        .select()
        .single()
      if (error) throw error
      return data
    },
  },
}

// Realtime subscriptions
export const realtime = {
  subscribeToConversations: (businessId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`conversations:${businessId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'conversations',
          filter: `business_id=eq.${businessId}`,
        },
        callback
      )
      .subscribe()
  },

  subscribeToMessages: (conversationId: string, callback: (payload: any) => void) => {
    return supabase
      .channel(`messages:${conversationId}`)
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'messages',
          filter: `conversation_id=eq.${conversationId}`,
        },
        callback
      )
      .subscribe()
  },

  unsubscribe: (channel: any) => {
    supabase.removeChannel(channel)
  },
}

export default supabase
