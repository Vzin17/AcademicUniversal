import { useAuth } from '../contexts/AuthContext';

const AlunoDashboard = () => {
  const { user, logout } = useAuth();
  return (
    <div style={{ padding: '20px' }}>
      <h1>Bem-vindo, {user.name}! (Aluno)</h1>
      <p>Esta é a sua página. Aqui você pode ver suas notas, horários e acessar a página da faculdade.</p>
      <button onClick={logout}>Sair</button>
    </div>
  );
};

export default AlunoDashboard;