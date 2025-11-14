const { spawn } = require('child_process');
const fs = require('fs');

console.log('🔧 Iniciando servidor ConectEdu...\n');

// Verificar se existe arquivo de configuração do Supabase
const hasSupabaseConfig = fs.existsSync('./supabase-config.json');

if (hasSupabaseConfig) {
  console.log('✅ Configuração do Supabase encontrada');
  console.log('🚀 Iniciando servidor com Supabase...\n');
  
  const server = spawn('node', ['index.js'], { stdio: 'inherit' });
  
  server.on('error', (err) => {
    console.error('❌ Erro ao iniciar servidor com Supabase:', err.message);
    console.log('\n🔄 Tentando modo offline...\n');
    
    const offlineServer = spawn('node', ['index-offline.js'], { stdio: 'inherit' });
    
    offlineServer.on('error', (offlineErr) => {
      console.error('❌ Erro ao iniciar servidor offline:', offlineErr.message);
    });
  });
  
} else {
  console.log('⚠️  Configuração do Supabase não encontrada');
  console.log('🚀 Iniciando servidor em modo offline...\n');
  
  const server = spawn('node', ['index-offline.js'], { stdio: 'inherit' });
  
  server.on('error', (err) => {
    console.error('❌ Erro ao iniciar servidor:', err.message);
  });
}

// Tratamento de sinais para encerrar o servidor
process.on('SIGINT', () => {
  console.log('\n👋 Encerrando servidor...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('\n👋 Encerrando servidor...');
  process.exit(0);
});



