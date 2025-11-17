import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    // Determinar a URL de redirecionamento baseada no ambiente
    const getRedirectUrl = () => {
      // Se houver variável de ambiente, usar ela
      if (process.env.REACT_APP_SITE_URL) {
        return process.env.REACT_APP_SITE_URL + '/reset-password';
      }
      
      // Se estiver em produção (não é localhost), usar a URL atual
      const origin = window.location.origin;
      if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
        // Em desenvolvimento, usar localhost
        return origin + '/reset-password';
      }
      
      // Em produção, usar a URL atual detectada
      return origin + '/reset-password';
    };

    const redirectUrl = getRedirectUrl();
    console.log('🔗 URL de redirecionamento:', redirectUrl);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: redirectUrl
    });

    if (error) {
      setError(error.message);
    } else {
      setMessage('Se o e-mail estiver cadastrado, você receberá um link para redefinir sua senha.');
    }
  };

  return (
    <div className="containerLogin">
      <h1 className="h1Login">Recuperar Senha</h1>
      <form onSubmit={handleSubmit} className="formLogin">
        <div className="formGroupLogin">
          <input
            type="email"
            className="inputLogin"
            placeholder="Digite seu e-mail"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
          />
        </div>
        <div className="formGroupLogin">
          <button type="submit" className="buttonLogin">
            Enviar link de recuperação
          </button>
        </div>
        {message && <div className="successLogin" style={{ color: 'white' }}>{message}</div>}
        {error && <div className="errorLogin" style={{ color: 'white' }}>{error}</div>}
      </form>
    </div>
  );
}

export default ForgotPassword; 