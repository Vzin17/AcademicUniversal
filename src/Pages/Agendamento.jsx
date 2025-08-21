
import React, { useState } from 'react';

function Agendamento() {
  const [area, setArea] = useState('');
  const [data, setData] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    console.log(`Agendamento: ${area} - ${data}`);
    alert('Agendamento enviado!');
  }

  return (
    <main>
      <h2>Agendamento</h2>
      <form onSubmit={handleSubmit}>
        <select value={area} onChange={(e) => setArea(e.target.value)} required>
          <option value="">Selecione a área</option>
          <option>Direito</option>
          <option>Psicologia</option>
          <option>Fisioterapia</option>
          <option>Odontologia</option>
          <option>Farmácia</option>
        </select>
        <input type="date" value={data} onChange={(e) => setData(e.target.value)} required />
        <button type="submit">Agendar</button>
      </form>
    </main>
  );
}

export default Agendamento;
