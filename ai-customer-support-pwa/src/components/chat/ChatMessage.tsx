import React from 'react'
import { format } from 'date-fns'
import { Bot, User, UserCircle, Check, CheckCheck } from 'lucide-react'
import { Message } from '../../types'
import { Avatar } from '../ui/Avatar'

interface ChatMessageProps {
  message: Message
  isCustomerView?: boolean
}

export const ChatMessage: React.FC<ChatMessageProps> = ({
  message,
  isCustomerView = false,
}) => {
  const isCustomer = message.senderType === 'customer'
  const isAI = message.senderType === 'ai'
  const isAgent = message.senderType === 'agent'

  const getAlignment = () => {
    if (isCustomerView) {
      return isCustomer ? 'justify-end' : 'justify-start'
    }
    return isCustomer ? 'justify-start' : 'justify-end'
  }

  const getBubbleStyle = () => {
    if (isCustomerView) {
      return isCustomer
        ? 'bg-primary-600 text-white rounded-br-sm'
        : 'bg-gray-100 text-gray-900 rounded-bl-sm'
    }
    return isCustomer
      ? 'bg-gray-100 text-gray-900 rounded-bl-sm'
      : isAI
      ? 'bg-primary-600 text-white rounded-br-sm'
      : 'bg-green-600 text-white rounded-br-sm'
  }

  const getIcon = () => {
    if (isCustomer) {
      return <UserCircle className="w-5 h-5" />
    }
    if (isAI) {
      return <Bot className="w-5 h-5" />
    }
    return <User className="w-5 h-5" />
  }

  return (
    <div className={`flex ${getAlignment()} mb-4 chat-bubble`}>
      <div className={`flex max-w-[80%] gap-2 ${isCustomer && !isCustomerView ? 'flex-row' : 'flex-row-reverse'}`}>
        <div className="flex-shrink-0 mt-1">
          <div className={`
            w-8 h-8 rounded-full flex items-center justify-center
            ${isCustomer ? 'bg-gray-200 text-gray-600' : isAI ? 'bg-primary-100 text-primary-600' : 'bg-green-100 text-green-600'}
          `}>
            {getIcon()}
          </div>
        </div>

        <div>
          <div className={`px-4 py-2.5 rounded-2xl ${getBubbleStyle()}`}>
            <p className="text-sm whitespace-pre-wrap break-words">
              {message.content}
            </p>

            {/* Attachments */}
            {message.metadata?.attachments && message.metadata.attachments.length > 0 && (
              <div className="mt-2 space-y-1">
                {message.metadata.attachments.map((attachment, idx) => (
                  <a
                    key={idx}
                    href={attachment.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block text-xs underline opacity-80 hover:opacity-100"
                  >
                    📎 {attachment.name}
                  </a>
                ))}
              </div>
            )}
          </div>

          {/* Metadata */}
          <div className={`flex items-center gap-2 mt-1 text-xs text-gray-400 ${isCustomer && !isCustomerView ? '' : 'justify-end'}`}>
            <span>{format(new Date(message.createdAt), 'HH:mm')}</span>
            {isAI && message.aiConfidence !== undefined && (
              <span className="text-primary-500">
                {Math.round(message.aiConfidence * 100)}% confident
              </span>
            )}
            {!isCustomer && message.readAt && (
              <CheckCheck className="w-3.5 h-3.5 text-blue-500" />
            )}
            {!isCustomer && !message.readAt && (
              <Check className="w-3.5 h-3.5" />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
