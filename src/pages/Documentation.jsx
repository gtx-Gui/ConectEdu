import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Documentation.css';

const Documentation = () => {
    const navigate = useNavigate();

    const handleDownloadRelatorio = () => {
        try {
            // Criar um link temporário para download do relatório
            const link = document.createElement('a');
            // O arquivo PDF deve estar na pasta public com o nome 'relatorio.pdf'
            // Para adicionar o arquivo: coloque o PDF em public/relatorio.pdf
            link.href = '/relatorio.pdf';
            link.download = 'Relatorio_ConectEdu.pdf';
            link.target = '_blank';
            link.rel = 'noopener noreferrer';
            
            // Adicionar ao DOM, clicar e remover
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Verificar se o download foi iniciado (opcional)
            // Nota: Em alguns navegadores, se o arquivo não existir, pode abrir uma nova aba
            // Isso é esperado - o arquivo precisa estar na pasta public para funcionar corretamente
        } catch (error) {
            console.error('Erro ao baixar relatório:', error);
            alert('Erro ao baixar o relatório. Por favor, tente novamente mais tarde.');
        }
    };

    return (
        <div className="documentation-page">
            <button 
                onClick={() => navigate(-1)} 
                className="documentation-voltar-btn"
            >
                ← Voltar
            </button>

            <div className="documentation-container">
                <h1 className="documentation-titulo">Documentação</h1>
                
                <div className="documentation-content">
                    <div className="documentation-intro">
                        <h2>Bem-vindo à Documentação do ConectEdu</h2>
                        <p>
                            Aqui você encontra todas as informações, guias e recursos necessários para 
                            utilizar a plataforma ConectEdu de forma eficiente. Nossa documentação é 
                            elaborada para facilitar o processo de doação e garantir que todos os 
                            usuários possam aproveitar ao máximo os recursos disponíveis.
                        </p>
                    </div>

                    <div className="documentation-grid">
                        <div className="documentation-card">
                            <div className="documentation-icon">
                                <i className="fas fa-file-contract"></i>
                            </div>
                            <h3>Termos Automáticos</h3>
                            <p>
                                Nossa plataforma gera automaticamente todos os termos e contratos 
                                necessários para a doação, garantindo conformidade legal.
                            </p>
                        </div>

                        <div className="documentation-card">
                            <div className="documentation-icon">
                                <i className="fas fa-shield-alt"></i>
                            </div>
                            <h3>Segurança Legal</h3>
                            <p>
                                Documentação em conformidade com a legislação vigente, garantindo 
                                segurança para doadores e beneficiários.
                            </p>
                        </div>

                        <div className="documentation-card">
                            <div className="documentation-icon">
                                <i className="fas fa-book"></i>
                            </div>
                            <h3>Guias e Tutoriais</h3>
                            <p>
                                Acesse tutoriais passo a passo para aprender a usar todas as funcionalidades 
                                da plataforma ConectEdu.
                            </p>
                        </div>
                    </div>

                    {/* Card de Download do Relatório */}
                    <div className="relatorio-download-card">
                        <div className="relatorio-icon">
                            <i className="fas fa-file-pdf"></i>
                        </div>
                        <div className="relatorio-content">
                            <h3>Relatório do Projeto ConectEdu</h3>
                            <p>
                                Baixe nosso relatório completo com informações detalhadas sobre o projeto, 
                                metodologia, resultados e impacto social alcançado pela plataforma ConectEdu.
                            </p>
                            <button 
                                className="btn-download-relatorio"
                                onClick={handleDownloadRelatorio}
                            >
                                <i className="fas fa-download me-2"></i>
                                Baixar Relatório (PDF)
                            </button>
                        </div>
                    </div>

                    <div className="documentation-section">
                        <h2>Em Desenvolvimento</h2>
                        <div className="em-desenvolvimento-content">
                            <i className="fas fa-tools em-desenvolvimento-icon"></i>
                            <p>
                                Novos recursos e funcionalidades estão sendo desenvolvidos para melhorar 
                                ainda mais a experiência dos usuários da plataforma ConectEdu. 
                                Fique atento às atualizações!
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Documentation;

