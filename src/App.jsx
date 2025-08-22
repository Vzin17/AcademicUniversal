import React from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; // Importe seu provedor de contexto
import ProtectedRoute from './Componentes/ProtectedRoute'; // Importe seu componente de rota protegida

// Importe todos os seus componentes de página
import Header from './Componentes/Header';
import Footer from './Componentes/Footer';
import Inicio from './Pages/Inicio';
import Cadastro from './Pages/Cadastro';
import Agendamento from './Pages/Agendamento';
import Servicos from './Pages/Servicos';
import Projeto from './Pages/Projeto';
import Contato from './Pages/Contato';
import Denuncia from './Pages/Denuncia';
import Login from './Pages/Login';
import Register from './Pages/Register';

// Componentes de áreas protegidas
import Estudante from './Pages/Estudante';
import Professor from './Pages/Professor';
import Paciente from './Pages/Paciente';
import PaginaNaoAutorizado from './Pages/PaginaNaoAutorizado';


function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Header />

          <main>
            <Routes>
              {/* === ROTAS PÚBLICAS === */}
              {/* Qualquer pessoa pode acessar estas rotas */}
              <Route path="/" element={<Inicio />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/servicos" element={<Servicos />} />
              <Route path="/projeto" element={<Projeto />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="/denuncia" element={<Denuncia />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/agendamento" element={<Agendamento />} />
              <Route path="/unauthorized" element={<PaginaNaoAutorizado />} />

              {/* === ROTAS PROTEGIDAS === */}
              {/* O usuário precisa estar logado e ter a 'role' correta para acessar */}

              {/* Rota para o perfil de Estudante */}
              <Route element={<ProtectedRoute allowedRoles={['estudante']} />}>
                <Route path="/estudante" element={<Estudante />} />
                {/* Você pode adicionar mais rotas para o estudante aqui, ex: */}
                {/* <Route path="/estudante/materiais" element={<MateriaisEstudante />} /> */}
              </Route>

              {/* Rota para o perfil de Professor */}
              <Route element={<ProtectedRoute allowedRoles={['professor']} />}>
                <Route path="/professor" element={<Professor />} />
              </Route>
              
              {/* Rota para o perfil de Paciente */}
              <Route element={<ProtectedRoute allowedRoles={['paciente']} />}>
                <Route path="/paciente" element={<Paciente />} />
              </Route>

              {/* Rota que só o Coordenador pode acessar */}
              <Route element={<ProtectedRoute allowedRoles={['coordenador']} />}>
                <Route path="/coordenador" element={<PaginaCoordenador />} />
              </Route>

            </Routes>
          </main>

          <Footer />
        </div>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;