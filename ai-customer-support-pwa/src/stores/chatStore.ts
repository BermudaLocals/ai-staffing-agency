import { create } from 'zustand'

interface Message {
  id: string
  content: string
  sender: 'user' | 'ai' | 'agent'
  timestamp: Date
  status?: 'sending' | 'sent' | 'error'
  confidence?: number
}

interface ChatState {
  messages: Message[]
  isOpen: boolean
  isTyping: boolean
  conversationId: string | null
  customerEmail: string | null
  customerName: string | null

  // Actions
  addMessage: (message: Omit<Message, 'id' | 'timestamp'>) => void
  setTyping: (typing: boolean) => void
  toggleChat: () => void
  openChat: () => void
  closeChat: () => void
  setConversationId: (id: string) => void
  setCustomerInfo: (email: string, name: string) => void
  clearMessages: () => void
}

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [],
  isOpen: false,
  isTyping: false,
  conversationId: null,
  customerEmail: null,
  customerName: null,

  addMessage: (message) => {
    const newMessage: Message = {
      ...message,
      id: Date.now().toString(),
      timestamp: new Date(),
    }
    set((state) => ({
      messages: [...state.messages, newMessage],
    }))
  },

  setTyping: (isTyping) => set({ isTyping }),

  toggleChat: () => set((state) => ({ isOpen: !state.isOpen })),

  openChat: () => set({ isOpen: true }),

  closeChat: () => set({ isOpen: false }),

  setConversationId: (conversationId) => set({ conversationId }),

  setCustomerInfo: (customerEmail, customerName) => set({ customerEmail, customerName }),

  clearMessages: () => set({ messages: [], conversationId: null }),
}))
