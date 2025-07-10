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
        phone: '+92 300 1234567'
      },
      notes: 'Thank you for your business!',
      terms: 'Payment due within 30 days'
    },
    { 
      id: '2', 
      invoice_number: 'INV-002', 
      client_name: 'Tech Solutions', 
      client_email: 'info@techsolutions.com',
      amount: 1800, 
      status: 'sent', 
      created_at: '2024-01-18', 
      due_date: '2024-02-18', 
      items: [
        { description: 'Mobile App Development', quantity: 1, rate: 1800, amount: 1800 }
      ]
    },
    { 
      id: '3', 
      invoice_number: 'INV-003', 
      client_name: 'Global Inc', 
      client_email: 'billing@global.com',
      amount: 3200, 
      status: 'overdue', 
      created_at: '2024-01-10', 
      due_date: '2024-02-10', 
      items: [
        { description: 'E-commerce Platform', quantity: 1, rate: 3200, amount: 3200 }
      ]
    },
  ],
  campaigns: [
    { 
      id: '1', 
      title: 'Q4 Marketing Campaign', 
      type: 'ad-copy', 
      content: 'Transform your business with our AI-powered solutions...', 
      target_audience: 'Small business owners',
      product: 'AI Business Assistant',
      benefits: 'Save time, increase productivity',
      tone: 'professional',
      platform: 'facebook',
      status: 'active',
      created_at: '2024-01-20' 
    },
    { 
      id: '2', 
      title: 'Email Newsletter', 
      type: 'email', 
      content: 'Subject: Boost Your Business with AI\n\nDear valued customer...', 
      target_audience: 'Existing customers',
      product: 'Premium Features',
      benefits: 'Advanced analytics, unlimited usage',
      tone: 'friendly',
      platform: 'email',
      status: 'draft',
      created_at: '2024-01-22' 
    },
  ],
  tasks: [
    { 
      id: '1', 
      title: 'Review Q4 marketing campaign', 
      description: 'Analyze performance metrics and ROI',
      priority: 'high', 
      assignee: 'Sarah Johnson', 
      due_date: '2024-01-25', 
      status: 'in-progress',
      category: 'marketing',
      created_at: '2024-01-20'
    },
    { 
      id: '2', 
      title: 'Update client database', 
      description: 'Clean and organize client contact information',
      priority: 'medium', 
      assignee: 'Mike Chen', 
      due_date: '2024-01-28', 
      status: 'pending',
      category: 'operations',
      created_at: '2024-01-21'
    },
    { 
      id: '3', 
      title: 'Prepare monthly report', 
      description: 'Compile financial and operational metrics',
      priority: 'high', 
      assignee: 'Lisa Wang', 
      due_date: '2024-01-30', 
      status: 'pending',
      category: 'finance',
      created_at: '2024-01-22'
    },
    { 
      id: '4', 
      title: 'Optimize website performance', 
      description: 'Improve loading speed and user experience',
      priority: 'low', 
      assignee: 'David Kim', 
      due_date: '2024-02-02', 
      status: 'completed',
      category: 'technology',
      created_at: '2024-01-15'
    },
  ],
  portfolios: [
    {
      id: '1',
      user_id: 'demo-user',
      business_name: 'Your Business Name',
      tagline: 'Professional services that deliver results',
      description: 'We provide comprehensive business solutions...',
      services: ['Web Development', 'Digital Marketing', 'Business Consulting'],
      contact_info: {
        email: 'contact@yourbusiness.com',
        phone: '+92 300 1234567',
        address: 'Lahore, Pakistan'
      },
      social_links: {
        website: 'https://yourbusiness.com',
        linkedin: 'https://linkedin.com/company/yourbusiness',
        facebook: 'https://facebook.com/yourbusiness'
      },
      is_public: true,
      slug: 'your-business',
      created_at: '2024-01-15'
    }
  ],
  leads: [
    {
      id: '1',
      name: 'John Smith',
      email: 'john@example.com',
      phone: '+92 301 1234567',
      company: 'Smith Enterprises',
      source: 'website',
      status: 'new',
      notes: 'Interested in web development services',
      created_at: '2024-01-20'
    },
    {
      id: '2',
      name: 'Sarah Ahmed',
      email: 'sarah@company.com',
      phone: '+92 302 7654321',
      company: 'Ahmed & Co',
      source: 'referral',
      status: 'contacted',
      notes: 'Looking for digital marketing solutions',
      created_at: '2024-01-22'
    }
  ],
  payments: [
    {
      id: '1',
      user_id: 'demo-user',
      amount: 9.99,
      currency: 'USD',
      status: 'completed',
      payment_method: 'bank_transfer',
      transaction_id: 'TXN_123456789',
      tier: 'pro',
      billing_period_start: '2024-01-01',
      billing_period_end: '2024-02-01',
      created_at: '2024-01-01'
    }
  ],
  team_members: [
    {
      id: '1',
      user_id: 'demo-user',
      name: 'Sarah Johnson',
      email: 'sarah@yourbusiness.com',
      role: 'manager',
      permissions: ['tasks', 'campaigns', 'invoices'],
      status: 'active',
      created_at: '2024-01-15'
    },
    {
      id: '2',
      user_id: 'demo-user',
      name: 'Mike Chen',
      email: 'mike@yourbusiness.com',
      role: 'member',
      permissions: ['tasks'],
      status: 'active',
      created_at: '2024-01-18'
    }
  ]
}

