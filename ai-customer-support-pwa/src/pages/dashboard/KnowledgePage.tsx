import React, { useState } from 'react'
import {
  Upload,
  FileText,
  Link as LinkIcon,
  Trash2,
  RefreshCw,
  CheckCircle,
  Clock,
  AlertCircle,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Globe,
  File,
  MessageSquare
} from 'lucide-react'
import { Card, CardHeader, CardTitle, CardContent, Button, Badge, Input, Modal } from '../../components/ui'

interface KnowledgeItem {
  id: string
  name: string
  type: 'file' | 'url' | 'text' | 'faq'
  status: 'processing' | 'ready' | 'error'
  size?: string
  url?: string
  createdAt: Date
  lastUpdated: Date
}

const mockKnowledge: KnowledgeItem[] = [
  {
    id: '1',
    name: 'Product Documentation.pdf',
    type: 'file',
    status: 'ready',
    size: '2.4 MB',
    createdAt: new Date(Date.now() - 7 * 24 * 60 * 60000),
    lastUpdated: new Date(Date.now() - 2 * 24 * 60 * 60000),
  },
  {
    id: '2',
    name: 'FAQ Page',
    type: 'url',
    status: 'ready',
    url: 'https://example.com/faq',
    createdAt: new Date(Date.now() - 14 * 24 * 60 * 60000),
    lastUpdated: new Date(Date.now() - 1 * 24 * 60 * 60000),
  },
  {
    id: '3',
    name: 'Return Policy.docx',
    type: 'file',
    status: 'ready',
    size: '156 KB',
    createdAt: new Date(Date.now() - 5 * 24 * 60 * 60000),
    lastUpdated: new Date(Date.now() - 5 * 24 * 60 * 60000),
  },
  {
    id: '4',
    name: 'Shipping Information',
    type: 'text',
    status: 'processing',
    createdAt: new Date(Date.now() - 60000),
    lastUpdated: new Date(Date.now() - 60000),
  },
  {
    id: '5',
    name: 'Help Center',
    type: 'url',
    status: 'error',
    url: 'https://example.com/help',
    createdAt: new Date(Date.now() - 3 * 24 * 60 * 60000),
    lastUpdated: new Date(Date.now() - 3 * 24 * 60 * 60000),
  },
]

const faqItems = [
  { question: 'What is your return policy?', answer: 'We offer a 30-day return policy for all unused items.' },
  { question: 'How long does shipping take?', answer: 'Standard shipping takes 5-7 business days.' },
  { question: 'Do you ship internationally?', answer: 'Yes, we ship to over 50 countries worldwide.' },
]

