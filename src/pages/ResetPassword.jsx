import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  // Verificar se há um token na URL e processar a sessão
  useEffect(() => {
    const checkSessionAndToken = async () => {
      try {
        // Verificar se há um hash na URL (o Supabase envia o token assim)
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const accessToken = hashParams.get('access_token');
        const refreshToken = hashParams.get('refresh_token');
        const type = hashParams.get('type');

        // Se houver tokens na URL, processar
        if (accessToken && refreshToken && type === 'recovery') {
          console.log('🔑 Token de recuperação detectado na URL');
          
          // Criar sessão a partir dos tokens
          const { data, error: sessionError } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });

          if (sessionError) {
            console.error('Erro ao processar sessão:', sessionError);
            setError('Link inválido ou expirado. Por favor, solicite um novo link de recuperação.');
            setLoading(false);
            return;
          }

          if (data.session) {
            console.log('✅ Sessão criada com sucesso');
            setIsAuthenticated(true);
            // Limpar hash da URL
            window.history.replaceState(null, null, window.location.pathname);
          } else {
            setError('Não foi possível criar a sessão. Por favor, solicite um novo link de recuperação.');
          }
        } else {
          // Verificar se já há uma sessão válida
          const { data: { session }, error: sessionError } = await supabase.auth.getSession();
          if (session && !sessionError) {
            console.log('✅ Sessão existente encontrada');
            setIsAuthenticated(true);
          } else {
            setError('Por favor, use o link enviado por email para redefinir sua senha.');
          }
        }
      } catch (err) {
        console.error('Erro ao verificar sessão:', err);
        setError('Erro ao processar o link de recuperação. Tente novamente.');
      } finally {
        setLoading(false);
      }
    };

    checkSessionAndToken();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (!isAuthenticated) {
      setError('Por favor, use o link enviado por email para redefinir sua senha.');
      return;
    }

    if (password.length < 6) {
      setError('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    setLoading(true);

    try {
      const { error: updateError } = await supabase.auth.updateUser({ password });
      
      if (updateError) {
        setError(updateError.message || 'Erro ao redefinir senha. Tente novamente.');
      } else {
        setMessage('Senha redefinida com sucesso! Redirecionando para login...');
        // Redirecionar para login após 2 segundos
        setTimeout(() => {
          navigate('/login');
        }, 2000);
      }
    } catch (err) {
      console.error('Erro ao atualizar senha:', err);
      setError('Erro ao redefinir senha. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  if (loading && !isAuthenticated) {
    return (
      <div className="containerLogin">
        <h1 className="h1Login">Verificando link...</h1>
        <div style={{ textAlign: 'center', color: 'white' }}>
          <p>Processando seu link de recuperação...</p>
        </div>
        {error && <div className="errorLogin" style={{ color: 'white' }}>{error}</div>}
      </div>
    );
  }

  return (
    <div className="containerLogin">
      <h1 className="h1Login">Redefinir Senha</h1>
      <form onSubmit={handleSubmit} className="formLogin">
        <div className="formGroupLogin">
          <input
            type="password"
            className="inputLogin"
            placeholder="Nova senha (mínimo 6 caracteres)"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            minLength={6}
            disabled={loading}
          />
        </div>
        <div className="formGroupLogin">
          <input
            type="password"
            className="inputLogin"
            placeholder="Confirme a nova senha"
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
          />
        </div>
        <div className="formGroupLogin">
          <button type="submit" className="buttonLogin" disabled={loading || !isAuthenticated}>
            {loading ? 'Redefinindo...' : 'Redefinir senha'}
          </button>
        </div>
        {message && <div className="successLogin" style={{ color: 'white' }}>{message}</div>}
        {error && <div className="errorLogin" style={{ color: 'white' }}>{error}</div>}
      </form>
    </div>
  );
}

export default ResetPassword; 