import React from 'react';
import './how-it-works.css';

const howItWorks = () => {
    return (
       
    <section className="how-it-works">
        <h2>Como funciona o processo de doação?</h2>
        <div className="steps-grid">
            <div className="step-card">
                <div className="step-number">1</div>
                <h3>Cadastro no site:</h3>
                <p>Crie sua conta gratuitamente para acessar o painel do usuário.</p>
            </div>
            <div className="step-card">
                <div className="step-number">2</div>
                <h3>Gerar os documentos:</h3>
                <p>No painel do usuário, clique em "Gerar documentos" e preencha as informações necessárias para criar os documentos de doação.</p>
            </div>
            <div className="step-card">
                <div className="step-number">3</div>
                <h3>Entregar e assinar:</h3>
                <p>Leve os documentos gerados até a escola selecionada e realize a assinatura presencialmente.</p>
            </div>
            <div className="step-card">
                <div className="step-number">4</div>
                <h3>Solicitar recibo de doação:</h3>
                <p>Caso necessário, solicite o recibo de doação diretamente na escola. O recibo também pode ser gerado no site da ConectEdu pelo painel de usuário das instituições públicas.</p>
            </div>
        </div>
    </section>
    );
};

export default howItWorks;  