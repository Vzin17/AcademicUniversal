// src/Componentes/ProtectedRoute.jsx

import React from 'react';
import { useAuth } from './contexts/AuthContext'; // Verifique se o caminho para o seu AuthContext está correto
import { Navigate } from 'react-router-dom';

/**
 * Este componente funciona como um "segurança" para as rotas.
 * @param {object} props
 * @param {React.ReactNode} props.children - O componente/página a ser renderizado se o acesso for permitido.
 * @param {string[]} props.allowedRoles - Um array com os nomes dos cargos que podem acessar a rota.
 */
function ProtectedRoute({ children, allowedRoles }) {
  // 1. Pega o usuário do nosso contexto global.
  const { user } = useAuth();

  // 2. Verifica se existe um usuário logado.
  if (!user) {
    // Se não houver, redireciona para a página de login.
    return <Navigate to="/login" replace />;
  }

  // 3. Pega o cargo (role) do usuário de forma segura.
  const userRole = user?.funcao?.toLowerCase() || '';

  // --- CÂMARA DE SEGURANÇA (Debug Logs) ---
  // As 3 linhas abaixo vão nos mostrar a verdade na consola do navegador.
  console.log("CARGO DO UTILIZADOR A SER VERIFICADO:", userRole);
  console.log("LISTA DE CARGOS PERMITIDOS:", allowedRoles);
  console.log("O CARGO ESTÁ NA LISTA?", allowedRoles.includes(userRole));
  // -----------------------------------------

  // 4. Verifica se o cargo do usuário está na lista de cargos permitidos.
  if (allowedRoles.includes(userRole)) {
    // Se estiver, permite o acesso e mostra a página (o `children`).
    return children;
  } else {
    // Se o usuário está logado, mas não tem o cargo certo, redireciona para a página inicial.
    return <Navigate to="/" replace />;
  }
}

export default ProtectedRoute;