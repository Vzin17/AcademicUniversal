// src/contexts/AuthContext.js
import { createContext, useState, useEffect, useContext } from 'react';
import api from '../services/api';

const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Carrega os dados do usuário do localStorage se a página for recarregada
    const storagedUser = localStorage.getItem('@Vincle:user');
    const storagedToken = localStorage.getItem('@Vincle:token');

    if (storagedUser && storagedToken) {
      setUser(JSON.parse(storagedUser));
      api.defaults.headers.authorization = `Bearer ${storagedToken}`;
    }
  }, []);

  async function login(email, senha) {
    try {
      // A requisição para o seu backend para fazer o login
      const response = await api.post('/login', { email, senha }); 
      
      const { user, token } = response.data;

      setUser(user);
      api.defaults.headers.authorization = `Bearer ${token}`;

      // Salva no localStorage para manter o usuário logado
      localStorage.setItem('@Vincle:user', JSON.stringify(user));
      localStorage.setItem('@Vincle:token', token);

    } catch (error) {
      console.error("Erro no login:", error);
      alert("Email ou senha inválidos.");
    }
  }

  function logout() {
    setUser(null);
    localStorage.removeItem('@Vincle:user');
    localStorage.removeItem('@Vincle:token');
  }

  return (
    <AuthContext.Provider value={{ isAuthenticated: !!user, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook customizado para facilitar o uso
export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}