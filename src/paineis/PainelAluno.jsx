import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import '../Pages/CSS_Pgs/PainelAluno.css'; 

import { FaCalendarPlus, FaUserMd } from 'react-icons/fa';

function PainelAluno() {
  const { user } = useAuth();
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeusAgendamentos = async () => {
      if (!user) return;

      try {
        const { data, error } = await supabase
          .from('agendamentos')
          .select('*') 
          .eq('usuario_id', user.id)
          .order('data_consulta', { ascending: true })
          .limit(5); 

        if (error) throw error;
        
        setAgendamentos(data);
      } catch (error) {
        console.error("Erro ao buscar agendamentos do aluno:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMeusAgendamentos();
  }, [user]);

  if (loading) {
    return <div>Carregando seu painel...</div>;
  }

  return (
    <div className="painel-aluno-container">
      
      <header className="painel-aluno-header">
        <h1>Painel do Aluno</h1>
        <p>Olá, {user?.nome_completo || 'aluno fisio'}! Bem-vindo(a) de volta.</p>
      </header>

      <section className="painel-aluno-acoes">
        
        {/* ======================= CORREÇÃO 1 AQUI ======================= */}
        {/* Antes era "/novo-agendamento", agora é "/agendamento" para bater com o App.js */}
        <Link to="/agendamento" className="acao-card-aluno primary">
          <FaCalendarPlus size={28} />
          <h3>Agendar Nova Consulta</h3>
          <p>Veja os horários e profissionais disponíveis.</p>
        </Link>
        
        {/* ======================= CORREÇÃO 2 AQUI ======================= */}
        {/* Antes era "/meus-pacientes", agora é "/pacientes" para bater com o App.js */}
        <Link to="/pacientes" className="acao-card-aluno secondary">
          <FaUserMd size={28} />
          <h3>Meus Pacientes</h3>
          <p>Ver histórico e detalhes dos seus pacientes.</p>
        </Link>
      </section>

      <section className="painel-aluno-agendamentos">
        <h2>Próximos Agendamentos</h2>
        
        {agendamentos.length > 0 ? (
          <div className="lista-agendamentos-aluno">
            {agendamentos.map(ag => (

              <div key={ag.id} className="agendamento-card-aluno">
                
                <div className="agendamento-info-aluno">
                 
                  {ag.nome_paciente && (
                    <span className="agendamento-paciente">
                      {ag.nome_paciente}
                    </span>
                  )}
                  <span className="agendamento-area-aluno">
                    {ag.area_especialidade}
                  </span>
                </div>

                <span className="agendamento-data-aluno">
                  {new Date(ag.data_consulta).toLocaleString('pt-BR', {
                    dateStyle: 'short',
                    timeStyle: 'short'
                  })}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p>Você ainda não possui agendamentos.</p>
        )}
      </section>

    </div>
  );
}

export default PainelAluno;