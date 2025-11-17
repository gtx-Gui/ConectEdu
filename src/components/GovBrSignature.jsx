import React, { useState } from 'react';
import './GovBrSignature.css';

const GovBrSignature = ({ isOpen, onClose, documentData, onSignatureComplete }) => {
  const [showInstructions, setShowInstructions] = useState(false);

  // Função para abrir janela de login do gov.br
  const handleGovBrLogin = () => {
    // URL direta para login do gov.br (página funcional)
    const govBrLoginUrl = 'https://sso.acesso.gov.br/login';
    
    // Dimensões da janela popup
    const popupWidth = 500;
    const popupHeight = 600;
    
    // Calcular posição central da tela
    const screenWidth = window.screen.width;
    const screenHeight = window.screen.height;
    
    // Calcular posição para centralizar
    const left = (screenWidth - popupWidth) / 2;
    const top = (screenHeight - popupHeight) / 2;
    
    // Configurações da janela popup centralizada
    const popupFeatures = `width=${popupWidth},height=${popupHeight},left=${left},top=${top},scrollbars=yes,resizable=yes,menubar=no,toolbar=no,location=no,status=no`;
    
    // Abrir janela pequena centralizada
    const popup = window.open(
      govBrLoginUrl,
      'govbr_login',
      popupFeatures
    );

    // Fechar modal após abrir popup
    if (popup) {
      setTimeout(() => {
        onClose();
      }, 500);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="govbr-signature-modal-overlay">
      <div className="govbr-signature-modal detailed">
        <div className="modal-header">
          <h3>
            <i className="fas fa-signature me-2"></i>
            Assinatura Digital Gov.br
          </h3>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          {!showInstructions ? (
            <>
              <div className="govbr-intro">
                <p className="govbr-intro-text">
                  Para assinar digitalmente, você precisa ter uma conta no <strong>Gov.br</strong> com nível <strong>Prata ou Ouro</strong>.
                </p>
                
                <div className="govbr-reqs">
                  <h4><i className="fas fa-info-circle me-2"></i>Requisitos:</h4>
                  <ul>
                    <li>Conta no Gov.br com nível Prata ou Ouro</li>
                    <li>Documentos de identificação (RG, CPF)</li>
                    <li>Celular com número cadastrado</li>
                  </ul>
                </div>

                <div className="govbr-buttons">
                  <button 
                    className="btn-govbr btn-primary"
                    onClick={handleGovBrLogin}
                  >
                    <i className="fas fa-external-link-alt me-2"></i>
                    Abrir Login Gov.br
                  </button>
                  
                  <button 
                    className="btn-govbr btn-secondary"
                    onClick={() => setShowInstructions(true)}
                  >
                    <i className="fas fa-question-circle me-2"></i>
                    Ver Guia Passo a Passo
                  </button>
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="govbr-instructions">
                <button 
                  className="btn-back-instructions"
                  onClick={() => setShowInstructions(false)}
                >
                  <i className="fas fa-arrow-left me-2"></i>
                  Voltar
                </button>

                <h4 className="instructions-title">
                  <i className="fas fa-video me-2"></i>
                  Vídeo Tutorial: Como Assinar Digitalmente pelo Gov.br
                </h4>

                <div className="video-container">
                  <div className="video-wrapper">
                    <iframe
                      src="https://www.youtube.com/embed/dE_hy6sbe9Q"
                      title="Como assinar digitalmente pelo Gov.br"
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="youtube-video"
                    ></iframe>
                  </div>
                  <p className="video-description">
                    Assista ao vídeo oficial do Gov.br para aprender passo a passo como criar sua conta e assinar documentos digitalmente.
                  </p>
                </div>

                <div className="quick-steps">
                  <h5 className="quick-steps-title">
                    <i className="fas fa-info-circle me-2"></i>
                    Resumo Rápido
                  </h5>
                  <ul>
                    <li><strong>1.</strong> Crie sua conta no <a href="https://www.gov.br/acesso/" target="_blank" rel="noopener noreferrer">Gov.br</a></li>
                    <li><strong>2.</strong> Eleve o nível para <strong>Prata ou Ouro</strong> (via aplicativo do banco ou presencial nos Correios)</li>
                    <li><strong>3.</strong> Clique em "Abrir Login Gov.br" abaixo e faça login</li>
                    <li><strong>4.</strong> Siga as instruções na tela para assinar o documento</li>
                  </ul>
                </div>

                <div className="govbr-help">
                  <p><strong>Dúvidas?</strong></p>
                  <p>Se você não tem conta no Gov.br ou precisa de ajuda, acesse nossa <a href="/support" target="_blank">Central de Suporte</a> ou entre em contato:</p>
                  <ul>
                    <li>E-mail: conectedu.org@gmail.com</li>
                    <li>Telefone: (19) 99611-7872</li>
                  </ul>
                  <p className="govbr-alternative">
                    <i className="fas fa-info-circle me-2"></i>
                    <strong>Lembre-se:</strong> A assinatura digital é opcional. Você também pode imprimir os documentos e assinar presencialmente na escola.
                  </p>
                </div>

                <button 
                  className="btn-govbr btn-primary"
                  onClick={handleGovBrLogin}
                  style={{ marginTop: '20px', width: '100%' }}
                >
                  <i className="fas fa-external-link-alt me-2"></i>
                  Abrir Login Gov.br
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default GovBrSignature;
