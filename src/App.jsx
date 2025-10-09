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
import CriarProntuario from './Pages/CriarProntuario.jsx'; // A NOVA PÁGINA

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App">
          <Header />
          <main>
            <Routes>
              {/* Rotas públicas */}
              <Route path="/" element={<HomeRouter />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/servicos" element={<Servicos />} />
              <Route path="/projeto" element={<Projeto />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="/denuncia" element={<Denuncia />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              {/* --- ROTAS PROTEGIDAS --- */}

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
                path="/criar-prontuario"
                element={
                  <ProtectedRoute>
                    <CriarProntuario />
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