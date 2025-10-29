import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import NotificacoesProntuarios from '../Componentes/NotificacoesProntuarios';
import '../Pages/CSS_Pgs/Dashboard.css';

function DashboardInicio() {
  const { user } = useAuth();

  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Bem-vindo, {user.nome_completo}!</h1>
        <p className="dashboard-subtitle">
          {user.funcao === 'coordenador' 
            ? 'Painel do Coordenador - Acompanhe os prontuários da especialidade'
            : 'Painel do Professor - Visualize prontuários supervisionados'
          }
        </p>
      </div>

      <div className="dashboard-content">
        <div className="cards-painel-superior">
          <Link to="/pacientes" className="card-painel">
            <h3>Prontuários Recentes</h3>
            <p>Últimos prontuários criados pelos alunos</p>
          </Link>
          
          <div className="card-painel">
            <h3>Especialidade</h3>
            
            <p>{user.areas?.name || 'Não definida'}</p>
          </div>
        </div>

        <div className="dashboard-notifications">
          <NotificacoesProntuarios />
        </div>

        <div className="dashboard-actions">
          <h3>Ações Rápidas</h3>
          <div className="action-buttons">
            <Link to="/" className="action-btn primary">
              Início
            </Link>
            <Link to="/pacientes" className="action-btn secondary">
              Buscar Pacientes
            </Link>
            <Link to="/agendamento" className="action-btn tertiary">
              Ver Agendamentos
            </Link>
            {user.funcao === 'coordenador' && (
              <Link to="/admin" className="action-btn tertiary">
                Painel Administrativo
              </Link>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardInicio;
