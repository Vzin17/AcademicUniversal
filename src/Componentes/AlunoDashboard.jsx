import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom'; // Adicionado o Link
import '../Pages/CSS_Pgs/Dashboard.css';

function AlunoDashboard() {
  const { user } = useAuth();

  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="aluno-dashboard">
      <h1>Olá, {user.nome_completo}!</h1>
      <p>Bem-vindo ao sistema de prontuários acadêmicos.</p>
      
      <div className="aluno-actions">
        <Link to="/pacientes" className="action-btn primary">
          Buscar Pacientes
        </Link>
        <Link to="/agendamento" className="action-btn secondary">
          Fazer Agendamento
        </Link>
        <Link to="/minha-conta" className="action-btn tertiary">
          Minha Conta
        </Link>
      </div>
    </div>
  );
}

export default AlunoDashboard;
