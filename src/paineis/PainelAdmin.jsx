import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../Pages/CSS_Pgs/PainelAdmin.css';

const PainelAdmin = () => {
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [paginaAtual, setPaginaAtual] = useState(1);
  const [pacientesPorPagina] = useState(10);
  const [totalPacientes, setTotalPacientes] = useState(0);

  useEffect(() => {
    const fetchPacientes = async () => {
      setLoading(true);
      const inicio = (paginaAtual - 1) * pacientesPorPagina;
      const fim = inicio + pacientesPorPagina - 1;

      const { data, error, count } = await supabase
        .from('perfis')
        .select('id, nome_completo, email', { count: 'exact' })
        .eq('funcao', 'paciente')
        .order('nome_completo', { ascending: true })
        .range(inicio, fim);

      if (error) {
        console.error('Erro ao buscar pacientes:', error);
        setError('Não foi possível carregar a lista de pacientes.');
      } else {
        setPacientes(data);
        setTotalPacientes(count);
      }
      setLoading(false);
    };

    fetchPacientes();
  }, [paginaAtual, pacientesPorPagina]);

  if (loading) {
    return <div className="admin-panel-container"><p>Carregando pacientes...</p></div>;
  }

  if (error) {
    return <div className="admin-panel-container"><p className="error-message">{error}</p></div>;
  }

  return (
    <div className="admin-panel-container">
      <h1>Painel Administrativo - Pacientes</h1>
      <p>Lista de todos os pacientes cadastrados no sistema.</p>

      <div className="pacientes-list">
        {pacientes.length > 0 ? (
          pacientes.map(paciente => (
            <div key={paciente.id} className="paciente-card">
              <div className="paciente-info">
                <strong>{paciente.nome_completo}</strong>
                <span>{paciente.email}</span>
              </div>
              <Link to={`/pacientes/${paciente.id}`} className="btn-ver-prontuario">
                Ver Prontuário
              </Link>
            </div>
          ))
        ) : (
          <p>Nenhum paciente encontrado.</p>
        )}
      </div>
    </div>
  );
};

export default PainelAdmin;