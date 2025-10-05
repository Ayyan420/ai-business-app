import { createClient } from '@supabase/supabase-js'

// Supabase configuration with proper error handling
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Check if we have valid Supabase credentials
export const hasValidSupabaseConfig = supabaseUrl && supabaseAnonKey && 
  supabaseUrl !== 'your-supabase-project-url' && 
  supabaseAnonKey !== 'your-supabase-anon-key' &&
  supabaseUrl.includes('supabase.co')

export const supabase = hasValidSupabaseConfig 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

// Check if we're in demo mode (no real Supabase connection)
export const isDemoMode = !hasValidSupabaseConfig

console.log('🔗 Supabase Configuration:', { 
  hasValidConfig: hasValidSupabaseConfig, 
  isDemoMode, 
  url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'Missing',
  key: supabaseAnonKey ? 'Set' : 'Missing'
})

// Enhanced authentication helpers with proper error handling
export const auth = {
  async signUp(email: string, password: string, userData: any) {
    if (isDemoMode || !supabase) {
      console.log('📱 Demo mode: Simulating signup')
      const user = {
        id: `demo-${Date.now()}`,
        email,
        ...userData,
        tier: 'free',
        created_at: new Date().toISOString()
      }
      localStorage.setItem('demoUser', JSON.stringify(user))
      return { data: { user }, error: null }
    }

    try {
      console.log('🔐 Attempting Supabase signup for:', email)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: userData,
          emailRedirectTo: `${window.location.origin}/dashboard`
        }
      })

      console.log('✅ Signup result:', { success: !!data.user, error: error?.message })

      // Create user profile only if email is confirmed
      if (data.user && !error) {
        if (data.user.email_confirmed_at) {
          // Email already confirmed (shouldn't happen with new signups)
          console.log('👤 Creating user profile in database')
          const { data: profile, error: profileError } = await supabase.from('users').insert({
            id: data.user.id,
            email: data.user.email,
            name: userData.name,
            tier: 'free',
            created_at: new Date().toISOString()
          }).select().single()
          
          if (profileError) {
            console.error('❌ Profile creation error:', profileError)
          } else {
            console.log('✅ User profile created successfully:', profile)
          }
        } else {
          console.log('📧 Email confirmation required - profile will be created after confirmation')
        }
      }

      return { data, error }
    } catch (error) {
      console.error('❌ Signup error:', error)
      return { data: null, error: error as any }
    }
  },

  async handleEmailConfirmation(user: any) {
    if (isDemoMode || !supabase) {
      return { data: { user }, error: null }
    }

    try {
      console.log('✅ Email confirmed, creating user profile...')
      
      // Check if profile already exists
      const { data: existingProfile } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single()
      
      if (!existingProfile) {
        // Create user profile in our users table
        const { data: profile, error: profileError } = await supabase.from('users').insert({
          id: user.id,
          email: user.email,
          name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
          tier: 'free',
          created_at: new Date().toISOString()
        }).select().single()
        
        if (profileError) {
          console.error('❌ Profile creation error:', profileError)
          return { data: null, error: profileError }
        } else {
          console.log('✅ User profile created successfully:', profile)
          return { data: profile, error: null }
        }
      } else {
        console.log('✅ User profile already exists:', existingProfile)
        return { data: existingProfile, error: null }
      }
    } catch (error) {
      console.error('❌ Email confirmation handling error:', error)
      return { data: null, error: error as any }
    }
  },

  async signIn(email: string, password: string) {
    if (isDemoMode || !supabase) {
      console.log('📱 Demo mode: Simulating signin')
      const demoUser = localStorage.getItem('demoUser')
      if (demoUser) {
        return { data: { user: JSON.parse(demoUser) }, error: null }
      }
      // Create demo user if doesn't exist
      const user = {
        id: `demo-${Date.now()}`,
        email,
        name: email.split('@')[0],
        tier: 'free',
        created_at: new Date().toISOString()
      }
      localStorage.setItem('demoUser', JSON.stringify(user))
      return { data: { user }, error: null }
    }

    try {
      console.log('🔐 Attempting Supabase signin for:', email)
      const result = await supabase.auth.signInWithPassword({ email, password })
      console.log('✅ Signin result:', { success: !!result.data.user, error: result.error?.message })
      
      // If signin successful, ensure user profile exists
      if (result.data.user && !result.error) {
        const { data: profile } = await supabase
          .from('users')
          .select('*')
          .eq('id', result.data.user.id)
          .single()
        
        if (!profile) {
          console.log('👤 Creating missing user profile...')
          await supabase.from('users').insert({
            id: result.data.user.id,
            email: result.data.user.email,
            name: result.data.user.user_metadata?.name || result.data.user.email?.split('@')[0] || 'User',
            tier: 'free',
            created_at: new Date().toISOString()
          })
        }
      }
      
      return result
    } catch (error) {
      console.error('❌ Signin error:', error)
      return { data: null, error: error as any }
    }
  },

  async signInWithGoogle() {

    try {
      console.log('🔐 Attempting Google OAuth signin')
      
      if (isDemoMode || !supabase) {
        console.log('📱 Demo mode: Simulating Google signin')
        const googleUser = {
          id: `google-demo-${Date.now()}`,
          email: 'google.demo@example.com',
          name: 'Google Demo User',
          tier: 'free',
          created_at: new Date().toISOString(),
          avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=google'
        }
        localStorage.setItem('demoUser', JSON.stringify(googleUser))
        return { data: { user: googleUser }, error: null }
      }
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: `${window.location.origin}/dashboard`,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })

      if (error) {
        console.error('❌ Google OAuth error:', error)
        return { data: null, error }
      }

      console.log('✅ Google OAuth initiated successfully')
      return { data, error }
    } catch (error) {
      console.error('❌ Google signin error:', error)
      return { data: null, error: error as any }
    }
  },

  async signOut() {
    if (isDemoMode || !supabase) {
      localStorage.removeItem('demoUser')
      return { error: null }
    }
    return await supabase.auth.signOut()
  },

  async getUser() {
    if (isDemoMode || !supabase) {
      const demoUser = localStorage.getItem('demoUser')
      return demoUser ? { data: { user: JSON.parse(demoUser) }, error: null } : { data: { user: null }, error: null }
    }
    return await supabase.auth.getUser()
  },

  async getCurrentSession() {
    if (isDemoMode || !supabase) {
      const demoUser = localStorage.getItem('demoUser')
      return demoUser ? { data: { session: { user: JSON.parse(demoUser) } }, error: null } : { data: { session: null }, error: null }
    }
    return await supabase.auth.getSession()
  },

  async updatePassword(newPassword: string) {
    if (isDemoMode || !supabase) {
      console.log('📱 Demo mode: Password update simulated')
      return { data: { user: null }, error: null }
    }

    try {
      console.log('🔐 Updating password...')
      const { data: { user }, error: userError } = await supabase.auth.getUser()

      if (userError || !user) {
        console.error('❌ User not authenticated for password update')
        return { data: null, error: { message: 'Please log in again to update your password' } }
      }

      const result = await supabase.auth.updateUser({
        password: newPassword
      })

      console.log('✅ Password update result:', { success: !result.error })
      return result
    } catch (error) {
      console.error('❌ Password update error:', error)
      return { data: null, error: error as any }
    }
  },

  async resetPassword(email: string) {
    if (isDemoMode || !supabase) {
      console.log('📱 Demo mode: Password reset simulated')
      return { data: null, error: null }
    }

    try {
      console.log('🔐 Sending password reset email to:', email)
      const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`
      })

      if (error) {
        console.error('❌ Password reset error:', error)
        return { data: null, error }
      }

      console.log('✅ Password reset email sent successfully')
      return { data, error: null }
    } catch (error) {
      console.error('❌ Password reset error:', error)
      return { data: null, error: error as any }
    }
  }
}

// Email service
export const emailService = {
  async sendWelcomeEmail(userEmail: string, userName: string) {
    console.log(`📧 Welcome email would be sent to ${userEmail}`)
    return { success: true }
  },

  async sendPaymentConfirmation(userEmail: string, paymentData: any) {
    console.log(`💳 Payment confirmation would be sent to ${userEmail}`)
    return { success: true }
  }
}

// Real-time subscriptions
export const subscriptions = {
  subscribeToUserUpdates(userId: string, callback: (payload: any) => void) {
    if (isDemoMode || !supabase) return () => {}
    
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
    if (isDemoMode || !supabase) return () => {}
    
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
    if (isDemoMode || !supabase) {
      localStorage.setItem('userTier', newTier)
      const demoUser = JSON.parse(localStorage.getItem('demoUser') || '{}')
      demoUser.tier = newTier
      localStorage.setItem('demoUser', JSON.stringify(demoUser))
      return { data: { tier: newTier }, error: null }
    }
    
    try {
      console.log('🔄 Updating user tier:', { userId, newTier })
      return await supabase
        .from('users')
        .update({ tier: newTier, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single()
    } catch (error) {
      console.error('❌ Update tier error:', error)
      return { data: null, error: error as any }
    }
  },

  async getUserProfile(userId: string) {
    if (isDemoMode || !supabase) {
      const demoUser = localStorage.getItem('demoUser')
      return demoUser ? { data: JSON.parse(demoUser), error: null } : { data: null, error: 'User not found' }
    }
    
    try {
      return await supabase
        .from('users')
        .select('*')
        .eq('id', userId)
        .single()
    } catch (error) {
      console.error('❌ Get profile error:', error)
      return { data: null, error: error as any }
    }
  },

  async updateUserProfile(userId: string, updates: any) {
    if (isDemoMode || !supabase) {
      const demoUser = JSON.parse(localStorage.getItem('demoUser') || '{}')
      const updatedUser = { ...demoUser, ...updates, updated_at: new Date().toISOString() }
      localStorage.setItem('demoUser', JSON.stringify(updatedUser))
      return { data: updatedUser, error: null }
    }
    
    try {
      return await supabase
        .from('users')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', userId)
        .select()
        .single()
    } catch (error) {
      console.error('❌ Update profile error:', error)
      return { data: null, error: error as any }
    }
  }
}