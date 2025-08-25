// src/components/ProtectedRoute.jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user } = useAuth();

  if (!user) {
    // Se não estiver logado, redireciona para o login
    return <Navigate to="/" replace />;
  }

  // Se o usuário está logado mas sua role não está na lista de roles permitidas
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // Pode redirecionar para uma página de "acesso negado" ou para o próprio dashboard
    return <Navigate to="/dashboard" replace />;
  }

  return children;
};

export default ProtectedRoute;