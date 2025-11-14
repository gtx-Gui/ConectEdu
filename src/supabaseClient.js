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

// Função fetch com logs detalhados para debug mobile
const customFetch = async (url, options = {}) => {
  const startTime = Date.now();
  const requestInfo = {
    url,
    method: options.method || 'GET',
    isMobile,
    timestamp: new Date().toISOString()
  };
  
  console.log('📡 Requisição Supabase:', requestInfo);
  
  try {
    const response = await fetch(url, {
      ...options,
      // Adicionar headers de CORS explícitos para mobile
      headers: {
        ...options.headers,
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });
    
    const duration = Date.now() - startTime;
    
    console.log('✅ Resposta Supabase:', {
      ...requestInfo,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      duration: `${duration}ms`
    });
    
    return response;
  } catch (error) {
    const duration = Date.now() - startTime;
    
    console.error('❌ Erro na requisição Supabase:', {
      ...requestInfo,
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack
      },
      duration: `${duration}ms`
    });
    
    // Se for erro de rede, dar mensagem mais clara
    if (error.message.includes('Failed to fetch') || error.message.includes('NetworkError')) {
      console.error('🌐 Erro de rede detectado - possível problema de conexão ou CORS');
    }
    
    throw error;
  }
};

// Configuração do cliente Supabase com opções otimizadas para mobile
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
    fetch: customFetch
  }
});

// Teste de conexão inicial
console.log('🚀 Supabase Client criado com sucesso');
