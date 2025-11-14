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

    const checkAuth = async () => {
      try {
        // Pequeno delay para garantir que a sessão foi sincronizada após login
        await new Promise(resolve => setTimeout(resolve, 200));
        
        if (!isMounted) return;

        // 1. Buscar sessão atual do Supabase
        const { data: { session: currentSession }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Erro ao buscar sessão:', sessionError);
          setLoading(false);
          return;
        }
        
        console.log('Sessão atual:', currentSession);
        
        if (!currentSession || !currentSession.user) {
          console.log('Usuário não autenticado');
          if (isMounted) {
            setLoading(false);
          }
          return;
        }

        if (!isMounted) return;

        // 2. Buscar dados do usuário diretamente no Supabase
        try {
          const { data: userDataFromDB, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('auth_id', currentSession.user.id)
            .single();
          
          if (!isMounted) return;

          if (userError || !userDataFromDB) {
            console.log('Usuário não encontrado na tabela users:', userError);
          } else {
            console.log('Dados do usuário:', userDataFromDB);
            setUserData(userDataFromDB);
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        }

        if (isMounted) {
          setSession(currentSession);
        }
      } catch (error) {
        console.error('Erro na verificação de autenticação:', error);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    checkAuth();

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
            .select('*')
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
      subscription.unsubscribe();
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