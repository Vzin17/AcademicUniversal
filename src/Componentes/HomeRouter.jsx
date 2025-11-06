// src/Componentes/HomeRouter.jsx

import React from 'react';
import { useAuth } from '../Contexts/AuthContext';
import Inicio from '../Pages/Inicio/Inicio.jsx';
import DashboardRouter from './DashboardRouter.jsx';

const HomeRouter = () => {
  const { user, loading } = useAuth();

  // Se ainda estiver carregando os dados do usuário, exibe uma mensagem.
  if (loading) {
    return <div>Carregando...</div>;
  }

  // Após o carregamento:
  // Se 'user' existir, o DashboardRouter (que agora tem user.funcao) decide qual painel mostrar.
  // Caso contrário, mostra a página inicial para visitantes.
  return user ? <DashboardRouter /> : <Inicio />;
};

export default HomeRouter;