import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Busca a sessão atual do usuário
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    // Escuta mudanças de autenticação
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      setLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return <div>Carregando...</div>;
  }

  // Adiciona log para depuração
  console.log('Sessão atual:', session);

  // Checagem correta: só deixa passar se session e session.user existem
  if (!session || !session.user) {
    return <Navigate to="/login" replace />;
  }

  // Se estiver logado, renderiza o componente filho
  return children;
}

export default ProtectedRoute;