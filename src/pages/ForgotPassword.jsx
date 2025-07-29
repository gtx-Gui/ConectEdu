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

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: window.location.origin + '/reset-password'
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