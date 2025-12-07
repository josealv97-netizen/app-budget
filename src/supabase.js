import { createClient } from '@supabase/supabase-js';

const supabaseUrl = "https://lxtjjgvcjowkapgtbdqd.supabase.co";
const supabaseAnonKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx4dGpqZ3Zjam93a2FwZ3RiZHFkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjUxMDc4OTYsImV4cCI6MjA4MDY4Mzg5Nn0.6i-tERSMfJ7ssZzqtW7ggh-gzOhoRVli4Jy2HQmzARQ";

if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Missing Supabase URL or Anon Key. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
