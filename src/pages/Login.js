// src/pages/Login.js
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);
            setError(null);

            const { data, error } = await supabase.auth.signInWithPassword({
                email,
                password,
            });

            if (error) throw error;

            // Login bem-sucedido
            console.log('Usuário logado:', data);
            // Aqui você pode redirecionar o usuário
             window.location.href = '/userdashboard';

        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="containerLogin">
            <h1 className="h1Login">Entrar</h1>
            
            {error && (
                <div className="errorLogin">
                    {error}
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
                    <a href="#" onClick={() => {/* Implementar recuperação de senha */}}>
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