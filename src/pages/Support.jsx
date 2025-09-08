import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Support.css';

const Support = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('processo');
    const [faqItems] = useState([
        { 
            pergunta: 'Como faço para doar um equipamento?',
            resposta: 'O processo de doação é simples e gratuito. Primeiro, crie sua conta gratuitamente no site. Em seguida, no painel do usuário, clique em "Gerar documentos" e preencha as informações necessárias. O sistema gerará os documentos que você deve imprimir e levar até a escola selecionada para assinatura presencial. Por fim, se necessário, solicite o recibo de doação diretamente na escola.'
        },
        { 
            pergunta: 'Quem pode solicitar equipamentos?',
            resposta: 'Escolas e instituições de ensino públicas cadastradas em nossa plataforma podem solicitar equipamentos. É necessário ter um cadastro verificado e apresentar a documentação necessária da instituição.'
        },
        { 
            pergunta: 'Como funciona o processo de doação?',
            resposta: 'O processo de doação segue 4 etapas: 1) Cadastro no site - Crie sua conta gratuitamente para acessar o painel do usuário; 2) Gerar os documentos - No painel, clique em "Gerar documentos" e preencha as informações necessárias; 3) Entregar e assinar - Leve os documentos até a escola selecionada e realize a assinatura presencialmente; 4) Solicitar recibo - Se necessário, solicite o recibo de doação diretamente na escola.'
        },
        { 
            pergunta: 'Quais tipos de equipamentos posso doar?',
            resposta: 'Aceitamos computadores, notebooks, tablets, impressoras e outros equipamentos tecnológicos em bom estado de funcionamento. Os equipamentos devem estar completos e em condições de uso para fins educacionais.'
        },
        { 
            pergunta: 'Como vejo o histórico dos meus documentos?',
            resposta: 'Após fazer login, acesse a seção "Histórico de Documentos" no seu painel. Lá você encontrará todos os documentos de doação que foram gerados, com as datas e informações de cada um.'
        },
        { 
            pergunta: 'Existe algum custo para doar ou receber equipamentos?',
            resposta: 'A plataforma é totalmente gratuita. Não há custos para doar ou receber equipamentos através da nossa plataforma.'
        },
        {
            pergunta: 'Como garantir a segurança dos dados nos equipamentos doados?',
            resposta: 'Recomendamos que todos os equipamentos sejam formatados e restaurados às configurações de fábrica antes da doação. Oferecemos um guia detalhado sobre como fazer isso de forma segura.'
        },
        {
            pergunta: 'Posso reimprimir documentos já gerados?',
            resposta: 'Sim, você pode reimprimir qualquer documento que já foi gerado através do seu histórico de documentos. Acesse a seção "Histórico de Documentos" no seu painel e clique em "Reimprimir" no documento desejado.'
        },
        {
            pergunta: 'Onde posso gerar o recibo de doação?',
            resposta: 'O recibo de doação pode ser solicitado diretamente na escola onde você fez a doação, ou pode ser gerado no site da ConectEdu através do painel de usuário das instituições públicas.'
        },
        {
            pergunta: 'Preciso ir pessoalmente à escola para assinar os documentos?',
            resposta: 'Sim, a assinatura dos documentos de doação deve ser feita presencialmente na escola selecionada. Isso garante a autenticidade e validade legal da doação.'
        },
        {
            pergunta: 'O que acontece após gerar os documentos?',
            resposta: 'Após gerar os documentos, você deve imprimi-los e levá-los até a escola selecionada para assinatura presencial. O sistema salva o histórico dos documentos gerados, mas o acompanhamento da doação deve ser feito diretamente com a escola.'
        }
    ]);

    const handleSubmit = (e) => {
        e.preventDefault();
        // Handle form submission
    };

    return (
        <div className="suporte-page">
            <button 
                onClick={() => navigate(-1)} 
                className="suporte-voltar-btn"
            >
                ← Voltar
            </button>

            <div className="suporte-container">
                <h1 className="suporte-titulo">Central de Suporte</h1>
                
                <div className="suporte-tabs">
                    <button 
                        className={`suporte-tab-button ${activeTab === 'processo' ? 'active' : ''}`}
                        onClick={() => setActiveTab('processo')}
                    >
                        Processo de Doação
                    </button>
                    <button 
                        className={`suporte-tab-button ${activeTab === 'faq' ? 'active' : ''}`}
                        onClick={() => setActiveTab('faq')}
                    >
                        Perguntas Frequentes
                    </button>
                    <button 
                        className={`suporte-tab-button ${activeTab === 'contact' ? 'active' : ''}`}
                        onClick={() => setActiveTab('contact')}
                    >
                        Contato
                    </button>
                </div>

                {activeTab === 'processo' ? (
                    <div className="suporte-processo">
                        <div className="processo-container">
                            <div className="processo-card">
                                <div className="processo-numero">1</div>
                                <h3 className="processo-titulo">Cadastro no site:</h3>
                                <p className="processo-descricao">
                                    Crie sua conta gratuitamente para acessar o painel do usuário.
                                </p>
                            </div>
                            <div className="processo-card">
                                <div className="processo-numero">2</div>
                                <h3 className="processo-titulo">Gerar os documentos:</h3>
                                <p className="processo-descricao">
                                    No painel do usuário, clique em "Gerar documentos" e preencha as informações necessárias para criar os documentos de doação.
                                </p>
                            </div>
                            <div className="processo-card">
                                <div className="processo-numero">3</div>
                                <h3 className="processo-titulo">Entregar e assinar:</h3>
                                <p className="processo-descricao">
                                    Leve os documentos gerados até a escola selecionada e realize a assinatura presencialmente.
                                </p>
                            </div>
                            <div className="processo-card">
                                <div className="processo-numero">4</div>
                                <h3 className="processo-titulo">Solicitar recibo de doação:</h3>
                                <p className="processo-descricao">
                                    Caso necessário, solicite o recibo de doação diretamente na escola. O recibo também pode ser gerado no site da ConectEdu pelo painel de usuário das instituições públicas.
                                </p>
                            </div>
                        </div>
                    </div>
                ) : activeTab === 'faq' ? (
                    <div className="suporte-faq">
                        {faqItems.map((item, index) => (
                            <div key={index} className="suporte-faq-item">
                                <h3 className="suporte-faq-pergunta">{item.pergunta}</h3>
                                <p className="suporte-faq-resposta">{item.resposta}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="suporte-contato">
                        <form onSubmit={handleSubmit} className="suporte-form">
                            <div className="suporte-form-grupo">
                                <label className="suporte-form-label">Nome</label>
                                <input 
                                    type="text" 
                                    className="suporte-form-input"
                                    placeholder="Seu nome completo"
                                />
                            </div>
                            <div className="suporte-form-grupo">
                                <label className="suporte-form-label">E-mail</label>
                                <input 
                                    type="email" 
                                    className="suporte-form-input"
                                    placeholder="seu@email.com"
                                />
                            </div>
                            <div className="suporte-form-grupo">
                                <label className="suporte-form-label">Assunto</label>
                                <input 
                                    type="text" 
                                    className="suporte-form-input"
                                    placeholder="Assunto da mensagem"
                                />
                            </div>
                            <div className="suporte-form-grupo">
                                <label className="suporte-form-label">Mensagem</label>
                                <textarea 
                                    className="suporte-form-textarea"
                                    rows="5"
                                    placeholder="Descreva sua dúvida ou problema"
                                ></textarea>
                            </div>
                            <button type="submit" className="suporte-enviar-btn">
                                Enviar Mensagem
                            </button>
                        </form>
                        <div className="suporte-info">
                            <h3 className="suporte-info-titulo">Outras formas de contato</h3>
                            <p className="suporte-info-texto">
                                <strong>E-mail:</strong><br />
                                suporte@conectedu.com.br
                            </p>
                            <p className="suporte-info-texto">
                                <strong>Telefone:</strong><br />
                                (19) 996117872
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Support;
