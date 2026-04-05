import React, { useState, useRef } from 'react'
import {
  FileText,
  Plus,
  Search,
  Download,
  Send,
  Eye,
  Edit3,
  Trash2,
  X,
  Check,
  Clock,
  DollarSign,
  Calendar,
  Building,
  Mail,
  ChevronDown,
  Printer,
  Copy
} from 'lucide-react'
import { Button, Card, Input, Badge } from '../../components/ui'

type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'

interface InvoiceItem {
  id: string
  description: string
  quantity: number
  rate: number
}

interface Invoice {
  id: string
  invoiceNumber: string
  clientName: string
  clientEmail: string
  clientAddress: string
  status: InvoiceStatus
  issueDate: string
  dueDate: string
  items: InvoiceItem[]
  notes: string
  tax: number
  createdAt: string
}

const initialInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    clientName: 'TechStart Inc.',
    clientEmail: 'billing@techstart.io',
    clientAddress: '123 Tech Street, San Francisco, CA 94105',
    status: 'paid',
    issueDate: '2024-01-01',
    dueDate: '2024-01-31',
    items: [
      { id: '1', description: 'AI Support - Growth Plan (Monthly)', quantity: 1, rate: 597 },
      { id: '2', description: 'Custom Integration Setup', quantity: 1, rate: 500 },
      { id: '3', description: 'Additional AI Training Hours', quantity: 5, rate: 100 }
    ],
    notes: 'Thank you for your business!',
    tax: 10,
    createdAt: '2024-01-01'
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    clientName: 'CloudScale',
    clientEmail: 'accounts@cloudscale.com',
    clientAddress: '456 Cloud Ave, Seattle, WA 98101',
    status: 'sent',
    issueDate: '2024-01-15',
    dueDate: '2024-02-14',
    items: [
      { id: '1', description: 'AI Support - Pro Plan (Monthly)', quantity: 1, rate: 1297 },
      { id: '2', description: 'Enterprise Onboarding', quantity: 1, rate: 1000 }
    ],
    notes: 'Net 30 payment terms.',
    tax: 10,
    createdAt: '2024-01-15'
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    clientName: 'ShopEasy',
    clientEmail: 'finance@shopeasy.co',
    clientAddress: '789 Commerce Blvd, Austin, TX 78701',
    status: 'overdue',
    issueDate: '2024-01-01',
    dueDate: '2024-01-15',
    items: [
      { id: '1', description: 'AI Support - Starter Plan (Monthly)', quantity: 1, rate: 297 }
    ],
    notes: '',
    tax: 0,
    createdAt: '2024-01-01'
  },
  {
    id: '4',
    invoiceNumber: 'INV-2024-004',
    clientName: 'FinTech Solutions',
    clientEmail: 'ap@fintech.io',
    clientAddress: '321 Finance Way, New York, NY 10001',
    status: 'draft',
    issueDate: '2024-01-20',
    dueDate: '2024-02-19',
    items: [
      { id: '1', description: 'AI Support - Growth Plan (Annual)', quantity: 1, rate: 5970 },
      { id: '2', description: 'Priority Support Add-on', quantity: 12, rate: 99 }
    ],
    notes: 'Annual subscription with 2 months free.',
    tax: 10,
    createdAt: '2024-01-20'
  }
]

