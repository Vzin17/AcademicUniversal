import axios from 'axios';

// 1. Criamos uma instância do axios com configurações pré-definidas.
const api = axios.create({

  baseURL: 'http://localhost:3001', 
});

api.interceptors.request.use(async (config) => {
  // 4. Buscamos o token que foi salvo no localStorage durante o login.
  const token = localStorage.getItem('@Vincle:token');

  // 5. Se o token existir...
  if (token) {
    // 6. ...nós o adicionamos no cabeçalho de 'Authorization' da requisição.
    //    O backend vai usar isso para saber quem está fazendo o pedido.
    config.headers.Authorization = `Bearer ${token}`;
  }

  // 7. Retornamos a configuração (agora com o token, se houver) para que a 
  //    requisição possa continuar seu caminho.
  return config;
});



export default api;