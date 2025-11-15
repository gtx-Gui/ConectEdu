import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import '../pages/generateReport.css';

const fieldsByReport = {
  termo: [
    { name: 'nomeDoador', label: 'Nome do Doador', required: true },
    { name: 'cpfCnpjDoador', label: 'CPF/CNPJ do Doador', required: true },
    { name: 'enderecoDoador', label: 'Endereço do Doador', required: true },
    { name: 'nomeEscola', label: 'Nome da Escola', required: true },
    { name: 'cnpjEscola', label: 'CNPJ da Escola', required: true },
    { name: 'enderecoEscola', label: 'Endereço da Escola', required: true },
    { name: 'local', label: 'Local', required: true },
    { name: 'data', label: 'Data', required: true, type: 'date' },
    { name: 'cpfPresidenteApm', label: 'CPF do Presidente da APM', required: false },
  ],
  declaracao: [
    { name: 'nomeDoador', label: 'Nome Completo do Doador', required: true },
    { name: 'nacionalidade', label: 'Nacionalidade', required: true },
    { name: 'estadoCivil', label: 'Estado Civil', required: true },
    { name: 'profissao', label: 'Profissão', required: true },
    { name: 'cpfCnpjDoador', label: 'CPF do Doador', required: true },
    { name: 'enderecoDoador', label: 'Endereço Completo', required: true },
    { name: 'nomeEscola', label: 'Nome da Escola', required: true },
    { name: 'cnpjApm', label: 'CNPJ da APM', required: true },
    { name: 'enderecoApm', label: 'Endereço da Escola', required: true },
    { name: 'dataEntrega', label: 'Data de Entrega', required: true, type: 'date' },
    { name: 'local', label: 'Local', required: true },
    { name: 'dia', label: 'Dia', required: true },
    { name: 'mes', label: 'Mês por Extenso', required: true },
    { name: 'ano', label: 'Ano', required: true },
  ],
  recibo1: [
    { name: 'razaoSocial', label: 'Razão Social do Doador', required: true },
    { name: 'cnpjDoador', label: 'CNPJ', required: true },
    { name: 'enderecoDoador', label: 'Endereço Completo', required: true },
    { name: 'nomeRepresentante', label: 'Nome do Representante Legal', required: true },
    { name: 'cpfRepresentante', label: 'CPF do Representante', required: true },
    { name: 'nomeEscola', label: 'Nome da Escola', required: true },
    { name: 'cnpjApm', label: 'CNPJ da APM', required: true },
    { name: 'enderecoApm', label: 'Endereço da Escola', required: true },
    { name: 'dataEntrega', label: 'Data de Entrega', required: true, type: 'date' },
    { name: 'local', label: 'Local', required: true },
    { name: 'dia', label: 'Dia', required: true },
    { name: 'mes', label: 'Mês por Extenso', required: true },
    { name: 'ano', label: 'Ano', required: true },
  ],
  recibo2: [
    { name: 'nomeDoador', label: 'Nome Completo do Doador', required: true },
    { name: 'cpfDoador', label: 'CPF', required: true },
    { name: 'enderecoDoador', label: 'Endereço Completo', required: true },
    { name: 'nomeEscola', label: 'Nome da Escola', required: true },
    { name: 'cnpjApm', label: 'CNPJ da APM', required: true },
    { name: 'enderecoApm', label: 'Endereço da Escola', required: true },
    { name: 'dataEntrega', label: 'Data de Entrega', required: true, type: 'date' },
    { name: 'local', label: 'Local', required: true },
    { name: 'dia', label: 'Dia', required: true },
    { name: 'mes', label: 'Mês por Extenso', required: true },
    { name: 'ano', label: 'Ano', required: true },
  ],
};

