import React from 'react';
import { useAuth } from '../contexts/AuthContext';
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
        <a href="/pacientes" className="action-btn primary">
          Buscar Pacientes
        </a>
        <a href="/agendamento" className="action-btn secondary">
          Fazer Agendamento
        </a>
        <a href="/minha-conta" className="action-btn tertiary">
          Minha Conta
        </a>
      </div>
    </div>
  );
}

export default AlunoDashboard;
