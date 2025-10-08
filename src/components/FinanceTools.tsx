import React, { useState } from 'react';
import { useEffect } from 'react';
import { 
  Calculator, 
  FileText, 
  PieChart, 
  TrendingUp,
  DollarSign,
  Download,
  Plus,
  Eye,
  Edit,
  Trash2
} from 'lucide-react';
import { database } from '../lib/database';
import InvoiceGenerator from './InvoiceGenerator';
import { CurrencyManager } from '../lib/currency';
import { TierManager } from '../lib/tiers';

const FinanceTools: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState('invoice');
  const [savedInvoices, setSavedInvoices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState<any[]>([]);
  const [forecastData, setForecastData] = useState<any>(null);
  const [forecastForm, setForecastForm] = useState({
    currentRevenue: '',
    growthRate: '',
    period: '',
    businessType: ''
  });
  const [budgetData, setBudgetData] = useState({
    totalBudget: 10000,
    categories: [
      { name: 'Marketing', allocated: 3000, spent: 2100 },
      { name: 'Operations', allocated: 4000, spent: 3200 },
      { name: 'Technology', allocated: 2000, spent: 1800 },
      { name: 'Miscellaneous', allocated: 1000, spent: 400 }
    ]
  });

  useEffect(() => {
    loadInvoices();
    loadBudgets();
  }, []);

  const loadInvoices = async () => {
    setLoading(true);
    const { data, error } = await database.getInvoices();
    if (!error && data) {
      setSavedInvoices(data);
    }
    setLoading(false);
  };

  const loadBudgets = async () => {
    const { data, error } = await database.getBudgets();
    if (!error && data) {
      setBudgets(data);
    }
  };

  const generateInvoicePDF = (invoice: any, downloadPDF: boolean) => {
    const invoiceWindow = window.open('', '_blank');
    if (!invoiceWindow) return;

    const companyInfo = invoice.company_info || {
      name: 'Your Company',
      address: '',
      email: '',
      phone: '',
      logo: ''
    };

    const logoHtml = companyInfo.logo ?
      `<img src="${companyInfo.logo}" alt="Company Logo" style="max-height: 80px; max-width: 200px; object-fit: contain;">` :
      `<div style="font-size: 24px; font-weight: bold; color: #3B82F6;">${companyInfo.name}</div>`;

    const items = invoice.items || [];
    const subtotal = items.reduce((sum: number, item: any) => sum + (item.amount || 0), 0);
    const taxAmount = invoice.tax_amount || 0;
    const total = invoice.amount || (subtotal + taxAmount);

    const invoiceHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Invoice ${invoice.invoice_number}</title>
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
              ${companyInfo.address ? `<div style="margin-top: 10px; white-space: pre-line;">${companyInfo.address}</div>` : ''}
              ${companyInfo.email ? `<div>${companyInfo.email}</div>` : ''}
              ${companyInfo.phone ? `<div>${companyInfo.phone}</div>` : ''}
            </div>
            <div class="invoice-info">
              <h1 class="invoice-title">INVOICE</h1>
              <div><strong>Invoice #:</strong> ${invoice.invoice_number}</div>
              <div><strong>Date:</strong> ${new Date(invoice.created_at).toLocaleDateString()}</div>
              <div><strong>Due Date:</strong> ${invoice.due_date}</div>
            </div>
          </div>

          <div class="client-info">
            <h3 style="margin: 0 0 10px 0; color: #3B82F6;">Bill To:</h3>
            <div><strong>${invoice.client_name}</strong></div>
            <div>${invoice.client_email}</div>
            ${invoice.client_address ? `<div style="white-space: pre-line;">${invoice.client_address}</div>` : ''}
          </div>

          ${items.length > 0 ? `
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
                ${items.map((item: any) => `
                  <tr>
                    <td>${item.description || ''}</td>
                    <td style="text-align: center;">${item.quantity || 0}</td>
                    <td style="text-align: right;">${CurrencyManager.formatAmount(item.rate || 0)}</td>
                    <td style="text-align: right;">${CurrencyManager.formatAmount(item.amount || 0)}</td>
                  </tr>
                `).join('')}
              </tbody>
            </table>

            <div class="totals">
              <div><strong>Subtotal: ${CurrencyManager.formatAmount(subtotal)}</strong></div>
              ${taxAmount > 0 ? `<div>Tax: ${CurrencyManager.formatAmount(taxAmount)}</div>` : ''}
              <div class="total-amount">Total: ${CurrencyManager.formatAmount(total)}</div>
            </div>
          ` : `
            <div class="totals">
              <div class="total-amount">Total: ${CurrencyManager.formatAmount(total)}</div>
            </div>
          `}

          ${invoice.notes ? `
            <div class="footer">
              <h4>Notes:</h4>
              <p style="white-space: pre-line;">${invoice.notes}</p>
            </div>
          ` : ''}

          ${invoice.terms ? `
            <div class="footer">
              <h4>Terms & Conditions:</h4>
              <p style="white-space: pre-line;">${invoice.terms}</p>
            </div>
          ` : ''}

          ${downloadPDF ? `
            <script>
              window.onload = function() {
                window.print();
              }
            </script>
          ` : ''}
        </body>
      </html>
    `;

    invoiceWindow.document.write(invoiceHTML);
    invoiceWindow.document.close();
  };

  const generateForecast = async () => {
    if (!forecastForm.currentRevenue || !forecastForm.growthRate || !forecastForm.period) {
      alert('Please fill in all required fields');
      return;
    }

    const currentRev = parseFloat(forecastForm.currentRevenue);
    const growthRate = parseFloat(forecastForm.growthRate) / 100;
    const months = parseInt(forecastForm.period);

    const forecast = [];
    for (let i = 1; i <= months; i++) {
      const monthlyGrowth = Math.pow(1 + growthRate / 12, i);
      const projectedRevenue = currentRev * monthlyGrowth;
      
      forecast.push({
        month: i,
        monthName: new Date(2024, i - 1, 1).toLocaleDateString('en-US', { month: 'long' }),
        revenue: projectedRevenue,
        growth: ((projectedRevenue - currentRev) / currentRev * 100).toFixed(1)
      });
    }

    setForecastData({
      forecast,
      totalGrowth: ((forecast[forecast.length - 1].revenue - currentRev) / currentRev * 100).toFixed(1),
      businessType: forecastForm.businessType
    });
  };

  const handleSaveInvoice = async (invoice: any) => {
    console.log('💾 Saving invoice to database:', invoice);
    const { data, error } = await database.createInvoice(invoice);
    console.log('📊 Invoice save result:', { data, error });
    if (!error && data) {
      setSavedInvoices(prev => [data, ...prev]);
      await TierManager.updateUsage('invoices');
      console.log('✅ Invoice saved successfully');
      alert('Invoice saved successfully!');
      if(error){
        console.error('❌ Failed to save invoice:', error);
        alert(`Failed to save invoice: ${error?.message || 'Please try again.'}`);
      }
    }
  };

  const exportAllInvoices = () => {
    const csvContent = [
      ['Invoice Number', 'Client Name', 'Amount', 'Status', 'Created Date', 'Due Date'],
      ...savedInvoices.map(inv => [
        inv.invoice_number,
        inv.client_name,
        inv.amount,
        inv.status,
        new Date(inv.created_at).toLocaleDateString(),
        inv.due_date
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
  const tools = [
    { id: 'invoice', name: 'Invoice Generator', icon: FileText, description: 'Create professional invoices' },
    { id: 'budget', name: 'Budget Planner', icon: Calculator, description: 'Plan and track budgets' },
    { id: 'forecast', name: 'Financial Forecast', icon: TrendingUp, description: 'Predict financial trends' },
    { id: 'reports', name: 'Financial Reports', icon: PieChart, description: 'Generate financial reports' },
  ];

  const renderBudgetPlanner = () => (
    <div className="space-y-6">
      <div className="text-center py-8">
        <Calculator className="w-16 h-16 text-slate-400 mx-auto mb-4" />
        <p className="text-slate-600 dark:text-gray-400">Budget Planner will be available soon</p>
        <p className="text-sm text-slate-500 dark:text-gray-500">Use the Accounting Tools for expense and income tracking</p>
      </div>
    </div>
  );

  const renderForecast = () => (
    <div className="space-y-6">
      <div className="bg-slate-50 dark:bg-gray-700 rounded-lg p-6 border dark:border-gray-600">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Financial Forecast Input</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Current Monthly Revenue *
            </label>
            <input
              type="number"
              value={forecastForm.currentRevenue}
              onChange={(e) => setForecastForm(prev => ({ ...prev, currentRevenue: e.target.value }))}
              placeholder="5000"
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Expected Growth Rate (%) *
            </label>
            <input
              type="number"
              value={forecastForm.growthRate}
              onChange={(e) => setForecastForm(prev => ({ ...prev, growthRate: e.target.value }))}
              placeholder="10"
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Forecast Period *
            </label>
            <select 
              value={forecastForm.period}
              onChange={(e) => setForecastForm(prev => ({ ...prev, period: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white" 
              required
            >
              <option value="">Select Period</option>
              <option value="6">6 Months</option>
              <option value="12">12 Months</option>
              <option value="24">24 Months</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Business Type *
            </label>
            <select 
              value={forecastForm.businessType}
              onChange={(e) => setForecastForm(prev => ({ ...prev, businessType: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white" 
              required
            >
              <option value="">Select Type</option>
              <option value="saas">SaaS</option>
              <option value="ecommerce">E-commerce</option>
              <option value="service">Service Business</option>
              <option value="retail">Retail</option>
            </select>
          </div>
        </div>
        <button 
          onClick={generateForecast}
          className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Generate Forecast
        </button>
      </div>
      
      {forecastData && (
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-slate-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">
            {forecastForm.period}-Month Revenue Forecast
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {forecastData.forecast.map((month: any) => (
              <div key={month.month} className="flex justify-between items-center p-3 bg-slate-50 dark:bg-gray-700 rounded">
                <span className="font-medium text-slate-800 dark:text-white">{month.monthName}</span>
                <div className="text-right">
                  <span className="text-green-600 font-bold">
                    {CurrencyManager.formatAmount(month.revenue)}
                  </span>
                  <div className="text-xs text-slate-500">+{month.growth}%</div>
                </div>
              </div>
            ))}
          </div>
          <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <p className="text-green-800 dark:text-green-300 font-semibold">
              Total projected growth: {forecastData.totalGrowth}% over {forecastForm.period} months
            </p>
          </div>
        </div>
      )}
    </div>
  );

  const renderReports = () => (
    <div className="space-y-6">
      <div className="bg-slate-50 dark:bg-gray-700 rounded-lg p-6 border dark:border-gray-600">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Generate Financial Report</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Report Type *
            </label>
            <select className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white" required>
              <option value="">Select Report Type</option>
              <option value="income">Income Statement</option>
              <option value="balance">Balance Sheet</option>
              <option value="cashflow">Cash Flow</option>
              <option value="summary">Financial Summary</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Period *
            </label>
            <select className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white" required>
              <option value="">Select Period</option>
              <option value="monthly">This Month</option>
              <option value="quarterly">This Quarter</option>
              <option value="yearly">This Year</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
        </div>
        <button 
          onClick={() => alert('Report generation will be implemented with real data from database')}
          className="mt-4 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Generate Report
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-slate-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Revenue Summary</h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-gray-400">Total Revenue</span>
              <span className="font-bold text-green-600">
                {CurrencyManager.formatAmount(savedInvoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.amount || 0), 0))}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-gray-400">Pending Invoices</span>
              <span className="font-bold text-yellow-600">
                {CurrencyManager.formatAmount(savedInvoices.filter(inv => inv.status === 'sent').reduce((sum, inv) => sum + (inv.amount || 0), 0))}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-slate-600 dark:text-gray-400">Total Invoices</span>
              <span className="font-bold text-blue-600">{savedInvoices.length}</span>
            </div>
          </div>
        </div>
        
        <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
          <h3 className="text-lg font-semibold text-green-800 dark:text-green-300 mb-4">📊 Financial Insights</h3>
          <ul className="space-y-2 text-green-700 dark:text-green-400 text-sm">
            <li>• {savedInvoices.filter(inv => inv.status === 'paid').length} invoices paid this month</li>
            <li>• {savedInvoices.filter(inv => inv.status === 'sent').length} invoices pending payment</li>
            <li>• Average invoice value: {CurrencyManager.formatAmount(savedInvoices.reduce((sum, inv) => sum + (inv.amount || 0), 0) / Math.max(savedInvoices.length, 1))}</li>
            <li>• Payment rate: {savedInvoices.length > 0 ? Math.round((savedInvoices.filter(inv => inv.status === 'paid').length / savedInvoices.length) * 100) : 0}%</li>
          </ul>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800">Finance Tools</h1>
        <p className="text-slate-600 mt-1">Manage your finances with AI-powered tools</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tool Selection */}
        <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-4">Finance Tools</h2>
          <div className="space-y-3">
            {tools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  className={`w-full p-4 rounded-lg border text-left transition-colors ${
                    selectedTool === tool.id
                      ? 'border-green-500 bg-green-50 text-green-700'
                      : 'border-slate-200 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className="w-5 h-5" />
                    <div>
                      <h3 className="font-medium">{tool.name}</h3>
                      <p className="text-sm text-slate-600">{tool.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tool Content */}
        <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow-sm border border-slate-200">
          <h2 className="text-xl font-semibold text-slate-800 mb-6">
            {tools.find(t => t.id === selectedTool)?.name}
          </h2>
          
          {selectedTool === 'invoice' && <InvoiceGenerator onSave={handleSaveInvoice} />}
          {selectedTool === 'budget' && renderBudgetPlanner()}
          {selectedTool === 'forecast' && renderForecast()}
          {selectedTool === 'reports' && renderReports()}
        </div>
      </div>

      {/* Recent Invoices */}
      <div className="bg-white rounded-lg p-6 shadow-sm border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-800">All Invoices</h2>
          <button 
            onClick={() => exportAllInvoices()}
            className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export All</span>
          </button>
        </div>
        
        {loading ? (
          <div className="text-center py-8">
            <div className="w-8 h-8 border-2 border-green-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
            <p className="text-slate-600 mt-2">Loading invoices...</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-200">
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Invoice ID</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Client</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Created</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Due Date</th>
                  <th className="text-left py-3 px-4 font-medium text-slate-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {savedInvoices.map((invoice) => (
                  <tr key={invoice.id} className="border-b border-slate-100 hover:bg-slate-50">
                    <td className="py-3 px-4 font-medium text-slate-800">{invoice.invoice_number}</td>
                    <td className="py-3 px-4 text-slate-600">{invoice.client_name}</td>
                    <td className="py-3 px-4 text-slate-600">{CurrencyManager.formatAmount(invoice.amount || 0)}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        invoice.status === 'paid' ? 'bg-green-100 text-green-800' :
                        invoice.status === 'sent' ? 'bg-blue-100 text-blue-800' :
                        invoice.status === 'overdue' ? 'bg-red-100 text-red-800' :
                        'bg-slate-100 text-slate-800'
                      }`}>
                        {invoice.status?.charAt(0).toUpperCase() + invoice.status?.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600">
                      {new Date(invoice.created_at).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-slate-600">{invoice.due_date}</td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => generateInvoicePDF(invoice, false)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded"
                          title="Preview Invoice"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => generateInvoicePDF(invoice, true)}
                          className="p-1 text-green-600 hover:bg-green-50 rounded"
                          title="Download PDF"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            const newAmount = prompt('Enter new amount:', invoice.amount?.toString());
                            if (newAmount && !isNaN(parseFloat(newAmount))) {
                              const updatedInvoices = savedInvoices.map(inv => 
                                inv.id === invoice.id 
                                  ? { ...inv, amount: parseFloat(newAmount) }
                                  : inv
                              );
                              setSavedInvoices(updatedInvoices);
                              alert('Invoice updated successfully!');
                            }
                          }}
                          className="p-1 text-slate-600 hover:bg-slate-50 rounded"
                        >
                          <Edit className="w-4 h-4" />
                        </button>
                        <button 
                          onClick={() => {
                            if (confirm('Are you sure you want to delete this invoice?')) {
                              setSavedInvoices(prev => prev.filter(inv => inv.id !== invoice.id));
                            }
                          }}
                          className="p-1 text-red-600 hover:bg-red-50 rounded"
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
        )}
      </div>
    </div>
  );
};

export default FinanceTools;