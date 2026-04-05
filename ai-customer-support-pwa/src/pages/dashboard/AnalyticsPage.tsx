import React, { useState } from 'react'
import {
  TrendingUp,
  TrendingDown,
  MessageSquare,
  Clock,
  ThumbsUp,
  Bot,
  Users,
  Calendar,
  Download,
  Filter
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Button, Badge } from '../../components/ui'
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend
} from 'recharts'

const conversationData = [
  { date: 'Mon', total: 45, ai: 38, human: 7 },
  { date: 'Tue', total: 52, ai: 44, human: 8 },
  { date: 'Wed', total: 61, ai: 53, human: 8 },
  { date: 'Thu', total: 48, ai: 41, human: 7 },
  { date: 'Fri', total: 55, ai: 48, human: 7 },
  { date: 'Sat', total: 32, ai: 28, human: 4 },
  { date: 'Sun', total: 28, ai: 25, human: 3 },
]

const responseTimeData = [
  { hour: '00:00', time: 1.2 },
  { hour: '04:00', time: 1.1 },
  { hour: '08:00', time: 1.8 },
  { hour: '12:00', time: 2.1 },
  { hour: '16:00', time: 1.9 },
  { hour: '20:00', time: 1.4 },
]

const satisfactionData = [
  { name: '5 Stars', value: 156, color: '#22c55e' },
  { name: '4 Stars', value: 89, color: '#84cc16' },
  { name: '3 Stars', value: 34, color: '#eab308' },
  { name: '2 Stars', value: 12, color: '#f97316' },
  { name: '1 Star', value: 5, color: '#ef4444' },
]

const resolutionData = [
  { category: 'Billing', resolved: 85, escalated: 15 },
  { category: 'Technical', resolved: 72, escalated: 28 },
  { category: 'Shipping', resolved: 91, escalated: 9 },
  { category: 'Returns', resolved: 78, escalated: 22 },
  { category: 'General', resolved: 95, escalated: 5 },
]

const stats = [
  {
    name: 'Total Conversations',
    value: '1,234',
    change: '+12.5%',
    trend: 'up',
    icon: MessageSquare,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    name: 'AI Resolution Rate',
    value: '87.3%',
    change: '+5.2%',
    trend: 'up',
    icon: Bot,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    name: 'Avg Response Time',
    value: '1.2s',
    change: '-0.3s',
    trend: 'up',
    icon: Clock,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    name: 'Customer Satisfaction',
    value: '4.8/5',
    change: '+0.2',
    trend: 'up',
    icon: ThumbsUp,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
]

const topQueries = [
  { query: 'Password reset', count: 234, trend: 'up' },
  { query: 'Order tracking', count: 189, trend: 'up' },
  { query: 'Return policy', count: 156, trend: 'down' },
  { query: 'Shipping times', count: 134, trend: 'up' },
  { query: 'Payment issues', count: 98, trend: 'down' },
]

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState('7d')

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-500 mt-1">Track your AI support performance</p>
        </div>
        <div className="flex gap-3">
          <div className="flex bg-gray-100 rounded-lg p-1">
            {['24h', '7d', '30d', '90d'].map((range) => (
              <button
                key={range}
                onClick={() => setDateRange(range)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
                  dateRange === range
                    ? 'bg-white text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {range}
              </button>
            ))}
          </div>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card key={stat.name}>
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
                  </div>
                </div>
                <div className={`${stat.bgColor} p-3 rounded-xl`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Charts Row 1 */}
      <div className="grid lg:grid-cols-2 gap-6">
        {/* Conversation Volume */}
        <Card>
          <CardHeader>
            <CardTitle>Conversation Volume</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={conversationData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="date" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Area
                    type="monotone"
                    dataKey="ai"
                    stackId="1"
                    stroke="#4f46e5"
                    fill="#c7d2fe"
                    name="AI Handled"
                  />
                  <Area
                    type="monotone"
                    dataKey="human"
                    stackId="1"
                    stroke="#10b981"
                    fill="#a7f3d0"
                    name="Human Handled"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Response Time */}
        <Card>
          <CardHeader>
            <CardTitle>Average Response Time</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={responseTimeData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="hour" stroke="#9ca3af" fontSize={12} />
                  <YAxis stroke="#9ca3af" fontSize={12} unit="s" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                    formatter={(value: number) => [`${value}s`, 'Response Time']}
                  />
                  <Line
                    type="monotone"
                    dataKey="time"
                    stroke="#8b5cf6"
                    strokeWidth={3}
                    dot={{ fill: '#8b5cf6', strokeWidth: 2 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts Row 2 */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Customer Satisfaction */}
        <Card>
          <CardHeader>
            <CardTitle>Customer Satisfaction</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={satisfactionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {satisfactionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex flex-wrap justify-center gap-4 mt-4">
              {satisfactionData.map((item) => (
                <div key={item.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: item.color }} />
                  <span className="text-sm text-gray-600">{item.name}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Resolution by Category */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Resolution Rate by Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={resolutionData} layout="vertical">
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis type="number" stroke="#9ca3af" fontSize={12} />
                  <YAxis dataKey="category" type="category" stroke="#9ca3af" fontSize={12} width={80} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Bar dataKey="resolved" stackId="a" fill="#22c55e" name="AI Resolved" />
                  <Bar dataKey="escalated" stackId="a" fill="#f97316" name="Escalated" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Queries */}
      <Card>
        <CardHeader>
          <CardTitle>Top Customer Queries</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topQueries.map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <span className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center text-sm font-medium text-gray-600">
                    {index + 1}
                  </span>
                  <span className="font-medium text-gray-900">{item.query}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-gray-500">{item.count} queries</span>
                  <div className={`flex items-center gap-1 text-sm ${
                    item.trend === 'up' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {item.trend === 'up' ? (
                      <TrendingUp className="w-4 h-4" />
                    ) : (
                      <TrendingDown className="w-4 h-4" />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
