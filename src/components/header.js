import React, { useState } from 'react';
import logo from '../assets/img/LogoConectEdu7.png';
import './header.css';
import { Link } from 'react-router-dom';

function header() {
    // Estado para controlar os dropdowns
    const [activeDropdown, setActiveDropdown] = useState(null);

    // Função para controlar o dropdown
    const toggleDropdown = (e, dropdownId) => {
        e.preventDefault();
        setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
    };

    // Fechar dropdown quando clicar fora
    React.useEffect(() => {
        const closeDropdown = (e) => {
            if (!e.target.closest('.dropdown')) {
                setActiveDropdown(null);
            }
        };

        document.addEventListener('click', closeDropdown);
        return () => document.removeEventListener('click', closeDropdown);
    }, []);

    return (
        <header>
            <button className="menu-toggle" id="menuToggle">
                <i className="fas fa-bars"></i>
            </button>

            <div className="btnLogin">
                <Link to="/login" className="btn login" id="loginBtn">
                    <i className="fas fa-user"></i>
                </Link>
            </div>

            <nav>
                <Link to="/">
                    <img src={logo} alt="Logo ConectEdu" className="logo" />
                </Link>
                <ul className="nav-links">
                    <li><Link to="/">Home</Link></li>
                    <li><Link to="/register">Cadastro</Link></li>
                    <li><Link to="/about">Sobre</Link></li>
                    <li className="dropdown">
                        <a 
                            href="#" 
                            onClick={(e) => toggleDropdown(e, 'plataformaDropdown')}
                        >
                            Plataforma
                        </a>
                        <ul className={`dropdown-content ${activeDropdown === 'plataformaDropdown' ? 'show' : ''}`}>
                            <li><Link to="/services/equipamentos">Doar Equipamentos</Link></li>
                            <li><Link to="/services/manutencao">Solicitar Equipamentos</Link></li>
                            <li><Link to="/services/treinamento">Logística</Link></li>
                            <li><Link to="/services/suporte">Reciclagem e Descarte</Link></li>
                            <li><Link to="/services/reciclagem">Suporte</Link></li>
                        </ul>
                    </li>
                    <li className="dropdown">
                        <a 
                            href="#" 
                            onClick={(e) => toggleDropdown(e, 'escolasDropdown')}
                        >
                            Instituições Cadastradas
                        </a>
                        <ul className={`dropdown-content ${activeDropdown === 'escolasDropdown' ? 'show' : ''}`}>
                            {/* As escolas serão carregadas dinamicamente */}
                        </ul>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default header;

