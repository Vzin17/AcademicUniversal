import './App.css';

import Header from './Componentes/Header/Header';
import Footer from './Componentes/Footer/Footer';
import Inicio from './Pages/Incio/Inicio';

import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './Contexts/AuthContext';

import Cadastro from './Pages/Cadastro';
import Estudante from './Pages/Estudante';
import Professor from './Pages/Coordenador';
import Paciente from './Pages/Paciente';
import Agendamento from './Pages/Agendamento';
import Servicos from './Pages/Servicos';
import Projeto from './Pages/Projeto';
import Contato from './Pages/Contato';
import Denuncia from './Pages/Denuncia';
import Login from './Pages/Login'; // Importe o novo componente
import Register from './pages/Register';




function App() {
  return (

    <BrowserRouter>
      <div className="App">
        <Header />

        <main>
          <Routes>
            <Route path="/" element={<Inicio />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/estudante" element={<Estudante />} />
            <Route path="/professor" element={<Professor />} />
            <Route path="/paciente" element={<Paciente />} />
            <Route path="/agendamento" element={<Agendamento />} />
            <Route path="/servicos" element={<Servicos />} />
            <Route path="/projeto" element={<Projeto />} />
            <Route path="/contato" element={<Contato />} />
            <Route path="/denuncia" element={<Denuncia />} />
            <Route path="/login" element={Login} />
            <Route path="/register" element={<Register />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>

  );
}

export default App;
