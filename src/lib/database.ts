import { supabase, isDemoMode } from './supabase'

// Demo data storage for when database is not connected
let demoData = {
  invoices: [
    { id: '1', invoice_number: 'INV-001', client_name: 'Acme Corp', amount: 2500, status: 'paid', created_at: '2024-01-15', due_date: '2024-02-15', items: [] },
    { id: '2', invoice_number: 'INV-002', client_name: 'Tech Solutions', amount: 1800, status: 'sent', created_at: '2024-01-18', due_date: '2024-02-18', items: [] },
    { id: '3', invoice_number: 'INV-003', client_name: 'Global Inc', amount: 3200, status: 'overdue', created_at: '2024-01-10', due_date: '2024-02-10', items: [] },
  ],
  campaigns: [
    { id: '1', title: 'Q4 Marketing Campaign', type: 'ad-copy', content: 'Sample ad copy...', created_at: '2024-01-20' },
    { id: '2', title: 'Email Newsletter', type: 'email', content: 'Sample email content...', created_at: '2024-01-22' },
  ],
  tasks: [
    { id: '1', title: 'Review Q4 marketing campaign', priority: 'high', assignee: 'Sarah Johnson', due_date: '2024-01-25', status: 'in-progress' },
    { id: '2', title: 'Update client database', priority: 'medium', assignee: 'Mike Chen', due_date: '2024-01-28', status: 'pending' },
    { id: '3', title: 'Prepare monthly report', priority: 'high', assignee: 'Lisa Wang', due_date: '2024-01-30', status: 'pending' },
    { id: '4', title: 'Optimize website performance', priority: 'low', assignee: 'David Kim', due_date: '2024-02-02', status: 'completed' },
  ],
  stats: {
    revenue: 0, // Will be calculated from actual invoices
    campaigns: 0, // Will be calculated from actual campaigns  
    members: 12,
    tasks: 0 // Will be calculated from actual tasks
  }
}

export const database = {
  // Invoices
  async getInvoices() {
    if (isDemoMode) {
      return { data: demoData.invoices, error: null }
    }
    return await supabase.from('invoices').select('*').order('created_at', { ascending: false })
  },

  async createInvoice(invoice: any) {
    if (isDemoMode) {
      const newInvoice = { ...invoice, id: Date.now().toString(), created_at: new Date().toISOString() }
      demoData.invoices.unshift(newInvoice)
      return { data: newInvoice, error: null }
    }
    return await supabase.from('invoices').insert(invoice).select().single()
  },

  async updateInvoice(id: string, updates: any) {
    if (isDemoMode) {
      const index = demoData.invoices.findIndex(inv => inv.id === id)
      if (index !== -1) {
        demoData.invoices[index] = { ...demoData.invoices[index], ...updates }
        return { data: demoData.invoices[index], error: null }
      }
      return { data: null, error: 'Invoice not found' }
    }
    return await supabase.from('invoices').update(updates).eq('id', id).select().single()
  },

  // Campaigns
  async getCampaigns() {
    if (isDemoMode) {
      return { data: demoData.campaigns, error: null }
    }
    return await supabase.from('campaigns').select('*').order('created_at', { ascending: false })
  },

  async createCampaign(campaign: any) {
    if (isDemoMode) {
      const newCampaign = { ...campaign, id: Date.now().toString(), created_at: new Date().toISOString() }
      demoData.campaigns.unshift(newCampaign)
      return { data: newCampaign, error: null }
    }
    return await supabase.from('campaigns').insert(campaign).select().single()
  },

  // Tasks
  async getTasks() {
    if (isDemoMode) {
      return { data: demoData.tasks, error: null }
    }
    return await supabase.from('tasks').select('*').order('created_at', { ascending: false })
  },

  async createTask(task: any) {
    if (isDemoMode) {
      const newTask = { ...task, id: Date.now().toString(), created_at: new Date().toISOString() }
      demoData.tasks.unshift(newTask)
      demoData.stats.tasks += 1
      return { data: newTask, error: null }
    }
    return await supabase.from('tasks').insert(task).select().single()
  },

  async updateTask(id: string, updates: any) {
    if (isDemoMode) {
      const index = demoData.tasks.findIndex(task => task.id === id)
      if (index !== -1) {
        demoData.tasks[index] = { ...demoData.tasks[index], ...updates }
        return { data: demoData.tasks[index], error: null }
      }
      return { data: null, error: 'Task not found' }
    }
    return await supabase.from('tasks').update(updates).eq('id', id).select().single()
  },

  // Stats
  async getStats() {
    if (isDemoMode) {
      // Calculate real stats from actual data
      const totalRevenue = demoData.invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0);
      const completedTasks = demoData.tasks.filter(task => task.status === 'completed').length;
      
      return { 
        data: {
          revenue: totalRevenue,
          campaigns: demoData.campaigns.length,
          members: 12,
          tasks: completedTasks
        }, 
        error: null 
      }
    }
    // In real implementation, this would aggregate data from multiple tables
    return { data: demoData.stats, error: null }
  }
}