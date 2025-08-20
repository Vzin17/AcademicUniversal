// src/pages/Login/index.js
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import './CSS_Pgs/Login.css';
import logo from '../Componentes/IMAGENS/InterSocial.png';
import api from '../services/api';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  


async function handleSubmit(e) {
  e.preventDefault();
  try {
    // Use a variável 'senha' que vem do seu estado (useState)
    await login(email, senha); // <-- Trocar 'password' por 'senha'
    navigate('/dashboard'); 
  } catch (error) {
    console.error("Falha no login", error);
    // Adicionar um feedback para o usuário aqui seria uma boa prática!
    // Ex: alert('Email ou senha incorretos!');
  }
}

  return (
    <main>
      <img src={logo} alt="Logotipo Vincle" />
      <h2>Entrar</h2>
      <form onSubmit={handleSubmit}>
        <input
          id="email"
          type="email"
          placeholder='Email'
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        
      <div className="password-container">
        <input
          type={showPassword ? 'text' : 'password'}
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
          required
        />
        <span className="password-icon" onClick={() => setShowPassword(!showPassword)}>
          {showPassword ? <FaEye /> : <FaEyeSlash />}
        </span>
      </div>

        <button type="submit">Entrar</button>
      </form>
      <p>
        Não tem uma conta? <Link to="/cadastro">Cadastre-se</Link>
      </p>
    </main>
  );
}

export default Login;