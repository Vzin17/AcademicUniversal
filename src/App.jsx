import React from 'react';
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext'; // Importe seu provedor de contexto
import ProtectedRoute from './Componentes/ProtectedRoute'; // Importe seu componente de rota protegida

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

// Componentes de áreas protegidas
import Estudante from './Pages/Estudante';
import Paciente from './Pages/Paciente';
import Coordenador from './Pages/Coordenador.jsx';



function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <div className="App">
          <Header />

          <main>
            <Routes>
              <Route path="/" element={<Inicio />} />
              <Route path="/cadastro" element={<Cadastro />} />
              <Route path="/servicos" element={<Servicos />} />
              <Route path="/projeto" element={<Projeto />} />
              <Route path="/contato" element={<Contato />} />
              <Route path="/denuncia" element={<Denuncia />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/agendamento" element={<Agendamento />} />
              

        
              <Route element={<ProtectedRoute allowedRoles={['estudante']} />}>
                <Route path="/estudante" element={<Estudante />} />
              </Route>



              
            
              <Route element={<ProtectedRoute allowedRoles={['paciente']} />}>
                <Route path="/paciente" element={<Paciente />} />
              </Route>

             
              <Route element={<ProtectedRoute allowedRoles={['coordenador']} />}>
                <Route path="/coordenador" element={<Coordenador />} />
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