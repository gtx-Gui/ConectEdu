// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

// Usar variáveis de ambiente ou valores padrão para desenvolvimento
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://zosupqbyanlliswinicv.supabase.co';
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpvc3VwcWJ5YW5sbGlzd2luaWN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1NDk5NzksImV4cCI6MjA1MzEyNTk3OX0.8TOyca3W_RR2SSejrqAzVBKKc9pKjZJ3kg-ZcfmBOFI';

// Detectar se está em ambiente mobile
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Log de diagnóstico (apenas em desenvolvimento)
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 Inicializando Supabase Client');
}

// Storage resiliente (localStorage > sessionStorage)
const getStorage = () => {
  try {
    const testKey = '__supabaseTest__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    if (process.env.NODE_ENV === 'development') {
      console.log('✅ localStorage disponível');
    }
    return localStorage;
  } catch (err) {
    if (process.env.NODE_ENV === 'development') {
      console.warn('⚠️ localStorage indisponível, usando sessionStorage:', err?.message);
    }
    return sessionStorage;
  }
};

// Configuração do cliente Supabase com fallback de storage
export const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    storage: getStorage(),
    storageKey: 'conectedu.supabase.auth',
    flowType: 'pkce' // Usar PKCE para melhor segurança
  },
  global: {
    headers: {
      'x-client-info': 'conectedu-web'
    }
  },
  realtime: {
    params: {
      eventsPerSecond: 10
    }
  }
});

// Teste de conexão inicial e verificação de sessão
(async () => {
  try {
    // Verificar se há sessão salva (Supabase pode usar diferentes chaves)
    const storage = getStorage();
    const possibleKeys = [
      'conectedu.supabase.auth.token',
      'sb-zosupqbyanlliswinicv-auth-token',
      'supabase.auth.token'
    ];
    
    let savedSession = null;
    let sessionKey = null;
    
    for (const key of possibleKeys) {
      const session = storage.getItem(key);
      if (session) {
        savedSession = session;
        sessionKey = key;
        if (process.env.NODE_ENV === 'development') {
          console.log(`✅ Sessão encontrada na chave: ${key}`);
        }
        break;
      }
    }
    
    if (savedSession && process.env.NODE_ENV === 'development') {
      console.log('✅ Sessão encontrada no storage');
      try {
        const sessionData = JSON.parse(savedSession);
        if (sessionData && sessionData.expires_at) {
          const expiresAt = sessionData.expires_at * 1000;
          const now = Date.now();
          if (now >= expiresAt && process.env.NODE_ENV === 'development') {
            console.warn('⚠️ Sessão expirada, será renovada automaticamente');
          }
        }
      } catch (e) {
        if (process.env.NODE_ENV === 'development') {
          console.warn('⚠️ Erro ao verificar sessão salva:', e);
        }
      }
    }

    // Tentar buscar sessão atual do Supabase
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError && process.env.NODE_ENV === 'development') {
      console.error('❌ Erro ao recuperar sessão:', sessionError);
    }
    
  } catch (error) {
    console.error('❌ Erro ao inicializar Supabase:', error);
  }
})();

if (process.env.NODE_ENV === 'development') {
  console.log('🚀 Supabase Client criado com sucesso');
}
