import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';


function AgendaArea() {
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchAgendamentos();
  }, []);
  
  async function fetchAgendamentos() {
    setLoading(true);
    const { data, error } = await supabase
      .from('agendamentos')
      .select('*, perfis(nome_completo)')
      .order('data_consulta', { ascending: true });

    if (error) {
      console.error('Erro ao buscar agendamentos:', error);
      setError('Não foi possível carregar os agendamentos.');
    } else {
      setAgendamentos(data);
    }
    setLoading(false);
  }

  const handleUpdateStatus = async (agendamentoId, novoStatus) => {
    const acao = novoStatus === 'Cancelado' ? 'cancelar' : 'reativar';
    const confirmacao = window.confirm(`Tem a certeza de que deseja ${acao} este agendamento?`);
    if (!confirmacao) return;

    const { error } = await supabase
      .from('agendamentos')
      .update({ status: novoStatus })
      .eq('id', agendamentoId);

    if (error) {
      alert(`Não foi possível ${acao} o agendamento.`);
      console.error(`Erro ao ${acao}:`, error);
    } else {
      setAgendamentos(listaAtual =>
        listaAtual.map(ag =>
          ag.id === agendamentoId ? { ...ag, status: novoStatus } : ag
        )
      );
    }
  };
  
  if (loading) return <div>A carregar agendamentos...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="agenda-area-container">
      <h3>Agendamentos da sua Área</h3>
      {agendamentos.length === 0 ? (
        <p>Nenhum agendamento encontrado.</p>
      ) : (
        <table className="agenda-table">
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
            {agendamentos.map((agendamento) => {
              const statusLimpo = (agendamento.status || 'Confirmado').replace(/'/g, '');
              return (
                <tr key={agendamento.id}>
                  <td>{new Date(agendamento.data_consulta).toLocaleDateString()}</td>
                  <td>{new Date(agendamento.data_consulta).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</td>
                  <td>{agendamento.perfis ? agendamento.perfis.nome_completo : 'Nome não encontrado'}</td>
                  <td>{statusLimpo}</td>
                  <td>
                    {statusLimpo === 'Cancelado' ? (
                      <button onClick={() => handleUpdateStatus(agendamento.id, 'Confirmado')}>
                        Reverter
                      </button>
                    ) : (
                      <button onClick={() => handleUpdateStatus(agendamento.id, 'Cancelado')}>
                        Cancelar
                      </button>
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default AgendaArea;