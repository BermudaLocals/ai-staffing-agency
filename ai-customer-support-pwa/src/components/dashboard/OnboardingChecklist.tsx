import React, { useState, useEffect } from 'react'
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronUp,
  Sparkles,
  PartyPopper,
  Upload,
  Palette,
  Users,
  Bell,
  TestTube,
  Code,
  BookOpen,
  Rocket,
  X,
  ExternalLink
} from 'lucide-react'
import { Button, Card } from '../ui'
import confetti from 'canvas-confetti'

interface ChecklistItem {
  id: string
  title: string
  description: string
  icon: React.ReactNode
  link?: string
  linkText?: string
}

const checklistItems: ChecklistItem[] = [
  {
    id: 'upload-faq',
    title: 'Upload FAQ Document',
    description: 'Add your frequently asked questions to train the AI',
    icon: <Upload className="w-5 h-5" />,
    link: '/dashboard/knowledge',
    linkText: 'Go to Knowledge Base'
  },
  {
    id: 'add-products',
    title: 'Add Product/Service Info',
    description: 'Help the AI understand what you offer',
    icon: <BookOpen className="w-5 h-5" />,
    link: '/dashboard/knowledge',
    linkText: 'Add Content'
  },
  {
    id: 'customize-widget',
    title: 'Customize Widget Appearance',
    description: 'Match the chat widget to your brand colors',
    icon: <Palette className="w-5 h-5" />,
    link: '/dashboard/widget',
    linkText: 'Customize Widget'
  },
  {
    id: 'invite-team',
    title: 'Invite Team Members',
    description: 'Add your support team to collaborate',
    icon: <Users className="w-5 h-5" />,
    link: '/dashboard/settings',
    linkText: 'Manage Team'
  },
  {
    id: 'setup-notifications',
    title: 'Configure Notifications',
    description: 'Set up alerts for important events',
    icon: <Bell className="w-5 h-5" />,
    link: '/dashboard/settings',
    linkText: 'Notification Settings'
  },
  {
    id: 'test-ai',
    title: 'Test AI Responses',
    description: 'Try out the AI and refine its answers',
    icon: <TestTube className="w-5 h-5" />,
    link: '/dashboard/playground',
    linkText: 'Open Playground'
  },
  {
    id: 'embed-widget',
    title: 'Embed Widget on Website',
    description: 'Copy the code snippet to your site',
    icon: <Code className="w-5 h-5" />,
    link: '/dashboard/widget',
    linkText: 'Get Embed Code'
  },
  {
    id: 'go-live',
    title: 'Go Live!',
    description: 'Enable the widget for your customers',
    icon: <Rocket className="w-5 h-5" />,
    link: '/dashboard/widget',
    linkText: 'Launch Widget'
  }
]

interface OnboardingChecklistProps {
  className?: string
  defaultExpanded?: boolean
  onComplete?: () => void
}

