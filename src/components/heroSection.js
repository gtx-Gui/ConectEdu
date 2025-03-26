import React from 'react';
import './heroSection.css';

function heroSection() {
    return (
        <section className="hero">
            <div className="hero-content">
                <h1>Transformando a Educação através da Tecnologia</h1>
                <p>Conectamos empresas doadoras a escolas públicas, democratizando o acesso à tecnologia na educação.</p>
                <div className="cta-buttons">
                    <a href="/login" className="btn-primary">Quero Doar</a>
                    <a href="/login" className="btn-secondary">Sou uma Instituição de Ensino</a>
                </div>
            </div>
        </section>
    );
}

export default heroSection;