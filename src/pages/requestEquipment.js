import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useNavigate } from 'react-router-dom';
import './requestEquipment.css';

function RequestEquipment() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        categoria: '',
        quantidade: 1,
        justificativa: '',
        prazoNecessario: '',
        detalhesAdicionais: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const { data: { user } } = await supabase.auth.getUser();
            
            if (!user) {
                throw new Error('Você precisa estar logado para solicitar equipamentos');
            }

            const { error: insertError } = await supabase
                .from('solicitacoes')
                .insert([
                    {
                        user_id: user.id,
                        categoria: formData.categoria,
                        quantidade: formData.quantidade,
                        justificativa: formData.justificativa,
                        prazo_necessario: formData.prazoNecessario,
                        detalhes_adicionais: formData.detalhesAdicionais,
                        status: 'pendente'
                    }
                ]);

            if (insertError) throw insertError;

            alert('Solicitação enviada com sucesso!');
            navigate('/userDashboard');

        } catch (error) {
            console.error('Erro:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="request-equipment-page">
            <button 
                onClick={() => navigate(-1)} 
                className="back-button"
            >
                ← Voltar
            </button>
            <div className="form-wrapper">
                <form onSubmit={handleSubmit}>
                    <div className="form-container">
                        <h2 className="form-title">Solicitar Equipamentos</h2>
                        
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
                                <option value="notebook">Notebook</option>
                                <option value="tablet">Tablet</option>
                                <option value="smartphone">Smartphone</option>
                                <option value="impressora">Impressora</option>
                                <option value="projetor">Projetor</option>
                                <option value="monitor">Monitor</option>
                                <option value="perifericos">Periféricos (Mouse, Teclado, etc)</option>
                            </select>

                            <label className="form-label" htmlFor="quantidade">
                                Quantidade Necessária:
                            </label>
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

                            <label className="form-label" htmlFor="justificativa">
                                Justificativa da Solicitação:
                            </label>
                            <textarea
                                id="justificativa"
                                name="justificativa"
                                value={formData.justificativa}
                                onChange={handleChange}
                                placeholder="Explique por que você necessita deste equipamento"
                                required
                                className="form-textarea"
                                rows="4"
                            />

                            <label className="form-label" htmlFor="prazoNecessario">
                                Prazo Necessário:
                            </label>
                            <input 
                                type="date"
                                id="prazoNecessario"
                                name="prazoNecessario"
                                value={formData.prazoNecessario}
                                onChange={handleChange}
                                required
                                className="form-input"
                                min={new Date().toISOString().split('T')[0]}
                            />

                            <label className="form-label" htmlFor="detalhesAdicionais">
                                Detalhes Adicionais:
                            </label>
                            <textarea
                                id="detalhesAdicionais"
                                name="detalhesAdicionais"
                                value={formData.detalhesAdicionais}
                                onChange={handleChange}
                                placeholder="Especificações desejadas, condições de uso aceitáveis, etc."
                                className="form-textarea"
                                rows="3"
                            />

                            <button 
                                type="submit" 
                                className="form-submit-button"
                                disabled={loading}
                            >
                                {loading ? 'Enviando...' : 'Enviar Solicitação'}
                            </button>
                        </div>
                    </div>   
                </form>
            </div>
        </div>
    );
}

export default RequestEquipment;