export default function OnboardingChecklist({
  className = '',
  defaultExpanded = true,
  onComplete
}: OnboardingChecklistProps) {
  const [completedItems, setCompletedItems] = useState<string[]>(() => {
    const saved = localStorage.getItem('onboarding-completed')
    return saved ? JSON.parse(saved) : []
  })
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)
  const [showCelebration, setShowCelebration] = useState(false)
  const [isDismissed, setIsDismissed] = useState(() => {
    return localStorage.getItem('onboarding-dismissed') === 'true'
  })

  const progress = (completedItems.length / checklistItems.length) * 100
  const isComplete = completedItems.length === checklistItems.length

  useEffect(() => {
    localStorage.setItem('onboarding-completed', JSON.stringify(completedItems))
  }, [completedItems])

  useEffect(() => {
    if (isComplete && !showCelebration) {
      setShowCelebration(true)
      triggerCelebration()
      onComplete?.()
    }
  }, [isComplete])

  const triggerCelebration = () => {
    // Fire confetti
    const duration = 3000
    const end = Date.now() + duration

    const frame = () => {
      confetti({
        particleCount: 3,
        angle: 60,
        spread: 55,
        origin: { x: 0 },
        colors: ['#6366f1', '#8b5cf6', '#a855f7']
      })
      confetti({
        particleCount: 3,
        angle: 120,
        spread: 55,
        origin: { x: 1 },
        colors: ['#6366f1', '#8b5cf6', '#a855f7']
      })

      if (Date.now() < end) {
        requestAnimationFrame(frame)
      }
    }
    frame()
  }

  const toggleItem = (id: string) => {
    setCompletedItems(prev =>
      prev.includes(id)
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const handleDismiss = () => {
    setIsDismissed(true)
    localStorage.setItem('onboarding-dismissed', 'true')
  }

  const handleReset = () => {
    setCompletedItems([])
    setShowCelebration(false)
    setIsDismissed(false)
    localStorage.removeItem('onboarding-completed')
    localStorage.removeItem('onboarding-dismissed')
  }

  if (isDismissed && !isComplete) {
    return (
      <button
        onClick={() => setIsDismissed(false)}
        className="fixed bottom-4 right-4 bg-primary-600 text-white px-4 py-2 rounded-full shadow-lg hover:bg-primary-700 transition-colors flex items-center gap-2 z-50"
      >
        <Sparkles className="w-4 h-4" />
        Continue Setup ({completedItems.length}/{checklistItems.length})
      </button>
    )
  }

  return (
    <>
      <Card className={`overflow-hidden ${className}`}>
        {/* Header */}
        <div
          className="p-4 bg-gradient-to-r from-primary-500 to-purple-500 cursor-pointer"
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                {isComplete ? (
                  <PartyPopper className="w-5 h-5 text-white" />
                ) : (
                  <Sparkles className="w-5 h-5 text-white" />
                )}
              </div>
              <div>
                <h3 className="font-semibold text-white">
                  {isComplete ? 'Setup Complete!' : 'Getting Started'}
                </h3>
                <p className="text-white/80 text-sm">
                  {isComplete
                    ? 'You\'re all set to go!'
                    : `${completedItems.length} of ${checklistItems.length} tasks completed`}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {!isComplete && (
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    handleDismiss()
                  }}
                  className="p-1 hover:bg-white/20 rounded transition-colors"
                >
                  <X className="w-4 h-4 text-white/80" />
                </button>
              )}
              {isExpanded ? (
                <ChevronUp className="w-5 h-5 text-white" />
              ) : (
                <ChevronDown className="w-5 h-5 text-white" />
              )}
            </div>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        {/* Checklist Items */}
        {isExpanded && (
          <div className="p-4 space-y-2">
            {checklistItems.map((item, index) => {
              const isItemComplete = completedItems.includes(item.id)
              const isPreviousComplete = index === 0 || completedItems.includes(checklistItems[index - 1].id)

              return (
                <div
                  key={item.id}
                  className={`flex items-start gap-3 p-3 rounded-lg transition-all ${
                    isItemComplete
                      ? 'bg-green-50 dark:bg-green-900/20'
                      : isPreviousComplete
                      ? 'bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700'
                      : 'bg-gray-50 dark:bg-gray-800 opacity-50'
                  }`}
                >
                  <button
                    onClick={() => toggleItem(item.id)}
                    className={`flex-shrink-0 mt-0.5 transition-colors ${
                      isItemComplete
                        ? 'text-green-500'
                        : 'text-gray-300 dark:text-gray-600 hover:text-primary-500'
                    }`}
                  >
                    {isItemComplete ? (
                      <CheckCircle2 className="w-6 h-6" />
                    ) : (
                      <Circle className="w-6 h-6" />
                    )}
                  </button>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`${
                        isItemComplete
                          ? 'text-green-700 dark:text-green-400'
                          : 'text-gray-400'
                      }`}>
                        {item.icon}
                      </span>
                      <h4 className={`font-medium ${
                        isItemComplete
                          ? 'text-green-700 dark:text-green-400 line-through'
                          : 'text-gray-900 dark:text-white'
                      }`}>
                        {item.title}
                      </h4>
                    </div>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
                      {item.description}
                    </p>
                    {item.link && !isItemComplete && isPreviousComplete && (
                      <a
                        href={item.link}
                        className="inline-flex items-center gap-1 text-sm text-primary-600 hover:text-primary-700 mt-2"
                      >
                        {item.linkText}
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    )}
                  </div>
                </div>
              )
            })}

            {/* Reset Button (for demo) */}
            {isComplete && (
              <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                <button
                  onClick={handleReset}
                  className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
                >
                  Reset checklist (demo)
                </button>
              </div>
            )}
          </div>
        )}
      </Card>

      {/* Celebration Modal */}
      {showCelebration && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 max-w-md text-center animate-bounce-in">
            <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <PartyPopper className="w-10 h-10 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              Congratulations! 🎉
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              You've completed all the setup steps! Your AI support system is now ready to help your customers.
            </p>
            <div className="space-y-3">
              <Button onClick={() => setShowCelebration(false)} className="w-full">
                <Rocket className="w-4 h-4 mr-2" />
                Start Using AI Support
              </Button>
              <button
                onClick={() => {
                  setShowCelebration(false)
                  handleDismiss()
                }}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Dismiss checklist
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes bounce-in {
          0% { transform: scale(0.5); opacity: 0; }
          50% { transform: scale(1.05); }
          100% { transform: scale(1); opacity: 1; }
        }
        .animate-bounce-in {
          animation: bounce-in 0.5s ease-out;
        }
      `}</style>
    </>
  )
}
