import { useAuth } from '../contexts/AuthContext';

const PacienteDashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div style={{ padding: '20px' }}>
      <h1>Bem-vindo, {user.name}! (Paciente)</h1>
      <p>Esta é a sua página. Aqui você pode ver suas consultas e resultados de exames.</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
};

export default PacienteDashboard;