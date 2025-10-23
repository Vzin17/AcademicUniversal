import React from 'react';
import { useAuth } from '../contexts/AuthContext';
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
        <div className="dashboard-stats">
          <div className="stat-card">
            <h3>Prontuários Recentes</h3>
            <p>Últimos prontuários criados pelos alunos</p>
          </div>
          
          <div className="stat-card">
            <h3>Especialidade</h3>
            <p>{user.especialidade_id || 'Não definida'}</p>
          </div>
        </div>

        <div className="dashboard-notifications">
          <NotificacoesProntuarios />
        </div>

        <div className="dashboard-actions">
          <h3>Ações Rápidas</h3>
          <div className="action-buttons">
            <a href="/pacientes" className="action-btn primary">
              Buscar Pacientes
            </a>
            <a href="/agendamento" className="action-btn secondary">
              Ver Agendamentos
            </a>
            {user.funcao === 'coordenador' && (
              <a href="/dashboard" className="action-btn tertiary">
                Painel Administrativo
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DashboardInicio;
