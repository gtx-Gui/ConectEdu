// src/pages/Login.js
import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Login.css';

function Login() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [info, setInfo] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

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
            // 1. Limpar sessão anterior do Supabase (sem await para não bloquear)
            supabase.auth.signOut().catch(err => console.log('Erro ao fazer signOut:', err));
            
            // 2. Limpar localStorage
            localStorage.removeItem('user');
            localStorage.removeItem('session');

            // 3. Fazer login diretamente no Supabase
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
                email,
                password
            });

            if (authError) {
                console.error('Erro de autenticação:', authError);
                // Mensagens de erro mais específicas
                if (authError.message.includes('Invalid login credentials') || authError.message.includes('Email ou senha')) {
                    throw new Error('Email ou senha inválidos');
                } else if (authError.message.includes('Failed to fetch') || authError.message.includes('Network')) {
                    throw new Error('Erro de conexão. Verifique sua internet e tente novamente.');
                } else {
                    throw new Error(authError.message || 'Erro ao fazer login');
                }
            }

            if (!authData || !authData.user) {
                throw new Error('Erro ao autenticar usuário');
            }

            const authUserId = authData.user.id;
            console.log('✅ Autenticação bem-sucedida. Auth User ID:', authUserId);

            // 4. Buscar dados do usuário na tabela users
            console.log('🔍 Buscando dados do usuário na tabela users com auth_id:', authUserId);
            
            const { data: userData, error: userError } = await supabase
                .from('users')
                .select('id, nome, email, telefone, cpf, cnpj, cep, rua, numero, complemento, bairro, cidade, estado, tipo')
                .eq('auth_id', authUserId)
                .single();

            if (userError) {
                console.error('❌ Erro ao buscar dados do usuário:', userError);
                console.error('Detalhes do erro:', {
                    message: userError.message,
                    details: userError.details,
                    hint: userError.hint,
                    code: userError.code
                });
                
                // Verificar se é erro de permissão (RLS)
                if (userError.code === 'PGRST116' || userError.message.includes('permission') || userError.message.includes('RLS')) {
                    console.error('🚫 Erro de permissão detectado - pode ser necessário ajustar RLS na tabela users');
                    throw new Error('Erro de permissão ao buscar dados do usuário. Entre em contato com o suporte.');
                }
                
                // Verificar se é erro de rede
                if (userError.message.includes('Failed to fetch') || userError.message.includes('Network')) {
                    throw new Error('Erro de conexão ao buscar dados do usuário. Verifique sua internet e tente novamente.');
                }
                
                // Verificar se usuário não existe
                if (userError.code === 'PGRST116' || userError.message.includes('No rows')) {
                    console.error('⚠️ Usuário não encontrado na tabela users. O usuário pode não ter completado o cadastro.');
                    throw new Error('Usuário não encontrado no sistema. Verifique se completou o cadastro corretamente.');
                }
                
                throw new Error(`Erro ao buscar dados: ${userError.message}`);
            }

            if (!userData) {
                console.error('⚠️ userData é null/undefined. Auth ID usado:', authUserId);
                throw new Error('Dados do usuário não encontrados no sistema. Entre em contato com o suporte.');
            }
            
            console.log('✅ Dados do usuário encontrados:', {
                id: userData.id,
                nome: userData.nome,
                email: userData.email,
                tipo: userData.tipo
            });

            // 5. Salvar nova sessão
            localStorage.setItem('user', JSON.stringify(userData));
            localStorage.setItem('session', JSON.stringify(authData.session));

            console.log('Login bem-sucedido para:', userData.nome);
            
            // 6. Aguardar um pouco para garantir que a sessão foi salva
            await new Promise(resolve => setTimeout(resolve, 100));
            
            // 7. Redirecionar para a página original ou dashboard usando navigate (sem recarregar página)
            const redirectTo = location.state?.from || '/userdashboard';
            navigate(redirectTo, { replace: true });

        } catch (error) {
            console.error('Erro completo no login:', error);
            // Exibir mensagem de erro mais amigável
            if (error.message.includes('Failed to fetch') || error.message.includes('Network')) {
                setError('Erro de conexão. Verifique sua internet e tente novamente. Se o problema persistir, verifique se o Supabase está acessível.');
            } else {
                setError(error.message || 'Erro ao fazer login. Tente novamente.');
            }
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