import { createContext, useState, useContext } from 'react';
import { users } from '../Data/users';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  const login = (email, password) => {
    // Simula a busca no banco de dados (no nosso caso, no array users)
    const foundUser = users.find(u => u.email === email && u.password === password);
    if (foundUser) {
      setUser(foundUser);
      return true; // Login bem-sucedido
    }
    return false; // Login falhou
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar o contexto
export const useAuth = () => {
  return useContext(AuthContext);
};