import React from 'react';
import { useNavigate } from 'react-router-dom';
import { 
    FaReact,
    FaDatabase,
    FaCode,
    FaFileAlt,
    FaServer,
    FaCloud,
    FaGithub,
    FaNpm
} from 'react-icons/fa';
import './aboutSystem.css';

const AboutSystem = () => {
    const navigate = useNavigate();

    const systemInfo = {
        title: "Sobre o Sistema ConectEdu",
        description: "O ConectEdu é uma plataforma web desenvolvida para geração de documentação oficial. O sistema permite que usuários cadastrados criem, validem e baixem documentos oficiais em formato PDF através de formulários digitais intuitivos.",
        features: [
            {
                title: "Geração de PDF",
                description: "Sistema automatizado para criação de documentos em formato PDF com layout profissional e padronizado."
            },
            {
                title: "Mecanismo de Modelo",
                description: "Templates pré-definidos que garantem consistência e qualidade na formatação dos documentos gerados."
            }
        ],
        technologies: [
            {
                name: "React.js",
                icon: <FaReact />,
                description: "Biblioteca JavaScript para construção de interfaces"
            },
            {
                name: "Node.js",
                icon: <FaServer />,
                description: "Runtime JavaScript para backend"
            },
            {
                name: "Supabase",
                icon: <FaDatabase />,
                description: "Backend as a Service com PostgreSQL"
            },
            {
                name: "CSS3",
                icon: <FaCode />,
                description: "Estilização e responsividade"
            }
        ],
        development: [
            {
                name: "GitHub",
                icon: <FaGithub />,
                description: "Controle de versão e colaboração"
            },
            {
                name: "npm",
                icon: <FaNpm />,
                description: "Gerenciamento de dependências"
            }
        ]
    };

    return (
        <div className="about-system-container">
            {/* Hero Section */}
            <div className="about-system-hero">
                <h1 className="about-system-title">{systemInfo.title}</h1>
                <p className="about-system-description">{systemInfo.description}</p>
            </div>

            {/* Funcionalidades */}
            <section className="about-system-section">
                <h2 className="about-system-section-title">Funcionalidades Principais</h2>
                <div className="about-system-features">
                    {systemInfo.features.map((feature, index) => (
                        <div key={index} className="about-system-feature">
                            <div className="about-system-feature-icon">
                                <FaFileAlt />
                            </div>
                            <h3 className="about-system-feature-title">{feature.title}</h3>
                            <p className="about-system-feature-description">{feature.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Tecnologias */}
            <section className="about-system-section">
                <h2 className="about-system-section-title">Tecnologias Utilizadas</h2>
                <div className="about-system-tech-grid">
                    {systemInfo.technologies.map((tech, index) => (
                        <div key={index} className="about-system-tech-item">
                            <div className="about-system-tech-icon">
                                {tech.icon}
                            </div>
                            <h3 className="about-system-tech-title">{tech.name}</h3>
                            <p className="about-system-tech-description">{tech.description}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Ferramentas de Desenvolvimento */}
            <section className="about-system-section">
                <h2 className="about-system-section-title">Ferramentas de Desenvolvimento</h2>
                <div className="about-system-dev-grid">
                    {systemInfo.development.map((tool, index) => (
                        <div key={index} className="about-system-dev-item">
                            <div className="about-system-dev-icon">
                                {tool.icon}
                            </div>
                            <h3 className="about-system-dev-title">{tool.name}</h3>
                            <p className="about-system-dev-description">{tool.description}</p>
                        </div>
                    ))}
                </div>
            </section>
        </div>
    );
};

export default AboutSystem;
