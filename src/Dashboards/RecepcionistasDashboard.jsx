import { useAuth } from "../contexts/AuthContext";

const RecepcionistaDashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div style={{ padding: '20px' }}>
      <h1>Bem-vindo, {user.name}! (Recepcionista)</h1>
      <p>Esta é a sua área de atendimento. Você pode cadastrar novos pacientes e agendar consultas.</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
};

export default RecepcionistaDashboard;