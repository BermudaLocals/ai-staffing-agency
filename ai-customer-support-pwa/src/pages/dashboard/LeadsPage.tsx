import React, { useState } from 'react'
import {
  Users,
  Plus,
  Search,
  Filter,
  ChevronDown,
  MoreVertical,
  Mail,
  Phone,
  Building,
  Calendar,
  Edit3,
  Trash2,
  X,
  Check,
  Clock,
  DollarSign,
  TrendingUp,
  UserCheck,
  UserX,
  MessageSquare,
  ExternalLink
} from 'lucide-react'
import { Button, Card, Input, Badge, Modal } from '../../components/ui'

type LeadStatus = 'new' | 'contacted' | 'demo' | 'proposal' | 'won' | 'lost'

interface Lead {
  id: string
  name: string
  email: string
  phone: string
  company: string
  website: string
  status: LeadStatus
  value: number
  source: string
  notes: string
  followUpDate: string | null
  createdAt: string
  lastContactedAt: string | null
}

const initialLeads: Lead[] = [
  {
    id: '1',
    name: 'Sarah Johnson',
    email: 'sarah@techstart.io',
    phone: '+1 (555) 123-4567',
    company: 'TechStart Inc.',
    website: 'https://techstart.io',
    status: 'demo',
    value: 5970,
    source: 'LinkedIn',
    notes: 'Very interested in the Growth plan. Has 5 support agents currently.',
    followUpDate: '2024-01-28',
    createdAt: '2024-01-15',
    lastContactedAt: '2024-01-22'
  },
  {
    id: '2',
    name: 'Michael Chen',
    email: 'mchen@cloudscale.com',
    phone: '+1 (555) 234-5678',
    company: 'CloudScale',
    website: 'https://cloudscale.com',
    status: 'proposal',
    value: 12970,
    source: 'Referral',
    notes: 'Enterprise client. Needs custom integrations with Salesforce.',
    followUpDate: '2024-01-25',
    createdAt: '2024-01-10',
    lastContactedAt: '2024-01-23'
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    email: 'emily@shopeasy.co',
    phone: '+1 (555) 345-6789',
    company: 'ShopEasy',
    website: 'https://shopeasy.co',
    status: 'won',
    value: 2970,
    source: 'Cold Email',
    notes: 'Started with Starter plan. Potential to upgrade in 3 months.',
    followUpDate: null,
    createdAt: '2024-01-05',
    lastContactedAt: '2024-01-20'
  },
  {
    id: '4',
    name: 'David Kim',
    email: 'david@fintech.io',
    phone: '+1 (555) 456-7890',
    company: 'FinTech Solutions',
    website: 'https://fintech.io',
    status: 'contacted',
    value: 5970,
    source: 'Website',
    notes: 'Downloaded whitepaper. Interested in security features.',
    followUpDate: '2024-01-26',
    createdAt: '2024-01-18',
    lastContactedAt: '2024-01-21'
  },
  {
    id: '5',
    name: 'Lisa Wang',
    email: 'lisa@healthapp.com',
    phone: '+1 (555) 567-8901',
    company: 'HealthApp',
    website: 'https://healthapp.com',
    status: 'new',
    value: 2970,
    source: 'LinkedIn',
    notes: 'New lead from LinkedIn outreach.',
    followUpDate: '2024-01-24',
    createdAt: '2024-01-22',
    lastContactedAt: null
  },
  {
    id: '6',
    name: 'James Wilson',
    email: 'james@retailpro.com',
    phone: '+1 (555) 678-9012',
    company: 'RetailPro',
    website: 'https://retailpro.com',
    status: 'lost',
    value: 5970,
    source: 'Cold Call',
    notes: 'Went with competitor. Budget constraints.',
    followUpDate: null,
    createdAt: '2024-01-08',
    lastContactedAt: '2024-01-19'
  }
]

