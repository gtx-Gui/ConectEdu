// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zosupqbyanlliswinicv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpvc3VwcWJ5YW5sbGlzd2luaWN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1NDk5NzksImV4cCI6MjA1MzEyNTk3OX0.8TOyca3W_RR2SSejrqAzVBKKc9pKjZJ3kg-ZcfmBOFI';

// Detectar se está em ambiente mobile
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Log de diagnóstico
console.log('🔧 Inicializando Supabase Client:', {
  isMobile,
  userAgent: navigator.userAgent,
  url: supabaseUrl,
  hasStorage: typeof Storage !== 'undefined',
  hasLocalStorage: typeof localStorage !== 'undefined',
  hasSessionStorage: typeof sessionStorage !== 'undefined'
});

// Configuração de storage para mobile (usar localStorage se disponível, caso contrário usar sessionStorage)
const getStorage = () => {
  try {
    // Testar se localStorage está disponível
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    console.log('✅ localStorage disponível');
    return localStorage;
  } catch (e) {
    // Se localStorage não estiver disponível (modo privado no mobile), usar sessionStorage
    console.warn('⚠️ localStorage não disponível, usando sessionStorage:', e);
    return sessionStorage;
  }
};

// Configuração do cliente Supabase - usando fetch padrão para melhor compatibilidade
// O Supabase já gerencia os headers (incluindo apikey) automaticamente
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: getStorage(),
    storageKey: 'supabase.auth.token',
    flowType: 'pkce'
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  },
  global: {
    headers: {
      'x-client-info': `conectedu-web/${isMobile ? 'mobile' : 'desktop'}`
    }
    // Removendo customFetch - deixar Supabase usar fetch padrão que funciona melhor
  }
});

// Teste de conexão inicial
console.log('🚀 Supabase Client criado com sucesso');
