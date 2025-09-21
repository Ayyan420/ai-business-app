import React, { useState, useEffect } from 'react';
import { FileText, Plus, Download, Send, Eye, Edit, Trash2, Calendar, DollarSign, User, Building, Upload, Image as ImageIcon } from 'lucide-react';
import { database } from '../lib/database';
import { CurrencyManager } from '../lib/currency';
import { TierManager } from '../lib/tiers';
import jsPDF from 'jspdf';

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  client_email: string;
  client_address?: string;
  amount: number;
  status: string;
  due_date: string;
  items: InvoiceItem[];
  company_info: {
    name?: string;
    address?: string;
    email?: string;
    phone?: string;
    logo?: string;
  };
  notes?: string;
  terms?: string;
  tax_rate?: number;
  tax_amount?: number;
  payment_info: {
    method?: string;
    details?: string;
  };
  created_at: string;
  updated_at: string;
}

export default function InvoiceGenerator() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState<Invoice | null>(null);
  const [viewingInvoice, setViewingInvoice] = useState<Invoice | null>(null);
  const [loading, setLoading] = useState(true);

  const [newInvoice, setNewInvoice] = useState({
    client_name: '',
    client_email: '',
    client_address: '',
    due_date: '',
    items: [{ description: '', quantity: 1, rate: 0, amount: 0 }] as InvoiceItem[],
    company_info: {
      name: '',
      address: '',
      email: '',
      phone: '',
      logo: ''
    },
    notes: '',
    terms: 'Payment due within 30 days',
    tax_rate: 0,
    payment_info: {
      method: '',
      details: ''
    }
  });

  useEffect(() => {
    loadInvoices();
    loadCompanyDefaults();
  }, []);

  const loadCompanyDefaults = () => {
    const savedCompany = localStorage.getItem('companyInfo');
    if (savedCompany) {
      const companyInfo = JSON.parse(savedCompany);
      setNewInvoice(prev => ({
        ...prev,
        company_info: companyInfo
      }));
    }
  };

  const saveCompanyDefaults = () => {
    localStorage.setItem('companyInfo', JSON.stringify(newInvoice.company_info));
  };

  const loadInvoices = async () => {
    try {
      setLoading(true);
      const { data, error } = await database.getInvoices();
      if (!error && data) {
        setInvoices(data);
      }
    } catch (error) {
      console.error('Error loading invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateInvoiceNumber = () => {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `INV-${year}${month}-${random}`;
  };

  const calculateItemAmount = (quantity: number, rate: number) => {
    return quantity * rate;
  };

  const calculateSubtotal = (items: InvoiceItem[]) => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTaxAmount = (subtotal: number, taxRate: number) => {
    return (subtotal * taxRate) / 100;
  };

  const calculateTotal = (subtotal: number, taxAmount: number) => {
    return subtotal + taxAmount;
  };

  const updateItemAmount = (index: number, field: 'quantity' | 'rate', value: number) => {
    const updatedItems = [...newInvoice.items];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value,
      amount: field === 'quantity' 
        ? calculateItemAmount(value, updatedItems[index].rate)
        : calculateItemAmount(updatedItems[index].quantity, value)
    };
    setNewInvoice({ ...newInvoice, items: updatedItems });
  };

  const addItem = () => {
    setNewInvoice({
      ...newInvoice,
      items: [...newInvoice.items, { description: '', quantity: 1, rate: 0, amount: 0 }]
    });
  };

  const removeItem = (index: number) => {
    const updatedItems = newInvoice.items.filter((_, i) => i !== index);
    setNewInvoice({ ...newInvoice, items: updatedItems });
  };

  const handleCreateInvoice = async () => {
    if (!newInvoice.client_name || !newInvoice.client_email || !newInvoice.due_date) {
      alert('Please fill in client name, email, and due date');
      return;
    }

    if (!TierManager.canUseFeature('invoices')) {
      alert('You\'ve reached your invoice limit. Please upgrade to create more invoices.');
      return;
    }

    try {
      const subtotal = calculateSubtotal(newInvoice.items);
      const taxAmount = calculateTaxAmount(subtotal, newInvoice.tax_rate);
      const total = calculateTotal(subtotal, taxAmount);

      const invoiceData = {
        invoice_number: generateInvoiceNumber(),
        client_name: newInvoice.client_name,
        client_email: newInvoice.client_email,
        client_address: newInvoice.client_address,
        amount: total,
        status: 'draft',
        due_date: newInvoice.due_date,
        items: newInvoice.items,
        company_info: newInvoice.company_info,
        notes: newInvoice.notes,
        terms: newInvoice.terms,
        tax_rate: newInvoice.tax_rate,
        tax_amount: taxAmount,
        payment_info: newInvoice.payment_info
      };

      const { data, error } = await database.createInvoice(invoiceData);
      if (!error && data) {
        await loadInvoices();
        setShowCreateModal(false);
        resetForm();
        saveCompanyDefaults();
        TierManager.updateUsage('invoices');
        alert('Invoice created successfully!');
      } else {
        alert('Error creating invoice. Please try again.');
      }
    } catch (error) {
      console.error('Error creating invoice:', error);
      alert('Error creating invoice. Please try again.');
    }
  };

  const handleUpdateInvoice = async () => {
    if (!editingInvoice) return;

    try {
      const subtotal = calculateSubtotal(editingInvoice.items);
      const taxAmount = calculateTaxAmount(subtotal, editingInvoice.tax_rate || 0);
      const total = calculateTotal(subtotal, taxAmount);

      const updatedData = {
        ...editingInvoice,
        amount: total,
        tax_amount: taxAmount
      };

      // Update in database
      await database.updateInvoice(editingInvoice.id, updatedData);
      await loadInvoices();
      setEditingInvoice(null);
      alert('Invoice updated successfully!');
    } catch (error) {
      console.error('Error updating invoice:', error);
      alert('Error updating invoice. Please try again.');
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;

    try {
      await database.deleteInvoice(id);
      await loadInvoices();
      alert('Invoice deleted successfully!');
    } catch (error) {
      console.error('Error deleting invoice:', error);
      alert('Error deleting invoice. Please try again.');
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await database.updateInvoice(id, { status });
      await loadInvoices();
    } catch (error) {
      console.error('Error updating invoice status:', error);
    }
  };

  const resetForm = () => {
    setNewInvoice({
      client_name: '',
      client_email: '',
      client_address: '',
      due_date: '',
      items: [{ description: '', quantity: 1, rate: 0, amount: 0 }],
      company_info: {
        name: '',
        address: '',
        email: '',
        phone: '',
        logo: ''
      },
      notes: '',
      terms: 'Payment due within 30 days',
      tax_rate: 0,
      payment_info: {
        method: '',
        details: ''
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
      case 'sent': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'paid': return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      case 'overdue': return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-300';
      case 'cancelled': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const formatCurrency = (amount: number) => {
    return CurrencyManager.formatAmount(amount);
  };

  const generatePDF = async (invoice: Invoice) => {
    try {
      const pdf = new jsPDF();
      
      // Set up colors
      const primaryColor = [59, 130, 246]; // Blue
      const textColor = [31, 41, 55]; // Dark gray
      
      // Header with logo
      if (invoice.company_info.logo) {
        try {
          pdf.addImage(invoice.company_info.logo, 'JPEG', 20, 20, 30, 30);
        } catch (error) {
          console.log('Logo could not be added to PDF');
        }
      }
      
      // Company name and invoice title
      pdf.setFontSize(24);
      pdf.setTextColor(...primaryColor);
      pdf.text('INVOICE', 120, 30);
      
      if (invoice.company_info.name) {
        pdf.setFontSize(16);
        pdf.setTextColor(...textColor);
        pdf.text(invoice.company_info.name, 20, 60);
      }
      
      // Invoice details
      pdf.setFontSize(12);
      pdf.setTextColor(...textColor);
      pdf.text(`Invoice #: ${invoice.invoice_number}`, 120, 45);
      pdf.text(`Date: ${new Date(invoice.created_at).toLocaleDateString()}`, 120, 55);
      pdf.text(`Due Date: ${new Date(invoice.due_date).toLocaleDateString()}`, 120, 65);
      
      // Company info
      let yPos = 75;
      if (invoice.company_info.address) {
        const addressLines = invoice.company_info.address.split('\n');
        addressLines.forEach((line, index) => {
          pdf.text(line, 20, yPos + (index * 8));
        });
        yPos += addressLines.length * 8 + 5;
      }
      
      if (invoice.company_info.email) {
        pdf.text(`Email: ${invoice.company_info.email}`, 20, yPos);
        yPos += 8;
      }
      
      if (invoice.company_info.phone) {
        pdf.text(`Phone: ${invoice.company_info.phone}`, 20, yPos);
        yPos += 8;
      }
      
      // Client info
      pdf.setFontSize(14);
      pdf.setTextColor(...primaryColor);
      pdf.text('BILL TO:', 120, 85);
      
      pdf.setFontSize(12);
      pdf.setTextColor(...textColor);
      pdf.text(invoice.client_name, 120, 95);
      pdf.text(invoice.client_email, 120, 105);
      
      if (invoice.client_address) {
        const clientAddressLines = invoice.client_address.split('\n');
        clientAddressLines.forEach((line, index) => {
          pdf.text(line, 120, 115 + (index * 8));
        });
      }
      
      // Items table
      yPos = Math.max(yPos + 20, 140);
      
      // Table header
      pdf.setFillColor(59, 130, 246);
      pdf.rect(20, yPos, 170, 10, 'F');
      
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(10);
      pdf.text('DESCRIPTION', 25, yPos + 7);
      pdf.text('QTY', 120, yPos + 7);
      pdf.text('RATE', 140, yPos + 7);
      pdf.text('AMOUNT', 165, yPos + 7);
      
      yPos += 15;
      
      // Table items
      pdf.setTextColor(...textColor);
      invoice.items?.forEach((item, index) => {
        if (yPos > 250) {
          pdf.addPage();
          yPos = 30;
        }
        
        pdf.text(item.description.substring(0, 40), 25, yPos);
        pdf.text(item.quantity.toString(), 125, yPos);
        pdf.text(formatCurrency(item.rate), 145, yPos);
        pdf.text(formatCurrency(item.amount), 170, yPos);
        yPos += 10;
      });
      
      // Totals section
      yPos += 10;
      const subtotal = calculateSubtotal(invoice.items || []);
      
      pdf.setDrawColor(200, 200, 200);
      pdf.line(120, yPos, 190, yPos);
      yPos += 10;
      
      pdf.text(`Subtotal: ${formatCurrency(subtotal)}`, 120, yPos);
      yPos += 10;
      
      if (invoice.tax_amount && invoice.tax_amount > 0) {
        pdf.text(`Tax (${invoice.tax_rate}%): ${formatCurrency(invoice.tax_amount)}`, 120, yPos);
        yPos += 10;
      }
      
      // Total with background
      pdf.setFillColor(59, 130, 246);
      pdf.rect(120, yPos - 5, 70, 12, 'F');
      pdf.setTextColor(255, 255, 255);
      pdf.setFontSize(12);
      pdf.text(`TOTAL: ${formatCurrency(invoice.amount)}`, 125, yPos + 3);
      
      // Notes and terms
      if (invoice.notes || invoice.terms) {
        yPos += 25;
        pdf.setTextColor(...textColor);
        pdf.setFontSize(10);
        
        if (invoice.notes) {
          pdf.text('NOTES:', 20, yPos);
          yPos += 8;
          const noteLines = pdf.splitTextToSize(invoice.notes, 170);
          pdf.text(noteLines, 20, yPos);
          yPos += noteLines.length * 5 + 10;
        }
        
        if (invoice.terms) {
          pdf.text('TERMS & CONDITIONS:', 20, yPos);
          yPos += 8;
          const termLines = pdf.splitTextToSize(invoice.terms, 170);
          pdf.text(termLines, 20, yPos);
        }
      }
      
      pdf.save(`invoice-${invoice.invoice_number}.pdf`);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('Error generating PDF. Please try again.');
    }
  };

  const exportAllInvoices = () => {
    const csvContent = [
      ['Invoice Number', 'Client Name', 'Client Email', 'Amount', 'Status', 'Created Date', 'Due Date'],
      ...invoices.map(inv => [
        inv.invoice_number,
        inv.client_name,
        inv.client_email,
        inv.amount.toString(),
        inv.status,
        new Date(inv.created_at).toLocaleDateString(),
        inv.due_date ? new Date(inv.due_date).toLocaleDateString() : ''
      ])
    ].map(row => row.join(',')).join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'invoices.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  };

  const handleLogoUpload = (logoUrl: string) => {
    setNewInvoice(prev => ({
      ...prev,
      company_info: {
        ...prev.company_info,
        logo: logoUrl
      }
    }));
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/4 mb-6"></div>
          <div className="h-96 bg-gray-200 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Invoice Generator</h1>
        <div className="flex space-x-3">
          <button
            onClick={exportAllInvoices}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
          >
            <Download className="w-4 h-4" />
            Export All
          </button>
          <button
            onClick={() => setShowCreateModal(true)}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            Create Invoice
          </button>
        </div>
      </div>

      {/* Invoice Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{invoices.length}</p>
            </div>
            <FileText className="w-8 h-8 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Paid</p>
              <p className="text-2xl font-bold text-green-600">
                {invoices.filter(inv => inv.status === 'paid').length}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {invoices.filter(inv => inv.status === 'sent').length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0))}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-slate-200 dark:border-gray-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 dark:bg-gray-700">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Invoice</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white">{invoice.invoice_number}</div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Created {new Date(invoice.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 dark:text-white flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {invoice.client_name}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">{invoice.client_email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(invoice.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={invoice.status}
                      onChange={(e) => handleStatusChange(invoice.id, e.target.value)}
                      className={`text-xs font-semibold rounded-full px-3 py-1 border-0 ${getStatusColor(invoice.status)}`}
                    >
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                    {new Date(invoice.due_date).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewingInvoice(invoice)}
                        className="text-indigo-600 hover:text-indigo-900 p-1 hover:bg-indigo-100 dark:hover:bg-indigo-900/20 rounded"
                        title="View Invoice"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingInvoice(invoice)}
                        className="text-green-600 hover:text-green-900 p-1 hover:bg-green-100 dark:hover:bg-green-900/20 rounded"
                        title="Edit Invoice"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => generatePDF(invoice)}
                        className="text-blue-600 hover:text-blue-900 p-1 hover:bg-blue-100 dark:hover:bg-blue-900/20 rounded"
                        title="Download PDF"
                      >
                        <Download className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        className="text-red-600 hover:text-red-900 p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                        title="Delete Invoice"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {invoices.length === 0 && (
          <div className="text-center py-12">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No invoices yet</h3>
            <p className="text-gray-500 dark:text-gray-400">Create your first invoice to get started.</p>
          </div>
        )}
      </div>

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Create New Invoice</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Client Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Client Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Name *</label>
                  <input
                    type="text"
                    value={newInvoice.client_name}
                    onChange={(e) => setNewInvoice({ ...newInvoice, client_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Email *</label>
                  <input
                    type="email"
                    value={newInvoice.client_email}
                    onChange={(e) => setNewInvoice({ ...newInvoice, client_email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Address</label>
                  <textarea
                    value={newInvoice.client_address}
                    onChange={(e) => setNewInvoice({ ...newInvoice, client_address: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date *</label>
                  <input
                    type="date"
                    value={newInvoice.due_date}
                    onChange={(e) => setNewInvoice({ ...newInvoice, due_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </div>
              </div>

              {/* Company Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Your Company Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Company Logo</label>
                  <div className="flex items-center space-x-4">
                    {newInvoice.company_info.logo ? (
                      <div className="relative">
                        <img 
                          src={newInvoice.company_info.logo} 
                          alt="Company Logo" 
                          className="w-16 h-16 object-contain border border-gray-300 dark:border-gray-600 rounded"
                        />
                        <button
                          onClick={() => setNewInvoice(prev => ({
                            ...prev,
                            company_info: { ...prev.company_info, logo: '' }
                          }))}
                          className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center text-xs hover:bg-red-600"
                        >
                          ×
                        </button>
                      </div>
                    ) : (
                      <div className="w-16 h-16 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded flex items-center justify-center">
                        <ImageIcon className="w-6 h-6 text-gray-400" />
                      </div>
                    )}
                    <div className="flex-1">
                      <input
                        type="url"
                        value={newInvoice.company_info.logo}
                        onChange={(e) => handleLogoUpload(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                        placeholder="Logo URL (https://...)"
                      />
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Enter a URL to your logo image</p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={newInvoice.company_info.name}
                    onChange={(e) => setNewInvoice({
                      ...newInvoice,
                      company_info: { ...newInvoice.company_info, name: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Address</label>
                  <textarea
                    value={newInvoice.company_info.address}
                    onChange={(e) => setNewInvoice({
                      ...newInvoice,
                      company_info: { ...newInvoice.company_info, address: e.target.value }
                    })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Email</label>
                  <input
                    type="email"
                    value={newInvoice.company_info.email}
                    onChange={(e) => setNewInvoice({
                      ...newInvoice,
                      company_info: { ...newInvoice.company_info, email: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Company Phone</label>
                  <input
                    type="tel"
                    value={newInvoice.company_info.phone}
                    onChange={(e) => setNewInvoice({
                      ...newInvoice,
                      company_info: { ...newInvoice.company_info, phone: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            {/* Invoice Items */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Invoice Items</h3>
                <button
                  onClick={addItem}
                  className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 dark:border-gray-600 rounded-lg">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Description</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Qty</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Rate</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Amount</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700 dark:text-gray-300">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newInvoice.items.map((item, index) => (
                      <tr key={index} className="border-t border-gray-200 dark:border-gray-600">
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => {
                              const updatedItems = [...newInvoice.items];
                              updatedItems[index].description = e.target.value;
                              setNewInvoice({ ...newInvoice, items: updatedItems });
                            }}
                            className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
                            placeholder="Item description"
                            required
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItemAmount(index, 'quantity', Number(e.target.value))}
                            className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
                            min="1"
                            required
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={item.rate}
                            onChange={(e) => updateItemAmount(index, 'rate', Number(e.target.value))}
                            className="w-24 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
                            min="0"
                            step="0.01"
                            required
                          />
                        </td>
                        <td className="px-4 py-2">
                          <span className="text-sm font-medium text-gray-900 dark:text-white">{formatCurrency(item.amount)}</span>
                        </td>
                        <td className="px-4 py-2">
                          {newInvoice.items.length > 1 && (
                            <button
                              onClick={() => removeItem(index)}
                              className="text-red-600 hover:text-red-800 p-1 hover:bg-red-100 dark:hover:bg-red-900/20 rounded"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Tax and Totals */}
              <div className="mt-4 flex justify-end">
                <div className="w-64 space-y-2 bg-gray-50 dark:bg-gray-700 p-4 rounded-lg">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Subtotal:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(calculateSubtotal(newInvoice.items))}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <label className="text-sm text-gray-600 dark:text-gray-400">Tax Rate (%):</label>
                    <input
                      type="number"
                      value={newInvoice.tax_rate}
                      onChange={(e) => setNewInvoice({ ...newInvoice, tax_rate: Number(e.target.value) })}
                      className="w-20 px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Tax Amount:</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatCurrency(calculateTaxAmount(calculateSubtotal(newInvoice.items), newInvoice.tax_rate))}
                    </span>
                  </div>
                  
                  <div className="flex justify-between border-t border-gray-300 dark:border-gray-600 pt-2">
                    <span className="font-medium text-gray-900 dark:text-white">Total:</span>
                    <span className="font-bold text-lg text-indigo-600">
                      {formatCurrency(calculateTotal(
                        calculateSubtotal(newInvoice.items),
                        calculateTaxAmount(calculateSubtotal(newInvoice.items), newInvoice.tax_rate)
                      ))}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes</label>
                <textarea
                  value={newInvoice.notes}
                  onChange={(e) => setNewInvoice({ ...newInvoice, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Additional notes or comments"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Terms & Conditions</label>
                <textarea
                  value={newInvoice.terms}
                  onChange={(e) => setNewInvoice({ ...newInvoice, terms: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Payment terms and conditions"
                />
              </div>
            </div>

            {/* Payment Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Method</label>
                <input
                  type="text"
                  value={newInvoice.payment_info.method}
                  onChange={(e) => setNewInvoice({
                    ...newInvoice,
                    payment_info: { ...newInvoice.payment_info, method: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="e.g., Bank Transfer, PayPal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Payment Details</label>
                <input
                  type="text"
                  value={newInvoice.payment_info.details}
                  onChange={(e) => setNewInvoice({
                    ...newInvoice,
                    payment_info: { ...newInvoice.payment_info, details: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Account details or instructions"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleCreateInvoice}
                disabled={!newInvoice.client_name || !newInvoice.client_email || !newInvoice.due_date || newInvoice.items.some(item => !item.description)}
                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Invoice
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Invoice Modal */}
      {editingInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold text-slate-800 dark:text-white mb-6">Edit Invoice</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Client Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Name *</label>
                  <input
                    type="text"
                    value={editingInvoice.client_name}
                    onChange={(e) => setEditingInvoice({ ...editingInvoice, client_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Client Email *</label>
                  <input
                    type="email"
                    value={editingInvoice.client_email}
                    onChange={(e) => setEditingInvoice({ ...editingInvoice, client_email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date *</label>
                  <input
                    type="date"
                    value={editingInvoice.due_date}
                    onChange={(e) => setEditingInvoice({ ...editingInvoice, due_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                    required
                  />
                </div>
              </div>

              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Invoice Items</h3>
                {editingInvoice.items.map((item, index) => (
                  <div key={index} className="grid grid-cols-4 gap-2">
                    <input
                      type="text"
                      value={item.description}
                      onChange={(e) => {
                        const updatedItems = [...editingInvoice.items];
                        updatedItems[index].description = e.target.value;
                        setEditingInvoice({ ...editingInvoice, items: updatedItems });
                      }}
                      className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
                      placeholder="Description"
                    />
                    <input
                      type="number"
                      value={item.quantity}
                      onChange={(e) => {
                        const updatedItems = [...editingInvoice.items];
                        const newQty = Number(e.target.value);
                        updatedItems[index].quantity = newQty;
                        updatedItems[index].amount = newQty * updatedItems[index].rate;
                        setEditingInvoice({ ...editingInvoice, items: updatedItems });
                      }}
                      className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
                      min="1"
                    />
                    <input
                      type="number"
                      value={item.rate}
                      onChange={(e) => {
                        const updatedItems = [...editingInvoice.items];
                        const newRate = Number(e.target.value);
                        updatedItems[index].rate = newRate;
                        updatedItems[index].amount = updatedItems[index].quantity * newRate;
                        setEditingInvoice({ ...editingInvoice, items: updatedItems });
                      }}
                      className="px-2 py-1 border border-gray-300 dark:border-gray-600 rounded text-sm dark:bg-gray-700 dark:text-white"
                      min="0"
                      step="0.01"
                    />
                    <span className="text-sm font-medium text-gray-900 dark:text-white px-2 py-1">
                      {formatCurrency(item.amount)}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleUpdateInvoice}
                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700"
              >
                Update Invoice
              </button>
              <button
                onClick={() => setEditingInvoice(null)}
                className="flex-1 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Invoice Modal */}
      {viewingInvoice && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            {/* Invoice Preview */}
            <div id="invoice-preview" className="p-8 bg-white dark:bg-gray-800">
              {/* Header */}
              <div className="flex justify-between items-start mb-8">
                <div className="flex items-center space-x-4">
                  {viewingInvoice.company_info.logo && (
                    <img 
                      src={viewingInvoice.company_info.logo} 
                      alt="Company Logo" 
                      className="w-16 h-16 object-contain"
                    />
                  )}
                  <div>
                    <h1 className="text-3xl font-bold text-indigo-600">INVOICE</h1>
                    {viewingInvoice.company_info.name && (
                      <p className="text-lg font-semibold text-gray-800 dark:text-white">{viewingInvoice.company_info.name}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-gray-800 dark:text-white">{viewingInvoice.invoice_number}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Invoice Date: {new Date(viewingInvoice.created_at).toLocaleDateString()}</p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">Due Date: {new Date(viewingInvoice.due_date).toLocaleDateString()}</p>
                </div>
              </div>

              {/* Company and Client Info */}
              <div className="grid grid-cols-2 gap-8 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-3 text-indigo-600">FROM:</h3>
                  <div className="text-gray-700 dark:text-gray-300 space-y-1">
                    {viewingInvoice.company_info.name && <p className="font-medium">{viewingInvoice.company_info.name}</p>}
                    {viewingInvoice.company_info.address && <p className="whitespace-pre-line">{viewingInvoice.company_info.address}</p>}
                    {viewingInvoice.company_info.email && <p>{viewingInvoice.company_info.email}</p>}
                    {viewingInvoice.company_info.phone && <p>{viewingInvoice.company_info.phone}</p>}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-indigo-600 mb-3">BILL TO:</h3>
                  <div className="text-gray-700 dark:text-gray-300 space-y-1">
                    <p className="font-medium">{viewingInvoice.client_name}</p>
                    <p>{viewingInvoice.client_email}</p>
                    {viewingInvoice.client_address && <p className="whitespace-pre-line">{viewingInvoice.client_address}</p>}
                  </div>
                </div>
              </div>

              {/* Items Table */}
              <div className="mb-8">
                <table className="w-full border border-gray-200 dark:border-gray-600 rounded-lg overflow-hidden">
                  <thead className="bg-indigo-600 text-white">
                    <tr>
                      <th className="px-6 py-4 text-left font-semibold">DESCRIPTION</th>
                      <th className="px-6 py-4 text-center font-semibold">QTY</th>
                      <th className="px-6 py-4 text-right font-semibold">RATE</th>
                      <th className="px-6 py-4 text-right font-semibold">AMOUNT</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800">
                    {viewingInvoice.items.map((item, index) => (
                      <tr key={index} className="border-t border-gray-200 dark:border-gray-600">
                        <td className="px-6 py-4 text-gray-800 dark:text-white">{item.description}</td>
                        <td className="px-6 py-4 text-center text-gray-800 dark:text-white">{item.quantity}</td>
                        <td className="px-6 py-4 text-right text-gray-800 dark:text-white">{formatCurrency(item.rate)}</td>
                        <td className="px-6 py-4 text-right font-semibold text-gray-800 dark:text-white">{formatCurrency(item.amount)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Totals */}
                <div className="flex justify-end mt-6">
                  <div className="w-80 space-y-3 bg-gray-50 dark:bg-gray-700 p-6 rounded-lg">
                    <div className="flex justify-between text-gray-700 dark:text-gray-300">
                      <span>Subtotal:</span>
                      <span className="font-medium">{formatCurrency(calculateSubtotal(viewingInvoice.items))}</span>
                    </div>
                    {viewingInvoice.tax_rate && viewingInvoice.tax_rate > 0 && (
                      <div className="flex justify-between text-gray-700 dark:text-gray-300">
                        <span>Tax ({viewingInvoice.tax_rate}%):</span>
                        <span className="font-medium">{formatCurrency(viewingInvoice.tax_amount || 0)}</span>
                      </div>
                    )}
                    <div className="border-t border-gray-300 dark:border-gray-600 pt-3">
                      <div className="flex justify-between">
                        <span className="text-xl font-bold text-gray-900 dark:text-white">TOTAL:</span>
                        <span className="text-xl font-bold text-indigo-600">{formatCurrency(viewingInvoice.amount)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Notes and Terms */}
              {(viewingInvoice.notes || viewingInvoice.terms || viewingInvoice.payment_info.method) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-8 border-t border-gray-200 dark:border-gray-600">
                  {viewingInvoice.notes && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">NOTES:</h4>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line bg-gray-50 dark:bg-gray-700 p-3 rounded">{viewingInvoice.notes}</p>
                    </div>
                  )}
                  
                  {viewingInvoice.terms && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">TERMS & CONDITIONS:</h4>
                      <p className="text-gray-700 dark:text-gray-300 whitespace-pre-line bg-gray-50 dark:bg-gray-700 p-3 rounded">{viewingInvoice.terms}</p>
                    </div>
                  )}
                  
                  {viewingInvoice.payment_info.method && (
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white mb-2">PAYMENT INFORMATION:</h4>
                      <div className="bg-gray-50 dark:bg-gray-700 p-3 rounded">
                        <p className="text-gray-700 dark:text-gray-300">
                          <span className="font-medium">Method:</span> {viewingInvoice.payment_info.method}
                        </p>
                        {viewingInvoice.payment_info.details && (
                          <p className="text-gray-700 dark:text-gray-300">
                            <span className="font-medium">Details:</span> {viewingInvoice.payment_info.details}
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-3 p-6 border-t border-gray-200 dark:border-gray-600 bg-gray-50 dark:bg-gray-700">
              <button
                onClick={() => generatePDF(viewingInvoice)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              <button
                onClick={() => setEditingInvoice(viewingInvoice)}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2"
              >
                <Edit className="w-4 h-4" />
                Edit Invoice
              </button>
              <button
                onClick={() => setViewingInvoice(null)}
                className="bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 px-4 py-2 rounded-lg hover:bg-gray-400 dark:hover:bg-gray-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}