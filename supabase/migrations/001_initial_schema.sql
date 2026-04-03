-- Employee Management Platform - Supabase Schema
-- Migration: 001_initial_schema.sql

-- Enable UUID extension (reinstall if needed)
DROP EXTENSION IF EXISTS "uuid-ossp" CASCADE;
CREATE EXTENSION "uuid-ossp" SCHEMA public;

-- ============================================================================
-- ENUMS
-- ============================================================================

-- User roles
CREATE TYPE user_role AS ENUM ('owner', 'admin', 'manager', 'employee');

-- Shift status
CREATE TYPE shift_status AS ENUM ('scheduled', 'confirmed', 'in_progress', 'completed', 'cancelled');

-- Message type
CREATE TYPE message_type AS ENUM ('text', 'image', 'file', 'system');

-- Plan tiers
CREATE TYPE plan_tier AS ENUM ('starter', 'growth', 'enterprise');

-- ============================================================================
-- TABLES
-- ============================================================================

-- Companies table
CREATE TABLE companies (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    code TEXT UNIQUE NOT NULL,
    plan_tier plan_tier NOT NULL DEFAULT 'starter',
    max_employees INTEGER NOT NULL DEFAULT 50,
    enabled_features TEXT[] NOT NULL DEFAULT ARRAY['auth', 'profile', 'notifications', 'chat', 'shifts'],
    billing_email TEXT,
    logo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Profiles table (extends auth.users)
CREATE TABLE profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT NOT NULL,
    full_name TEXT,
    avatar_url TEXT,
    company_id UUID REFERENCES companies(id) ON DELETE CASCADE,
    role user_role NOT NULL DEFAULT 'employee',
    phone TEXT,
    position TEXT,
    is_active BOOLEAN NOT NULL DEFAULT TRUE,
    last_seen_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(email)
);

-- Shifts table
CREATE TABLE shifts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    start_time TIMESTAMPTZ NOT NULL,
    end_time TIMESTAMPTZ NOT NULL,
    location TEXT,
    status shift_status NOT NULL DEFAULT 'scheduled',
    created_by UUID NOT NULL REFERENCES profiles(id),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CHECK (end_time > start_time)
);

-- Shift assignments (many-to-many)
CREATE TABLE shift_assignments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    shift_id UUID NOT NULL REFERENCES shifts(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    status TEXT NOT NULL DEFAULT 'pending', -- pending, accepted, declined
    assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(shift_id, user_id)
);

-- Messages table (chat)
CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    sender_id UUID NOT NULL REFERENCES profiles(id),
    content TEXT NOT NULL,
    message_type message_type NOT NULL DEFAULT 'text',
    media_url TEXT,
    reply_to_id UUID REFERENCES messages(id),
    is_edited BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Message reads
CREATE TABLE message_reads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    message_id UUID NOT NULL REFERENCES messages(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    read_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(message_id, user_id)
);

