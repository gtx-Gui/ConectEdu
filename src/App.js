// src/App.js
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';
import './variables.css';
import './App.css';

import Header from './components/header.jsx';
import HeroSection from './components/heroSection.jsx';
import ImpactSection from './components/impactSection.jsx';
import HowItWorks from './components/how-it-works.jsx';
import DocumentationSection from './components/documentationSection.jsx';
import PartnerSection from './components/partnerSection.jsx';
import Footer from './components/footer.jsx';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login.jsx';
import About from './pages/About.jsx';
import Register from './pages/Register.jsx';
import UserDashboard from './pages/userDashboard.jsx';
import GenerateReport from './pages/generateReport.jsx';
import ManualReportPreview from './components/ManualReportPreview.js';
import HubRecycling from './pages/hubRecycling.jsx';
import Support from './pages/Support.jsx';
import AboutSystem from './pages/aboutSystem.jsx';
import Documentation from './pages/Documentation.jsx';
import ForgotPassword from './pages/ForgotPassword.jsx';
import ResetPassword from './pages/ResetPassword.jsx';

// Componente para a página inicial
function Home() {
  return (
    <>
      <HeroSection />
      <ImpactSection />
      <HowItWorks />
      <DocumentationSection />
      {/* <PartnerSection /> */}
    </>
  );
}

function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        <Routes>
          {/* Rotas Públicas */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/support" element={<Support />} />
          <Route path="/aboutsystem" element={<AboutSystem />} />
          <Route path="/documentation" element={<Documentation />} />
          <Route path="/hubRecycling" element={<HubRecycling />} />

          {/* Rotas Protegidas */}
          <Route
            path="/userdashboard"
            element={
              <ProtectedRoute>
                <UserDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/generateReport"
            element={
              <ProtectedRoute>
                <GenerateReport />
              </ProtectedRoute>
            }
          />
          <Route
            path="/manualReportPreview"
            element={
              <ProtectedRoute>
                <ManualReportPreview />
              </ProtectedRoute>
            }
          />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
