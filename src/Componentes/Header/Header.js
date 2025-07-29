
import './Header.css';
import logo from './Imgs/Chapeu AcademicUniversal.png'
import { Link } from 'react-router-dom';

function Header() {
  return(
  <header className='meu-cabecalho'>
      <div className="logo-e-titulo">
        <img src={logo} alt="Logotipo Academic Universal" />
        <div className="textos-header">
          <h1>Academic Universal</h1>
        </div>
      </div>

  
      <nav className="menu-navegacao">
        <ul>
          <li><Link to="/">Início</Link></li>
          <li><Link to="/cursos">Cursos</Link></li>
          <li><Link to="/sobre">Sobre</Link></li>
          <li><Link to="/contato">Contato</Link></li>
        </ul>
      </nav>

      <div className="menu-conta">
        <a href="#conta">Conta</a>
      </div>

      
    </header>
    );
}

export default Header;