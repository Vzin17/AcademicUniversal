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
  // COLE ESTE CÓDIGO NO LUGAR DA SUA FUNÇÃO handleSubmit INTEIRA

const handleSubmit = async (event) => {
  event.preventDefault();

  // --- VALIDAÇÕES ---
  if (senha !== confirmaSenha) {
    alert("Erro: As senhas não correspondem!");
    return;
  }
  if (!tipoUsuario) {
    alert("Por favor, selecione um perfil (Estudante ou Paciente).");
    return;
  }
  if (tipoUsuario === 'Estudante' && !ra) {
    alert('Por favor, preencha seu Registro Acadêmico (RA).');
    return;
  }

  try {
    // --- ETAPA 1: Criar o usuário na autenticação ---
    // Esta chamada apenas cria o login e dispara o e-mail de confirmação.
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: email,
      password: senha,
    });

    if (authError) {
      throw authError; // Para aqui se o e-mail já existir, etc.
    }
    
    // Se chegou aqui, o usuário foi criado e o e-mail foi disparado.

    // --- ETAPA 2: Criar o perfil na nossa tabela 'perfis' ---
    const perfilParaSalvar = {
      id: authData.user.id,
      nome_completo: nome,
      email: email,
      funcao: tipoUsuario === 'Estudante' ? 'aluno' : 'paciente',
      ...(tipoUsuario === 'Estudante' && { ra: ra }),
    };
    
    const { error: profileError } = await supabase
      .from('perfis')
      .insert([perfilParaSalvar]);

    if (profileError) {
      // Se der erro aqui, o usuário foi criado mas o perfil não.
      // É importante saber disso.
      throw profileError;
    }

    // Se tudo deu certo:
    alert('Cadastro realizado com sucesso! Verifique seu e-mail para ativar a conta.');
    navigate('/login');

  } catch (error) {
    // Captura e exibe qualquer erro que tenha acontecido.
    alert(`Erro no cadastro: ${error.message}`);
    console.error("Detalhes do erro:", error);
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
            onChange={(e) => {
              // Permite apenas a inserção de números
              const numericValue = e.target.value.replace(/\D/g, '');
              setRa(numericValue);
            }}
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