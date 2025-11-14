const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://zosupqbyanlliswinicv.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Inpvc3VwcWJ5YW5sbGlzd2luaWN2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzc1NDk5NzksImV4cCI6MjA1MzEyNTk3OX0.8TOyca3W_RR2SSejrqAzVBKKc9pKjZJ3kg-ZcfmBOFI';

async function testConnection() {
  console.log('🔍 Testando conexão com Supabase...');
  console.log('URL:', supabaseUrl);
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Teste simples de conexão
    const { data, error } = await supabase
      .from('users')
      .select('count')
      .limit(1);
    
    if (error) {
      console.error('❌ Erro na conexão:', error.message);
      console.error('Código do erro:', error.code);
    } else {
      console.log('✅ Conexão com Supabase funcionando!');
      console.log('Dados recebidos:', data);
    }
  } catch (err) {
    console.error('❌ Erro de rede:', err.message);
    console.error('Tipo do erro:', err.code);
    
    if (err.code === 'ENOTFOUND') {
      console.log('\n💡 Possíveis soluções:');
      console.log('1. Verifique sua conexão com a internet');
      console.log('2. Teste com outro DNS (8.8.8.8 ou 1.1.1.1)');
      console.log('3. Verifique se há firewall bloqueando');
      console.log('4. Tente acessar https://zosupqbyanlliswinicv.supabase.co no navegador');
    }
  }
}

testConnection();



