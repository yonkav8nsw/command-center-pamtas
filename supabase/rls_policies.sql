-- ============================================================
-- RLS POLICIES — Command Center Pamtas
-- Jalankan di Supabase SQL Editor (sekali, idempotent)
-- ============================================================

-- ── DEMOGRAFI ─────────────────────────────────────────────
-- Anon: hanya SELECT (dashboard publik bisa lihat data)
-- Authenticated: full CRUD
ALTER TABLE demografi ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_demografi"        ON demografi;
DROP POLICY IF EXISTS "auth_select_demografi"        ON demografi;
DROP POLICY IF EXISTS "auth_insert_demografi"        ON demografi;
DROP POLICY IF EXISTS "auth_update_demografi"        ON demografi;
DROP POLICY IF EXISTS "auth_delete_demografi"        ON demografi;

CREATE POLICY "anon_select_demografi"
  ON demografi FOR SELECT TO anon USING (true);

CREATE POLICY "auth_select_demografi"
  ON demografi FOR SELECT TO authenticated USING (true);

CREATE POLICY "auth_insert_demografi"
  ON demografi FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "auth_update_demografi"
  ON demografi FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_delete_demografi"
  ON demografi FOR DELETE TO authenticated USING (true);

-- ── POS ───────────────────────────────────────────────────
ALTER TABLE pos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_pos"   ON pos;
DROP POLICY IF EXISTS "auth_select_pos"   ON pos;
DROP POLICY IF EXISTS "auth_update_pos"   ON pos;

CREATE POLICY "anon_select_pos"
  ON pos FOR SELECT TO anon USING (true);

CREATE POLICY "auth_select_pos"
  ON pos FOR SELECT TO authenticated USING (true);

CREATE POLICY "auth_update_pos"
  ON pos FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

-- ── KERAWANAN ─────────────────────────────────────────────
ALTER TABLE kerawanan ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_kerawanan"   ON kerawanan;
DROP POLICY IF EXISTS "auth_select_kerawanan"   ON kerawanan;
DROP POLICY IF EXISTS "auth_insert_kerawanan"   ON kerawanan;
DROP POLICY IF EXISTS "auth_update_kerawanan"   ON kerawanan;
DROP POLICY IF EXISTS "auth_delete_kerawanan"   ON kerawanan;

CREATE POLICY "anon_select_kerawanan"
  ON kerawanan FOR SELECT TO anon USING (true);

CREATE POLICY "auth_select_kerawanan"
  ON kerawanan FOR SELECT TO authenticated USING (true);

CREATE POLICY "auth_insert_kerawanan"
  ON kerawanan FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "auth_update_kerawanan"
  ON kerawanan FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_delete_kerawanan"
  ON kerawanan FOR DELETE TO authenticated USING (true);

-- ── BINTER ────────────────────────────────────────────────
ALTER TABLE binter ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_binter"   ON binter;
DROP POLICY IF EXISTS "auth_select_binter"   ON binter;
DROP POLICY IF EXISTS "auth_insert_binter"   ON binter;
DROP POLICY IF EXISTS "auth_update_binter"   ON binter;
DROP POLICY IF EXISTS "auth_delete_binter"   ON binter;

CREATE POLICY "anon_select_binter"
  ON binter FOR SELECT TO anon USING (true);

CREATE POLICY "auth_select_binter"
  ON binter FOR SELECT TO authenticated USING (true);

CREATE POLICY "auth_insert_binter"
  ON binter FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "auth_update_binter"
  ON binter FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_delete_binter"
  ON binter FOR DELETE TO authenticated USING (true);

-- ── TOKOH ─────────────────────────────────────────────────
ALTER TABLE tokoh ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_tokoh"   ON tokoh;
DROP POLICY IF EXISTS "auth_select_tokoh"   ON tokoh;
DROP POLICY IF EXISTS "auth_insert_tokoh"   ON tokoh;
DROP POLICY IF EXISTS "auth_update_tokoh"   ON tokoh;
DROP POLICY IF EXISTS "auth_delete_tokoh"   ON tokoh;

CREATE POLICY "anon_select_tokoh"
  ON tokoh FOR SELECT TO anon USING (true);

CREATE POLICY "auth_select_tokoh"
  ON tokoh FOR SELECT TO authenticated USING (true);

CREATE POLICY "auth_insert_tokoh"
  ON tokoh FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "auth_update_tokoh"
  ON tokoh FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_delete_tokoh"
  ON tokoh FOR DELETE TO authenticated USING (true);

-- ── PATROLI ───────────────────────────────────────────────
ALTER TABLE patroli ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "anon_select_patroli"   ON patroli;
DROP POLICY IF EXISTS "auth_select_patroli"   ON patroli;
DROP POLICY IF EXISTS "auth_insert_patroli"   ON patroli;
DROP POLICY IF EXISTS "auth_update_patroli"   ON patroli;
DROP POLICY IF EXISTS "auth_delete_patroli"   ON patroli;

CREATE POLICY "anon_select_patroli"
  ON patroli FOR SELECT TO anon USING (true);

CREATE POLICY "auth_select_patroli"
  ON patroli FOR SELECT TO authenticated USING (true);

CREATE POLICY "auth_insert_patroli"
  ON patroli FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "auth_update_patroli"
  ON patroli FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "auth_delete_patroli"
  ON patroli FOR DELETE TO authenticated USING (true);

-- ── PROFILES ──────────────────────────────────────────────
-- Hanya authenticated user yang bisa lihat profile mereka sendiri
-- Admin bisa lihat semua
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_select_own_profile"   ON profiles;
DROP POLICY IF EXISTS "auth_update_own_profile"   ON profiles;

CREATE POLICY "auth_select_own_profile"
  ON profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR (SELECT role FROM profiles WHERE id = auth.uid()) = 'admin');

CREATE POLICY "auth_update_own_profile"
  ON profiles FOR UPDATE TO authenticated
  USING (id = auth.uid()) WITH CHECK (id = auth.uid());

-- ── Verifikasi ─────────────────────────────────────────────
SELECT
  schemaname,
  tablename,
  policyname,
  roles,
  cmd
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN ('demografi','pos','kerawanan','binter','tokoh','patroli','profiles')
ORDER BY tablename, policyname;
