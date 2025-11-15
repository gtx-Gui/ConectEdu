// src/pages/userDashboard.js
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '@fortawesome/fontawesome-free/css/all.min.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './userDashboard.css'; 
import { motion } from 'framer-motion';
import { supabase } from '../supabaseClient'; // ajuste o caminho se necessário
import DocumentHistory from '../components/DocumentHistory';
import UserProfile from '../components/UserProfile';
import ChangePassword from '../components/ChangePassword';

function UserDashboard() {
    const navigate = useNavigate();

    const logout = async () => {
        await supabase.auth.signOut();
        navigate('/login', { replace: true });
    };

    const newDonation = () => {
        console.log("Nova doação");
        navigate('/newDonation');
    };

    const requestEquipment = () => {
        console.log("Solicitar equipamento");
        navigate('/requestEquipment');
    };

    const generateReport = () => {
        console.log("Gerar Documentos");
        navigate('/generateReport');
    };

    // Estados para pesquisa de escolas
    const [searchTerm, setSearchTerm] = useState('');
    const [schools, setSchools] = useState([]);
    const [filteredSchools, setFilteredSchools] = useState([]);

    // Buscar escolas (usuários do tipo 'instituicao') ao carregar o componente
    useEffect(() => {
        async function fetchSchools() {
            // Query otimizada: buscar apenas campos necessários para a pesquisa
            const { data, error } = await supabase
                .from('users')
                .select('id, nome, cidade, estado')
                .eq('tipo', 'instituicao')
                .order('nome');
            if (!error) setSchools(data || []);
        }
        fetchSchools();
    }, []);

    // Filtrar escolas conforme o termo de busca
    useEffect(() => {
        if (searchTerm.trim() === '') {
            setFilteredSchools([]);
        } else {
            setFilteredSchools(
                schools.filter(school =>
                    school.nome.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        }
    }, [searchTerm, schools]);

    return (
        <div className="bg-dark">
            <nav className="navbar navbar-expand-lg navbar-dark bg-dark border-bottom">
                <div className="container d-flex justify-content-end">
                    <button className="btn btn-danger btn-sm" onClick={logout}>Sair</button>
                </div>
            </nav>

            <div className="container py-5">
                <h1 className="text-center text-light mb-5">Bem-vindo ao seu Painel</h1>

                {/* Perfil e Configurações */}
                <div className="row g-4 mb-5">
                    <div className="col-md-8">
                        <UserProfile />
                    </div>
                    <div className="col-md-4">
                        <ChangePassword />
                    </div>
                </div>

                {/* ÁREA DE PESQUISA DE ESCOLAS */}
                <div className="mb-5">
                    <h3 className="text-light mb-3">Pesquisar Instituições de Ensino Cadastradas</h3>
                    <input
                        type="text"
                        className="form-control mb-2"
                        placeholder="Digite o nome da instituição..."
                        value={searchTerm}
                        onChange={e => setSearchTerm(e.target.value)}
                    />
                    {searchTerm && (
                        <div className="list-group">
                            {filteredSchools.length > 0 ? (
                                filteredSchools.map(school => (
                                    <div key={school.id} className="list-group-item">
                                        <strong>{school.nome}</strong>
                                        {/* Adapte para exibir outros campos se desejar */}
                                        {school.cidade && school.estado && (
                                            <div style={{ fontSize: '0.9em', color: '#555' }}>
                                                {school.cidade} - {school.estado}
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <div className="list-group-item">Nenhuma instituição encontrada.</div>
                            )}
                        </div>
                    )}
                </div>

                <div className="row g-4 mb-5">
                    <div className="col-12">
                        <div className="dashboard-card p-4 text-light">
                            <h3 className="mb-4 text-center"><i className="fas fa-route me-2"></i>Como funciona o processo de doação?</h3>
                            <ol className="process-flow-list">
                                <li><b>Cadastro no site:</b> Crie sua conta gratuitamente para acessar o painel do usuário.</li>
                                <li><b>Gerar os documentos:</b> No painel do usuário, clique em "Gerar documentos" e preencha as informações necessárias para criar os documentos de doação.</li>
                                <li><b>Entregar e assinar:</b> Leve os documentos gerados até a escola selecionada e realize a assinatura presencialmente.</li>
                                <li><b>Solicitar recibo de doação:</b> Caso necessário, solicite o recibo de doação diretamente na escola. O recibo também pode ser gerado no site da ConectEdu pelo painel de usuário das instituições públicas.</li>
                            </ol>
                        </div>
                    </div>
                </div>

                {/* Ações Rápidas - Centralizado */}
                <div className="row g-4 mb-5">
                    <div className="col-12">
                        <div className="dashboard-card-btns p-4 text-light">
                            <h3 className="mb-4 text-center"><i className="fas fa-tasks me-2"></i>Ações Rápidas</h3>
                            <div className="d-grid gap-3" style={{ maxWidth: '400px', margin: '0 auto' }}>
                                <button onClick={generateReport} className="btn btn-success btn-lg">
                                    <i className="fas fa-file-alt me-2"></i>Gerar Documentos
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Histórico de Documentos */}
                <div className="row g-4">
                    <div className="col-12">
                        <DocumentHistory />
                    </div>
                </div>
            </div>

            
        </div>
    );
}

export default UserDashboard;