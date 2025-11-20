// src/Pages/Login/index.jsx - VERSÃO CORRIGIDA E SIMPLIFICADA

import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient'; 
import './CSS_Pgs/Login.css';
import logo from '../Componentes/IMAGENS/InterSocial.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';

function Login() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  // ALTERADO: A função agora usa o supabase diretamente e NÃO faz o redirecionamento.
  async function handleSubmit(e) {
    e.preventDefault();
    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email,
        password: senha,
      });

      if (error) {
        throw error; // Joga o erro para o catch
      }
      
      navigate('/'); 

    } catch (error) {
      console.error("Falha no login", error);
      alert('Email ou senha incorretos!');
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