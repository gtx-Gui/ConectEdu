// src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);
    const location = useLocation();

    // Mostrar mensagem de redirecionamento se houver
    useEffect(() => {
        if (location.state?.message) {
            let message = location.state.message;
            if (location.state.from) {
                message += ` (Tentando acessar: ${location.state.from})`;
            }
            setInfo(message);
        }
    }, [location]);

    const handleLogin = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);
        setInfo(null);

        try {
            // 1. Limpar sessão anterior do Supabase
            await supabase.auth.signOut();
            
            // 2. Limpar localStorage
            localStorage.removeItem('user');
            localStorage.removeItem('session');

            // 3. Fazer login diretamente no Supabase
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (authError) {
                throw new Error('Email ou senha inválidos');
            }

            const authUserId = authData.user.id;

            // 4. Buscar dados do usuário na tabela users
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('*')
                .eq('auth_id', authUserId)
                .single();

            if (userError || !userData) {
                throw new Error('Dados do usuário não encontrados');
            }

            // 5. Salvar nova sessão
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('session', JSON.stringify(authData.session));

            console.log('Login bem-sucedido para:', userData.nome);
            
            // 6. Redirecionar para a página original ou dashboard
            const redirectTo = location.state?.from || '/userdashboard';
            window.location.href = redirectTo;

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="containerLogin">
            <h1 className="h1Login">Entrar</h1>
            
            {info && (
                <div className="infoLogin" style={{
                    backgroundColor: '#d1ecf1',
                    color: '#0c5460',
                    padding: '10px',
                    borderRadius: '5px',
                    marginBottom: '15px',
                    border: '1px solid #bee5eb'
                }}>
                    ℹ️ {info}
                </div>
            )}
            
            {error && (
                <div className="errorLogin">
                    ❌ {error}
                </div>
            )}

            <form onSubmit={handleLogin} className="formLogin">
                <div className="formGroupLogin">
                    <input 
                        type="email" 
                        className="inputLogin"
                        placeholder="E-mail"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required 
                    />
                </div>
                
                <div className="formGroupLogin">
                    <input 
                        type="password" 
                        className="inputLogin"
                        placeholder="Senha"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required 
                    />
                </div>

                <div className="formGroupLogin">
                    <button 
                        type="submit" 
                        className="buttonLogin"
                        disabled={loading}
                    >
                        {loading ? 'Carregando...' : 'Entrar'}
                    </button>
                </div>

                <div className="linksLogin">
                    <a href="/forgot-password">
                        Esqueceu a senha?
                    </a>
                    <p>
                        Não tem uma conta? <a href="/register">Cadastre-se</a>
                    </p>
                </div>
            </form>
        </div>
    );
}

export default Login;