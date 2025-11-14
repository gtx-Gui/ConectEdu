import React, { useState } from 'react';
import logo from '../assets/img/LogoConectEdu7.png';
import './header.css';
import { Link } from 'react-router-dom';

function header() {
    // Estado para controlar os dropdowns
    const [activeDropdown, setActiveDropdown] = useState(null);
    // Estado para controlar o menu mobile
    const [menuOpen, setMenuOpen] = useState(false);

    // Função para controlar o dropdown
    const toggleDropdown = (e, dropdownId) => {
        e.preventDefault();
        setActiveDropdown(activeDropdown === dropdownId ? null : dropdownId);
    };

    // Função para toggle do menu mobile
    const toggleMenu = () => {
        setMenuOpen(!menuOpen);
    };

    // Fechar menu quando clicar em um link
    const closeMenu = () => {
        setMenuOpen(false);
        setActiveDropdown(null);
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

    // Fechar menu ao clicar fora em mobile
    React.useEffect(() => {
        if (menuOpen) {
            const handleClickOutside = (e) => {
                if (!e.target.closest('header') && !e.target.closest('.menu-toggle')) {
                    setMenuOpen(false);
                }
            };
            document.addEventListener('click', handleClickOutside);
            return () => document.removeEventListener('click', handleClickOutside);
        }
    }, [menuOpen]);

    return (
        <header>
            <button className="menu-toggle" id="menuToggle" onClick={toggleMenu} aria-label="Menu">
                <i className={menuOpen ? "fas fa-times" : "fas fa-bars"}></i>
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
                <ul className={`nav-links ${menuOpen ? 'active' : ''}`}>
                    <li><Link to="/" onClick={closeMenu}>Home</Link></li>
                    <li><Link to="/register" onClick={closeMenu}>Cadastro</Link></li>
                    <li><Link to="/about" onClick={closeMenu}>Sobre</Link></li>
                    <li className="dropdown">
                        <a 
                            href="#" 
                            onClick={(e) => toggleDropdown(e, 'plataformaDropdown')}
                        >
                            Plataforma
                        </a>
                        <ul className={`dropdown-content ${activeDropdown === 'plataformaDropdown' ? 'show' : ''}`}>
                            
                            <li><Link to="hubRecycling" onClick={closeMenu}>Reciclagem e Descarte</Link></li>
                            <li><Link to="/support" onClick={closeMenu}>Suporte</Link></li>
                        </ul>
                    </li>
                    <li className="dropdown">
                        <a 
                            href="#" 
                            onClick={(e) => toggleDropdown(e, 'HowItWorksDropdown')}
                        >
                            Como Funciona
                        </a>
                        <ul className={`dropdown-content ${activeDropdown === 'HowItWorksDropdown' ? 'show' : ''}`}>
                            <li><Link to="/documentation" onClick={closeMenu}>Documentação</Link></li>
                            <li><Link to="/aboutSystem" onClick={closeMenu}>Sistema</Link></li>
                        </ul>
                    </li>
                </ul>
            </nav>
        </header>
    );
}

export default header;

