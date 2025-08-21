// Header.jsx (Refatorado)
import React from 'react';
import './Header.css';
import logo from './Imgs/InterSocial.png';
import { Link } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';


function Header() {
  const { isAuthenticated, user, logout } = useAuth();

  return (
    <header className='meu-cabecalho'>
      <div className="logo-e-titulo">
        <img src={logo} alt="Logotipo Inter Social" />
        <div className="textos-header">
          <h1>Vincle</h1>
        </div>
      </div>

      <nav className="menu-navegacao">
        <ul>
          <li><Link to="/">Início</Link></li>
          {!isAuthenticated && <li><Link to="/cadastro">Cadastro</Link></li>} {/* Mostra só se não estiver logado */}
          <li><Link to="/servicos">Serviços</Link></li>
          <li><Link to="/projeto">O Projeto</Link></li>


          {/* Menus que aparecem baseado no `role` do usuário logado */}
          {isAuthenticated && user.role === 'ALUNO' && (
            <>
              <li><Link to="/agendamento">Agendar Consulta</Link></li>
              <li><Link to="/historico">Meu Histórico</Link></li>
            </>
          )}

          {isAuthenticated && user.role === 'COORDENADOR' && (
            <>
              <li><Link to="/admin/gerenciar-alunos">Gerenciar Alunos</Link></li>
              <li><Link to="/admin/consultas">Consultas Agendadas</Link></li>
            </>
          )}
        </ul>
      </nav>

      <div className="menu-conta">
        {isAuthenticated ? (
          <>
            <span>Olá, {user.nome}</span>
            <button onClick={logout}>Sair</button> {/* Botão de Logout! */}
          </>
        ) : (
          <Link to="/login">Entrar</Link> // Link para a página de Login
        )}
      </div>
    </header>
  );
}

export default Header;