import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import '../Pages/CSS_Pgs/Notificacoes.css';

function NotificacoesProntuarios() {
  const { user } = useAuth();
  const [notificacoes, setNotificacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!user) return;

    const carregarNotificacoes = async () => {
      try {
        // Busca prontuários recentes baseado no tipo de usuário
        let query = supabase
          .from('prontuarios')
          .select(`
            *,
            paciente:perfis!prontuarios_paciente_id_fkey(nome_completo),
            aluno:perfis!prontuarios_aluno_id_fkey(nome_completo)
          `)
          .order('created_at', { ascending: false })
          .limit(10);

        // Filtra baseado no tipo de usuário
        if (user.funcao === 'professor') {
          // Professores veem prontuários onde são supervisores (por nome)
          query = query.ilike('supervisor_nome', `%${user.nome_completo}%`);
        } else if (user.funcao === 'coordenador') {
          // Coordenadores veem todos os prontuários da especialidade
          query = query.eq('especialidade_id', user.especialidade_id);
        } else {
          // Alunos veem seus próprios prontuários
          query = query.eq('aluno_id', user.id);
        }

        const { data, error } = await query;

        if (error) {
          console.error('Erro ao carregar notificações:', error);
          setNotificacoes([]);
        } else {
          setNotificacoes(data || []);
        }
      } catch (error) {
        console.error('Erro ao carregar notificações:', error);
        setNotificacoes([]);
      } finally {
        setCarregando(false);
      }
    };

    carregarNotificacoes();
  }, [user]);

  const formatarDataHora = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (carregando) {
    return <div className="notificacoes-carregando">Carregando notificações...</div>;
  }

  if (notificacoes.length === 0) {
    return <div className="sem-notificacoes">Nenhuma notificação encontrada.</div>;
  }

  return (
    <div className="notificacoes-container">
      <h3>Prontuários Recentes</h3>
      <div className="notificacoes-lista">
        {notificacoes.map((prontuario) => (
          <div key={prontuario.id} className="notificacao-item">
            <div className="notificacao-header">
              <h4>{prontuario.titulo}</h4>
              <span className="notificacao-data">
                {formatarDataHora(prontuario.created_at)}
              </span>
            </div>
            
            <div className="notificacao-info">
              <p><strong>Paciente:</strong> {prontuario.paciente?.nome_completo}</p>
              <p><strong>Aluno:</strong> {prontuario.aluno?.nome_completo}</p>
              {prontuario.aluno_parceiro_nome && (
                <p><strong>Parceiro:</strong> {prontuario.aluno_parceiro_nome}</p>
              )}
              {prontuario.supervisor_nome && (
                <p><strong>Supervisor:</strong> {prontuario.supervisor_nome}</p>
              )}
            </div>
            
            <div className="notificacao-conteudo">
              <p>{prontuario.conteudo}</p>
            </div>
            
            <div className="notificacao-acoes">
              <button 
                onClick={() => window.open(`/pacientes/${prontuario.paciente_id}`, '_blank')}
                className="btn-ver-ficha"
              >
                Ver Ficha Completa
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificacoesProntuarios;
