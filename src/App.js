import './App.css';

import Header from './Componentes/Header/Header';
import Footer from './Componentes/Footer/Footer';
import Inicio from './Pages/Incio/Inicio';
import CriarConta from './Pages/CriarConta/criarConta';
import Cursos from './Pages/Cursos';
import SObre from './Pages/Sobre';
import { BrowserRouter, Routes, Route } from 'react-router-dom';



function App() {
  return (
    <div className="App">
      <Header />

      <Inicio />

      <Footer />
    </div>
  );
}

export default App;
