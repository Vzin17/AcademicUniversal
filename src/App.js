import './App.css';
import MeuComponente from './Componentes/MeuComponente';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Pages/home';
import Contato from './Pages/contato';


function App() {
  return (
   <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} /> 
        <Route path="/contato" element={<Contato />} />
        <Route path="/MeuComponete" element={<MeuComponente />} />
      </Routes>
    </BrowserRouter>
    
    
  );
}

export default App;
