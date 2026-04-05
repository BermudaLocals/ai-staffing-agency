import React, { useState } from 'react'
import {
  Users,
  Plus,
  Search,
  MoreVertical,
  Mail,
  Shield,
  Trash2,
  Edit,
  CheckCircle,
  Clock,
  XCircle
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Avatar, Modal, Input } from '../../components/ui'

interface TeamMember {
  id: string
  name: string
  email: string
  role: 'admin' | 'agent' | 'viewer'
  status: 'active' | 'pending' | 'inactive'
  avatar?: string
  lastActive?: Date
  conversationsHandled?: number
  avgResponseTime?: string
  satisfaction?: number
}

const mockTeam: TeamMember[] = [
  {
    id: '1',
    name: 'John Doe',
    email: 'john@company.com',
    role: 'admin',
    status: 'active',
    lastActive: new Date(),
    conversationsHandled: 234,
    avgResponseTime: '45s',
    satisfaction: 4.8,
  },
  {
    id: '2',
    name: 'Sarah Smith',
    email: 'sarah@company.com',
    role: 'agent',
    status: 'active',
    lastActive: new Date(Date.now() - 30 * 60000),
    conversationsHandled: 189,
    avgResponseTime: '52s',
    satisfaction: 4.6,
  },
  {
    id: '3',
    name: 'Mike Johnson',
    email: 'mike@company.com',
    role: 'agent',
    status: 'active',
    lastActive: new Date(Date.now() - 2 * 60 * 60000),
    conversationsHandled: 156,
    avgResponseTime: '48s',
    satisfaction: 4.7,
  },
  {
    id: '4',
    name: 'Emily Brown',
    email: 'emily@company.com',
    role: 'viewer',
    status: 'pending',
  },
]

const roles = [
  { value: 'admin', label: 'Admin', description: 'Full access to all features' },
  { value: 'agent', label: 'Agent', description: 'Can handle conversations and view analytics' },
  { value: 'viewer', label: 'Viewer', description: 'Read-only access to dashboard' },
]

export default function TeamPage() {
  const [team, setTeam] = useState(mockTeam)
  const [showInviteModal, setShowInviteModal] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [inviteEmail, setInviteEmail] = useState('')
  const [inviteRole, setInviteRole] = useState<'admin' | 'agent' | 'viewer'>('agent')

  const filteredTeam = team.filter(member =>
    member.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    member.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleInvite = () => {
    if (!inviteEmail.trim()) return
    const newMember: TeamMember = {
      id: Date.now().toString(),
      name: inviteEmail.split('@')[0],
      email: inviteEmail,
      role: inviteRole,
      status: 'pending',
    }
    setTeam(prev => [...prev, newMember])
    setInviteEmail('')
    setShowInviteModal(false)
  }

  const handleRemove = (id: string) => {
    setTeam(prev => prev.filter(m => m.id !== id))
  }

  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'admin':
        return <Badge variant="info">Admin</Badge>
      case 'agent':
        return <Badge variant="success">Agent</Badge>
      case 'viewer':
        return <Badge variant="default">Viewer</Badge>
      default:
        return null
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />
      case 'inactive':
        return <XCircle className="w-4 h-4 text-gray-400" />
      default:
        return null
    }
  }

  const stats = {
    total: team.length,
    active: team.filter(m => m.status === 'active').length,
    pending: team.filter(m => m.status === 'pending').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Team</h1>
          <p className="text-gray-500 mt-1">Manage your support team members</p>
        </div>
        <Button onClick={() => setShowInviteModal(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Invite Member
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-gray-500">Total Members</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-gray-500">Active</p>
            <p className="text-2xl font-bold text-green-600">{stats.active}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-gray-500">Pending Invites</p>
            <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Search team members..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {/* Team List */}
      <Card>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-100">
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Member</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Role</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Status</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Conversations</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Avg Response</th>
                  <th className="text-left py-4 px-6 text-sm font-medium text-gray-500">Satisfaction</th>
                  <th className="text-right py-4 px-6 text-sm font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTeam.map((member) => (
                  <tr key={member.id} className="border-b border-gray-50 hover:bg-gray-50">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <Avatar name={member.name} size="md" />
                        <div>
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <p className="text-sm text-gray-500">{member.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {getRoleBadge(member.role)}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {getStatusIcon(member.status)}
                        <span className="text-sm text-gray-600 capitalize">{member.status}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-900">{member.conversationsHandled || '-'}</span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-gray-900">{member.avgResponseTime || '-'}</span>
                    </td>
                    <td className="py-4 px-6">
                      {member.satisfaction ? (
                        <div className="flex items-center gap-1">
                          <span className="text-gray-900">{member.satisfaction}</span>
                          <span className="text-yellow-500">★</span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center justify-end gap-2">
                        <button className="p-2 hover:bg-gray-100 rounded-lg">
                          <Edit className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => handleRemove(member.id)}
                          className="p-2 hover:bg-red-50 rounded-lg"
                        >
                          <Trash2 className="w-4 h-4 text-red-400" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Invite Modal */}
      <Modal
        isOpen={showInviteModal}
        onClose={() => setShowInviteModal(false)}
        title="Invite Team Member"
      >
        <div className="space-y-4">
          <Input
            label="Email address"
            type="email"
            value={inviteEmail}
            onChange={(e) => setInviteEmail(e.target.value)}
            placeholder="colleague@company.com"
            leftIcon={<Mail className="w-5 h-5" />}
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Role</label>
            <div className="space-y-2">
              {roles.map((role) => (
                <label
                  key={role.value}
                  className={`flex items-start gap-3 p-3 rounded-lg border-2 cursor-pointer transition-colors ${
                    inviteRole === role.value
                      ? 'border-primary-600 bg-primary-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="role"
                    value={role.value}
                    checked={inviteRole === role.value}
                    onChange={(e) => setInviteRole(e.target.value as any)}
                    className="mt-1"
                  />
                  <div>
                    <p className="font-medium text-gray-900">{role.label}</p>
                    <p className="text-sm text-gray-500">{role.description}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button variant="outline" onClick={() => setShowInviteModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleInvite}>
              Send Invite
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
