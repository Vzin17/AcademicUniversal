import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';
import './CSS_Pgs/MinhaConta.css'; // Crie um CSS para estilizar

function MinhaConta() {
  const { user } = useAuth(); // Pega os dados do usuário do nosso contexto

  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAgendamentos = async () => {
      if (!user) return; // Garante que o usuário existe antes de buscar

      try {
        const { data, error } = await supabase
          .from('agendamentos')
          .select('*') // Pega todos os dados do agendamento
          .eq('usuario_id', user.id) // Onde o usuario_id seja o do usuário logado
          .order('data_consulta', { ascending: false }); // Ordena pelos mais recentes

        if (error) {
          throw error;
        }
        setAgendamentos(data);
      } catch (err) {
        setError(err.message);
        console.error("Erro ao buscar agendamentos:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAgendamentos();
  }, [user]); // Roda o efeito sempre que o objeto 'user' mudar

  // Separa os agendamentos em próximos e passados
  const hoje = new Date();
  const proximosAgendamentos = agendamentos.filter(ag => new Date(ag.data_consulta) >= hoje);
  const historicoAgendamentos = agendamentos.filter(ag => new Date(ag.data_consulta) < hoje);

  if (loading) {
    return <div>Carregando informações da conta...</div>;
  }
  
  if (error) {
    return <div className="error-message">Ocorreu um erro: {error}</div>;
  }

  return (
    <div className="minha-conta-container">
      <h1>Minha Conta</h1>

      <section className="dados-pessoais-section">
        <h2>Meus Dados</h2>
        <p><strong>Nome:</strong> {user?.nome_completo}</p>
        <p><strong>Email:</strong> {user?.email}</p>
        <p><strong>Função:</strong> {user?.funcao}</p>
        {user?.ra && <p><strong>RA:</strong> {user.ra}</p>}
      </section>

      <section className="agendamentos-section">
        <h2>Próximos Agendamentos</h2>
        {proximosAgendamentos.length > 0 ? (
          proximosAgendamentos.map(ag => (
            <div key={ag.id} className="agendamento-card">
              <p><strong>Área:</strong> {ag.area_especialidade}</p>
              <p><strong>Data:</strong> {new Date(ag.data_consulta).toLocaleString('pt-BR')}</p>
              {/* Você pode adicionar mais detalhes aqui */}
            </div>
          ))
        ) : (
          <p>Você não tem nenhum agendamento futuro.</p>
        )}
      </section>

      <section className="agendamentos-section">
        <h2>Histórico de Agendamentos</h2>
        {historicoAgendamentos.length > 0 ? (
          historicoAgendamentos.map(ag => (
            <div key={ag.id} className="agendamento-card historico">
              <p><strong>Área:</strong> {ag.area_especialidade}</p>
              <p><strong>Data:</strong> {new Date(ag.data_consulta).toLocaleString('pt-BR')}</p>
            </div>
          ))
        ) : (
          <p>Você ainda não completou nenhum agendamento.</p>
        )}
      </section>
    </div>
  );
}

export default MinhaConta;