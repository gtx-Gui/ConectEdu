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
                        className={`suporte-tab-button ${activeTab === 'assinatura' ? 'active' : ''}`}
                        onClick={() => setActiveTab('assinatura')}
                    >
                        Assinatura Digital
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
                ) : activeTab === 'assinatura' ? (
                    <div className="suporte-assinatura">
                        <div className="assinatura-guia">
                            <h2 className="assinatura-titulo">
                                <i className="fas fa-signature me-2"></i>
                                Guia Completo: Como Assinar Digitalmente pelo Gov.br
                            </h2>

                            <div className="assinatura-intro">
                                <p>
                                    A assinatura digital pelo <strong>Gov.br</strong> é uma forma segura e legal de assinar seus documentos de doação sem precisar sair de casa. Este guia passo a passo vai te ajudar em cada etapa do processo.
                                </p>
                            </div>

                            <div className="assinatura-section">
                                <h3 className="assinatura-section-titulo">
                                    <i className="fas fa-info-circle me-2"></i>
                                    O que você precisa saber
                                </h3>
                                <div className="assinatura-box info">
                                    <ul>
                                        <li><strong>Requisito:</strong> Conta no Gov.br com nível <strong>Prata ou Ouro</strong></li>
                                        <li><strong>Documentos necessários:</strong> RG (ou CNH) e CPF</li>
                                        <li><strong>Celular:</strong> Número cadastrado para receber códigos de verificação</li>
                                        <li><strong>Tempo:</strong> Todo o processo pode ser feito em alguns minutos</li>
                                        <li><strong>Validade legal:</strong> A assinatura digital tem a mesma validade da assinatura presencial</li>
                                    </ul>
                                </div>
                            </div>

                            <div className="assinatura-section">
                                <h3 className="assinatura-section-titulo">
                                    <i className="fas fa-video me-2"></i>
                                    Vídeo Tutorial Oficial
                                </h3>

                                <div className="video-section">
                                    <div className="video-wrapper-suporte">
                                        <iframe
                                            src="https://www.youtube.com/embed/dE_hy6sbe9Q"
                                            title="Como assinar digitalmente pelo Gov.br - Vídeo Tutorial Oficial"
                                            frameBorder="0"
                                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                            allowFullScreen
                                            className="youtube-video-suporte"
                                        ></iframe>
                                    </div>
                                    <p className="video-description-suporte">
                                        Assista ao vídeo oficial do Gov.br para aprender passo a passo como criar sua conta, elevar o nível e assinar documentos digitalmente.
                                    </p>
                                </div>

                                <div className="assinatura-resumo">
                                    <h4 className="resumo-titulo">
                                        <i className="fas fa-check-circle me-2"></i>
                                        Resumo Rápido do Processo
                                    </h4>
                                    <div className="resumo-steps">
                                        <div className="resumo-step">
                                            <span className="resumo-number">1</span>
                                            <div className="resumo-content">
                                                <h5>Criar conta no Gov.br</h5>
                                                <p>Acesse <a href="https://www.gov.br/acesso/" target="_blank" rel="noopener noreferrer">www.gov.br/acesso</a> e crie sua conta gratuitamente</p>
                                            </div>
                                        </div>
                                        <div className="resumo-step">
                                            <span className="resumo-number">2</span>
                                            <div className="resumo-content">
                                                <h5>Elevar nível para Prata ou Ouro</h5>
                                                <p>Verificação via aplicativo do banco (Prata) ou presencial nos Correios (Ouro)</p>
                                            </div>
                                        </div>
                                        <div className="resumo-step">
                                            <span className="resumo-number">3</span>
                                            <div className="resumo-content">
                                                <h5>Assinar na plataforma ConectEdu</h5>
                                                <p>Clique no botão "Assinatura Digital gov.br" após gerar seus documentos</p>
                                            </div>
                                        </div>
                                        <div className="resumo-step">
                                            <span className="resumo-number">4</span>
                                            <div className="resumo-content">
                                                <h5>Confirmar assinatura</h5>
                                                <p>Documento será marcado como assinado digitalmente na plataforma</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="assinatura-section">
                                <h3 className="assinatura-section-titulo">
                                    <i className="fas fa-question-circle me-2"></i>
                                    Dúvidas Comuns
                                </h3>
                                <div className="assinatura-faq">
                                    <div className="faq-item">
                                        <h5>Quanto tempo leva para elevar o nível da conta?</h5>
                                        <p><strong>Nível Prata:</strong> Pode ser feito em alguns minutos, se você tiver conta no Banco do Brasil ou Caixa. <strong>Nível Ouro:</strong> Requer agendamento e comparecimento presencial.</p>
                                    </div>
                                    <div className="faq-item">
                                        <h5>Posso assinar mesmo sem conta no Gov.br?</h5>
                                        <p>Não. Você precisa ter uma conta no Gov.br com nível Prata ou Ouro. Mas não se preocupe: você também pode <strong>imprimir os documentos e assinar presencialmente na escola</strong> - ambas as opções têm validade legal.</p>
                                    </div>
                                    <div className="faq-item">
                                        <h5>A assinatura digital é segura?</h5>
                                        <p>Sim! A assinatura digital pelo Gov.br é extremamente segura e tem a mesma validade legal de uma assinatura presencial. Os documentos são criptografados e protegidos.</p>
                                    </div>
                                    <div className="faq-item">
                                        <h5>Preciso pagar algo?</h5>
                                        <p>Não! Tanto a criação da conta no Gov.br quanto a assinatura digital são <strong>totalmente gratuitas</strong>.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="assinatura-section">
                                <div className="assinatura-box alternative">
                                    <h4>
                                        <i className="fas fa-info-circle me-2"></i>
                                        Lembre-se
                                    </h4>
                                    <p>
                                        <strong>A assinatura digital é opcional!</strong> Se você preferir ou tiver dificuldades, você pode:
                                    </p>
                                    <ul>
                                        <li>Imprimir os documentos gerados na plataforma</li>
                                        <li>Levar até a escola selecionada</li>
                                        <li>Assinar presencialmente na presença de um representante da escola</li>
                                    </ul>
                                    <p>Ambas as formas (digital e presencial) têm a mesma validade legal.</p>
                                </div>
                            </div>

                            <div className="assinatura-section">
                                <div className="assinatura-help">
                                    <h4>
                                        <i className="fas fa-headset me-2"></i>
                                        Precisa de ajuda?
                                    </h4>
                                    <p>Se você ainda tem dúvidas ou encontrou algum problema:</p>
                                    <ul>
                                        <li><strong>E-mail:</strong> conectedu.org@gmail.com</li>
                                        <li><strong>Telefone:</strong> (19) 99611-7872</li>
                                    </ul>
                                    <p>Também podemos te ajudar pelo <a href="https://whatsa.me/5519996117872/?t=Olá,%20preciso%20de%20ajuda%20com%20assinatura%20digital" target="_blank" rel="noopener noreferrer">WhatsApp</a>.</p>
                                </div>
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
