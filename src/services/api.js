import axios from 'axios';

const api = axios.create({

  baseURL: 'http://localhost:3001', 
});

api.interceptors.request.use(async (config) => {
  
  const token = localStorage.getItem('@Vincle:token');


  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

});



export default api;