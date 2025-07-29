import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import './Register.css';

function Register() {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [formType, setFormType] = useState('');
    const [addressDetails, setAddressDetails] = useState({
        empresa: { visible: false, data: {} },
        instituicao: { visible: false, data: {} },
        pessoaFisica: { visible: false, data: {} }
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
        },
        pessoaFisica: {
            nome: '',
            cpf: '',
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            const response = await fetch('http://localhost:5000/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  tipo: formType,
                  nome: formData[formType].nome,
                  cnpj: formData[formType].cnpj || '',
                  cpf: formData[formType].cpf || '',
                  cep: formData[formType].cep,
                  numero: formData[formType].numero || '',
                  complemento: formData[formType].complemento || '',
                  email: formData[formType].email,
                  telefone: formData[formType].telefone || '',
                  rua: addressDetails[formType]?.data?.rua || '',
                  bairro: addressDetails[formType]?.data?.bairro || '',
                  cidade: addressDetails[formType]?.data?.cidade || '',
                  estado: addressDetails[formType]?.data?.estado || '',
                  senha: formData[formType].senha // <-- ADICIONE ESTA LINHA
                }),
              });

            const data = await response.json();
            console.log('Resposta do backend:', data); // <-- adicione isso
            if (!response.ok) throw new Error(data.message || 'Erro no cadastro');

            alert(data.message);
            navigate('/login');
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
        <div className="register-container">
            <h1 className="register-title">Cadastro</h1>
            
            {error && (
                    <div className="register-error">
                    {error}
                </div>
            )}

                <form className="register-form" onSubmit={handleSubmit}>
                    <div className="register-type-group">
                        <label className="register-type-label">Selecione o tipo de cadastro:</label>
                        <div className="register-radio-options">
                            <div className="register-radio-option">
                                <input 
                                    type="radio" 
                                    id="empresa" 
                                    name="tipo-cadastro" 
                                    value="empresa"
                                    onChange={() => handleRadioChange('empresa')}
                                    required 
                                    className="register-radio-input"
                                />
                                <label htmlFor="empresa" className="register-radio-label">
                                    <span className="register-radio-custom"></span>
                                    Empresa Doadora
                                </label>
                            </div>
                            <div className="register-radio-option">
                                <input 
                                    type="radio" 
                                    id="instituicao" 
                                    name="tipo-cadastro" 
                                    value="instituicaoDeEnsino"
                                    onChange={() => handleRadioChange('instituicao')}
                                    required 
                                    className="register-radio-input"
                                />
                                <label htmlFor="instituicao" className="register-radio-label">
                                    <span className="register-radio-custom"></span>
                                    Instituição De Ensino
                                </label>
                            </div>
                            <div className="register-radio-option">
                                <input 
                                    type="radio" 
                                    id="pessoaFisica" 
                                    name="tipo-cadastro" 
                                    value="pessoaFisica"
                                    onChange={() => handleRadioChange('pessoaFisica')}
                                    required 
                                    className="register-radio-input"
                                />
                                <label htmlFor="pessoaFisica" className="register-radio-label">
                                    <span className="register-radio-custom"></span>
                                    Pessoa Física
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Formulário para Empresa */}
                    {formType === 'empresa' && (
                        <div className="register-form-empresa">
                            <div className="register-form-group">
                                <label className="register-label" htmlFor="nome-empresa">Nome da Empresa:</label>
                                <input 
                                    type="text" 
                                    id="nome-empresa" 
                                    className="register-input"
                                    value={formData.empresa.nome}
                                    onChange={(e) => handleInputChange('empresa', 'nome', e.target.value)}
                                    placeholder="Nome da Empresa" 
                                    required 
                                />
                            </div>

                            <div className="register-form-group">
                                <label className="register-label" htmlFor="cnpj-empresa">CNPJ:</label>
                                <input 
                                    type="text" 
                                    id="cnpj-empresa" 
                                    className="register-input"
                                    value={formData.empresa.cnpj}
                                    onChange={(e) => handleInputChange('empresa', 'cnpj', e.target.value)}
                                    placeholder="CNPJ" 
                                    required 
                                />
                            </div>

                            <div className="register-form-group">
                                <label className="register-label" htmlFor="cep-empresa">CEP:</label>
                                <input 
                                    type="text" 
                                    id="cep-empresa" 
                                    className="register-input"
                                    value={formData.empresa.cep}
                                    onChange={(e) => handleInputChange('empresa', 'cep', e.target.value)}
                                    onBlur={(e) => handleCepBlur(e, 'empresa')}
                                    placeholder="CEP" 
                                    maxLength="8"
                                    required 
                                />
                            </div>

                            {addressDetails.empresa.visible && (
                                <div className="register-address-details">
                                    <input type="text" value={addressDetails.empresa.data.rua} placeholder="Rua" disabled className="register-address-input" />
                                    <input type="text" value={addressDetails.empresa.data.bairro} placeholder="Bairro" disabled className="register-address-input" />
                                    <input type="text" value={addressDetails.empresa.data.cidade} placeholder="Cidade" disabled className="register-address-input" />
                                    <input type="text" value={addressDetails.empresa.data.estado} placeholder="Estado" disabled className="register-address-input" />
                                    <input 
                                        type="text" 
                                        className="register-input"
                                        value={formData.empresa.numero}
                                        onChange={(e) => handleInputChange('empresa', 'numero', e.target.value)}
                                        placeholder="Número" 
                                        required 
                                    />
                                    <input 
                                        type="text" 
                                        className="register-input"
                                        value={formData.empresa.complemento}
                                        onChange={(e) => handleInputChange('empresa', 'complemento', e.target.value)}
                                        placeholder="Complemento" 
                                    />
                                </div>
                            )}

                            <div className="register-form-group">
                                <label className="register-label" htmlFor="email-empresa">Email:</label>
                                <input 
                                    type="email" 
                                    id="email-empresa" 
                                    className="register-input"
                                    value={formData.empresa.email}
                                    onChange={(e) => handleInputChange('empresa', 'email', e.target.value)}
                                    placeholder="Email" 
                                    required 
                                />
                            </div>

                            <div className="register-form-group">
                                <label className="register-label" htmlFor="telefone-empresa">Telefone:</label>
                                <input 
                                    type="tel" 
                                    id="telefone-empresa" 
                                    className="register-input"
                                    value={formData.empresa.telefone}
                                    onChange={(e) => handleInputChange('empresa', 'telefone', e.target.value)}
                                    placeholder="Telefone" 
                                    required 
                                />
                            </div>

                            <div className="register-form-group">
                                <label className="register-label" htmlFor="senha-empresa">Senha:</label>
                                <input 
                                    type="password" 
                                    id="senha-empresa" 
                                    className="register-input"
                                    value={formData.empresa.senha}
                                    onChange={(e) => handleInputChange('empresa', 'senha', e.target.value)}
                                    placeholder="Senha" 
                                    required 
                                />
                            </div>

                            <div className="register-form-group">
                                <label className="register-label" htmlFor="confirmar-senha-empresa">Confirmar Senha:</label>
                                <input 
                                    type="password" 
                                    id="confirmar-senha-empresa" 
                                    className="register-input"
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
                        <div className="register-form-instituicao">
                            <div className="register-form-group">
                                <label className="register-label" htmlFor="nome-instituicao">Nome da Instituição:</label>
                                <input 
                                    type="text" 
                                    id="nome-instituicao" 
                                    className="register-input"
                                    value={formData.instituicao.nome}
                                    onChange={(e) => handleInputChange('instituicao', 'nome', e.target.value)}
                                    placeholder="Nome da Instituição" 
                                    required 
                                />
                            </div>

                            <div className="register-form-group">
                                <label className="register-label" htmlFor="cnpj-instituicao">CNPJ:</label>
                                <input 
                                    type="text" 
                                    id="cnpj-instituicao" 
                                    className="register-input"
                                    value={formData.instituicao.cnpj}
                                    onChange={(e) => handleInputChange('instituicao', 'cnpj', e.target.value)}
                                    placeholder="CNPJ" 
                                    required 
                                />
                            </div>

                            <div className="register-form-group">
                                <label className="register-label" htmlFor="cep-instituicao">CEP:</label>
                                <input 
                                    type="text" 
                                    id="cep-instituicao" 
                                    className="register-input"
                                    value={formData.instituicao.cep}
                                    onChange={(e) => handleInputChange('instituicao', 'cep', e.target.value)}
                                    onBlur={(e) => handleCepBlur(e, 'instituicao')}
                                    placeholder="CEP" 
                                    maxLength="8"
                                    required 
                                />
                            </div>

                            {addressDetails.instituicao.visible && (
                                <div className="register-address-details">
                                    <input type="text" value={addressDetails.instituicao.data.rua} placeholder="Rua" disabled className="register-address-input" />
                                    <input type="text" value={addressDetails.instituicao.data.bairro} placeholder="Bairro" disabled className="register-address-input" />
                                    <input type="text" value={addressDetails.instituicao.data.cidade} placeholder="Cidade" disabled className="register-address-input" />
                                    <input type="text" value={addressDetails.instituicao.data.estado} placeholder="Estado" disabled className="register-address-input" />
                                    <input 
                                        type="text" 
                                        className="register-input"
                                        value={formData.instituicao.numero}
                                        onChange={(e) => handleInputChange('instituicao', 'numero', e.target.value)}
                                        placeholder="Número" 
                                        required 
                                    />
                                    <input 
                                        type="text" 
                                        className="register-input"
                                        value={formData.instituicao.complemento}
                                        onChange={(e) => handleInputChange('instituicao', 'complemento', e.target.value)}
                                        placeholder="Complemento" 
                                    />
                                </div>
                            )}

                            <div className="register-form-group">
                                <label className="register-label" htmlFor="email-instituicao">Email:</label>
                                <input 
                                    type="email" 
                                    id="email-instituicao" 
                                    className="register-input"
                                    value={formData.instituicao.email}
                                    onChange={(e) => handleInputChange('instituicao', 'email', e.target.value)}
                                    placeholder="Email" 
                                    required 
                                />
                            </div>

                            <div className="register-form-group">
                                <label className="register-label" htmlFor="telefone-instituicao">Telefone:</label>
                                <input 
                                    type="tel" 
                                    id="telefone-instituicao" 
                                    className="register-input"
                                    value={formData.instituicao.telefone}
                                    onChange={(e) => handleInputChange('instituicao', 'telefone', e.target.value)}
                                    placeholder="Telefone" 
                                    required 
                                />
                            </div>

                            <div className="register-form-group">
                                <label className="register-label" htmlFor="senha-instituicao">Senha:</label>
                                <input 
                                    type="password" 
                                    id="senha-instituicao" 
                                    className="register-input"
                                    value={formData.instituicao.senha}
                                    onChange={(e) => handleInputChange('instituicao', 'senha', e.target.value)}
                                    placeholder="Senha" 
                                    required 
                                />
                            </div>

                            <div className="register-form-group">
                                <label className="register-label" htmlFor="confirmar-senha-instituicao">Confirmar Senha:</label>
                                <input 
                                    type="password" 
                                    id="confirmar-senha-instituicao" 
                                    className="register-input"
                                    value={formData.instituicao.confirmarSenha}
                                    onChange={(e) => handleInputChange('instituicao', 'confirmarSenha', e.target.value)}
                                    placeholder="Confirmar Senha" 
                                    required 
                                />
                            </div>
                        </div>
                    )}

                    {/* Novo formulário para Pessoa Física */}
                    {formType === 'pessoaFisica' && (
                        <div className="register-form-pessoa-fisica">
                            <div className="register-form-group">
                                <label className="register-label" htmlFor="nome-pessoa-fisica">Nome Completo:</label>
                                <input 
                                    type="text" 
                                    id="nome-pessoa-fisica" 
                                    className="register-input"
                                    value={formData.pessoaFisica.nome}
                                    onChange={(e) => handleInputChange('pessoaFisica', 'nome', e.target.value)}
                                    placeholder="Nome Completo" 
                                    required 
                                />
                            </div>

                            <div className="register-form-group">
                                <label className="register-label" htmlFor="cpf-pessoa-fisica">CPF:</label>
                                <input 
                                    type="text" 
                                    id="cpf-pessoa-fisica" 
                                    className="register-input"
                                    value={formData.pessoaFisica.cpf}
                                    onChange={(e) => handleInputChange('pessoaFisica', 'cpf', e.target.value)}
                                    placeholder="CPF" 
                                    required 
                                />
                            </div>

                            <div className="register-form-group">
                                <label className="register-label" htmlFor="cep-pessoa-fisica">CEP:</label>
                                <input 
                                    type="text" 
                                    id="cep-pessoa-fisica" 
                                    className="register-input"
                                    value={formData.pessoaFisica.cep}
                                    onChange={(e) => handleInputChange('pessoaFisica', 'cep', e.target.value)}
                                    onBlur={(e) => handleCepBlur(e, 'pessoaFisica')}
                                    placeholder="CEP" 
                                    maxLength="8"
                                    required 
                                />
                            </div>

                            {addressDetails.pessoaFisica.visible && (
                                <div className="register-address-details">
                                    <input type="text" value={addressDetails.pessoaFisica.data.rua} placeholder="Rua" disabled className="register-address-input" />
                                    <input type="text" value={addressDetails.pessoaFisica.data.bairro} placeholder="Bairro" disabled className="register-address-input" />
                                    <input type="text" value={addressDetails.pessoaFisica.data.cidade} placeholder="Cidade" disabled className="register-address-input" />
                                    <input type="text" value={addressDetails.pessoaFisica.data.estado} placeholder="Estado" disabled className="register-address-input" />
                                    <input 
                                        type="text" 
                                        className="register-input"
                                        value={formData.pessoaFisica.numero}
                                        onChange={(e) => handleInputChange('pessoaFisica', 'numero', e.target.value)}
                                        placeholder="Número" 
                                        required 
                                    />
                                    <input 
                                        type="text" 
                                        className="register-input"
                                        value={formData.pessoaFisica.complemento}
                                        onChange={(e) => handleInputChange('pessoaFisica', 'complemento', e.target.value)}
                                        placeholder="Complemento" 
                                    />
                                </div>
                            )}

                            <div className="register-form-group">
                                <label className="register-label" htmlFor="email-pessoa-fisica">Email:</label>
                                <input 
                                    type="email" 
                                    id="email-pessoa-fisica" 
                                    className="register-input"
                                    value={formData.pessoaFisica.email}
                                    onChange={(e) => handleInputChange('pessoaFisica', 'email', e.target.value)}
                                    placeholder="Email" 
                                    required 
                                />
                            </div>

                            <div className="register-form-group">
                                <label className="register-label" htmlFor="telefone-pessoa-fisica">Telefone:</label>
                                <input 
                                    type="tel" 
                                    id="telefone-pessoa-fisica" 
                                    className="register-input"
                                    value={formData.pessoaFisica.telefone}
                                    onChange={(e) => handleInputChange('pessoaFisica', 'telefone', e.target.value)}
                                    placeholder="Telefone" 
                                    required 
                                />
                            </div>

                            <div className="register-form-group">
                                <label className="register-label" htmlFor="senha-pessoa-fisica">Senha:</label>
                                <input 
                                    type="password" 
                                    id="senha-pessoa-fisica" 
                                    className="register-input"
                                    value={formData.pessoaFisica.senha}
                                    onChange={(e) => handleInputChange('pessoaFisica', 'senha', e.target.value)}
                                    placeholder="Senha" 
                                    required 
                                />
                            </div>

                            <div className="register-form-group">
                                <label className="register-label" htmlFor="confirmar-senha-pessoa-fisica">Confirmar Senha:</label>
                                <input 
                                    type="password" 
                                    id="confirmar-senha-pessoa-fisica" 
                                    className="register-input"
                                    value={formData.pessoaFisica.confirmarSenha}
                                    onChange={(e) => handleInputChange('pessoaFisica', 'confirmarSenha', e.target.value)}
                                    placeholder="Confirmar Senha" 
                                    required 
                                />
                            </div>
                        </div>
                    )}

                    <div className="register-form-group">
                        <button 
                            type="submit" 
                            className="register-submit-btn" 
                            disabled={loading}
                        >
                            <b>{loading ? 'Cadastrando...' : 'Cadastrar'}</b>
                        </button>
                    </div>

                    <div className="register-links">
                        <p>Já tem uma conta? <Link to="/login">Faça login</Link></p>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default Register;