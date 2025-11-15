import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import ManualReportForm from '../components/ManualReportForm';
import ManualReportPreview from '../components/ManualReportPreview';
import GovBrSignature from '../components/GovBrSignature';
import '../pages/generateReport.css';
import 'bootstrap/dist/css/bootstrap.min.css';

// Tipos de relatórios disponíveis por tipo de usuário
const reportTypes = {
  empresa: [
    { value: 'termo', label: 'Termo de Doação' },
    { value: 'declaracao', label: 'Declaração de Doação' },
  ],
  pessoaFisica: [
    { value: 'termo', label: 'Termo de Doação' },
    { value: 'declaracao', label: 'Declaração de Doação' },
  ],
  instituicao: [
    { value: 'recibo1', label: 'Recibo de Doação 1 (Pessoa Jurídica)' },
    { value: 'recibo2', label: 'Recibo de Doação 2 (Pessoa Física)' },
  ],
};

// Função para salvar histórico de documentos
const saveDocumentHistory = async (userId, documentType, formData) => {
  try {
    const { error } = await supabase
      .from('document_history')
      .insert([{
        user_id: userId,
        document_type: documentType,
        form_data: formData,
        generated_at: new Date().toISOString()
      }]);

    if (error) {
      console.error('Erro ao salvar histórico:', error);
    } else {
      console.log('Histórico salvo com sucesso');
    }
  } catch (error) {
    console.error('Erro ao salvar histórico:', error);
  }
};

