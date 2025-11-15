import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import '../pages/userDashboard.css';

const UserProfile = () => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showData, setShowData] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      setError('');
      
      // PRIMEIRO: Tentar carregar do cache
      try {
        const cachedUser = localStorage.getItem('user');
        if (cachedUser) {
          const userDataFromCache = JSON.parse(cachedUser);
          if (userDataFromCache) {
            console.log('✅ Dados do perfil carregados do cache');
            setUserData(userDataFromCache);
            setFormData({
              nome: userDataFromCache.nome || '',
              email: userDataFromCache.email || '',
              telefone: userDataFromCache.telefone || '',
              cpf: userDataFromCache.cpf || '',
              cnpj: userDataFromCache.cnpj || '',
              cep: userDataFromCache.cep || '',
              rua: userDataFromCache.rua || '',
              numero: userDataFromCache.numero || '',
              complemento: userDataFromCache.complemento || '',
              bairro: userDataFromCache.bairro || '',
              cidade: userDataFromCache.cidade || '',
              estado: userDataFromCache.estado || ''
            });
            setLoading(false);
            // Verificar se há atualizações em background (sem bloquear UI)
            const { data: { session } } = await supabase.auth.getSession();
            if (session && session.user) {
              const { data } = await supabase
                .from('users')
                .select('id, nome, email, telefone, cpf, cnpj, cep, rua, numero, complemento, bairro, cidade, estado, tipo')
                .eq('auth_id', session.user.id)
                .single();
              if (data) {
                // Atualizar cache e dados se houver mudanças
                localStorage.setItem('user', JSON.stringify(data));
                setUserData(data);
                setFormData({
                  nome: data.nome || '',
                  email: data.email || '',
                  telefone: data.telefone || '',
                  cpf: data.cpf || '',
                  cnpj: data.cnpj || '',
                  cep: data.cep || '',
                  rua: data.rua || '',
                  numero: data.numero || '',
                  complemento: data.complemento || '',
                  bairro: data.bairro || '',
                  cidade: data.cidade || '',
                  estado: data.estado || ''
                });
              }
            }
            return;
          }
        }
      } catch (cacheError) {
        console.warn('⚠️ Erro ao ler cache, buscando do Supabase:', cacheError);
      }
      
      // SEGUNDO: Se não há cache, buscar do Supabase
      const { data: { session } } = await supabase.auth.getSession();
      
      if (session && session.user) {
        // Query otimizada: buscar apenas campos necessários para o perfil
        const { data, error } = await supabase
          .from('users')
          .select('id, nome, email, telefone, cpf, cnpj, cep, rua, numero, complemento, bairro, cidade, estado, tipo')
          .eq('auth_id', session.user.id)
          .single();

        if (error) {
          setError('Erro ao carregar dados do perfil: ' + error.message);
        } else if (data) {
          setUserData(data);
          setFormData({
            nome: data.nome || '',
            email: data.email || '',
            telefone: data.telefone || '',
            cpf: data.cpf || '',
            cnpj: data.cnpj || '',
            cep: data.cep || '',
            rua: data.rua || '',
            numero: data.numero || '',
            complemento: data.complemento || '',
            bairro: data.bairro || '',
            cidade: data.cidade || '',
            estado: data.estado || ''
          });
          // Atualizar cache
          localStorage.setItem('user', JSON.stringify(data));
        } else {
          setError('Nenhum dado encontrado para este usuário');
        }
      } else {
        setError('Usuário não autenticado');
      }
    } catch (error) {
      setError('Erro inesperado ao carregar dados: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      setLoading(true);
      setMessage('');
      setError('');

      const { data: { session } } = await supabase.auth.getSession();
      
      if (session && session.user) {
        const { error } = await supabase
          .from('users')
          .update(formData)
          .eq('auth_id', session.user.id);

        if (error) {
          console.error('Erro ao atualizar dados:', error);
          setError('Erro ao salvar alterações: ' + error.message);
        } else {
          setMessage('Dados atualizados com sucesso!');
          setMessageType('success');
          setEditing(false);
          fetchUserData(); // Recarregar dados
        }
      } else {
        setError('Usuário não autenticado');
      }
    } catch (error) {
      console.error('Erro ao salvar dados:', error);
      setError('Erro inesperado ao salvar dados: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleDataVisibility = () => {
    setShowData(!showData);
  };

  const maskSensitiveData = (data, field) => {
    if (!data) return '••••••••••';
    
    if (field === 'cpf' || field === 'cnpj') {
      return data.replace(/\d(?=\d{4})/g, '*');
    } else if (field === 'telefone') {
      return data.replace(/\d(?=\d{4})/g, '*');
    } else if (field === 'email') {
      const [local, domain] = data.split('@');
      return local.substring(0, 2) + '••••••@' + domain;
    } else if (field === 'rua') {
      return data.substring(0, 10) + '••••••••••';
    }
    
    return data.substring(0, 3) + '••••••••••';
  };

  if (loading) {
    return (
      <div className="dashboard-card p-4 text-light">
        <h3 className="mb-4 text-center">
          <i className="fas fa-user me-2"></i>Meus Dados
        </h3>
        <div style={{ textAlign: 'center', color: '#4CAF50' }}>
          <i className="fas fa-spinner fa-spin me-2"></i>
          Carregando dados...
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card p-4 text-light">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h3 className="mb-0">
          <i className="fas fa-user me-2"></i>Meus Dados
        </h3>
        <button 
          className={`btn btn-sm ${showData ? 'btn-warning' : 'btn-info'}`}
          onClick={toggleDataVisibility}
        >
          <i className={`fas ${showData ? 'fa-eye-slash' : 'fa-eye'} me-2`}></i>
          {showData ? 'Ocultar Dados' : 'Visualizar Dados'}
        </button>
      </div>

      {error && (
        <div className="alert alert-danger mb-3">
          <i className="fas fa-exclamation-triangle me-2"></i>
          {error}
        </div>
      )}

      {message && (
        <div className={`alert alert-${messageType === 'success' ? 'success' : 'danger'} mb-3`}>
          {message}
        </div>
      )}

      {!showData ? (
        <div className="text-center py-4">
          <i className="fas fa-shield-alt fa-3x text-light mb-3"></i>
          <p className="text-light">
            <i className="fas fa-lock me-2"></i>
            Seus dados estão protegidos por privacidade
          </p>
          <p className="text-light small">
            Clique no botão "Visualizar Dados" para ver suas informações pessoais
          </p>
        </div>
      ) : (
        <form>
          <div className="row g-3">
            <div className="col-md-6">
              <label className="form-label">Nome Completo *</label>
              <input 
                type="text" 
                name="nome"
                className="form-control" 
                value={editing ? formData.nome : (userData?.nome || '')}
                onChange={handleInputChange}
                disabled={!editing}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">E-mail *</label>
              <input 
                type="email" 
                name="email"
                className="form-control" 
                value={editing ? formData.email : (userData?.email || '')}
                onChange={handleInputChange}
                disabled={!editing}
                required
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Telefone</label>
              <input 
                type="tel" 
                name="telefone"
                className="form-control" 
                value={editing ? formData.telefone : (userData?.telefone || '')}
                onChange={handleInputChange}
                disabled={!editing}
              />
            </div>

            {userData?.tipo === 'pessoaFisica' ? (
              <div className="col-md-6">
                <label className="form-label">CPF *</label>
                <input 
                  type="text" 
                  name="cpf"
                  className="form-control" 
                  value={editing ? formData.cpf : (userData?.cpf || '')}
                  onChange={handleInputChange}
                  disabled={!editing}
                  required
                />
              </div>
            ) : (
              <div className="col-md-6">
                <label className="form-label">CNPJ *</label>
                <input 
                  type="text" 
                  name="cnpj"
                  className="form-control" 
                  value={editing ? formData.cnpj : (userData?.cnpj || '')}
                  onChange={handleInputChange}
                  disabled={!editing}
                  required
                />
              </div>
            )}

            <div className="col-md-4">
              <label className="form-label">CEP</label>
              <input 
                type="text" 
                name="cep"
                className="form-control" 
                value={editing ? formData.cep : (userData?.cep || '')}
                onChange={handleInputChange}
                disabled={!editing}
              />
            </div>

            <div className="col-md-8">
              <label className="form-label">Rua</label>
              <input 
                type="text" 
                name="rua"
                className="form-control" 
                value={editing ? formData.rua : (userData?.rua || '')}
                onChange={handleInputChange}
                disabled={!editing}
              />
            </div>

            <div className="col-md-2">
              <label className="form-label">Número</label>
              <input 
                type="text" 
                name="numero"
                className="form-control" 
                value={editing ? formData.numero : (userData?.numero || '')}
                onChange={handleInputChange}
                disabled={!editing}
              />
            </div>

            <div className="col-md-4">
              <label className="form-label">Complemento</label>
              <input 
                type="text" 
                name="complemento"
                className="form-control" 
                value={editing ? formData.complemento : (userData?.complemento || '')}
                onChange={handleInputChange}
                disabled={!editing}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Bairro</label>
              <input 
                type="text" 
                name="bairro"
                className="form-control" 
                value={editing ? formData.bairro : (userData?.bairro || '')}
                onChange={handleInputChange}
                disabled={!editing}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Cidade</label>
              <input 
                type="text" 
                name="cidade"
                className="form-control" 
                value={editing ? formData.cidade : (userData?.cidade || '')}
                onChange={handleInputChange}
                disabled={!editing}
              />
            </div>

            <div className="col-md-6">
              <label className="form-label">Estado</label>
              <input 
                type="text" 
                name="estado"
                className="form-control" 
                value={editing ? formData.estado : (userData?.estado || '')}
                onChange={handleInputChange}
                disabled={!editing}
              />
            </div>
          </div>

          <div className="mt-4 d-flex gap-2">
            {!editing ? (
              <button 
                type="button" 
                className="btn btn-warning"
                onClick={() => setEditing(true)}
              >
                <i className="fas fa-edit me-2"></i>
                Editar Dados
              </button>
            ) : (
              <>
                <button 
                  type="button" 
                  className="btn btn-success"
                  onClick={handleSave}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <i className="fas fa-spinner fa-spin me-2"></i>
                      Salvando...
                    </>
                  ) : (
                    <>
                      <i className="fas fa-save me-2"></i>
                      Salvar Alterações
                    </>
                  )}
                </button>
                <button 
                  type="button" 
                  className="btn btn-secondary"
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      nome: userData?.nome || '',
                      email: userData?.email || '',
                      telefone: userData?.telefone || '',
                      cpf: userData?.cpf || '',
                      cnpj: userData?.cnpj || '',
                      cep: userData?.cep || '',
                      rua: userData?.rua || '',
                      numero: userData?.numero || '',
                      complemento: userData?.complemento || '',
                      bairro: userData?.bairro || '',
                      cidade: userData?.cidade || '',
                      estado: userData?.estado || ''
                    });
                  }}
                >
                  <i className="fas fa-times me-2"></i>
                  Cancelar
                </button>
              </>
            )}
          </div>
        </form>
      )}
    </div>
  );
};

export default UserProfile;