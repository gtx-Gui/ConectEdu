const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Middleware para log de todas as requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Rota de teste simples
app.get('/test', (req, res) => {
  console.log('Rota de teste chamada');
  res.json({ message: 'Backend funcionando em modo offline!' });
});

// Rota de login simulada (modo offline)
app.post('/login', async (req, res) => {
  const { email, senha } = req.body;
  
  console.log('=== TENTATIVA DE LOGIN (MODO OFFLINE) ===');
  console.log('Email:', email);
  
  // Simulação de login - aceita qualquer email/senha para teste
  if (email && senha) {
    console.log('✅ Login simulado com sucesso');
    res.json({
      success: true,
      userId: 'user-offline-123',
      email: email,
      message: 'Login realizado em modo offline'
    });
  } else {
    console.log('❌ Dados de login inválidos');
    res.status(400).json({
      success: false,
      message: 'Email e senha são obrigatórios'
    });
  }
});

// Rota de registro simulada (modo offline)
app.post('/register', async (req, res) => {
  const { email, senha, nome, tipo } = req.body;
  
  console.log('=== TENTATIVA DE REGISTRO (MODO OFFLINE) ===');
  console.log('Email:', email);
  console.log('Nome:', nome);
  console.log('Tipo:', tipo);
  
  if (email && senha && nome && tipo) {
    console.log('✅ Registro simulado com sucesso');
    res.json({
      success: true,
      userId: 'user-offline-' + Date.now(),
      email: email,
      message: 'Registro realizado em modo offline'
    });
  } else {
    console.log('❌ Dados de registro inválidos');
    res.status(400).json({
      success: false,
      message: 'Todos os campos são obrigatórios'
    });
  }
});

// Rota para salvar histórico de documentos (modo offline)
app.post('/save-document-history', async (req, res) => {
  const { userId, documentType, formData } = req.body;
  
  console.log('=== SALVANDO HISTÓRICO (MODO OFFLINE) ===');
  console.log('User ID:', userId);
  console.log('Tipo de documento:', documentType);
  
  // Simulação de salvamento
  const documentId = 'doc-' + Date.now();
  
  res.json({
    success: true,
    documentId: documentId,
    message: 'Documento salvo em modo offline'
  });
});

// Rota para buscar histórico de documentos (modo offline)
app.get('/document-history/:userId', async (req, res) => {
  const { userId } = req.params;
  
  console.log('=== BUSCANDO HISTÓRICO (MODO OFFLINE) ===');
  console.log('User ID:', userId);
  
  // Dados simulados para teste
  const mockHistory = [
    {
      id: 1,
      user_id: userId,
      document_type: 'termo',
      form_data: {
        nomeDoador: 'João Silva',
        nomeEscola: 'Escola Municipal Teste',
        local: 'São Paulo',
        data: '16/09/2025'
      },
      generated_at: new Date().toISOString()
    },
    {
      id: 2,
      user_id: userId,
      document_type: 'declaracao',
      form_data: {
        nomeDoador: 'Maria Santos',
        nomeEscola: 'Escola Estadual Exemplo',
        local: 'Rio de Janeiro',
        data: '15/09/2025'
      },
      generated_at: new Date(Date.now() - 86400000).toISOString()
    }
  ];
  
  res.json(mockHistory);
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando em modo offline na porta ${PORT}`);
  console.log(`📝 Teste: http://localhost:${PORT}/test`);
  console.log('⚠️  ATENÇÃO: Modo offline - dados não são persistidos');
});



