import React, { useState, useEffect, forwardRef, useRef } from 'react';
import { supabase } from '../supabaseClient';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../pages/userDashboard.css';
import decorTopLeft from '../assets/img/DocVisualElements/top-left.png';
import decorTopRight from '../assets/img/DocVisualElements/top-rigth.png';
import decorBottomLeft from '../assets/img/DocVisualElements/bottom-left.png';
import logoConectEdu from '../assets/img/LogoConectEdu7.png';

// Função utilitária para obter label do tipo de documento
const getDocumentTypeLabel = (type) => {
  const typeLabels = {
    'termo': 'Termo de Doação',
    'declaracao': 'Declaração de Doação',
    'recibo1': 'Recibo de Doação 1 (Pessoa Jurídica)',
    'recibo2': 'Recibo de Doação 2 (Pessoa Física)'
  };
  return typeLabels[type] || type;
};

// Componente para preview do documento
const DocumentPreview = forwardRef(({ documentType, formData }, ref) => {
  if (documentType === 'termo') {
    return (
      <div ref={ref} className="preview-paper" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Elementos decorativos */}
        <img src={decorTopLeft} alt="decor top left" style={{ position: 'absolute', top: 0, left: 0, width: 80, zIndex: 1 }} />
        <img src={decorTopRight} alt="decor top right" style={{ position: 'absolute', top: 0, right: 0, width: 80, zIndex: 1 }} />
        <img src={decorBottomLeft} alt="decor bottom left" style={{ position: 'absolute', bottom: 0, left: 0, width: 80, zIndex: 1 }} />
        <div className="preview-header" style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontSize: '2.2rem', marginBottom: 16, fontWeight: 600, letterSpacing: 1 }}>TERMO DE DOAÇÃO</h1>
        </div>
        <div className="preview-content" style={{ textAlign: 'justify', fontSize: '1.05rem', position: 'relative', zIndex: 2 }}>
          <p style={{ fontWeight: 500, marginBottom: 12 }}>
            PELO PRESENTE INSTRUMENTO PARTICULAR DE DOAÇÃO, <b>{formData.nomeDoador || '[NOME DO DOADOR]'}</b>, INSCRITO NO CPF/CNPJ SOB O Nº <b>{formData.cpfCnpjDoador || '[XXX]'}</b>, COM ENDEREÇO EM <b>{formData.enderecoDoador || '[ENDEREÇO COMPLETO]'}</b>, DECLARA QUE DOA À ASSOCIAÇÃO DE PAIS E MESTRES DA ESCOLA <b>{formData.nomeEscola || '[NOME DA ESCOLA]'}</b>, INSCRITA NO CNPJ SOB O Nº <b>{formData.cnpjEscola || '[XXX]'}</b>, COM SEDE EM <b>{formData.enderecoEscola || '[ENDEREÇO]'}</b>, OS SEGUINTES BENS:
          </p>
          
          {/* Tabela de Equipamentos */}
          <div style={{ marginBottom: 16, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f0f0f0' }}>
                  <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>Nº</th>
                  <th style={{ border: '1px solid #000', padding: '8px' }}>Descrição</th>
                  <th style={{ border: '1px solid #000', padding: '8px' }}>Marca/Modelo</th>
                  <th style={{ border: '1px solid #000', padding: '8px' }}>Nº de Série</th>
                  <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>Qtd</th>
                  <th style={{ border: '1px solid #000', padding: '8px' }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {formData.equipamentos && formData.equipamentos.length > 0 ? (
                  formData.equipamentos.map((equipamento, index) => (
                    <tr key={equipamento.id || index}>
                      <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{index + 1}</td>
                      <td style={{ border: '1px solid #000', padding: '8px' }}>{equipamento.descricao || ''}</td>
                      <td style={{ border: '1px solid #000', padding: '8px' }}>{equipamento.marca || ''}</td>
                      <td style={{ border: '1px solid #000', padding: '8px' }}>{equipamento.serie || ''}</td>
                      <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{equipamento.quantidade || ''}</td>
                      <td style={{ border: '1px solid #000', padding: '8px' }}>{equipamento.estado || ''}</td>
                    </tr>
                  ))
                ) : (
                  Array.from({ length: 5 }, (_, index) => (
                    <tr key={index}>
                      <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{index + 1}</td>
                      <td style={{ border: '1px solid #000', padding: '8px' }}></td>
                      <td style={{ border: '1px solid #000', padding: '8px' }}></td>
                      <td style={{ border: '1px solid #000', padding: '8px' }}></td>
                      <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}></td>
                      <td style={{ border: '1px solid #000', padding: '8px' }}></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          
          <ol style={{ marginLeft: 18, marginBottom: 12 }}>
            <li style={{ marginBottom: 8 }}>
              <b style={{ fontSize: '1.05rem' }}> NATUREZA E FINALIDADE</b><br />
              <span style={{ fontSize: '1.05rem' }}>A PRESENTE DOAÇÃO É FEITA DE FORMA GRATUITA, IRREVERSÍVEL E IRREVOGÁVEL, COM A FINALIDADE DE CONTRIBUIR COM AS ATIVIDADES PEDAGÓGICAS E ADMINISTRATIVAS DA ESCOLA, CONFORME OS OBJETIVOS SOCIAIS DA APM.</span>
            </li>
            <li style={{ marginBottom: 8 }}>
              <b style={{ fontSize: '1.05rem' }}> RESPONSABILIDADE SOBRE DADOS</b><br />
              <span style={{ fontSize: '1.05rem' }}>A EMPRESA DOADORA SE COMPROMETE A REALIZAR A VERIFICAÇÃO, LIMPEZA E DESCARTE DE QUAISQUER DADOS EVENTUALMENTE EXISTENTES NOS EQUIPAMENTOS DOADOS, ENTREGANDO-OS LIVRES DE DADOS PESSOAIS OU SENSÍVEIS, ISENTANDO A APM DE QUALQUER RESPONSABILIDADE SOBRE DADOS EVENTUALMENTE RESIDUAIS.</span>
            </li>
            <li style={{ marginBottom: 8 }}>
              <b style={{ fontSize: '1.05rem' }}> DESCARTE AMBIENTALMENTE CORRETO</b><br />
              <span style={{ fontSize: '1.05rem' }}>A APM COMPROMETE-SE A REALIZAR O DESCARTE AMBIENTALMENTE ADEQUADO DOS EQUIPAMENTOS AO FINAL DE SUA VIDA ÚTIL, SEGUINDO AS NORMAS DA POLÍTICA NACIONAL DE RESÍDUOS SÓLIDOS (LEI Nº 12.305/2010) E ORIENTAÇÕES DE LOGÍSTICA REVERSA, DESTINANDO-OS, SEMPRE QUE POSSÍVEL, A COOPERATIVAS, PONTOS DE COLETA CERTIFICADOS OU PROGRAMAS DE RECICLAGEM.</span>
            </li>
          </ol>
          <p style={{ marginBottom: 12, fontSize: '1.05rem' }}>
            E, POR ESTAREM DE PLENO ACORDO, ASSINAM ESTE TERMO EM DUAS VIAS DE IGUAL TEOR.
          </p>
          <p style={{ marginBottom: 24, fontSize: '1.05rem' }}>
            <b>{formData.local || '[LOCAL]'}</b>, <b>{formData.data || '[DATA]'}</b>
          </p>
          <div style={{ marginBottom: 24 }}>
            <div style={{ marginBottom: 24 }}>
              <div style={{ marginBottom: 8, fontSize: '1.05rem' }}>__________________________________</div>
              <div style={{ fontSize: '1.05rem' }}>[ASSINATURA DO DOADOR]</div>
              <div style={{ fontSize: '1.05rem' }}>CPF/CNPJ: {formData.cpfCnpjDoador || '__________'}</div>
            </div>
            <div>
              <div style={{ marginBottom: 8, fontSize: '1.05rem' }}>__________________________________</div>
              <div style={{ fontSize: '1.05rem' }}>[ASSINATURA DO PRESIDENTE DA APM]</div>
              <div style={{ fontSize: '1.05rem' }}>CPF: {formData.cpfPresidenteApm || '__________'}</div>
            </div>
          </div>
        </div>
        <img src={logoConectEdu} alt="Logo Conect Edu" style={{ position: 'absolute', bottom: 24, right: 24, width: 90, zIndex: 2 }} />
      </div>
    );
  }
  
  if (documentType === 'declaracao') {
    return (
      <div ref={ref} className="preview-paper" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Elementos decorativos */}
        <img src={decorTopLeft} alt="decor top left" style={{ position: 'absolute', top: 0, left: 0, width: 80, zIndex: 1 }} />
        <img src={decorTopRight} alt="decor top right" style={{ position: 'absolute', top: 0, right: 0, width: 80, zIndex: 1 }} />
        <img src={decorBottomLeft} alt="decor bottom left" style={{ position: 'absolute', bottom: 0, left: 0, width: 80, zIndex: 1 }} />
        
        <div className="preview-header" style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontSize: '2.2rem', marginBottom: 24, fontWeight: 600, letterSpacing: 1 }}>DECLARAÇÃO DE DOAÇÃO</h1>
        </div>
        
        <div className="preview-content" style={{ textAlign: 'justify', fontSize: '1.05rem', position: 'relative', zIndex: 2 }}>
          <p style={{ marginBottom: 24 }}>
            EU, <b>{formData.nomeDoador || '[NOME COMPLETO DO DOADOR]'}</b>, <b>{formData.nacionalidade || '[NACIONALIDADE]'}</b>, <b>{formData.estadoCivil || '[ESTADO CIVIL]'}</b>, <b>{formData.profissao || '[PROFISSÃO]'}</b>, INSCRITO NO CPF SOB O N° <b>{formData.cpfCnpjDoador || '[CPF]'}</b>, RESIDENTE À <b>{formData.enderecoDoador || '[ENDEREÇO COMPLETO]'}</b>, DECLARO, PARA OS DEVIDOS FINS, QUE ESTOU DOANDO DE FORMA GRATUITA, IRREVOGÁVEL E IRRETRATÁVEL, OS SEGUINTES BENS À:
          </p>

          {/* Seção DONATÁRIO */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ marginBottom: 8 }}>
              <b>ASSOCIAÇÃO DE PAIS E MESTRES (APM) DA {formData.nomeEscola || '[NOME DA ESCOLA]'}</b>
            </p>
            <p style={{ marginBottom: 8 }}>
              <b>CNPJ:</b> {formData.cnpjApm || '[CNPJ DA APM]'}
            </p>
            <p style={{ marginBottom: 8 }}>
              <b>ENDEREÇO:</b> {formData.enderecoApm || '[ENDEREÇO DA ESCOLA]'}
            </p>
          </div>

          {/* Tabela de bens declarados */}
          <div style={{ marginBottom: 24 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f0f0f0' }}>
                  <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>Item nº</th>
                  <th style={{ border: '1px solid #000', padding: '8px' }}>Descrição do Equipamento</th>
                  <th style={{ border: '1px solid #000', padding: '8px' }}>Marca/Modelo</th>
                  <th style={{ border: '1px solid #000', padding: '8px' }}>Nº de Série</th>
                  <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>Quantidade</th>
                  <th style={{ border: '1px solid #000', padding: '8px' }}>Estado de Conservação</th>
                  <th style={{ border: '1px solid #000', padding: '8px' }}>Valor Estimado</th>
                </tr>
              </thead>
              <tbody>
                {formData.bensRecebidos && formData.bensRecebidos.length > 0 ? (
                  formData.bensRecebidos.map((bem, index) => (
                    <tr key={bem.id || index}>
                      <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{index + 1}</td>
                      <td style={{ border: '1px solid #000', padding: '8px' }}>{bem.descricao || ''}</td>
                      <td style={{ border: '1px solid #000', padding: '8px' }}>{bem.marca || ''}</td>
                      <td style={{ border: '1px solid #000', padding: '8px' }}>{bem.serie || ''}</td>
                      <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{bem.quantidade || ''}</td>
                      <td style={{ border: '1px solid #000', padding: '8px' }}>{bem.estado || ''}</td>
                      <td style={{ border: '1px solid #000', padding: '8px' }}>{bem.valor ? `R$ ${bem.valor}` : ''}</td>
                    </tr>
                  ))
                ) : (
                  Array.from({ length: 4 }, (_, index) => (
                    <tr key={index}>
                      <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{index + 1}</td>
                      <td style={{ border: '1px solid #000', padding: '8px' }}></td>
                      <td style={{ border: '1px solid #000', padding: '8px' }}></td>
                      <td style={{ border: '1px solid #000', padding: '8px' }}></td>
                      <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}></td>
                      <td style={{ border: '1px solid #000', padding: '8px' }}></td>
                      <td style={{ border: '1px solid #000', padding: '8px' }}></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Declarações */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ marginBottom: 16 }}>
              DECLARO QUE OS BENS FORAM ENTREGUES À REFERIDA UNIDADE ESCOLAR NA DATA DE <b>{formData.dataEntrega || '[DATA DE ENTREGA]'}</b>, ESTANDO, SALVO INDICAÇÃO CONTRÁRIA, EM CONDIÇÕES NORMAIS DE USO E FUNCIONAMENTO.
            </p>
            <p style={{ marginBottom: 24 }}>
              ESTA DOAÇÃO DESTINA-SE A CONTRIBUIR COM O DESENVOLVIMENTO DAS ATIVIDADES PEDAGÓGICAS E ADMINISTRATIVAS DA UNIDADE ESCOLAR, CONFORME OS OBJETIVOS SOCIAIS DA APM.
            </p>
          </div>

          {/* Data e Assinaturas */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ marginBottom: 16 }}>
              <b>{formData.local || '[LOCAL]'}</b>, <b>{formData.dia || '[DIA]'}</b> DE <b>{formData.mes || '[MÊS POR EXTENSO]'}</b> DE <b>{formData.ano || '[ANO]'}</b>.
            </p>
            
            <div style={{ marginBottom: 32 }}>
              <div style={{ marginBottom: 8 }}>__________________________________</div>
              <div>[NOME COMPLETO]</div>
              <div>CPF: {formData.cpfCnpjDoador || '[CPF]'}</div>
            </div>
          </div>
        </div>
        <img src={logoConectEdu} alt="Logo Conect Edu" style={{ position: 'absolute', bottom: 24, right: 24, width: 90, zIndex: 2 }} />
      </div>
    );
  }
  
  if (documentType === 'recibo1' || documentType === 'recibo2') {
    const isPessoaJuridica = documentType === 'recibo1';
    return (
      <div ref={ref} className="preview-paper" style={{ position: 'relative', overflow: 'hidden' }}>
        {/* Elementos decorativos */}
        <img src={decorTopLeft} alt="decor top left" style={{ position: 'absolute', top: 0, left: 0, width: 80, zIndex: 1 }} />
        <img src={decorTopRight} alt="decor top right" style={{ position: 'absolute', top: 0, right: 0, width: 80, zIndex: 1 }} />
        <img src={decorBottomLeft} alt="decor bottom left" style={{ position: 'absolute', bottom: 0, left: 0, width: 80, zIndex: 1 }} />
        
        <div className="preview-header" style={{ position: 'relative', zIndex: 2 }}>
          <h1 style={{ fontSize: '2.2rem', marginBottom: 24, fontWeight: 600, letterSpacing: 1 }}>RECIBO DE DOAÇÃO</h1>
        </div>
        
        <div className="preview-content" style={{ textAlign: 'justify', fontSize: '1.05rem', position: 'relative', zIndex: 2 }}>
          {/* Seção RECEBEMOS DE */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 12 }}>
              {isPessoaJuridica ? 'RECEBEMOS DA EMPRESA:' : 'RECEBEMOS DE:'}
            </h3>
            
            {isPessoaJuridica ? (
              <>
                <p style={{ marginBottom: 8 }}>
                  <b>RAZÃO SOCIAL:</b> {formData.razaoSocial || '[RAZÃO SOCIAL DO DOADOR]'}
                </p>
                <p style={{ marginBottom: 8 }}>
                  <b>CNPJ:</b> {formData.cnpjDoador || '[CNPJ]'}
                </p>
                <p style={{ marginBottom: 8 }}>
                  <b>ENDEREÇO:</b> {formData.enderecoDoador || '[ENDEREÇO COMPLETO]'}
                </p>
                <p style={{ marginBottom: 8 }}>
                  <b>REPRESENTANTE LEGAL:</b> {formData.nomeRepresentante || '[NOME DO REPRESENTANTE]'} - CPF: {formData.cpfRepresentante || '[CPF]'}
                </p>
              </>
            ) : (
              <>
                <p style={{ marginBottom: 8 }}>
                  <b>NOME:</b> {formData.nomeDoador || '[NOME COMPLETO DO DOADOR]'}
                </p>
                <p style={{ marginBottom: 8 }}>
                  <b>CPF:</b> {formData.cpfDoador || '[CPF]'}
                </p>
                <p style={{ marginBottom: 8 }}>
                  <b>ENDEREÇO:</b> {formData.enderecoDoador || '[ENDEREÇO COMPLETO]'}
                </p>
              </>
            )}
          </div>

          {/* Cláusula introdutória */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ marginBottom: 16 }}>
              {isPessoaJuridica 
                ? 'A DOAÇÃO, DE FORMA GRATUITA E SEM ÔNUS, DOS SEGUINTES BENS:'
                : 'A DOAÇÃO, DE FORMA GRATUITA, IRREVOGÁVEL E IRRETRATÁVEL, DOS SEGUINTES BENS:'
              }
            </p>
          </div>

          {/* Tabela de equipamentos */}
          <div style={{ marginBottom: 24 }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', fontSize: '0.9rem' }}>
              <thead>
                <tr style={{ backgroundColor: '#f0f0f0' }}>
                  <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>Item nº</th>
                  <th style={{ border: '1px solid #000', padding: '8px' }}>Descrição do Equipamento</th>
                  <th style={{ border: '1px solid #000', padding: '8px' }}>Marca/Modelo</th>
                  <th style={{ border: '1px solid #000', padding: '8px' }}>Nº de Série</th>
                  <th style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>Quantidade</th>
                  <th style={{ border: '1px solid #000', padding: '8px' }}>Estado de Conservação</th>
                </tr>
              </thead>
              <tbody>
                {formData.equipamentosRecibo && formData.equipamentosRecibo.length > 0 ? (
                  formData.equipamentosRecibo.map((equipamento, index) => (
                    <tr key={equipamento.id || index}>
                      <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{index + 1}</td>
                      <td style={{ border: '1px solid #000', padding: '8px' }}>{equipamento.descricao || ''}</td>
                      <td style={{ border: '1px solid #000', padding: '8px' }}>{equipamento.marca || ''}</td>
                      <td style={{ border: '1px solid #000', padding: '8px' }}>{equipamento.serie || ''}</td>
                      <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{equipamento.quantidade || ''}</td>
                      <td style={{ border: '1px solid #000', padding: '8px' }}>{equipamento.estado || ''}</td>
                    </tr>
                  ))
                ) : (
                  Array.from({ length: 5 }, (_, index) => (
                    <tr key={index}>
                      <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}>{index + 1}</td>
                      <td style={{ border: '1px solid #000', padding: '8px' }}></td>
                      <td style={{ border: '1px solid #000', padding: '8px' }}></td>
                      <td style={{ border: '1px solid #000', padding: '8px' }}></td>
                      <td style={{ border: '1px solid #000', padding: '8px', textAlign: 'center' }}></td>
                      <td style={{ border: '1px solid #000', padding: '8px' }}></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Data da entrega e finalidade */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ marginBottom: 12 }}>
              <b>DATA DA ENTREGA:</b> {formData.dataEntrega || '[DATA DA ENTREGA]'}
            </p>
            <p style={{ marginBottom: 12 }}>
              <b>FINALIDADE DA DOAÇÃO:</b> {isPessoaJuridica 
                ? 'APOIO ÀS ATIVIDADES PEDAGÓGICAS E ADMINISTRATIVAS DA UNIDADE ESCOLAR.'
                : 'USO EXCLUSIVO NAS ATIVIDADES PEDAGÓGICAS E ADMINISTRATIVAS DA UNIDADE ESCOLAR.'
              }
            </p>
          </div>

          {/* Seção DONATÁRIO */}
          <div style={{ marginBottom: 24 }}>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: 12 }}>DONATÁRIO:</h3>
            <p style={{ marginBottom: 8 }}>
              <b>ASSOCIAÇÃO DE PAIS E MESTRES (APM) DA {formData.nomeEscola || '[NOME DA ESCOLA]'}</b>
            </p>
            <p style={{ marginBottom: 8 }}>
              <b>CNPJ:</b> {formData.cnpjApm || '[CNPJ DA APM]'}
            </p>
            <p style={{ marginBottom: 8 }}>
              <b>ENDEREÇO:</b> {formData.enderecoApm || '[ENDEREÇO DA ESCOLA]'}
            </p>
          </div>

          {/* Local, Data e Assinatura */}
          <div style={{ marginBottom: 24 }}>
            <p style={{ marginBottom: 16 }}>
              <b>{formData.local || '[LOCAL]'}</b>, <b>{formData.dia || '[DIA]'}</b> DE <b>{formData.mes || '[MÊS POR EXTENSO]'}</b> DE <b>{formData.ano || '[ANO]'}</b>.
            </p>
            
            <div style={{ marginBottom: 32 }}>
              <div style={{ marginBottom: 8 }}>__________________________________</div>
              <div>[NOME COMPLETO]</div>
              <div>PRESIDENTE DA APM - CPF: [CPF]</div>
            </div>
          </div>
        </div>
        
        <img src={logoConectEdu} alt="Logo Conect Edu" style={{ position: 'absolute', bottom: 24, right: 24, width: 90, zIndex: 2 }} />
      </div>
    );
  }
  
  // Para tipos desconhecidos, retornar uma mensagem simples
  return (
    <div ref={ref} style={{ padding: '20px', textAlign: 'center' }}>
      <h3>{getDocumentTypeLabel(documentType)}</h3>
      <p>Preview não disponível para este tipo de documento.</p>
    </div>
  );
});

