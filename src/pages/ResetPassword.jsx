import React, { useState } from 'react';
import { supabase } from '../supabaseClient';

function ResetPassword() {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setError('');

    if (password !== confirmPassword) {
      setError('As senhas não coincidem.');
      return;
    }

    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setError(error.message);
    } else {
      setMessage('Senha redefinida com sucesso! Você já pode fazer login.');
    }
  };

  return (
    <div className="containerLogin">
      <h1 className="h1Login">Redefinir Senha</h1>
      <form onSubmit={handleSubmit} className="formLogin">
        <div className="formGroupLogin">
          <input
            type="password"
            className="inputLogin"
            placeholder="Nova senha"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
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
          />
        </div>
        <div className="formGroupLogin">
          <button type="submit" className="buttonLogin">
            Redefinir senha
          </button>
        </div>
        {message && <div className="successLogin" style={{ color: 'white' }}>{message}</div>}
        {error && <div className="errorLogin" style={{ color: 'white' }}>{error}</div>}
      </form>
    </div>
  );
}

export default ResetPassword; 