function ManualReportForm({ reportType, form, setForm }) {
  const fields = fieldsByReport[reportType] || [];
  // Estados para equipamentos (Termo de Doação)
  const [equipamentos, setEquipamentos] = useState([{ id: 1, descricao: '', marca: '', serie: '', quantidade: '', estado: '' }]);

  // Estados para bens recebidos (Declaração de Doação)
  const [bensRecebidos, setBensRecebidos] = useState([{ id: 1, descricao: '', marca: '', serie: '', quantidade: '', estado: '', valor: '' }]);

  // Estados para equipamentos dos recibos
  const [equipamentosRecibo, setEquipamentosRecibo] = useState([{ id: 1, descricao: '', marca: '', serie: '', quantidade: '', estado: '' }]);

  // Estados para pesquisa de escolas
  const [searchTerm, setSearchTerm] = useState('');
  const [schools, setSchools] = useState([]);
  const [filteredSchools, setFilteredSchools] = useState([]);
  const [showSchoolResults, setShowSchoolResults] = useState(false);

  // Estados para pesquisa de empresas (apenas para recibo1)
  const [searchTermEmpresa, setSearchTermEmpresa] = useState('');
  const [empresas, setEmpresas] = useState([]);
  const [filteredEmpresas, setFilteredEmpresas] = useState([]);
  const [showEmpresaResults, setShowEmpresaResults] = useState(false);
  const [userData, setUserData] = useState(null);
  const [loadingUser, setLoadingUser] = useState(false);
  const [loadingSchools, setLoadingSchools] = useState(false);
  const [loadingSearch, setLoadingSearch] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);
  
  // Buscar dados do usuário logado
  useEffect(() => {
    let isMounted = true; // Flag para evitar atualização em componente desmontado
    
    const fetchUserData = async () => {
      try {
        setLoadingUser(true);
        
        const { data: { session }, error: sessionError } = await supabase.auth.getSession();
        
        if (sessionError) {
          return;
        }
        
        if (session && session.user) {
          // Query otimizada: buscar apenas campos necessários para o formulário
          const { data, error } = await supabase
            .from('users')
            .select('id, nome, email, telefone, cpf, cnpj, cep, rua, numero, complemento, bairro, cidade, estado, tipo, nacionalidade, estadoCivil, profissao')
            .eq('auth_id', session.user.id)
            .single();

          if (!error && data && isMounted) {
            setUserData(data);
          }
        }
      } catch (error) {
        // Erro silencioso
      } finally {
        if (isMounted) {
          setLoadingUser(false);
        }
      }
    };

    fetchUserData();
    
    return () => {
      isMounted = false; // Limpar flag quando componente desmontar
    };
  }, []);

  // Buscar escolas cadastradas
  useEffect(() => {
    let isMounted = true; // Flag para evitar atualização em componente desmontado
    
    const fetchSchools = async () => {
      try {
        setLoadingSchools(true);
        
        // Query otimizada: buscar apenas campos necessários
        const { data, error } = await supabase
          .from('users')
          .select('id, nome, cidade, estado, cnpj')
          .eq('tipo', 'instituicao')
          .order('nome');

          if (error) {
            // Erro silencioso - apenas não carrega escolas
          } else if (isMounted) {
            setSchools(data || []);
          }
      } catch (error) {
        // Erro silencioso
      } finally {
        if (isMounted) {
          setLoadingSchools(false);
        }
      }
    };

    fetchSchools();
    
    return () => {
      isMounted = false; // Limpar flag quando componente desmontar
    };
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

  // Função para verificar se o auto-preenchimento é possível
  const podePreencherAutomaticamente = () => {
    if (!userData) return false;

    if (reportType === 'termo' || reportType === 'declaracao') {
      return true; // Sempre possível para termo e declaração
    } else if (reportType === 'recibo1' && (userData.tipo === 'empresa' || userData.tipo === 'instituicao')) {
      return true; // Empresas e instituições para recibo1
    } else if (reportType === 'recibo2' && (userData.tipo === 'pessoaFisica' || userData.tipo === 'instituicao')) {
      return true; // Pessoas físicas e instituições para recibo2
    }

    return false;
  };

  // Função para limpar o formulário
  const limparFormulario = () => {
    // Limpar dados básicos do formulário
    setForm({});
    
    // Limpar equipamentos
    setEquipamentos([{ id: 1, descricao: '', marca: '', serie: '', quantidade: '', estado: '' }]);
    
    // Limpar bens recebidos
    setBensRecebidos([{ id: 1, descricao: '', marca: '', serie: '', quantidade: '', estado: '', valor: '' }]);
    
    // Limpar equipamentos do recibo
    setEquipamentosRecibo([{ id: 1, descricao: '', marca: '', serie: '', quantidade: '', estado: '' }]);
    
    // Resetar estado de auto-preenchimento
    setAutoFilled(false);
    
    // Limpar dados de pesquisa de escolas
    setSearchTerm('');
    setFilteredSchools([]);
    setShowSchoolResults(false);
    
    // Limpar dados de pesquisa de empresas
    setSearchTermEmpresa('');
    setFilteredEmpresas([]);
    setShowEmpresaResults(false);
    
    console.log('Formulário limpo com sucesso');
  };

  // Função para preencher automaticamente os dados
  const preencherAutomaticamente = () => {
    if (!userData) return;

    let dadosPreenchidos = {};

    if (reportType === 'termo') {
      dadosPreenchidos = {
        nomeDoador: userData.nome || '',
        cpfCnpjDoador: userData.cpf || userData.cnpj || '',
        enderecoDoador: `${userData.rua || ''}, ${userData.numero || ''}, ${userData.bairro || ''}, ${userData.cidade || ''} - ${userData.estado || ''}`.replace(/^,\s*/, '').replace(/,\s*,/g, ','),
        local: userData.cidade || ''
      };
    } else if (reportType === 'declaracao') {
      dadosPreenchidos = {
        nomeDoador: userData.nome || '',
        nacionalidade: userData.nacionalidade || 'Brasileira',
        estadoCivil: userData.estadoCivil || 'Solteiro(a)',
        profissao: userData.profissao || '',
        cpfCnpjDoador: userData.cpf || '',
        enderecoDoador: `${userData.rua || ''}, ${userData.numero || ''}, ${userData.bairro || ''}, ${userData.cidade || ''} - ${userData.estado || ''}`.replace(/^,\s*/, '').replace(/,\s*,/g, ','),
        local: userData.cidade || '',
        dataEntrega: new Date().toISOString().split('T')[0],
        dia: new Date().getDate().toString(),
        mes: new Date().toLocaleDateString('pt-BR', { month: 'long' }),
        ano: new Date().getFullYear().toString()
      };
    } else if (reportType === 'recibo1' && userData.tipo === 'empresa') {
      // Recibo 1 - Empresa (doador) + dados da instituição (donatário)
      dadosPreenchidos = {
        razaoSocial: userData.nome || '',
        cnpjDoador: userData.cnpj || '',
        enderecoDoador: `${userData.rua || ''}, ${userData.numero || ''}, ${userData.bairro || ''}, ${userData.cidade || ''} - ${userData.estado || ''}`.replace(/^,\s*/, '').replace(/,\s*,/g, ','),
        local: userData.cidade || '',
        dataEntrega: new Date().toISOString().split('T')[0],
        dia: new Date().getDate().toString(),
        mes: new Date().toLocaleDateString('pt-BR', { month: 'long' }),
        ano: new Date().getFullYear().toString()
      };
    } else if (reportType === 'recibo2' && userData.tipo === 'pessoaFisica') {
      // Recibo 2 - Pessoa Física (doador) + dados da instituição (donatário)
      dadosPreenchidos = {
        nomeDoador: userData.nome || '',
        cpfDoador: userData.cpf || '',
        enderecoDoador: `${userData.rua || ''}, ${userData.numero || ''}, ${userData.bairro || ''}, ${userData.cidade || ''} - ${userData.estado || ''}`.replace(/^,\s*/, '').replace(/,\s*,/g, ','),
        local: userData.cidade || '',
        dataEntrega: new Date().toISOString().split('T')[0],
        dia: new Date().getDate().toString(),
        mes: new Date().toLocaleDateString('pt-BR', { month: 'long' }),
        ano: new Date().getFullYear().toString()
      };
    } else if (reportType === 'recibo1' && userData.tipo === 'instituicao') {
      // Recibo 1 - Instituição gerando recibo (apenas dados da instituição como donatário)
      dadosPreenchidos = {
        nomeEscola: userData.nome || '',
        cnpjApm: userData.cnpj || '',
        enderecoApm: `${userData.rua || ''}, ${userData.numero || ''}, ${userData.bairro || ''}, ${userData.cidade || ''} - ${userData.estado || ''}`.replace(/^,\s*/, '').replace(/,\s*,/g, ','),
        local: userData.cidade || '',
        dataEntrega: new Date().toISOString().split('T')[0],
        dia: new Date().getDate().toString(),
        mes: new Date().toLocaleDateString('pt-BR', { month: 'long' }),
        ano: new Date().getFullYear().toString()
      };
    } else if (reportType === 'recibo2' && userData.tipo === 'instituicao') {
      // Recibo 2 - Instituição gerando recibo (apenas dados da instituição como donatário)
      dadosPreenchidos = {
        nomeEscola: userData.nome || '',
        cnpjApm: userData.cnpj || '',
        enderecoApm: `${userData.rua || ''}, ${userData.numero || ''}, ${userData.bairro || ''}, ${userData.cidade || ''} - ${userData.estado || ''}`.replace(/^,\s*/, '').replace(/,\s*,/g, ','),
        local: userData.cidade || '',
        dataEntrega: new Date().toISOString().split('T')[0],
        dia: new Date().getDate().toString(),
        mes: new Date().toLocaleDateString('pt-BR', { month: 'long' }),
        ano: new Date().getFullYear().toString()
      };
    }

    // Verificar se há dados para preencher
    if (Object.keys(dadosPreenchidos).length === 0) {
      alert('Auto-preenchimento não disponível para este tipo de documento ou usuário.');
      return;
    }

    // Aplicar os dados preenchidos
    setForm(dadosPreenchidos);
    setAutoFilled(true);
  };

  // Preencher automaticamente os dados do usuário apenas na primeira vez
  // useEffect(() => {
  //   if (userData && !autoFilled) {
  //     preencherAutomaticamente();
  //   }
  // }, [userData, reportType]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEquipamentoChange = (index, field, value) => {
    const novosEquipamentos = [...equipamentos];
    novosEquipamentos[index][field] = value;
    setEquipamentos(novosEquipamentos);
    setForm({ ...form, equipamentos: novosEquipamentos });
  };

  const handleBemRecebidoChange = (index, field, value) => {
    const novosBens = [...bensRecebidos];
    novosBens[index][field] = value;
    setBensRecebidos(novosBens);
    setForm({ ...form, bensRecebidos: novosBens });
  };

  const adicionarEquipamento = () => {
    if (equipamentos.length >= 5) {
      alert('Limite máximo de 5 equipamentos atingido!');
      return;
    }
    const novoId = equipamentos.length + 1;
    const novoEquipamento = { id: novoId, descricao: '', marca: '', serie: '', quantidade: '', estado: '' };
    const novosEquipamentos = [...equipamentos, novoEquipamento];
    setEquipamentos(novosEquipamentos);
    setForm({ ...form, equipamentos: novosEquipamentos });
  };

  const adicionarBemRecebido = () => {
    if (bensRecebidos.length >= 5) {
      alert('Limite máximo de 5 bens atingido!');
      return;
    }
    const novoId = bensRecebidos.length + 1;
    const novoBem = { id: novoId, descricao: '', marca: '', serie: '', quantidade: '', estado: '', valor: '' };
    const novosBens = [...bensRecebidos, novoBem];
    setBensRecebidos(novosBens);
    setForm({ ...form, bensRecebidos: novosBens });
  };

  const removerEquipamento = (index) => {
    if (equipamentos.length > 1) {
      const novosEquipamentos = equipamentos.filter((_, i) => i !== index);
      setEquipamentos(novosEquipamentos);
      setForm({ ...form, equipamentos: novosEquipamentos });
    }
  };

  const removerBemRecebido = (index) => {
    if (bensRecebidos.length > 1) {
      const novosBens = bensRecebidos.filter((_, i) => i !== index);
      setBensRecebidos(novosBens);
      setForm({ ...form, bensRecebidos: novosBens });
    }
  };

  // Função para selecionar uma escola
  const selectSchool = (school) => {
    if (reportType === 'termo') {
      setForm(prevForm => ({
        ...prevForm,
        nomeEscola: school.nome || '',
        cnpjEscola: school.cnpj || '',
        enderecoEscola: `${school.rua || ''}, ${school.numero || ''}, ${school.bairro || ''}, ${school.cidade || ''} - ${school.estado || ''}`.replace(/^,\s*/, '').replace(/,\s*,/g, ','),
        local: school.cidade || ''
      }));
    } else if (reportType === 'declaracao') {
      setForm(prevForm => ({
        ...prevForm,
        nomeEscola: school.nome || '',
        cnpjApm: school.cnpj || '',
        enderecoApm: `${school.rua || ''}, ${school.numero || ''}, ${school.bairro || ''}, ${school.cidade || ''} - ${school.estado || ''}`.replace(/^,\s*/, '').replace(/,\s*,/g, ','),
        local: school.cidade || ''
      }));
    }
    setSearchTerm('');
    setFilteredSchools([]);
    setShowSchoolResults(false);
  };

  // Função para buscar escolas
  const buscarEscolas = async (termo) => {
    if (termo.trim().length < 2) {
      setFilteredSchools([]);
      setShowSchoolResults(false);
      return;
    }

      setLoadingSearch(true);
      try {
        // Query otimizada: buscar apenas campos necessários
        const { data, error } = await supabase
          .from('users')
          .select('id, nome, cidade, estado, cnpj')
          .eq('tipo', 'instituicao')
          .ilike('nome', `%${termo}%`)
          .limit(20); // Limitar resultados da busca

        if (!error) {
          setFilteredSchools(data || []);
          setShowSchoolResults(true);
        }
      } catch (error) {
        // Erro silencioso
      } finally {
        setLoadingSearch(false);
      }
  };

  const handleSchoolSearch = () => {
    if (searchTerm.trim() === '') {
      alert('Digite o nome da escola para pesquisar.');
      return;
    }
    buscarEscolas(searchTerm);
  };

  // Funções para equipamentos dos recibos
  const handleEquipamentoReciboChange = (index, field, value) => {
    const newEquipamentos = [...equipamentosRecibo];
    newEquipamentos[index] = { ...newEquipamentos[index], [field]: value };
    setEquipamentosRecibo(newEquipamentos);
    setForm({ ...form, equipamentosRecibo: newEquipamentos });
  };

  const adicionarEquipamentoRecibo = () => {
    if (equipamentosRecibo.length < 5) {
      const newEquipamento = {
        id: Date.now(),
        descricao: '',
        marca: '',
        serie: '',
        quantidade: '',
        estado: ''
      };
      const newEquipamentos = [...equipamentosRecibo, newEquipamento];
      setEquipamentosRecibo(newEquipamentos);
      setForm({ ...form, equipamentosRecibo: newEquipamentos });
    } else {
      alert('Limite máximo de 5 equipamentos atingido!');
    }
  };

  const removerEquipamentoRecibo = (index) => {
    if (equipamentosRecibo.length > 1) {
      const newEquipamentos = equipamentosRecibo.filter((_, i) => i !== index);
      setEquipamentosRecibo(newEquipamentos);
      setForm({ ...form, equipamentosRecibo: newEquipamentos });
    }
  };

  // Funções para pesquisa de empresas
  const buscarEmpresas = async (termo) => {
    if (termo.trim().length < 2) {
      setFilteredEmpresas([]);
      setShowEmpresaResults(false);
      return;
    }

      setLoadingSearch(true);
      try {
        // Query otimizada: buscar apenas campos necessários
        const { data, error } = await supabase
          .from('users')
          .select('id, nome, cidade, estado, cnpj, cpf')
          .eq('tipo', 'empresa')
          .ilike('nome', `%${termo}%`)
          .limit(20); // Limitar resultados da busca

        if (!error) {
          setFilteredEmpresas(data || []);
          setShowEmpresaResults(true);
        }
      } catch (error) {
        // Erro silencioso
      } finally {
        setLoadingSearch(false);
      }
  };

  const selecionarEmpresa = (empresa) => {
    setForm({
      ...form,
      razaoSocial: empresa.nome,
      cnpjDoador: empresa.cnpj || '',
      enderecoDoador: `${empresa.rua || ''}, ${empresa.numero || ''}, ${empresa.bairro || ''}, ${empresa.cidade || ''} - ${empresa.estado || ''}`.replace(/^,\s*/, '').replace(/,\s*,/g, ','),
    });
    setSearchTermEmpresa(empresa.nome);
    setShowEmpresaResults(false);
  };

  return (
    <form className="report-form">
      <h2>
        {reportType === 'termo' ? 'Termo de Doação' : 
         reportType === 'declaracao' ? 'Declaração de Doação' :
         reportType === 'recibo1' ? 'Recibo para Pessoas Jurídicas' :
         reportType === 'recibo2' ? 'Recibo para Pessoas Físicas' : 'Gerar Documento'}
      </h2>
      
      {/* Indicador de carregamento */}
      {loadingUser && (
        <div style={{ textAlign: 'center', marginBottom: '20px', color: '#4CAF50' }}>
          <i className="fas fa-spinner fa-spin me-2"></i>
          Carregando dados do usuário...
        </div>
      )}

      {/* Mensagem informativa para instituições gerando recibos */}
      {userData && userData.tipo === 'instituicao' && (reportType === 'recibo1' || reportType === 'recibo2') && (
        <div className="alert alert-info mb-4">
          <i className="fas fa-info-circle me-2"></i>
          <strong>Informação:</strong> Como você é uma instituição, os dados da escola serão preenchidos automaticamente. Os dados do doador devem ser preenchidos manualmente ou pesquisados (para empresas no Recibo 1).
        </div>
      )}

      {/* Pesquisa de Empresas (apenas para recibo1) - PRIMEIRO CAMPO */}
      {(reportType === 'recibo1') && (
        <div className="mb-4">
          <h3 style={{ color: '#4CAF50', marginBottom: '20px', fontSize: '1.3rem' }}>
            <i className="fas fa-search me-2"></i>Pesquisar Empresas Cadastradas
          </h3>
          <div className="form-group">
            <label>Nome da Empresa</label>
            <input
              type="text"
              className="form-control"
              placeholder="Digite o nome da empresa..."
              value={searchTermEmpresa}
              onChange={(e) => {
                setSearchTermEmpresa(e.target.value);
                buscarEmpresas(e.target.value);
              }}
            />
          </div>
          
          {/* Resultados da busca de empresas */}
          {showEmpresaResults && (
            <div className="mt-3">
              {filteredEmpresas.length > 0 ? (
                <div className="list-group">
                  {filteredEmpresas.map(empresa => (
                    <div
                      key={empresa.id}
                      className="list-group-item list-group-item-action"
                      style={{ cursor: 'pointer' }}
                      onClick={() => selecionarEmpresa(empresa)}
                    >
                      <strong>{empresa.nome}</strong>
                      {empresa.cidade && empresa.estado && (
                        <div style={{ fontSize: '0.9em', color: '#555' }}>
                          {empresa.cidade} - {empresa.estado}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="alert alert-warning">
                  Nenhuma empresa encontrada com esse nome.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Botões de ação */}
      <div className="mb-4 d-flex flex-wrap gap-2 align-items-center">
        {/* Botão para preencher automaticamente */}
        <button
          type="button"
          className="btn btn-primary"
          onClick={preencherAutomaticamente}
          disabled={
            loadingUser ||
            loadingSchools ||
            !userData ||
            !podePreencherAutomaticamente()
          }
        >
          <i className={`fas ${loadingUser || loadingSchools ? 'fa-spinner fa-spin' : 'fa-sync'} me-2`}></i>
          {loadingUser || loadingSchools ? 'Carregando...' : 'Preencher Automaticamente'}
        </button>

        {!loadingUser && !userData && (
          <small className="text-muted">
            Aguardando carregamento dos seus dados para liberar o auto-preenchimento.
          </small>
        )}

        {/* Botão para limpar formulário */}
        <button
          type="button"
          className="btn btn-secondary"
          onClick={limparFormulario}
        >
          <i className="fas fa-eraser me-2"></i>
          Limpar
        </button>
      </div>

      {/* Mensagem quando auto-preenchimento não é possível */}
      {userData && !podePreencherAutomaticamente() && (
        <div className="mb-4">
          <div className="alert alert-info">
            <i className="fas fa-info-circle me-2"></i>
            <strong>Informação:</strong> O auto-preenchimento não está disponível para este tipo de documento ou usuário. Preencha os campos manualmente.
          </div>
        </div>
      )}

      {/* Pesquisa de Escolas (apenas para termo e declaração) */}
      {(reportType === 'termo' || reportType === 'declaracao') && (
        <div className="mb-4">
          <h3 style={{ color: '#4CAF50', marginBottom: '20px', fontSize: '1.3rem' }}>
            <i className="fas fa-search me-2"></i>Pesquisar Escolas Cadastradas
          </h3>
          <div className="form-group">
            <label>Nome da Escola</label>
            <input
              type="text"
              className="form-control"
              placeholder="Digite o nome da escola..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                buscarEscolas(e.target.value);
              }}
            />
          </div>
          
          {/* Resultados da busca */}
          {showSchoolResults && (
            <div className="mt-3">
              {filteredSchools.length > 0 ? (
                <div className="list-group">
                  {filteredSchools.map(school => (
                    <div
                      key={school.id}
                      className="list-group-item list-group-item-action"
                      style={{ cursor: 'pointer' }}
                      onClick={() => selectSchool(school)}
                    >
                      <strong>{school.nome}</strong>
                      {school.cidade && school.estado && (
                        <div style={{ fontSize: '0.9em', color: '#555' }}>
                          {school.cidade} - {school.estado}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="alert alert-warning">
                  Nenhuma escola encontrada com esse nome.
                </div>
              )}
            </div>
          )}
        </div>
      )}
      
      {/* Campos básicos */}
      {fields.map(field => (
        <div key={field.name} className="form-group">
          <label>{field.label}{field.required && '*'}</label>
          <input
            type={field.type || 'text'}
            name={field.name}
            value={form[field.name] || ''}
            onChange={handleChange}
            required={field.required}
            autoComplete="off"
          />
        </div>
      ))}

      {/* Lista de Equipamentos (Termo de Doação) */}
      {reportType === 'termo' && (
        <div className="equipamentos-section">
          <h3 style={{ color: '#4CAF50', marginBottom: '20px', fontSize: '1.3rem' }}>
            <i className="fas fa-laptop me-2"></i>Lista de Equipamentos
          </h3>
          {equipamentos.map((equipamento, index) => (
            <div key={equipamento.id} className="equipamento-card">
              <div className="equipamento-header">
                <h4>Equipamento {index + 1}</h4>
                {equipamentos.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => removerEquipamento(index)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                )}
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Descrição</label>
                    <input
                      type="text"
                      className="form-control"
                      value={equipamento.descricao}
                      onChange={(e) => handleEquipamentoChange(index, 'descricao', e.target.value)}
                      placeholder="Ex: Notebook"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Marca/Modelo</label>
                    <input
                      type="text"
                      className="form-control"
                      value={equipamento.marca}
                      onChange={(e) => handleEquipamentoChange(index, 'marca', e.target.value)}
                      placeholder="Ex: Dell Inspiron"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Nº Série</label>
                    <input
                      type="text"
                      className="form-control"
                      value={equipamento.serie}
                      onChange={(e) => handleEquipamentoChange(index, 'serie', e.target.value)}
                      placeholder="Série"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Qtd</label>
                    <input
                      type="number"
                      className="form-control"
                      value={equipamento.quantidade}
                      onChange={(e) => handleEquipamentoChange(index, 'quantidade', e.target.value)}
                      placeholder="1"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Estado</label>
                    <select
                      className="form-control"
                      value={equipamento.estado}
                      onChange={(e) => handleEquipamentoChange(index, 'estado', e.target.value)}
                    >
                      <option value="">Selecione</option>
                      <option value="Excelente">Excelente</option>
                      <option value="Bom">Bom</option>
                      <option value="Regular">Regular</option>
                      <option value="Ruim">Ruim</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-success"
            onClick={adicionarEquipamento}
            disabled={equipamentos.length >= 5}
            style={{ marginTop: '15px' }}
          >
            <i className="fas fa-plus me-2"></i>Adicionar Equipamento
            {equipamentos.length >= 5 && <span className="ms-2">(Limite atingido)</span>}
          </button>
        </div>
      )}

      {/* Lista de Bens Declarados (Declaração de Doação) */}
      {reportType === 'declaracao' && (
        <div className="bens-recebidos-section">
          <h3 style={{ color: '#4CAF50', marginBottom: '20px', fontSize: '1.3rem' }}>
            <i className="fas fa-gift me-2"></i>Lista de Bens Declarados
          </h3>
          {bensRecebidos.map((bem, index) => (
            <div key={bem.id} className="bem-recebido-card">
              <div className="bem-recebido-header">
                <h4>Bem Declarado {index + 1}</h4>
                {bensRecebidos.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => removerBemRecebido(index)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                )}
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Descrição</label>
                    <input
                      type="text"
                      className="form-control"
                      value={bem.descricao}
                      onChange={(e) => handleBemRecebidoChange(index, 'descricao', e.target.value)}
                      placeholder="Ex: Notebook"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label dangerouslySetInnerHTML={{ __html: 'Marca<br />Modelo' }}></label>
                    <input
                      type="text"
                      className="form-control"
                      value={bem.marca}
                      onChange={(e) => handleBemRecebidoChange(index, 'marca', e.target.value)}
                      placeholder="Ex: Dell"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Nº Série</label>
                    <input
                      type="text"
                      className="form-control"
                      value={bem.serie}
                      onChange={(e) => handleBemRecebidoChange(index, 'serie', e.target.value)}
                      placeholder="Série"
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Qtd</label>
                    <input
                      type="number"
                      className="form-control"
                      value={bem.quantidade}
                      onChange={(e) => handleBemRecebidoChange(index, 'quantidade', e.target.value)}
                      placeholder="1"
                    />
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Estado</label>
                    <select
                      className="form-control"
                      value={bem.estado}
                      onChange={(e) => handleBemRecebidoChange(index, 'estado', e.target.value)}
                    >
                      <option value="">Selecione</option>
                      <option value="Excelente">Excelente</option>
                      <option value="Bom">Bom</option>
                      <option value="Regular">Regular</option>
                      <option value="Ruim">Ruim</option>
                    </select>
                  </div>
                </div>
                <div className="col-md-3">
                  <div className="form-group">
                    <label>Valor (R$)</label>
                    <input
                      type="number"
                      className="form-control"
                      value={bem.valor}
                      onChange={(e) => handleBemRecebidoChange(index, 'valor', e.target.value)}
                      placeholder="0.00"
                      step="0.01"
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-success"
            onClick={adicionarBemRecebido}
            disabled={bensRecebidos.length >= 5}
            style={{ marginTop: '15px' }}
          >
            <i className="fas fa-plus me-2"></i>Adicionar Bem Declarado
            {bensRecebidos.length >= 5 && <span className="ms-2">(Limite atingido)</span>}
          </button>
        </div>
      )}

      {/* Lista de Equipamentos (Recibos) */}
      {(reportType === 'recibo1' || reportType === 'recibo2') && (
        <div className="equipamentos-section">
          <h3 style={{ color: '#4CAF50', marginBottom: '20px', fontSize: '1.3rem' }}>
            <i className="fas fa-laptop me-2"></i>Lista de Equipamentos Doados
          </h3>
          {equipamentosRecibo.map((equipamento, index) => (
            <div key={equipamento.id} className="equipamento-card">
              <div className="equipamento-header">
                <h4>Equipamento {index + 1}</h4>
                {equipamentosRecibo.length > 1 && (
                  <button
                    type="button"
                    className="btn btn-danger btn-sm"
                    onClick={() => removerEquipamentoRecibo(index)}
                  >
                    <i className="fas fa-trash"></i>
                  </button>
                )}
              </div>
              <div className="row">
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Descrição</label>
                    <input
                      type="text"
                      className="form-control"
                      value={equipamento.descricao}
                      onChange={(e) => handleEquipamentoReciboChange(index, 'descricao', e.target.value)}
                      placeholder="Ex: Notebook"
                    />
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="form-group">
                    <label>Marca/Modelo</label>
                    <input
                      type="text"
                      className="form-control"
                      value={equipamento.marca}
                      onChange={(e) => handleEquipamentoReciboChange(index, 'marca', e.target.value)}
                      placeholder="Ex: Dell Inspiron"
                    />
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Nº Série</label>
                    <input
                      type="text"
                      className="form-control"
                      value={equipamento.serie}
                      onChange={(e) => handleEquipamentoReciboChange(index, 'serie', e.target.value)}
                      placeholder="Série"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Qtd</label>
                    <input
                      type="number"
                      className="form-control"
                      value={equipamento.quantidade}
                      onChange={(e) => handleEquipamentoReciboChange(index, 'quantidade', e.target.value)}
                      placeholder="1"
                    />
                  </div>
                </div>
                <div className="col-md-4">
                  <div className="form-group">
                    <label>Estado</label>
                    <select
                      className="form-control"
                      value={equipamento.estado}
                      onChange={(e) => handleEquipamentoReciboChange(index, 'estado', e.target.value)}
                    >
                      <option value="">Selecione</option>
                      <option value="Excelente">Excelente</option>
                      <option value="Bom">Bom</option>
                      <option value="Regular">Regular</option>
                      <option value="Ruim">Ruim</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
          ))}
          <button
            type="button"
            className="btn btn-success"
            onClick={adicionarEquipamentoRecibo}
            disabled={equipamentosRecibo.length >= 5}
            style={{ marginTop: '15px' }}
          >
            <i className="fas fa-plus me-2"></i>Adicionar Equipamento
            {equipamentosRecibo.length >= 5 && <span className="ms-2">(Limite atingido)</span>}
          </button>
        </div>
      )}
    </form>
  );
}

export default ManualReportForm; 