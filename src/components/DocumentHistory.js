import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import '../pages/userDashboard.css';

const DocumentHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Iniciando busca do histórico...');
        
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Session:', session);
        
        if (session && session.user) {
          setUser(session.user);
          console.log('Usuário encontrado:', session.user.id);
          
          // Buscar histórico de documentos do usuário
          const { data, error } = await supabase
            .from('document_history')
            .select('*')
            .eq('user_id', session.user.id)
            .order('generated_at', { ascending: false });

          console.log('Resultado da busca:', { data, error });

          if (error) {
            console.error('Erro ao buscar histórico:', error);
            setError(error.message);
          } else {
            console.log('Histórico carregado:', data);
            setHistory(data || []);
          }
        } else {
          console.log('Nenhuma sessão encontrada');
          setError('Usuário não autenticado');
        }
      } catch (error) {
        console.error('Erro ao buscar histórico:', error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDocumentTypeLabel = (type) => {
    const typeLabels = {
      'termo': 'Termo de Doação',
      'declaracao': 'Declaração de Doação',
      'recibo1': 'Recibo de Doação 1 (Pessoa Jurídica)',
      'recibo2': 'Recibo de Doação 2 (Pessoa Física)'
    };
    return typeLabels[type] || type;
  };

  if (loading) {
    return (
      <div className="dashboard-card p-4 text-light">
        <h3 className="mb-4 text-center">
          <i className="fas fa-history me-2"></i>Histórico de Documentos
        </h3>
        <div style={{ textAlign: 'center', color: '#4CAF50' }}>
          <i className="fas fa-spinner fa-spin me-2"></i>
          Carregando histórico...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-card p-4 text-light">
        <h3 className="mb-4 text-center">
          <i className="fas fa-history me-2"></i>Histórico de Documentos
        </h3>
        <div style={{ textAlign: 'center', color: '#dc3545', padding: '20px' }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '2rem', marginBottom: '10px', display: 'block' }}></i>
          <p>Erro ao carregar histórico:</p>
          <p style={{ fontSize: '0.9rem', color: '#ccc' }}>{error}</p>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => window.location.reload()}
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card p-4 text-light">
      <h3 className="mb-4 text-center">
        <i className="fas fa-history me-2"></i>Histórico de Documentos
      </h3>
      
      {history.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#ccc', padding: '40px 0' }}>
          <i className="fas fa-file-alt" style={{ fontSize: '3rem', marginBottom: '20px', display: 'block' }}></i>
          <p>Nenhum documento gerado ainda.</p>
          <p>Gere seu primeiro documento na seção "Gerar Documentos"!</p>
        </div>
      ) : (
        <div className="history-list">
          {history.map((item, index) => (
            <div key={index} className="history-item">
              <div className="history-header">
                <div className="history-type">
                  <i className="fas fa-file-alt me-2"></i>
                  {getDocumentTypeLabel(item.document_type)}
                </div>
                <div className="history-date">
                  {formatDate(item.generated_at)}
                </div>
              </div>
              
              {item.form_data && (
                <div className="history-details">
                  {item.form_data.nomeDoador && (
                    <div className="detail-item">
                      <strong>Doador:</strong> {item.form_data.nomeDoador}
                    </div>
                  )}
                  {item.form_data.nomeEscola && (
                    <div className="detail-item">
                      <strong>Escola:</strong> {item.form_data.nomeEscola}
                    </div>
                  )}
                  {item.form_data.local && (
                    <div className="detail-item">
                      <strong>Local:</strong> {item.form_data.local}
                    </div>
                  )}
                  {item.form_data.data && (
                    <div className="detail-item">
                      <strong>Data:</strong> {item.form_data.data}
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DocumentHistory;