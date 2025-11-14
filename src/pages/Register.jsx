import React, { useState, useEffect } from 'react';
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

    // Função para aplicar máscaras
    const applyMask = (value, mask) => {
        let result = '';
        let valueIndex = 0;
        
        for (let i = 0; i < mask.length && valueIndex < value.length; i++) {
            if (mask[i] === '#') {
                result += value[valueIndex];
                valueIndex++;
            } else {
                result += mask[i];
            }
        }
        
        return result;
    };

    // Máscaras
    const masks = {
        cep: (value) => applyMask(value.replace(/\D/g, ''), '#####-###'),
        cpf: (value) => applyMask(value.replace(/\D/g, ''), '###.###.###-##'),
        cnpj: (value) => applyMask(value.replace(/\D/g, ''), '##.###.###/####-##'),
        telefone: (value) => {
            const clean = value.replace(/\D/g, '');
            if (clean.length <= 10) {
                return applyMask(clean, '(##) ####-####');
            } else {
                return applyMask(clean, '(##) #####-####');
            }
        }
    };

    const handleInputChange = (type, field, value) => {
        let processedValue = value;
        
        // Aplicar máscaras específicas
        if (field === 'cep') {
            // CEP: apenas números permitidos
            const onlyNumbers = value.replace(/\D/g, '');
            processedValue = masks.cep(onlyNumbers);
        } else if (field === 'cpf') {
            processedValue = masks.cpf(value);
        } else if (field === 'cnpj') {
            processedValue = masks.cnpj(value);
        } else if (field === 'telefone') {
            processedValue = masks.telefone(value);
        }

        setFormData(prev => ({
            ...prev,
            [type]: {
                ...prev[type],
                [field]: processedValue
            }
        }));

        // Se for CEP e tiver 8 dígitos, buscar o endereço automaticamente
        if (field === 'cep') {
            const cepClean = value.replace(/\D/g, '');
            if (cepClean.length === 8) {
                setTimeout(() => {
                    handleCepSearch(cepClean, type);
                }, 200);
            }
        }
    };

    const handleRadioChange = (type) => {
        setFormType(type);
    };



    const handleCepSearch = async (cep, type) => {
        // Remover máscara do CEP antes de fazer a busca
        const cepClean = cep.replace(/\D/g, '');
        
        // Se o CEP estiver vazio, limpar os dados do endereço
        if (cepClean.length === 0) {
            setAddressDetails(prev => ({
                ...prev,
                [type]: {
                    visible: false,
                    data: {}
                }
            }));
            return;
        }
        
        // Só buscar se tiver 8 dígitos
        if (cepClean.length !== 8) {
            return;
        }
        
        try {
            const response = await fetch(`https://viacep.com.br/ws/${cepClean}/json/`);
            const data = await response.json();

            if (data.erro) {
                // Se o CEP não for encontrado, limpar os dados
                setAddressDetails(prev => ({
                    ...prev,
                    [type]: {
                        visible: false,
                        data: {}
                    }
                }));
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
            console.error('Erro ao buscar CEP:', error);
        }
    };

    // Função para forçar a busca do CEP quando preenchido programaticamente
    const forceCepSearch = (type) => {
        const cep = formData[type].cep;
        handleCepSearch(cep, type);
    };





    // Validação de senhas
    const validatePasswords = (type) => {
        const { senha, confirmarSenha } = formData[type];
        
        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem!');
            return false;
        }
        
        if (senha.length < 6) {
            alert('A senha deve ter pelo menos 6 caracteres!');
            return false;
        }
        
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        // Validações
        if (!validatePasswords(formType)) {
            setLoading(false);
            return;
        }

        try {
            // 1. Criar usuário no Auth do Supabase
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: formData[formType].email,
                password: formData[formType].senha
            });

            if (authError) {
                throw new Error(authError.message);
            }

            if (!authData || !authData.user || !authData.user.id) {
                throw new Error('Erro ao criar usuário no Auth do Supabase.');
            }

            // 2. Pegar o id do usuário criado no Auth
            const auth_id = authData.user.id;

            // 3. Inserir o usuário na tabela users com o auth_id
            const userData = {
                tipo: formType,
                nome: formData[formType].nome,
                cnpj: formData[formType].cnpj || '',
                cpf: formData[formType].cpf || '',
                cep: formData[formType].cep,
                numero: formData[formType].numero || '',
                complemento: formData[formType].complemento || '',
                email: formData[formType].email,
                telefone: formData[formType].telefone || '',
                auth_id,
                rua: addressDetails[formType]?.data?.rua || '',
                bairro: addressDetails[formType]?.data?.bairro || '',
                cidade: addressDetails[formType]?.data?.cidade || '',
                estado: addressDetails[formType]?.data?.estado || ''
            };

            const { error: insertError } = await supabase
                .from('users')
                .insert([userData]);

            if (insertError) {
                throw new Error(insertError.message);
            }

            alert('Usuário cadastrado com sucesso!');
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
                        <label className="register-type-label">Selecione o tipo de cadastro: <span className="required">*</span></label>
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
                                <label className="register-label" htmlFor="nome-empresa">Nome da Empresa: <span className="required">*</span></label>
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
                                <label className="register-label" htmlFor="cnpj-empresa">CNPJ: <span className="required">*</span></label>
                                <input 
                                    type="text" 
                                    id="cnpj-empresa" 
                                    className="register-input"
                                    value={formData.empresa.cnpj}
                                    onChange={(e) => handleInputChange('empresa', 'cnpj', e.target.value)}
                                    placeholder="00.000.000/0000-00" 
                                    maxLength="18"
                                    required 
                                />
                            </div>

                                                                                      <div className="register-form-group">
                                 <label className="register-label" htmlFor="cep-empresa">CEP: <span className="required">*</span></label>
                                                                   <input 
                                      type="text" 
                                      id="cep-empresa" 
                                      className="register-input"
                                      value={formData.empresa.cep}
                                      onChange={(e) => handleInputChange('empresa', 'cep', e.target.value)}
                                      onBlur={() => forceCepSearch('empresa')}
                                                                                                                    
                                      placeholder="00000-000" 
                                      maxLength="9"
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
                                        placeholder="Complemento (opcional)" 
                                    />
                                </div>
                            )}

                            <div className="register-form-group">
                                <label className="register-label" htmlFor="email-empresa">Email: <span className="required">*</span></label>
                                <input 
                                    type="email" 
                                    id="email-empresa" 
                                    className="register-input"
                                    value={formData.empresa.email}
                                    onChange={(e) => handleInputChange('empresa', 'email', e.target.value)}
                                    placeholder="email@empresa.com" 
                                    required 
                                />
                            </div>

                            <div className="register-form-group">
                                <label className="register-label" htmlFor="telefone-empresa">Telefone: <span className="required">*</span></label>
                                <input 
                                    type="tel" 
                                    id="telefone-empresa" 
                                    className="register-input"
                                    value={formData.empresa.telefone}
                                    onChange={(e) => handleInputChange('empresa', 'telefone', e.target.value)}
                                    placeholder="(00) 00000-0000" 
                                    maxLength="15"
                                    required 
                                />
                            </div>

                                                         <div className="register-form-group">
                                 <label className="register-label" htmlFor="senha-empresa">Senha: <span className="required">*</span></label>
                                 <input 
                                     type="password" 
                                     id="senha-empresa" 
                                     className="register-input"
                                     value={formData.empresa.senha}
                                     onChange={(e) => handleInputChange('empresa', 'senha', e.target.value)}
                                     placeholder="Mínimo 6 caracteres" 
                                     minLength="6"
                                     required 
                                 />
                             </div>

                             <div className="register-form-group">
                                 <label className="register-label" htmlFor="confirmar-senha-empresa">Confirmar Senha: <span className="required">*</span></label>
                                 <input 
                                     type="password" 
                                     id="confirmar-senha-empresa" 
                                     className="register-input"
                                     value={formData.empresa.confirmarSenha}
                                     onChange={(e) => handleInputChange('empresa', 'confirmarSenha', e.target.value)}
                                     placeholder="Confirme sua senha" 
                                     minLength="6"
                                     required 
                                 />
                             </div>
                        </div>
                    )}

                    {/* Formulário para Instituição */}
                    {formType === 'instituicao' && (
                        <div className="register-form-instituicao">
                            <div className="register-form-group">
                                <label className="register-label" htmlFor="nome-instituicao">Nome da Instituição: <span className="required">*</span></label>
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
                                <label className="register-label" htmlFor="cnpj-instituicao">CNPJ: <span className="required">*</span></label>
                                <input 
                                    type="text" 
                                    id="cnpj-instituicao" 
                                    className="register-input"
                                    value={formData.instituicao.cnpj}
                                    onChange={(e) => handleInputChange('instituicao', 'cnpj', e.target.value)}
                                    placeholder="00.000.000/0000-00" 
                                    maxLength="18"
                                    required 
                                />
                            </div>

                            <div className="register-form-group">
                                <label className="register-label" htmlFor="cep-instituicao">CEP: <span className="required">*</span></label>
                                                                                                   <input 
                                      type="text" 
                                      id="cep-instituicao" 
                                      className="register-input"
                                      value={formData.instituicao.cep}
                                      onChange={(e) => handleInputChange('instituicao', 'cep', e.target.value)}
                                      onBlur={() => forceCepSearch('instituicao')}
                                                                                                                    
                                      placeholder="00000-000" 
                                      maxLength="9"
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
                                        placeholder="Complemento (opcional)" 
                                    />
                                </div>
                            )}

                            <div className="register-form-group">
                                <label className="register-label" htmlFor="email-instituicao">Email: <span className="required">*</span></label>
                                <input 
                                    type="email" 
                                    id="email-instituicao" 
                                    className="register-input"
                                    value={formData.instituicao.email}
                                    onChange={(e) => handleInputChange('instituicao', 'email', e.target.value)}
                                    placeholder="email@instituicao.com" 
                                    required 
                                />
                            </div>

                            <div className="register-form-group">
                                <label className="register-label" htmlFor="telefone-instituicao">Telefone: <span className="required">*</span></label>
                                <input 
                                    type="tel" 
                                    id="telefone-instituicao" 
                                    className="register-input"
                                    value={formData.instituicao.telefone}
                                    onChange={(e) => handleInputChange('instituicao', 'telefone', e.target.value)}
                                    placeholder="(00) 00000-0000" 
                                    maxLength="15"
                                    required 
                                />
                            </div>

                                                         <div className="register-form-group">
                                 <label className="register-label" htmlFor="senha-instituicao">Senha: <span className="required">*</span></label>
                                 <input 
                                     type="password" 
                                     id="senha-instituicao" 
                                     className="register-input"
                                     value={formData.instituicao.senha}
                                     onChange={(e) => handleInputChange('instituicao', 'senha', e.target.value)}
                                     placeholder="Mínimo 6 caracteres" 
                                     minLength="6"
                                     required 
                                 />
                             </div>

                             <div className="register-form-group">
                                 <label className="register-label" htmlFor="confirmar-senha-instituicao">Confirmar Senha: <span className="required">*</span></label>
                                 <input 
                                     type="password" 
                                     id="confirmar-senha-instituicao" 
                                     className="register-input"
                                     value={formData.instituicao.confirmarSenha}
                                     onChange={(e) => handleInputChange('instituicao', 'confirmarSenha', e.target.value)}
                                     placeholder="Confirme sua senha" 
                                     minLength="6"
                                     required 
                                 />
                             </div>
                        </div>
                    )}

                    {/* Formulário para Pessoa Física */}
                    {formType === 'pessoaFisica' && (
                        <div className="register-form-pessoa-fisica">
                            <div className="register-form-group">
                                <label className="register-label" htmlFor="nome-pessoa-fisica">Nome Completo: <span className="required">*</span></label>
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
                                <label className="register-label" htmlFor="cpf-pessoa-fisica">CPF: <span className="required">*</span></label>
                                <input 
                                    type="text" 
                                    id="cpf-pessoa-fisica" 
                                    className="register-input"
                                    value={formData.pessoaFisica.cpf}
                                    onChange={(e) => handleInputChange('pessoaFisica', 'cpf', e.target.value)}
                                    placeholder="000.000.000-00" 
                                    maxLength="14"
                                    required 
                                />
                            </div>

                            <div className="register-form-group">
                                <label className="register-label" htmlFor="cep-pessoa-fisica">CEP: <span className="required">*</span></label>
                                                                                                   <input 
                                      type="text" 
                                      id="cep-pessoa-fisica" 
                                      className="register-input"
                                      value={formData.pessoaFisica.cep}
                                      onChange={(e) => handleInputChange('pessoaFisica', 'cep', e.target.value)}
                                      onBlur={() => forceCepSearch('pessoaFisica')}
                                                                                                                    
                                      placeholder="00000-000" 
                                      maxLength="9"
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
                                        placeholder="Complemento (opcional)" 
                                    />
                                </div>
                            )}

                            <div className="register-form-group">
                                <label className="register-label" htmlFor="email-pessoa-fisica">Email: <span className="required">*</span></label>
                                <input 
                                    type="email" 
                                    id="email-pessoa-fisica" 
                                    className="register-input"
                                    value={formData.pessoaFisica.email}
                                    onChange={(e) => handleInputChange('pessoaFisica', 'email', e.target.value)}
                                    placeholder="email@exemplo.com" 
                                    required 
                                />
                            </div>

                            <div className="register-form-group">
                                <label className="register-label" htmlFor="telefone-pessoa-fisica">Telefone: <span className="required">*</span></label>
                                <input 
                                    type="tel" 
                                    id="telefone-pessoa-fisica" 
                                    className="register-input"
                                    value={formData.pessoaFisica.telefone}
                                    onChange={(e) => handleInputChange('pessoaFisica', 'telefone', e.target.value)}
                                    placeholder="(00) 00000-0000" 
                                    maxLength="15"
                                    required 
                                />
                            </div>

                                                         <div className="register-form-group">
                                 <label className="register-label" htmlFor="senha-pessoa-fisica">Senha: <span className="required">*</span></label>
                                 <input 
                                     type="password" 
                                     id="senha-pessoa-fisica" 
                                     className="register-input"
                                     value={formData.pessoaFisica.senha}
                                     onChange={(e) => handleInputChange('pessoaFisica', 'senha', e.target.value)}
                                     placeholder="Mínimo 6 caracteres" 
                                     minLength="6"
                                     required 
                                 />
                             </div>

                             <div className="register-form-group">
                                 <label className="register-label" htmlFor="confirmar-senha-pessoa-fisica">Confirmar Senha: <span className="required">*</span></label>
                                 <input 
                                     type="password" 
                                     id="confirmar-senha-pessoa-fisica" 
                                     className="register-input"
                                     value={formData.pessoaFisica.confirmarSenha}
                                     onChange={(e) => handleInputChange('pessoaFisica', 'confirmarSenha', e.target.value)}
                                     placeholder="Confirme sua senha" 
                                     minLength="6"
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