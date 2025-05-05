// src/pages/userDashboard.js
import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './userDashboard.css'; 
import { motion } from 'framer-motion';

function UserDashboard() {
    const logout = () => {
        window.location.href = "/"; // Redirecionar para a página inicial
    };

    const newDonation = () => {
        console.log("Nova doação");
        window.location.href = "/newDonation";
    
    };

    const requestEquipment = () => {
        console.log("Solicitar equipamento");
        window.location.href = "/requestEquipment";
    };

    const generateReport = () => {
        console.log("Gerar relatório");
         window.location.href = "/generateReport";
         // Redireciona para a página GeradorDocs.html
    };

    return (
        <div className="bg-dark">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom">
                <div className="container">

                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
                        <span className="navbar-toggler-icon"></span>
                   </button>
                    <div className="collapse navbar-collapse justify-content-end" id="navbarNav">
                        <ul className="navbar-nav ms-auto">
                            <li className="nav-item">
                                <a className="nav-link" href="/">Home</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/">Doar</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/">Solicitar</a>
                            </li>
                            <li className="nav-item">
                                <a className="nav-link" href="/about">Sobre</a>
                            </li>
                            <li className="nav-item d-flex align-items-center">
                                <button className="btn btn-danger btn-sm" onClick={logout}>Sair</button>
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <div className="container py-5">
                <h1 className="text-center text-light mb-5">Bem-vindo ao seu Painel</h1>

                <div className="row g-4 mb-5">
                    <div className="col-md-3">
                        <div className="dashboard-card p-4 text-center text-light">
                            <div className="stat-number">12</div>
                            <p>Doações Realizadas</p>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="dashboard-card p-4 text-center text-light">
                            <div className="stat-number">5</div>
                            <p>Solicitações Ativas</p>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="dashboard-card p-4 text-center text-light">
                            <div className="stat-number">3</div>
                            <p>Equipamentos Doados</p>
                        </div>
                    </div>
                    <div className="col-md-3">
                        <div className="dashboard-card p-4 text-center text-light">
                            <div className="stat-number">8</div>
                            <p>Instituições Ajudadas</p>
                        </div>
                    </div>
                </div>

                <div className="row g-4">
                    <div className="col-md-6">
                        <div className="dashboard-card p-4 text-light">
                            <h3 className="mb-4"><i className="fas fa-history me-2"></i>Atividades Recentes</h3>
                            <div className="timeline">
                                <div className="activity-item mb-3 pb-3 border-bottom border-secondary">
                                    <p className="mb-1 text-light"><strong>Doação Realizada</strong></p>
                                    <p className="text-light mb-0">3 notebooks doados para Escola Municipal</p>
                                    <small className="text-light">Há 2 dias</small>
                                </div>
                                <div className="activity-item mb-3 pb-3 border-bottom border-secondary">
                                    <p className="mb-1 text-light"><strong>Solicitação Aprovada</strong></p>
                                    <p className="text-light mb-0">Sua solicitação de tablets foi aprovada</p>
                                    <small className="text-light">Há 4 dias</small>
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-md-6">
                        <div className="dashboard-card-btns p-4 text-light">
                            <h3 className="mb-4"><i className="fas fa-tasks me-2"></i>Ações Rápidas</h3>
                            <div className="d-grid gap-3">
                                <button onClick={newDonation} className="btn btn-success btn-lg">
                                    <i className="fas fa-hand-holding-heart me-2"></i>Nova Doação
                                </button>
                                <button onClick={requestEquipment} className="btn btn-info btn-lg">
                                    <i className="fas fa-laptop me-2"></i>Solicitar Equipamento
                                </button>
                                <button onClick={generateReport} className="btn btn-warning btn-lg">
                                    <i className="fas fa-file-alt me-2"></i>Gerar Relatório
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            
        </div>
    );
}

export default UserDashboard;