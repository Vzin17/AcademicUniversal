  // src/Componentes/ProtectedRoute.jsx

  import React from 'react';
  import { useAuth } from './contexts/AuthContext'; // Importa nosso hook de autenticação
  import { Navigate } from 'react-router-dom';     // Importa o componente para redirecionar

  /**
   * Este componente funciona como um "segurança" para as rotas.
   * @param {object} props
   * @param {React.ReactNode} props.children - O componente/página a ser renderizado se o acesso for permitido.
   * @param {string[]} props.allowedRoles - Um array com os nomes dos cargos que podem acessar a rota.
   */
  function ProtectedRoute({ children, allowedRoles }) {
    // 1. Pega o usuário do nosso contexto global.
    const { user } = useAuth();

    console.log('ProtectedRoute está verificando o usuário:', user);
    // 2. Verifica se existe um usuário logado.
    if (!user) {
      // Se não houver, redireciona para a página de login.
      console.log("ProtectedRoute: Usuário não logado. Redirecionando para /login.");
      return <Navigate to="/login" replace />;
    }

    // 3. Pega o cargo (role) do usuário do lugar certo (user_metadata).
    // O "?." (optional chaining) é uma segurança para evitar erros caso user_metadata não exista.
     // ALTERADO AQUI: Adicionado .toLowerCase() para ignorar maiúsculas/minúsculas
  const userRole = user.funcao.toLowerCase();

    // 4. Verifica se o cargo do usuário está na lista de cargos permitidos.
    if (allowedRoles.includes(userRole)) {
      // Se estiver, permite o acesso e mostra a página (o `children`).
      console.log(`ProtectedRoute: Acesso permitido para o cargo '${userRole}'.`);
      return children;
    } else {
      // Se o usuário está logado, mas não tem o cargo certo, redireciona para a página inicial.
      // ISSO EXPLICA O COMPORTAMENTO QUE VOCÊ VIU!
      console.log(`ProtectedRoute: Acesso negado. Cargo '${userRole}' não está em [${allowedRoles.join(', ')}]. Redirecionando para /.`);
      return <Navigate to="/" replace />;
    }
  }

  export default ProtectedRoute;  