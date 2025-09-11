import React from 'react';
import { useState } from 'react';
import './CSS_Pgs/Cadastro.css';
import logo from '../Componentes/IMAGENS/InterSocial.png';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

// ADICIONADO: Importa o cliente do Supabase.
// Verifique se o caminho para o seu arquivo de configuração do Supabase está correto!
import { supabase } from '../supabaseClient'; 

// REMOVIDO: A importação do 'api' (Axios) não é mais necessária aqui.
// import api from '../services/api'; 


function Cadastro() {

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmaSenha, setConfirmaSenha] = useState('');
  
  const [tipoUsuario, setTipoUsuario] = useState(''); 
  const [ra, setRa] = useState('');

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();
  
  
  // ALTERADO: Esta é a função de envio corrigida para usar o Supabase Auth.
  const handleSubmit = async (event) => {
    event.preventDefault();
    if (senha !== confirmaSenha) {
      alert("Erro: As senhas não correspondem!");
      return;
    }

    try {
      // Objeto com os dados extras que queremos salvar junto com o usuário
      const metaData = {
        nome: nome,
        role: tipoUsuario,
        // Adiciona o RA apenas se for estudante
        ...(tipoUsuario === 'Estudante' && { ra: ra }),
      };

      // Usando a função correta do Supabase para cadastrar um novo usuário
      const { data, error } = await supabase.auth.signUp({
        email: email,       // O email para o login
        password: senha,    // A senha para o login
        options: {
          data: metaData // Aqui colocamos os dados extras (nome, role, ra)
        }
      });

      // Se o Supabase retornar um erro, ele será capturado aqui
      if (error) {
        throw error;
      }

      alert('Cadastro realizado com sucesso! Verifique seu e-mail para ativar a conta.');
      navigate('/login'); // Redireciona para o login após o sucesso

    } catch (error) {
      // Exibe a mensagem de erro específica do Supabase
      alert(`Erro no cadastro: ${error.message}`);
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