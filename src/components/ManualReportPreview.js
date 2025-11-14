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
  const parts = [rua, numero, bairro, cidade, estado].filter(Boolean);
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
  const previewRef = useRef(null);
  const wrapperRef = useRef(null);
  const [scale, setScale] = useState(1);

  const handleDownloadPDF = async () => {
    try {
      const input = previewRef.current;
      await new Promise((resolve) => setTimeout(resolve, 100));

      const previousTransform = input.style.transform;
      const previousOrigin = input.style.transformOrigin;
      input.style.transform = 'scale(1)';
      input.style.transformOrigin = 'top left';

      const pdf = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' });

      const canvas = await html2canvas(input, {
        scale: 1.5,
        useCORS: true,
        logging: false,
        width: 794,
        height: 1123
      });

      const imgData = canvas.toDataURL('image/png', 0.95);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const ratio = Math.min(pdfWidth / canvas.width, pdfHeight / canvas.height);
      const finalWidth = canvas.width * ratio;
      const finalHeight = canvas.height * ratio;

      pdf.addImage(
        imgData,
        'PNG',
        (pdfWidth - finalWidth) / 2,
        (pdfHeight - finalHeight) / 2,
        finalWidth,
        finalHeight
      );
      pdf.save('documento.pdf');

      input.style.transform = previousTransform;
      input.style.transformOrigin = previousOrigin;
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
      setScale(Math.min(1, availableWidth / naturalWidth));
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  useImperativeHandle(ref, () => ({
    handleDownloadPDF
  }));

  const renderWithScale = (children) => (
    <div className="preview-scale-container" ref={wrapperRef} style={{ minHeight: `${1123 * scale}px` }}>
      <div
        ref={previewRef}
        className="preview-paper"
        style={{ transform: `scale(${scale})`, transformOrigin: 'top center' }}
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
          <img src={logoConectEdu} alt="Logo ConectEdu" />
        </footer>
      </>
    );

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
                  value: `${displayValue(formData.dia || '[DIA]')} de ${displayValue(formData.mes || '[MÊS]')} de ${displayValue(
                    formData.ano || '[ANO]'
                  )}`
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
                  {
                    label: 'Endereço',
                    value: formData.enderecoDoador || formatAddress({
                      rua: formData.ruaDoador,
                      numero: formData.numeroDoador,
                      bairro: formData.bairroDoador,
                      cidade: formData.cidadeDoador,
                      estado: formData.estadoDoador
                    })
                  },
                  {
                    label: 'Representante',
                    value: `${displayValue(formData.nomeRepresentante || '[NOME]')} - CPF: ${displayValue(
                      formData.cpfRepresentante || '[CPF]'
                    )}`
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
                  value: `${displayValue(formData.dia || '[DIA]')} de ${displayValue(formData.mes || '[MÊS]')} de ${displayValue(
                    formData.ano || '[ANO]'
                  )}`
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

export default ManualReportPreview;

