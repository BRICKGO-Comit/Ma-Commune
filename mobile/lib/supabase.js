import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://vpdcysxhbqkvufzarnon.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZwZGN5c3hoYnFrdnVmemFybm9uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzM5MTI4NTAsImV4cCI6MjA4OTQ4ODg1MH0.PmJS_kic03BWWIOIt45_rsQmc8ES__0k4bf9dKxquJQ';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
