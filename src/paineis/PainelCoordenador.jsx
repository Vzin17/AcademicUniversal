import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './PainelCoordenador.css';

function PainelCoordenador() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAgendamentos() {
      setLoading(true);
      const { data, error } = await supabase
        .from('agendamentos')
        .select('*, perfis(nome_completo)') // <-- ALTERAÇÃO 1
        .order('data_consulta', { ascending: true });

      if (error) {
        console.error('Erro ao buscar agendamentos:', error);
      } else {
        setAgendamentos(data);
      }
      setLoading(false);
    }

    fetchAgendamentos();
  }, []);

  if (loading) {
    return <div>A carregar agendamentos...</div>;
  }

  return (
    <div className="painel-coordenador-container">
      <h2>Painel do Coordenador</h2>
      <h3>Agendamentos da sua Área</h3>

      {agendamentos.length === 0 ? (
        <p>Nenhum agendamento encontrado para a sua área.</p>
      ) : (
        <table className="agendamentos-table">
          <thead>
            <tr>
              <th>Data</th>
              <th>Hora</th>
              <th>Paciente</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {agendamentos.map((agendamento) => (
              <tr key={agendamento.id}>
                <td>{new Date(agendamento.data_consulta).toLocaleDateString()}</td>
                <td>{new Date(agendamento.data_consulta).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                {/* ALTERAÇÃO 2 ↓ */}
                <td>{agendamento.perfis ? agendamento.perfis.nome_completo : 'Nome não encontrado'}</td>
                <td>{agendamento.status || 'Confirmado'}</td>
                <td>
                  {/* Espaço para o nosso futuro botão de Cancelar */}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default PainelCoordenador;