function GenerateReport() {
  const navigate = useNavigate();
  
  // Estados principais
  const [user, setUser] = useState(null);
  const [userType, setUserType] = useState('');
  const [selectedReport, setSelectedReport] = useState('');
  const [manualFormData, setManualFormData] = useState({});
  const [showLoading, setShowLoading] = useState(true);
  const [showSignatureModal, setShowSignatureModal] = useState(false);
  const [signatureData, setSignatureData] = useState(null);
  const previewRef = useRef();

  // Busca o tipo de usuário ao carregar a página
  useEffect(() => {
    let isMounted = true;
    let timeoutId;

    async function fetchUser() {
      try {
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          console.error('Erro ao buscar sessão:', sessionError);
          if (isMounted) {
            setShowLoading(false);
          }
          return;
        }
        
        if (session && session.user) {
          // Tenta buscar do localStorage primeiro como fallback
          try {
            const cachedUser = localStorage.getItem('user');
            if (cachedUser) {
              const userData = JSON.parse(cachedUser);
              if (userData && userData.tipo) {
                console.log('Usando dados do cache:', userData.tipo);
                if (isMounted) {
                  setUser(session.user);
                  setUserType(userData.tipo);
                  setShowLoading(false);
                  return;
                }
              }
            }
          } catch (cacheError) {
            console.warn('Erro ao ler cache:', cacheError);
          }

          // Busca o tipo do usuário na tabela 'users' usando o campo 'auth_id'
          console.log('🔍 Buscando tipo do usuário com auth_id:', session.user.id);
          
          const { data, error } = await supabase
            .from('users')
            .select('tipo')
            .eq('auth_id', session.user.id)
            .single();
          
          if (!isMounted) return;

          if (error) {
            console.error('❌ Erro ao buscar tipo do usuário:', {
              code: error.code,
              message: error.message,
              details: error.details,
              auth_id: session.user.id
            });
            
            // Se o erro for PGRST116 (nenhum resultado), o usuário não existe na tabela
            if (error.code === 'PGRST116') {
              console.warn('⚠️ Usuário autenticado mas não encontrado na tabela users. auth_id:', session.user.id);
              
              // Tentar usar cache novamente como último recurso
              try {
                const cachedUser = localStorage.getItem('user');
                if (cachedUser) {
                  const userData = JSON.parse(cachedUser);
                  if (userData && userData.tipo) {
                    console.log('⚠️ Usando cache como fallback após erro:', userData.tipo);
                    if (isMounted) {
                      setUser(session.user);
                      setUserType(userData.tipo);
                      // O useEffect vai desabilitar o loading
                      return;
                    }
                  }
                }
              } catch (cacheError) {
                console.warn('Erro ao ler cache no fallback:', cacheError);
              }
            }
            
            // Se não conseguir usar cache, desabilita loading e mostra erro
            if (isMounted) {
              setShowLoading(false);
            }
            return;
          }
          
          if (data && data.tipo) {
            console.log('✅ Tipo do usuário encontrado:', data.tipo);
            if (isMounted) {
              setUser(session.user);
              setUserType(data.tipo);
              // Não desabilitar loading aqui - o useEffect vai fazer isso após 1.5s
            }
          } else {
            console.warn('⚠️ Query retornou sem erro mas tipo não encontrado. Dados:', data);
            if (isMounted) {
              setShowLoading(false);
            }
          }
        } else {
          console.error('Sessão não encontrada');
          if (isMounted) {
            setShowLoading(false);
          }
        }
      } catch (error) {
        console.error('Erro ao buscar usuário:', error);
        if (isMounted) {
          setShowLoading(false);
        }
      }
    }

    fetchUser();

    // Timeout de segurança - máximo 8 segundos
    timeoutId = setTimeout(() => {
      if (isMounted) {
        console.warn('Timeout ao carregar tipo de usuário - desabilitando loading');
        setShowLoading(false);
      }
    }, 8000);

    return () => {
      isMounted = false;
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, []);

  // Exibe loading até carregar o tipo de usuário
  useEffect(() => {
    if (userType) {
      const timer = setTimeout(() => setShowLoading(false), 1500); // 1.5 segundos
      return () => clearTimeout(timer);
    }
  }, [userType]);


  // Relatórios disponíveis para o tipo de usuário
  const availableReports = userType ? reportTypes[userType] || [] : [];

  // Exibe loading enquanto carrega (mas com timeout)
  if (showLoading && !userType) {
    return (
      <div className="loading-container">
        <div className="custom-spinner"></div>
        <span className="loading-text">Carregando...</span>
      </div>
    );
  }

  // Se não tem userType após o loading, mostra mensagem de erro
  if (!showLoading && !userType) {
    return (
      <div className="container min-vh-100 d-flex flex-column justify-content-center align-items-center bg-dark p-4">
        <div className="card bg-secondary bg-opacity-75 p-5 shadow-lg border-0 text-light" style={{ maxWidth: '600px', width: '100%' }}>
          <div className="text-center">
            <i className="fas fa-exclamation-triangle fa-3x text-warning mb-3"></i>
            <h2 className="mb-3">Dados do usuário não encontrados</h2>
            <p className="mb-4">
              Não foi possível carregar suas informações do banco de dados. 
              Por favor, verifique sua conexão ou entre em contato com o suporte.
            </p>
            <button
              className="btn btn-primary me-2"
              onClick={() => window.location.reload()}
            >
              <i className="fas fa-sync me-2"></i>
              Tentar novamente
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/userdashboard')}
            >
              <i className="fas fa-arrow-left me-2"></i>
              Voltar ao Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Primeira etapa: escolha do tipo de documento
  if (!selectedReport) {
    return (
      <div className="container min-vh-100 d-flex flex-column justify-content-start align-items-center bg-dark pt-5">
        <div className="card bg-secondary bg-opacity-75 p-5 shadow-lg w-100 border-0 text-light card-maxwidth">
          {/* Botão de voltar posicionado para sobreposição pelo header */}
          <button
            className="back-button"
            onClick={() => navigate('/userdashboard')}
          >
            ← Voltar
          </button>
          <h1 className="mb-4 text-center display-5 text-light">Escolha o tipo de documento</h1>
          <div className="d-flex flex-wrap justify-content-center gap-4">
            {availableReports.map(report => (
              <div
                key={report.value}
                className={`doc-type-card${selectedReport === report.value ? ' selected' : ''}`}
                onClick={() => setSelectedReport(report.value)}
                tabIndex={0}
                role="button"
                style={{ cursor: 'pointer' }}
              >
                {/* Ícone genérico de documento do Bootstrap Icons */}
                <div className="doc-type-icon mb-2">
                  {report.value === 'termo' ? (
                    <i className="bi bi-file-earmark-text" style={{ fontSize: 48 }}></i>
                  ) : (
                    <i className="bi bi-file-earmark-check" style={{ fontSize: 48 }}></i>
                  )}
                </div>
                <div className="doc-type-label fs-5 fw-semibold text-center">
                  {report.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Tela do formulário manual e preview lado a lado
  const handleDownloadPDF = async () => {
    if (previewRef.current && previewRef.current.handleDownloadPDF) {
      try {
        // Buscar sessão atual para garantir que temos o ID correto
        const { data: { session } } = await supabase.auth.getSession();
        
        // Salvar histórico antes de gerar o PDF
        if (session && session.user && session.user.id) {
          await saveDocumentHistory(session.user.id, selectedReport, manualFormData);
        } else {
          console.warn('Não foi possível salvar histórico: sessão não encontrada');
        }
      } catch (error) {
        console.error('Erro ao salvar histórico:', error);
        // Continua gerando o PDF mesmo se não conseguir salvar o histórico
      }
      
      // Gerar o PDF
      previewRef.current.handleDownloadPDF();
    }
  };

  // Função para abrir modal de assinatura digital
  const handleDigitalSignature = () => {
    setShowSignatureModal(true);
  };

  // Função para lidar com a conclusão da assinatura
  const handleSignatureComplete = async (signatureData) => {
    setSignatureData(signatureData);
    console.log('Assinatura digital gov.br concluída:', signatureData);
    
    try {
      // Buscar sessão atual para garantir que temos o ID correto
      const { data: { session } } = await supabase.auth.getSession();
      
      // Salvar histórico da assinatura
      if (session && session.user && session.user.id) {
        await saveDocumentHistory(session.user.id, `${selectedReport}_assinado_govbr`, {
          ...manualFormData,
          signature: signatureData
        });
      } else {
        console.warn('Não foi possível salvar histórico da assinatura: sessão não encontrada');
      }
    } catch (error) {
      console.error('Erro ao salvar histórico da assinatura:', error);
    }
  };

  // Função para fechar o modal
  const handleCloseSignatureModal = () => {
    setShowSignatureModal(false);
  };

  return (
    <>
      <div className="report-page">
        {/* Botão Voltar no topo */}
        <button className="back-button" onClick={() => setSelectedReport('')}>← Voltar</button>
        <div className="report-container">
          {/* Formulário manual para preenchimento dos dados */}
          <ManualReportForm reportType={selectedReport} form={manualFormData} setForm={setManualFormData} />
          {/* Preview do documento preenchido */}
          <div className="report-preview">
            <ManualReportPreview
              ref={previewRef}
              reportType={selectedReport}
              formData={manualFormData}
            />
            <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', margin: '32px 0' }}>
              <button 
                className="download-button" 
                onClick={handleDownloadPDF}
                style={{ width: 'auto', padding: '12px 32px' }}
              >
                <i className="fas fa-download me-2"></i>
                Baixar PDF
              </button>
              
              <button 
                className="digital-signature-button" 
                onClick={handleDigitalSignature}
                style={{ width: 'auto', padding: '12px 32px' }}
              >
                <i className="fas fa-signature me-2"></i>
                Assinatura Digital gov.br
              </button>

              {/* Indicador de documento assinado */}
              {signatureData && (
                <div className="signature-indicator">
                  <i className="fas fa-check-circle"></i>
                  <span>Documento assinado digitalmente via gov.br</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal de Assinatura Digital gov.br */}
      <GovBrSignature
        isOpen={showSignatureModal}
        onClose={handleCloseSignatureModal}
        documentData={{
          ...manualFormData,
          reportType: selectedReport,
          timestamp: new Date().toISOString()
        }}
        onSignatureComplete={handleSignatureComplete}
      />
    </>
  );
}

export default GenerateReport;