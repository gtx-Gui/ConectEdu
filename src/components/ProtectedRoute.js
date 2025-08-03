import React, { useEffect, useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);
  const [userData, setUserData] = useState(null);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // 1. Buscar sessão atual do Supabase
        const { data: { session: currentSession } } = await supabase.auth.getSession();
        
        console.log('Sessão atual:', currentSession);
        
        if (!currentSession || !currentSession.user) {
          console.log('Usuário não autenticado');
          setLoading(false);
          return;
        }

        // 2. Buscar dados do usuário no backend
        try {
          const response = await fetch(`http://localhost:5000/user-data/${currentSession.user.id}`);
          
          if (response.ok) {
            const userDataFromBackend = await response.json();
            console.log('Dados do usuário:', userDataFromBackend);
            setUserData(userDataFromBackend);
          } else {
            console.log('Usuário não encontrado no backend');
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        }

        setSession(currentSession);
      } catch (error) {
        console.error('Erro na verificação de autenticação:', error);
      } finally {
        setLoading(false);
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
        // Buscar dados do usuário novamente
        try {
          const response = await fetch(`http://localhost:5000/user-data/${session.user.id}`);
          if (response.ok) {
            const userDataFromBackend = await response.json();
            setUserData(userDataFromBackend);
          }
        } catch (error) {
          console.error('Erro ao buscar dados do usuário:', error);
        }
      }
      
      setLoading(false);
    });

    return () => {
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
  // (pode ser um problema temporário de conexão com o backend)
  if (!userData) {
    console.log('Usuário autenticado mas dados não encontrados no backend');
  }

  console.log('Usuário autenticado:', session.user.email);
  return children;
}

export default ProtectedRoute;