import React from 'react';
import { useAuth } from './contexts/AuthContext';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (!allowedRoles) {
    return children;
  }

  const userRole = user?.funcao?.trim().toLowerCase() || '';

  if (allowedRoles.includes(userRole)) {
    return children;
  } else {
    return <Navigate to="/" replace />;
  }
}

export default ProtectedRoute;