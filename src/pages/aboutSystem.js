import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaUsers, 
    FaLaptop, 
    FaExchangeAlt, 
    FaCheckCircle,
    FaReact,
    FaGithub,
    FaNpm,
    FaTools,
    FaDatabase,
    FaCode
} from 'react-icons/fa';
import './aboutSystem.css';

const AboutSystem = () => {
    const navigate = useNavigate();

    const flowSteps = [
        {
            icon: <FaUsers size={40} />,
            title: "Cadastro de Doação",
            description: "Doadores cadastram equipamentos disponíveis para doação no sistema"
        },
        {
            icon: <FaLaptop size={40} />,
            title: "Solicitação",
            description: "Escolas podem buscar e solicitar equipamentos necessários"
        },
        {
            icon: <FaExchangeAlt size={40} />,
            title: "Processo",
            description: "O sistema gerencia o processo de doação entre as partes"
        },
        {
            icon: <FaCheckCircle size={40} />,
            title: "Conclusão",
            description: "Confirmação e documentação da doação realizada"
        }
    ];

    const technologies = [
        {
            category: "Frontend",
            icon: <FaReact size={40} />,
            items: [
                "React.js - Construção da interface",
                "React Router - Navegação",
                "Context API - Gerenciamento de estado",
                "Styled Components - Estilização"
            ]
        },
        {
            category: "Backend",
            icon: <FaDatabase size={40} />,
            items: [
                "Supabase - Backend as a Service",
                "PostgreSQL - Banco de dados",
                "Autenticação integrada",
                "Row Level Security"
            ]
        },
        {
            category: "Ferramentas",
            icon: <FaTools size={40} />,
            items: [
                "VS Code - Editor de código",
                "Git & GitHub - Versionamento",
                "npm - Gerenciador de pacotes",
                "Postman - Testes de API"
            ]
        }
    ];

    const devTools = [
        { icon: <FaCode size={40} />, name: "VS Code" },
        { icon: <FaGithub size={40} />, name: "GitHub" },
        { icon: <FaNpm size={40} />, name: "npm" },
        { icon: <FaTools size={40} />, name: "Postman" }
    ];

    return (
        <div className="about-system-page">
            <button 
                onClick={() => navigate(-1)} 
                className="about-system-back-btn"
            >
                ← Voltar
            </button>

            <div className="about-system-container">
                <h1 className="about-system-title">
                    Sistema de Doação de Equipamentos
                </h1>

                <section className="about-system-section">
                    <h2 className="about-system-subtitle">Como Funciona</h2>
                    <div className="about-system-flow">
                        {flowSteps.map((step, index) => (
                            <div key={index} className="about-system-flow-card">
                                <div className="about-system-icon-wrapper">
                                    {step.icon}
                                </div>
                                <h3>{step.title}</h3>
                                <p>{step.description}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="about-system-section">
                    <h2 className="about-system-subtitle">Tecnologias Utilizadas</h2>
                    <div className="about-system-tech">
                        {technologies.map((tech, index) => (
                            <div key={index} className="about-system-tech-card">
                                <div className="about-system-icon-wrapper">
                                    {tech.icon}
                                </div>
                                <h3>{tech.category}</h3>
                                <ul>
                                    {tech.items.map((item, idx) => (
                                        <li key={idx}>{item}</li>
                                    ))}
                                </ul>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="about-system-section">
                    <h2 className="about-system-subtitle">Ferramentas de Desenvolvimento</h2>
                    <div className="about-system-tools">
                        {devTools.map((tool, index) => (
                            <div key={index} className="about-system-tool-icon">
                                {tool.icon}
                                <span>{tool.name}</span>
                            </div>
                        ))}
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AboutSystem;