export const database = {
  // Users
  async getCurrentUser() {
    if (isDemoMode) {
      const demoUser = localStorage.getItem('demoUser')
      return demoUser ? { data: JSON.parse(demoUser), error: null } : { data: null, error: null }
    }
    
    const { data: { user }, error } = await auth.getUser()
    if (error || !user) return { data: null, error }
    
    const { data: profile, error: profileError } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single()
    
    return { data: profile, error: profileError }
  },

  async updateUserProfile(userId: string, updates: any) {
    if (isDemoMode) {
      const demoUser = JSON.parse(localStorage.getItem('demoUser') || '{}')
      const updatedUser = { ...demoUser, ...updates, updated_at: new Date().toISOString() }
      localStorage.setItem('demoUser', JSON.stringify(updatedUser))
      return { data: updatedUser, error: null }
    }
    
    return await supabase
      .from('users')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single()
  },

  // Invoices
  async getInvoices(userId?: string) {
    if (isDemoMode) {
      return { data: demoData.invoices, error: null }
    }
    
    let query = supabase.from('invoices').select('*').order('created_at', { ascending: false })
    if (userId) query = query.eq('user_id', userId)
    
    return await query
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
    
    const { data: { user } } = await auth.getUser()
    if (!user) return { data: null, error: 'User not authenticated' }
    
    return await supabase
      .from('invoices')
      .insert({ ...invoice, user_id: user.id })
      .select()
      .single()
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
    
    return await supabase
      .from('invoices')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
  },

  async deleteInvoice(id: string) {
    if (isDemoMode) {
      demoData.invoices = demoData.invoices.filter(inv => inv.id !== id)
      return { error: null }
    }
    
    return await supabase.from('invoices').delete().eq('id', id)
  },

  // Campaigns
  async getCampaigns(userId?: string) {
    if (isDemoMode) {
      return { data: demoData.campaigns, error: null }
    }
    
    let query = supabase.from('campaigns').select('*').order('created_at', { ascending: false })
    if (userId) query = query.eq('user_id', userId)
    
    return await query
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
    
    const { data: { user } } = await auth.getUser()
    if (!user) return { data: null, error: 'User not authenticated' }
    
    return await supabase
      .from('campaigns')
      .insert({ ...campaign, user_id: user.id })
      .select()
      .single()
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
    
    return await supabase
      .from('campaigns')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
  },

  // Tasks
  async getTasks(userId?: string) {
    if (isDemoMode) {
      return { data: demoData.tasks, error: null }
    }
    
    let query = supabase.from('tasks').select('*').order('created_at', { ascending: false })
    if (userId) query = query.eq('user_id', userId)
    
    return await query
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
    
    const { data: { user } } = await auth.getUser()
    if (!user) return { data: null, error: 'User not authenticated' }
    
    return await supabase
      .from('tasks')
      .insert({ ...task, user_id: user.id })
      .select()
      .single()
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
    
    return await supabase
      .from('tasks')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
  },

  async deleteTask(id: string) {
    if (isDemoMode) {
      demoData.tasks = demoData.tasks.filter(task => task.id !== id)
      return { error: null }
    }
    
    return await supabase.from('tasks').delete().eq('id', id)
  },

  // Business Portfolios
  async getPortfolio(userId: string) {
    if (isDemoMode) {
      const portfolio = demoData.portfolios.find(p => p.user_id === userId)
      return { data: portfolio, error: null }
    }
    
    return await supabase
      .from('portfolios')
      .select('*')
      .eq('user_id', userId)
      .single()
  },

  async getPublicPortfolio(slug: string) {
    if (isDemoMode) {
      const portfolio = demoData.portfolios.find(p => p.slug === slug && p.is_public)
      return { data: portfolio, error: null }
    }
    
    return await supabase
      .from('portfolios')
      .select('*')
      .eq('slug', slug)
      .eq('is_public', true)
      .single()
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
    
    const { data: { user } } = await auth.getUser()
    if (!user) return { data: null, error: 'User not authenticated' }
    
    return await supabase
      .from('portfolios')
      .upsert({ ...portfolioData, user_id: user.id })
      .select()
      .single()
  },

  // CRM & Leads
  async getLeads(userId?: string) {
    if (isDemoMode) {
      return { data: demoData.leads, error: null }
    }
    
    let query = supabase.from('leads').select('*').order('created_at', { ascending: false })
    if (userId) query = query.eq('user_id', userId)
    
    return await query
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
    
    const { data: { user } } = await auth.getUser()
    if (!user) return { data: null, error: 'User not authenticated' }
    
    return await supabase
      .from('leads')
      .insert({ ...lead, user_id: user.id })
      .select()
      .single()
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
    
    return await supabase
      .from('leads')
      .update({ ...updates, updated_at: new Date().toISOString() })
      .eq('id', id)
      .select()
      .single()
  },

  // Team Management
  async getTeamMembers(userId?: string) {
    if (isDemoMode) {
      return { data: demoData.team_members, error: null }
    }
    
    let query = supabase.from('team_members').select('*').order('created_at', { ascending: false })
    if (userId) query = query.eq('user_id', userId)
    
    return await query
  },

  async addTeamMember(member: any) {
    if (isDemoMode) {
      const newMember = { 
        ...member, 
        id: Date.now().toString(), 
        created_at: new Date().toISOString(),
        status: 'active'
      }
      demoData.team_members.push(newMember)
      return { data: newMember, error: null }
    }
    
    const { data: { user } } = await auth.getUser()
    if (!user) return { data: null, error: 'User not authenticated' }
    
    return await supabase
      .from('team_members')
      .insert({ ...member, user_id: user.id })
      .select()
      .single()
  },

  // Payments
  async getPayments(userId?: string) {
    if (isDemoMode) {
      return { data: demoData.payments, error: null }
    }
    
    let query = supabase.from('payments').select('*').order('created_at', { ascending: false })
    if (userId) query = query.eq('user_id', userId)
    
    return await query
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
    
    const { data: { user } } = await auth.getUser()
    if (!user) return { data: null, error: 'User not authenticated' }
    
    return await supabase
      .from('payments')
      .insert({ ...payment, user_id: user.id })
      .select()
      .single()
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
    
    // In production, this would aggregate data from multiple tables
    const { data: invoices } = await this.getInvoices(userId)
    const { data: campaigns } = await this.getCampaigns(userId)
    const { data: tasks } = await this.getTasks(userId)
    const { data: leads } = await this.getLeads(userId)
    const { data: teamMembers } = await this.getTeamMembers(userId)
    
    const totalRevenue = invoices?.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + inv.amount, 0) || 0
    const completedTasks = tasks?.filter(task => task.status === 'completed').length || 0
    const activeCampaigns = campaigns?.filter(camp => camp.status === 'active').length || 0
    
    return {
      data: {
        revenue: totalRevenue,
        campaigns: activeCampaigns,
        tasks: completedTasks,
        leads: leads?.length || 0,
        team_members: teamMembers?.length || 0
      },
      error: null
    }
  }
}