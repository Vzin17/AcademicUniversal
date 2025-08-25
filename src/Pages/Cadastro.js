import { useState } from 'react';
import './CSS_Pgs/Cadastro.css';
import logo from '../Componentes/IMAGENS/InterSocial.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';


function Cadastro() {

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  const [tipoUsuario, setTipoUsuario] = useState('');


  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);


const navigate = useNavigate();
  
  
const handleSubmit = async (event) => {
    event.preventDefault();
    if (senha !== confirmaSenha) {
    alert("Erro: As senhas não correspondem!");
    return;
  } 

  try {
    await api.post('/usuarios', {
      nome,
      email,
      senha,
      role: tipoUsuario
    });
    alert('Cadastro realizado com sucesso!');
  } catch (error) {
    alert('Erro no cadastro!');
    console.error(error);
  }
};

return(
  <main>
    <img src={logo} alt="Logotipo Vincle" />
    <h2>Cadastro</h2>

    <form className="formulario" onSubmit={handleSubmit}>
      <input 
        type="text" 
        placeholder="Nome" 
        value={nome}
        onChange={(e) => setNome(e.target.value)}
        required 
      />
      <input 
        type="email" 
        placeholder="Email" 
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required 
      />

      <div className="password-container">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder='Senha'
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <span className="password-icon" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <FaEye /> : <FaEyeSlash />}
        </span>
      </div>

      <div className="password-container">
        <input
          type={showConfirmPassword ? 'text' : 'password'}
          placeholder='Confirmar Senha'
          value={confirmaSenha}
          onChange={(e) => setConfirmaSenha(e.target.value)}
          required
        />
        <span className="password-icon" onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
          {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
        </span>
      </div>

      <select 
        value={tipoUsuario}
        onChange={(e) => setTipoUsuario(e.target.value)}
        required
      >
        <option value="">Selecione seu perfil</option>
        <option value="Estudante">Estudante</option>
        <option value="Coordenador">Coordenador</option>
        <option value="Paciente">Paciente</option>
        <option value="Recepcionista">Recepcionista</option>
      </select>
      
      <button type="submit">Cadastrar</button>
    </form>
  </main>
);

};


export default Cadastro;