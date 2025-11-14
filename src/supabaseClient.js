// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zosupqbyanlliswinicv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpvc3VwcWJ5YW5sbGlzd2luaWN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1NDk5NzksImV4cCI6MjA1MzEyNTk3OX0.8TOyca3W_RR2SSejrqAzVBKKc9pKjZJ3kg-ZcfmBOFI';

// Configuração do cliente Supabase com opções para melhorar a conexão
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});
