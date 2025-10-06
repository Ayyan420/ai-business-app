import React, { useState } from 'react';
import { 
  FileText, 
  Download, 
  Eye, 
  Plus, 
  Trash2, 
  Calculator,
  Upload,
  Image as ImageIcon
} from 'lucide-react';
import { database } from '../lib/database';
import { CurrencyManager } from '../lib/currency';

interface InvoiceItem {
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

interface InvoiceGeneratorProps {
  onSave: (invoice: any) => void;
}

const InvoiceGenerator: React.FC<InvoiceGeneratorProps> = ({ onSave }) => {
  const [invoiceData, setInvoiceData] = useState({
    invoice_number: `INV-${Date.now().toString().slice(-6)}`,
    client_name: '',
    client_email: '',
    client_address: '',
    due_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    notes: '',
    terms: 'Payment due within 30 days',
    tax_rate: 0,
    status: 'draft'
  });

  const [companyInfo, setCompanyInfo] = useState({
    name: 'Your Business Name',
    address: '123 Business Street\nCity, State 12345',
    email: 'hello@yourbusiness.com',
    phone: '+1 (555) 123-4567',
    logo: ''
  });

  const [items, setItems] = useState<InvoiceItem[]>([
    { description: '', quantity: 1, rate: 0, amount: 0 }
  ]);

  const [uploading, setUploading] = useState(false);

  const addItem = () => {
    setItems([...items, { description: '', quantity: 1, rate: 0, amount: 0 }]);
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  const updateItem = (index: number, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = items.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updatedItem.amount = updatedItem.quantity * updatedItem.rate;
        }
        return updatedItem;
      }
      return item;
    });
    setItems(updatedItems);
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB');
      return;
    }

    setUploading(true);

    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const dataUrl = e.target?.result as string;
        setCompanyInfo(prev => ({ ...prev, logo: dataUrl }));
        setUploading(false);
      };
      reader.onerror = () => {
        alert('Error reading file. Please try again.');
        setUploading(false);
      };
      reader.readAsDataURL(file);
    } catch (error) {
      console.error('Logo upload error:', error);
      alert('Error uploading logo. Please try again.');
      setUploading(false);
    }
  };

  const calculateSubtotal = () => {
    return items.reduce((sum, item) => sum + item.amount, 0);
  };

  const calculateTax = () => {
    return calculateSubtotal() * (invoiceData.tax_rate / 100);
  };

  const calculateTotal = () => {
    return calculateSubtotal() + calculateTax();
  };

  const handleSave = () => {
    if (!invoiceData.client_name || !invoiceData.client_email || items.some(item => !item.description)) {
      alert('Please fill in all required fields');
      return;
    }

    const invoice = {
      ...invoiceData,
      items,
      company_info: companyInfo,
      amount: calculateTotal(),
      tax_amount: calculateTax()
    };

    onSave(invoice);
  };

  const generatePDF = () => {
    const invoiceWindow = window.open('', '_blank');
    if (!invoiceWindow) return;

    const logoHtml = companyInfo.logo ? 
      `<img src="${companyInfo.logo}" alt="Company Logo" style="max-height: 80px; max-width: 200px; object-fit: contain;">` : 
      `<div style="font-size: 24px; font-weight: bold; color: #3B82F6;">${companyInfo.name}</div>`;

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoiceData.invoice_number}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; color: #333; }
            .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; border-bottom: 2px solid #3B82F6; padding-bottom: 20px; }
            .company-info { flex: 1; }
            .invoice-info { text-align: right; }
            .invoice-title { font-size: 32px; font-weight: bold; color: #3B82F6; margin: 0; }
            .client-info { background: #f8fafc; padding: 20px; border-radius: 8px; margin-bottom: 30px; }
            .items-table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
            .items-table th, .items-table td { padding: 12px; text-align: left; border-bottom: 1px solid #e2e8f0; }
            .items-table th { background: #f1f5f9; font-weight: bold; }
            .totals { text-align: right; margin-bottom: 30px; }
            .totals div { margin: 8px 0; }
            .total-amount { font-size: 20px; font-weight: bold; color: #3B82F6; }
            .footer { border-top: 1px solid #e2e8f0; padding-top: 20px; margin-top: 40px; }
            @media print { body { margin: 0; } }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="company-info">
              ${logoHtml}
              <div style="margin-top: 10px; white-space: pre-line;">${companyInfo.address}</div>
              <div>${companyInfo.email}</div>
              <div>${companyInfo.phone}</div>
            </div>
            <div class="invoice-info">
              <h1 class="invoice-title">INVOICE</h1>
              <div><strong>Invoice #:</strong> ${invoiceData.invoice_number}</div>
              <div><strong>Date:</strong> ${new Date().toLocaleDateString()}</div>
              <div><strong>Due Date:</strong> ${new Date(invoiceData.due_date).toLocaleDateString()}</div>
            </div>
          </div>

          <div class="client-info">
            <h3 style="margin: 0 0 10px 0; color: #3B82F6;">Bill To:</h3>
            <div><strong>${invoiceData.client_name}</strong></div>
            <div>${invoiceData.client_email}</div>
            ${invoiceData.client_address ? `<div style="white-space: pre-line;">${invoiceData.client_address}</div>` : ''}
          </div>

          <table class="items-table">
            <thead>
              <tr>
                <th>Description</th>
                <th style="text-align: center;">Quantity</th>
                <th style="text-align: right;">Rate</th>
                <th style="text-align: right;">Amount</th>
              </tr>
            </thead>
            <tbody>
              ${items.map(item => `
                <tr>
                  <td>${item.description}</td>
                  <td style="text-align: center;">${item.quantity}</td>
                  <td style="text-align: right;">${CurrencyManager.formatAmount(item.rate)}</td>
                  <td style="text-align: right;">${CurrencyManager.formatAmount(item.amount)}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>

          <div class="totals">
            <div><strong>Subtotal: ${CurrencyManager.formatAmount(calculateSubtotal())}</strong></div>
            ${invoiceData.tax_rate > 0 ? `<div>Tax (${invoiceData.tax_rate}%): ${CurrencyManager.formatAmount(calculateTax())}</div>` : ''}
            <div class="total-amount">Total: ${CurrencyManager.formatAmount(calculateTotal())}</div>
          </div>

          ${invoiceData.notes ? `
            <div class="footer">
              <h4>Notes:</h4>
              <p style="white-space: pre-line;">${invoiceData.notes}</p>
            </div>
          ` : ''}

          <div class="footer">
            <h4>Terms & Conditions:</h4>
            <p style="white-space: pre-line;">${invoiceData.terms}</p>
          </div>
        </body>
      </html>
    `;

    invoiceWindow.document.write(invoiceHTML);
    invoiceWindow.document.close();
  };

  return (
    <div className="space-y-6">
      {/* Company Information */}
      <div className="bg-slate-50 dark:bg-gray-700 rounded-lg p-6 border dark:border-gray-600">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Company Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Company Name *
            </label>
            <input
              type="text"
              value={companyInfo.name}
              onChange={(e) => setCompanyInfo(prev => ({ ...prev, name: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Company Logo
            </label>
            <div className="flex items-center space-x-3">
              {companyInfo.logo && (
                <img
                  src={companyInfo.logo}
                  alt="Company Logo"
                  className="w-16 h-16 object-contain border border-slate-200 dark:border-gray-600 rounded"
                />
              )}
              <div className="flex-1">
                <input
                  id="logo-upload"
                  type="file"
                  accept="image/*"
                  onChange={handleLogoUpload}
                  className="hidden"
                  disabled={uploading}
                />
                <label
                  htmlFor="logo-upload"
                  className={`flex items-center justify-center space-x-2 px-4 py-2 border border-slate-300 dark:border-gray-600 rounded-lg cursor-pointer hover:bg-slate-50 dark:hover:bg-gray-600 transition-colors ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {uploading ? (
                    <>
                      <div className="w-4 h-4 border-2 border-slate-600 border-t-transparent rounded-full animate-spin"></div>
                      <span className="text-sm text-slate-600 dark:text-gray-300">Uploading...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="w-4 h-4 text-slate-600 dark:text-gray-300" />
                      <span className="text-sm text-slate-600 dark:text-gray-300">
                        {companyInfo.logo ? 'Change Logo' : 'Upload Logo'}
                      </span>
                    </>
                  )}
                </label>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Address *
            </label>
            <textarea
              value={companyInfo.address}
              onChange={(e) => setCompanyInfo(prev => ({ ...prev, address: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-20 resize-none dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div className="space-y-2">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Email *
              </label>
              <input
                type="email"
                value={companyInfo.email}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, email: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
                Phone
              </label>
              <input
                type="tel"
                value={companyInfo.phone}
                onChange={(e) => setCompanyInfo(prev => ({ ...prev, phone: e.target.value }))}
                className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Details */}
      <div className="bg-slate-50 dark:bg-gray-700 rounded-lg p-6 border dark:border-gray-600">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Invoice Details</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Invoice Number *
            </label>
            <input
              type="text"
              value={invoiceData.invoice_number}
              onChange={(e) => setInvoiceData(prev => ({ ...prev, invoice_number: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Due Date *
            </label>
            <input
              type="date"
              value={invoiceData.due_date}
              onChange={(e) => setInvoiceData(prev => ({ ...prev, due_date: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Client Information */}
      <div className="bg-slate-50 dark:bg-gray-700 rounded-lg p-6 border dark:border-gray-600">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Client Information</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Client Name *
            </label>
            <input
              type="text"
              value={invoiceData.client_name}
              onChange={(e) => setInvoiceData(prev => ({ ...prev, client_name: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              placeholder="Client or Company Name"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Client Email *
            </label>
            <input
              type="email"
              value={invoiceData.client_email}
              onChange={(e) => setInvoiceData(prev => ({ ...prev, client_email: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              placeholder="client@example.com"
            />
          </div>
        </div>
        
        <div className="mt-4">
          <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
            Client Address
          </label>
          <textarea
            value={invoiceData.client_address}
            onChange={(e) => setInvoiceData(prev => ({ ...prev, client_address: e.target.value }))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-20 resize-none dark:bg-gray-700 dark:text-white"
            placeholder="Client address (optional)"
          />
        </div>
      </div>

      {/* Invoice Items */}
      <div className="bg-slate-50 dark:bg-gray-700 rounded-lg p-6 border dark:border-gray-600">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white">Invoice Items</h3>
          <button
            onClick={addItem}
            className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Item</span>
          </button>
        </div>

        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-600">
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                  Description *
                </label>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => updateItem(index, 'description', e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                  placeholder="Service or product description"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                  Quantity *
                </label>
                <input
                  type="number"
                  min="1"
                  value={item.quantity}
                  onChange={(e) => updateItem(index, 'quantity', parseInt(e.target.value) || 1)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                  Rate *
                </label>
                <input
                  type="number"
                  step="0.01"
                  value={item.rate}
                  onChange={(e) => updateItem(index, 'rate', parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
                />
              </div>
              <div className="flex items-end space-x-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-1">
                    Amount
                  </label>
                  <div className="px-3 py-2 bg-slate-100 dark:bg-gray-600 border border-slate-300 dark:border-gray-600 rounded-lg text-slate-800 dark:text-white">
                    {CurrencyManager.formatAmount(item.amount)}
                  </div>
                </div>
                {items.length > 1 && (
                  <button
                    onClick={() => removeItem(index)}
                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Tax and Totals */}
      <div className="bg-slate-50 dark:bg-gray-700 rounded-lg p-6 border dark:border-gray-600">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Tax & Totals</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Tax Rate (%)
            </label>
            <input
              type="number"
              step="0.01"
              min="0"
              max="100"
              value={invoiceData.tax_rate}
              onChange={(e) => setInvoiceData(prev => ({ ...prev, tax_rate: parseFloat(e.target.value) || 0 }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
            />
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-gray-400">Subtotal:</span>
              <span className="font-semibold text-slate-800 dark:text-white">
                {CurrencyManager.formatAmount(calculateSubtotal())}
              </span>
            </div>
            {invoiceData.tax_rate > 0 && (
              <div className="flex justify-between items-center">
                <span className="text-slate-600 dark:text-gray-400">Tax ({invoiceData.tax_rate}%):</span>
                <span className="font-semibold text-slate-800 dark:text-white">
                  {CurrencyManager.formatAmount(calculateTax())}
                </span>
              </div>
            )}
            <div className="flex justify-between items-center text-lg border-t border-slate-300 dark:border-gray-600 pt-2">
              <span className="font-bold text-slate-800 dark:text-white">Total:</span>
              <span className="font-bold text-green-600">
                {CurrencyManager.formatAmount(calculateTotal())}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Notes and Terms */}
      <div className="bg-slate-50 dark:bg-gray-700 rounded-lg p-6 border dark:border-gray-600">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Additional Information</h3>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Notes
            </label>
            <textarea
              value={invoiceData.notes}
              onChange={(e) => setInvoiceData(prev => ({ ...prev, notes: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-20 resize-none dark:bg-gray-700 dark:text-white"
              placeholder="Thank you for your business!"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Terms & Conditions
            </label>
            <textarea
              value={invoiceData.terms}
              onChange={(e) => setInvoiceData(prev => ({ ...prev, terms: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 h-20 resize-none dark:bg-gray-700 dark:text-white"
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex space-x-4">
        <button
          onClick={generatePDF}
          className="flex items-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Eye className="w-4 h-4" />
          <span>Preview PDF</span>
        </button>
        <button
          onClick={handleSave}
          className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <FileText className="w-4 h-4" />
          <span>Save Invoice</span>
        </button>
      </div>
    </div>
  );
};

export default InvoiceGenerator;