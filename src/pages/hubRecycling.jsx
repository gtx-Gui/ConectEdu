import React from 'react';
import './hubRecycling.css';
import imgSamsung from '../assets/img/recyclingOngsImg/samsung.png';
import imgEcobraz from '../assets/img/recyclingOngsImg/ecobraz.png';
import imgEcologica from '../assets/img/recyclingOngsImg/ecologica.png';
import imgRecycling from '../assets/img/recyclingOngsImg/recyclingImg.jpg';

const HubRecycling = () => {
  return (
    <div className="hub-recycling-container">
      {/* Hero Section */}
      <div className="hub-recycling__hero">
        <h1 className="hub-recycling__header">
          ♻️ Transforme seu lixo eletrônico em impacto positivo
        </h1>
        <p className="hub-recycling__subtitle">
          Descubra como reciclar, doar e dar o destino correto aos seus equipamentos eletrônicos
        </p>
      </div>

      {/* Stats Section */}
      <div className="hub-recycling__stats">
        <div className="hub-recycling__stat">
          <span className="hub-recycling__stat-number">50M</span>
          <span className="hub-recycling__stat-label">toneladas de lixo eletrônico por ano</span>
        </div>
        <div className="hub-recycling__stat">
          <span className="hub-recycling__stat-number">80%</span>
          <span className="hub-recycling__stat-label">dos materiais podem ser reciclados</span>
        </div>
        <div className="hub-recycling__stat">
          <span className="hub-recycling__stat-number">1</span>
          <span className="hub-recycling__stat-label">equipamento pode ajudar uma família</span>
        </div>
      </div>

      {/* Main Content */}
      <div className="hub-recycling__intro">
        <img src={imgRecycling} alt="Reciclagem" className="hub-recycling__image" />
        <div className="hub-recycling__intro-content">
          <div className="hub-recycling__benefit-card">
            <h3>🌍 Por que reciclar?</h3>
            <ul>
              <li>Evita contaminação do solo e água</li>
              <li>Economiza recursos naturais</li>
              <li>Recupera metais preciosos (ouro, prata, cobre)</li>
              <li>Reduz a extração de novos materiais</li>
            </ul>
          </div>

          <div className="hub-recycling__benefit-card">
            <h3>💡 O que fazer?</h3>
            <ul>
              <li><strong>Reciclar:</strong> Pontos de coleta especializados</li>
              <li><strong>Doar:</strong> Equipamentos em bom estado</li>
              <li><strong>Proteger:</strong> Apague seus dados antes</li>
            </ul>
          </div>
        </div>
      </div>

      {/* Donation Section */}
      <div className="hub-recycling__donation">
        <h2 className="hub-recycling__subheader">🤝 Doe e Transforme Vidas</h2>
        <div className="hub-recycling__donation-content">
          <div className="hub-recycling__donation-text">
            <h3>Seu equipamento usado pode mudar o futuro de alguém!</h3>
            <p>
              Muitos dispositivos ainda funcionam perfeitamente e podem ajudar escolas, 
              bibliotecas e famílias carentes. A doação promove inclusão digital e 
              reduz desigualdades sociais.
            </p>
          </div>
          <div className="hub-recycling__donation-benefits">
            <div className="hub-recycling__benefit-item">
              <span className="hub-recycling__benefit-icon">📚</span>
              <span>Educação digital</span>
            </div>
            <div className="hub-recycling__benefit-item">
              <span className="hub-recycling__benefit-icon">🌱</span>
              <span>Sustentabilidade</span>
            </div>
            <div className="hub-recycling__benefit-item">
              <span className="hub-recycling__benefit-icon">❤️</span>
              <span>Solidariedade</span>
            </div>
          </div>
        </div>
      </div>

      {/* Partners Section */}
      <section className="hub-recycling__partners">
        <h2 className="hub-recycling__subheader">Ongs Confiáveis</h2>
        <p className="hub-recycling__partners-intro">
          Conheça organizações que fazem a diferença na reciclagem e destino correto de eletrônicos
        </p>
        
        <div className="hub-recycling__partners-grid">
          <div className="hub-recycling__partner-card">
            <div className="hub-recycling__partner-header">
              <img 
                src={imgSamsung} 
                alt="Logo Samsung Recicla" 
                className="hub-recycling__partner-image"
              />
              <h3 className="hub-recycling__partner-title">Samsung Recicla</h3>
            </div>
            <div className="hub-recycling__partner-content">
              <p className="hub-recycling__partner-description">
                <strong>Programa oficial da Samsung</strong><br/>
                Aceita celulares, tablets e notebooks da marca. Processamento seguro e recuperação de materiais valiosos.
              </p>
              <div className="hub-recycling__partner-features">
                <span className="hub-recycling__feature">✅ Gratuito</span>
                <span className="hub-recycling__feature">✅ Oficial</span>
                <span className="hub-recycling__feature">✅ Seguro</span>
              </div>
              <a 
                href="https://www.samsung.com/br/support/programa-reciclagem/" 
                target="_blank" 
                rel="noreferrer"
                className="hub-recycling__partner-link"
              >
                Conhecer programa →
              </a>
            </div>
          </div>

          <div className="hub-recycling__partner-card">
            <div className="hub-recycling__partner-header">
              <img 
                src={imgEcobraz} 
                alt="Logo Ecobraz" 
                className="hub-recycling__partner-image"
              />
              <h3 className="hub-recycling__partner-title">Ecobraz</h3>
            </div>
            <div className="hub-recycling__partner-content">
              <p className="hub-recycling__partner-description">
                <strong>Soluções ambientais completas</strong><br/>
                Coleta, transporte e reciclagem de computadores, monitores e impressoras. Conformidade com normas ambientais.
              </p>
              <div className="hub-recycling__partner-features">
                <span className="hub-recycling__feature">✅ Completo</span>
                <span className="hub-recycling__feature">✅ Certificado</span>
                <span className="hub-recycling__feature">✅ Empresarial</span>
              </div>
              <a 
                href="https://ecobraz.org/pt_BR?gad_source=1&gclid=Cj0KCQjwv_m-BhC4ARIsAIqNeBu0i-w2LWtQ2NcQkSY4u7IFJpyL3CcsqhFjOMJnVhNzhr816EyAhIQaAvp0EALw_wcB" 
                target="_blank" 
                rel="noreferrer"
                className="hub-recycling__partner-link"
              >
                Conhecer serviços →
              </a>
            </div>
          </div>

          <div className="hub-recycling__partner-card">
            <div className="hub-recycling__partner-header">
              <img 
                src={imgEcologica} 
                alt="Logo Ecológica" 
                className="hub-recycling__partner-image"
              />
              <h3 className="hub-recycling__partner-title">Ecológica Soluções</h3>
            </div>
            <div className="hub-recycling__partner-content">
              <p className="hub-recycling__partner-description">
                <strong>Gestão integrada de resíduos</strong><br/>
                Serviços completos de coleta e tratamento. Projetos de educação ambiental e sustentabilidade.
              </p>
              <div className="hub-recycling__partner-features">
                <span className="hub-recycling__feature">✅ Integrado</span>
                <span className="hub-recycling__feature">✅ Educativo</span>
                <span className="hub-recycling__feature">✅ Sustentável</span>
              </div>
              <a 
                href="https://www.ecologicaambiental.com/solucoes-ambientais" 
                target="_blank" 
                rel="noreferrer"
                className="hub-recycling__partner-link"
              >
                Conhecer soluções →
              </a>
            </div>
          </div>
        </div>
      </section>

      
    </div>
  );
};

export default HubRecycling;
