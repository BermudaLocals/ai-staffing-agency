import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
})

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any): string => {
  if (error?.message) {
    return error.message
  }
  if (error?.error_description) {
    return error.error_description
  }
  return 'An unexpected error occurred'
}

// Database types for better TypeScript support
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          role: string
          business_id: string | null
          avatar_url: string | null
          status: string
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          full_name?: string | null
          role?: string
          business_id?: string | null
          avatar_url?: string | null
          status?: string
        }
        Update: {
          email?: string
          full_name?: string | null
          role?: string
          business_id?: string | null
          avatar_url?: string | null
          status?: string
        }
      }
      businesses: {
        Row: {
          id: string
          name: string
          website: string | null
          industry: string | null
          api_key: string
          plan: string
          stripe_customer_id: string | null
          widget_settings: any
          knowledge_base_updated_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          website?: string | null
          industry?: string | null
          api_key?: string
          plan?: string
          stripe_customer_id?: string | null
          widget_settings?: any
        }
        Update: {
          name?: string
          website?: string | null
          industry?: string | null
          plan?: string
          stripe_customer_id?: string | null
          widget_settings?: any
        }
      }
      conversations: {
        Row: {
          id: string
          business_id: string
          customer_email: string | null
          customer_name: string | null
          status: string
          assigned_agent_id: string | null
          started_at: string
          ended_at: string | null
          satisfaction_score: number | null
          tags: string[]
          metadata: any
          unread_count: number
          ai_handled: boolean
          source: string
        }
        Insert: {
          id?: string
          business_id: string
          customer_email?: string | null
          customer_name?: string | null
          status?: string
          assigned_agent_id?: string | null
          tags?: string[]
          metadata?: any
          source?: string
        }
        Update: {
          status?: string
          assigned_agent_id?: string | null
          ended_at?: string | null
          satisfaction_score?: number | null
          tags?: string[]
          metadata?: any
          unread_count?: number
        }
      }
      messages: {
        Row: {
          id: string
          conversation_id: string
          sender_type: string
          sender_id: string | null
          content: string
          ai_confidence: number | null
          metadata: any
          created_at: string
          read_at: string | null
        }
        Insert: {
          id?: string
          conversation_id: string
          sender_type: string
          sender_id?: string | null
          content: string
          ai_confidence?: number | null
          metadata?: any
        }
        Update: {
          content?: string
          metadata?: any
          read_at?: string | null
        }
      }
      knowledge_base: {
        Row: {
          id: string
          business_id: string
          source_type: string
          source_url: string | null
          title: string
          content: string
          status: string
          error_message: string | null
          metadata: any
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          business_id: string
          source_type: string
          source_url?: string | null
          title: string
          content: string
          status?: string
          metadata?: any
        }
        Update: {
          title?: string
          content?: string
          status?: string
          error_message?: string | null
          metadata?: any
        }
      }
    }
  }
}
