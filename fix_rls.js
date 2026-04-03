const { Client } = require('pg');

const client = new Client({
  host: 'db.fdveuqzezqaopyidllkw.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'Nosferaded123!!@',
  ssl: {
    rejectUnauthorized: false
  }
});

const sql = `
-- 1. DROP RECURSIVE POLICIES
DROP POLICY IF EXISTS "users_see_company_profiles" ON profiles;
DROP POLICY IF EXISTS "users_see_company_shifts" ON shifts;
DROP POLICY IF EXISTS "chat_isolation_select" ON messages;
DROP POLICY IF EXISTS "chat_isolation_insert" ON messages;
DROP POLICY IF EXISTS "users_insert_own_profile" ON profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON profiles;
DROP POLICY IF EXISTS "admins_create_shifts" ON shifts;

-- 2. CREATE HELPER FUNCTION (SECURITY DEFINER to break recursion)
CREATE OR REPLACE FUNCTION get_my_company_id()
RETURNS UUID AS $$
  SELECT company_id FROM profiles WHERE id = auth.uid();
$$ LANGUAGE sql SECURITY DEFINER;

-- 3. FIX PROFILES POLICIES
-- Allow insert during signup
CREATE POLICY "users_insert_own_profile" ON profiles 
    FOR INSERT WITH CHECK (auth.uid() = id);

-- Allow select colleagues
CREATE POLICY "users_see_company_profiles" ON profiles
    FOR SELECT USING (company_id = get_my_company_id() OR id = auth.uid());

-- Allow update own profile
CREATE POLICY "users_update_own_profile" ON profiles
    FOR UPDATE USING (id = auth.uid());

-- 4. FIX SHIFTS POLICIES
CREATE POLICY "users_see_company_shifts" ON shifts
    FOR SELECT USING (company_id = get_my_company_id());

CREATE POLICY "admins_create_shifts" ON shifts
    FOR INSERT WITH CHECK (
        company_id = get_my_company_id()
        AND EXISTS (
            SELECT 1 FROM profiles 
            WHERE id = auth.uid() 
            AND role IN ('admin', 'manager', 'owner')
        )
    );

-- 5. FIX MESSAGES POLICIES
CREATE POLICY "chat_isolation_select" ON messages
    FOR SELECT USING (company_id = get_my_company_id());

CREATE POLICY "chat_isolation_insert" ON messages
    FOR INSERT WITH CHECK (
        company_id = get_my_company_id() 
        AND sender_id = auth.uid()
    );

-- 6. ENSURE DEMO COMPANY EXISTS
INSERT INTO companies (id, name, code, plan_tier, max_employees)
VALUES ('00000000-0000-0000-0000-000000000001', 'Demo Company', 'DEMO', 'starter', 50)
ON CONFLICT (id) DO NOTHING;
`;

async function fixRLS() {
  try {
    console.log('Connecting to Supabase PostgreSQL...');
    await client.connect();
    console.log('Connected! Fixing RLS policies...');
    await client.query(sql);
    console.log('✅ RLS policies fixed successfully!');
  } catch (err) {
    console.error('❌ Failed to fix RLS:', err.message);
  } finally {
    await client.end();
  }
}

fixRLS();
