import React from 'react';
import { useState } from 'react';
import './CSS_Pgs/Cadastro.css';
import logo from '../Componentes/IMAGENS/InterSocial.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';


function Cadastro() {

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  
  // Alterado: Novo estado para o tipo de usuário e para o RA
  const [tipoUsuario, setTipoUsuario] = useState(''); 
  const [ra, setRa] = useState('');


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
      // Objeto com os dados do usuário
      const userData = {
        nome,
        email,
        senha,
        role: tipoUsuario,
      };

      // Adiciona o RA se for estudante
      if (tipoUsuario === 'Estudante') {
        userData.ra = ra;
      }

      await api.post('/usuarios', userData);
      alert('Cadastro realizado com sucesso!');
      navigate('/login'); // Redireciona para o login após o sucesso
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
        
        {/* NOVO: Botões de seleção de perfil */}
        <div className="seletor-perfil">
          <p>Selecione seu perfil:</p>
          <div className="opcoes-perfil">
            <button 
              type="button" 
              className={tipoUsuario === 'Estudante' ? 'ativo' : ''}
              onClick={() => setTipoUsuario('Estudante')}
            >
              Estudante
            </button>
            <button 
              type="button"
              className={tipoUsuario === 'Paciente' ? 'ativo' : ''}
              onClick={() => setTipoUsuario('Paciente')}
            >
              Paciente
            </button>
          </div>
        </div>

        {/* NOVO: Renderização condicional do campo de RA */}
        {tipoUsuario === 'Estudante' && (
          <input 
            type="text" 
            placeholder="Registro Acadêmico (RA)" 
            value={ra}
            onChange={(e) => setRa(e.target.value)}
            required 
          />
        )}
        
        <button type="submit">Cadastrar</button>

        <p>Já tem uma conta? <Link to="/login">Entrar</Link></p>
      </form>
    </main>
  );

};

export default Cadastro;