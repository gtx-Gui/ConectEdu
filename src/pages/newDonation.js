import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './newDonation.css';

function NewDonation() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        categoria: '',
        marcaModelo: '',
        quantidade: 1,
        estado: '',
        especificacoes: ''
    });

    // Atualiza o estado do formulário
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Envia o formulário
    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            // Pega o usuário atual
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) {
                throw new Error('Você precisa estar logado para fazer uma doação');
            }

            // Insere o equipamento no banco
            const { error: insertError } = await supabase
                .from('equipamentos')
                .insert([
                    {
                        user_id: user.id,
                        categoria: formData.categoria,
                        marca_modelo: formData.marcaModelo,
                        quantidade: formData.quantidade,
                        estado: formData.estado,
                        especificacoes: formData.especificacoes,
                        status: 'pendente'
                    }
                ]);

            if (insertError) throw insertError;

            alert('Equipamento cadastrado com sucesso!');
            navigate('/userDashboard'); // Redireciona para o dashboard

        } catch (error) {
            console.error('Erro:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="new-donation-page">
            <button 
                onClick={() => navigate(-1)} 
                className="back-button"
            >
                ← Voltar
            </button>
            <div className="form-wrapper">
                <form onSubmit={handleSubmit}>
                    <div className="form-container">
                        <h2 className="form-title">Cadastro de Equipamento</h2>
                        
                        {error && (
                            <div className="form-error">
                                {error}
                            </div>
                        )}

                        <div className="form-content">
                            <label className="form-label" htmlFor="categoria">
                                Categoria do Equipamento:
                            </label>
                            <select 
                                id="categoria"
                                name="categoria"
                                value={formData.categoria}
                                onChange={handleChange}
                                required
                                className="form-select"
                            >
                                <option value="">Selecione a categoria</option>
                                <option value="computador">Computador</option>
                                <option value="teclado">Teclado</option>
                                <option value="mouse">Mouse</option>
                                <option value="projetor">Projetor de Vídeo</option>
                                <option value="impressora">Impressora</option>
                                <option value="notebook">Notebook</option>
                                <option value="monitor">Monitor</option>
                                <option value="tablet">Tablet</option>
                                <option value="smartphone">Smartphone</option>
                            </select>

                            <label className="form-label" htmlFor="marcaModelo">
                                Marca e Modelo:
                            </label>
                            <input 
                                type="text"
                                id="marcaModelo"
                                name="marcaModelo"
                                value={formData.marcaModelo}
                                onChange={handleChange}
                                placeholder="Ex: Dell Inspiron 15"
                                required 
                                className="form-input"
                            />

                            <label className="form-label" htmlFor="quantidade">Quantidade:</label>
                            <input 
                                type="number"
                                id="quantidade"
                                name="quantidade"
                                value={formData.quantidade}
                                onChange={handleChange}
                                min="1"
                                required 
                                className="form-input"
                            />

                            <label className="form-label" htmlFor="estado">Estado de conservação:</label>
                            <select 
                                id="estado"
                                name="estado"
                                value={formData.estado}
                                onChange={handleChange}
                                required
                                className="form-select"
                            >
                                <option value="">Selecione o estado</option>
                                <option value="novo">Novo</option>
                                <option value="excelente">Excelente (usado poucas vezes)</option>
                                <option value="bom">Bom (funciona perfeitamente)</option>
                                <option value="regular">Regular (necessita pequenos reparos)</option>
                            </select>

                            <label className="form-label" htmlFor="especificacoes">Especificações técnicas:</label>
                            <textarea
                                id="especificacoes"
                                name="especificacoes"
                                value={formData.especificacoes}
                                onChange={handleChange}
                                placeholder="Ex: Processador i5, 8GB RAM, 256GB SSD"
                                rows="3"
                                className="form-textarea"
                            />

                            <button 
                                type="submit" 
                                className="form-submit-button"
                                disabled={loading}
                            >
                                {loading ? 'Cadastrando...' : 'Cadastrar Equipamento'}
                            </button>
                        </div>
                    </div>   
                </form>
            </div>
        </div>
    );
}

export default NewDonation;