// src/pages/Donors.js
import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './Donors.css';  // Supondo que o arquivo se chame Donors.css


export default function Donors() {
  const [doadores, setDoadores] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDoadores();
  }, []);

  // Função para buscar dados da tabela DonorData
  async function fetchDoadores() {
    setLoading(true);
    const { data, error } = await supabase
      .from('DonorData')
      .select('CNPJ, Nome_da_empresa, Endereco, Cargo_do_responsavel, Email_de_contato, Telefone, Equipamentos');

    if (error) {
      console.error('Erro ao buscar doadores:', error.message);
    } else {
      setDoadores(data);
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 mt-50">
      <h2 className="h2Donors">Lista de Doadores   </h2>
      {loading ? (
        <p className="text-center">Carregando...</p>
      ) : (
        <div className="bg-white shadow rounded-lg p-4">
          <ul className="divide-y divide-gray-300">
            {doadores.length > 0 ? (
              doadores.map((doador, index) => (
                <li key={index} className="liDonors">
                  <p><strong>Empresa:</strong> {doador.Nome_da_empresa}</p>
                  <p><strong>CNPJ:</strong> {doador.CNPJ}</p>
                  <p><strong>Endereço:</strong> {doador.Endereco}</p>
                  <p><strong>Responsável:</strong> {doador.Cargo_do_responsavel}</p>
                  <p><strong>Email:</strong> {doador.Email_de_contato}</p>
                  <p><strong>Telefone:</strong> {doador.Telefone}</p>
                  <p><strong>Equipamentos:</strong> {doador.Equipamentos}</p>
                </li>
              ))
            ) : (
              <p className="text-center">Nenhum doador encontrado.</p>
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
