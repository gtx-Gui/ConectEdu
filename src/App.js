// src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import './variables.css';
import './App.css';

import Header from './components/header';
import HeroSection from './components/heroSection';
import ImpactSection from './components/impactSection';
import HowItWorks from './components/how-it-works';
import DocumentationSection from './components/documentationSection';
import PartnerSection from './components/partnerSection';
import Footer from './components/footer';

import About from './pages/About.js';
import Register from './pages/register.js';
import Donors from './pages/Donors.js'; // ✅ Importe a nova página

// Componente para a página inicial
function Home() {
  return (
    <>
      <HeroSection />
      <ImpactSection />
      <HowItWorks />
      <DocumentationSection />
      <PartnerSection />
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/donors" element={<Donors />} /> {/* ✅ Nova rota */}
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
