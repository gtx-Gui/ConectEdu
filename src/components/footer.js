import React from 'react';
import './footer.css';

function footer() {
    return (
        <footer>
            <nav>
                <ul className="nav-links-footer">
                    <li><a href="#">Home</a></li>
                    <li><a href="register.html">Cadastro</a></li>
                    <li><a href="login.html">Entrar</a></li>
                    <li><a href="donation.html">Doe</a></li>
                    <li><a href="orderEquipment.html">Solicitar Equipamentos</a></li>
                    <li><a href="about.html">Sobre</a></li>
                    <li><a href="https://whatsa.me/5519996117872/?t=Olá,%20gostaria%20de%20saber%20mais%20sobre%20o%20projeto%20ConectEdu">Contato whatsapp</a></li>
                </ul>
            </nav>

            <p>Contato: (19) 99611-7872 | Conectedu.org@gmail.com</p>

            <div className="social-buttons">
                <a href="https://whatsa.me/5519996117872/?t=Olá,%20gostaria%20de%20saber%20mais%20sobre%20o%20projeto%20ConectEdu" className="btn whatsapp" target="_blank" rel="noopener noreferrer"><i className="fab fa-whatsapp"></i></a>
                <a href="https://instagram.com/conectedu_org" className="btn instagram" target="_blank" rel="noopener noreferrer"><i className="fab fa-instagram"></i></a>
                <a href="mailto:conectedu.org@gmail.com?subject=Redirecionamento do Site&body=Escreva%20seu%20texto%20aqui!" className="btn gmail" target="_blank" rel="noopener noreferrer"><i className="fas fa-envelope"></i></a>
                <a href="https://youtube.com/@conectedu-q6f?si=-ry3RsRVXmXcdWVu" className="btn youtube" target="_blank" rel="noopener noreferrer"><i className="fab fa-youtube"></i></a>
            </div>

            <p>&copy; Todos os direitos reservados</p>
        </footer>
    );
}

export default footer;