const DocumentHistory = () => {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);
  const [showPreview, setShowPreview] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const previewRef = useRef(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Buscar sessão (sem logs desnecessários)
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session && session.user) {
          setUser(session.user);
          
          // Query otimizada: buscar apenas campos necessários e limitar resultados
          const { data, error } = await supabase
            .from('document_history')
            .select('id, document_type, generated_at, form_data')
            .eq('user_id', session.user.id)
            .order('generated_at', { ascending: false })
            .limit(100); // Limitar a 100 documentos mais recentes

          if (error) {
            setError(error.message);
          } else {
            setHistory(data || []);
          }
        } else {
          setError('Usuário não autenticado');
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };


  // Função para reimprimir documento
  const handleReprint = async (document) => {
    setSelectedDocument(document);
    setShowPreview(true);
  };

  // Função para gerar PDF do documento selecionado em formato A4 padrão
  const handleDownloadPDF = async () => {
    if (!previewRef.current) {
      alert('Erro: preview não disponível. Por favor, feche e abra novamente o preview.');
      return;
    }

    try {
      const input = previewRef.current;
      
      // Verificar se o elemento ainda existe no DOM
      if (!input || !input.parentElement) {
        alert('Erro: elemento não encontrado. Por favor, feche e abra novamente o preview.');
        return;
      }

      // No mobile, adicionar um pequeno delay para garantir que o elemento está pronto
      const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobile) {
        await new Promise(r => setTimeout(r, 300));
      } else {
        await new Promise(r => setTimeout(r, 100));
      }

      // Verificar novamente após o delay
      if (!previewRef.current) {
        alert('Erro: preview não disponível.');
        return;
      }
      
      // Configuração A4: 210mm x 297mm
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Capturar o elemento com escala adequada para A4
      const scale = isMobile ? 1.5 : 1.5; // Scale otimizado para mobile
      const canvas = await html2canvas(input, { 
        scale: scale,
        useCORS: true,
        logging: false,
        allowTaint: false,
        backgroundColor: '#ffffff',
        width: 794, // Largura A4 em pixels (210mm)
        height: 1123 // Altura A4 em pixels (297mm)
      });
      
      const imgData = canvas.toDataURL('image/png', 0.95);
      
      // Calcular dimensões da imagem para caber no A4
      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm
      
      // Proporção do canvas
      const imgWidth = canvas.width;
      const imgHeight = canvas.height;
      const ratio = Math.min(pdfWidth / imgWidth, pdfHeight / imgHeight);
      
      // Calcular dimensões finais mantendo proporção
      const finalWidth = imgWidth * ratio;
      const finalHeight = imgHeight * ratio;
      
      // Centralizar na página
      const xOffset = (pdfWidth - finalWidth) / 2;
      const yOffset = (pdfHeight - finalHeight) / 2;
      
      // Adicionar imagem ao PDF
      pdf.addImage(imgData, 'PNG', xOffset, yOffset, finalWidth, finalHeight);
      
      // Gerar nome único com timestamp para evitar conflitos
      const timestamp = new Date().getTime();
      const fileName = `${selectedDocument.document_type}_${timestamp}.pdf`;
      
      // No mobile, usar uma abordagem diferente para garantir que o download funcione
      if (isMobile) {
        // Criar um blob e usar download via link para melhor compatibilidade com mobile
        const pdfBlob = pdf.output('blob');
        const url = URL.createObjectURL(pdfBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = fileName;
        link.style.display = 'none';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        // Liberar o URL após um delay
        setTimeout(() => {
          URL.revokeObjectURL(url);
        }, 1000);
      } else {
        // No desktop, usar o método padrão
        pdf.save(fileName);
      }
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF: ' + error.message + '\n\nTente fechar e abrir o preview novamente.');
    }
  };

  // Função para fechar preview
  const handleClosePreview = () => {
    setShowPreview(false);
    setSelectedDocument(null);
  };

  if (loading) {
    return (
      <div className="dashboard-card p-4 text-light">
        <h3 className="mb-4 text-center">
          <i className="fas fa-history me-2"></i>Histórico de Documentos
        </h3>
        <div style={{ textAlign: 'center', color: '#4CAF50' }}>
          <i className="fas fa-spinner fa-spin me-2"></i>
          Carregando histórico...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="dashboard-card p-4 text-light">
        <h3 className="mb-4 text-center">
          <i className="fas fa-history me-2"></i>Histórico de Documentos
        </h3>
        <div style={{ textAlign: 'center', color: '#dc3545', padding: '20px' }}>
          <i className="fas fa-exclamation-triangle" style={{ fontSize: '2rem', marginBottom: '10px', display: 'block' }}></i>
          <p>Erro ao carregar histórico:</p>
          <p style={{ fontSize: '0.9rem', color: '#ccc' }}>{error}</p>
          <button 
            className="btn btn-primary mt-3"
            onClick={() => window.location.reload()}
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-card p-4 text-light">
      <h3 className="mb-4 text-center">
        <i className="fas fa-history me-2"></i>Histórico de Documentos
      </h3>
      
      {history.length === 0 ? (
        <div style={{ textAlign: 'center', color: '#ccc', padding: '40px 0' }}>
          <i className="fas fa-file-alt" style={{ fontSize: '3rem', marginBottom: '20px', display: 'block' }}></i>
          <p>Nenhum documento gerado ainda.</p>
          <p>Gere seu primeiro documento na seção "Gerar Documentos"!</p>
        </div>
      ) : (
        <div className="history-list">
          {history.map((item, index) => (
            <div key={index} className="history-item">
              <div className="history-header">
                <div className="history-type">
                  <i className="fas fa-file-alt me-2"></i>
                  {getDocumentTypeLabel(item.document_type)}
                </div>
                <div className="history-date">
                  {formatDate(item.generated_at)}
                </div>
              </div>
              
              {item.form_data && (
                <div className="history-details">
                  {item.form_data.nomeDoador && (
                    <div className="detail-item">
                      <strong>Doador:</strong> {item.form_data.nomeDoador}
                    </div>
                  )}
                  {item.form_data.nomeEscola && (
                    <div className="detail-item">
                      <strong>Escola:</strong> {item.form_data.nomeEscola}
                    </div>
                  )}
                  {item.form_data.local && (
                    <div className="detail-item">
                      <strong>Local:</strong> {item.form_data.local}
                    </div>
                  )}
                  {item.form_data.data && (
                    <div className="detail-item">
                      <strong>Data:</strong> {item.form_data.data}
                    </div>
                  )}
                </div>
              )}
              
              <div className="history-actions mt-3">
                <button 
                  className="btn btn-success btn-sm me-2"
                  onClick={() => handleReprint(item)}
                >
                  <i className="fas fa-print me-1"></i>
                  Reimprimir
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      {/* Modal de Preview e Reimpressão */}
      {showPreview && selectedDocument && (
        <div className="modal-overlay" style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '20px'
        }}>
          <div className="modal-content" style={{
            backgroundColor: 'white',
            borderRadius: '10px',
            padding: '20px',
            maxWidth: '90%',
            maxHeight: '90%',
            overflow: 'auto',
            position: 'relative'
          }}>
            <div className="modal-header" style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '20px',
              paddingBottom: '10px',
              borderBottom: '1px solid #ddd'
            }}>
              <h4>Preview - {getDocumentTypeLabel(selectedDocument.document_type)}</h4>
              <div>
                <button 
                  className="btn btn-success me-2"
                  onClick={handleDownloadPDF}
                >
                  <i className="fas fa-download me-1"></i>
                  Baixar PDF
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={handleClosePreview}
                >
                  <i className="fas fa-times me-1"></i>
                  Fechar
                </button>
              </div>
            </div>
            
            <div className="modal-body">
              <DocumentPreview 
                ref={previewRef}
                documentType={selectedDocument.document_type}
                formData={selectedDocument.form_data}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DocumentHistory;