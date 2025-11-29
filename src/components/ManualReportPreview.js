import React, { forwardRef, useImperativeHandle, useRef, useEffect, useState } from 'react';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import '../pages/generateReport.css';
import decorTopLeft from '../assets/img/DocVisualElements/top-left.png';
import decorTopRight from '../assets/img/DocVisualElements/top-rigth.png';
import decorBottomLeft from '../assets/img/DocVisualElements/bottom-left.png';
import logoConectEdu from '../assets/img/LogoConectEdu7.png';

const A4_WIDTH = 794; // px (~210mm)
const A4_HEIGHT = 1123; // px (~297mm)

// Margens ABNT (NBR 14724:2011)
// Margem esquerda: 3 cm = 113px
// Margem direita: 2 cm = 76px
// Margem superior: 3 cm = 113px
// Margem inferior: 2 cm = 76px
const ABNT_MARGIN_LEFT = 113; // 3 cm
const ABNT_MARGIN_RIGHT = 76; // 2 cm
const ABNT_MARGIN_TOP = 113; // 3 cm
const ABNT_MARGIN_BOTTOM = 76; // 2 cm

// Documento planejado para até 5 equipamentos em uma única página A4
const MAX_EQUIPMENTS = 5;
const BASE_CONTENT_HEIGHT = 810; // Conteúdo fixo (sem tabela)
const HEIGHT_PER_EQUIPMENT = 100; // Altura média por linha da tabela
const AVAILABLE_CONTENT_HEIGHT = A4_HEIGHT - (ABNT_MARGIN_TOP + ABNT_MARGIN_BOTTOM); // Descontando margens ABNT
const SAFETY_MARGIN = 0.94; // 6% de margem para evitar cortes
const FIXED_SIZE_FACTOR = Math.min(
  0.96,
  Math.max(
    0.73,
    (AVAILABLE_CONTENT_HEIGHT * SAFETY_MARGIN) /
      (BASE_CONTENT_HEIGHT + MAX_EQUIPMENTS * HEIGHT_PER_EQUIPMENT)
  )
);

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
  const wrapperRef = useRef();
  const [scale, setScale] = useState(1);
  const [shouldScale, setShouldScale] = useState(false);
  const [scaledWidth, setScaledWidth] = useState(A4_WIDTH);
  const sizeFactor = FIXED_SIZE_FACTOR;
  

  // Novo método para gerar PDF em formato A4 padrão
  const handleDownloadPDF = async () => {
    try {
      const input = previewRef.current;
      const wrapper = wrapperRef.current;
      
      if (!input) {
        alert('Erro: elemento de preview não encontrado');
        return;
      }

      // Verificar se está no mobile
      const isMobile = typeof window !== 'undefined' && window.innerWidth <= 768;
      
      // Salvar estilos atuais do elemento
      const previousWidth = input.style.width;
      const previousMaxWidth = input.style.maxWidth;
      const previousMinWidth = input.style.minWidth;
      const previousTransform = input.style.transform;
      const previousTransformOrigin = input.style.transformOrigin;
      const previousWrapperWidth = wrapper ? wrapper.style.width : null;
      const previousWrapperMaxWidth = wrapper ? wrapper.style.maxWidth : null;
      const previousWrapperMinWidth = wrapper ? wrapper.style.minWidth : null;
      const previousWrapperHeight = wrapper ? wrapper.style.height : null;
      const previousWrapperOverflow = wrapper ? wrapper.style.overflow : null;

      // Salvar altura original
      const previousHeight = input.style.height;
      const previousMinHeight = input.style.minHeight;
      const previousMaxHeight = input.style.maxHeight;
      const previousOverflow = input.style.overflow;
      
      // Garantir que o elemento tenha largura A4 mas possa crescer em altura
      if (wrapper) {
        wrapper.style.width = `${A4_WIDTH}px`;
        wrapper.style.maxWidth = `${A4_WIDTH}px`;
        wrapper.style.minWidth = `${A4_WIDTH}px`;
        wrapper.style.overflow = 'visible';
      }
      
      // Garantir que o elemento sempre tenha tamanho A4 fixo
      input.style.width = `${A4_WIDTH}px`;
      input.style.maxWidth = `${A4_WIDTH}px`;
      input.style.minWidth = `${A4_WIDTH}px`;
      input.style.height = `${A4_HEIGHT}px`;
      input.style.minHeight = `${A4_HEIGHT}px`;
      input.style.maxHeight = `${A4_HEIGHT}px`;
      input.style.transform = 'none';
      input.style.transformOrigin = 'top left';
      input.style.overflow = 'hidden';
      
      if (wrapper) {
        wrapper.style.width = `${A4_WIDTH}px`;
        wrapper.style.maxWidth = `${A4_WIDTH}px`;
        wrapper.style.minWidth = `${A4_WIDTH}px`;
        wrapper.style.overflow = 'hidden';
      }
      
      // Aguardar renderização
      await new Promise(r => setTimeout(r, 300));
      
      // Criar PDF em formato A4 (sempre uma única página)
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Capturar elemento com tamanho A4 fixo
      const canvas = await html2canvas(input, { 
        scale: 2,
        useCORS: true,
        logging: false,
        width: A4_WIDTH,
        height: A4_HEIGHT,
        windowWidth: A4_WIDTH,
        windowHeight: A4_HEIGHT,
        scrollX: 0,
        scrollY: 0
      });
      
      const imgData = canvas.toDataURL('image/png', 0.95);
      const pdfWidth = pdf.internal.pageSize.getWidth(); // 210mm
      const pdfHeight = pdf.internal.pageSize.getHeight(); // 297mm
      
      // Adicionar imagem completa em uma única página A4
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight, undefined, 'FAST');
      
      // Gerar nome único com timestamp para evitar conflitos
      const timestamp = new Date().getTime();
      const fileName = `documento_${timestamp}.pdf`;
      
      // No mobile, usar uma abordagem diferente para garantir que o download funcione múltiplas vezes
      const isMobileDevice = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      if (isMobileDevice) {
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

      // Restaurar estilos originais
      if (wrapper) {
        if (previousWrapperWidth !== null) wrapper.style.width = previousWrapperWidth;
        else wrapper.style.width = '';
        
        if (previousWrapperMaxWidth !== null) wrapper.style.maxWidth = previousWrapperMaxWidth;
        else wrapper.style.maxWidth = '';
        
        if (previousWrapperMinWidth !== null) wrapper.style.minWidth = previousWrapperMinWidth;
        else wrapper.style.minWidth = '';
        
        if (previousWrapperHeight !== null) wrapper.style.height = previousWrapperHeight;
        else wrapper.style.height = '';
        
        if (previousWrapperOverflow !== null) wrapper.style.overflow = previousWrapperOverflow;
        else wrapper.style.overflow = '';
      }
      
      // Restaurar preview-paper
      if (previousWidth !== null) input.style.width = previousWidth;
      else input.style.width = '';
      
      if (previousMaxWidth !== null) input.style.maxWidth = previousMaxWidth;
      else input.style.maxWidth = '';
      
      if (previousMinWidth !== null) input.style.minWidth = previousMinWidth;
      else input.style.minWidth = '';
      
      if (previousHeight !== null) input.style.height = previousHeight;
      else input.style.height = '';
      
      if (previousMinHeight !== null) input.style.minHeight = previousMinHeight;
      else input.style.minHeight = '';
      
      if (previousMaxHeight !== null) input.style.maxHeight = previousMaxHeight;
      else input.style.maxHeight = '';
      
      if (previousOverflow !== null) input.style.overflow = previousOverflow;
      else input.style.overflow = '';
      
      if (previousTransform !== null) input.style.transform = previousTransform;
      else input.style.transform = '';
      
      if (previousTransformOrigin !== null) input.style.transformOrigin = previousTransformOrigin;
      else input.style.transformOrigin = '';
      
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF: ' + error.message);
    }
  };

  useEffect(() => {
    const updateScale = () => {
      if (typeof window === 'undefined') return;
      const viewportWidth = window.innerWidth || document.documentElement.clientWidth || A4_WIDTH;
      const isMobile = viewportWidth <= 768;

      if (isMobile) {
        // NO MOBILE: Não usar scale, deixar CSS fazer o trabalho com 100vw
        setScale(1);
        setScaledWidth(viewportWidth);
        setShouldScale(false); // Desabilitar scale no mobile
        
      } else {
        setScale(1);
        setScaledWidth(A4_WIDTH);
        setShouldScale(false);
      }
    };

    updateScale();
    window.addEventListener('resize', updateScale);
    return () => window.removeEventListener('resize', updateScale);
  }, []);


  useImperativeHandle(ref, () => ({
    handleDownloadPDF
  }));

  const renderWithScale = (children) => {
    const viewportWidth = typeof window !== 'undefined' ? (window.innerWidth || document.documentElement.clientWidth) : A4_WIDTH;
    const isMobile = viewportWidth <= 768;

    // NO MOBILE: Simplificar completamente - sem scale, apenas CSS
    if (isMobile) {
      return (
        <div
          className="preview-scale-container"
          ref={wrapperRef}
          style={{
            width: '100vw',
            maxWidth: '100vw',
            minWidth: '100vw',
            margin: 0,
            padding: 0,
            position: 'relative',
            boxSizing: 'border-box',
            overflow: 'visible' // Garantir que decores não sejam cortados
          }}
        >
          <div
            ref={previewRef}
            className="preview-paper"
            style={{
              width: `${A4_WIDTH}px`,
              height: `${A4_HEIGHT}px`,
              minHeight: `${A4_HEIGHT}px`,
              maxHeight: `${A4_HEIGHT}px`,
              transform: 'none',
              transformOrigin: 'top left',
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              margin: '0 auto',
              boxSizing: 'border-box'
            }}
          >
            {children}
          </div>
        </div>
      );
    }

    // DESKTOP: Comportamento original
    return (
      <div
        className="preview-scale-container"
        ref={wrapperRef}
        style={{
          width: '100%',
          maxWidth: '100%',
          margin: '0 auto',
          padding: 0,
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center'
        }}
      >
        <div
          ref={previewRef}
          className="preview-paper"
          style={{
            width: `${A4_WIDTH}px`,
            height: `${A4_HEIGHT}px`,
            minHeight: `${A4_HEIGHT}px`,
            maxHeight: `${A4_HEIGHT}px`,
            transform: 'none',
            transformOrigin: 'top left',
            margin: '0 auto',
            overflow: 'hidden',
            display: 'flex',
            flexDirection: 'column'
          }}
        >
          {children}
        </div>
      </div>
    );
  };

  // Modelos de texto baseados nos exemplos enviados
  if (reportType === 'termo') {
    const viewportWidth = typeof window !== 'undefined' ? (window.innerWidth || document.documentElement.clientWidth) : A4_WIDTH;
    const isMobile = viewportWidth <= 768;
    
    return renderWithScale(
      <div style={{ position: 'relative', overflow: 'hidden', paddingLeft: 0, marginLeft: 0, height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', paddingTop: `${ABNT_MARGIN_TOP * sizeFactor}px`, paddingRight: `${ABNT_MARGIN_RIGHT * sizeFactor}px`, paddingBottom: `${ABNT_MARGIN_BOTTOM * sizeFactor}px`, paddingLeft: `${ABNT_MARGIN_LEFT * sizeFactor}px`, minHeight: `${A4_HEIGHT - ((ABNT_MARGIN_TOP + ABNT_MARGIN_BOTTOM) * sizeFactor)}px` }}>
        {/* Elementos decorativos */}
        <img src={decorTopLeft} alt="decor top left" style={{ position: 'absolute', top: 0, left: 0, width: isMobile ? `${55 * sizeFactor}px` : `${80 * sizeFactor}px`, zIndex: 1, pointerEvents: 'none' }} />
        <img src={decorTopRight} alt="decor top right" style={{ position: 'absolute', top: 0, right: 0, width: isMobile ? `${60 * sizeFactor}px` : `${80 * sizeFactor}px`, zIndex: 1, pointerEvents: 'none' }} />
        <img src={decorBottomLeft} alt="decor bottom left" style={{ position: 'absolute', bottom: 0, left: 0, width: isMobile ? `${55 * sizeFactor}px` : `${80 * sizeFactor}px`, zIndex: 1, pointerEvents: 'none' }} />
        <div className="preview-header" style={{ position: 'relative', zIndex: 2, paddingLeft: 0, marginLeft: 0 }}>
          <h1 style={{ fontSize: `${2.2 * sizeFactor}rem`, marginBottom: `${16 * sizeFactor}px`, fontWeight: 600, letterSpacing: 1, paddingLeft: 0, marginLeft: 0 }}>TERMO DE DOAÇÃO</h1>
        </div>
        <div className="preview-content" style={{ textAlign: 'justify', fontSize: `${1.05 * sizeFactor}rem`, position: 'relative', zIndex: 2, paddingLeft: 0, marginLeft: 0 }}>
          <p style={{ fontWeight: 500, marginBottom: `${12 * sizeFactor}px`, paddingLeft: 0, marginLeft: 0, textIndent: 0 }}>
            PELO PRESENTE INSTRUMENTO PARTICULAR DE DOAÇÃO, <b>{formData.nomeDoador || '[NOME DO DOADOR]'}</b>, INSCRITO NO CPF/CNPJ SOB O Nº <b>{formData.cpfCnpjDoador || '[XXX]'}</b>, COM ENDEREÇO EM <b>{formData.enderecoDoador || '[ENDEREÇO COMPLETO]'}</b>, DECLARA QUE DOA À ASSOCIAÇÃO DE PAIS E MESTRES DA ESCOLA <b>{formData.nomeEscola || '[NOME DA ESCOLA]'}</b>, INSCRITA NO CNPJ SOB O Nº <b>{formData.cnpjEscola || '[XXX]'}</b>, COM SEDE EM <b>{formData.enderecoEscola || '[ENDEREÇO]'}</b>, OS SEGUINTES BENS:
          </p>
          
          {/* Tabela de Equipamentos */}
          <div style={{ marginBottom: `${16 * sizeFactor}px`, overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', fontSize: `${0.9 * sizeFactor}rem` }}>
              <thead>
                <tr style={{ backgroundColor: '#f0f0f0' }}>
                  <th style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px`, textAlign: 'center' }}>Nº</th>
                  <th style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px` }}>Descrição</th>
                  <th style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px` }}>Marca/Modelo</th>
                  <th style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px` }}>Nº de Série</th>
                  <th style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px`, textAlign: 'center' }}>Qtd</th>
                  <th style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px` }}>Estado</th>
                </tr>
              </thead>
              <tbody>
                {(formData.equipamentos || []).map((equipamento, index) => (
                    <tr key={equipamento.id || index}>
                    <td style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px`, textAlign: 'center' }}>{index + 1}</td>
                    <td style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px` }}>{equipamento.descricao || ''}</td>
                    <td style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px` }}>{equipamento.marca || ''}</td>
                    <td style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px` }}>{equipamento.serie || ''}</td>
                    <td style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px`, textAlign: 'center' }}>{equipamento.quantidade || ''}</td>
                    <td style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px` }}>{equipamento.estado || ''}</td>
                    </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          
          <ol style={{ marginLeft: `${18 * sizeFactor}px`, marginBottom: `${12 * sizeFactor}px` }}>
            <li style={{ marginBottom: `${8 * sizeFactor}px` }}>
              <b style={{ fontSize: `${1.05 * sizeFactor}rem` }}> NATUREZA E FINALIDADE</b><br />
              <span style={{ fontSize: `${1.05 * sizeFactor}rem` }}>A PRESENTE DOAÇÃO É FEITA DE FORMA GRATUITA, IRREVERSÍVEL E IRREVOGÁVEL, COM A FINALIDADE DE CONTRIBUIR COM AS ATIVIDADES PEDAGÓGICAS E ADMINISTRATIVAS DA ESCOLA, CONFORME OS OBJETIVOS SOCIAIS DA APM.</span>
            </li>
            <li style={{ marginBottom: `${8 * sizeFactor}px` }}>
              <b style={{ fontSize: `${1.05 * sizeFactor}rem` }}> RESPONSABILIDADE SOBRE DADOS</b><br />
              <span style={{ fontSize: `${1.05 * sizeFactor}rem` }}>A EMPRESA DOADORA SE COMPROMETE A REALIZAR A VERIFICAÇÃO, LIMPEZA E DESCARTE DE QUAISQUER DADOS EVENTUALMENTE EXISTENTES NOS EQUIPAMENTOS DOADOS, ENTREGANDO-OS LIVRES DE DADOS PESSOAIS OU SENSÍVEIS, ISENTANDO A APM DE QUALQUER RESPONSABILIDADE SOBRE DADOS EVENTUALMENTE RESIDUAIS.</span>
            </li>
            <li style={{ marginBottom: `${8 * sizeFactor}px` }}>
              <b style={{ fontSize: `${1.05 * sizeFactor}rem` }}> DESCARTE AMBIENTALMENTE CORRETO</b><br />
              <span style={{ fontSize: `${1.05 * sizeFactor}rem` }}>A APM COMPROMETE-SE A REALIZAR O DESCARTE AMBIENTALMENTE ADEQUADO DOS EQUIPAMENTOS AO FINAL DE SUA VIDA ÚTIL, SEGUINDO AS NORMAS DA POLÍTICA NACIONAL DE RESÍDUOS SÓLIDOS (LEI Nº 12.305/2010) E ORIENTAÇÕES DE LOGÍSTICA REVERSA, DESTINANDO-OS, SEMPRE QUE POSSÍVEL, A COOPERATIVAS, PONTOS DE COLETA CERTIFICADOS OU PROGRAMAS DE RECICLAGEM.</span>
            </li>
          </ol>
          <p style={{ marginBottom: `${12 * sizeFactor}px`, fontSize: `${1.05 * sizeFactor}rem` }}>
            E, POR ESTAREM DE PLENO ACORDO, ASSINAM ESTE TERMO EM DUAS VIAS DE IGUAL TEOR.
          </p>
          <p style={{ marginBottom: `${24 * sizeFactor}px`, fontSize: `${1.05 * sizeFactor}rem` }}>
            <b>{formData.local || '[LOCAL]'}</b>, <b>{formData.data || '[DATA]'}</b>
          </p>
          <div style={{ marginBottom: `${24 * sizeFactor}px` }}>
            <div style={{ marginBottom: `${24 * sizeFactor}px` }}>
              <div style={{ marginBottom: `${8 * sizeFactor}px`, fontSize: `${1.05 * sizeFactor}rem` }}>__________________________________</div>
              <div style={{ fontSize: `${1.05 * sizeFactor}rem` }}>[ASSINATURA DO DOADOR]</div>
              <div style={{ fontSize: `${1.05 * sizeFactor}rem` }}>CPF/CNPJ: {formData.cpfCnpjDoador || '__________'}</div>
            </div>
            <div>
              <div style={{ marginBottom: `${8 * sizeFactor}px`, fontSize: `${1.05 * sizeFactor}rem` }}>__________________________________</div>
              <div style={{ fontSize: `${1.05 * sizeFactor}rem` }}>[ASSINATURA DO PRESIDENTE DA APM]</div>
              <div style={{ fontSize: `${1.05 * sizeFactor}rem` }}>CPF: {formData.cpfPresidenteApm || '__________'}</div>
            </div>
          </div>
        </div>
        {/* Logo no rodapé direito */}
        <img src={logoConectEdu} alt="Logo Conect Edu" style={{ position: 'absolute', bottom: `${ABNT_MARGIN_BOTTOM * sizeFactor}px`, right: `${ABNT_MARGIN_RIGHT * sizeFactor}px`, width: `${90 * sizeFactor}px`, zIndex: 2 }} />
      </div>
    );
  }
  if (reportType === 'declaracao') {
    const viewportWidth = typeof window !== 'undefined' ? (window.innerWidth || document.documentElement.clientWidth) : A4_WIDTH;
    const isMobile = viewportWidth <= 768;
    const bensRecebidos = formData?.bensRecebidos || [];
    const equipamentosToShow = bensRecebidos.slice(0, MAX_EQUIPMENTS); // Limitar a 5 equipamentos
    
    return renderWithScale(
      <>
        {/* DECLARAÇÃO DE DOAÇÃO */}
        <div style={{ position: 'relative', overflow: 'hidden', paddingLeft: 0, marginLeft: 0, height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', paddingTop: `${ABNT_MARGIN_TOP * sizeFactor}px`, paddingRight: `${ABNT_MARGIN_RIGHT * sizeFactor}px`, paddingBottom: `${ABNT_MARGIN_BOTTOM * sizeFactor}px`, paddingLeft: `${ABNT_MARGIN_LEFT * sizeFactor}px`, minHeight: `${A4_HEIGHT - ((ABNT_MARGIN_TOP + ABNT_MARGIN_BOTTOM) * sizeFactor)}px` }}>
          {/* Elementos decorativos */}
          <img src={decorTopLeft} alt="decor top left" style={{ position: 'absolute', top: 0, left: 0, width: isMobile ? `${55 * sizeFactor}px` : `${80 * sizeFactor}px`, zIndex: 1, pointerEvents: 'none' }} />
          <img src={decorTopRight} alt="decor top right" style={{ position: 'absolute', top: 0, right: 0, width: isMobile ? `${60 * sizeFactor}px` : `${80 * sizeFactor}px`, zIndex: 1, pointerEvents: 'none' }} />
          <img src={decorBottomLeft} alt="decor bottom left" style={{ position: 'absolute', bottom: 0, left: 0, width: isMobile ? `${55 * sizeFactor}px` : `${80 * sizeFactor}px`, zIndex: 1, pointerEvents: 'none' }} />
          
          <div className="preview-header" style={{ position: 'relative', zIndex: 2, paddingLeft: 0, marginLeft: 0 }}>
            <h1 style={{ fontSize: `${2.2 * sizeFactor}rem`, marginBottom: `${16 * sizeFactor}px`, fontWeight: 600, letterSpacing: 1, paddingLeft: 0, marginLeft: 0 }}>DECLARAÇÃO DE DOAÇÃO</h1>
          </div>
          
          <div className="preview-content" style={{ textAlign: 'justify', fontSize: `${1.05 * sizeFactor}rem`, position: 'relative', zIndex: 2, paddingLeft: 0, marginLeft: 0 }}>
            {/* Parágrafo introdutório */}
            <p style={{ marginBottom: `${12 * sizeFactor}px`, paddingLeft: 0, marginLeft: 0, textIndent: 0 }}>
              EU, <b>{formData.nomeDoador || '[NOME COMPLETO DO DOADOR]'}</b>, <b>{formData.nacionalidade || '[NACIONALIDADE]'}</b>, <b>{formData.estadoCivil || '[ESTADO CIVIL]'}</b>, <b>{formData.profissao || '[PROFISSÃO]'}</b>, INSCRITO NO CPF SOB O N° <b>{formData.cpfCnpjDoador || '[CPF]'}</b>, RESIDENTE À <b>{formData.enderecoDoador || '[ENDEREÇO COMPLETO]'}</b>, DECLARO, PARA OS DEVIDOS FINS, QUE ESTOU DOANDO DE FORMA GRATUITA, IRREVOGÁVEL E IRRETRATÁVEL, OS SEGUINTES BENS À:
            </p>

            {/* Seção DONATÁRIO */}
            <div style={{ marginBottom: `${16 * sizeFactor}px` }}>
              <p style={{ marginBottom: `${8 * sizeFactor}px` }}>
                <b>ASSOCIAÇÃO DE PAIS E MESTRES (APM) DA {formData.nomeEscola || '[NOME DA ESCOLA]'}</b>
              </p>
              <p style={{ marginBottom: `${8 * sizeFactor}px` }}>
                <b>CNPJ:</b> {formData.cnpjApm || '[CNPJ DA APM]'}
              </p>
              <p style={{ marginBottom: `${8 * sizeFactor}px` }}>
                <b>ENDEREÇO:</b> {formData.enderecoApm || '[ENDEREÇO DA ESCOLA]'}
              </p>
            </div>

            {/* Tabela de bens declarados */}
            <div style={{ marginBottom: `${16 * sizeFactor}px`, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', fontSize: `${0.9 * sizeFactor}rem` }}>
                <thead>
                  <tr style={{ backgroundColor: '#f0f0f0' }}>
                    <th style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px`, textAlign: 'center' }}>Item nº</th>
                    <th style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px` }}>Descrição do Equipamento</th>
                    <th style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px` }}>Marca/Modelo</th>
                    <th style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px` }}>Nº de Série</th>
                    <th style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px`, textAlign: 'center' }}>Quantidade</th>
                    <th style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px` }}>Estado de Conservação</th>
                    <th style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px` }}>Valor Estimado</th>
                  </tr>
                </thead>
                <tbody>
                  {equipamentosToShow.length > 0 ? (
                    equipamentosToShow.map((bem, index) => (
                      <tr key={bem.id || index}>
                        <td style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px`, textAlign: 'center' }}>{index + 1}</td>
                        <td style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px` }}>{bem.descricao || ''}</td>
                        <td style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px` }}>{bem.marca || ''}</td>
                        <td style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px` }}>{bem.serie || ''}</td>
                        <td style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px`, textAlign: 'center' }}>{bem.quantidade || ''}</td>
                        <td style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px` }}>{bem.estado || ''}</td>
                        <td style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px` }}>{bem.valor ? `R$ ${bem.valor}` : ''}</td>
                      </tr>
                    ))
                  ) : (
                    // Não mostrar linhas vazias - apenas remover linhas não usadas
                    null
                  )}
                </tbody>
              </table>
            </div>

            {/* Declarações */}
            <div style={{ marginBottom: `${16 * sizeFactor}px` }}>
              <p style={{ marginBottom: `${8 * sizeFactor}px` }}>
                DECLARO QUE OS BENS FORAM ENTREGUES À REFERIDA UNIDADE ESCOLAR NA DATA DE <b>{formData.dataEntrega || '[DATA DE ENTREGA]'}</b>, ESTANDO, SALVO INDICAÇÃO CONTRÁRIA, EM CONDIÇÕES NORMAIS DE USO E FUNCIONAMENTO.
              </p>
              <p style={{ marginBottom: `${12 * sizeFactor}px` }}>
                ESTA DOAÇÃO DESTINA-SE A CONTRIBUIR COM O DESENVOLVIMENTO DAS ATIVIDADES PEDAGÓGICAS E ADMINISTRATIVAS DA UNIDADE ESCOLAR, CONFORME OS OBJETIVOS SOCIAIS DA APM.
              </p>
            </div>

            {/* Data e Assinaturas */}
            <div style={{ marginBottom: `${16 * sizeFactor}px` }}>
              <p style={{ marginBottom: `${8 * sizeFactor}px` }}>
                <b>{formData.local || '[LOCAL]'}</b>, <b>{formData.dia || '[DIA]'}</b> DE <b>{formData.mes || '[MÊS POR EXTENSO]'}</b> DE <b>{formData.ano || '[ANO]'}</b>.
            </p>
              
              <div style={{ marginBottom: `${16 * sizeFactor}px` }}>
                <div style={{ marginBottom: `${8 * sizeFactor}px`, fontSize: `${1.05 * sizeFactor}rem` }}>__________________________________</div>
                <div style={{ fontSize: `${1.05 * sizeFactor}rem` }}>[NOME COMPLETO]</div>
                <div style={{ fontSize: `${1.05 * sizeFactor}rem` }}>CPF: {formData.cpfCnpjDoador || '[CPF]'}</div>
              </div>
            </div>
          </div>
          {/* Logo no rodapé direito */}
          <img src={logoConectEdu} alt="Logo Conect Edu" style={{ position: 'absolute', bottom: `${ABNT_MARGIN_BOTTOM * sizeFactor}px`, right: `${ABNT_MARGIN_RIGHT * sizeFactor}px`, width: `${90 * sizeFactor}px`, zIndex: 2 }} />
        </div>
      </>
    );
  }
  if (reportType === 'recibo1' || reportType === 'recibo2') {
    const isPessoaJuridica = reportType === 'recibo1';
    const viewportWidth = typeof window !== 'undefined' ? (window.innerWidth || document.documentElement.clientWidth) : A4_WIDTH;
    const isMobile = viewportWidth <= 768;
    const equipamentosRecibo = formData?.equipamentosRecibo || [];
    const equipamentosToShow = equipamentosRecibo.slice(0, MAX_EQUIPMENTS); // Limitar a 5 equipamentos
    
    return renderWithScale(
      <>
        <div style={{ position: 'relative', overflow: 'hidden', paddingLeft: 0, marginLeft: 0, height: '100%', display: 'flex', flexDirection: 'column', boxSizing: 'border-box', paddingTop: `${ABNT_MARGIN_TOP * sizeFactor}px`, paddingRight: `${ABNT_MARGIN_RIGHT * sizeFactor}px`, paddingBottom: `${ABNT_MARGIN_BOTTOM * sizeFactor}px`, paddingLeft: `${ABNT_MARGIN_LEFT * sizeFactor}px`, minHeight: `${A4_HEIGHT - ((ABNT_MARGIN_TOP + ABNT_MARGIN_BOTTOM) * sizeFactor)}px` }}>
          {/* Elementos decorativos */}
          <img src={decorTopLeft} alt="decor top left" style={{ position: 'absolute', top: 0, left: 0, width: isMobile ? `${55 * sizeFactor}px` : `${80 * sizeFactor}px`, zIndex: 1, pointerEvents: 'none' }} />
          <img src={decorTopRight} alt="decor top right" style={{ position: 'absolute', top: 0, right: 0, width: isMobile ? `${60 * sizeFactor}px` : `${80 * sizeFactor}px`, zIndex: 1, pointerEvents: 'none' }} />
          <img src={decorBottomLeft} alt="decor bottom left" style={{ position: 'absolute', bottom: 0, left: 0, width: isMobile ? `${55 * sizeFactor}px` : `${80 * sizeFactor}px`, zIndex: 1, pointerEvents: 'none' }} />
          
          <div className="preview-header" style={{ position: 'relative', zIndex: 2, paddingLeft: 0, marginLeft: 0 }}>
            <h1 style={{ fontSize: `${2.2 * sizeFactor}rem`, marginBottom: `${16 * sizeFactor}px`, fontWeight: 600, letterSpacing: 1, paddingLeft: 0, marginLeft: 0 }}>RECIBO DE DOAÇÃO</h1>
          </div>
          
          <div className="preview-content" style={{ textAlign: 'justify', fontSize: `${1.05 * sizeFactor}rem`, position: 'relative', zIndex: 2, paddingLeft: 0, marginLeft: 0 }}>
            {/* Seção RECEBEMOS DE */}
            <div style={{ marginBottom: `${16 * sizeFactor}px` }}>
              <h3 style={{ fontSize: `${1.2 * sizeFactor}rem`, fontWeight: 600, marginBottom: `${8 * sizeFactor}px` }}>
                {isPessoaJuridica ? 'RECEBEMOS DA EMPRESA:' : 'RECEBEMOS DE:'}
              </h3>
              
              {isPessoaJuridica ? (
                <>
                  <p style={{ marginBottom: `${8 * sizeFactor}px` }}>
                    <b>RAZÃO SOCIAL:</b> {formData.razaoSocial || '[RAZÃO SOCIAL DO DOADOR]'}
                  </p>
                  <p style={{ marginBottom: `${8 * sizeFactor}px` }}>
                    <b>CNPJ:</b> {formData.cnpjDoador || '[CNPJ]'}
                  </p>
                  <p style={{ marginBottom: `${8 * sizeFactor}px` }}>
                    <b>ENDEREÇO:</b> {formData.enderecoDoador || '[ENDEREÇO COMPLETO]'}
                  </p>
                  <p style={{ marginBottom: `${8 * sizeFactor}px` }}>
                    <b>REPRESENTANTE LEGAL:</b> {formData.nomeRepresentante || '[NOME DO REPRESENTANTE]'} - CPF: {formData.cpfRepresentante || '[CPF]'}
                  </p>
                </>
              ) : (
                <>
                  <p style={{ marginBottom: `${8 * sizeFactor}px` }}>
                    <b>NOME:</b> {formData.nomeDoador || '[NOME COMPLETO DO DOADOR]'}
                  </p>
                  <p style={{ marginBottom: `${8 * sizeFactor}px` }}>
                    <b>CPF:</b> {formData.cpfDoador || '[CPF]'}
                  </p>
                  <p style={{ marginBottom: `${8 * sizeFactor}px` }}>
                    <b>ENDEREÇO:</b> {formData.enderecoDoador || '[ENDEREÇO COMPLETO]'}
                  </p>
                </>
              )}
            </div>

            {/* Cláusula introdutória */}
            <div style={{ marginBottom: `${16 * sizeFactor}px` }}>
              <p style={{ marginBottom: `${8 * sizeFactor}px` }}>
                {isPessoaJuridica 
                  ? 'A DOAÇÃO, DE FORMA GRATUITA E SEM ÔNUS, DOS SEGUINTES BENS:'
                  : 'A DOAÇÃO, DE FORMA GRATUITA, IRREVOGÁVEL E IRRETRATÁVEL, DOS SEGUINTES BENS:'
                }
              </p>
            </div>

            {/* Tabela de equipamentos */}
            <div style={{ marginBottom: `${16 * sizeFactor}px`, overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #000', fontSize: `${0.9 * sizeFactor}rem` }}>
                <thead>
                  <tr style={{ backgroundColor: '#f0f0f0' }}>
                    <th style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px`, textAlign: 'center' }}>Item nº</th>
                    <th style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px` }}>Descrição do Equipamento</th>
                    <th style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px` }}>Marca/Modelo</th>
                    <th style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px` }}>Nº de Série</th>
                    <th style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px`, textAlign: 'center' }}>Quantidade</th>
                    <th style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px` }}>Estado de Conservação</th>
                  </tr>
                </thead>
                <tbody>
                  {equipamentosToShow.length > 0 ? (
                    equipamentosToShow.map((equipamento, index) => (
                      <tr key={equipamento.id || index}>
                        <td style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px`, textAlign: 'center' }}>{index + 1}</td>
                        <td style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px` }}>{equipamento.descricao || ''}</td>
                        <td style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px` }}>{equipamento.marca || ''}</td>
                        <td style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px` }}>{equipamento.serie || ''}</td>
                        <td style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px`, textAlign: 'center' }}>{equipamento.quantidade || ''}</td>
                        <td style={{ border: '1px solid #000', padding: `${8 * sizeFactor}px` }}>{equipamento.estado || ''}</td>
                      </tr>
                    ))
                  ) : (
                    // Não mostrar linhas vazias - apenas remover linhas não usadas
                    null
                  )}
                </tbody>
              </table>
            </div>

            {/* Data da entrega e finalidade */}
            <div style={{ marginBottom: `${16 * sizeFactor}px` }}>
              <p style={{ marginBottom: `${8 * sizeFactor}px` }}>
                <b>DATA DA ENTREGA:</b> {formData.dataEntrega || '[DATA DA ENTREGA]'}
              </p>
              <p style={{ marginBottom: `${8 * sizeFactor}px` }}>
                <b>FINALIDADE DA DOAÇÃO:</b> {isPessoaJuridica 
                  ? 'APOIO ÀS ATIVIDADES PEDAGÓGICAS E ADMINISTRATIVAS DA UNIDADE ESCOLAR.'
                  : 'USO EXCLUSIVO NAS ATIVIDADES PEDAGÓGICAS E ADMINISTRATIVAS DA UNIDADE ESCOLAR.'
                }
              </p>
            </div>

            {/* Seção DONATÁRIO */}
            <div style={{ marginBottom: `${16 * sizeFactor}px` }}>
              <h3 style={{ fontSize: `${1.2 * sizeFactor}rem`, fontWeight: 600, marginBottom: `${8 * sizeFactor}px` }}>DONATÁRIO:</h3>
              <p style={{ marginBottom: `${8 * sizeFactor}px` }}>
                <b>ASSOCIAÇÃO DE PAIS E MESTRES (APM) DA {formData.nomeEscola || '[NOME DA ESCOLA]'}</b>
              </p>
              <p style={{ marginBottom: `${8 * sizeFactor}px` }}>
                <b>CNPJ:</b> {formData.cnpjApm || '[CNPJ DA APM]'}
              </p>
              <p style={{ marginBottom: `${8 * sizeFactor}px` }}>
                <b>ENDEREÇO:</b> {formData.enderecoApm || '[ENDEREÇO DA ESCOLA]'}
              </p>
            </div>

            {/* Local, Data e Assinatura */}
            <div style={{ marginBottom: `${16 * sizeFactor}px` }}>
              <p style={{ marginBottom: `${8 * sizeFactor}px` }}>
                <b>{formData.local || '[LOCAL]'}</b>, <b>{formData.dia || '[DIA]'}</b> DE <b>{formData.mes || '[MÊS POR EXTENSO]'}</b> DE <b>{formData.ano || '[ANO]'}</b>.
              </p>
              
              <div style={{ marginBottom: `${16 * sizeFactor}px` }}>
                <div style={{ marginBottom: `${8 * sizeFactor}px`, fontSize: `${1.05 * sizeFactor}rem` }}>__________________________________</div>
                <div style={{ fontSize: `${1.05 * sizeFactor}rem` }}>[NOME COMPLETO]</div>
                <div style={{ fontSize: `${1.05 * sizeFactor}rem` }}>PRESIDENTE DA APM - CPF: [CPF]</div>
              </div>
            </div>
          </div>
          
          {/* Logo no rodapé direito */}
          <img src={logoConectEdu} alt="Logo Conect Edu" style={{ position: 'absolute', bottom: `${ABNT_MARGIN_BOTTOM * sizeFactor}px`, right: `${ABNT_MARGIN_RIGHT * sizeFactor}px`, width: `${90 * sizeFactor}px`, zIndex: 2 }} />
        </div>
      </>
    );
  }
  return null;
});

export default ManualReportPreview; 