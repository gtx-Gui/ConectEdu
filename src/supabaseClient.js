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

// Storage resiliente (localStorage > sessionStorage)
const getStorage = () => {
  try {
    const testKey = '__supabaseTest__';
    localStorage.setItem(testKey, testKey);
    localStorage.removeItem(testKey);
    console.log('✅ localStorage disponível');
    return localStorage;
  } catch (err) {
    console.warn('⚠️ localStorage indisponível, usando sessionStorage:', err?.message);
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
        console.log(`✅ Sessão encontrada na chave: ${key}`);
        break;
      }
    }
    
    if (savedSession) {
      console.log('✅ Sessão encontrada no storage');
      try {
        const sessionData = JSON.parse(savedSession);
        if (sessionData && sessionData.expires_at) {
          const expiresAt = sessionData.expires_at * 1000; // Converter para ms
          const now = Date.now();
          if (now < expiresAt) {
            console.log('✅ Sessão válida, expira em:', new Date(expiresAt).toLocaleString('pt-BR'));
          } else {
            console.warn('⚠️ Sessão expirada, será renovada automaticamente');
          }
        }
      } catch (e) {
        console.warn('⚠️ Erro ao verificar sessão salva:', e);
      }
    } else {
      console.log('ℹ️ Nenhuma sessão encontrada no storage');
    }

    // Tentar buscar sessão atual do Supabase
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('❌ Erro ao recuperar sessão:', sessionError);
    } else if (session) {
      console.log('✅ Sessão recuperada com sucesso:', {
        user: session.user?.email,
        expiresAt: session.expires_at ? new Date(session.expires_at * 1000).toLocaleString('pt-BR') : 'N/A'
      });
    } else {
      console.log('ℹ️ Nenhuma sessão ativa no momento');
    }

    // Teste simples de conexão (buscar uma tabela vazia ou fazer um select simples)
    console.log('🔍 Testando conexão com o banco de dados...');
    
  } catch (error) {
    console.error('❌ Erro ao inicializar Supabase:', error);
  }
})();

console.log('🚀 Supabase Client criado com sucesso');
