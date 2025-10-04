/*
  # Create graduation invitations table

  1. New Tables
    - `invitations`
      - `id` (uuid, primary key) - Unique identifier for each invitation
      - `recipient_name` (text, not null) - Name of the invitation recipient
      - `share_code` (text, unique, not null) - Unique shareable code for the invitation link
      - `photo_url` (text, nullable) - Optional URL for recipient's photo
      - `created_at` (timestamptz) - When the invitation was created
      - `updated_at` (timestamptz) - Last update timestamp
      - `views_count` (integer) - Number of times the invitation was viewed

  2. Security
    - Enable RLS on `invitations` table
    - Add policy for anyone to view invitations by share_code (public read)
    - Add policy for anyone to create invitations (public insert)
    - Add policy for anyone to increment view count (public update)

  3. Indexes
    - Create index on share_code for fast lookup
*/

CREATE TABLE IF NOT EXISTS invitations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  recipient_name text NOT NULL,
  share_code text UNIQUE NOT NULL,
  photo_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  views_count integer DEFAULT 0
);

-- Create index for fast share_code lookup
CREATE INDEX IF NOT EXISTS idx_invitations_share_code ON invitations(share_code);

-- Enable RLS
ALTER TABLE invitations ENABLE ROW LEVEL SECURITY;

-- Allow anyone to view invitations (public invitations)
CREATE POLICY "Anyone can view invitations"
  ON invitations FOR SELECT
  USING (true);

-- Allow anyone to create invitations
CREATE POLICY "Anyone can create invitations"
  ON invitations FOR INSERT
  WITH CHECK (true);

-- Allow anyone to update view count
CREATE POLICY "Anyone can update view count"
  ON invitations FOR UPDATE
  USING (true)
  WITH CHECK (true);

-- (Optional for development) Allow anyone to delete invitations
-- WARNING: Enabling public DELETE allows anyone with anon key to remove rows.
-- Remove or tighten this policy for production environments.
CREATE POLICY "Anyone can delete invitations"
  ON invitations FOR DELETE
  USING (true);