import React from 'react';
import './Header.css';
import logo from './Imgs/InterSocial.png';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../Contexts/AuthContext.jsx';

function Header() {
  const { user, logout } = useAuth(); // Mantemos 'user' para verificar login
  const navigate = useNavigate();

  // A função handleLogout já não é usada aqui, mas mantemos por segurança
  // caso precises dela noutro sítio ou para um futuro botão de sair no Header.
  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  // A tua lógica para o link 'Pacientes' já estava perfeita.
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
          <li><Link to="/">Início</Link></li>

          {/* Links para utilizadores NÃO logados */}
          {!user && (
            <>
              <li><Link to="/agendamento">Agendamento</Link></li>
              <li><Link to="/servicos">Serviços</Link></li>
              <li><Link to="/projeto">O Projeto</Link></li>
            </>
          )}

          {/* Links para utilizadores LOGADOS */}
          {user && (
            <>
              {/* Removido: <li><Link to="/dashboard">Painel</Link></li> */}
              <li><Link to="/minha-conta">Minha Conta</Link></li>
            </>
          )}

          {/* O teu link de Pacientes (lógica já estava correta) */}
          {podeAcessarPacientes && (
            <li><Link to="/pacientes">Pacientes</Link></li>
          )}
        </ul>
      </nav>

      <div className="menu-conta">
        {!user && ( // Apenas mostra o botão "Entrar" se o utilizador NÃO estiver logado
          <Link to="/login" className="botao-entrar">Entrar</Link>
        )}
      </div>
    </header>
  );
}

export default Header;