import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import '../Pages/CSS_Pgs/MinhaConta.css';
import Seguranca from './Seguranca';
import MeusAgendamentos from './MeusAgendamentos';
import { Link, useNavigate } from 'react-router-dom';

function MinhaConta() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();

  if (loading) return <div className="loading-screen">Carregando perfil...</div>;
  if (!user) return <div>Erro ao carregar usuário.</div>;

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
    } catch (error) {
      console.error("Erro ao sair", error);
    }
  };

  // Função para pegar as iniciais ou a primeira letra
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.charAt(0).toUpperCase();
  };

  return (
    <div className="minha-conta-wrapper">
      <div className="minha-conta-container">
        
        {/* Cabeçalho da Página */}
        <div className="minha-conta-header">
          <div>
            <h1 className="minha-conta-title">Minha Conta</h1>
            <p className="minha-conta-subtitle">Bem-vindo ao seu painel pessoal.</p>
          </div>
        </div>

        <div className="minha-conta-grid">
          
          {/* --- COLUNA ESQUERDA (Perfil e Ações Focadas) --- */}
          <aside className="coluna-perfil">
            
            {/* Card de Identidade */}
            <div className="conta-card">
              <div className="perfil-header">
                <div className="avatar-circle">
                  {getInitials(user.nome_completo)}
                </div>
                <div>
                  <h2 className="perfil-nome">{user.nome_completo || 'Usuário'}</h2>
                  <p className="perfil-email">{user.email}</p>
                  <span className="funcao-badge">{user.funcao || 'Membro'}</span>
                </div>
              </div>

              <div className="perfil-detalhes">
                {user.ra && (
                  <div className="info-row">
                    <span className="info-label">RA</span>
                    <span className="info-value">{user.ra}</span>
                  </div>
                )}
                {user.areas?.name && (
                  <div className="info-row">
                    <span className="info-label">Especialidade</span>
                    <span className="info-value">{user.areas.name}</span>
                  </div>
                )}
                <div className="info-row">
                  <span className="info-label">Status</span>
                  <span className="info-value" style={{color: '#27ae60'}}>Ativo</span>
                </div>
              </div>

              <button onClick={handleLogout} className="btn-sair-outline">
                <span>Encerrar Sessão</span>
              </button>
            </div>

            {/* Ações Rápidas */}
            <div className="conta-card">
              <h3 className="card-title">Acesso Rápido</h3>
              <div className="acoes-grid">
                <Link to="/servicos" className="acao-btn">Serviços</Link>
                <Link to="/historico" className="acao-btn">Histórico</Link>
              </div>
            </div>
          </aside>

          {/* --- COLUNA DIREITA (Conteúdo Principal - MAIS LARGURA AQUI) --- */}
          <main className="coluna-conteudo">
            
            {/* Agendamentos */}
            <div className="conta-card">
              <h2 className="card-title">📅 Meus Agendamentos</h2>
              <MeusAgendamentos />
            </div>

            {/* Segurança da Conta (MOVIDO PARA AQUI) */}
            <div className="conta-card">
              <h2 className="card-title">🔒 Segurança da Conta</h2>
              {/* O componente Seguranca agora terá espaço total */}
              <Seguranca />
            </div>

          </main>
        </div>
      </div>
    </div>
  );
}

export default MinhaConta;