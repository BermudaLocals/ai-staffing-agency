import React from 'react'

interface TypingIndicatorProps {
  name?: string
}

export const TypingIndicator: React.FC<TypingIndicatorProps> = ({ name }) => {
  return (
    <div className="flex items-center gap-2 mb-4">
      <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3">
        <div className="flex items-center gap-1">
          <div className="typing-dot w-2 h-2 bg-gray-400 rounded-full" />
          <div className="typing-dot w-2 h-2 bg-gray-400 rounded-full" />
          <div className="typing-dot w-2 h-2 bg-gray-400 rounded-full" />
        </div>
      </div>
      {name && (
        <span className="text-xs text-gray-400">{name} is typing...</span>
      )}
    </div>
  )
}