const statusConfig: Record<LeadStatus, { label: string; color: string; icon: React.ReactNode }> = {
  new: { label: 'New', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400', icon: <Users className="w-4 h-4" /> },
  contacted: { label: 'Contacted', color: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400', icon: <MessageSquare className="w-4 h-4" /> },
  demo: { label: 'Demo', color: 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400', icon: <Calendar className="w-4 h-4" /> },
  proposal: { label: 'Proposal', color: 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400', icon: <DollarSign className="w-4 h-4" /> },
  won: { label: 'Won', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400', icon: <UserCheck className="w-4 h-4" /> },
  lost: { label: 'Lost', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400', icon: <UserX className="w-4 h-4" /> }
}

const statusOrder: LeadStatus[] = ['new', 'contacted', 'demo', 'proposal', 'won', 'lost']

export default function LeadsPage() {
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<LeadStatus | 'all'>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingLead, setEditingLead] = useState<Lead | null>(null)
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null)
  const [sortBy, setSortBy] = useState<'name' | 'value' | 'createdAt'>('createdAt')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  const filteredLeads = leads
    .filter(lead => {
      const matchesSearch = 
        lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lead.email.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesStatus = statusFilter === 'all' || lead.status === statusFilter
      return matchesSearch && matchesStatus
    })
    .sort((a, b) => {
      let comparison = 0
      if (sortBy === 'name') comparison = a.name.localeCompare(b.name)
      else if (sortBy === 'value') comparison = a.value - b.value
      else comparison = new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      return sortOrder === 'asc' ? comparison : -comparison
    })

  const stats = {
    total: leads.length,
    new: leads.filter(l => l.status === 'new').length,
    pipeline: leads.filter(l => ['contacted', 'demo', 'proposal'].includes(l.status)).length,
    won: leads.filter(l => l.status === 'won').length,
    totalValue: leads.filter(l => l.status !== 'lost').reduce((sum, l) => sum + l.value, 0),
    wonValue: leads.filter(l => l.status === 'won').reduce((sum, l) => sum + l.value, 0)
  }

  const handleSaveLead = (leadData: Partial<Lead>) => {
    if (editingLead) {
      setLeads(leads.map(l => l.id === editingLead.id ? { ...l, ...leadData } : l))
    } else {
      const newLead: Lead = {
        id: Date.now().toString(),
        name: leadData.name || '',
        email: leadData.email || '',
        phone: leadData.phone || '',
        company: leadData.company || '',
        website: leadData.website || '',
        status: leadData.status || 'new',
        value: leadData.value || 0,
        source: leadData.source || '',
        notes: leadData.notes || '',
        followUpDate: leadData.followUpDate || null,
        createdAt: new Date().toISOString().split('T')[0],
        lastContactedAt: null
      }
      setLeads([newLead, ...leads])
    }
    setIsModalOpen(false)
    setEditingLead(null)
  }

  const handleDeleteLead = (id: string) => {
    setLeads(leads.filter(l => l.id !== id))
    if (selectedLead?.id === id) setSelectedLead(null)
  }

  const handleStatusChange = (id: string, newStatus: LeadStatus) => {
    setLeads(leads.map(l => 
      l.id === id 
        ? { ...l, status: newStatus, lastContactedAt: new Date().toISOString().split('T')[0] } 
        : l
    ))
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Leads & CRM</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track and manage your sales pipeline
          </p>
        </div>
        <Button onClick={() => { setEditingLead(null); setIsModalOpen(true) }}>
          <Plus className="w-4 h-4 mr-2" />
          Add Lead
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-sm text-gray-500">Total Leads</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pipeline}</p>
              <p className="text-sm text-gray-500">In Pipeline</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.won}</p>
              <p className="text-sm text-gray-500">Won</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-orange-100 dark:bg-orange-900/30 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${stats.totalValue.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Pipeline Value</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search leads..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <div className="relative">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as LeadStatus | 'all')}
              className="appearance-none px-4 py-2 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All Status</option>
              {statusOrder.map(status => (
                <option key={status} value={status}>{statusConfig[status].label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
          <div className="relative">
            <select
              value={`${sortBy}-${sortOrder}`}
              onChange={(e) => {
                const [by, order] = e.target.value.split('-')
                setSortBy(by as 'name' | 'value' | 'createdAt')
                setSortOrder(order as 'asc' | 'desc')
              }}
              className="appearance-none px-4 py-2 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="createdAt-desc">Newest First</option>
              <option value="createdAt-asc">Oldest First</option>
              <option value="value-desc">Highest Value</option>
              <option value="value-asc">Lowest Value</option>
              <option value="name-asc">Name A-Z</option>
              <option value="name-desc">Name Z-A</option>
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Leads Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Lead</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Company</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Value</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Follow-up</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredLeads.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No leads found</p>
                  </td>
                </tr>
              ) : (
                filteredLeads.map(lead => (
                  <tr 
                    key={lead.id} 
                    className="hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer"
                    onClick={() => setSelectedLead(lead)}
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white font-medium">
                          {lead.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{lead.name}</p>
                          <p className="text-sm text-gray-500">{lead.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">{lead.company}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <select
                        value={lead.status}
                        onChange={(e) => {
                          e.stopPropagation()
                          handleStatusChange(lead.id, e.target.value as LeadStatus)
                        }}
                        onClick={(e) => e.stopPropagation()}
                        className={`px-3 py-1 rounded-full text-sm font-medium border-0 cursor-pointer ${statusConfig[lead.status].color}`}
                      >
                        {statusOrder.map(status => (
                          <option key={status} value={status}>{statusConfig[status].label}</option>
                        ))}
                      </select>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900 dark:text-white">
                        ${lead.value.toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      {lead.followUpDate ? (
                        <div className="flex items-center gap-2">
                          <Clock className="w-4 h-4 text-gray-400" />
                          <span className={`text-sm ${
                            new Date(lead.followUpDate) < new Date() 
                              ? 'text-red-600 font-medium' 
                              : 'text-gray-600 dark:text-gray-400'
                          }`}>
                            {new Date(lead.followUpDate).toLocaleDateString()}
                          </span>
                        </div>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            setEditingLead(lead)
                            setIsModalOpen(true)
                          }}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Edit3 className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteLead(lead.id)
                          }}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Lead Detail Sidebar */}
      {selectedLead && (
        <LeadDetailSidebar
          lead={selectedLead}
          onClose={() => setSelectedLead(null)}
          onEdit={() => {
            setEditingLead(selectedLead)
            setIsModalOpen(true)
          }}
          onStatusChange={(status) => handleStatusChange(selectedLead.id, status)}
        />
      )}

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <LeadModal
          lead={editingLead}
          onClose={() => {
            setIsModalOpen(false)
            setEditingLead(null)
          }}
          onSave={handleSaveLead}
        />
      )}
    </div>
  )
}

// Lead Detail Sidebar
function LeadDetailSidebar({
  lead,
  onClose,
  onEdit,
  onStatusChange
}: {
  lead: Lead
  onClose: () => void
  onEdit: () => void
  onStatusChange: (status: LeadStatus) => void
}) {
  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-white dark:bg-gray-800 shadow-xl z-50 overflow-y-auto">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Lead Details</h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Lead Header */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xl font-medium">
            {lead.name.split(' ').map(n => n[0]).join('')}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{lead.name}</h3>
            <p className="text-gray-500">{lead.company}</p>
          </div>
        </div>

        {/* Status */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Status</label>
          <div className="flex flex-wrap gap-2">
            {statusOrder.map(status => (
              <button
                key={status}
                onClick={() => onStatusChange(status)}
                className={`px-3 py-1.5 rounded-full text-sm font-medium transition-all ${
                  lead.status === status
                    ? statusConfig[status].color + ' ring-2 ring-offset-2 ring-primary-500'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-gray-600'
                }`}
              >
                {statusConfig[status].label}
              </button>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="space-y-4 mb-6">
          <div className="flex items-center gap-3">
            <Mail className="w-5 h-5 text-gray-400" />
            <a href={`mailto:${lead.email}`} className="text-primary-600 hover:underline">{lead.email}</a>
          </div>
          <div className="flex items-center gap-3">
            <Phone className="w-5 h-5 text-gray-400" />
            <a href={`tel:${lead.phone}`} className="text-gray-900 dark:text-white">{lead.phone}</a>
          </div>
          <div className="flex items-center gap-3">
            <Building className="w-5 h-5 text-gray-400" />
            <span className="text-gray-900 dark:text-white">{lead.company}</span>
          </div>
          {lead.website && (
            <div className="flex items-center gap-3">
              <ExternalLink className="w-5 h-5 text-gray-400" />
              <a href={lead.website} target="_blank" rel="noopener noreferrer" className="text-primary-600 hover:underline">
                {lead.website}
              </a>
            </div>
          )}
        </div>

        {/* Value & Source */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Deal Value</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">${lead.value.toLocaleString()}</p>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <p className="text-sm text-gray-500 mb-1">Source</p>
            <p className="text-xl font-bold text-gray-900 dark:text-white">{lead.source}</p>
          </div>
        </div>

        {/* Follow-up Date */}
        {lead.followUpDate && (
          <div className="bg-yellow-50 dark:bg-yellow-900/20 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-2 text-yellow-700 dark:text-yellow-400">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">Follow-up: {new Date(lead.followUpDate).toLocaleDateString()}</span>
            </div>
          </div>
        )}

        {/* Notes */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Notes</label>
          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4">
            <p className="text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{lead.notes || 'No notes yet.'}</p>
          </div>
        </div>

        {/* Timeline */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Timeline</label>
          <div className="space-y-3">
            <div className="flex items-center gap-3 text-sm">
              <div className="w-2 h-2 bg-green-500 rounded-full" />
              <span className="text-gray-500">Created:</span>
              <span className="text-gray-900 dark:text-white">{new Date(lead.createdAt).toLocaleDateString()}</span>
            </div>
            {lead.lastContactedAt && (
              <div className="flex items-center gap-3 text-sm">
                <div className="w-2 h-2 bg-blue-500 rounded-full" />
                <span className="text-gray-500">Last Contact:</span>
                <span className="text-gray-900 dark:text-white">{new Date(lead.lastContactedAt).toLocaleDateString()}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <Button onClick={onEdit} className="flex-1">
            <Edit3 className="w-4 h-4 mr-2" />
            Edit Lead
          </Button>
          <Button variant="secondary" onClick={() => window.location.href = `mailto:${lead.email}`}>
            <Mail className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// Lead Modal
function LeadModal({
  lead,
  onClose,
  onSave
}: {
  lead: Lead | null
  onClose: () => void
  onSave: (data: Partial<Lead>) => void
}) {
  const [formData, setFormData] = useState<Partial<Lead>>(lead || {
    name: '',
    email: '',
    phone: '',
    company: '',
    website: '',
    status: 'new',
    value: 2970,
    source: '',
    notes: '',
    followUpDate: ''
  })

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {lead ? 'Edit Lead' : 'Add New Lead'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Name *</label>
              <Input
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="John Doe"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company *</label>
              <Input
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder="Acme Inc."
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Email *</label>
            <Input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              placeholder="john@acme.com"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Phone</label>
              <Input
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                placeholder="+1 (555) 123-4567"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Website</label>
              <Input
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://acme.com"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
              <select
                value={formData.status}
                onChange={(e) => setFormData({ ...formData, status: e.target.value as LeadStatus })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                {statusOrder.map(status => (
                  <option key={status} value={status}>{statusConfig[status].label}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Deal Value ($)</label>
              <Input
                type="number"
                value={formData.value}
                onChange={(e) => setFormData({ ...formData, value: parseInt(e.target.value) || 0 })}
                placeholder="2970"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Source</label>
              <select
                value={formData.source}
                onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              >
                <option value="">Select source...</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Cold Email">Cold Email</option>
                <option value="Cold Call">Cold Call</option>
                <option value="Website">Website</option>
                <option value="Referral">Referral</option>
                <option value="Conference">Conference</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Follow-up Date</label>
              <Input
                type="date"
                value={formData.followUpDate || ''}
                onChange={(e) => setFormData({ ...formData, followUpDate: e.target.value })}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Add notes about this lead..."
              rows={4}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(formData)}>
            {lead ? 'Save Changes' : 'Add Lead'}
          </Button>
        </div>
      </div>
    </div>
  )
}
