-- ============================================================================
-- ПОВНЕ ОЧИЩЕННЯ БАЗИ ДАНИХ
-- Виконайте цей скрипт в Supabase Dashboard -> SQL Editor
-- ============================================================================

-- 1. Вимикаємо RLS на всіх таблицях
ALTER TABLE IF EXISTS companies DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS shifts DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS shift_assignments DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS messages DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS message_reads DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS polls DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS poll_options DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS poll_votes DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS tasks DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS payroll_records DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS audit_logs DISABLE ROW LEVEL SECURITY;

-- 2. Видаляємо всі політики RLS
DROP POLICY IF EXISTS "users_see_own_company" ON companies;
DROP POLICY IF EXISTS "users_see_own_profile" ON profiles;
DROP POLICY IF EXISTS "users_see_company_profiles" ON profiles;
DROP POLICY IF EXISTS "users_update_own_profile" ON profiles;
DROP POLICY IF EXISTS "users_see_company_shifts" ON shifts;
DROP POLICY IF EXISTS "admins_create_shifts" ON shifts;
DROP POLICY IF EXISTS "admins_update_shifts" ON shifts;
DROP POLICY IF EXISTS "users_see_own_assignments" ON shift_assignments;
DROP POLICY IF EXISTS "users_see_company_assignments" ON shift_assignments;
DROP POLICY IF EXISTS "users_update_own_assignment" ON shift_assignments;
DROP POLICY IF EXISTS "chat_isolation_select" ON messages;
DROP POLICY IF EXISTS "chat_isolation_insert" ON messages;
DROP POLICY IF EXISTS "chat_isolation_update" ON messages;
DROP POLICY IF EXISTS "chat_isolation_delete" ON messages;
DROP POLICY IF EXISTS "users_see_own_reads" ON message_reads;
DROP POLICY IF EXISTS "users_insert_own_reads" ON message_reads;
DROP POLICY IF EXISTS "users_see_company_polls" ON polls;
DROP POLICY IF EXISTS "admins_create_polls" ON polls;
DROP POLICY IF EXISTS "users_see_company_tasks" ON tasks;
DROP POLICY IF EXISTS "users_see_own_payroll" ON payroll_records;
DROP POLICY IF EXISTS "admins_see_company_payroll" ON payroll_records;
DROP POLICY IF EXISTS "owners_see_audit_logs" ON audit_logs;

-- 3. Видаляємо тригери
DROP TRIGGER IF EXISTS update_companies_updated_at ON companies;
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_shifts_updated_at ON shifts;
DROP TRIGGER IF EXISTS update_messages_updated_at ON messages;
DROP TRIGGER IF EXISTS update_polls_updated_at ON polls;
DROP TRIGGER IF EXISTS update_tasks_updated_at ON tasks;
DROP TRIGGER IF EXISTS update_payroll_records_updated_at ON payroll_records;

-- 4. Видаляємо функції
DROP FUNCTION IF EXISTS update_updated_at_column();
DROP FUNCTION IF EXISTS get_current_user_company_id();
DROP FUNCTION IF EXISTS user_has_role(TEXT[]);

-- 5. Видаляємо view
DROP VIEW IF EXISTS billing_stats;

-- 6. Видаляємо всі таблиці (в зворотньому порядку залежностей)
DROP TABLE IF EXISTS audit_logs CASCADE;
DROP TABLE IF EXISTS payroll_records CASCADE;
DROP TABLE IF EXISTS tasks CASCADE;
DROP TABLE IF EXISTS poll_votes CASCADE;
DROP TABLE IF EXISTS poll_options CASCADE;
DROP TABLE IF EXISTS polls CASCADE;
DROP TABLE IF EXISTS message_reads CASCADE;
DROP TABLE IF EXISTS messages CASCADE;
DROP TABLE IF EXISTS shift_assignments CASCADE;
DROP TABLE IF EXISTS shifts CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;
DROP TABLE IF EXISTS companies CASCADE;

-- 7. Видаляємо типи
DROP TYPE IF EXISTS user_role CASCADE;
DROP TYPE IF EXISTS shift_status CASCADE;
DROP TYPE IF EXISTS message_type CASCADE;
DROP TYPE IF EXISTS plan_tier CASCADE;

-- 8. НЕ видаляємо uuid-ossp extension! (воно потрібне для uuid_generate_v4())
-- DROP EXTENSION IF EXISTS "uuid-ossp";

-- ============================================================================
-- БАЗУ ОЧИЩЕНО! Тепер виконайте скрипт 001_initial_schema.sql
-- ============================================================================
