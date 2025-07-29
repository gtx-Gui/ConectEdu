import React from 'react';
import './hubRecycling.css';
import imgSamsung from '../assets/img/recyclingOngsImg/samsung.png';
import imgEcobraz from '../assets/img/recyclingOngsImg/ecobraz.png';
import imgEcologica from '../assets/img/recyclingOngsImg/ecologica.png';
import imgRecycling from '../assets/img/recyclingOngsImg/recyclingImg.jpg';

const HubRecycling = () => {
  return (
    <div className="hub-recycling-container">
      <h1 className="hub-recycling__header">
        Importância da Reciclagem e Destino Correto de Eletrônicos
      </h1>
    
      <div className="hub-recycling__intro">
        <img src={imgRecycling} alt="Reciclagem" className="hub-recycling__image" />
        <div className="hub-recycling__intro-content">
          <p className="hub-recycling__content">
            No mundo atual, os equipamentos eletrônicos fazem parte do nosso dia a dia, mas o que acontece com eles quando deixam de ser úteis? Muitas vezes, são descartados de forma inadequada, gerando impactos negativos para o meio ambiente e a sociedade. No entanto, com práticas simples como a reciclagem, o destino correto e a doação, podemos transformar esse cenário e contribuir para um futuro mais sustentável.
          </p>
          
          <p className="hub-recycling__content">
            A reciclagem de eletrônicos é essencial para reduzir o acúmulo de lixo eletrônico, um dos resíduos que mais cresce no mundo. Equipamentos como celulares, computadores e tablets contêm materiais valiosos, como metais preciosos (ouro, prata, cobre) e componentes que podem ser reaproveitados. Além disso, muitos desses dispositivos possuem substâncias tóxicas, como chumbo e mercúrio, que, se descartados incorretamente, contaminam o solo e a água. Ao reciclar, evitamos a extração de novos recursos naturais, reduzimos a poluição e damos um novo ciclo de vida a esses materiais.
          </p>

          <p className="hub-recycling__content">
            Dar um destino correto aos eletrônicos é uma responsabilidade compartilhada entre consumidores, empresas e governos. Em vez de jogar equipamentos antigos no lixo comum, é fundamental encaminhá-los para pontos de coleta especializados, como ecopontos, cooperativas de reciclagem ou programas de logística reversa oferecidos por fabricantes. Esses locais garantem que os dispositivos sejam desmontados, separados e processados de forma segura, evitando danos ao meio ambiente e à saúde pública. Além disso, o destino correto inclui a destruição segura de dados, protegendo informações pessoais contra roubo ou vazamento.
          </p>
        </div>
      </div>

      <h2 className="hub-recycling__subheader">Doação: Inclusão Digital e Solidariedade</h2>
      <p className="hub-recycling__content">
        Muitos equipamentos eletrônicos que não são mais úteis para alguns ainda podem ser valiosos para outras pessoas. A doação de dispositivos usados, mas em bom estado, é uma forma poderosa de promover a inclusão digital e ajudar comunidades carentes. Organizações sem fins lucrativos e projetos sociais frequentemente recondicionam esses aparelhos e os distribuem para escolas, bibliotecas e famílias de baixa renda. Ao doar, você não apenas evita o descarte desnecessário, mas também contribui para reduzir a desigualdade digital e oferece oportunidades de educação e conexão para quem mais precisa.
      </p>
      

      <section className="hub-recycling__partners">
        <h2 className="hub-recycling__subheader">ONGs que atuam na reciclagem e destino correto de equipamentos eletrônicos </h2>
        
        <div className="hub-recycling__partner-card">
          <img 
            src={imgSamsung} 
            alt="Logo Samsung Recicla" 
            className="hub-recycling__partner-image"
          />
          <div className="hub-recycling__partner-content">
            <h3 className="hub-recycling__partner-title">Samsung Recicla</h3>
            <p className="hub-recycling__partner-description">
            O Samsung Recicla é um programa de logística reversa da Samsung que incentiva o descarte correto de produtos eletrônicos. O objetivo é reduzir o impacto ambiental do lixo eletrônico, promovendo a reciclagem e o reaproveitamento de materiais. Por meio desse programa, os consumidores podem entregar celulares, tablets, notebooks e outros dispositivos da marca em pontos de coleta autorizados. A Samsung se responsabiliza pelo processamento seguro desses resíduos, garantindo a destinação ambientalmente correta e a recuperação de materiais valiosos.
            </p>
            <a 
              href="https://www.samsung.com/br/support/programa-reciclagem/" 
              target="_blank" 
              rel="noreferrer"
              className="hub-recycling__partner-link"
            >
              Saiba mais →
            </a>
          </div>
        </div>

        <div className="hub-recycling__partner-card">
          <img 
            src={imgEcobraz} 
            alt="Logo Ecobraz" 
            className="hub-recycling__partner-image"
          />
          <div className="hub-recycling__partner-content">
            <h3 className="hub-recycling__partner-title">Ecobraz</h3>
            <p className="hub-recycling__partner-description">
            A Ecobraz é uma empresa especializada em soluções ambientais, com foco na gestão de resíduos eletrônicos. Ela oferece serviços de coleta, transporte, desmontagem e reciclagem de equipamentos eletrônicos, como computadores, monitores e impressoras. A Ecobraz atua em parceria com empresas e consumidores, garantindo que os resíduos sejam tratados de forma segura e sustentável, em conformidade com as normas ambientais. Além disso, a empresa promove a conscientização sobre a importância da reciclagem e da economia circular.
            </p>
            <a 
              href="https://ecobraz.org/pt_BR?gad_source=1&gclid=Cj0KCQjwv_m-BhC4ARIsAIqNeBu0i-w2LWtQ2NcQkSY4u7IFJpyL3CcsqhFjOMJnVhNzhr816EyAhIQaAvp0EALw_wcB" 
              target="_blank" 
              rel="noreferrer"
              className="hub-recycling__partner-link"
            >
              Saiba mais →
            </a>
          </div>
        </div>

        <div className="hub-recycling__partner-card">
          <img 
            src={imgEcologica} 
            alt="Logo Ecológica" 
            className="hub-recycling__partner-image"
          />
          <div className="hub-recycling__partner-content">
            <h3 className="hub-recycling__partner-title">Ecológica Soluções Ambientais</h3>
            <p className="hub-recycling__partner-description">
            A Ecológica Soluções Ambientais é uma empresa que oferece serviços integrados de gestão de resíduos, incluindo coleta, transporte, tratamento e destinação final de materiais. Ela atua com foco em resíduos eletrônicos, ajudando empresas e indivíduos a descartarem seus equipamentos de forma responsável. A Ecológica também desenvolve projetos de educação ambiental e sustentabilidade, visando reduzir o impacto dos resíduos no meio ambiente e promover práticas mais conscientes.
            </p>
            <a 
              href="https://www.ecologicaambiental.com/solucoes-ambientais" 
              target="_blank" 
              rel="noreferrer"
              className="hub-recycling__partner-link"
            >
              Saiba mais →
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HubRecycling;
