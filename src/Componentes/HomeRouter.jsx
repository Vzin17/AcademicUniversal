// src/Componentes/HomeRouter.jsx

import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import Inicio from '../Pages/Inicio/Inicio.jsx';
import DashboardRouter from './DashboardRouter.jsx';

const HomeRouter = () => {
  const { user } = useAuth();

  // Esta é a lógica "inteligente":
  // Se houver um 'user' (usuário logado), renderiza o DashboardRouter.
  // Se não, renderiza a página de 'Inicio' (Landing Page).
  return user ? <DashboardRouter /> : <Inicio />;
};

export default HomeRouter;