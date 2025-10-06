// Salve este código em: src/components/DashboardRouter.jsx

import React from 'react';
import { useAuth } from '../contexts/AuthContext'; 
import PainelAluno from '../paineis/PainelAluno.jsx';
import PainelPaciente from '../paineis/PainelPaciente.jsx';
import PainelCoordenador from '../paineis/PainelCoordenador.jsx';
import PainelRecepcionistas from '../paineis/PainelRecepcionistas.jsx';

const DashboardRouter = () => {
  const { user } = useAuth();

  if (!user) {
    // Se o usuário não estiver logado, não mostra nada
    return null;
  }

  const userRole = user.funcao;

  switch (userRole) {
    case 'aluno':
      return <PainelAluno />;
    case 'paciente':
      return <PainelPaciente />;
    case 'coordenador':
      return <PainelCoordenador />;
    case 'recepcionista':
      return <PainelRecepcionistas />;
    default:
      return <div>Acesso negado. Cargo de usuário não reconhecido.</div>;
  }
};

export default DashboardRouter;