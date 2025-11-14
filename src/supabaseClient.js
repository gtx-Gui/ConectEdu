// src/supabaseClient.js
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = 'https://zosupqbyanlliswinicv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpvc3VwcWJ5YW5sbGlzd2luaWN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1NDk5NzksImV4cCI6MjA1MzEyNTk3OX0.8TOyca3W_RR2SSejrqAzVBKKc9pKjZJ3kg-ZcfmBOFI';

// Detectar se está em ambiente mobile
const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

// Configuração de storage para mobile (usar localStorage se disponível, caso contrário usar sessionStorage)
const getStorage = () => {
  try {
    // Testar se localStorage está disponível
    const test = '__storage_test__';
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return localStorage;
  } catch (e) {
    // Se localStorage não estiver disponível (modo privado no mobile), usar sessionStorage
    console.warn('localStorage não disponível, usando sessionStorage');
    return sessionStorage;
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
      'x-client-info': `conectedu-web/${isMobile ? 'mobile' : 'desktop'}`
    },
    fetch: (url, options = {}) => {
      // Aumentar timeout para conexões móveis que podem ser mais lentas
      const timeout = isMobile ? 30000 : 10000; // 30s para mobile, 10s para desktop
      
      // Criar AbortController para timeout compatível com todos os navegadores
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), timeout);
      
      return fetch(url, {
        ...options,
        signal: controller.signal
      }).then((response) => {
        clearTimeout(timeoutId);
        return response;
      }).catch((error) => {
        clearTimeout(timeoutId);
        // Tratamento específico para erros de timeout em mobile
        if (error.name === 'AbortError' || error.message === 'The operation was aborted') {
          console.error('Timeout na requisição Supabase (mobile):', error);
          throw new Error('Tempo de conexão excedido. Verifique sua internet e tente novamente.');
        }
        throw error;
      });
    }
  }
});
