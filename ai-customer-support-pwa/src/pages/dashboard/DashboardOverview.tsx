import React from 'react'
import { Link } from 'react-router-dom'
import {
  MessageSquare,
  Users,
  Clock,
  TrendingUp,
  TrendingDown,
  ArrowRight,
  Bot,
  UserCheck,
  AlertCircle,
  CheckCircle2
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Badge, Avatar } from '../../components/ui'
import { useChatStore } from '../../stores/chatStore'
import { format } from 'date-fns'

const stats = [
  {
    name: 'Total Conversations',
    value: '1,234',
    change: '+12%',
    trend: 'up',
    icon: MessageSquare,
    color: 'bg-blue-500',
  },
  {
    name: 'AI Resolution Rate',
    value: '87%',
    change: '+5%',
    trend: 'up',
    icon: Bot,
    color: 'bg-green-500',
  },
  {
    name: 'Avg Response Time',
    value: '1.2s',
    change: '-0.3s',
    trend: 'up',
    icon: Clock,
    color: 'bg-purple-500',
  },
  {
    name: 'Customer Satisfaction',
    value: '4.8/5',
    change: '+0.2',
    trend: 'up',
    icon: Users,
    color: 'bg-yellow-500',
  },
]

const recentConversations = [
  {
    id: '1',
    customer: 'John Smith',
    email: 'john@example.com',
    message: 'How do I reset my password?',
    status: 'resolved',
    handler: 'AI',
    time: '5 min ago',
  },
  {
    id: '2',
    customer: 'Sarah Johnson',
    email: 'sarah@example.com',
    message: 'I need help with my order #12345',
    status: 'active',
    handler: 'Agent',
    time: '12 min ago',
  },
  {
    id: '3',
    customer: 'Mike Wilson',
    email: 'mike@example.com',
    message: 'What are your business hours?',
    status: 'resolved',
    handler: 'AI',
    time: '25 min ago',
  },
  {
    id: '4',
    customer: 'Emily Brown',
    email: 'emily@example.com',
    message: 'Can I get a refund for my purchase?',
    status: 'escalated',
    handler: 'Pending',
    time: '1 hour ago',
  },
]

const topQuestions = [
  { question: 'How do I reset my password?', count: 156 },
  { question: 'What is your return policy?', count: 134 },
  { question: 'How can I track my order?', count: 98 },
  { question: 'Do you offer international shipping?', count: 87 },
  { question: 'How do I contact support?', count: 76 },
]

export default function DashboardOverview() {
  const { conversations } = useChatStore()

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-500 mt-1">Welcome back! Here's what's happening with your support.</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name} className="relative overflow-hidden">
            <CardContent>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-500">{stat.name}</p>
                  <p className="text-3xl font-bold text-gray-900 mt-2">{stat.value}</p>
                  <div className={`flex items-center gap-1 mt-2 text-sm ${
                    stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stat.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                    <span>{stat.change}</span>
                    <span className="text-gray-400">vs last week</span>
                  </div>
                </div>
                <div className={`${stat.color} p-3 rounded-xl`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Recent Conversations */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle>Recent Conversations</CardTitle>
              <Link
                to="/dashboard/conversations"
                className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
              >
                View all
                <ArrowRight className="w-4 h-4" />
              </Link>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {recentConversations.map((conv) => (
                  <div
                    key={conv.id}
                    className="flex items-start gap-4 p-4 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                  >
                    <Avatar name={conv.customer} size="md" />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <p className="font-medium text-gray-900 truncate">
                          {conv.customer}
                        </p>
                        <span className="text-xs text-gray-400 whitespace-nowrap">
                          {conv.time}
                        </span>
                      </div>
                      <p className="text-sm text-gray-500 truncate mt-0.5">
                        {conv.message}
                      </p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge
                          variant={
                            conv.status === 'resolved'
                              ? 'success'
                              : conv.status === 'active'
                              ? 'info'
                              : 'warning'
                          }
                          size="sm"
                        >
                          {conv.status}
                        </Badge>
                        <span className="text-xs text-gray-400">
                          {conv.handler === 'AI' ? (
                            <span className="flex items-center gap-1">
                              <Bot className="w-3 h-3" /> AI
                            </span>
                          ) : conv.handler === 'Agent' ? (
                            <span className="flex items-center gap-1">
                              <UserCheck className="w-3 h-3" /> Agent
                            </span>
                          ) : (
                            <span className="flex items-center gap-1">
                              <AlertCircle className="w-3 h-3" /> Pending
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Top Questions */}
        <div>
          <Card>
            <CardHeader>
              <CardTitle>Top Questions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {topQuestions.map((item, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-gray-100 rounded-full flex items-center justify-center text-xs font-medium text-gray-600">
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-700 truncate">
                        {item.question}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {item.count} times asked
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Quick Actions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                <Link
                  to="/dashboard/knowledge"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Bot className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Train AI</p>
                    <p className="text-xs text-gray-500">Add knowledge base docs</p>
                  </div>
                </Link>
                <Link
                  to="/dashboard/team"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Users className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Invite Team</p>
                    <p className="text-xs text-gray-500">Add team members</p>
                  </div>
                </Link>
                <Link
                  to="/dashboard/settings"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CheckCircle2 className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Widget Settings</p>
                    <p className="text-xs text-gray-500">Customize appearance</p>
                  </div>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
