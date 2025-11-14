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
                console.log('🔍 Executando consulta para buscar total de documentos...');
                console.log('🔍 URL Supabase:', 'https://zosupqbyanlliswinicv.supabase.co');
                
                // Primeiro, tentar uma consulta simples para verificar conexão
                const { count, error: queryError, data } = await supabase
                    .from('document_history')
                    .select('*', { count: 'exact', head: true });
                
                console.log('📊 Resultado bruto da consulta:', {
                    count: count,
                    countType: typeof count,
                    hasData: !!data,
                    hasError: !!queryError,
                    error: queryError ? {
                        message: queryError.message,
                        code: queryError.code,
                        details: queryError.details
                    } : null
                });
                
                // Se count for undefined ou null, pode ser que a consulta não funcionou
                if (count === undefined || count === null) {
                    console.warn('⚠️ Count é undefined/null - tentando buscar todos os documentos para contar manualmente');
                    
                    // Fallback: buscar todos os documentos e contar manualmente
                    const { data: allDocs, error: allDocsError } = await supabase
                        .from('document_history')
                        .select('id');
                    
                    if (!allDocsError && allDocs) {
                        const manualCount = allDocs.length;
                        console.log('✅ Total calculado manualmente:', manualCount);
                        setTotalDocuments(manualCount);
                        setError(false);
                        return;
                    } else {
                        console.error('❌ Erro ao buscar documentos para contagem manual:', allDocsError);
                    }
                }
                
                if (queryError) {
                    console.error('❌ Erro na consulta:', queryError);
                    console.error('Detalhes do erro:', {
                        message: queryError.message,
                        details: queryError.details,
                        hint: queryError.hint,
                        code: queryError.code
                    });
                    
                    // Verificar se é erro de permissão (RLS)
                    if (queryError.code === 'PGRST116' || queryError.message.includes('permission') || queryError.message.includes('RLS')) {
                        console.warn('🚫 Erro de permissão - pode ser necessário ajustar RLS na tabela document_history');
                        setError(true);
                        setTotalDocuments(0);
                        return;
                    }
                    
                    // Verificar se é erro de API key
                    if (queryError.message && queryError.message.includes('API key')) {
                        console.error('🔑 Erro de API key na consulta:', queryError);
                        setError(true);
                        setTotalDocuments(0);
                        return;
                    }
                    
                    setError(true);
                    setTotalDocuments(0);
                } else {
                    const total = count ?? 0;
                    console.log('✅ Total de documentos encontrado:', total);
                    
                    // Verificar se o valor é válido (não negativo)
                    if (typeof total === 'number' && total >= 0) {
                        setTotalDocuments(total);
                        setError(false);
                    } else {
                        console.warn('⚠️ Valor inválido retornado:', total, typeof total);
                        setError(true);
                        setTotalDocuments(0);
                    }
                }
                
            } catch (error) {
                console.error('Erro inesperado na requisição:', error);
                console.error('Stack trace:', error.stack);
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