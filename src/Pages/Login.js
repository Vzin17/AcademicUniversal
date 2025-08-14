// src/pages/Login/index.js

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext'; // Verifique se o caminho está certo!
import { useNavigate, Link } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { login } = useAuth(); // Pegamos a função de login do nosso contexto!
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault(); // Impede o recarregamento da página

    try {
      // Chama a função de login que está no AuthContext
      await login(email, password);

      // Se o login deu certo, navega para a página principal/dashboard
      navigate('/dashboard'); // Mude '/dashboard' para a sua rota protegida

    } catch (error) {
      // O próprio AuthContext já vai mostrar um alerta de erro!
      console.error("Falha no login", error);
    }
  }

  return (
    <div>
      <h2>Entrar</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <label htmlFor="password">Senha</label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button type="submit">Entrar</button>
      </form>
      <p>
        Não tem uma conta? <Link to="/register">Cadastre-se</Link>
      </p>
    </div>
  );
}

export default Login;