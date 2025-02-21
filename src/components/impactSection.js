import React from 'react';
import './impactSection.css';

function impactSection() {
    return (
    <section className="impact-section">
        <h2>Nosso Impacto</h2>
        <div className="impact-grid">
            <div className="impact-card">
                <div className="impact-number">0</div>
                <p>Escolas Beneficiadas</p>
            </div>
            <div className="impact-card">
                <div className="impact-number">0</div>
                <p>Equipamentos Doados</p>
            </div>
            <div className="impact-card">
                <div className="impact-number">0</div>
                <p>Alunos Impactados</p>
            </div>
        </div>
    </section>
    );
}
export default impactSection;