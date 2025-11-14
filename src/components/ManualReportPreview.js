import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../pages/generateReport.css';
import logoConectEdu from '../assets/img/LogoConectEdu7.png';

const displayValue = (value, fallback = '—') => {
  if (value === null || value === undefined) return fallback;
  const trimmed = String(value).trim();
  return trimmed.length ? trimmed : fallback;
};

const formatAddress = ({ rua, numero, bairro, cidade, estado }) => {
  const parts = [rua, numero, bairro, cidade && `${cidade}`, estado].filter(Boolean);
  return parts.length ? parts.join(', ') : '—';
};

const Section = ({ title, children }) => (
  <section className="preview-section">
    <h3>{title}</h3>
    {children}
  </section>
);

const InfoGrid = ({ items }) => (
  <div className="preview-info-grid">
    {items.map(({ label, value }, index) => (
      <div className="preview-info-row" key={index}>
        <span className="preview-info-label">{label}</span>
        <span className="preview-info-value">{displayValue(value)}</span>
      </div>
    ))}
  </div>
);

const ItemsTable = ({ headers, rows, emptyRows = 0 }) => (
  <table className="preview-table">
    <thead>
      <tr>
        {headers.map((header, idx) => (
          <th key={idx}>{header}</th>
        ))}
      </tr>
    </thead>
    <tbody>
      {rows.map((row, idx) => (
        <tr key={idx}>
          {row.map((cell, cellIdx) => (
            <td key={`${idx}-${cellIdx}`}>{displayValue(cell)}</td>
          ))}
        </tr>
      ))}
      {Array.from({ length: emptyRows }).map((_, idx) => (
        <tr key={`empty-${idx}`}>
          {headers.map((_, cellIdx) => (
            <td key={`empty-${idx}-${cellIdx}`}></td>
          ))}
        </tr>
      ))}
    </tbody>
  </table>
);

