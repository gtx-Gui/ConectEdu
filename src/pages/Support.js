import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './Support.css';

const Support = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('faq');
    const [faqItems] = useState([
        { 
            pergunta: 'Como faço para doar um equipamento?',
            resposta: 'Para doar um equipamento, faça login na plataforma e clique no botão "Nova Doação". Preencha o formulário com as informações do equipamento, como tipo, estado de conservação e fotos. Após a submissão, nossa equipe irá revisar e entrar em contato.'
        },
        { 
            pergunta: 'Quem pode solicitar equipamentos?',
            resposta: 'Escolas e instituições de ensino públicas cadastradas em nossa plataforma podem solicitar equipamentos. É necessário ter um cadastro verificado e apresentar a documentação necessária da instituição.'
        },
        { 
            pergunta: 'Como funciona o processo de doação?',
            resposta: 'O processo segue estas etapas: 1) Cadastro do equipamento pelo doador; 2) Verificação pela nossa equipe; 3) Disponibilização para solicitação; 4) Matching com uma instituição; 5) Organização da entrega; 6) Confirmação do recebimento.'
        },
        { 
            pergunta: 'Quais tipos de equipamentos posso doar?',
            resposta: 'Aceitamos computadores, notebooks, tablets, impressoras e outros equipamentos tecnológicos em bom estado de funcionamento. Os equipamentos devem estar completos e em condições de uso para fins educacionais.'
        },
        { 
            pergunta: 'Como acompanho o status da minha doação?',
            resposta: 'Após fazer login, acesse a seção "Minhas Doações" no seu painel. Lá você encontrará todas as suas doações e seus respectivos status, desde o cadastro até a entrega final.'
        },
        { 
            pergunta: 'Existe algum custo para doar ou receber equipamentos?',
            resposta: 'A plataforma é totalmente gratuita. No entanto, os custos de transporte e entrega dos equipamentos podem ser acordados entre as partes envolvidas na doação.'
        },
        {
            pergunta: 'Como garantir a segurança dos dados nos equipamentos doados?',
            resposta: 'Recomendamos que todos os equipamentos sejam formatados e restaurados às configurações de fábrica antes da doação. Oferecemos um guia detalhado sobre como fazer isso de forma segura.'
        },
        {
            pergunta: 'Posso cancelar uma doação em andamento?',
            resposta: 'Sim, é possível cancelar uma doação antes que ela seja vinculada a uma instituição. Após o matching, será necessário entrar em contato com nossa equipe de suporte para avaliar a situação.'
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

                {activeTab === 'faq' ? (
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
