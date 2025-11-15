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
        // Pequeno delay para garantir que a sessão foi sincronizada após login
        await new Promise(resolve => setTimeout(resolve, 200));
        
        if (!isMounted) return;

        // 1. Buscar sessão atual do Supabase (tenta renovar automaticamente se expirada)
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('❌ Erro ao buscar sessão:', sessionError);
          
          // Tentar recuperar sessão do storage diretamente como fallback
          try {
            const possibleKeys = [
              'conectedu.supabase.auth.token',
              'sb-zosupqbyanlliswinicv-auth-token',
              'supabase.auth.token'
            ];
            
            let savedSession = null;
            for (const key of possibleKeys) {
              const session = localStorage.getItem(key);
              if (session) {
                savedSession = session;
                console.log(`⚠️ Tentando recuperar sessão da chave: ${key}`);
                break;
              }
            }
            
            if (savedSession) {
              const parsed = JSON.parse(savedSession);
              console.log('⚠️ Tentando renovar sessão do storage...');
              // Forçar refresh do token
              const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
              
              if (!refreshError && refreshedSession) {
                console.log('✅ Sessão renovada com sucesso após erro');
                if (isMounted) {
                  setSession(refreshedSession);
                }
              } else {
                // Tentar buscar novamente
                const { data: { session: retrySession } } = await supabase.auth.getSession();
                if (retrySession) {
                  console.log('✅ Sessão recuperada após retry');
                  if (isMounted) {
                    setSession(retrySession);
                  }
                }
              }
              
              if (isMounted) {
                setLoading(false);
                return;
              }
            }
          } catch (fallbackError) {
            console.error('❌ Erro no fallback de sessão:', fallbackError);
          }
          
          if (isMounted) {
            setLoading(false);
          }
          return;
        }
        
        console.log('✅ Sessão atual:', {
          user: currentSession?.user?.email,
          expiresAt: currentSession?.expires_at ? new Date(currentSession.expires_at * 1000).toLocaleString('pt-BR') : 'N/A'
        });
        
        if (!currentSession || !currentSession.user) {
          console.log('ℹ️ Usuário não autenticado');
          if (isMounted) {
            setLoading(false);
          }
          return;
        }

        // Verificar se a sessão está próxima de expirar e tentar renovar
        if (currentSession.expires_at) {
          const expiresAt = currentSession.expires_at * 1000;
          const now = Date.now();
          const timeUntilExpiry = expiresAt - now;
          const fiveMinutes = 5 * 60 * 1000; // 5 minutos em ms
          
          if (timeUntilExpiry < fiveMinutes && timeUntilExpiry > 0) {
            console.log('🔄 Sessão próxima de expirar, renovando automaticamente...');
            try {
              const { data: { session: refreshedSession }, error: refreshError } = await supabase.auth.refreshSession();
              if (!refreshError && refreshedSession) {
                console.log('✅ Sessão renovada com sucesso');
                if (isMounted) {
                  setSession(refreshedSession);
                }
              }
            } catch (refreshErr) {
              console.warn('⚠️ Erro ao renovar sessão:', refreshErr);
            }
          }
        }

        if (!isMounted) return;

        if (isMounted) {
          setSession(currentSession);
        }

        // 2. Buscar dados do usuário - PRIMEIRO do cache, depois do Supabase se necessário
        try {
          // Tentar carregar do cache primeiro
          const cachedUser = localStorage.getItem('user');
          if (cachedUser) {
            try {
              const userDataFromCache = JSON.parse(cachedUser);
              if (userDataFromCache && userDataFromCache.auth_id === currentSession.user.id) {
                console.log('✅ Dados carregados do cache:', userDataFromCache.nome);
                if (isMounted) {
                  setUserData(userDataFromCache);
                }
                // Verificar sessão em background para atualizar se necessário
                const { data: userDataFromDB } = await supabase
                  .from('users')
                  .select('id, nome, email, telefone, cpf, cnpj, cep, rua, numero, complemento, bairro, cidade, estado, tipo')
                  .eq('auth_id', currentSession.user.id)
                  .single();
                
                if (userDataFromDB && isMounted) {
                  // Atualizar cache se houver mudanças
                  localStorage.setItem('user', JSON.stringify(userDataFromDB));
                  setUserData(userDataFromDB);
                }
                return;
              }
            } catch (cacheError) {
              console.warn('⚠️ Erro ao ler cache, buscando do Supabase:', cacheError);
            }
          }
          
          // Se não há cache válido, buscar do Supabase
          console.log('🔍 Buscando dados do usuário com auth_id:', currentSession.user.id);
          
          const { data: userDataFromDB, error: userError } = await supabase
            .from('users')
            .select('id, nome, email, telefone, cpf, cnpj, cep, rua, numero, complemento, bairro, cidade, estado, tipo')
            .eq('auth_id', currentSession.user.id)
            .single();
          
          if (!isMounted) return;

          if (userError) {
            console.error('❌ Erro ao buscar dados do usuário:', {
              code: userError.code,
              message: userError.message,
              details: userError.details,
              hint: userError.hint,
              auth_id: currentSession.user.id
            });
            
            // Se o erro for PGRST116 (nenhum resultado), o usuário não existe na tabela
            if (userError.code === 'PGRST116') {
              console.warn('⚠️ Usuário autenticado mas não encontrado na tabela users. Verifique se o registro existe com auth_id:', currentSession.user.id);
            }
          } else if (!userDataFromDB) {
            console.warn('⚠️ Query retornou sem erro mas sem dados. auth_id:', currentSession.user.id);
          } else {
            console.log('✅ Dados do usuário encontrados:', {
              id: userDataFromDB.id,
              nome: userDataFromDB.nome,
              email: userDataFromDB.email,
              tipo: userDataFromDB.tipo
            });
            if (isMounted) {
              setUserData(userDataFromDB);
              // Atualizar cache
              localStorage.setItem('user', JSON.stringify(userDataFromDB));
            }
          }
        } catch (error) {
          console.error('❌ Exceção ao buscar dados do usuário:', error);
        }
      } catch (error) {
        console.error('Erro na verificação de autenticação:', error);
      } finally {
        // Garantir que sempre sai do loading, mesmo com erro
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

    // Timeout de segurança - máximo 10 segundos
    timeoutId = setTimeout(() => {
      if (isMounted) {
        console.warn('Timeout na verificação de autenticação - forçando saída do loading');
        setLoading(false);
      }
    }, 10000);

    // Escuta mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Mudança de autenticação:', event, session);
      
      if (event === 'SIGNED_OUT') {
        setSession(null);
        setUserData(null);
      } else if (session) {
        setSession(session);
        // Buscar dados do usuário novamente diretamente no Supabase
        try {
          const { data: userDataFromDB, error: userError } = await supabase
            .from('users')
            .select('id, nome, email, telefone, cpf, cnpj, cep, rua, numero, complemento, bairro, cidade, estado, tipo')
            .eq('auth_id', session.user.id)
            .single();
          
          if (!userError && userDataFromDB) {
            setUserData(userDataFromDB);
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        }
      }
      
      setLoading(false);
    });

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

  // Se há sessão mas não há dados do usuário, ainda permite acesso
  // (pode ser um problema temporário de conexão com o Supabase)
  if (!userData) {
    console.log('Usuário autenticado mas dados não encontrados no Supabase');
  }

  console.log('Usuário autenticado:', session.user.email);
  return children;
}

export default ProtectedRoute;