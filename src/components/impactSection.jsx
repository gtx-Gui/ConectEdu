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
                
                // Query otimizada: apenas count, sem buscar dados
                const { count, error: queryError } = await supabase
                    .from('document_history')
                    .select('*', { count: 'exact', head: true });
                
                if (queryError) {
                    // Em caso de erro, apenas definir como 0 (sem fallback lento)
                    setError(true);
                    setTotalDocuments(0);
                } else {
                    const total = count ?? 0;
                    if (typeof total === 'number' && total >= 0) {
                        setTotalDocuments(total);
                        setError(false);
                    } else {
                        setError(true);
                        setTotalDocuments(0);
                    }
                }
                
            } catch (error) {
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