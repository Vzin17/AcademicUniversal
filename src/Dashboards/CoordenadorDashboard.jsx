import { useAuth } from '../contexts/AuthContext';

const CoordenadorDashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div style={{ padding: '20px' }}>
      <h1>Bem-vindo, {user.name}! (Coordenador)</h1>
      <p>Esta é a sua área de gestão. Você pode visualizar e editar dados de todos os alunos e pacientes.</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
};

export default CoordenadorDashboard;