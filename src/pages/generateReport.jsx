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
    async function fetchUser() {
      const { data: { session } } = await supabase.auth.getSession();
      if (session && session.user) {
        // Busca o tipo do usuário na tabela 'users' usando o campo 'auth_id'
        const { data, error } = await supabase
          .from('users')
          .select('tipo')
          .eq('auth_id', session.user.id)
          .single();
        if (data) {
          setUser(session.user);
          setUserType(data.tipo);
        }
      }
    }
    fetchUser();
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

  // Exibe loading enquanto carrega
  if (!userType || showLoading) {
    return (
      <div className="loading-container">
        <div className="custom-spinner"></div>
        <span className="loading-text">Carregando...</span>
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
      // Salvar histórico antes de gerar o PDF
      if (user && user.id) {
        await saveDocumentHistory(user.id, selectedReport, manualFormData);
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
  const handleSignatureComplete = (signatureData) => {
    setSignatureData(signatureData);
    console.log('Assinatura digital gov.br concluída:', signatureData);
    
    // Salvar histórico da assinatura
    if (user && user.id) {
      saveDocumentHistory(user.id, `${selectedReport}_assinado_govbr`, {
        ...manualFormData,
        signature: signatureData
      });
    }
  };

  // Função para fechar o modal
  const handleCloseSignatureModal = () => {
    setShowSignatureModal(false);
  };

  return (
    <>
      {/* Botão Voltar posicionado abaixo do header */}
      <button className="back-button" onClick={() => setSelectedReport('')}>← Voltar</button>
      <div className="report-page">
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
          userId: user?.id,
          timestamp: new Date().toISOString()
        }}
        onSignatureComplete={handleSignatureComplete}
      />
    </>
  );
}

export default GenerateReport;