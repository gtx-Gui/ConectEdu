import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import '../pages/userDashboard.css';

const ChangePassword = () => {
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validações
    if (formData.newPassword !== formData.confirmPassword) {
      setMessage('As senhas não coincidem');
      setMessageType('error');
      return;
    }

    if (formData.newPassword.length < 6) {
      setMessage('A nova senha deve ter pelo menos 6 caracteres');
      setMessageType('error');
      return;
    }

    try {
      setLoading(true);
      setMessage('');

      // Alterar senha no Supabase Auth
      const { error } = await supabase.auth.updateUser({
        password: formData.newPassword
      });

      if (error) {
        console.error('Erro ao alterar senha:', error);
        setMessage('Erro ao alterar senha: ' + error.message);
        setMessageType('error');
      } else {
        setMessage('Senha alterada com sucesso!');
        setMessageType('success');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
    } catch (error) {
      console.error('Erro ao alterar senha:', error);
      setMessage('Erro ao alterar senha');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="dashboard-card p-4 text-light">
      <h3 className="mb-4 text-center">
        <i className="fas fa-lock me-2"></i>Alterar Senha
      </h3>

      {message && (
        <div className={`alert alert-${messageType === 'success' ? 'success' : 'danger'} mb-3`}>
          {message}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Nova Senha *</label>
          <input 
            type="password" 
            name="newPassword"
            className="form-control" 
            value={formData.newPassword}
            onChange={handleInputChange}
            required
            minLength={6}
          />
          <div className="form-text text-light">
            A senha deve ter pelo menos 6 caracteres
          </div>
        </div>

        <div className="mb-3">
          <label className="form-label">Confirmar Nova Senha *</label>
          <input 
            type="password" 
            name="confirmPassword"
            className="form-control" 
            value={formData.confirmPassword}
            onChange={handleInputChange}
            required
          />
        </div>

        <div className="d-grid">
          <button 
            type="submit" 
            className="btn btn-warning"
            disabled={loading}
          >
            {loading ? (
              <>
                <i className="fas fa-spinner fa-spin me-2"></i>
                Alterando Senha...
              </>
            ) : (
              <>
                <i className="fas fa-key me-2"></i>
                Alterar Senha
              </>
            )}
          </button>
        </div>
      </form>

      <div className="mt-3">
        <small className="text-danger">
          <i className="fas fa-info-circle me-1"></i>
          Após alterar a senha, você será deslogado automaticamente.
        </small>
      </div>
    </div>
  );
};

export default ChangePassword;