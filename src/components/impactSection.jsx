import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
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
                
                console.log('Buscando total de documentos no Supabase...');
                
                // Buscar total de documentos diretamente no Supabase
                const { count, error: queryError } = await supabase
                    .from('document_history')
                    .select('*', { count: 'exact', head: true });
                
                if (queryError) {
                    console.error('Erro na consulta:', queryError);
                    setError(true);
                    setTotalDocuments(0);
                } else {
                    const total = count || 0;
                    console.log('Total de documentos:', total);
                    setTotalDocuments(total);
                }
                
            } catch (error) {
                console.error('Erro na requisição:', error);
                setError(true);
                setTotalDocuments(0);
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