import React, { useState, useEffect } from 'react';
import './impactSection.css';

function ImpactSection() {
    const [totalDocuments, setTotalDocuments] = useState(0);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchTotalDocuments = async () => {
            try {
                setLoading(true);
                setError(false);
                
                console.log('Tentando conectar ao backend...');
                
                // Por enquanto, vamos usar um valor mock
                // TODO: Implementar conexão real com o backend quando estiver funcionando
                const mockTotal = 42; // Valor mock para demonstração
                
                // Simular delay de carregamento
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                console.log('Usando valor mock:', mockTotal);
                setTotalDocuments(mockTotal);
                
                // Tentar conectar ao backend em background (para debug)
                try {
                    const response = await fetch('http://localhost:5000/total-documents');
                    if (response.ok) {
                        const data = await response.json();
                        console.log('Backend funcionando! Total real:', data.total);
                        setTotalDocuments(data.total);
                    }
                } catch (backendError) {
                    console.log('Backend não disponível, usando valor mock');
                }
                
            } catch (error) {
                console.error('Erro na requisição:', error);
                setError(true);
            } finally {
                setLoading(false);
            }
        };

        fetchTotalDocuments();
    }, []);

    const displayValue = () => {
        if (loading) return '...';
        if (error) return '0';
        return totalDocuments;
    };

    return (
        <section className="impact-section">
            <div className="impact-grid">
                <div className="impact-card">
                    <div className="impact-number">
                        {displayValue()}
                    </div>
                    <p>Documentos Gerados</p>
                </div>
            </div>
        </section>
    );
}

export default ImpactSection;