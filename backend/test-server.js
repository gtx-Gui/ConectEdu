const express = require('express');
const app = express();

app.get('/test', (req, res) => {
  console.log('Rota de teste chamada');
  res.json({ message: 'Servidor de teste funcionando!' });
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Servidor de teste rodando na porta ${PORT}`);
  console.log(`Teste acessando: http://localhost:${PORT}/test`);
}); 