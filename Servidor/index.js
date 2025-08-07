// server/index.js
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Servidor tá on! 🔥');
});

app.listen(5000, () => {
  console.log('Servidor rodando na porta 5000 🚀');
});
