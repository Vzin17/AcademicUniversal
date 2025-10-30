// Salve este código em: src/components/DashboardRouter.jsx

import React from 'react';
import { useAuth } from '../contexts/AuthContext'; 
import DashboardInicio from './DashboardInicio.jsx';
import AlunoDashboard from './AlunoDashboard.jsx'; // 1. Importamos o painel correto do aluno
import PainelPaciente from '../paineis/PainelPaciente.jsx';
import PainelRecepcionista from '../paineis/PainelRecepcionista.jsx'; // Corrigido o caminho


const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) {
    // Se o usuário não estiver logado, não mostra nada
    return null;
  }

  const userRole = user.funcao;

  switch (userRole) {
     case 'aluno':
      return <AlunoDashboard />; // 2. Usamos o painel correto
    case 'paciente':
      return <PainelPaciente />;
    // 2. Coordenadores e Professores agora veem o DashboardInicio
    case 'coordenador': 
    case 'professor': 
      return <DashboardInicio />;
    case 'recepcionista':
      return <PainelRecepcionista />;
    default:
      return <div>Acesso negado. Cargo de usuário não reconhecido.</div>;
  }
};

export default DashboardRouter;