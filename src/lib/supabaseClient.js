import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://tlygqoicxokjejgxvqxy.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRseWdxb2ljeG9ramVqZ3h2cXh5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTAzMTIxMzgsImV4cCI6MjA2NTg4ODEzOH0.2UOiSoJk1ceBp1EWGhmvR6WfLBlfpsD7wqDTXRXhdjs';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);