-- ============================================================================
-- МІНІМАЛЬНА СХЕМА ДЛЯ РЕЄСТРАЦІЇ ТА ВХОДУ
-- Виконайте в: https://supabase.com/dashboard/project/fdveuqzezqaopyidllkw/sql/new
-- ============================================================================

-- UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ENUMs
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'manager', 'employee');
CREATE TYPE plan_tier AS ENUM ('starter', 'growth', 'enterprise');

-- Companies
CREATE TABLE IF NOT EXISTS companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    plan_tier plan_tier NOT NULL DEFAULT 'starter',
    max_employees INTEGER NOT NULL DEFAULT 50,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Profiles
CREATE TABLE IF NOT EXISTS profiles (
    id UUID PRIMARY KEY,
    email TEXT NOT NULL,
    full_name TEXT,
    company_id UUID REFERENCES companies(id),
    role user_role NOT NULL DEFAULT 'employee',
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(email)
);

-- RLS
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "public_read_companies" ON companies FOR SELECT USING (true);
CREATE POLICY "public_insert_companies" ON companies FOR INSERT WITH CHECK (true);

CREATE POLICY "users_see_own_profile" ON profiles FOR SELECT USING (id = auth.uid());
CREATE POLICY "users_insert_own_profile" ON profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "users_update_own_profile" ON profiles FOR UPDATE USING (id = auth.uid());

-- Demo Company
INSERT INTO companies (id, name, code, plan_tier, max_employees)
VALUES ('00000000-0000-0000-0000-000000000001', 'Demo Company', 'DEMO', 'starter', 50)
ON CONFLICT (id) DO NOTHING;

-- Function to get company ID
CREATE OR REPLACE FUNCTION get_current_user_company_id()
RETURNS UUID AS $$
BEGIN
    RETURN (SELECT company_id FROM profiles WHERE id = auth.uid());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
