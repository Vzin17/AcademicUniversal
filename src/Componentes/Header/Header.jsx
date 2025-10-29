import React from 'react';
import './Header.css';
import logo from './Imgs/InterSocial.png';
import { Link, useNavigate } from 'react-router-dom';
// Corrigindo o caminho de importação
import { useAuth } from '../../Contexts/AuthContext.jsx';

function Header() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  const podeAcessarPacientes = user && (
    user.funcao === 'professor' ||
    user.funcao === 'coordenador' ||
    user.funcao === 'recepcionista' ||
    (user.funcao === 'aluno' && user.especialidade_id != null)
  );

  return (
    <header className='meu-cabecalho'>
      <div className="logo-e-titulo">
        <Link to="/">
          <img src={logo} alt="Logotipo Inter Social" />
        </Link>
        <div className="textos-header">
          <h1>Vincle</h1>
        </div>
      </div>

      <nav className="menu-navegacao">
        <ul>
         
          {!user && (
            <>
              <li><Link to="/">Início</Link></li>
              <li><Link to="/agendamento">Agendamentos</Link></li>
              <li><Link to="/servicos">Serviços</Link></li>
              <li><Link to="/projeto">O Projeto</Link></li>
            </>
          )}
          
          
          {user && (
            <>
              <li><Link to="/">Início</Link></li>
              <li><Link to="/minha-conta">Minha Conta</Link></li>
            </>
          )}

        
          {podeAcessarPacientes && (
            <li><Link to="/pacientes">Pacientes</Link></li>
          )}
        </ul>
      </nav>

      <div className="menu-conta">
        {user ? (
          <>
            <span className="saudacao-usuario">Olá, {user?.nome_completo}</span>
            <button onClick={handleLogout} className="botao-sair">Sair</button>
          </>
        ) : (
          <Link to="/login" className="botao-entrar">Entrar</Link>
        )}
      </div>
    </header>
  );
}

export default Header;