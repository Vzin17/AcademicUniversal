import { useState } from 'react';
import './CSS_Pgs/Cadastro.css';
import logo from '../Componentes/IMAGENS/InterSocial.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa'; 





function Cadastro() {

  const [showPassword, setShowPassword] = useState(false);


  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };
  return (
    <main>
      <img src={logo} alt="Logotipo Inter Social" />
      <h2>Cadastro</h2>
      <form className="formulario">
        <input type="text" placeholder="Nome" required />
        <input type="email" placeholder="Email" required />

      
        <div className="password-container">
          <input
            type={showPassword ? 'text' : 'password'}
            placeholder='Senha'
            required
          />
      
          <span className="password-icon" onClick={togglePasswordVisibility}>
            
            {showPassword ? <FaEye /> : <FaEyeSlash />}
          </span>
        </div>

        <select required>
          <option value="">Selecione</option>
          <option>Estudante</option>
          <option>Coordenador</option>
          <option>Paciente</option>
          <option>Recepcionista</option>
        </select>
        <button type="submit">Cadastrar</button>
      </form>
    </main>
  );
}

export default Cadastro;
