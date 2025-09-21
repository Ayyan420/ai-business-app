/*
  # Add Expenses and Income Tables for Financial Management

  1. New Tables
    - `expenses` - Track business expenses
    - `income` - Track business income
    - `budgets` - Enhanced budget management
    - `budget_categories` - Budget category tracking

  2. Security
    - Enable RLS on all tables
    - Add policies for user data access

  3. Indexes
    - Performance optimization for financial queries
*/

-- Expenses table
CREATE TABLE IF NOT EXISTS expenses (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  description text NOT NULL,
  amount decimal(10,2) NOT NULL,
  category text NOT NULL,
  date date NOT NULL,
  receipt_url text,
  has_receipt boolean DEFAULT false,
  tax_deductible boolean DEFAULT false,
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Income table
CREATE TABLE IF NOT EXISTS income (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  description text NOT NULL,
  amount decimal(10,2) NOT NULL,
  source text NOT NULL,
  date date NOT NULL,
  invoice_id uuid REFERENCES invoices(id) ON DELETE SET NULL,
  recurring boolean DEFAULT false,
  recurring_frequency text CHECK (recurring_frequency IN ('weekly', 'monthly', 'quarterly', 'yearly')),
  notes text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enhanced budgets table (if not exists from previous migration)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'budgets') THEN
    CREATE TABLE budgets (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES users(id) ON DELETE CASCADE,
      name text NOT NULL,
      total_amount decimal(12,2) NOT NULL,
      period text DEFAULT 'monthly' CHECK (period IN ('weekly', 'monthly', 'quarterly', 'yearly')),
      start_date date,
      end_date date,
      status text DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'completed')),
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Budget categories table
CREATE TABLE IF NOT EXISTS budget_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  budget_id uuid REFERENCES budgets(id) ON DELETE CASCADE,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  allocated_amount decimal(10,2) NOT NULL,
  spent_amount decimal(10,2) DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- File uploads table for storing images/documents
CREATE TABLE IF NOT EXISTS file_uploads (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  file_name text NOT NULL,
  file_type text NOT NULL,
  file_size bigint,
  file_url text NOT NULL,
  upload_type text NOT NULL CHECK (upload_type IN ('invoice_logo', 'receipt', 'profile_image', 'portfolio_image', 'other')),
  created_at timestamptz DEFAULT now()
);

-- Subscription management table (enhanced)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'subscriptions') THEN
    CREATE TABLE subscriptions (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES users(id) ON DELETE CASCADE UNIQUE,
      tier text NOT NULL CHECK (tier IN ('free', 'starter', 'professional')),
      status text DEFAULT 'active' CHECK (status IN ('active', 'cancelled', 'past_due', 'unpaid')),
      current_period_start timestamptz,
      current_period_end timestamptz,
      cancel_at_period_end boolean DEFAULT false,
      cancelled_at timestamptz,
      trial_start timestamptz,
      trial_end timestamptz,
      created_at timestamptz DEFAULT now(),
      updated_at timestamptz DEFAULT now()
    );
  END IF;
END $$;

-- Enable RLS
ALTER TABLE expenses ENABLE ROW LEVEL SECURITY;
ALTER TABLE income ENABLE ROW LEVEL SECURITY;
ALTER TABLE budget_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE file_uploads ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Expenses policies
CREATE POLICY "Users can manage own expenses"
  ON expenses
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Income policies
CREATE POLICY "Users can manage own income"
  ON income
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Budget categories policies
CREATE POLICY "Users can manage own budget categories"
  ON budget_categories
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- File uploads policies
CREATE POLICY "Users can manage own files"
  ON file_uploads
  FOR ALL
  TO authenticated
  USING (user_id = auth.uid());

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_expenses_user_id ON expenses(user_id);
CREATE INDEX IF NOT EXISTS idx_expenses_date ON expenses(date);
CREATE INDEX IF NOT EXISTS idx_expenses_category ON expenses(category);

CREATE INDEX IF NOT EXISTS idx_income_user_id ON income(user_id);
CREATE INDEX IF NOT EXISTS idx_income_date ON income(date);
CREATE INDEX IF NOT EXISTS idx_income_source ON income(source);

CREATE INDEX IF NOT EXISTS idx_budget_categories_budget_id ON budget_categories(budget_id);
CREATE INDEX IF NOT EXISTS idx_budget_categories_user_id ON budget_categories(user_id);

CREATE INDEX IF NOT EXISTS idx_file_uploads_user_id ON file_uploads(user_id);
CREATE INDEX IF NOT EXISTS idx_file_uploads_type ON file_uploads(upload_type);

-- Triggers for updated_at
CREATE TRIGGER update_expenses_updated_at BEFORE UPDATE ON expenses FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_income_updated_at BEFORE UPDATE ON income FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_budget_categories_updated_at BEFORE UPDATE ON budget_categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Function to calculate financial summary
CREATE OR REPLACE FUNCTION get_financial_summary(p_user_id uuid, p_start_date date DEFAULT NULL, p_end_date date DEFAULT NULL)
RETURNS TABLE (
  total_income decimal,
  total_expenses decimal,
  net_profit decimal,
  expense_categories jsonb,
  income_sources jsonb
) AS $$
DECLARE
  start_date date := COALESCE(p_start_date, date_trunc('month', CURRENT_DATE)::date);
  end_date date := COALESCE(p_end_date, CURRENT_DATE);
BEGIN
  RETURN QUERY
  WITH expense_summary AS (
    SELECT 
      COALESCE(SUM(amount), 0) as total_exp,
      jsonb_object_agg(category, category_total) as exp_categories
    FROM (
      SELECT 
        category,
        SUM(amount) as category_total
      FROM expenses 
      WHERE user_id = p_user_id 
        AND date BETWEEN start_date AND end_date
      GROUP BY category
    ) cat_expenses
  ),
  income_summary AS (
    SELECT 
      COALESCE(SUM(amount), 0) as total_inc,
      jsonb_object_agg(source, source_total) as inc_sources
    FROM (
      SELECT 
        source,
        SUM(amount) as source_total
      FROM income 
      WHERE user_id = p_user_id 
        AND date BETWEEN start_date AND end_date
      GROUP BY source
    ) src_income
  )
  SELECT 
    COALESCE(i.total_inc, 0) as total_income,
    COALESCE(e.total_exp, 0) as total_expenses,
    COALESCE(i.total_inc, 0) - COALESCE(e.total_exp, 0) as net_profit,
    COALESCE(e.exp_categories, '{}'::jsonb) as expense_categories,
    COALESCE(i.inc_sources, '{}'::jsonb) as income_sources
  FROM expense_summary e
  FULL OUTER JOIN income_summary i ON true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;