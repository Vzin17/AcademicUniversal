import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css'; // Importa o CSS global
import { AuthProvider } from './Contexts/AuthContext';
import ProtectedRoute from './ProtectedRoute';

// --- Componentes de Página ---
import HomeRouter from './Componentes/HomeRouter.jsx';
import Header from './Componentes/Header/Header.jsx';
import Footer from './Componentes/Footer/Footer.jsx';
import Cadastro from './Pages/Cadastro';
import Agendamento from './Pages/Agendamento';
import Servicos from './Pages/Servicos';
import Projeto from './Pages/Projeto';
import Contato from './Pages/Contato';
import Denuncia from './Pages/Denuncia';
import Login from './Pages/Login';
import Register from './Pages/Register';
import MinhaConta from './Pages/MinhaConta';
import Historico from './Pages/Historico'; // <--- NOVO IMPORT AQUI
import Pacientes from './Pages/Pacientes.jsx'; 
import FichaPaciente from './Pages/FichaPaciente.jsx';
import ProntuariosRecentes from './Pages/ProntuariosRecentes.jsx';
import CriarProntuario from './Pages/CriarProntuario.jsx'; 
import PainelAdmin from './paineis/PainelAdmin.jsx';
import PainelRecepcionista from './paineis/PainelRecepcionista.jsx';

// --- DEFINIÇÃO DOS NÍVEIS DE ACESSO (ROLES) ---
// (Valores exatos em minúsculo, como no banco de dados)

const ROLES = {
  Coordenador: 'coordenador',
  Professor: 'professor',
  Aluno: 'aluno', // O aluno das 3 áreas clínicas
  Recepcionista: 'recepcionista', 
  Psicologa: 'psicologa', 
  Paciente: 'paciente_comunidade',
};

const EQUIPE_GESTAO_CLINICA = [
  ROLES.Coordenador,
  ROLES.Professor,
  ROLES.Aluno,
  ROLES.Recepcionista
];

// Quem pode CRIAR/EDITAR prontuários
const EQUIPE_CLINICA_AUTORIZADA = [
  ROLES.Coordenador,
  ROLES.Professor,
  ROLES.Aluno
];

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <div className="App">
          <Header />
          <main>
            <Routes>
              {/* --- 1. Rotas Públicas (Ninguém logado) --- */}
              <Route path="/" element={<HomeRouter />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/servicos" element={<Servicos />} />
              <Route path="/projeto" element={<Projeto />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="/denuncia" element={<Denuncia />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />

              {/* --- 2. Rotas Protegidas (Precisa estar logado) --- */}
              
              <Route
                path="/agendamento"
                element={
                  <ProtectedRoute> 
                    <Agendamento />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/minha-conta/*"
                element={
                  <ProtectedRoute> 
                    <MinhaConta />
                  </ProtectedRoute>
                }
              />

              {/* --- NOVA ROTA DE HISTÓRICO --- */}
              <Route
                path="/historico"
                element={
                  <ProtectedRoute> 
                    <Historico />
                  </ProtectedRoute>
                }
              />

              {/* --- 3. Rotas de Gestão Clínica (Equipe) --- */}

              <Route
                path="/pacientes" 
                element={
                  <ProtectedRoute allowedRoles={EQUIPE_GESTAO_CLINICA}>
                    <Pacientes />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/pacientes/:id" 
                element={
                  <ProtectedRoute allowedRoles={EQUIPE_GESTAO_CLINICA}>
                    <FichaPaciente />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/pacientes/:id/criar-prontuario"
                element={
                  <ProtectedRoute allowedRoles={EQUIPE_CLINICA_AUTORIZADA}> 
                    <CriarProntuario />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/prontuarios/recentes"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.Coordenador, ROLES.Professor]}>
                    <ProntuariosRecentes />
                  </ProtectedRoute>
                }
              />
              
              <Route
                path="/admin"
                element={
                  <ProtectedRoute allowedRoles={[ROLES.Coordenador]}>
                    <PainelAdmin />
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