export default function KnowledgePage() {
  const [knowledge, setKnowledge] = useState(mockKnowledge)
  const [showUploadModal, setShowUploadModal] = useState(false)
  const [showUrlModal, setShowUrlModal] = useState(false)
  const [showFaqModal, setShowFaqModal] = useState(false)
  const [uploadType, setUploadType] = useState<'file' | 'url' | 'text' | 'faq'>('file')
  const [searchQuery, setSearchQuery] = useState('')
  const [urlInput, setUrlInput] = useState('')
  const [textInput, setTextInput] = useState('')
  const [textTitle, setTextTitle] = useState('')
  const [newFaq, setNewFaq] = useState({ question: '', answer: '' })

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || [])
    files.forEach(file => {
      const newItem: KnowledgeItem = {
        id: Date.now().toString(),
        name: file.name,
        type: 'file',
        status: 'processing',
        size: `${(file.size / 1024).toFixed(1)} KB`,
        createdAt: new Date(),
        lastUpdated: new Date(),
      }
      setKnowledge(prev => [newItem, ...prev])
    })
    setShowUploadModal(false)
  }

  const handleUrlSubmit = () => {
    if (!urlInput.trim()) return
    const newItem: KnowledgeItem = {
      id: Date.now().toString(),
      name: new URL(urlInput).hostname,
      type: 'url',
      status: 'processing',
      url: urlInput,
      createdAt: new Date(),
      lastUpdated: new Date(),
    }
    setKnowledge(prev => [newItem, ...prev])
    setUrlInput('')
    setShowUrlModal(false)
  }

  const handleDelete = (id: string) => {
    setKnowledge(prev => prev.filter(item => item.id !== id))
  }

  const handleRetrain = (id: string) => {
    setKnowledge(prev => prev.map(item =>
      item.id === id ? { ...item, status: 'processing' as const } : item
    ))
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'file': return <FileText className="w-5 h-5 text-blue-500" />
      case 'url': return <Globe className="w-5 h-5 text-green-500" />
      case 'text': return <File className="w-5 h-5 text-purple-500" />
      case 'faq': return <MessageSquare className="w-5 h-5 text-orange-500" />
      default: return <FileText className="w-5 h-5 text-gray-500" />
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ready':
        return <Badge variant="success" size="sm"><CheckCircle className="w-3 h-3 mr-1" /> Ready</Badge>
      case 'processing':
        return <Badge variant="info" size="sm"><Clock className="w-3 h-3 mr-1 animate-spin" /> Processing</Badge>
      case 'error':
        return <Badge variant="danger" size="sm"><AlertCircle className="w-3 h-3 mr-1" /> Error</Badge>
      default:
        return null
    }
  }

  const filteredKnowledge = knowledge.filter(item =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const stats = {
    total: knowledge.length,
    ready: knowledge.filter(k => k.status === 'ready').length,
    processing: knowledge.filter(k => k.status === 'processing').length,
    error: knowledge.filter(k => k.status === 'error').length,
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Knowledge Base</h1>
          <p className="text-gray-500 mt-1">Train your AI with documents, URLs, and FAQs</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={() => setShowUrlModal(true)}>
            <LinkIcon className="w-4 h-4 mr-2" />
            Add URL
          </Button>
          <Button onClick={() => setShowUploadModal(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Upload Files
          </Button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-gray-500">Total Sources</p>
            <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-gray-500">Ready</p>
            <p className="text-2xl font-bold text-green-600">{stats.ready}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-gray-500">Processing</p>
            <p className="text-2xl font-bold text-blue-600">{stats.processing}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="py-4">
            <p className="text-sm text-gray-500">Errors</p>
            <p className="text-2xl font-bold text-red-600">{stats.error}</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filter */}
      <div className="flex gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search knowledge base..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
        </div>
        <Button variant="outline">
          <Filter className="w-4 h-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Knowledge List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y divide-gray-100">
            {filteredKnowledge.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-4 hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getTypeIcon(item.type)}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{item.name}</p>
                    <div className="flex items-center gap-3 mt-1">
                      {item.size && <span className="text-xs text-gray-400">{item.size}</span>}
                      {item.url && (
                        <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary-600 hover:underline">
                          {item.url}
                        </a>
                      )}
                      <span className="text-xs text-gray-400">
                        Updated {item.lastUpdated.toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-4">
                  {getStatusBadge(item.status)}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleRetrain(item.id)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      title="Retrain"
                    >
                      <RefreshCw className="w-4 h-4 text-gray-400" />
                    </button>
                    <button
                      onClick={() => handleDelete(item.id)}
                      className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4 text-red-400" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* FAQ Section */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>FAQ Training</CardTitle>
          <Button variant="outline" size="sm" onClick={() => setShowFaqModal(true)}>
            <Plus className="w-4 h-4 mr-1" />
            Add FAQ
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {faqItems.map((faq, index) => (
              <div key={index} className="p-4 bg-gray-50 rounded-lg">
                <p className="font-medium text-gray-900 mb-2">Q: {faq.question}</p>
                <p className="text-gray-600 text-sm">A: {faq.answer}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Upload Modal */}
      <Modal
        isOpen={showUploadModal}
        onClose={() => setShowUploadModal(false)}
        title="Upload Knowledge"
      >
        <div className="space-y-4">
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-primary-500 transition-colors cursor-pointer"
            onClick={() => document.getElementById('file-input')?.click()}
          >
            <input
              id="file-input"
              type="file"
              multiple
              accept=".pdf,.doc,.docx,.txt,.csv"
              className="hidden"
              onChange={handleFileUpload}
            />
            <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">Drag and drop files here, or click to browse</p>
            <p className="text-sm text-gray-400">Supports PDF, DOC, DOCX, TXT, CSV (max 10MB each)</p>
          </div>
        </div>
      </Modal>

      {/* URL Modal */}
      <Modal
        isOpen={showUrlModal}
        onClose={() => setShowUrlModal(false)}
        title="Add Website URL"
      >
        <div className="space-y-4">
          <Input
            label="Website URL"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/docs"
            leftIcon={<Globe className="w-5 h-5" />}
          />
          <p className="text-sm text-gray-500">
            We'll crawl this URL and extract content to train your AI.
          </p>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowUrlModal(false)}>
              Cancel
            </Button>
            <Button onClick={handleUrlSubmit}>
              Add URL
            </Button>
          </div>
        </div>
      </Modal>

      {/* FAQ Modal */}
      <Modal
        isOpen={showFaqModal}
        onClose={() => setShowFaqModal(false)}
        title="Add FAQ"
      >
        <div className="space-y-4">
          <Input
            label="Question"
            value={newFaq.question}
            onChange={(e) => setNewFaq(prev => ({ ...prev, question: e.target.value }))}
            placeholder="What is your return policy?"
          />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Answer</label>
            <textarea
              value={newFaq.answer}
              onChange={(e) => setNewFaq(prev => ({ ...prev, answer: e.target.value }))}
              placeholder="We offer a 30-day return policy..."
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
              rows={4}
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button variant="outline" onClick={() => setShowFaqModal(false)}>
              Cancel
            </Button>
            <Button onClick={() => setShowFaqModal(false)}>
              Add FAQ
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
