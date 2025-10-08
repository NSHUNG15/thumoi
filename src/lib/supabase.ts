import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined;

if (!supabaseUrl || !supabaseAnonKey) {
  // Provide a clear startup-time error so developers quickly spot misconfiguration.
  throw new Error(
    'Missing Supabase configuration. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your environment (e.g. .env)'
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Invitation {
  id: string;
  recipient_name: string;
  share_code: string;
  // Optional relation/role of the recipient (e.g., 'Ba mẹ', 'anh', 'chị', 'bạn', 'em')
  relation?: string | null;
  photo_url: string | null;
  created_at: string;
  updated_at: string;
  views_count: number;
}
