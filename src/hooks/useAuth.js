import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

export const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const userData = localStorage.getItem('user');
        if (userData) {
            setUser(JSON.parse(userData));
        }
        setLoading(false);
    }, []);

    const login = (userData, sessionData) => {
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('session', JSON.stringify(sessionData));
        setUser(userData);
    };

    const logout = async () => {
        try {
            await supabase.auth.signOut();
        } catch (error) {
            console.error('Erro no logout:', error);
        } finally {
            localStorage.removeItem('user');
            localStorage.removeItem('session');
            setUser(null);
        }
    };

    return { user, loading, login, logout };
}; 