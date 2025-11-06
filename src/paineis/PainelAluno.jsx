import React, { useState, useEffect } from 'react';
import { useAuth } from '../Contexts/AuthContext';
import { supabase } from '../supabaseClient';

function PainelAluno() {
  const { user } = useAuth(); // Pega os dados do aluno logado
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeusAgendamentos = async () => {
      if (!user) return;

      try {
        // Busca na tabela 'agendamentos' apenas os que pertencem a este aluno
        const { data, error } = await supabase
          .from('agendamentos')
          .select('*')
          .eq('usuario_id', user.id) // A condição chave: id do usuário tem que bater
          .order('data_consulta', { ascending: true });

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
    <div className="painel-container">
      <h1>Painel do Aluno</h1>
      <h2>Olá, {user?.nome_completo}!</h2>
      <p>Aqui você pode ver seus agendamentos.</p>

      <div className="lista-agendamentos">
        <h3>Minhas Consultas Agendadas</h3>
        {agendamentos.length > 0 ? (
          <ul>
            {agendamentos.map(ag => (
              <li key={ag.id}>
                <strong>{ag.area_especialidade}</strong> - {new Date(ag.data_consulta).toLocaleString('pt-BR')}
              </li>
            ))}
          </ul>
        ) : (
          <p>Você ainda não possui agendamentos.</p>
        )}
      </div>
    </div>
  );
}

export default PainelAluno;