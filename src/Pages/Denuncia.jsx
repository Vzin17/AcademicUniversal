/*
import './CSS_Pgs/Denuncia.css';


function Denuncia() {
  return (
    <div>
      <h1>Página de Denúncia Anônima</h1>
      <p>Preencha os campos abaixo para enviar sua denúncia.</p>
    </div>
  );
}

export default Denuncia;
*/
import React from 'react';
import './CSS_Pgs/Denuncia.css';

function Denuncia() {
  return (
    <main className="denuncia-page">
      <div className="denuncia-container">
        <h1>Página de Denúncia Anônima</h1>
        
        <p>
          Sua identidade será mantida em sigilo. Preencha os campos abaixo para 
          enviar sua denúncia.
        </p>
        
        <form className="denuncia-form">
          <div className="form-group">
            <label htmlFor="titulo">Título da Denúncia</label>
            <input 
              type="text" 
              id="titulo" 
              name="titulo" 
              placeholder="Ex: Assédio no setor X" 
              required 
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="descricao">Descrição Detalhada</label>
            <textarea 
              id="descricao" 
              name="descricao" 
              rows="8" 
              placeholder="Descreva o ocorrido com o máximo de detalhes possível..." 
              required
            ></textarea>
          </div>
          
          <button type="submit" className="denuncia-submit-btn">
            Enviar Denúncia
          </button>
        </form>
      </div>
    </main>
  );
}

export default Denuncia;