const ManualReportPreview = forwardRef(({ reportType, formData }, ref) => {
  const previewRef = useRef();
  const wrapperRef = useRef();
  const [scale, setScale] = useState(1);

  // Novo método para gerar PDF em formato A4 padrão
  const handleDownloadPDF = async () => {
    try {
      const input = previewRef.current;
      // Aguarda renderização
      await new Promise(r => setTimeout(r, 100));

      // Remover transform durante a captura para manter proporção original
      const previousTransform = input.style.transform;
      const previousTransformOrigin = input.style.transformOrigin;
      input.style.transform = 'scale(1)';
      input.style.transformOrigin = 'top left';
      
      // Configuração A4: 210mm x 297mm
      // jsPDF usa mm por padrão, então vamos usar 'a4' ou [210, 297]
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4' // Formato A4 padrão: 210mm x 297mm
      });
      
      // Capturar o elemento com escala adequada para A4
      // Calcular a escala baseada no tamanho A4 em pixels (considerando 96 DPI)
      // 210mm = 794px, 297mm = 1123px (aproximadamente)
      const scale = 1.5; // Escala reduzida para melhor qualidade/performance
      
      const canvas = await html2canvas(input, { 
        scale: scale,
        useCORS: true,
        logging: false,
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
      pdf.save('documento.pdf');

      // Restaurar transform original
      input.style.transform = previousTransform;
      input.style.transformOrigin = previousTransformOrigin;
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF: ' + error.message);
    }
  };

  useEffect(() => {
    const updateScale = () => {
      if (!wrapperRef.current) return;
      const availableWidth = wrapperRef.current.offsetWidth;
      const naturalWidth = 794;
      const newScale = Math.min(1, availableWidth / naturalWidth);
      setScale(newScale > 0 ? newScale : 1);
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useImperativeHandle(ref, () => ({
    handleDownloadPDF
  }));

  const renderWithScale = (children) => (
    <div
      className="preview-scale-container"
      ref={wrapperRef}
      style={{ minHeight: `${1123 * scale}px` }}
    >
      <div
        ref={previewRef}
        className="preview-paper"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top center'
        }}
      >
        <div className="preview-structure">{children}</div>
      </div>
    </div>
  );

  const DocumentShell = ({ title, subtitle, children }) =>
    renderWithScale(
      <>
        <header className="preview-header">
          <div>
            <span>{subtitle || 'Documento gerado automaticamente pela ConectEdu'}</span>
          </div>
          <h1>{title}</h1>
        </header>
        <div className="preview-body">{children}</div>
        <footer className="preview-footer">
          <span>ConectEdu • conectado para facilitar doações com segurança</span>
          <img src={logoConectEdu} alt="Logo Conect Edu" />
        </footer>
      </>
    );

  // Modelos de texto baseados nos exemplos enviados
  if (reportType === 'termo') {
    const equipamentos = formData.equipamentos && formData.equipamentos.length > 0 ? formData.equipamentos : [];

    return DocumentShell({
      title: 'Termo de Doação',
      subtitle: `${displayValue(formData.local, 'Local não informado')} • ${displayValue(formData.data, 'Data não informada')}`,
      children: (
        <>
          <Section title="Dados do Doador">
            <InfoGrid
              items={[
                { label: 'Nome completo', value: formData.nomeDoador || '[NOME DO DOADOR]' },
                { label: 'CPF/CNPJ', value: formData.cpfCnpjDoador || '[CPF/CNPJ]' },
                {
                  label: 'Endereço',
                  value: formData.enderecoDoador || formatAddress({
                    rua: formData.ruaDoador,
                    numero: formData.numeroDoador,
                    bairro: formData.bairroDoador,
                    cidade: formData.cidadeDoador,
                    estado: formData.estadoDoador
                  })
                }
              ]}
            />
          </Section>

          <Section title="Itens doados">
            <ItemsTable
              headers={['Item', 'Descrição', 'Marca/Modelo', 'Nº Série', 'Qtd', 'Estado']}
              rows={equipamentos.map((equip, index) => [
                index + 1,
                equip.descricao,
                equip.marca,
                equip.serie,
                equip.quantidade,
                equip.estado
              ])}
              emptyRows={Math.max(0, 4 - equipamentos.length)}
            />
          </Section>

          <Section title="Condições e responsabilidades">
            <ol className="preview-list">
              <li>A doação é gratuita, irrevogável e destinada às atividades pedagógicas da unidade escolar.</li>
              <li>O doador garante que os itens não possuem dados sensíveis e estão livres de ônus.</li>
              <li>A instituição compromete-se com o descarte ambientalmente correto ao final da vida útil.</li>
            </ol>
          </Section>

          <Section title="Formalização">
            <InfoGrid
              items={[
                { label: 'Cidade', value: formData.local || '[LOCAL]' },
                { label: 'Data', value: formData.data || '[DATA]' }
              ]}
            />
            <div style={{ display: 'flex', gap: '32px', marginTop: '18px' }}>
              <div style={{ flex: 1 }}>
                <div>__________________________________</div>
                <small>Doador</small>
              </div>
              <div style={{ flex: 1 }}>
                <div>__________________________________</div>
                <small>Representante da APM</small>
              </div>
            </div>
          </Section>
        </>
      )
    });
  }

  if (reportType === 'declaracao') {
    const bens = formData.bensRecebidos && formData.bensRecebidos.length > 0 ? formData.bensRecebidos : [];

    return DocumentShell({
      title: 'Declaração de Doação',
      subtitle: `${displayValue(formData.local, 'Local não informado')} • ${displayValue(formData.dataEntrega, 'Data não informada')}`,
      children: (
        <>
          <Section title="Dados do Doador">
            <InfoGrid
              items={[
                { label: 'Nome', value: formData.nomeDoador || '[NOME COMPLETO]' },
                { label: 'CPF', value: formData.cpfCnpjDoador || '[CPF]' },
                { label: 'Nacionalidade', value: formData.nacionalidade || 'Brasileira' },
                { label: 'Estado civil', value: formData.estadoCivil || 'Solteiro(a)' },
                { label: 'Profissão', value: formData.profissao || '[PROFISSÃO]' },
                {
                  label: 'Endereço',
                  value: formData.enderecoDoador || formatAddress({
                    rua: formData.ruaDoador,
                    numero: formData.numeroDoador,
                    bairro: formData.bairroDoador,
                    cidade: formData.cidadeDoador,
                    estado: formData.estadoDoador
                  })
                }
              ]}
            />
          </Section>

          <Section title="Dados da instituição">
            <InfoGrid
              items={[
                { label: 'APM / Escola', value: formData.nomeEscola || '[NOME DA ESCOLA]' },
                { label: 'CNPJ', value: formData.cnpjApm || '[CNPJ DA APM]' },
                { label: 'Endereço', value: formData.enderecoApm || '[ENDEREÇO]' }
              ]}
            />
          </Section>

          <Section title="Itens declarados">
            <ItemsTable
              headers={['Item', 'Descrição', 'Marca/Modelo', 'Nº Série', 'Qtd', 'Estado', 'Valor']}
              rows={bens.map((bem, index) => [
                index + 1,
                bem.descricao,
                bem.marca,
                bem.serie,
                bem.quantidade,
                bem.estado,
                bem.valor ? `R$ ${bem.valor}` : ''
              ])}
              emptyRows={Math.max(0, 4 - bens.length)}
            />
          </Section>

          <Section title="Declarações">
            <p>
              Declaro que os bens foram entregues em {displayValue(formData.dataEntrega, '[DATA DE ENTREGA]')} e destinam-se exclusivamente às atividades pedagógicas e administrativas da unidade escolar beneficiada.
            </p>
          </Section>

          <Section title="Assinatura">
            <InfoGrid
              items={[
                { label: 'Cidade', value: formData.local || '[LOCAL]' },
                {
                  label: 'Data',
                  value: `${displayValue(formData.dia || '[DIA]')} de ${displayValue(formData.mes || '[MÊS]')} de ${displayValue(formData.ano || '[ANO]')}`
                }
              ]}
            />
            <div style={{ marginTop: '24px' }}>
              <div>__________________________________</div>
              <small>Doador</small>
            </div>
          </Section>
        </>
      )
    });
  }

  if (reportType === 'recibo1' || reportType === 'recibo2') {
    const isPessoaJuridica = reportType === 'recibo1';
    const equipamentos =
      formData.equipamentosRecibo && formData.equipamentosRecibo.length > 0
        ? formData.equipamentosRecibo
        : [];

    return DocumentShell({
      title: 'Recibo de Doação',
      subtitle: displayValue(formData.local, 'Local não informado'),
      children: (
        <>
          <Section title={isPessoaJuridica ? 'Doador (Pessoa Jurídica)' : 'Doador'}>
            {isPessoaJuridica ? (
              <InfoGrid
                items={[
                  { label: 'Razão social', value: formData.razaoSocial || '[RAZÃO SOCIAL]' },
                  { label: 'CNPJ', value: formData.cnpjDoador || '[CNPJ]' },
                  { label: 'Endereço', value: formData.enderecoDoador || '[ENDEREÇO]' },
                  {
                    label: 'Representante',
                    value: `${displayValue(formData.nomeRepresentante || '[NOME]')} - CPF: ${displayValue(formData.cpfRepresentante || '[CPF]')}`
                  }
                ]}
              />
            ) : (
              <InfoGrid
                items={[
                  { label: 'Nome', value: formData.nomeDoador || '[NOME COMPLETO]' },
                  { label: 'CPF', value: formData.cpfDoador || '[CPF]' },
                  { label: 'Endereço', value: formData.enderecoDoador || '[ENDEREÇO]' }
                ]}
              />
            )}
          </Section>

          <Section title="Itens recebidos">
            <ItemsTable
              headers={['Item', 'Descrição', 'Marca/Modelo', 'Nº Série', 'Qtd', 'Estado']}
              rows={equipamentos.map((equip, index) => [
                index + 1,
                equip.descricao,
                equip.marca,
                equip.serie,
                equip.quantidade,
                equip.estado
              ])}
              emptyRows={Math.max(0, 4 - equipamentos.length)}
            />
          </Section>

          <Section title="Donatário">
            <InfoGrid
              items={[
                { label: 'APM / Escola', value: formData.nomeEscola || '[NOME DA ESCOLA]' },
                { label: 'CNPJ', value: formData.cnpjApm || '[CNPJ DA APM]' },
                { label: 'Endereço', value: formData.enderecoApm || '[ENDEREÇO]' }
              ]}
            />
          </Section>

          <Section title="Formalização">
            <InfoGrid
              items={[
                { label: 'Data da entrega', value: formData.dataEntrega || '[DATA]' },
                {
                  label: 'Finalidade',
                  value: isPessoaJuridica
                    ? 'Apoio às atividades pedagógicas e administrativas.'
                    : 'Uso exclusivo nas atividades pedagógicas da escola.'
                },
                {
                  label: 'Data do recibo',
                  value: `${displayValue(formData.dia || '[DIA]')} de ${displayValue(formData.mes || '[MÊS]')} de ${displayValue(formData.ano || '[ANO]')}`
                }
              ]}
            />

            <div style={{ display: 'flex', gap: '32px', marginTop: '18px' }}>
              <div style={{ flex: 1 }}>
                <div>__________________________________</div>
                <small>Representante da APM</small>
              </div>
              <div style={{ flex: 1 }}>
                <div>__________________________________</div>
                <small>Assinatura do Doador</small>
              </div>
            </div>
          </Section>
        </>
      )
    });
  }

  return null;
});

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
    
    return renderWithScale(
      <>
        <div style={{ position: 'relative', overflow: 'hidden' }}>
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
export default ManualReportPreview; 