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
  
  // Preservar headers originais do Supabase (importante: não sobrescrever apikey!)
  // O Supabase já adiciona os headers necessários, então vamos preservá-los
  const originalHeaders = options.headers || {};
  
  // Converter para Headers object se necessário
  const headers = originalHeaders instanceof Headers 
    ? originalHeaders 
    : new Headers(originalHeaders);
  
  // Garantir que apikey está presente (Supabase deve adicionar, mas garantir por segurança)
  if (!headers.has('apikey') && !headers.has('Authorization')) {
    headers.set('apikey', supabaseKey);
    console.warn('⚠️ apikey não encontrada nos headers, adicionando automaticamente');
  }
  
  const requestInfo = {
    url,
    method: options.method || 'GET',
    isMobile,
    hasApiKey: headers.has('apikey'),
    timestamp: new Date().toISOString()
  };
  
  console.log('📡 Requisição Supabase:', {
    ...requestInfo,
    headersCount: headers instanceof Headers ? Array.from(headers.keys()).length : Object.keys(headers).length
  });
  
  try {
    const response = await fetch(url, {
      ...options,
      headers: headers instanceof Headers ? headers : Object.fromEntries(headers.entries())
    });
    
    const duration = Date.now() - startTime;
    
    // Verificar resposta antes de logar
    const responseStatus = {
      ...requestInfo,
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
      duration: `${duration}ms`
    };
    
    console.log(response.ok ? '✅ Resposta Supabase:' : '⚠️ Resposta Supabase com erro:', responseStatus);
    
    // Se a resposta não for ok, verificar se é erro de API key ou de dados
    if (!response.ok) {
      const clonedResponse = response.clone();
      try {
        const errorData = await clonedResponse.json();
        console.error('❌ Erro na resposta:', errorData);
        
        if (errorData.message && errorData.message.includes('API key')) {
          console.error('🔑 Erro de API key detectado:', errorData);
        }
        if (errorData.message && errorData.message.includes('permission') || errorData.message.includes('RLS')) {
          console.error('🚫 Erro de permissão RLS detectado:', errorData);
        }
      } catch (e) {
        // Se não conseguir parsear JSON, pode ser erro de rede
        console.error('⚠️ Não foi possível parsear resposta de erro:', e);
      }
    }
    
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
      'x-client-info': `conectedu-web/${isMobile ? 'mobile' : 'desktop'}`
    },
    fetch: customFetch
  }
});

// Teste de conexão inicial
console.log('🚀 Supabase Client criado com sucesso');
