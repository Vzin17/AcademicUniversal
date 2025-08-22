

import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

// allowedRoles é um array com os níveis que podem acessar a rota (ex: ['coordenador', 'recepcionista'])
const ProtectedRoute = ({ allowedRoles }) => {
  const { isAuthenticated, user } = useAuth();

  // 1. O usuário não está logado?
  if (!isAuthenticated) {
    // Redireciona para a página de login, guardando a página que ele tentou acessar
    return <Navigate to="/login" replace />;
  }

  // 2. O usuário está logado, mas o nível dele não está na lista de permissões?
  // A gente só checa isso se a rota tiver uma lista de 'allowedRoles'
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Redireciona para uma página de "Não Autorizado" ou para a home dele
    return <Navigate to="/unauthorized" replace />;
  }

  // 3. Se passou pelas duas verificações, o usuário tem acesso.
  // O <Outlet /> renderiza o componente filho da rota (a página que ele quer acessar)
  return <Outlet />;
};

export default ProtectedRoute;