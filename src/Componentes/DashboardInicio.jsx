import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import '../Pages/CSS_Pgs/PainelCoordenador.css';

function DashboardInicio() {
  const { user } = useAuth();

  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="painel-coordenador-container">
      
        <h2>Bem-vindo, {user.nome_completo}!</h2>
        <p>
          {user.funcao === 'coordenador' 
            ? 'Painel do Coordenador - Acompanhe os prontuários da especialidade'
            : 'Painel do Professor - Visualize prontuários supervisionados'
          }
        </p>

      <div className="cards-painel-superior">
        <Link to="/prontuarios/recentes" className="card-painel">
          <h3>Prontuários Recentes</h3>
          <p>Ver prontuários da última semana</p>
        </Link>
      </div>

      <div className="acoes-rapidas-section">
        <h3>Ações Rápidas</h3>
        <div className="acoes-rapidas-container">
          <Link to="/pacientes" className="botao-acao">
            Buscar Pacientes
          </Link>
          <Link to="/agendamento" className="botao-acao">Fazer Agendamento</Link>
          {user.funcao === 'coordenador' && (
            <Link to="/admin" className="botao-acao">
              Painel Administrativo
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default DashboardInicio;