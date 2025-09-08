import React from 'react';
import './GovBrSignature.css';

const GovBrSignature = ({ isOpen, onClose, documentData, onSignatureComplete }) => {
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
      <div className="govbr-signature-modal simple">
        <div className="modal-header">
          <h3>Login gov.br</h3>
          <button className="close-button" onClick={onClose}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        <div className="modal-body">
          <p>Clique no botão para abrir o login do governo:</p>
          
          <button 
            className="btn-govbr"
            onClick={handleGovBrLogin}
          >
            <i className="fas fa-external-link-alt"></i>
            Abrir Login gov.br
          </button>
        </div>
      </div>
    </div>
  );
};

export default GovBrSignature;
