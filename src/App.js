import './App.css';

import Header from './Componentes/Header/Header';
import Footer from './Componentes/Footer/Footer';
import Inicio from './Pages/Incio/Inicio';
import Voluntario from './Pages/Incio/Voluntário/Voluntario';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Link } from 'react-router-dom';



function App() {
  return (
    <BrowserRouter>
      <div className="App">
        <Header />
        
        <main>
          <Routes>
            <Route path="/" element={<Inicio />} />     
            <Route path="/voluntario" element={<Voluntario />} />
          </Routes>
        </main>

        <Footer />
      </div>
    </BrowserRouter>
  );
}

export default App;
