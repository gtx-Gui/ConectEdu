import React from 'react';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <Logo />
        <textIndex />
        <nav className="nav-links">
          <ul>
            <li><a href="/">Home</a></li>
            <li><a href="/register">Cadastro</a></li>
            <li><a href="/login">Entrar</a></li>
            <li><a href="/about">Sobre</a></li>
            <li className="dropdown">
              <a href="#" onClick={(e) => toggleDropdown(e, 'plataformaDropdown')}>
                Plataforma
              </a>
              <ul className="dropdown-content" id="plataformaDropdown">
                <li><a href="/services#equipamentos">Doar Equipamentos</a></li>
                <li><a href="/services#manutencao">Pedir Equipamentos</a></li>
                <li><a href="/services#logistica">Logística</a></li>
                <li><a href="/services#remanufatura">Remanufatura</a></li>
                <li><a href="/services#reciclagem">Reciclagem</a></li>
                <li><a href="/services#suporte">Suporte</a></li>
              </ul>
            </li>
          </ul>
        </nav>
      </header>
      <main>
        <section className="hero">
          <h1>ConectEdu</h1>
          <p>Conectando escolas ao futuro digital</p>
        </section>
      </main>
      <footer>
        <div className="social-buttons">
          <a href="https://instagram.com/conectedu_org" className="btn instagram" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-instagram"></i>
          </a>
          <a href="mailto:conectedu.org@gmail.com" className="btn gmail" target="_blank" rel="noopener noreferrer">
            <i className="fas fa-envelope"></i>
          </a>
          <a href="https://youtube.com/@conectedu-q6f" className="btn youtube" target="_blank" rel="noopener noreferrer">
            <i className="fab fa-youtube"></i>
          </a>
        </div>
        <p>&copy; 2023 ConectEdu - Todos os direitos reservados</p>
      </footer>
    </div>
  );
}
// Função para alternar o menu dropdown
function toggleDropdown(event, dropdownId) {
  event.preventDefault();
  const dropdown = document.getElementById(dropdownId);
  const allDropdowns = document.querySelectorAll('.dropdown-content');
  
  // Fecha todos os outros dropdowns
  allDropdowns.forEach(d => {
    if (d.id !== dropdownId) {
      d.classList.remove('show');
    }
  });
  
  // Alterna o dropdown atual
  dropdown.classList.toggle('show');
}

// Fecha o dropdown quando clicar fora
document.addEventListener('click', function(event) {
  const dropdowns = document.querySelectorAll('.dropdown-content');
  dropdowns.forEach(dropdown => {
    if (!event.target.closest('.dropdown') && dropdown.classList.contains('show')) {
      dropdown.classList.remove('show');
    }
  });
});

export default App;
// Função para carregar escolas próximas
function carregarEscolasProximas() {
  if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(function(position) {
      const lat = position.coords.latitude;
      const long = position.coords.longitude;
      
      // Aqui você faria uma chamada à API para buscar escolas próximas
      // usando as coordenadas lat e long
      
      const escolasDropdown = document.getElementById('escolasDropdown');
      escolasDropdown.innerHTML = '<li><p style="color: white; padding: 12px 16px;">Buscando escolas próximas...</p></li>';
      
      // Simular chamada à API
      setTimeout(() => {
        buscarEscolasProximas(lat, long);
      }, 1000);
    });
  }
}

// Função para buscar escolas próximas (simulada)
function buscarEscolasProximas(lat, long) {
  // Aqui você implementaria a chamada real à API
  const escolasSimuladas = [
    'Escola Municipal João da Silva',
    'Escola Estadual Maria Santos', 
    'Colégio Dom Pedro',
    'Escola Técnica José Alves'
  ];
  
  const escolasDropdown = document.getElementById('escolasDropdown');
  escolasDropdown.innerHTML = escolasSimuladas
    .map(escola => `<li><a href="#">${escola}</a></li>`)
    .join('');
}

// Carregar escolas quando a página carregar
document.addEventListener('DOMContentLoaded', carregarEscolasProximas);