import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import './Register.css';

function Register() {
    const [formType, setFormType] = useState('');
    const [addressDetails, setAddressDetails] = useState({
        empresa: { visible: false, data: {} },
        instituicao: { visible: false, data: {} }
    });
    
    // Estado para os dados do formulário
    const [formData, setFormData] = useState({
        empresa: {
            nome: '',
            cnpj: '',
            cep: '',
            numero: '',
            complemento: '',
            email: '',
            telefone: '',
            senha: '',
            confirmarSenha: ''
        },
        instituicao: {
            nome: '',
            cnpj: '',
            cep: '',
            numero: '',
            complemento: '',
            email: '',
            telefone: '',
            senha: '',
            confirmarSenha: ''
        }
    });

    const handleInputChange = (type, field, value) => {
        setFormData(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [field]: value
            }
        }));
    };

    const handleRadioChange = (type) => {
        setFormType(type);
    };

    const handleCepBlur = async (e, type) => {
        const cep = e.target.value.replace(/\D/g, '');
        
        if (cep.length !== 8) {
            alert('CEP inválido, digite um CEP com 8 dígitos');
            return;
        }

        try {
            const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
            const data = await response.json();

            if (data.erro) {
                alert('CEP não encontrado!, verifique se foi digitado corretamente');
                return;
            }

            setAddressDetails(prev => ({
                ...prev,
                [type]: {
                    visible: true,
                    data: {
                        rua: data.logradouro,
                        bairro: data.bairro,
                        cidade: data.localidade,
                        estado: data.uf
                    }
                }
            }));
        } catch (error) {
            console.error('Erro:', error);
            alert('Erro ao buscar o CEP');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const currentForm = formData[formType];

        // Validações básicas
        if (!currentForm.email || !currentForm.senha) {
            alert('Por favor, preencha todos os campos obrigatórios');
            return;
        }

        if (currentForm.senha !== currentForm.confirmarSenha) {
            alert('As senhas não coincidem');
            return;
        }

        // Aqui você pode adicionar a lógica para enviar os dados para o backend
        console.log('Dados do formulário:', currentForm);
        // TODO: Implementar chamada API
    };

    return (
        <div className="register-container">
            <h1 className="register-title">Cadastro</h1>
            
            <form className="form-cadastro" onSubmit={handleSubmit}>
                <div className="form-group-TypeRegister">
                    <label className="tipo-cadastro-label">Selecione o tipo de cadastro:</label>
                    <div className="radio-options">
                        <div className="radio-option">
                            <input 
                                type="radio" 
                                id="empresa" 
                                name="tipo-cadastro" 
                                value="empresa"
                                onChange={() => handleRadioChange('empresa')}
                                required 
                            />
                            <label htmlFor="empresa" className="radio-label">
                                <span className="radio-custom"></span>
                                Empresa Doadora
                            </label>
                        </div>
                        <div className="radio-option">
                            <input 
                                type="radio" 
                                id="instituicao" 
                                name="tipo-cadastro" 
                                value="instituicaoDeEnsino"
                                onChange={() => handleRadioChange('instituicao')}
                                required 
                            />
                            <label htmlFor="instituicao" className="radio-label">
                                <span className="radio-custom"></span>
                                Instituição De Ensino
                            </label>
                        </div>
                    </div>
                </div>

                {/* Formulário para Empresa */}
                {formType === 'empresa' && (
                    <div className="form-empresa">
                        <div className="form-group">
                            <label htmlFor="nome-empresa">Nome da Empresa:</label>
                            <input 
                                type="text" 
                                id="nome-empresa" 
                                value={formData.empresa.nome}
                                onChange={(e) => handleInputChange('empresa', 'nome', e.target.value)}
                                placeholder="Nome da Empresa" 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="cnpj-empresa">CNPJ:</label>
                            <input 
                                type="text" 
                                id="cnpj-empresa" 
                                value={formData.empresa.cnpj}
                                onChange={(e) => handleInputChange('empresa', 'cnpj', e.target.value)}
                                placeholder="CNPJ" 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="cep-empresa">CEP:</label>
                            <input 
                                type="text" 
                                id="cep-empresa" 
                                value={formData.empresa.cep}
                                onChange={(e) => handleInputChange('empresa', 'cep', e.target.value)}
                                onBlur={(e) => handleCepBlur(e, 'empresa')}
                                placeholder="CEP" 
                                maxLength="8"
                                required 
                            />
                        </div>

                        {addressDetails.empresa.visible && (
                            <div className="endereco-detalhes">
                                <input type="text" value={addressDetails.empresa.data.rua} placeholder="Rua" disabled />
                                <input type="text" value={addressDetails.empresa.data.bairro} placeholder="Bairro" disabled />
                                <input type="text" value={addressDetails.empresa.data.cidade} placeholder="Cidade" disabled />
                                <input type="text" value={addressDetails.empresa.data.estado} placeholder="Estado" disabled />
                                <input 
                                    type="text" 
                                    value={formData.empresa.numero}
                                    onChange={(e) => handleInputChange('empresa', 'numero', e.target.value)}
                                    placeholder="Número" 
                                    required 
                                />
                                <input 
                                    type="text" 
                                    value={formData.empresa.complemento}
                                    onChange={(e) => handleInputChange('empresa', 'complemento', e.target.value)}
                                    placeholder="Complemento" 
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="email-empresa">Email:</label>
                            <input 
                                type="email" 
                                id="email-empresa" 
                                value={formData.empresa.email}
                                onChange={(e) => handleInputChange('empresa', 'email', e.target.value)}
                                placeholder="Email" 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="telefone-empresa">Telefone:</label>
                            <input 
                                type="tel" 
                                id="telefone-empresa" 
                                value={formData.empresa.telefone}
                                onChange={(e) => handleInputChange('empresa', 'telefone', e.target.value)}
                                placeholder="Telefone" 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="senha-empresa">Senha:</label>
                            <input 
                                type="password" 
                                id="senha-empresa" 
                                value={formData.empresa.senha}
                                onChange={(e) => handleInputChange('empresa', 'senha', e.target.value)}
                                placeholder="Senha" 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmar-senha-empresa">Confirmar Senha:</label>
                            <input 
                                type="password" 
                                id="confirmar-senha-empresa" 
                                value={formData.empresa.confirmarSenha}
                                onChange={(e) => handleInputChange('empresa', 'confirmarSenha', e.target.value)}
                                placeholder="Confirmar Senha" 
                                required 
                            />
                        </div>
                    </div>
                )}

                {/* Formulário para Instituição */}
                {formType === 'instituicao' && (
                    <div className="form-instituicao">
                        <div className="form-group">
                            <label htmlFor="nome-instituicao">Nome da Instituição:</label>
                            <input 
                                type="text" 
                                id="nome-instituicao" 
                                value={formData.instituicao.nome}
                                onChange={(e) => handleInputChange('instituicao', 'nome', e.target.value)}
                                placeholder="Nome da Instituição" 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="cnpj-instituicao">CNPJ:</label>
                            <input 
                                type="text" 
                                id="cnpj-instituicao" 
                                value={formData.instituicao.cnpj}
                                onChange={(e) => handleInputChange('instituicao', 'cnpj', e.target.value)}
                                placeholder="CNPJ" 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="cep-instituicao">CEP:</label>
                            <input 
                                type="text" 
                                id="cep-instituicao" 
                                value={formData.instituicao.cep}
                                onChange={(e) => handleInputChange('instituicao', 'cep', e.target.value)}
                                onBlur={(e) => handleCepBlur(e, 'instituicao')}
                                placeholder="CEP" 
                                maxLength="8"
                                required 
                            />
                        </div>

                        {addressDetails.instituicao.visible && (
                            <div className="endereco-detalhes">
                                <input type="text" value={addressDetails.instituicao.data.rua} placeholder="Rua" disabled />
                                <input type="text" value={addressDetails.instituicao.data.bairro} placeholder="Bairro" disabled />
                                <input type="text" value={addressDetails.instituicao.data.cidade} placeholder="Cidade" disabled />
                                <input type="text" value={addressDetails.instituicao.data.estado} placeholder="Estado" disabled />
                                <input 
                                    type="text" 
                                    value={formData.instituicao.numero}
                                    onChange={(e) => handleInputChange('instituicao', 'numero', e.target.value)}
                                    placeholder="Número" 
                                    required 
                                />
                                <input 
                                    type="text" 
                                    value={formData.instituicao.complemento}
                                    onChange={(e) => handleInputChange('instituicao', 'complemento', e.target.value)}
                                    placeholder="Complemento" 
                                />
                            </div>
                        )}

                        <div className="form-group">
                            <label htmlFor="email-instituicao">Email:</label>
                            <input 
                                type="email" 
                                id="email-instituicao" 
                                value={formData.instituicao.email}
                                onChange={(e) => handleInputChange('instituicao', 'email', e.target.value)}
                                placeholder="Email" 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="telefone-instituicao">Telefone:</label>
                            <input 
                                type="tel" 
                                id="telefone-instituicao" 
                                value={formData.instituicao.telefone}
                                onChange={(e) => handleInputChange('instituicao', 'telefone', e.target.value)}
                                placeholder="Telefone" 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="senha-instituicao">Senha:</label>
                            <input 
                                type="password" 
                                id="senha-instituicao" 
                                value={formData.instituicao.senha}
                                onChange={(e) => handleInputChange('instituicao', 'senha', e.target.value)}
                                placeholder="Senha" 
                                required 
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmar-senha-instituicao">Confirmar Senha:</label>
                            <input 
                                type="password" 
                                id="confirmar-senha-instituicao" 
                                value={formData.instituicao.confirmarSenha}
                                onChange={(e) => handleInputChange('instituicao', 'confirmarSenha', e.target.value)}
                                placeholder="Confirmar Senha" 
                                required 
                            />
                        </div>
                    </div>
                )}

                <div className="form-group">
                    <button type="submit" className="btn-cadastro"><b>Cadastrar</b></button>
                </div>

                <div className="links">
                    <p>Já tem uma conta? <Link to="/login">Faça login</Link></p>
                </div>
            </form>
        </div>
    );
}

export default Register;