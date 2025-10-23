import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './ProtectedRoute';

// Importe todos os seus componentes de página
import HomeRouter from './Componentes/HomeRouter.jsx';
import DashboardRouter from './Componentes/DashboardRouter.jsx';
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
import MinhaConta from './Pages/MinhaConta';

// --- NOSSAS MUDANÇAS AQUI ---
// 1. Importamos as novas páginas
import Pacientes from './Pages/Pacientes.jsx'; 
import FichaPaciente from './Pages/FichaPaciente.jsx';
// 2. Mantemos o CriarProntuario, pois ele será usado *dentro* da Ficha
import CriarProntuario from './Pages/CriarProntuario.jsx'; 

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App">
          <Header />
          <main>
            <Routes>
              
              <Route path="/" element={<HomeRouter />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/servicos" element={<Servicos />} />
              <Route path="/projeto" element={<Projeto />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="/denuncia" element={<Denuncia />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
            
              <Route
                path="/agendamento"
                element={
                  <ProtectedRoute>
                    <Agendamento />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardRouter />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/minha-conta"
                element={
                  <ProtectedRoute>
                    <MinhaConta />
                  </ProtectedRoute>
                }
              />

        
              <Route
                path="/pacientes" 
                element={
                  <ProtectedRoute>
                    <Pacientes />
                  </ProtectedRoute>
                }
              />

           
              <Route
                path="/pacientes/:id" 
                element={
                  <ProtectedRoute>
                    <FichaPaciente />
                  </ProtectedRoute>
                }
              />

              
              <Route
                path="/pacientes/:id/criar-prontuario"
                element={
                  <ProtectedRoute>
                    
                    <CriarProntuario />
                  </ProtectedRoute>
                }
              />
              
              {/* Esta rota antiga não é mais necessária no Header */}
              {/*
              <Route
                path="/criar-prontuario"
                element={
                  <ProtectedRoute>
                    <CriarProntuario />
                  </ProtectedRoute>
                }
              />
              */}

            </Routes>
          </main>
          <Footer />
        </div>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;