import { useState, useEffect } from 'react';

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
            const session = localStorage.getItem('session');
            
            if (session) {
                await fetch('http://localhost:5000/logout', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ session: JSON.parse(session) })
                });
            }
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