-- Polls table
CREATE TABLE polls (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    created_by UUID NOT NULL REFERENCES profiles(id),
    expires_at TIMESTAMPTZ,
    is_anonymous BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Poll options
CREATE TABLE poll_options (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    text TEXT NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Poll votes
CREATE TABLE poll_votes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    poll_id UUID NOT NULL REFERENCES polls(id) ON DELETE CASCADE,
    option_id UUID NOT NULL REFERENCES poll_options(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    voted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(poll_id, user_id)
);

-- Tasks table (premium feature)
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'todo', -- todo, in_progress, done
    priority TEXT NOT NULL DEFAULT 'medium', -- low, medium, high
    assigned_to UUID REFERENCES profiles(id),
    created_by UUID NOT NULL REFERENCES profiles(id),
    due_date TIMESTAMPTZ,
    completed_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Payroll records (premium feature)
CREATE TABLE payroll_records (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES profiles(id),
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    hours_worked DECIMAL(10, 2) NOT NULL,
    hourly_rate DECIMAL(10, 2) NOT NULL,
    gross_amount DECIMAL(10, 2) NOT NULL,
    deductions DECIMAL(10, 2) DEFAULT 0,
    net_amount DECIMAL(10, 2) NOT NULL,
    status TEXT NOT NULL DEFAULT 'draft', -- draft, approved, paid
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(user_id, period_start, period_end)
);

-- Audit logs (enterprise feature)
CREATE TABLE audit_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    company_id UUID NOT NULL REFERENCES companies(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id),
    action TEXT NOT NULL,
    resource_type TEXT,
    resource_id UUID,
    old_value JSONB,
    new_value JSONB,
    ip_address TEXT,
    user_agent TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Billing stats view (for developer access only)
CREATE VIEW billing_stats AS
SELECT
    c.id as company_id,
    c.name as company_name,
    c.plan_tier,
    c.max_employees,
    COUNT(DISTINCT p.id) as employee_count,
    DATE_TRUNC('month', p.created_at) as billing_month,
    c.created_at as company_created_at
FROM companies c
LEFT JOIN profiles p ON p.company_id = c.id AND p.is_active = TRUE
GROUP BY c.id, c.name, c.plan_tier, c.max_employees, DATE_TRUNC('month', p.created_at), c.created_at;

-- ============================================================================
-- INDEXES
-- ============================================================================

CREATE INDEX idx_profiles_company_id ON profiles(company_id);
CREATE INDEX idx_profiles_email ON profiles(email);
CREATE INDEX idx_shifts_company_id ON shifts(company_id);
CREATE INDEX idx_shifts_start_time ON shifts(start_time);
CREATE INDEX idx_shift_assignments_shift_id ON shift_assignments(shift_id);
CREATE INDEX idx_shift_assignments_user_id ON shift_assignments(user_id);
CREATE INDEX idx_messages_company_id ON messages(company_id);
CREATE INDEX idx_messages_created_at ON messages(created_at DESC);
CREATE INDEX idx_polls_company_id ON polls(company_id);
CREATE INDEX idx_tasks_company_id ON tasks(company_id);
CREATE INDEX idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX idx_payroll_records_company_id ON payroll_records(company_id);
CREATE INDEX idx_payroll_records_user_id ON payroll_records(user_id);
CREATE INDEX idx_audit_logs_company_id ON audit_logs(company_id);
CREATE INDEX idx_audit_logs_created_at ON audit_logs(created_at DESC);

-- ============================================================================
-- TRIGGERS (updated_at)
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_companies_updated_at BEFORE UPDATE ON companies
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shifts_updated_at BEFORE UPDATE ON shifts
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_messages_updated_at BEFORE UPDATE ON messages
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_polls_updated_at BEFORE UPDATE ON polls
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tasks_updated_at BEFORE UPDATE ON tasks
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_payroll_records_updated_at BEFORE UPDATE ON payroll_records
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- ROW LEVEL SECURITY (RLS)
-- ============================================================================

-- Enable RLS on all tables
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE shift_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE message_reads ENABLE ROW LEVEL SECURITY;
ALTER TABLE polls ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_options ENABLE ROW LEVEL SECURITY;
ALTER TABLE poll_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE payroll_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- Companies policies
-- ----------------------------------------------------------------------------

-- Users can see their own company
CREATE POLICY "users_see_own_company" ON companies
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.company_id = companies.id
            AND profiles.id = auth.uid()
        )
    );

-- ----------------------------------------------------------------------------
-- Profiles policies
-- ----------------------------------------------------------------------------

-- Users can see their own profile
CREATE POLICY "users_see_own_profile" ON profiles
    FOR SELECT
    USING (id = auth.uid());

-- Users can see profiles from their own company
CREATE POLICY "users_see_company_profiles" ON profiles
    FOR SELECT
    USING (
        company_id = (
            SELECT company_id FROM profiles WHERE id = auth.uid()
        )
    );

-- Users can update their own profile
CREATE POLICY "users_update_own_profile" ON profiles
    FOR UPDATE
    USING (id = auth.uid());

-- ----------------------------------------------------------------------------
-- Shifts policies
-- ----------------------------------------------------------------------------

-- Users can see shifts from their own company
CREATE POLICY "users_see_company_shifts" ON shifts
    FOR SELECT
    USING (
        company_id = (
            SELECT company_id FROM profiles WHERE id = auth.uid()
        )
    );

-- Only admins/managers can create shifts
CREATE POLICY "admins_create_shifts" ON shifts
    FOR INSERT
    WITH CHECK (
        company_id = (
            SELECT company_id FROM profiles WHERE id = auth.uid()
        )
        AND (
            SELECT role FROM profiles WHERE id = auth.uid()
        ) IN ('admin', 'manager', 'owner')
    );

-- Only admins/managers can update shifts
CREATE POLICY "admins_update_shifts" ON shifts
    FOR UPDATE
    USING (
        company_id = (
            SELECT company_id FROM profiles WHERE id = auth.uid()
        )
        AND (
            SELECT role FROM profiles WHERE id = auth.uid()
        ) IN ('admin', 'manager', 'owner')
    );

-- ----------------------------------------------------------------------------
-- Shift assignments policies
-- ----------------------------------------------------------------------------

-- Users can see their own assignments
CREATE POLICY "users_see_own_assignments" ON shift_assignments
    FOR SELECT
    USING (user_id = auth.uid());

-- Users can see assignments for their company's shifts
CREATE POLICY "users_see_company_assignments" ON shift_assignments
    FOR SELECT
    USING (
        shift_id IN (
            SELECT id FROM shifts
            WHERE company_id = (
                SELECT company_id FROM profiles WHERE id = auth.uid()
            )
        )
    );

