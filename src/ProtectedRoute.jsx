import React from 'react';

import { useAuth } from './Contexts/AuthContext.jsx'; 
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles }) {
  // 'loading' também vem do useAuth, para evitar mostrar
  // a página de login brevemente antes de carregar o usuário
  const { user, loading } = useAuth();

  // Se estiver carregando, não faça nada ainda
  if (loading) {
    return null; // Ou um componente de "Carregando..."
  }

  // Se não estiver carregando e NÃO houver usuário, vá para o login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se a rota não exige roles, apenas deixe passar
  // (ex: rota /perfil que todo usuário logado pode ver)
  if (!allowedRoles || allowedRoles.length === 0) {
    return children;
  }

  // Lógica de verificação de 'funcao'
  // Seu código aqui está excelente!
  const userRole = user?.funcao?.trim().toLowerCase() || '';

  if (allowedRoles.includes(userRole)) {
    return children; // Usuário tem a permissão, mostre a página
  } else {
    // Usuário não tem permissão, mande para a home (ou página de "Acesso Negado")
    return <Navigate to="/" replace />; 
  }
}

export default ProtectedRoute;