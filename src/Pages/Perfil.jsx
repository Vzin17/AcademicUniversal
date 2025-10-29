import React from 'react';
import { useAuth } from '../contexts/AuthContext';

function Perfil() {
  const { user } = useAuth();

  if (!user) {
    return <div>Carregando...</div>;
  }

  return (
    <div className="conta-section">
      <h2>Meus Dados</h2>
      <div className="card-info">
        <p><strong>Nome:</strong> {user?.nome_completo}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Função:</strong> {user?.funcao}</p>
        {user?.ra && <p><strong>RA:</strong> {user.ra}</p>}
      </div>
    </div>
  );
}

export default Perfil;