import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import '../Pages/CSS_Pgs/PainelPaciente.css';

const PainelPaciente = () => {
  const { user } = useAuth();
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    async function fetchAgendamentos() {
      try {
        const { data, error } = await supabase
          .from('agendamentos')
          .select('id, data_consulta, area_especialidade')
          .eq('usuario_id', user.id)
          .gte('data_consulta', new Date().toISOString())
          .order('data_consulta', { ascending: true })
          .limit(5);

        if (error) throw error;
        setAgendamentos(data);
      } catch (error) {
        console.error("Erro ao buscar agendamentos:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchAgendamentos();
  }, [user]);

  const formatarDataHora = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleString('pt-BR', { day: '2-digit', month: 'long', hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="painel-paciente-container">
      <div className="painel-paciente-header">
        <h1>Olá, {user.nome_completo}!</h1>
        <p>Seja bem-vindo(a) ao seu portal de agendamentos.</p>
      </div>

      <div className="painel-paciente-acoes">
        <Link to="/agendamento" className="acao-card primary">
          <i className="fas fa-calendar-plus"></i>
          <h3>Novo Agendamento</h3>
          <p>Marque uma nova consulta gratuita.</p>
        </Link>
        <Link to="/minha-conta" className="acao-card secondary">
          <i className="fas fa-user-circle"></i>
          <h3>Minha Conta</h3>
          <p>Veja seus dados e histórico.</p>
        </Link>
      </div>

      <div className="painel-paciente-agendamentos">
        <h2>Seus Próximos Agendamentos</h2>
        {loading && <p>Carregando...</p>}
        {!loading && agendamentos.length === 0 && <p className="info-message">Você não tem agendamentos futuros.</p>}
        <div className="lista-agendamentos">
          {agendamentos.map(ag => (
            <div key={ag.id} className="agendamento-card">
              <div className="agendamento-info">
                <span className="agendamento-area">{ag.area_especialidade || 'Área não definida'}</span>
                <span className="agendamento-data"><i className="fas fa-calendar-alt"></i> {formatarDataHora(ag.data_consulta)}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PainelPaciente;