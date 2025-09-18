import React, { useState, useEffect } from 'react';
import { FileText, Plus, Download, Send, Eye, Edit, Trash2, Calendar, DollarSign, User, Building } from 'lucide-react';
import { database } from '../lib/database';
import { CurrencyManager } from '../lib/currency';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

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
  due_date?: string;
  items: InvoiceItem[];
  company_info: {
    name?: string;
    address?: string;
    email?: string;
    phone?: string;
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
      phone: ''
    },
    notes: '',
    terms: '',
    tax_rate: 0,
    payment_info: {
      method: '',
      details: ''
    }
  });

  useEffect(() => {
    loadInvoices();
  }, []);

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
        due_date: newInvoice.due_date || null,
        items: newInvoice.items,
        company_info: newInvoice.company_info,
        notes: newInvoice.notes,
        terms: newInvoice.terms,
        tax_rate: newInvoice.tax_rate,
        tax_amount: taxAmount,
        payment_info: newInvoice.payment_info
      };

      await database.createInvoice(invoiceData);
      await loadInvoices();
      setShowCreateModal(false);
      resetForm();
    } catch (error) {
      console.error('Error creating invoice:', error);
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

      // In a real implementation, you'd call database.updateInvoice
      setInvoices(prev => prev.map(inv => inv.id === editingInvoice.id ? updatedData : inv));
      await loadInvoices();
      setEditingInvoice(null);
    } catch (error) {
      console.error('Error updating invoice:', error);
    }
  };

  const handleDeleteInvoice = async (id: string) => {
    if (!confirm('Are you sure you want to delete this invoice?')) return;

    try {
      // In a real implementation, you'd call database.deleteInvoice
      setInvoices(prev => prev.filter(inv => inv.id !== id));
      await loadInvoices();
    } catch (error) {
      console.error('Error deleting invoice:', error);
    }
  };

  const handleStatusChange = async (id: string, status: string) => {
    try {
      // In a real implementation, you'd call database.updateInvoice
      setInvoices(prev => prev.map(inv => inv.id === id ? { ...inv, status } : inv));
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
        phone: ''
      },
      notes: '',
      terms: '',
      tax_rate: 0,
      payment_info: {
        method: '',
        details: ''
      }
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft': return 'bg-gray-100 text-gray-800';
      case 'sent': return 'bg-blue-100 text-blue-800';
      case 'paid': return 'bg-green-100 text-green-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      case 'cancelled': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const formatCurrency = (amount: number) => {
    return CurrencyManager.formatAmount(amount);
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/4 mb-6"></div>
          <div className="h-96 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Invoice Generator</h1>
        <button
          onClick={() => setShowCreateModal(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Create Invoice
        </button>
      </div>

      {/* Invoice Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Invoices</p>
              <p className="text-2xl font-bold text-gray-900">{invoices.length}</p>
            </div>
            <FileText className="w-8 h-8 text-indigo-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Paid</p>
              <p className="text-2xl font-bold text-green-600">
                {invoices.filter(inv => inv.status === 'paid').length}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-green-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {invoices.filter(inv => inv.status === 'sent').length}
              </p>
            </div>
            <Calendar className="w-8 h-8 text-yellow-600" />
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Revenue</p>
              <p className="text-2xl font-bold text-purple-600">
                {formatCurrency(invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0))}
              </p>
            </div>
            <DollarSign className="w-8 h-8 text-purple-600" />
          </div>
        </div>
      </div>

      {/* Invoices Table */}
      <div className="bg-white rounded-lg shadow-sm border overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Invoice</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {invoices.map((invoice) => (
                <tr key={invoice.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900">{invoice.invoice_number}</div>
                      <div className="text-sm text-gray-500">
                        Created {new Date(invoice.created_at).toLocaleDateString()}
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div>
                      <div className="text-sm font-medium text-gray-900 flex items-center gap-1">
                        <User className="w-4 h-4" />
                        {invoice.client_name}
                      </div>
                      <div className="text-sm text-gray-500">{invoice.client_email}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {formatCurrency(invoice.amount)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <select
                      value={invoice.status}
                      onChange={(e) => handleStatusChange(invoice.id, e.target.value)}
                      className={`text-xs font-semibold rounded-full px-2 py-1 border-0 ${getStatusColor(invoice.status)}`}
                    >
                      <option value="draft">Draft</option>
                      <option value="sent">Sent</option>
                      <option value="paid">Paid</option>
                      <option value="overdue">Overdue</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {invoice.due_date ? new Date(invoice.due_date).toLocaleDateString() : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setViewingInvoice(invoice)}
                        className="text-indigo-600 hover:text-indigo-900"
                        title="View"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setEditingInvoice(invoice)}
                        className="text-green-600 hover:text-green-900"
                        title="Edit"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDeleteInvoice(invoice.id)}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
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
            <h3 className="text-lg font-medium text-gray-900 mb-2">No invoices yet</h3>
            <p className="text-gray-500">Create your first invoice to get started.</p>
          </div>
        )}
      </div>

      {/* Create Invoice Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-6">
            <h2 className="text-xl font-bold mb-6">Create New Invoice</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Client Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Client Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Name *</label>
                  <input
                    type="text"
                    value={newInvoice.client_name}
                    onChange={(e) => setNewInvoice({ ...newInvoice, client_name: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Email *</label>
                  <input
                    type="email"
                    value={newInvoice.client_email}
                    onChange={(e) => setNewInvoice({ ...newInvoice, client_email: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Client Address</label>
                  <textarea
                    value={newInvoice.client_address}
                    onChange={(e) => setNewInvoice({ ...newInvoice, client_address: e.target.value })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Due Date</label>
                  <input
                    type="date"
                    value={newInvoice.due_date}
                    onChange={(e) => setNewInvoice({ ...newInvoice, due_date: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Company Information */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900">Your Company Information</h3>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
                  <input
                    type="text"
                    value={newInvoice.company_info.name}
                    onChange={(e) => setNewInvoice({
                      ...newInvoice,
                      company_info: { ...newInvoice.company_info, name: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Address</label>
                  <textarea
                    value={newInvoice.company_info.address}
                    onChange={(e) => setNewInvoice({
                      ...newInvoice,
                      company_info: { ...newInvoice.company_info, address: e.target.value }
                    })}
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Email</label>
                  <input
                    type="email"
                    value={newInvoice.company_info.email}
                    onChange={(e) => setNewInvoice({
                      ...newInvoice,
                      company_info: { ...newInvoice.company_info, email: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Company Phone</label>
                  <input
                    type="tel"
                    value={newInvoice.company_info.phone}
                    onChange={(e) => setNewInvoice({
                      ...newInvoice,
                      company_info: { ...newInvoice.company_info, phone: e.target.value }
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Invoice Items */}
            <div className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Invoice Items</h3>
                <button
                  onClick={addItem}
                  className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 flex items-center gap-1"
                >
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full border border-gray-200 rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Description</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Qty</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Rate</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Amount</th>
                      <th className="px-4 py-2 text-left text-sm font-medium text-gray-700">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {newInvoice.items.map((item, index) => (
                      <tr key={index} className="border-t">
                        <td className="px-4 py-2">
                          <input
                            type="text"
                            value={item.description}
                            onChange={(e) => {
                              const updatedItems = [...newInvoice.items];
                              updatedItems[index].description = e.target.value;
                              setNewInvoice({ ...newInvoice, items: updatedItems });
                            }}
                            className="w-full px-2 py-1 border border-gray-300 rounded text-sm"
                            placeholder="Item description"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={item.quantity}
                            onChange={(e) => updateItemAmount(index, 'quantity', Number(e.target.value))}
                            className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                            min="1"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <input
                            type="number"
                            value={item.rate}
                            onChange={(e) => updateItemAmount(index, 'rate', Number(e.target.value))}
                            className="w-24 px-2 py-1 border border-gray-300 rounded text-sm"
                            min="0"
                            step="0.01"
                          />
                        </td>
                        <td className="px-4 py-2">
                          <span className="text-sm font-medium">{formatCurrency(item.amount)}</span>
                        </td>
                        <td className="px-4 py-2">
                          {newInvoice.items.length > 1 && (
                            <button
                              onClick={() => removeItem(index)}
                              className="text-red-600 hover:text-red-800"
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
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-sm">Subtotal:</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(calculateSubtotal(newInvoice.items))}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <label className="text-sm">Tax Rate (%):</label>
                    <input
                      type="number"
                      value={newInvoice.tax_rate}
                      onChange={(e) => setNewInvoice({ ...newInvoice, tax_rate: Number(e.target.value) })}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                      min="0"
                      max="100"
                      step="0.01"
                    />
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm">Tax Amount:</span>
                    <span className="text-sm font-medium">
                      {formatCurrency(calculateTaxAmount(calculateSubtotal(newInvoice.items), newInvoice.tax_rate))}
                    </span>
                  </div>
                  
                  <div className="flex justify-between border-t pt-2">
                    <span className="font-medium">Total:</span>
                    <span className="font-bold">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  value={newInvoice.notes}
                  onChange={(e) => setNewInvoice({ ...newInvoice, notes: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Additional notes or comments"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Terms & Conditions</label>
                <textarea
                  value={newInvoice.terms}
                  onChange={(e) => setNewInvoice({ ...newInvoice, terms: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Payment terms and conditions"
                />
              </div>
            </div>

            {/* Payment Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
                <input
                  type="text"
                  value={newInvoice.payment_info.method}
                  onChange={(e) => setNewInvoice({
                    ...newInvoice,
                    payment_info: { ...newInvoice.payment_info, method: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="e.g., Bank Transfer, PayPal"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payment Details</label>
                <input
                  type="text"
                  value={newInvoice.payment_info.details}
                  onChange={(e) => setNewInvoice({
                    ...newInvoice,
                    payment_info: { ...newInvoice.payment_info, details: e.target.value }
                  })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  placeholder="Account details or instructions"
                />
              </div>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={handleCreateInvoice}
                disabled={!newInvoice.client_name || !newInvoice.client_email || newInvoice.items.some(item => !item.description)}
                className="flex-1 bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Create Invoice
              </button>
              <button
                onClick={() => {
                  setShowCreateModal(false);
                  resetForm();
                }}
                className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-400"
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
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto p-8">
            <div className="flex justify-between items-start mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">INVOICE</h1>
                <p className="text-lg text-gray-600">{viewingInvoice.invoice_number}</p>
              </div>
              <button
                onClick={() => setViewingInvoice(null)}
                className="text-gray-400 hover:text-gray-600"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">From:</h3>
                <div className="text-gray-700">
                  {viewingInvoice.company_info.name && <p className="font-medium">{viewingInvoice.company_info.name}</p>}
                  {viewingInvoice.company_info.address && <p className="whitespace-pre-line">{viewingInvoice.company_info.address}</p>}
                  {viewingInvoice.company_info.email && <p>{viewingInvoice.company_info.email}</p>}
                  {viewingInvoice.company_info.phone && <p>{viewingInvoice.company_info.phone}</p>}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Bill To:</h3>
                <div className="text-gray-700">
                  <p className="font-medium">{viewingInvoice.client_name}</p>
                  <p>{viewingInvoice.client_email}</p>
                  {viewingInvoice.client_address && <p className="whitespace-pre-line">{viewingInvoice.client_address}</p>}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-8 mb-8">
              <div>
                <p><span className="font-medium">Invoice Date:</span> {new Date(viewingInvoice.created_at).toLocaleDateString()}</p>
                {viewingInvoice.due_date && (
                  <p><span className="font-medium">Due Date:</span> {new Date(viewingInvoice.due_date).toLocaleDateString()}</p>
                )}
              </div>
              <div>
                <p><span className="font-medium">Status:</span> 
                  <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(viewingInvoice.status)}`}>
                    {viewingInvoice.status}
                  </span>
                </p>
              </div>
            </div>

            <div className="mb-8">
              <table className="w-full border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-gray-700">Description</th>
                    <th className="px-4 py-3 text-center font-medium text-gray-700">Qty</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700">Rate</th>
                    <th className="px-4 py-3 text-right font-medium text-gray-700">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {viewingInvoice.items.map((item, index) => (
                    <tr key={index} className="border-t">
                      <td className="px-4 py-3">{item.description}</td>
                      <td className="px-4 py-3 text-center">{item.quantity}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(item.rate)}</td>
                      <td className="px-4 py-3 text-right">{formatCurrency(item.amount)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="flex justify-end mt-4">
                <div className="w-64 space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal:</span>
                    <span>{formatCurrency(calculateSubtotal(viewingInvoice.items))}</span>
                  </div>
                  {viewingInvoice.tax_rate && viewingInvoice.tax_rate > 0 && (
                    <div className="flex justify-between">
                      <span>Tax ({viewingInvoice.tax_rate}%):</span>
                      <span>{formatCurrency(viewingInvoice.tax_amount || 0)}</span>
                    </div>
                  )}
                  <div className="flex justify-between border-t pt-2 font-bold text-lg">
                    <span>Total:</span>
                    <span>{formatCurrency(viewingInvoice.amount)}</span>
                  </div>
                </div>
              </div>
            </div>

            {(viewingInvoice.notes || viewingInvoice.terms || viewingInvoice.payment_info.method) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 pt-8 border-t">
                {viewingInvoice.notes && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Notes:</h4>
                    <p className="text-gray-700 whitespace-pre-line">{viewingInvoice.notes}</p>
                  </div>
                )}
                
                {viewingInvoice.terms && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Terms & Conditions:</h4>
                    <p className="text-gray-700 whitespace-pre-line">{viewingInvoice.terms}</p>
                  </div>
                )}
                
                {viewingInvoice.payment_info.method && (
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">Payment Information:</h4>
                    <p className="text-gray-700">
                      <span className="font-medium">Method:</span> {viewingInvoice.payment_info.method}
                    </p>
                    {viewingInvoice.payment_info.details && (
                      <p className="text-gray-700">
                        <span className="font-medium">Details:</span> {viewingInvoice.payment_info.details}
                      </p>
                    )}
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-3 mt-8 pt-8 border-t">
              <button
                onClick={() => generatePDF(viewingInvoice)}
                className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </button>
              <button
                onClick={() => setViewingInvoice(null)}
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400"
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