import React from 'react';
import './documentationSection.css';

function documentationSection() {
    return (
    <section className="documentation-section">
      <h2>Documentação Simplificada</h2>
      <div className="documentation-grid">
          <div className="documentation-card">
              <div className="documentation-icon">
                  <i className="fas fa-file-contract"></i>
              </div>
              <h3>Termos Automáticos</h3>
              <p>Nossa plataforma gera automaticamente todos os termos e contratos necessários para a doação.</p>
          </div>
          <div className="documentation-card">
              <div className="documentation-icon">
                  <i className="fas fa-shield-alt"></i>
              </div>
              <h3>Segurança Legal</h3>
              <p>Documentação em conformidade com a legislação vigente, garantindo segurança para doadores e beneficiários.</p>
          </div>
          
      </div>
  </section>
    );
}

export default documentationSection;    