const statusConfig: Record<InvoiceStatus, { label: string; color: string }> = {
  draft: { label: 'Draft', color: 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300' },
  sent: { label: 'Sent', color: 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400' },
  paid: { label: 'Paid', color: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' },
  overdue: { label: 'Overdue', color: 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' },
  cancelled: { label: 'Cancelled', color: 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400' }
}

export default function InvoicesPage() {
  const [invoices, setInvoices] = useState<Invoice[]>(initialInvoices)
  const [searchQuery, setSearchQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | 'all'>('all')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null)
  const [previewInvoice, setPreviewInvoice] = useState<Invoice | null>(null)

  const filteredInvoices = invoices.filter(invoice => {
    const matchesSearch = 
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      invoice.clientName.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === 'all' || invoice.status === statusFilter
    return matchesSearch && matchesStatus
  })

  const calculateSubtotal = (items: InvoiceItem[]) => 
    items.reduce((sum, item) => sum + (item.quantity * item.rate), 0)

  const calculateTotal = (invoice: Invoice) => {
    const subtotal = calculateSubtotal(invoice.items)
    const taxAmount = (subtotal * invoice.tax) / 100
    return subtotal + taxAmount
  }

  const stats = {
    total: invoices.length,
    draft: invoices.filter(i => i.status === 'draft').length,
    pending: invoices.filter(i => i.status === 'sent').length,
    paid: invoices.filter(i => i.status === 'paid').length,
    overdue: invoices.filter(i => i.status === 'overdue').length,
    totalRevenue: invoices.filter(i => i.status === 'paid').reduce((sum, i) => sum + calculateTotal(i), 0),
    pendingRevenue: invoices.filter(i => ['sent', 'overdue'].includes(i.status)).reduce((sum, i) => sum + calculateTotal(i), 0)
  }

  const handleSaveInvoice = (invoiceData: Partial<Invoice>) => {
    if (editingInvoice) {
      setInvoices(invoices.map(i => i.id === editingInvoice.id ? { ...i, ...invoiceData } : i))
    } else {
      const newInvoice: Invoice = {
        id: Date.now().toString(),
        invoiceNumber: `INV-2024-${String(invoices.length + 1).padStart(3, '0')}`,
        clientName: invoiceData.clientName || '',
        clientEmail: invoiceData.clientEmail || '',
        clientAddress: invoiceData.clientAddress || '',
        status: 'draft',
        issueDate: invoiceData.issueDate || new Date().toISOString().split('T')[0],
        dueDate: invoiceData.dueDate || '',
        items: invoiceData.items || [],
        notes: invoiceData.notes || '',
        tax: invoiceData.tax || 0,
        createdAt: new Date().toISOString().split('T')[0]
      }
      setInvoices([newInvoice, ...invoices])
    }
    setIsModalOpen(false)
    setEditingInvoice(null)
  }

  const handleDeleteInvoice = (id: string) => {
    setInvoices(invoices.filter(i => i.id !== id))
  }

  const handleStatusChange = (id: string, newStatus: InvoiceStatus) => {
    setInvoices(invoices.map(i => i.id === id ? { ...i, status: newStatus } : i))
  }

  const generateNextInvoiceNumber = () => {
    const maxNum = invoices.reduce((max, inv) => {
      const num = parseInt(inv.invoiceNumber.split('-').pop() || '0')
      return num > max ? num : max
    }, 0)
    return `INV-2024-${String(maxNum + 1).padStart(3, '0')}`
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Invoices</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Create and manage client invoices
          </p>
        </div>
        <Button onClick={() => { setEditingInvoice(null); setIsModalOpen(true) }}>
          <Plus className="w-4 h-4 mr-2" />
          Create Invoice
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${stats.totalRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Total Paid</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                ${stats.pendingRevenue.toLocaleString()}
              </p>
              <p className="text-sm text-gray-500">Pending</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.total}</p>
              <p className="text-sm text-gray-500">Total Invoices</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-red-100 dark:bg-red-900/30 rounded-lg flex items-center justify-center">
              <Clock className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.overdue}</p>
              <p className="text-sm text-gray-500">Overdue</p>
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input
            placeholder="Search invoices..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as InvoiceStatus | 'all')}
            className="appearance-none px-4 py-2 pr-10 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="all">All Status</option>
            <option value="draft">Draft</option>
            <option value="sent">Sent</option>
            <option value="paid">Paid</option>
            <option value="overdue">Overdue</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>
      </div>

      {/* Invoices Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Invoice</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No invoices found</p>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map(invoice => (
                  <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-800/50">
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-medium text-gray-900 dark:text-white">{invoice.invoiceNumber}</p>
                        <p className="text-sm text-gray-500">Issued {new Date(invoice.issueDate).toLocaleDateString()}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-900 dark:text-white">{invoice.clientName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${statusConfig[invoice.status].color}`}>
                        {statusConfig[invoice.status].label}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-medium text-gray-900 dark:text-white">
                        ${calculateTotal(invoice).toLocaleString()}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-400" />
                        <span className={`text-sm ${
                          invoice.status !== 'paid' && new Date(invoice.dueDate) < new Date()
                            ? 'text-red-600 font-medium'
                            : 'text-gray-600 dark:text-gray-400'
                        }`}>
                          {new Date(invoice.dueDate).toLocaleDateString()}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button
                          onClick={() => setPreviewInvoice(invoice)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Preview"
                        >
                          <Eye className="w-4 h-4 text-gray-400" />
                        </button>
                        <button
                          onClick={() => {
                            setEditingInvoice(invoice)
                            setIsModalOpen(true)
                          }}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Edit"
                        >
                          <Edit3 className="w-4 h-4 text-gray-400" />
                        </button>
                        {invoice.status === 'draft' && (
                          <button
                            onClick={() => handleStatusChange(invoice.id, 'sent')}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Send"
                          >
                            <Send className="w-4 h-4 text-gray-400" />
                          </button>
                        )}
                        {invoice.status === 'sent' && (
                          <button
                            onClick={() => handleStatusChange(invoice.id, 'paid')}
                            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                            title="Mark as Paid"
                          >
                            <Check className="w-4 h-4 text-gray-400" />
                          </button>
                        )}
                        <button
                          onClick={() => handleDeleteInvoice(invoice.id)}
                          className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
                          title="Delete"
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

      {/* Invoice Preview Modal */}
      {previewInvoice && (
        <InvoicePreview
          invoice={previewInvoice}
          onClose={() => setPreviewInvoice(null)}
          calculateSubtotal={calculateSubtotal}
          calculateTotal={calculateTotal}
        />
      )}

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <InvoiceModal
          invoice={editingInvoice}
          nextInvoiceNumber={generateNextInvoiceNumber()}
          onClose={() => {
            setIsModalOpen(false)
            setEditingInvoice(null)
          }}
          onSave={handleSaveInvoice}
        />
      )}
    </div>
  )
}

// Invoice Preview Component
function InvoicePreview({
  invoice,
  onClose,
  calculateSubtotal,
  calculateTotal
}: {
  invoice: Invoice
  onClose: () => void
  calculateSubtotal: (items: InvoiceItem[]) => number
  calculateTotal: (invoice: Invoice) => number
}) {
  const printRef = useRef<HTMLDivElement>(null)

  const handlePrint = () => {
    const printContent = printRef.current
    if (!printContent) return

    const printWindow = window.open('', '_blank')
    if (!printWindow) return

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoice.invoiceNumber}</title>
          <style>
            body { font-family: system-ui, -apple-system, sans-serif; padding: 40px; max-width: 800px; margin: 0 auto; }
            .header { display: flex; justify-content: space-between; margin-bottom: 40px; }
            .logo { font-size: 24px; font-weight: bold; color: #4f46e5; }
            .invoice-info { text-align: right; }
            .invoice-number { font-size: 20px; font-weight: bold; }
            .client-section { margin-bottom: 30px; }
            .label { color: #6b7280; font-size: 12px; text-transform: uppercase; margin-bottom: 4px; }
            table { width: 100%; border-collapse: collapse; margin: 30px 0; }
            th { background: #f3f4f6; padding: 12px; text-align: left; font-size: 12px; text-transform: uppercase; }
            td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
            .totals { margin-left: auto; width: 300px; }
            .totals-row { display: flex; justify-content: space-between; padding: 8px 0; }
            .totals-row.total { font-size: 18px; font-weight: bold; border-top: 2px solid #111; padding-top: 12px; }
            .notes { margin-top: 40px; padding: 20px; background: #f9fafb; border-radius: 8px; }
            .footer { margin-top: 60px; text-align: center; color: #6b7280; font-size: 14px; }
            @media print { body { padding: 20px; } }
          </style>
        </head>
        <body>
          ${printContent.innerHTML}
        </body>
      </html>
    `)
    printWindow.document.close()
    printWindow.print()
  }

  const subtotal = calculateSubtotal(invoice.items)
  const taxAmount = (subtotal * invoice.tax) / 100
  const total = calculateTotal(invoice)

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Invoice Preview</h2>
          <div className="flex items-center gap-2">
            <Button variant="secondary" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print / PDF
            </Button>
            <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div ref={printRef} className="p-8">
          {/* Header */}
          <div className="flex justify-between items-start mb-10">
            <div>
              <div className="text-2xl font-bold text-indigo-600">AI Support</div>
              <p className="text-gray-500 mt-1">AI-Powered Customer Support</p>
              <p className="text-gray-500">123 AI Street, Tech City, TC 12345</p>
              <p className="text-gray-500">billing@aisupport.com</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-gray-900 dark:text-white">INVOICE</div>
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">{invoice.invoiceNumber}</p>
              <p className="text-gray-500 mt-2">Issue Date: {new Date(invoice.issueDate).toLocaleDateString()}</p>
              <p className="text-gray-500">Due Date: {new Date(invoice.dueDate).toLocaleDateString()}</p>
            </div>
          </div>

          {/* Bill To */}
          <div className="mb-8">
            <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Bill To</p>
            <p className="font-semibold text-gray-900 dark:text-white">{invoice.clientName}</p>
            <p className="text-gray-600 dark:text-gray-400">{invoice.clientEmail}</p>
            <p className="text-gray-600 dark:text-gray-400">{invoice.clientAddress}</p>
          </div>

          {/* Items Table */}
          <table className="w-full mb-8">
            <thead>
              <tr className="bg-gray-100 dark:bg-gray-700">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Description</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Qty</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Rate</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase">Amount</th>
              </tr>
            </thead>
            <tbody>
              {invoice.items.map(item => (
                <tr key={item.id} className="border-b border-gray-200 dark:border-gray-700">
                  <td className="px-4 py-4 text-gray-900 dark:text-white">{item.description}</td>
                  <td className="px-4 py-4 text-right text-gray-600 dark:text-gray-400">{item.quantity}</td>
                  <td className="px-4 py-4 text-right text-gray-600 dark:text-gray-400">${item.rate.toLocaleString()}</td>
                  <td className="px-4 py-4 text-right font-medium text-gray-900 dark:text-white">
                    ${(item.quantity * item.rate).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totals */}
          <div className="flex justify-end">
            <div className="w-64">
              <div className="flex justify-between py-2">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="text-gray-900 dark:text-white">${subtotal.toLocaleString()}</span>
              </div>
              {invoice.tax > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-gray-600 dark:text-gray-400">Tax ({invoice.tax}%)</span>
                  <span className="text-gray-900 dark:text-white">${taxAmount.toLocaleString()}</span>
                </div>
              )}
              <div className="flex justify-between py-3 border-t-2 border-gray-900 dark:border-white mt-2">
                <span className="text-lg font-bold text-gray-900 dark:text-white">Total</span>
                <span className="text-lg font-bold text-gray-900 dark:text-white">${total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          {invoice.notes && (
            <div className="mt-8 p-4 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
              <p className="text-xs text-gray-500 uppercase tracking-wider mb-2">Notes</p>
              <p className="text-gray-700 dark:text-gray-300">{invoice.notes}</p>
            </div>
          )}

          {/* Footer */}
          <div className="mt-12 text-center text-gray-500 text-sm">
            <p>Thank you for your business!</p>
            <p className="mt-1">Payment is due within 30 days. Please include invoice number with payment.</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Invoice Modal Component
function InvoiceModal({
  invoice,
  nextInvoiceNumber,
  onClose,
  onSave
}: {
  invoice: Invoice | null
  nextInvoiceNumber: string
  onClose: () => void
  onSave: (data: Partial<Invoice>) => void
}) {
  const [formData, setFormData] = useState<Partial<Invoice>>(invoice || {
    invoiceNumber: nextInvoiceNumber,
    clientName: '',
    clientEmail: '',
    clientAddress: '',
    issueDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    items: [{ id: '1', description: '', quantity: 1, rate: 0 }],
    notes: '',
    tax: 0
  })

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...(formData.items || []), { id: Date.now().toString(), description: '', quantity: 1, rate: 0 }]
    })
  }

  const removeItem = (id: string) => {
    setFormData({
      ...formData,
      items: (formData.items || []).filter(item => item.id !== id)
    })
  }

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    setFormData({
      ...formData,
      items: (formData.items || []).map(item =>
        item.id === id ? { ...item, [field]: value } : item
      )
    })
  }

  const subtotal = (formData.items || []).reduce((sum, item) => sum + (item.quantity * item.rate), 0)
  const taxAmount = (subtotal * (formData.tax || 0)) / 100
  const total = subtotal + taxAmount

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            {invoice ? 'Edit Invoice' : 'Create Invoice'}
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6">
          {/* Invoice Number & Dates */}
          <div className="grid grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Invoice #</label>
              <Input
                value={formData.invoiceNumber}
                onChange={(e) => setFormData({ ...formData, invoiceNumber: e.target.value })}
                disabled={!!invoice}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Issue Date</label>
              <Input
                type="date"
                value={formData.issueDate}
                onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
              <Input
                type="date"
                value={formData.dueDate}
                onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              />
            </div>
          </div>

          {/* Client Info */}
          <div className="space-y-4">
            <h3 className="font-medium text-gray-900 dark:text-white">Client Information</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Name</label>
                <Input
                  value={formData.clientName}
                  onChange={(e) => setFormData({ ...formData, clientName: e.target.value })}
                  placeholder="Company Name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Email</label>
                <Input
                  type="email"
                  value={formData.clientEmail}
                  onChange={(e) => setFormData({ ...formData, clientEmail: e.target.value })}
                  placeholder="billing@company.com"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Address</label>
              <Input
                value={formData.clientAddress}
                onChange={(e) => setFormData({ ...formData, clientAddress: e.target.value })}
                placeholder="123 Street, City, State ZIP"
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-medium text-gray-900 dark:text-white">Line Items</h3>
              <Button variant="secondary" size="sm" onClick={addItem}>
                <Plus className="w-4 h-4 mr-1" />
                Add Item
              </Button>
            </div>
            <div className="space-y-3">
              {(formData.items || []).map((item, index) => (
                <div key={item.id} className="flex gap-3 items-start">
                  <div className="flex-1">
                    <Input
                      value={item.description}
                      onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                      placeholder="Description"
                    />
                  </div>
                  <div className="w-20">
                    <Input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => updateItem(item.id, 'quantity', parseInt(e.target.value) || 0)}
                      placeholder="Qty"
                    />
                  </div>
                  <div className="w-28">
                    <Input
                      type="number"
                      value={item.rate}
                      onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                      placeholder="Rate"
                    />
                  </div>
                  <div className="w-28 py-2 text-right font-medium text-gray-900 dark:text-white">
                    ${(item.quantity * item.rate).toLocaleString()}
                  </div>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg"
                    disabled={(formData.items || []).length === 1}
                  >
                    <Trash2 className="w-4 h-4 text-gray-400" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Tax & Totals */}
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Subtotal</span>
                <span className="font-medium text-gray-900 dark:text-white">${subtotal.toLocaleString()}</span>
              </div>
              <div className="flex items-center justify-between gap-4">
                <span className="text-gray-600 dark:text-gray-400">Tax (%)</span>
                <Input
                  type="number"
                  value={formData.tax}
                  onChange={(e) => setFormData({ ...formData, tax: parseFloat(e.target.value) || 0 })}
                  className="w-20 text-right"
                />
              </div>
              <div className="flex justify-between pt-2 border-t border-gray-200 dark:border-gray-700">
                <span className="font-bold text-gray-900 dark:text-white">Total</span>
                <span className="font-bold text-gray-900 dark:text-white">${total.toLocaleString()}</span>
              </div>
            </div>
          </div>

          {/* Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              placeholder="Payment terms, thank you message, etc."
              rows={3}
              className="w-full px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 resize-none"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <Button variant="secondary" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={() => onSave(formData)}>
            {invoice ? 'Save Changes' : 'Create Invoice'}
          </Button>
        </div>
      </div>
    </div>
  )
}
