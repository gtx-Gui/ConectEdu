import React, { forwardRef, useImperativeHandle, useRef } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../pages/generateReport.css';
import decorTopLeft from '../assets/img/DocVisualElements/top-left.png';
import decorTopRight from '../assets/img/DocVisualElements/top-rigth.png';
import decorBottomLeft from '../assets/img/DocVisualElements/bottom-left.png';
import logoConectEdu from '../assets/img/LogoConectEdu7.png';

// Função utilitária para converter imagem importada em base64 usando canvas
function getBase64FromImage(imgSrc) {
  return new Promise((resolve, reject) => {
    console.log('Tentando converter imagem:', imgSrc);
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      console.log('Imagem carregada com sucesso:', imgSrc);
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      const dataURL = canvas.toDataURL('image/png');
      console.log('Imagem convertida para base64:', dataURL.substring(0, 50) + '...');
      resolve(dataURL);
    };
    img.onerror = (error) => {
      console.error('Erro ao carregar imagem:', imgSrc, error);
      reject(error);
    };
    img.src = imgSrc;
  });
}

// Função alternativa usando fetch
function getBase64FromFetch(imgSrc) {
  return fetch(imgSrc)
    .then(res => {
      console.log('Fetch response:', res.status, res.statusText);
      return res.blob();
    })
    .then(blob => {
      console.log('Blob criado:', blob.size, 'bytes');
      return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onloadend = () => {
          console.log('FileReader concluído');
          resolve(reader.result);
        };
        reader.onerror = reject;
        reader.readAsDataURL(blob);
      });
    });
}

const ManualReportPreview = forwardRef(({ reportType, formData, onBack }, ref) => {
  const previewRef = useRef();

  // Novo método para gerar PDF idêntico ao preview
  const handleDownloadPDF = async () => {
    try {
      const input = previewRef.current;
      // Aguarda renderização
      await new Promise(r => setTimeout(r, 100));
      const canvas = await html2canvas(input, { scale: 2, useCORS: true });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height]
      });
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save('documento.pdf');
    } catch (error) {
      alert('Erro ao gerar PDF: ' + error.message);
    }
  };

  useImperativeHandle(ref, () => ({
    handleDownloadPDF
  }));

  // Modelos de texto baseados nos exemplos enviados
  if (reportType === 'termo') {
    return (
      <div ref={previewRef} className="preview-paper" style={{ position: 'relative', overflow: 'hidden' }}>
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
                  // Linhas vazias se não houver equipamentos
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
        {/* Logo no rodapé direito */}
        <img src={logoConectEdu} alt="Logo Conect Edu" style={{ position: 'absolute', bottom: 24, right: 24, width: 90, zIndex: 2 }} />
      </div>
    );
  }
  if (reportType === 'declaracao') {
    return (
      <>
        {/* DECLARAÇÃO DE DOAÇÃO */}
        <div ref={previewRef} className="preview-paper" style={{ position: 'relative', overflow: 'hidden' }}>
          {/* Elementos decorativos */}
          <img src={decorTopLeft} alt="decor top left" style={{ position: 'absolute', top: 0, left: 0, width: 80, zIndex: 1 }} />
          <img src={decorTopRight} alt="decor top right" style={{ position: 'absolute', top: 0, right: 0, width: 80, zIndex: 1 }} />
          <img src={decorBottomLeft} alt="decor bottom left" style={{ position: 'absolute', bottom: 0, left: 0, width: 80, zIndex: 1 }} />
          
          <div className="preview-header" style={{ position: 'relative', zIndex: 2 }}>
            <h1 style={{ fontSize: '2.2rem', marginBottom: 24, fontWeight: 600, letterSpacing: 1 }}>DECLARAÇÃO DE DOAÇÃO</h1>
          </div>
          
          <div className="preview-content" style={{ textAlign: 'justify', fontSize: '1.05rem', position: 'relative', zIndex: 2 }}>
            {/* Parágrafo introdutório */}
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
                    // Linhas vazias se não houver bens declarados
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
          {/* Logo no rodapé direito */}
          <img src={logoConectEdu} alt="Logo Conect Edu" style={{ position: 'absolute', bottom: 24, right: 24, width: 90, zIndex: 2 }} />
        </div>
      </>
    );
  }
  if (reportType === 'recibo1' || reportType === 'recibo2') {
    const isPessoaJuridica = reportType === 'recibo1';
    
    return (
      <>
        <div ref={previewRef} className="preview-paper" style={{ position: 'relative', overflow: 'hidden' }}>
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
                    // Linhas vazias se não houver equipamentos
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
          
          {/* Logo no rodapé direito */}
          <img src={logoConectEdu} alt="Logo Conect Edu" style={{ position: 'absolute', bottom: 24, right: 24, width: 90, zIndex: 2 }} />
        </div>
      </>
    );
  }
  return null;
});

export default ManualReportPreview; 