// Header.jsx
import './Header.css';
import logo from './Imgs/InterSocial.png';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';

function Header() {
  const [tipoUsuario, setTipoUsuario] = useState(null);

  useEffect(() => {
    const dados = JSON.parse(localStorage.getItem("usuario"));
    if (dados) setTipoUsuario(dados.tipo);
  }, []);

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
          <li><Link to="/cadastro">Cadastro</Link></li>
          <li><Link to="/servicos">Serviços</Link></li>
          <li><Link to="/projeto">O Projeto</Link></li>
          <li><Link to="/contato">Contato</Link></li>

          {tipoUsuario === "aluno" && (
            <>
              <li><Link to="/agendamento">Agendar Consulta</Link></li>
              <li><Link to="/historico">Histórico atendimentos</Link></li>
              <li><Link to="/relatorio">Relatórios dos Atendimentos</Link></li>
            </>
          )}

          {tipoUsuario === "coordenador" && (
            <>
              <li><Link to="/gerenciar-alunos">Gerenciar Alunos</Link></li>
              <li><Link to="/consultas">Consultas Agendadas</Link></li>
            </>
          )}
        </ul>
      </nav>

      <div className="menu-conta">
        <a href="#login-voluntario">Conta</a>
      </div>
    </header>
  );
}

export default Header;
