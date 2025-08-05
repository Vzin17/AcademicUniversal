import './CSS_Pgs/Cadastro.css';
import logo from '../Componentes/IMAGENS/InterSocial.png'

function Cadastro() {
  return (
    <main>
      <img src={logo} alt="Logotipo Inter Social" />
      <h2>Cadastro</h2>
      <form className="formulario">
        <input type="text" placeholder="Nome" required />
        <input type="email" placeholder="Email" required />
        <select required>
          <option value="">Selecione</option>
          <option>Estudante</option>
          <option>Professor</option>
          <option>Paciente</option>
        </select>
        <button type="submit">Enviar</button>
      </form>
    </main>
  );
}

export default Cadastro;
