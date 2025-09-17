

import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import ProtectedRoute from './ProtectedRoute';

// Importe todos os seus componentes de página
import Header from './Componentes/Header/Header.jsx';
import Footer from './Componentes/Footer/Footer.jsx';
import Inicio from './Pages/Inicio/Inicio.jsx';
import Cadastro from './Pages/Cadastro';
import Agendamento from './Pages/Agendamento';
import Servicos from './Pages/Servicos';
import Projeto from './Pages/Projeto';
import Contato from './Pages/Contato';
import Denuncia from './Pages/Denuncia';
import Login from './Pages/Login';
import Register from './Pages/Register';

// Importe todos os seus componentes de Dashboard
import AlunoDashboard from './Dashboards/AlunoDashboard.jsx';
import PacienteDashboard from './Dashboards/PacienteDashboard.jsx';
import CoordenadorDashboard from './Dashboards/CoordenadorDashboard.jsx';
import RecepcionistaDashboard from './Dashboards/RecepcionistasDashboard.jsx';



// Este componente escolhe qual dashboard mostrar com base na role do usuário
const DashboardRouter = () => {
  const { user } = useAuth();
  if (!user) return null;

  const userRole = user.funcao.toLowerCase();

  switch (userRole) { // Usa a variável já convertida
    case 'aluno':
      return <AlunoDashboard />;
    case 'paciente':
      return <PacienteDashboard />;
    case 'coordenador':
      return <CoordenadorDashboard />;
    case 'recepcionista':
      return <RecepcionistaDashboard />;
    default:
      // Se o cargo não for reconhecido, mostra a mensagem de erro
      return <div>Acesso negado. Cargo de usuário não reconhecido.</div>;
  }
};


function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App">
          <Header />
          
          <main>
            <Routes>
              {/* Rotas públicas */}
              <Route path="/" element={<Inicio />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/servicos" element={<Servicos />} />
              <Route path="/projeto" element={<Projeto />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="/denuncia" element={<Denuncia />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* Rota de agendamento agora é protegida */}
              <Route
                path="/agendamento"
                element={
                  <ProtectedRoute allowedRoles={['aluno', 'paciente', 'coordenador', 'recepcionista']}>
                    <Agendamento />
                  </ProtectedRoute>
                }
              />
              
              {/* Rota protegida para os dashboards */}
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute allowedRoles={['aluno', 'paciente', 'coordenador', 'recepcionista']}>
                    <DashboardRouter />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </main>

          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;