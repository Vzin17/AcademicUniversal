import './Inicio.css';
import { useNavigate } from 'react-router-dom';

function Inicio(){
  const navigate = useNavigate();

  const handleClick = () => {
    navigate('/criarConta');
  };

    return(
    <main>
    <section className="hero">
        <h1>Conectando Universitários e Profissionais</h1>
        <p>A plataforma que transforma conhecimento em oportunidades.</p>
        <button onClick={handleClick}>Crie sua Conta Gratuitamente</button>

    </section>

    <section className="features">
        <h2>O que você encontra aqui?</h2>
        <div className="cards">
        <div className="card">Compartilhe TCCs e Trabalhos</div>
        <div className="card">Marketplace de livros e materiais</div>
        <div className="card">Cursos e eventos</div>
        <div className="card">Networking acadêmico</div>
        </div>
    </section>

    </main>

    );
}


export default Inicio;