
import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './CSS_Pgs/Denuncia.css';

function Denuncia() {
  const [titulo, setTitulo] = useState('');
  const [descricao, setDescricao] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [erro, setErro] = useState('');
  const [sucesso, setSucesso] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setEnviando(true);
    setErro('');
    setSucesso('');

    try {
      const { error } = await supabase
        .from('denuncias_anonimas')
        .insert([{ titulo, descricao }]);

      if (error) {
        throw error;
      }

      setSucesso('Denúncia enviada com sucesso! Agradecemos sua colaboração.');
      setTitulo('');
      setDescricao('');
    } catch (error) {
      console.error('Erro ao enviar denúncia:', error);
      setErro('Ocorreu um erro ao enviar sua denúncia. Por favor, tente novamente mais tarde.');
    } finally {
      setEnviando(false);
    }
  };

  return (
    <main className="denuncia-page">
      <div className="denuncia-container">
        <h1>Página de Denúncia Anônima</h1>
        <p>
          Sua identidade será mantida em sigilo. Preencha os campos abaixo para 
          enviar sua denúncia.
        </p>
        
        {erro && <p className="mensagem-erro">{erro}</p>}
        {sucesso && <p className="mensagem-sucesso">{sucesso}</p>}

        <form className="denuncia-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="titulo">Título da Denúncia</label>
            <input 
              type="text" 
              id="titulo" 
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              placeholder="Ex: Assédio no setor X" 
              required 
            />
          </div>
          <div className="form-group">
            <label htmlFor="descricao">Descrição Detalhada</label>
            <textarea 
              id="descricao" 
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              rows="8" 
              placeholder="Descreva o ocorrido com o máximo de detalhes possível..." 
              required
            ></textarea>
          </div>
          <button type="submit" className="denuncia-submit-btn" disabled={enviando}>
            {enviando ? 'Enviando...' : 'Enviar Denúncia'}
          </button>
        </form>
      </div>
    </main>
  );
}

export default Denuncia;