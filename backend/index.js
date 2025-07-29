const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const app = express();

app.use(cors());
app.use(express.json());

// Configure com suas chaves do Supabase
const supabaseUrl = 'https://zosupqbyanlliswinicv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpvc3VwcWJ5YW5sbGlzd2luaWN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1NDk5NzksImV4cCI6MjA1MzEyNTk3OX0.8TOyca3W_RR2SSejrqAzVBKKc9pKjZJ3kg-ZcfmBOFI';
const supabase = createClient(supabaseUrl, supabaseKey);

// Rota de registro
app.post('/register', async (req, res) => {
  const {
    tipo, nome, cnpj, cpf, cep, numero, complemento,
    email, telefone, rua, bairro, cidade, estado, senha
  } = req.body;

  // 1. Crie o usuário no Auth do Supabase
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password: senha
  });

  console.log('authData:', authData);
  console.log('authError:', authError);

  if (authError) {
    // Se der erro ao criar o usuário no Auth, retorna o erro
    return res.status(400).json({ message: authError.message });
  }

  if (!authData || !authData.user || !authData.user.id) {
    return res.status(400).json({ message: 'Erro ao criar usuário no Auth do Supabase.' });
  }

  // 2. Pegue o id do usuário criado no Auth
  const auth_id = authData.user.id;

  // 3. Insira o usuário na tabela users com o auth_id
  const { error: insertError } = await supabase
    .from('users')
    .insert([{
      tipo,
      nome,
      cnpj,
      cpf,
      cep,
      numero,
      complemento,
      email,
      telefone,
      auth_id, // <-- aqui vai o id do Auth
      rua,
      bairro,
      cidade,
      estado
    }]);

  if (insertError) {
    // Se der erro ao inserir na tabela, retorna o erro
    return res.status(400).json({ message: insertError.message });
  }

  // Se tudo der certo, retorna sucesso
  res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
});

// Rota para verificar e criar tabela document_history
app.get('/check-document-history-table', async (req, res) => {
  try {
    // Tenta inserir um registro de teste para verificar se a tabela existe
    const { error } = await supabase
      .from('document_history')
      .insert([{
        user_id: 'test',
        document_type: 'test',
        form_data: {},
        generated_at: new Date().toISOString()
      }]);

    if (error && error.message.includes('relation "document_history" does not exist')) {
      return res.status(404).json({ 
        message: 'Tabela document_history não existe',
        error: error.message 
      });
    }

    // Se chegou aqui, a tabela existe
    res.json({ message: 'Tabela document_history existe' });
  } catch (error) {
    res.status(500).json({ 
      message: 'Erro ao verificar tabela',
      error: error.message 
    });
  }
});

// Rota para buscar dados do usuário logado
app.get('/user-data/:authId', async (req, res) => {
  try {
    const { authId } = req.params;
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authId)
      .single();

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    if (!data) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Rota para buscar dados de escolas (para preenchimento automático)
app.get('/schools', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('schools')
      .select('*')
      .order('nome');

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.json(data || []);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Rota para buscar dados de APMs (para preenchimento automático)
app.get('/apms', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('apms')
      .select('*')
      .order('nome');

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.json(data || []);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Rota para salvar histórico de documentos gerados
app.post('/document-history', async (req, res) => {
  try {
    const { userId, documentType, formData, generatedAt } = req.body;
    
    const { error } = await supabase
      .from('document_history')
      .insert([{
        user_id: userId,
        document_type: documentType,
        form_data: formData,
        generated_at: generatedAt || new Date().toISOString()
      }]);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.json({ message: 'Histórico salvo com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Rota para buscar histórico de documentos do usuário
app.get('/document-history/:userId', async (req, res) => {
  try {
    const { userId } = req.params;
    
    const { data, error } = await supabase
      .from('document_history')
      .select('*')
      .eq('user_id', userId)
      .order('generated_at', { ascending: false });

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.json(data || []);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

app.listen(5000, () => {
  console.log('Backend rodando na porta 5000');
});


