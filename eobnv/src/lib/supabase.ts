import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export interface Script {
  id: string;
  title: string;
  description: string;
  code: string;
  author: string;
  game_name: string;
  hearts: number;
  tags: string[];
  created_at: string;
  requires_key: boolean;
}

export type ScriptInput = Omit<Script, 'id' | 'hearts' | 'created_at'>;
