-- Migration: Add catatan column to tokoh table
-- Date: 2026-07-01
-- Purpose: Fix "Could not find the 'catatan' column" error when saving tokoh

-- Add catatan column if it doesn't exist
ALTER TABLE tokoh ADD COLUMN IF NOT EXISTS catatan TEXT;

-- Grant RLS permissions for catatan (same as other columns)
-- The policies should already cover this since they use SELECT * and UPDATE *

-- Optionally add a comment for documentation
COMMENT ON COLUMN tokoh.catatan IS 'Catatan tambahan tentang tokoh (opsional)';

-- After running this migration, you need to reload the PostgREST schema cache:
-- Run this in Supabase SQL Editor:
--   NOTIFY pgrst, 'reload schema';
-- Or use Supabase CLI:
--   supabase db reset
