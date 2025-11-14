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

// Fetch customizado para mobile com timeout maior e melhor tratamento de erros
const customFetch = async (url, options = {}) => {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), isMobile ? 30000 : 10000); // 30s mobile, 10s desktop

  try {
    const response = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        ...options.headers,
        'apikey': supabaseKey,
        'Content-Type': 'application/json'
      }
    });
    
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    
    if (error.name === 'AbortError') {
      throw new Error('Timeout: A conexão demorou muito para responder');
    }
    
    if (isMobile) {
      console.error('❌ Erro na requisição Supabase (mobile):', {
        url,
        error: error.message,
        type: error.name
      });
    }
    
    throw error;
  }
};

// Configuração do cliente Supabase com fetch customizado para mobile
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
      'x-client-info': `conectedu-web/${isMobile ? 'mobile' : 'desktop'}`,
      'apikey': supabaseKey
    },
    fetch: customFetch // Usar fetch customizado especialmente para mobile
  }
});

// Teste de conexão inicial
console.log('🚀 Supabase Client criado com sucesso');
