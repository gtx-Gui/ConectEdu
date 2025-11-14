import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const AuthMiddleware = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const user = localStorage.getItem('user');
                const session = localStorage.getItem('session');

                if (!user || !session) {
                    navigate('/login');
                    return;
                }

                // Verificar se a sessão ainda é válida
                const sessionData = JSON.parse(session);
                const now = Math.floor(Date.now() / 1000); // Timestamp atual em segundos
                const expiresAt = sessionData.expires_at;

                if (now > expiresAt) {
                    localStorage.removeItem('user');
                    localStorage.removeItem('session');
                    navigate('/login');
                    return;
                }

                // Verificar com o Supabase se o usuário ainda é válido
                const userData = JSON.parse(user);
                const { data: userDataFromDB, error: userError } = await supabase
                    .from('users')
                    .select('*')
                    .eq('auth_id', userData.auth_id)
                    .single();
                
                if (userError || !userDataFromDB) {
                    localStorage.removeItem('user');
                    localStorage.removeItem('session');
                    navigate('/login');
                    return;
                }

                setIsAuthenticated(true);
            } catch (error) {
                console.error('Erro na verificação de autenticação:', error);
                navigate('/login');
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, [navigate]);

    if (loading) {
        return <div>Carregando...</div>;
    }

    return isAuthenticated ? children : null;
};

export default AuthMiddleware; 