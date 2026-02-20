import { createClient } from '@supabase/supabase-js';

// Aapki di hui sari keys yahan add kar di hain
const SUPABASE_URL = 'https://bxulloaozuzqbzrlmwhy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImJ4dWxsb2FvenV6cWJ6cmxtd2h5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE1NjQ2NzYsImV4cCI6MjA4NzE0MDY3Nn0.N2Yj333JsMN_ZAIp4H07uuzWQVsRPSqwmpRUFeRy8sE';

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    storage: localStorage,
    persistSession: true,
    autoRefreshToken: true,
  }
});