
import './Header.css';
import logo from './Imgs/InterSocial.png'
import { Link } from 'react-router-dom';

function Header() {
  return(
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
            <li><Link to="/servicos">Serviços</Link></li> 
            <li><Link to="/projeto">O Projeto</Link></li>
            <li><Link to="/seja-voluntario">Seja Voluntário</Link></li>
            <li><Link to="/contato">Contato</Link></li>
        </ul>
    </nav>

    <div className="menu-conta">
        <a href="#login-voluntario">Conta</a>
    </div>

      
    </header>
    );
}

export default Header;