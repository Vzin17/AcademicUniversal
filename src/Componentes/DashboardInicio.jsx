import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';

// 1. MUDANÇA: Estamos importando o CSS correto, que já criamos!
import '../Pages/CSS_Pgs/PainelCoordenador.css';

function DashboardInicio() {
  const { user } = useAuth();

  if (!user) {
    return <div>Carregando...</div>;
  }

  // 2. MUDANÇA: Renomeamos as classes do HTML (JSX) para
  //    baterem com os nomes que já definimos no arquivo CSS.

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
          <p>Últimos prontuários criados pelos alunos</p>
        </Link>
      </div>

      {/* 3. MUDANÇA: Usamos o container de notificação simples
           para ficar idêntico à Imagem 2 */}
      <div className="notificacoes-container">
        <p>Nenhuma notificação encontrada.</p>
      </div>

      <div className="acoes-rapidas-section">
        <h3>Ações Rápidas</h3>
        <div className="acoes-rapidas-container">
          <Link to="/" className="botao-acao">
            Início
          </Link>
          <Link to="/pacientes" className="botao-acao">
            Buscar Pacientes
          </Link>
          <Link to="/agendamento" className="botao-acao">
            Ver Agendamentos
          </Link>
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