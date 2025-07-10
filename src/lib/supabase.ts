import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Check if we're in demo mode (no real Supabase connection)
export const isDemoMode = !import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.VITE_SUPABASE_URL === 'https://your-project.supabase.co' ||
  supabaseUrl === 'https://your-project.supabase.co'

// Authentication helpers
export const auth = {
  async signUp(email: string, password: string, userData: any) {
    if (isDemoMode) {
      // Demo mode - simulate successful signup
      const user = {
        id: `demo-${Date.now()}`,
        email,
        ...userData,
        created_at: new Date().toISOString()
      }
      localStorage.setItem('demoUser', JSON.stringify(user))
      return { data: { user }, error: null }
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: userData
      }
    })

    if (data.user && !error) {
      // Create user profile
      await supabase.from('users').insert({
        id: data.user.id,
        email: data.user.email,
        name: userData.name,
        tier: 'free'
      })
    }

    return { data, error }
  },

  async signIn(email: string, password: string) {
    if (isDemoMode) {
      const demoUser = localStorage.getItem('demoUser')
      if (demoUser) {
        return { data: { user: JSON.parse(demoUser) }, error: null }
      }
      // Create demo user if doesn't exist
      const user = {
        id: `demo-${Date.now()}`,
        email,
        name: email.split('@')[0],
        created_at: new Date().toISOString()
      }
      localStorage.setItem('demoUser', JSON.stringify(user))
      return { data: { user }, error: null }
    }

    return await supabase.auth.signInWithPassword({ email, password })
  },

  async signOut() {
    if (isDemoMode) {
      localStorage.removeItem('demoUser')
      return { error: null }
    }
    return await supabase.auth.signOut()
  },

  async getUser() {
    if (isDemoMode) {
      const demoUser = localStorage.getItem('demoUser')
      return demoUser ? { data: { user: JSON.parse(demoUser) }, error: null } : { data: { user: null }, error: null }
    }
    return await supabase.auth.getUser()
  }
}

// Email service
export const emailService = {
  async sendWelcomeEmail(userEmail: string, userName: string) {
    if (isDemoMode) {
      console.log(`Welcome email sent to ${userEmail}`)
      return { success: true }
    }
    
    // In production, integrate with email service like Resend, SendGrid, etc.
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: userEmail,
          template: 'welcome',
          data: { name: userName }
        })
      })
      return { success: response.ok }
    } catch (error) {
      console.error('Email send failed:', error)
      return { success: false }
    }
  },

  async sendPaymentConfirmation(userEmail: string, paymentData: any) {
    if (isDemoMode) {
      console.log(`Payment confirmation sent to ${userEmail}`)
      return { success: true }
    }
    
    try {
      const response = await fetch('/api/send-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          to: userEmail,
          template: 'payment-confirmation',
          data: paymentData
        })
      })
      return { success: response.ok }
    } catch (error) {
      console.error('Email send failed:', error)
      return { success: false }
    }
  }
}

// Real-time subscriptions
export const subscriptions = {
  subscribeToUserUpdates(userId: string, callback: (payload: any) => void) {
    if (isDemoMode) return () => {}
    
    const subscription = supabase
      .channel('user-updates')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'users', filter: `id=eq.${userId}` },
        callback
      )
      .subscribe()
    
    return () => subscription.unsubscribe()
  },

  subscribeToPayments(userId: string, callback: (payload: any) => void) {
    if (isDemoMode) return () => {}
    
    const subscription = supabase
      .channel('payment-updates')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'payments', filter: `user_id=eq.${userId}` },
        callback
      )
      .subscribe()
    
    return () => subscription.unsubscribe()
  }
}

// Database functions
export const dbFunctions = {
  async updateUserTier(userId: string, newTier: string) {
    if (isDemoMode) {
      localStorage.setItem('userTier', newTier)
      return { data: { tier: newTier }, error: null }
    }
    
    return await supabase
      .from('users')
      .update({ tier: newTier, updated_at: new Date().toISOString() })
      .eq('id', userId)
      .select()
      .single()
  },

  async getUserProfile(userId: string) {
    if (isDemoMode) {
      const demoUser = localStorage.getItem('demoUser')
      return demoUser ? { data: JSON.parse(demoUser), error: null } : { data: null, error: 'User not found' }
    }
    
    return await supabase
      .from('users')
      .select('*')
      .eq('id', userId)
      .single()
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
  }
}