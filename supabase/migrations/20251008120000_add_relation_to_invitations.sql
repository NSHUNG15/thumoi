-- Add relation column to invitations table
-- Run this migration against your Supabase database to add the optional relation/role field.

ALTER TABLE IF EXISTS invitations
  ADD COLUMN IF NOT EXISTS relation text;

-- (Optional) No index needed for small free-text field; add one if you plan to query by relation frequently.
-- CREATE INDEX IF NOT EXISTS idx_invitations_relation ON invitations(relation);
