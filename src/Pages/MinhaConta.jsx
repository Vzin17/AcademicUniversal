import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../Pages/CSS_Pgs/MinhaConta.css'; // Usaremos um novo CSS para esta página
import Seguranca from './Seguranca';
import MeusAgendamentos from './MeusAgendamentos';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

function MinhaConta() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) {
    return <div>Carregando informações da conta...</div>;
  }

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (!user) {
    return <div>Não foi possível carregar as informações do usuário.</div>;
  }

  return (
    <div className="minha-conta-wrapper">
      <div className="minha-conta-container">
        <div className="minha-conta-header">
          <h1 className="minha-conta-title">Minha Conta</h1>
          <p className="minha-conta-subtitle">Gerencie suas informações, agendamentos e segurança.</p>
        </div>

        <div className="minha-conta-grid">
          {/* Coluna da Esquerda */}
          <div className="coluna-principal">
            <div className="conta-card">
              <h2 className="card-title">Meus Dados</h2>
              <div className="dados-pessoais">
                <div className="dado-item">
                  <strong>Nome:</strong>
                  <span>{user.nome_completo || 'Não informado'}</span>
                </div>
                <div className="dado-item">
                  <strong>E-mail:</strong>
                  <span>{user.email || 'Não informado'}</span>
                </div>
                <div className="dado-item">
                  <strong>Função:</strong>
                  <span className="funcao-tag">{user.funcao || 'Não informada'}</span>
                </div>
                {user.ra && (
                  <div className="dado-item">
                    <strong>RA:</strong>
                    <span>{user.ra}</span>
                  </div>
                )}
                {user.areas?.name && (
                  <div className="dado-item">
                    <strong>Especialidade:</strong>
                    <span>{user.areas.name}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="conta-card">
              <h2 className="card-title">Segurança</h2>
              <Seguranca />
            </div>

            {/* Card para o botão de sair */}
            <div className="conta-card card-sair">
              <button onClick={handleLogout} className="btn-sair">
                Sair da Conta
              </button>
            </div>
          </div>

          {/* Coluna da Direita */}
          <div className="coluna-lateral">
            <div className="conta-card">
              <h2 className="card-title">Ações Rápidas</h2>
              <div className="acoes-rapidas-conta">
                <Link to="/servicos" className="acao-item">Ver Serviços</Link>
                {/* Adicione outras ações conforme necessário */}
              </div>
            </div>

            <div className="conta-card">
              <h2 className="card-title">Meus Agendamentos</h2>
              <MeusAgendamentos />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default MinhaConta;