import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import './CSS_Pgs/MeusAgendamentos.css';

function MeusAgendamentos() {
  const { user } = useAuth();
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAgendamentos = async () => {
      if (!user) return;

      const { data, error } = await supabase
        .from('agendamentos')
        
        .select('id, data_consulta, area_especialidade')
        .eq('paciente_id', user.id)
        .gte('data_consulta', new Date().toISOString()) 
        .order('data_consulta', { ascending: true })
        .limit(5);

      if (error) {
        console.error('Erro ao buscar agendamentos (MeusAgendamentos):', error);
      } else {
        setAgendamentos(data);
      }
      setLoading(false);
    };

    fetchAgendamentos();
  }, [user]);

  if (loading) {
    return <p>Carregando agendamentos...</p>;
  }

  return (
    <div className="meus-agendamentos-lista">
      {agendamentos.length > 0 ? (
        agendamentos.map(ag => (
          <div key={ag.id} className="agendamento-item-card">
            <span className="agendamento-data">{new Date(ag.data_consulta).toLocaleDateString('pt-BR')}</span>
            <span className="agendamento-hora">{new Date(ag.data_consulta).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
            <span className="agendamento-area">{ag.area_especialidade || 'Área não definida'}</span>
          </div>
        ))
      ) : (
        <p className="sem-agendamentos">Nenhum agendamento futuro encontrado.</p>
      )}
    </div>
  );
}

export default MeusAgendamentos;