-- Users can update their own assignment status
CREATE POLICY "users_update_own_assignment" ON shift_assignments
    FOR UPDATE
    USING (user_id = auth.uid());

-- ----------------------------------------------------------------------------
-- Messages policies (CRITICAL for chat isolation)
-- ----------------------------------------------------------------------------

-- Users can see messages from their own company ONLY
CREATE POLICY "chat_isolation_select" ON messages
    FOR SELECT
    USING (
        company_id = (
            SELECT company_id FROM profiles WHERE id = auth.uid()
        )
    );

-- Users can send messages to their own company ONLY
CREATE POLICY "chat_isolation_insert" ON messages
    FOR INSERT
    WITH CHECK (
        company_id = (
            SELECT company_id FROM profiles WHERE id = auth.uid()
        )
        AND sender_id = auth.uid()
    );

-- Users can update only their own messages
CREATE POLICY "chat_isolation_update" ON messages
    FOR UPDATE
    USING (sender_id = auth.uid());

-- Users can delete only their own messages
CREATE POLICY "chat_isolation_delete" ON messages
    FOR DELETE
    USING (sender_id = auth.uid());

-- ----------------------------------------------------------------------------
-- Message reads policies
-- ----------------------------------------------------------------------------

-- Users can see their own read status
CREATE POLICY "users_see_own_reads" ON message_reads
    FOR SELECT
    USING (user_id = auth.uid());

-- Users can insert their own read status
CREATE POLICY "users_insert_own_reads" ON message_reads
    FOR INSERT
    WITH CHECK (user_id = auth.uid());

-- ----------------------------------------------------------------------------
-- Polls policies
-- ----------------------------------------------------------------------------

-- Users can see polls from their own company
CREATE POLICY "users_see_company_polls" ON polls
    FOR SELECT
    USING (
        company_id = (
            SELECT company_id FROM profiles WHERE id = auth.uid()
        )
    );

-- Users can create polls (admins/managers)
CREATE POLICY "admins_create_polls" ON polls
    FOR INSERT
    WITH CHECK (
        company_id = (
            SELECT company_id FROM profiles WHERE id = auth.uid()
        )
        AND (
            SELECT role FROM profiles WHERE id = auth.uid()
        ) IN ('admin', 'manager', 'owner')
    );

-- ----------------------------------------------------------------------------
-- Tasks policies (premium feature)
-- ----------------------------------------------------------------------------

-- Users can see tasks from their own company
CREATE POLICY "users_see_company_tasks" ON tasks
    FOR SELECT
    USING (
        company_id = (
            SELECT company_id FROM profiles WHERE id = auth.uid()
        )
    );

-- ----------------------------------------------------------------------------
-- Payroll records policies (premium feature)
-- ----------------------------------------------------------------------------

-- Users can see their own payroll records
CREATE POLICY "users_see_own_payroll" ON payroll_records
    FOR SELECT
    USING (user_id = auth.uid());

-- Admins can see all payroll records for their company
CREATE POLICY "admins_see_company_payroll" ON payroll_records
    FOR SELECT
    USING (
        company_id = (
            SELECT company_id FROM profiles WHERE id = auth.uid()
        )
        AND (
            SELECT role FROM profiles WHERE id = auth.uid()
        ) IN ('admin', 'manager', 'owner')
    );

-- ----------------------------------------------------------------------------
-- Audit logs policies (enterprise feature)
-- ----------------------------------------------------------------------------

-- Only owners can see audit logs
CREATE POLICY "owners_see_audit_logs" ON audit_logs
    FOR SELECT
    USING (
        company_id = (
            SELECT company_id FROM profiles WHERE id = auth.uid()
        )
        AND (
            SELECT role FROM profiles WHERE id = auth.uid()
        ) = 'owner'
    );

-- ============================================================================
-- FUNCTIONS
-- ============================================================================

-- Function to get current user's company ID
CREATE OR REPLACE FUNCTION get_current_user_company_id()
RETURNS UUID AS $$
BEGIN
    RETURN (
        SELECT company_id FROM profiles WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to check if user has role
CREATE OR REPLACE FUNCTION user_has_role(TEXT[])
RETURNS BOOLEAN AS $$
BEGIN
    RETURN (
        SELECT role = ANY($2) FROM profiles WHERE id = auth.uid()
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ============================================================================
-- INITIAL DATA
-- ============================================================================

-- Insert a default company for testing
INSERT INTO companies (id, name, code, plan_tier, max_employees)
VALUES (
    '00000000-0000-0000-0000-000000000001',
    'Demo Company',
    'DEMO',
    'starter',
    50
);
