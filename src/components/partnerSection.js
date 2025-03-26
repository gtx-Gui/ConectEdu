import React from 'react';
import './partnerSection.css';

function partnerSection() {
    return (
        <section className="partners-section">
            <h2>Apoio</h2>
            <div className="partners-grid">
                <div className="partner-card">
                    <div className="partner-icon">
                        <i className="fas fa-truck"></i>
                    </div>
                    <h3>Não Cadastrado</h3>
                </div>
                <div className="partner-card">
                    <div className="partner-icon">
                        <i className="fas fa-warehouse"></i>
                    </div>
                    <h3>Não Cadastrado</h3>
                </div>
                <div className="partner-card">
                    <div className="partner-icon">
                        <i className="fas fa-tools"></i>
                    </div>
                    <h3>Não Cadastrado</h3>
                </div>
            </div>
        </section>
    );
}

export default partnerSection;