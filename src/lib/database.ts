import { supabase, isDemoMode, auth } from './supabase'

// Demo data storage for when database is not connected
let demoData = {
  invoices: [
    { 
      id: '1', 
      invoice_number: 'INV-001', 
      client_name: 'Acme Corp', 
      client_email: 'contact@acme.com',
      amount: 2500, 
      tax_amount: 250,
      tax_rate: 10,
      status: 'paid', 
      created_at: '2024-01-15', 
      due_date: '2024-02-15', 
      items: [
        { description: 'Web Development', quantity: 1, rate: 2000, amount: 2000 },
        { description: 'SEO Optimization', quantity: 1, rate: 500, amount: 500 }
      ],
      company_info: {
        name: 'Your Business',
        address: '123 Business St',
        email: 'hello@yourbusiness.com',
        phone: '+1 300 1234567'
      },
      notes: 'Thank you for your business!',
      terms: 'Payment due within 30 days'
    }
  ],
  campaigns: [],
  tasks: [],
  portfolios: [],
  leads: [],
  payments: [],
  team_members: []
}

export const database = {
  // Users
  async getCurrentUser() {
    if (isDemoMode) {
      const demoUser = localStorage.getItem('demoUser')
      return demoUser ? { data: JSON.parse(demoUser), error: null } : { data: null, error: null }
    }
    
    try {
      const { data: { user }, error } = await auth.getUser()
      if (error || !user) return { data: null, error }
      
      const { data: profile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      
      console.log('Current user profile:', { profile, profileError })
      return { data: profile, error: profileError }
    } catch (error) {
      console.error('Get current user error:', error)
      return { data: null, error }
    }
  },

  async updateUserProfile(userId: string, updates: any) {
    if (isDemoMode) {
      const demoUser = JSON.parse(localStorage.getItem('demoUser') || '{}')
      const updatedUser = { ...demoUser, ...updates, updated_at: new Date().toISOString() }
      localStorage.setItem('demoUser', JSON.stringify(updatedUser))
      return { data: updatedUser, error: null }
    }
    
    try {
      console.log('Updating user profile:', { userId, updates })
      return await supabase
        .from('users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single()
    } catch (error) {
      console.error('Update user profile error:', error)
      return { data: null, error }
    }
  },

  // Invoices
  async getInvoices(userId?: string) {
    if (isDemoMode) {
      return { data: demoData.invoices, error: null }
    }
    
    try {
      const { data: { user } } = await auth.getUser()
      if (!user) return { data: [], error: 'Not authenticated' }
      
      const { data, error } = await supabase
        .from('invoices')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      console.log('Fetched invoices:', { data, error })
      return { data: data || [], error }
    } catch (error) {
      console.error('Get invoices error:', error)
      return { data: [], error }
    }
  },

  async createInvoice(invoice: any) {
    if (isDemoMode) {
      const newInvoice = { 
        ...invoice, 
        id: Date.now().toString(), 
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      demoData.invoices.unshift(newInvoice)
      return { data: newInvoice, error: null }
    }
    
    try {
      const { data: { user } } = await auth.getUser()
      if (!user) return { data: null, error: 'User not authenticated' }
      
      console.log('Creating invoice:', { ...invoice, user_id: user.id })
      const { data, error } = await supabase
        .from('invoices')
        .insert({ ...invoice, user_id: user.id })
        .select()
        .single()
      
      console.log('Invoice creation result:', { data, error })
      return { data, error }
    } catch (error) {
      console.error('Create invoice error:', error)
      return { data: null, error }
    }
  },

  async updateInvoice(id: string, updates: any) {
    if (isDemoMode) {
      const index = demoData.invoices.findIndex(inv => inv.id === id)
      if (index !== -1) {
        demoData.invoices[index] = { 
          ...demoData.invoices[index], 
          ...updates, 
          updated_at: new Date().toISOString() 
        }
        return { data: demoData.invoices[index], error: null }
      }
      return { data: null, error: 'Invoice not found' }
    }
    
    try {
      return await supabase
        .from('invoices')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
    } catch (error) {
      console.error('Update invoice error:', error)
      return { data: null, error }
    }
  },

  async deleteInvoice(id: string) {
    if (isDemoMode) {
      demoData.invoices = demoData.invoices.filter(inv => inv.id !== id)
      return { error: null }
    }
    
    try {
      return await supabase.from('invoices').delete().eq('id', id)
    } catch (error) {
      console.error('Delete invoice error:', error)
      return { error }
    }
  },

  // Campaigns
  async getCampaigns(userId?: string) {
    if (isDemoMode) {
      return { data: demoData.campaigns, error: null }
    }
    
    try {
      const { data: { user } } = await auth.getUser()
      if (!user) return { data: [], error: 'Not authenticated' }
      
      const { data, error } = await supabase
        .from('campaigns')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      console.log('Fetched campaigns:', { data, error })
      return { data: data || [], error }
    } catch (error) {
      console.error('Get campaigns error:', error)
      return { data: [], error }
    }
  },

  async createCampaign(campaign: any) {
    if (isDemoMode) {
      const newCampaign = { 
        ...campaign, 
        id: Date.now().toString(), 
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        status: campaign.status || 'draft'
      }
      demoData.campaigns.unshift(newCampaign)
      return { data: newCampaign, error: null }
    }
    
    try {
      const { data: { user } } = await auth.getUser()
      if (!user) return { data: null, error: 'User not authenticated' }
      
      console.log('Creating campaign:', { ...campaign, user_id: user.id })
      const { data, error } = await supabase
        .from('campaigns')
        .insert({ ...campaign, user_id: user.id })
        .select()
        .single()
      
      console.log('Campaign creation result:', { data, error })
      return { data, error }
    } catch (error) {
      console.error('Create campaign error:', error)
      return { data: null, error }
    }
  },

  async updateCampaign(id: string, updates: any) {
    if (isDemoMode) {
      const index = demoData.campaigns.findIndex(camp => camp.id === id)
      if (index !== -1) {
        demoData.campaigns[index] = { 
          ...demoData.campaigns[index], 
          ...updates, 
          updated_at: new Date().toISOString() 
        }
        return { data: demoData.campaigns[index], error: null }
      }
      return { data: null, error: 'Campaign not found' }
    }
    
    try {
      return await supabase
        .from('campaigns')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
    } catch (error) {
      console.error('Update campaign error:', error)
      return { data: null, error }
    }
  },

  // Tasks
  async getTasks(userId?: string) {
    if (isDemoMode) {
      return { data: demoData.tasks, error: null }
    }
    
    try {
      const { data: { user } } = await auth.getUser()
      if (!user) return { data: [], error: 'Not authenticated' }
      
      const { data, error } = await supabase
        .from('tasks')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      console.log('Fetched tasks:', { data, error })
      return { data: data || [], error }
    } catch (error) {
      console.error('Get tasks error:', error)
      return { data: [], error }
    }
  },

  async createTask(task: any) {
    if (isDemoMode) {
      const newTask = { 
        ...task, 
        id: Date.now().toString(), 
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      demoData.tasks.unshift(newTask)
      return { data: newTask, error: null }
    }
    
    try {
      const { data: { user } } = await auth.getUser()
      if (!user) return { data: null, error: 'User not authenticated' }
      
      console.log('Creating task:', { ...task, user_id: user.id })
      const { data, error } = await supabase
        .from('tasks')
        .insert({ ...task, user_id: user.id })
        .select()
        .single()
      
      console.log('Task creation result:', { data, error })
      return { data, error }
    } catch (error) {
      console.error('Create task error:', error)
      return { data: null, error }
    }
  },

  async updateTask(id: string, updates: any) {
    if (isDemoMode) {
      const index = demoData.tasks.findIndex(task => task.id === id)
      if (index !== -1) {
        demoData.tasks[index] = { 
          ...demoData.tasks[index], 
          ...updates, 
          updated_at: new Date().toISOString() 
        }
        return { data: demoData.tasks[index], error: null }
      }
      return { data: null, error: 'Task not found' }
    }
    
    try {
      return await supabase
        .from('tasks')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
    } catch (error) {
      console.error('Update task error:', error)
      return { data: null, error }
    }
  },

  async deleteTask(id: string) {
    if (isDemoMode) {
      demoData.tasks = demoData.tasks.filter(task => task.id !== id)
      return { error: null }
    }
    
    try {
      return await supabase.from('tasks').delete().eq('id', id)
    } catch (error) {
      console.error('Delete task error:', error)
      return { error }
    }
  },

  // Business Portfolios
  async getPortfolio(userId: string) {
    if (isDemoMode) {
      const portfolio = demoData.portfolios.find(p => p.user_id === userId)
      return { data: portfolio, error: null }
    }
    
    try {
      return await supabase
        .from('portfolios')
        .select('*')
        .eq('user_id', userId)
        .single()
    } catch (error) {
      console.error('Get portfolio error:', error)
      return { data: null, error }
    }
  },

  async getPublicPortfolio(slug: string) {
    if (isDemoMode) {
      const portfolio = demoData.portfolios.find(p => p.slug === slug && p.is_public)
      return { data: portfolio, error: null }
    }
    
    try {
      return await supabase
        .from('portfolios')
        .select('*')
        .eq('slug', slug)
        .eq('is_public', true)
        .single()
    } catch (error) {
      console.error('Get public portfolio error:', error)
      return { data: null, error }
    }
  },

  async createOrUpdatePortfolio(portfolioData: any) {
    if (isDemoMode) {
      const existingIndex = demoData.portfolios.findIndex(p => p.user_id === portfolioData.user_id)
      const portfolio = {
        ...portfolioData,
        id: existingIndex >= 0 ? demoData.portfolios[existingIndex].id : Date.now().toString(),
        updated_at: new Date().toISOString()
      }
      
      if (existingIndex >= 0) {
        demoData.portfolios[existingIndex] = portfolio
      } else {
        portfolio.created_at = new Date().toISOString()
        demoData.portfolios.push(portfolio)
      }
      
      return { data: portfolio, error: null }
    }
    
    try {
      const { data: { user } } = await auth.getUser()
      if (!user) return { data: null, error: 'User not authenticated' }
      
      console.log('Creating/updating portfolio:', { ...portfolioData, user_id: user.id })
      return await supabase
        .from('portfolios')
        .upsert({ ...portfolioData, user_id: user.id })
        .select()
        .single()
    } catch (error) {
      console.error('Create/update portfolio error:', error)
      return { data: null, error }
    }
  },

  // CRM & Leads
  async getLeads(userId?: string) {
    if (isDemoMode) {
      return { data: demoData.leads, error: null }
    }
    
    try {
      const { data: { user } } = await auth.getUser()
      if (!user) return { data: [], error: 'Not authenticated' }
      
      const { data, error } = await supabase
        .from('leads')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      console.log('Fetched leads:', { data, error })
      return { data: data || [], error }
    } catch (error) {
      console.error('Get leads error:', error)
      return { data: [], error }
    }
  },

  async createLead(lead: any) {
    if (isDemoMode) {
      const newLead = { 
        ...lead, 
        id: Date.now().toString(), 
        created_at: new Date().toISOString(),
        status: lead.status || 'new'
      }
      demoData.leads.unshift(newLead)
      return { data: newLead, error: null }
    }
    
    try {
      const { data: { user } } = await auth.getUser()
      if (!user) return { data: null, error: 'User not authenticated' }
      
      console.log('Creating lead:', { ...lead, user_id: user.id })
      const { data, error } = await supabase
        .from('leads')
        .insert({ ...lead, user_id: user.id })
        .select()
        .single()
      
      console.log('Lead creation result:', { data, error })
      return { data, error }
    } catch (error) {
      console.error('Create lead error:', error)
      return { data: null, error }
    }
  },

  async updateLead(id: string, updates: any) {
    if (isDemoMode) {
      const index = demoData.leads.findIndex(lead => lead.id === id)
      if (index !== -1) {
        demoData.leads[index] = { 
          ...demoData.leads[index], 
          ...updates, 
          updated_at: new Date().toISOString() 
        }
        return { data: demoData.leads[index], error: null }
      }
      return { data: null, error: 'Lead not found' }
    }
    
    try {
      return await supabase
        .from('leads')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single()
    } catch (error) {
      console.error('Update lead error:', error)
      return { data: null, error }
    }
  },

  // Team Management
  async getTeamMembers(userId?: string) {
    if (isDemoMode) {
      return { data: demoData.team_members, error: null }
    }
    
    try {
      const { data: { user } } = await auth.getUser()
      if (!user) return { data: [], error: 'Not authenticated' }
      
      const { data, error } = await supabase
        .from('team_members')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      console.log('Fetched team members:', { data, error })
      return { data: data || [], error }
    } catch (error) {
      console.error('Get team members error:', error)
      return { data: [], error }
    }
  },

  async addTeamMember(member: any) {
    if (isDemoMode) {
      const newMember = { 
        ...member, 
        id: Date.now().toString(), 
        created_at: new Date().toISOString(),
        status: 'active',
        invited_at: new Date().toISOString()
      }
      demoData.team_members.push(newMember)
      return { data: newMember, error: null }
    }
    
    try {
      const { data: { user } } = await auth.getUser()
      if (!user) return { data: null, error: 'User not authenticated' }
      
      console.log('Adding team member:', { ...member, user_id: user.id })
      const { data, error } = await supabase
        .from('team_members')
        .insert({ 
          ...member, 
          user_id: user.id,
          invited_at: new Date().toISOString(),
          status: member.status || 'active'
        })
        .select()
        .single()
      
      console.log('Team member creation result:', { data, error })
      return { data, error }
    } catch (error) {
      console.error('Add team member error:', error)
      return { data: null, error }
    }
  },

  // Payments
  async getPayments(userId?: string) {
    if (isDemoMode) {
      return { data: demoData.payments, error: null }
    }
    
    try {
      const { data: { user } } = await auth.getUser()
      if (!user) return { data: [], error: 'Not authenticated' }
      
      const { data, error } = await supabase
        .from('payments')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
      
      console.log('Fetched payments:', { data, error })
      return { data: data || [], error }
    } catch (error) {
      console.error('Get payments error:', error)
      return { data: [], error }
    }
  },

  async createPayment(payment: any) {
    if (isDemoMode) {
      const newPayment = { 
        ...payment, 
        id: Date.now().toString(), 
        created_at: new Date().toISOString()
      }
      demoData.payments.unshift(newPayment)
      return { data: newPayment, error: null }
    }
    
    try {
      const { data: { user } } = await auth.getUser()
      if (!user) return { data: null, error: 'User not authenticated' }
      
      console.log('Creating payment:', { ...payment, user_id: user.id })
      const { data, error } = await supabase
        .from('payments')
        .insert({ ...payment, user_id: user.id })
        .select()
        .single()
      
      console.log('Payment creation result:', { data, error })
      return { data, error }
    } catch (error) {
      console.error('Create payment error:', error)
      return { data: null, error }
    }
  },

  // Admin functions
  async getAllUsers() {
    if (isDemoMode) {
      return { data: [JSON.parse(localStorage.getItem('demoUser') || '{}')], error: null }
    }
    
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
      
      console.log('Fetched all users:', { data, error })
      return { data: data || [], error }
    } catch (error) {
      console.error('Get all users error:', error)
      return { data: [], error }
    }
  },

  async getAllPayments() {
    if (isDemoMode) {
      return { data: demoData.payments, error: null }
    }
    
    try {
      const { data, error } = await supabase
        .from('payments')
        .select(`
          *,
          users (
            name,
            email
          )
        `)
        .order('created_at', { ascending: false })
      
      console.log('Fetched all payments:', { data, error })
      return { data: data || [], error }
    } catch (error) {
      console.error('Get all payments error:', error)
      return { data: [], error }
    }
  },

  async updatePaymentStatus(paymentId: string, status: string) {
    if (isDemoMode) {
      const index = demoData.payments.findIndex(p => p.id === paymentId)
      if (index !== -1) {
        demoData.payments[index].status = status
        return { data: demoData.payments[index], error: null }
      }
      return { data: null, error: 'Payment not found' }
    }
    
    try {
      console.log('Updating payment status:', { paymentId, status })
      return await supabase
        .from('payments')
        .update({ status, updated_at: new Date().toISOString() })
        .eq('id', paymentId)
        .select()
        .single()
    } catch (error) {
      console.error('Update payment status error:', error)
      return { data: null, error }
    }
  },

  // Stats
  async getStats(userId?: string) {
    if (isDemoMode) {
      const totalRevenue = demoData.invoices
        .filter(inv => inv.status === 'paid')
        .reduce((sum, inv) => sum + inv.amount, 0)
      
      const completedTasks = demoData.tasks.filter(task => task.status === 'completed').length
      const activeCampaigns = demoData.campaigns.filter(camp => camp.status === 'active').length
      const totalLeads = demoData.leads.length
      
      return { 
        data: {
          revenue: totalRevenue,
          campaigns: activeCampaigns,
          tasks: completedTasks,
          leads: totalLeads,
          team_members: demoData.team_members.length
        }, 
        error: null 
      }
    }
    
    try {
      const { data: { user } } = await auth.getUser()
      if (!user) return { data: null, error: 'Not authenticated' }
      
      // Get all data for stats calculation
      const [invoicesResult, campaignsResult, tasksResult, leadsResult, teamResult] = await Promise.all([
        this.getInvoices(user.id),
        this.getCampaigns(user.id),
        this.getTasks(user.id),
        this.getLeads(user.id),
        this.getTeamMembers(user.id)
      ])
      
      const totalRevenue = invoicesResult.data?.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0) || 0
      const completedTasks = tasksResult.data?.filter(task => task.status === 'completed').length || 0
      const activeCampaigns = campaignsResult.data?.filter(camp => camp.status === 'active').length || 0
      
      return {
        data: {
          revenue: totalRevenue,
          campaigns: activeCampaigns,
          tasks: completedTasks,
          leads: leadsResult.data?.length || 0,
          team_members: teamResult.data?.length || 0
        },
        error: null
      }
    } catch (error) {
      console.error('Get stats error:', error)
      return { data: null, error }
    }
  }
}