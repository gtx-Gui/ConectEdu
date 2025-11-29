import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [userData, setUserData] = useState(null);
  const location = useLocation();

  useEffect(() => {
    let isMounted = true;
    let timeoutId;

    const checkAuth = async () => {
      try {
        if (!isMounted) return;

        // 1. PRIMEIRO: Tentar usar cache IMEDIATAMENTE (sem delay) para acesso rápido
        let cachedUserData = null;
        try {
          const cachedUser = localStorage.getItem('user');
          if (cachedUser) {
            cachedUserData = JSON.parse(cachedUser);
          }
        } catch (cacheError) {
          console.warn('⚠️ Erro ao ler cache:', cacheError);
        }

        // 2. Verificar se localStorage foi limpo (logout) - se sim, bloquear acesso
        // Verificar se há alguma das chaves de sessão do Supabase ainda presente
        const supabaseSessionKeys = [
          'conectedu.supabase.auth.token',
          'sb-zosupqbyanlliswinicv-auth-token',
          'supabase.auth.token',
          'conectedu.supabase.auth'
        ];
        
        const hasSupabaseSession = supabaseSessionKeys.some(key => {
          try {
            return localStorage.getItem(key) || sessionStorage.getItem(key);
          } catch {
            return false;
          }
        });
        
        // Se não há cache E não há chave de sessão do Supabase, provavelmente foi logout
        // Neste caso, bloquear acesso mesmo antes de verificar getSession()
        if (!cachedUserData && !hasSupabaseSession) {
          console.log('ℹ️ Sem cache e sem sessão no storage - logout detectado');
          if (isMounted) {
            setLoading(false);
          }
          return;
        }
        
        // 3. Se há cache válido, LIBERAR IMEDIATAMENTE sem esperar getSession()
        // Isso evita timeout e acelera o carregamento
        if (cachedUserData && cachedUserData.auth_id) {
          console.log('✅ Cache encontrado, liberando UI imediatamente:', cachedUserData.nome);
          if (isMounted) {
            setUserData(cachedUserData);
            setLoading(false); // LIBERAR UI IMEDIATAMENTE - sem esperar getSession()
            
            // Tentar buscar sessão e dados atualizados em BACKGROUND (sem bloquear)
            setTimeout(async () => {
              if (!isMounted) return;
              
              try {
                // Buscar sessão em background (sem timeout curto, deixar tentar)
                const { data: { session } } = await supabase.auth.getSession();
                if (session && session.user && isMounted) {
                  setSession(session);
                  
                  // Se session.user.id corresponde ao cache, tentar atualizar dados
                  if (session.user.id === cachedUserData.auth_id) {
                    try {
                      const { data: userDataFromDB, error: userError } = await supabase
                        .from('users')
                        .select('id, nome, email, telefone, cpf, cnpj, cep, rua, numero, complemento, bairro, cidade, estado, tipo')
                        .eq('auth_id', session.user.id)
                        .single();

                      if (!userError && userDataFromDB && isMounted) {
                        console.log('✅ Dados atualizados em background');
                        localStorage.setItem('user', JSON.stringify(userDataFromDB));
                        setUserData(userDataFromDB);
                      }
                    } catch (error) {
                      console.warn('⚠️ Erro ao atualizar dados em background:', error);
                    }
                  }
                } else {
                  // Se getSession() não retorna sessão mas há cache
                  // Não limpar cache imediatamente - pode ser apenas timeout temporário
                  // O cache ainda é válido para permitir acesso
                  console.log('ℹ️ Cache presente mas sessão não encontrada (pode ser timeout) - mantendo cache');
                }
              } catch (err) {
                // Ignorar erros em background, cache já está sendo usado
                console.warn('⚠️ Erro ao buscar sessão em background (ignorando):', err.message);
              }
            }, 50); // Delay mínimo para não bloquear UI
            
            return; // SAIR AQUI - não precisa fazer getSession() agora
          }
        }

        // 4. Se não há cache, tentar buscar sessão (com timeout curto)
        const sessionPromise = supabase.auth.getSession();
        const timeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout ao verificar sessão')), 2000); // Reduzido para 2s
        });

        let currentSession = null;
        try {
          const result = await Promise.race([sessionPromise, timeoutPromise]);
          currentSession = result?.data?.session || null;
        } catch (error) {
          console.warn('⚠️ Timeout ao verificar sessão (sem cache):', error.message);
          // Sem cache e sem sessão, redirecionar
          if (isMounted) {
            setLoading(false);
          }
          return;
        }

        if (!isMounted) return;

        // 5. Se não há sessão válida OU se localStorage foi limpo (logout), redirecionar
        // Verificar novamente se localStorage foi limpo (caso logout tenha acontecido durante verificação)
        const stillHasUserCache = localStorage.getItem('user');
        if (!currentSession || !currentSession.user || !stillHasUserCache) {
          console.log('ℹ️ Usuário não autenticado ou logout detectado');
          if (isMounted) {
            setLoading(false);
            // Limpar qualquer sessão residual
            setSession(null);
            setUserData(null);
          }
          return;
        }

        // 6. Sessão válida encontrada - usar cache IMEDIATAMENTE se válido
        if (isMounted) {
          setSession(currentSession);
        }

        // Verificar se cache é válido para este usuário
        if (cachedUserData && cachedUserData.auth_id === currentSession.user.id) {
          console.log('✅ Usando dados do cache:', cachedUserData.nome);
          if (isMounted) {
            setUserData(cachedUserData);
            setLoading(false); // LIBERAR UI IMEDIATAMENTE
          }

          // Buscar dados atualizados em BACKGROUND (sem bloquear UI)
          setTimeout(async () => {
            if (!isMounted) return;
            
            try {
              const { data: userDataFromDB, error: userError } = await supabase
                .from('users')
                .select('id, nome, email, telefone, cpf, cnpj, cep, rua, numero, complemento, bairro, cidade, estado, tipo')
                .eq('auth_id', currentSession.user.id)
                .single();

              if (!userError && userDataFromDB && isMounted) {
                console.log('✅ Dados atualizados em background');
                localStorage.setItem('user', JSON.stringify(userDataFromDB));
                setUserData(userDataFromDB);
              }
            } catch (error) {
              console.warn('⚠️ Erro ao atualizar dados em background:', error);
            }
          }, 100);
          return;
        }

        // 7. Se não há cache válido, buscar dados (com timeout curto)
        if (isMounted) {
          setLoading(false); // Permitir acesso mesmo sem dados do usuário
        }

        const userDataPromise = supabase
          .from('users')
          .select('id, nome, email, telefone, cpf, cnpj, cep, rua, numero, complemento, bairro, cidade, estado, tipo')
          .eq('auth_id', currentSession.user.id)
          .single();

        const userTimeoutPromise = new Promise((_, reject) => {
          setTimeout(() => reject(new Error('Timeout ao buscar dados do usuário')), 3000);
        });

        try {
          const { data: userDataFromDB, error: userError } = await Promise.race([
            userDataPromise,
            userTimeoutPromise
          ]);

          if (!userError && userDataFromDB && isMounted) {
            console.log('✅ Dados do usuário encontrados:', userDataFromDB.nome);
            setUserData(userDataFromDB);
            localStorage.setItem('user', JSON.stringify(userDataFromDB));
          } else if (userError) {
            console.warn('⚠️ Erro ao buscar dados:', userError.message);
            // Se houver cache antigo, usar mesmo que não corresponda
            if (cachedUserData && isMounted) {
              console.warn('⚠️ Usando cache antigo como fallback');
              setUserData(cachedUserData);
            }
          }
        } catch (error) {
          console.warn('⚠️ Timeout ou erro ao buscar dados do usuário:', error.message);
          // Usar cache se disponível
          if (cachedUserData && isMounted) {
            console.warn('⚠️ Usando cache devido a timeout');
            setUserData(cachedUserData);
          }
        }

      } catch (error) {
        console.error('❌ Erro na verificação de autenticação:', error);
      } finally {
        // SEMPRE limpar loading
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    // Escuta mudanças de autenticação PRIMEIRO (para capturar eventos rapidamente)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('🔄 Mudança de autenticação:', event, session);
      
      if (event === 'SIGNED_OUT') {
        if (isMounted) {
          setSession(null);
          setUserData(null);
          setLoading(false);
        }
      } else if (session && session.user) {
        console.log('✅ Sessão detectada pelo onAuthStateChange:', session.user.email);
        
        if (isMounted) {
          setSession(session);
          setLoading(false); // Liberar loading quando sessão é detectada
        }

        // Buscar dados do usuário em background
        try {
          // Tentar cache primeiro
          const cachedUser = localStorage.getItem('user');
          if (cachedUser) {
            try {
              const cachedData = JSON.parse(cachedUser);
              if (cachedData && cachedData.auth_id === session.user.id && isMounted) {
                console.log('✅ Usando cache do usuário:', cachedData.nome);
                setUserData(cachedData);
              }
            } catch (e) {
              console.warn('⚠️ Erro ao ler cache:', e);
            }
          }

          // Buscar dados atualizados em background
          const { data: userDataFromDB, error: userError } = await supabase
            .from('users')
            .select('id, nome, email, telefone, cpf, cnpj, cep, rua, numero, complemento, bairro, cidade, estado, tipo')
            .eq('auth_id', session.user.id)
            .single();
          
          if (!userError && userDataFromDB && isMounted) {
            console.log('✅ Dados do usuário atualizados:', userDataFromDB.nome);
            setUserData(userDataFromDB);
            localStorage.setItem('user', JSON.stringify(userDataFromDB));
          }
        } catch (error) {
          console.warn('⚠️ Erro ao buscar dados do usuário:', error);
        }
      }
    });

    // Depois executa verificação manual (fallback caso onAuthStateChange não dispare rapidamente)
    checkAuth();

    // Timeout de segurança - máximo 2 segundos (reduzido ainda mais)
    // Se há cache, loading já foi liberado, então este timeout só pega casos sem cache
    timeoutId = setTimeout(() => {
      if (isMounted) {
        console.warn('⏱️ Timeout na verificação de autenticação - forçando saída do loading');
        setLoading(false);
      }
    }, 2000);

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      if (subscription) {
        subscription.unsubscribe();
      }
    };
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666',
        flexDirection: 'column'
      }}>
        <div style={{ textAlign: 'center', marginBottom: '20px' }}>
           Verificando autenticação...
        </div>
        <div style={{
          width: '50px',
          height: '50px',
          border: '3px solid #f3f3f3',
          borderTop: '3px solid #007bff',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite'
        }}></div>
        <style>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Se não há sessão, redireciona para login
  if (!session || !session.user) {
    console.log('Redirecionando para login - usuário não autenticado');
    return (
      <Navigate 
        to="/login" 
        replace 
        state={{ 
          message: 'Você precisa estar logado para acessar esta página',
          from: location.pathname 
        }} 
      />
    );
  }

  // Se há sessão mas não há dados do usuário, tentar usar cache como último recurso
  // (pode ser um problema temporário de conexão com o Supabase)
  if (!userData) {
    console.warn('⚠️ Usuário autenticado mas dados não encontrados no Supabase');
    
      // Tentar usar cache como último recurso
      try {
        const fallbackCache = localStorage.getItem('user');
        if (fallbackCache) {
          try {
            const fallbackData = JSON.parse(fallbackCache);
            if (fallbackData && session.user && fallbackData.auth_id === session.user.id) {
              console.log('✅ Usando cache como fallback para dados do usuário');
              setUserData(fallbackData);
            } else if (fallbackData && fallbackData.auth_id) {
              // Se auth_id não corresponde, pode ser que a sessão mudou
              // Mas ainda pode ser válido - só não usar para este caso
              console.log('ℹ️ Cache encontrado mas auth_id diferente - pode ser sessão diferente');
            } else {
              console.warn('⚠️ Cache encontrado mas sem auth_id válido');
            }
          } catch (cacheError) {
            console.error('❌ Erro ao ler cache de fallback:', cacheError);
          }
        } else {
          console.warn('⚠️ Nenhum cache disponível para fallback');
        }
      } catch (error) {
        console.error('❌ Erro ao tentar usar cache de fallback:', error);
      }
    
    // Mesmo sem dados, permite acesso (componentes filhos buscarão diretamente)
    // Isso evita bloqueio em caso de problemas temporários com o Supabase
  }

  console.log('✅ Usuário autenticado:', session.user.email);
  return children;
}

export default ProtectedRoute;