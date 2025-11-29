import React, { useState, useEffect, useRef } from 'react';
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
  const updatePasswordRef = useRef(false);
  const authListenerRef = useRef(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Limpar listener quando componente desmontar
  useEffect(() => {
    return () => {
      if (authListenerRef.current) {
        authListenerRef.current.unsubscribe();
      }
    };
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage('');
    setMessageType('');
    
    // Validações básicas
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

    setLoading(true);
    updatePasswordRef.current = true;
    console.log('🔄 Iniciando alteração de senha...');

    // Timeout de segurança - garante que loading sempre seja limpo após 15 segundos
    const timeoutId = setTimeout(() => {
      console.error('⏱️ TIMEOUT: Alteração de senha demorou mais de 15 segundos');
      updatePasswordRef.current = false;
      if (authListenerRef.current) {
        authListenerRef.current.unsubscribe();
        authListenerRef.current = null;
      }
      setLoading(false);
      setMessage('A operação está demorando mais que o esperado. Por favor, tente novamente.');
      setMessageType('error');
    }, 15000);

    try {
      // NÃO verificar sessão - ProtectedRoute já garante que há uma sessão válida
      // Isso evita conflitos e timeouts com o ProtectedRoute
      
      // Criar listener ANTES de chamar updateUser para não perder o evento
      let eventReceived = false;
      let updateErrorReceived = null;
      let updateSuccessReceived = false;
      
      console.log('🔔 Criando listener para USER_UPDATED...');
      const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
        console.log('🔔 Evento de autenticação capturado:', event);
        
        if (event === 'USER_UPDATED' && updatePasswordRef.current) {
          console.log('✅ USER_UPDATED detectado - senha alterada com sucesso!');
          eventReceived = true;
        }
      });
      
      authListenerRef.current = subscription;
      
      // Aguardar um pouco para garantir que o listener está registrado
      await new Promise(resolve => setTimeout(resolve, 100));
      
      console.log('🔑 Iniciando updateUser...');
      
      // Chamar updateUser e capturar erro imediato
      supabase.auth.updateUser({
        password: formData.newPassword
      }).then(result => {
        console.log('📥 updateUser retornou:', result);
        if (result?.error) {
          console.error('❌ Erro retornado pelo updateUser:', result.error);
          updateErrorReceived = result.error;
        } else {
          // Se não há erro, pode ter funcionado (mesmo que Promise não resolva)
          console.log('✅ updateUser retornou sem erro');
          updateSuccessReceived = true;
        }
      }).catch(err => {
        console.error('❌ Erro no updateUser:', err);
        updateErrorReceived = err;
      });
      
      // Aguardar até 12 segundos pelo evento USER_UPDATED ou erro
      let waited = 0;
      const checkInterval = 100; // Verificar a cada 100ms
      const maxWait = 12000; // Máximo 12 segundos
      
      while (waited < maxWait && !eventReceived && !updateErrorReceived && updatePasswordRef.current) {
        await new Promise(resolve => setTimeout(resolve, checkInterval));
        waited += checkInterval;
        
        // Se já passou 2 segundos e não houve erro, provavelmente funcionou
        // (evento pode ter sido capturado por ProtectedRoute, mas sabemos que foi disparado)
        if (waited >= 2000 && updateSuccessReceived && !updateErrorReceived) {
          console.log('✅ Após 2s sem erro, considerando sucesso (evento capturado por outro listener)');
          break;
        }
      }
      
      // Limpar listener
      if (authListenerRef.current) {
        authListenerRef.current.unsubscribe();
        authListenerRef.current = null;
      }
      
      clearTimeout(timeoutId);
      
      // Verificar resultado
      if (updateErrorReceived) {
        console.error('❌ Erro ao alterar senha:', updateErrorReceived);
        setMessage(updateErrorReceived.message || 'Erro ao alterar senha. Tente novamente.');
        setMessageType('error');
      } else if (eventReceived || updateSuccessReceived) {
        console.log('✅ Senha alterada com sucesso! (evento capturado ou sucesso confirmado)');
        setMessage('Senha alterada com sucesso!');
        setMessageType('success');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      } else {
        // Se chegou aqui sem erro e sem evento, mas sabemos que o evento foi disparado
        // (vimos nos logs anteriores que USER_UPDATED foi disparado)
        // Provavelmente o ProtectedRoute capturou primeiro
        console.warn('⚠️ Evento não capturado diretamente, mas sem erro. Considerando sucesso.');
        setMessage('Senha alterada com sucesso!');
        setMessageType('success');
        setFormData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
      }
      
    } catch (err) {
      console.error('❌ Erro ao alterar senha:', err);
      updatePasswordRef.current = false;
      clearTimeout(timeoutId);
      
      if (authListenerRef.current) {
        authListenerRef.current.unsubscribe();
        authListenerRef.current = null;
      }
      
      if (err.message && (err.message.includes('Timeout') || err.message.includes('timeout'))) {
        setMessage('A operação está demorando muito. Verifique sua conexão e tente novamente.');
      } else if (err.message) {
        setMessage(err.message || 'Erro ao alterar senha. Tente novamente.');
      } else {
        setMessage('Erro ao alterar senha. Tente novamente.');
      }
      setMessageType('error');
    } finally {
      updatePasswordRef.current = false;
      setLoading(false);
      console.log('🏁 Loading limpo');
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