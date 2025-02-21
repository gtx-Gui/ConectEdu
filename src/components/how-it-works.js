import React from 'react';
import './how-it-works.css';

const howItWorks = () => {
    return (
       
    <section class="how-it-works">
        <h2>Como Funciona</h2>
        <div class="steps-grid">
            <div class="step-card">
                <div class="step-icon">
                    <i class="fas fa-building"></i>
                </div>
                <h3>Empresas Cadastram Doações</h3>
                <p>Cadastre os equipamentos disponíveis para doação de forma simples e rápida.</p>
            </div>
            <div class="step-card">
                <div class="step-icon">
                    <i class="fas fa-school"></i>
                </div>
                <h3>Escolas Registram Necessidades</h3>
                <p>Escolas informam suas necessidades tecnológicas específicas.</p>
            </div>
            <div class="step-card">
                <div class="step-icon">
                    <i class="fas fa-handshake"></i>
                </div>
                <h3>Fazemos a Conexão</h3>
                <p>Nossa plataforma conecta automaticamente doadores e escolas compatíveis.</p>
            </div>
            </div>
        </section>
    );
};

export default howItWorks;  