const express = require('express');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');
const app = express();

app.use(cors());
app.use(express.json());

// Middleware para log de todas as requisições
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`);
  next();
});

// Configure com suas chaves do Supabase
const supabaseUrl = 'https://zosupqbyanlliswinicv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpvc3VwcWJ5YW5sbGlzd2luaWN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1NDk5NzksImV4cCI6MjA1MzEyNTk3OX0.8TOyca3W_RR2SSejrqAzVBKKc9pKjZJ3kg-ZcfmBOFI';
const supabase = createClient(supabaseUrl, supabaseKey);

// Rota de teste simples
app.get('/test', (req, res) => {
  console.log('Rota de teste chamada');
  res.json({ message: 'Backend funcionando!' });
});

// Rota de registro
app.post('/register', async (req, res) => {
  const {
    tipo, nome, cnpj, cpf, cep, numero, complemento,
    email, telefone, rua, bairro, cidade, estado, senha
  } = req.body;

  console.log('Tentativa de registro para:', email);

  // 1. Crie o usuário no Auth do Supabase
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password: senha
  });

  console.log('authData:', authData);
  console.log('authError:', authError);

  if (authError) {
    console.log('Erro ao criar usuário no Auth:', authError);
    return res.status(400).json({ message: authError.message });
  }

  if (!authData || !authData.user || !authData.user.id) {
    console.log('Dados de autenticação inválidos:', authData);
    return res.status(400).json({ message: 'Erro ao criar usuário no Auth do Supabase.' });
  }

  // 2. Pegue o id do usuário criado no Auth
  const auth_id = authData.user.id;
  console.log('Auth ID criado:', auth_id);

  // 3. Insira o usuário na tabela users com o auth_id
  const userData = {
    tipo,
    nome,
    cnpj,
    cpf,
    cep,
    numero,
    complemento,
    email,
    telefone,
    auth_id,
    rua,
    bairro,
    cidade,
    estado
  };

  console.log('Dados a serem inseridos:', userData);

  const { error: insertError } = await supabase
    .from('users')
    .insert([userData]);

  if (insertError) {
    console.log('Erro ao inserir na tabela users:', insertError);
    return res.status(400).json({ message: insertError.message });
  }

  console.log('Usuário registrado com sucesso:', email);
  res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });
});

// Rota de login
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  console.log('=== TENTATIVA DE LOGIN ===');
  console.log('Email:', email);

  try {
    // 1. Autenticar no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    console.log('Auth response:', {
      success: !authError,
      userId: authData?.user?.id,
      email: authData?.user?.email
    });

    if (authError) {
      console.log('Erro de autenticação:', authError.message);
      return res.status(401).json({ message: 'Email ou senha inválidos' });
    }

    const authUserId = authData.user.id;
    console.log('Auth User ID:', authUserId);

    // 2. Buscar dados do usuário na tabela users
    console.log('Buscando usuário com auth_id:', authUserId);
    
    const { data: userData, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authUserId)
      .single();

    console.log('Resultado da busca:', {
      found: !!userData,
      userData: userData ? {
        id: userData.id,
        nome: userData.nome,
        email: userData.email,
        auth_id: userData.auth_id
      } : null,
      error: userError
    });

    if (userError) {
      console.log('Erro na busca do usuário:', userError);
      return res.status(404).json({ message: 'Dados do usuário não encontrados' });
    }

    if (!userData) {
      console.log('Usuário não encontrado na tabela users');
      return res.status(404).json({ message: 'Dados do usuário não encontrados' });
    }

    // 3. Retornar dados completos do usuário
    console.log('Login bem-sucedido para:', userData.nome);
    res.json({
      user: userData,
      session: authData.session
    });

  } catch (error) {
    console.error('Erro no login:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
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

// Rota para buscar total de documentos gerados
app.get('/total-documents', async (req, res) => {
  try {
    console.log('Buscando total de documentos...');
    
    const { count, error } = await supabase
      .from('document_history')
      .select('*', { count: 'exact', head: true });

    console.log('Resultado da consulta:', { count, error });

    if (error) {
      console.error('Erro na consulta:', error);
      return res.status(400).json({ message: error.message });
    }

    const total = count || 0;
    console.log('Total de documentos:', total);
    res.json({ total });
  } catch (error) {
    console.error('Erro interno:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Rota para listar todos os usuários (apenas para debug)
app.get('/debug/users', async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*');

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Rota para verificar estrutura da tabela users
app.get('/debug/users-structure', async (req, res) => {
  try {
    // Buscar um usuário específico para ver a estrutura
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (error) {
      return res.status(400).json({ message: error.message });
    }

    res.json({
      count: data.length,
      structure: data[0] ? Object.keys(data[0]) : [],
      sample: data[0] || null
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Rota para testar busca de usuário por auth_id
app.get('/debug/user/:authId', async (req, res) => {
  try {
    const { authId } = req.params;
    
    console.log('Buscando usuário com auth_id:', authId);
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('auth_id', authId);

    console.log('Resultado da busca:', {
      count: data?.length || 0,
      data: data,
      error: error
    });

    res.json({
      authId,
      count: data?.length || 0,
      users: data || [],
      error: error
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Rota para buscar usuário por email
app.get('/debug/user-by-email/:email', async (req, res) => {
  try {
    const { email } = req.params;
    
    console.log('Buscando usuário com email:', email);
    
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .eq('email', email);

    console.log('Resultado da busca por email:', {
      count: data?.length || 0,
      data: data,
      error: error
    });

    res.json({
      email,
      count: data?.length || 0,
      users: data || [],
      error: error
    });
  } catch (error) {
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

// Rota de logout
app.post('/logout', async (req, res) => {
  try {
    const { session } = req.body;
    
    if (session) {
      // Fazer logout no Supabase
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.log('Erro no logout:', error);
      }
    }

    res.json({ message: 'Logout realizado com sucesso' });
  } catch (error) {
    console.error('Erro no logout:', error);
    res.status(500).json({ message: 'Erro interno do servidor' });
  }
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Backend rodando na porta ${PORT}`);
  console.log(`Teste acessando: http://localhost:${PORT}/test`);
  console.log(`API de documentos: http://localhost:${PORT}/total-documents`);
});


