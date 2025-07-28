import './Header.css';
import logo from './Imgs/Chapeu AcademicUniversal.png'

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
        <a href="#inicio">Início</a>
        <a href="#cursos">Cursos</a>
        <a href="#sobre">Sobre</a>
        <a href="#contato">Contato</a>
      </nav>

      <div className="menu-conta">
        <a href="#conta">Conta</a>
      </div>
      
    </header>
    );
}

export default Header;