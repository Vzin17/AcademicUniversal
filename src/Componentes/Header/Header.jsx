import React from 'react';
import './Header.css';
import logo from './Imgs/InterSocial.png'; // Verifique se o caminho para a logo está correto
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext'; // Verifique se o caminho para o context está correto

function Header() {
  // Pega o usuário e a função de logout do nosso contexto global.
  // Se 'user' for null, ninguém está logado.
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    // Após o logout, redireciona o usuário para a página inicial.
    navigate('/');
  };

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
          <li><Link to="/agendamento">Agendamento</Link></li>
          <li><Link to="/servicos">Serviços</Link></li>
          <li><Link to="/projeto">O Projeto</Link></li>
          
          {/* Mostra o link para a 'Minha Conta' apenas se o usuário estiver logado */}
          {user && (
            <li><Link to="/minha-conta">Minha Conta</Link></li>
          )}
        </ul>
      </nav>

      <div className="menu-conta">
        {/* Lógica para mostrar os botões corretos */}
        {user ? (
          // Se EXISTE um usuário logado:
          <>
            {/* O '?.' é uma segurança para não quebrar se o nome ainda não carregou */}
            <span className="saudacao-usuario">Olá, {user?.nome_completo}</span>
            <button onClick={handleLogout} className="botao-sair">Sair</button>
          </>
        ) : (
          // Se NÃO existe um usuário logado:
          <Link to="/login" className="botao-entrar">Entrar</Link>
        )}
      </div>
    </header>
  );
}

export default Header;