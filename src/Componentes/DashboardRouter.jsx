// Salve este código em: src/components/DashboardRouter.jsx

import React from 'react';
import { useAuth } from '../contexts/AuthContext'; 
import PainelPaciente from '../paineis/PainelPaciente.jsx';
import PainelRecepcionista from '../paineis/PainelRecepcionista.jsx';
import PainelAluno from '../paineis/PainelAluno.jsx';
import PainelCoordenador from '../paineis/PainelCoordenador.jsx';
import PainelProfessor from '../paineis/PainelProfessor.jsx';


const DashboardRouter = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Carregando...</div>;
  }

  if (!user) return null;

  const userRole = user.funcao;

  switch (userRole) {
    case 'aluno':
      return <PainelAluno />;
    case 'paciente':
      return <PainelPaciente />;
    case 'coordenador': 
      return <PainelCoordenador />;
    case 'professor': 
      return <PainelProfessor />;
    case 'recepcionista':
      return <PainelRecepcionista />;
    default:
      return <div>Acesso negado. Cargo de usuário não reconhecido.</div>;
  }
};

export default DashboardRouter;