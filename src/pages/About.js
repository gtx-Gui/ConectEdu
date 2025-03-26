import React from 'react';
import './About.css';

import imgTime from '../assets/img/aboutimg/fotoProjeto.jpeg';
import imgGuilherme from '../assets/img/aboutimg/fotoGui.webp';
import imgGiovanna from '../assets/img/aboutimg/fotoGiovanna2.jpg';


function About() {
    return (
        <div className="about-container">
            <h1>Sobre Nós</h1>
            
            <section className="missao">
                <h2>Nossa Missão</h2>
                <p className="pContainerSobre">
                A ConectEdu é um projeto que nasceu de uma iniciativa estudantil com um propósito claro: reduzir a desigualdade digital na educação brasileira. Acreditamos que todo estudante tem o direito de acessar as ferramentas tecnológicas essenciais para uma educação completa e inclusiva no século XXI.
                </p>
            </section>

            <section className="visao">
                <h2>Nossa Visão</h2>
                <p className="pContainerSobre">
                Queremos criar uma rede solidária que conecte doadores a escolas necessitadas, transformando equipamentos eletrônicos em oportunidades reais de aprendizado. Nosso objetivo é ser a ponte entre aqueles que desejam contribuir e os que mais precisam de ajuda.
                </p>
            </section>

            <section className="valores">
                <h2>Nossos Valores</h2>
                <ul>
                    <li className="li-aboutValues">Compromisso com a educação</li>
                    <li className="li-aboutValues">Responsabilidade social</li>
                    <li className="li-aboutValues">Sustentabilidade</li>
                    <li className="li-aboutValues">Transparência</li>
                    <li className="li-aboutValues">Inovação social</li>
                </ul>
            </section>

            <section className="impacto">
                <h2>Nosso Impacto</h2>
                <p className="pContainerSobre">
                Cada doação representa uma nova possibilidade de aprendizado. Nosso trabalho é levar equipamentos eletrônicos às escolas mais carentes, impactando diretamente o futuro de milhares de estudantes e abrindo caminhos para um Brasil mais igualitário.
                </p>
            </section>

            <section className="desenvolvedores">
                <h2>Desenvolvedores</h2>
                <p className="pContainerSobre">
                Sob a orientação de Fabiana Cristine e Diogo Pelaes, Guilherme Grasso e Giovanna de Souza criaram a ConectEdu com o objetivo de apoiar escolas sem recursos suficientes para oferecer tecnologia aos seus alunos.

                </p>
                
                <img 
                    src={imgTime} 
                    alt="Equipe do projeto" 
                    className="team-image"
                />
                
                <div className="dev-profile">
                    <img 
                        src={imgGuilherme} 
                        alt="Foto do Guilherme" 
                        className="profile-image"
                    />
                    <div className="profile-text">
                    Autor do projeto e estudante do CEMEP, em Paulínia. Responsável pelo desenvolvimento do site e pela criação das APIs, garantindo a funcionalidade e acessibilidade da plataforma.

                    </div>
                </div>
                
                <div className="dev-profile">
                    <img 
                        src={imgGiovanna} 
                        alt="Foto da Giovanna" 
                        className="profile-image"
                    />
                    <div className="profile-text">
                    Autora do projeto e estudante do CEMEP, em Paulínia. Responsável pelo desenvolvimento e gerenciamento do banco de dados, além de colaborar na integração e otimização das APIs.

                    </div>
                </div>
            </section>
        </div>
    );
}

export default About; 