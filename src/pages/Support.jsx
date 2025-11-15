import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Support.css';

const Support = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('processo');
    const [faqItems] = useState([
        { 
            pergunta: 'Como faço para doar um equipamento?',
            resposta: 'O processo de doação é simples e gratuito. Primeiro, crie sua conta gratuitamente no site. Em seguida, no painel do usuário, clique em "Gerar documentos" e preencha as informações necessárias. O sistema gerará os documentos. Você pode optar por assinar digitalmente através do site do Gov.br (clicando no botão disponível na plataforma) ou realizar a assinatura presencialmente na escola. Por fim, se necessário, solicite o recibo de doação diretamente na escola.'
        },
        { 
            pergunta: 'Como funciona o processo de doação?',
            resposta: 'O processo de doação segue 4 etapas: 1) Cadastro no site - Crie sua conta gratuitamente para acessar o painel do usuário; 2) Gerar os documentos - No painel, clique em "Gerar documentos" e preencha as informações necessárias; 3) Assinar os documentos - Você pode optar por assinar digitalmente através do site do Gov.br (clicando no botão disponível na plataforma) ou realizar a assinatura presencialmente na escola selecionada; 4) Solicitar recibo - Se necessário, solicite o recibo de doação diretamente na escola.'
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
            pergunta: 'Como funciona a assinatura digital dos documentos?',
            resposta: 'Após gerar os documentos, você pode optar por assinar digitalmente através do site do Gov.br. Para isso, clique no botão disponível na plataforma que o levará ao site do Gov.br, onde você realizará a assinatura digital dos documentos de forma segura e com validade legal. É necessário ter uma conta no Gov.br (nível prata ou ouro) para realizar a assinatura digital. A assinatura digital é opcional - você também pode optar por assinar presencialmente na escola.'
        },
        {
            pergunta: 'O que acontece após gerar os documentos?',
            resposta: 'Após gerar os documentos, você pode escolher entre duas opções: 1) Assinar digitalmente - Clique no botão disponível na plataforma para acessar o site do Gov.br e realizar a assinatura digital dos documentos; 2) Assinar presencialmente - Leve os documentos até a escola selecionada e realize a assinatura presencialmente. Os documentos ficarão disponíveis no seu histórico e você poderá acompanhar o status da doação diretamente com a escola.'
        },
        {
            pergunta: 'Posso assinar os documentos presencialmente na escola?',
            resposta: 'Sim, você pode optar por assinar os documentos presencialmente na escola. Basta imprimir os documentos gerados e levá-los até a escola selecionada para realizar a assinatura. A assinatura presencial é válida e tem o mesmo efeito legal da assinatura digital.'
        }
    ]);


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
                                <h3 className="processo-titulo">Assinar os documentos:</h3>
                                <p className="processo-descricao">
                                    Você pode optar por assinar digitalmente através do site do Gov.br (clicando no botão disponível na plataforma) ou realizar a assinatura presencialmente na escola selecionada. Para assinatura digital, é necessário ter uma conta no Gov.br (nível prata ou ouro). Ambas as opções têm validade legal.
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
                        <div className="suporte-info">
                            <h3 className="suporte-info-titulo">Entre em contato</h3>
                            <p className="suporte-info-texto">
                                <strong>E-mail:</strong><br />
                                conectedu.org@gmail.com
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
