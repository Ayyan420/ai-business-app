import React, { useState, useEffect } from 'react';
import { 
  Calculator, 
  TrendingUp, 
  PieChart, 
  FileText,
  DollarSign,
  Calendar,
  BarChart3,
  Download,
  Plus,
  Eye,
  Zap
} from 'lucide-react';
import { deepseekAI } from '../lib/deepseek';
import { database } from '../lib/database';
import { TierManager } from '../lib/tiers';
import { CurrencyManager } from '../lib/currency';

const AccountingTools: React.FC = () => {
  const [selectedTool, setSelectedTool] = useState('expense-tracker');
  const [expenses, setExpenses] = useState<any[]>([]);
  const [income, setIncome] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [aiInsights, setAiInsights] = useState('');
  const [isGeneratingInsights, setIsGeneratingInsights] = useState(false);
  const [financialSummary, setFinancialSummary] = useState<any>(null);

  const [expenseForm, setExpenseForm] = useState({
    description: '',
    amount: '',
    category: 'office',
    date: new Date().toISOString().split('T')[0],
    receipt: false
  });

  const [incomeForm, setIncomeForm] = useState({
    description: '',
    amount: '',
    source: 'client',
    date: new Date().toISOString().split('T')[0]
  });

  const tools = [
    { id: 'expense-tracker', name: 'Expense Tracker', icon: Calculator, description: 'Track business expenses' },
    { id: 'income-tracker', name: 'Income Tracker', icon: TrendingUp, description: 'Monitor revenue streams' },
    { id: 'financial-reports', name: 'Financial Reports', icon: FileText, description: 'Generate financial reports' },
  ];

  const expenseCategories = [
    { id: 'office', name: 'Office Supplies' },
    { id: 'marketing', name: 'Marketing' },
    { id: 'travel', name: 'Travel' },
    { id: 'utilities', name: 'Utilities' },
    { id: 'software', name: 'Software' },
    { id: 'equipment', name: 'Equipment' },
    { id: 'meals', name: 'Meals & Entertainment' },
    { id: 'other', name: 'Other' }
  ];

  const incomeSources = [
    { id: 'client', name: 'Client Payment' },
    { id: 'product', name: 'Product Sales' },
    { id: 'service', name: 'Service Revenue' },
    { id: 'investment', name: 'Investment Income' },
    { id: 'other', name: 'Other Income' }
  ];

  useEffect(() => {
    loadFinancialData();
    loadFinancialSummary();
  }, []);

  const loadFinancialData = async () => {
    setLoading(true);
    try {
      const [expensesResult, incomeResult] = await Promise.all([
        database.getExpenses(),
        database.getIncome()
      ]);
      
      if (!expensesResult.error && expensesResult.data) {
        setExpenses(expensesResult.data);
      }
      
      if (!incomeResult.error && incomeResult.data) {
        setIncome(incomeResult.data);
      }
    } catch (error) {
      console.error('Error loading financial data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadFinancialSummary = async () => {
    try {
      const { data, error } = await database.getFinancialSummary();
      if (!error && data) {
        setFinancialSummary(data);
      }
    } catch (error) {
      console.error('Error loading financial summary:', error);
    }
  };

  const addExpense = async () => {
    if (!expenseForm.description || !expenseForm.amount) {
      alert('Please fill in description and amount');
      return;
    }

    const expenseData = {
      ...expenseForm,
      amount: parseFloat(expenseForm.amount),
      has_receipt: expenseForm.receipt
    };

    const { data, error } = await database.createExpense(expenseData);
    if (!error && data) {
      setExpenses(prev => [data, ...prev]);
      loadFinancialSummary(); // Refresh summary
    } else {
      alert('Error adding expense. Please try again.');
    }
    
    setExpenseForm({
      description: '',
      amount: '',
      category: 'office',
      date: new Date().toISOString().split('T')[0],
      receipt: false
    });
  };

  const addIncome = async () => {
    if (!incomeForm.description || !incomeForm.amount || !incomeForm.date) {
      alert('Please fill in description, amount, and date');
      return;
    }

    const incomeData = {
      ...incomeForm,
      amount: parseFloat(incomeForm.amount)
    };

    const { data, error } = await database.createIncome(incomeData);
    if (!error && data) {
      setIncome(prev => [data, ...prev]);
      loadFinancialSummary(); // Refresh summary
    } else {
      alert('Error adding income. Please try again.');
    }
    
    setIncomeForm({
      description: '',
      amount: '',
      source: 'client',
      date: new Date().toISOString().split('T')[0]
    });
  };

  const generateAIInsights = async () => {
    if (!TierManager.canUseFeature('aiQueries')) {
      alert('You\'ve reached your AI query limit. Please upgrade to continue.');
      return;
    }

    setIsGeneratingInsights(true);

    try {
      // Use financial summary data
      const summary = financialSummary || {
        total_income: income.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0),
        total_expenses: expenses.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0),
        expense_categories: {},
        income_sources: {}
      };
      
      const netProfit = summary.total_income - summary.total_expenses;

      const prompt = `Analyze this business financial data and provide insights:

Total Income: $${summary.total_income}
Total Expenses: $${summary.total_expenses}
Net Profit: $${netProfit}

Expenses by Category:
${Object.entries(summary.expense_categories || {}).map(([cat, amount]) => `- ${cat}: $${amount}`).join('\n')}

Income by Source:
${Object.entries(summary.income_sources || {}).map(([source, amount]) => `- ${source}: $${amount}`).join('\n')}

Recent Transactions: ${expenses.length + income.length}

Please provide:
1. Financial health assessment
2. Cost optimization recommendations
3. Revenue growth suggestions
4. Tax planning advice
5. Cash flow insights`;

      const insights = await deepseekAI.generateContent(prompt, 'general');
      setAiInsights(insights);
      TierManager.updateUsage('aiQueries');
    } catch (error) {
      console.error('AI insights error:', error);
      alert('Error generating insights. Please try again.');
    } finally {
      setIsGeneratingInsights(false);
    }
  };

  const exportFinancialReport = () => {
    const totalIncome = income.reduce((sum, item) => sum + item.amount, 0);
    const totalExpenses = expenses.reduce((sum, item) => sum + item.amount, 0);
    const netProfit = totalIncome - totalExpenses;

    const report = {
      reportDate: new Date().toISOString(),
      summary: {
        totalIncome,
        totalExpenses,
        netProfit,
        profitMargin: totalIncome > 0 ? ((netProfit / totalIncome) * 100).toFixed(2) : 0
      },
      income,
      expenses,
      insights: aiInsights
    };

    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `financial-report-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const renderExpenseTracker = () => (
    <div className="space-y-6">
      {/* Add Expense Form */}
      <div className="bg-slate-50 dark:bg-gray-700 rounded-lg p-6 border dark:border-gray-600">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Add New Expense</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <input
              type="text"
              value={expenseForm.description}
              onChange={(e) => setExpenseForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Office supplies, software license..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Amount *
            </label>
            <input
              type="number"
              step="0.01"
              value={expenseForm.amount}
              onChange={(e) => setExpenseForm(prev => ({ ...prev, amount: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Category
            </label>
            <select
              value={expenseForm.category}
              onChange={(e) => setExpenseForm(prev => ({ ...prev, category: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {expenseCategories.map(cat => (
                <option key={cat.id} value={cat.id}>{cat.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Date *
            </label>
            <input
              type="date"
              value={expenseForm.date}
              onChange={(e) => setExpenseForm(prev => ({ ...prev, date: e.target.value }))}
              required
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
        <div className="mt-4 flex items-center space-x-2">
          <input
            type="checkbox"
            id="receipt"
            checked={expenseForm.receipt}
            onChange={(e) => setExpenseForm(prev => ({ ...prev, receipt: e.target.checked }))}
            className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
          />
          <label htmlFor="receipt" className="text-sm text-slate-700 dark:text-gray-300">
            Receipt available
          </label>
        </div>
        <button
          onClick={addExpense}
          className="mt-4 flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Expense</span>
        </button>
      </div>

      {/* Expenses List */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Recent Expenses</h3>
        <div className="space-y-3">
          {expenses.slice(-5).reverse().map((expense) => (
            <div key={expense.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-slate-800 dark:text-white">{expense.description}</h4>
                  <p className="text-sm text-slate-600 dark:text-gray-400">
                    {expenseCategories.find(c => c.id === expense.category)?.name} • {expense.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-red-600">{CurrencyManager.formatAmount(expense.amount)}</p>
                  {expense.receipt && (
                    <span className="text-xs text-green-600">Receipt ✓</span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderIncomeTracker = () => (
    <div className="space-y-6">
      {/* Add Income Form */}
      <div className="bg-slate-50 dark:bg-gray-700 rounded-lg p-6 border dark:border-gray-600">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Add New Income</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Description *
            </label>
            <input
              type="text"
              value={incomeForm.description}
              onChange={(e) => setIncomeForm(prev => ({ ...prev, description: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Client payment, product sale..."
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Amount *
            </label>
            <input
              type="number"
              step="0.01"
              value={incomeForm.amount}
              onChange={(e) => setIncomeForm(prev => ({ ...prev, amount: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="0.00"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Source
            </label>
            <select
              value={incomeForm.source}
              onChange={(e) => setIncomeForm(prev => ({ ...prev, source: e.target.value }))}
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
            >
              {incomeSources.map(source => (
                <option key={source.id} value={source.id}>{source.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-gray-300 mb-2">
              Date *
            </label>
            <input
              type="date"
              value={incomeForm.date}
              onChange={(e) => setIncomeForm(prev => ({ ...prev, date: e.target.value }))}
              required
              className="w-full px-3 py-2 border border-slate-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              max={new Date().toISOString().split('T')[0]}
            />
          </div>
        </div>
        <button
          onClick={addIncome}
          className="mt-4 flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>Add Income</span>
        </button>
      </div>

      {/* Income List */}
      <div>
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Recent Income</h3>
        <div className="space-y-3">
          {income.slice(-5).reverse().map((incomeItem) => (
            <div key={incomeItem.id} className="p-4 bg-white dark:bg-gray-800 rounded-lg border border-slate-200 dark:border-gray-700">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-slate-800 dark:text-white">{incomeItem.description}</h4>
                  <p className="text-sm text-slate-600 dark:text-gray-400">
                    {incomeSources.find(s => s.id === incomeItem.source)?.name} • {incomeItem.date}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold text-green-600">{CurrencyManager.formatAmount(incomeItem.amount)}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderFinancialReports = () => {
    const summary = financialSummary || {
      total_income: income.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0),
      total_expenses: expenses.reduce((sum, item) => sum + parseFloat(item.amount || 0), 0),
      net_profit: 0,
      expense_categories: {},
      income_sources: {}
    };

    return (
      <div className="space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-6 border border-green-200 dark:border-green-800">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-green-100 dark:bg-green-900/40 rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-green-800 dark:text-green-300">{CurrencyManager.formatAmount(summary.total_income)}</p>
                <p className="text-sm text-green-600 dark:text-green-400">Total Income</p>
              </div>
            </div>
          </div>

          <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-6 border border-red-200 dark:border-red-800">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-red-100 dark:bg-red-900/40 rounded-lg flex items-center justify-center">
                <Calculator className="w-6 h-6 text-red-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-red-800 dark:text-red-300">{CurrencyManager.formatAmount(summary.total_expenses)}</p>
                <p className="text-sm text-red-600 dark:text-red-400">Total Expenses</p>
              </div>
            </div>
          </div>

          <div className={`${summary.net_profit >= 0 ? 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800' : 'bg-orange-50 dark:bg-orange-900/20 border-orange-200 dark:border-orange-800'} rounded-lg p-6 border`}>
            <div className="flex items-center space-x-3">
              <div className={`w-12 h-12 ${summary.net_profit >= 0 ? 'bg-blue-100 dark:bg-blue-900/40' : 'bg-orange-100 dark:bg-orange-900/40'} rounded-lg flex items-center justify-center`}>
                <DollarSign className={`w-6 h-6 ${summary.net_profit >= 0 ? 'text-blue-600' : 'text-orange-600'}`} />
              </div>
              <div>
                <p className={`text-2xl font-bold ${summary.net_profit >= 0 ? 'text-blue-800 dark:text-blue-300' : 'text-orange-800 dark:text-orange-300'}`}>
                  {CurrencyManager.formatAmount(summary.net_profit)}
                </p>
                <p className={`text-sm ${summary.net_profit >= 0 ? 'text-blue-600 dark:text-blue-400' : 'text-orange-600 dark:text-orange-400'}`}>
                  Net {summary.net_profit >= 0 ? 'Profit' : 'Loss'}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-slate-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Expenses by Category</h3>
            <div className="space-y-3">
              {Object.entries(summary.expense_categories || {}).map(([category, amount]) => (
                <div key={category} className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-gray-400 capitalize">{category}</span>
                  <span className="font-semibold text-slate-800 dark:text-white">
                    {CurrencyManager.formatAmount(amount as number)}
                  </span>
                </div>
              ))}
            </div>
          </div>
          
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-slate-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Income by Source</h3>
            <div className="space-y-3">
              {Object.entries(summary.income_sources || {}).map(([source, amount]) => (
                <div key={source} className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-gray-400 capitalize">{source}</span>
                  <span className="font-semibold text-slate-800 dark:text-white">
                    {CurrencyManager.formatAmount(amount as number)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* AI Insights */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 border border-slate-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white">AI Financial Insights</h3>
            <button
              onClick={generateAIInsights}
              disabled={isGeneratingInsights}
              className="flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50"
            >
              {isGeneratingInsights ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>Analyzing...</span>
                </>
              ) : (
                <>
                  <Zap className="w-4 h-4" />
                  <span>Generate Insights</span>
                </>
              )}
            </button>
          </div>
          
          {aiInsights ? (
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4 border border-purple-200 dark:border-purple-800">
              <pre className="whitespace-pre-wrap text-purple-800 dark:text-purple-300 text-sm">
                {aiInsights}
              </pre>
            </div>
          ) : (
            <div className="text-center py-8">
              <BarChart3 className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <p className="text-slate-600 dark:text-gray-400">Click "Generate Insights" to get AI-powered financial analysis</p>
            </div>
          )}
        </div>

        {/* Export Button */}
        <div className="flex justify-center">
          <button
            onClick={exportFinancialReport}
            className="flex items-center space-x-2 px-6 py-3 bg-slate-800 dark:bg-gray-600 text-white rounded-lg hover:bg-slate-900 dark:hover:bg-gray-500 transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Export Financial Report</span>
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-slate-800 dark:text-white">AI Accounting Tools</h1>
        <p className="text-slate-600 dark:text-gray-400 mt-1">Manage your finances with AI-powered insights</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Tool Selection */}
        <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-4">Accounting Tools</h2>
          <div className="space-y-3">
            {tools.map((tool) => {
              const IconComponent = tool.icon;
              return (
                <button
                  key={tool.id}
                  onClick={() => setSelectedTool(tool.id)}
                  className={`w-full p-4 rounded-lg border text-left transition-colors ${
                    selectedTool === tool.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'border-slate-200 dark:border-gray-600 hover:border-slate-300 dark:hover:border-gray-500'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <IconComponent className="w-5 h-5" />
                    <div>
                      <h3 className="font-medium text-sm">{tool.name}</h3>
                      <p className="text-xs text-slate-600 dark:text-gray-400">{tool.description}</p>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Tool Content */}
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-sm border border-slate-200 dark:border-gray-700">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white mb-6">
            {tools.find(t => t.id === selectedTool)?.name}
          </h2>
          
          {selectedTool === 'expense-tracker' && renderExpenseTracker()}
          {selectedTool === 'income-tracker' && renderIncomeTracker()}
          {selectedTool === 'financial-reports' && renderFinancialReports()}
        </div>
      </div>
    </div>
  );
};

export default AccountingTools;