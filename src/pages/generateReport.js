import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './generateReport.css';

function GenerateReport() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        oficioNumero: '',
        ano: new Date().getFullYear(),
        assunto: 'Doação de Equipamentos',
        nomeDiretor: '',
        escola: '',
        dataOficio: new Date().toISOString().split('T')[0]
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleDownload = () => {
        // Lógica para download do PDF
        alert('Relatório baixado com sucesso!');
    };

    return (
        <div className="report-page">
            <button 
                onClick={() => navigate(-1)} 
                className="back-button"
            >
                ← Voltar
            </button>

            <div className="report-container">
                <div className="report-form">
                    <h2>Gerar Relatório de Doação</h2>
                    
                    <div className="form-group">
                        <label>Número do Ofício:</label>
                        <input
                            type="text"
                            name="oficioNumero"
                            value={formData.oficioNumero}
                            onChange={handleChange}
                            placeholder="Ex: 001"
                        />
                    </div>

                    <div className="form-group">
                        <label>Data do Ofício:</label>
                        <input
                            type="date"
                            name="dataOficio"
                            value={formData.dataOficio}
                            onChange={handleChange}
                        />
                    </div>

                    <div className="form-group">
                        <label>Nome da Escola:</label>
                        <input
                            type="text"
                            name="escola"
                            value={formData.escola}
                            onChange={handleChange}
                            placeholder="Nome completo da escola"
                        />
                    </div>

                    <div className="form-group">
                        <label>Nome do(a) Diretor(a):</label>
                        <input
                            type="text"
                            name="nomeDiretor"
                            value={formData.nomeDiretor}
                            onChange={handleChange}
                            placeholder="Nome completo do(a) diretor(a)"
                        />
                    </div>

                    <button 
                        className="download-button"
                        onClick={handleDownload}
                    >
                        Baixar Relatório
                    </button>
                </div>

                <div className="report-preview">
                    <div className="preview-paper">
                        <div className="preview-header">
                            <img src="/logo-governo-sp.png" alt="Governo SP" className="gov-logo"/>
                            <h1>GOVERNO DO ESTADO DE SÃO PAULO</h1>
                            <h2>SECRETARIA DA EDUCAÇÃO</h2>
                        </div>

                        <div className="preview-content">
                            <p className="date">
                                São Paulo, {new Date(formData.dataOficio).toLocaleDateString('pt-BR')}
                            </p>

                            <p className="oficio">
                                Ofício nº {formData.oficioNumero}/{formData.ano}
                            </p>

                            <p className="assunto">
                                Assunto: {formData.assunto}
                            </p>

                            <p className="destinatario">
                                Senhor(a) Dirigente,
                            </p>

                            <p className="texto">
                                Encaminhamos a Vosso(a) Senhor(a) expediente contendo ata dos membros 
                                da Diretoria Executiva da APM; Termo de Recebimento do Diretor de Escola 
                                e Cópias das Notas Fiscais dos Materiais Permanentes adquiridos pela 
                                Associação de Pais e Mestres (APM) desta Unidade Escolar através do 
                                Convênio celebrado entre a Secretaria de Estado da Educação e o 
                                FNDE/MEC/PDDE/{formData.ano}.
                            </p>

                            <p className="texto">
                                Tal procedimento tem como objetivo solicitar autorização para 
                                recebimento da referida doação, com fundamento no item 2 da alínea "b" 
                                do Inciso VI do Artigo 80 do Decreto nº 57.141/2011 e Resolução SE 45/12.
                            </p>

                            <p className="texto">
                                No ensejo, reiteramos processos de elevada estima e respeitosa consideração.
                            </p>

                            <p className="assinatura">
                                Respeitosamente,
                            </p>

                            <div className="assinatura-diretor">
                                <p>{formData.nomeDiretor}</p>
                                <p>Diretor(a) de Escola</p>
                                <p>{formData.escola}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default GenerateReport;