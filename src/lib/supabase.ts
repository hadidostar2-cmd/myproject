/// <reference types="vite/client" />
import { createClient } from '@supabase/supabase-js';

// Use globals defined in vite.config.ts for robust environment variable injection
const supabaseUrl = (globalThis as any).__SUPABASE_URL__;
const supabaseAnonKey = (globalThis as any).__SUPABASE_ANON_KEY__;

export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null as any;
