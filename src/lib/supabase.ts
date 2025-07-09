import { createClient } from '@supabase/supabase-js'

// For production, you would set these in your .env file
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co'
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-anon-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Check if we're in demo mode (no real Supabase connection)
export const isDemoMode = !import.meta.env.VITE_SUPABASE_URL || 
  import.meta.env.VITE_SUPABASE_URL === 'https://your-project.supabase.co' ||
  supabaseUrl === 'https://your-project.supabase.co'

// Database schema for production setup
export const createTables = async () => {
  if (isDemoMode) return;
  
  // This would be run once to set up the database
  const queries = [
    `
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      email TEXT UNIQUE NOT NULL,
      name TEXT NOT NULL,
      avatar TEXT,
      tier TEXT DEFAULT 'free',
      created_at TIMESTAMPTZ DEFAULT NOW(),
      updated_at TIMESTAMPTZ DEFAULT NOW()
    );
    `,
    `
    CREATE TABLE IF NOT EXISTS invoices (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id),
      invoice_number TEXT NOT NULL,
      client_name TEXT NOT NULL,
      client_email TEXT NOT NULL,
      client_address TEXT,
      amount DECIMAL(10,2) NOT NULL,
      status TEXT DEFAULT 'draft',
      due_date DATE,
      items JSONB,
      company_info JSONB,
      notes TEXT,
      terms TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    `,
    `
    CREATE TABLE IF NOT EXISTS campaigns (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id),
      title TEXT NOT NULL,
      type TEXT NOT NULL,
      content TEXT NOT NULL,
      target_audience TEXT,
      product TEXT,
      benefits TEXT,
      tone TEXT,
      platform TEXT,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    `,
    `
    CREATE TABLE IF NOT EXISTS tasks (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id),
      title TEXT NOT NULL,
      description TEXT,
      assignee TEXT,
      priority TEXT DEFAULT 'medium',
      status TEXT DEFAULT 'pending',
      due_date DATE,
      category TEXT DEFAULT 'general',
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    `,
    `
    CREATE TABLE IF NOT EXISTS usage_tracking (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id),
      feature_type TEXT NOT NULL,
      usage_count INTEGER DEFAULT 1,
      month_year TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW(),
      UNIQUE(user_id, feature_type, month_year)
    );
    `,
    `
    CREATE TABLE IF NOT EXISTS payments (
      id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id UUID REFERENCES users(id),
      amount DECIMAL(10,2) NOT NULL,
      currency TEXT DEFAULT 'USD',
      status TEXT DEFAULT 'pending',
      payment_method TEXT,
      transaction_id TEXT,
      tier TEXT NOT NULL,
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
    `
  ];
  
  for (const query of queries) {
    try {
      await supabase.rpc('exec_sql', { sql: query });
    } catch (error) {
      console.log('Database setup query failed:', error);
    }
  }
};