import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient'; // Garante que o caminho está correto
import { useAuth } from '../Contexts/AuthContext.jsx'; // Garante que o caminho está correto
import '../Pages/CSS_Pgs/Notificacoes.css'; // Garante que o caminho está correto

function NotificacoesProntuarios() {
  const { user } = useAuth();
  const [notificacoes, setNotificacoes] = useState([]);
  const [carregando, setCarregando] = useState(true);

  useEffect(() => {
    if (!user) return;

    const carregarNotificacoes = async () => {
      setCarregando(true);
      try {
        let query = supabase
          .from('prontuarios')
          .select(`
            *,
            paciente:perfis!prontuarios_paciente_id_fkey(nome_completo),
            aluno:perfis!prontuarios_aluno_id_fkey(nome_completo, especialidade_id)
          `)
          .order('created_at', { ascending: false })
          .limit(10);

        if (user.funcao === 'professor') {
          query = query.ilike('supervisor_nome', `%${user.nome_completo}%`);
        
        } else if (user.funcao === 'coordenador') {
          // ----- CORREÇÃO IMPORTANTE AQUI -----
          // Nós alteramos o SELECT acima para incluir 'especialidade_id' dentro do 'aluno'
          // Agora, usamos .eq() para filtrar na tabela 'aluno' (que é 'perfis')
          // A sintaxe correta é 'tabela_estrangeira!coluna_chave.coluna_desejada'
          query = query.eq('aluno.especialidade_id', user.especialidade_id);
          // ----- FIM DA CORREÇÃO -----

        } else {
          query = query.eq('aluno_id', user.id);
        }

        const { data, error } = await query;

        if (error) {
          // Adicionamos um log mais detalhado
          console.error('Erro ao carregar notificações (Query Falhou):', error.message);
          setNotificacoes([]);
        } else {
          // O Supabase v7+ retorna os dados filtrados em 'data', não precisamos filtrar de novo
          setNotificacoes(data || []);
        }
      } catch (error) {
        console.error('Erro no bloco Try/Catch ao carregar notificações:', error);
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
      <h3>Últimos Prontuários</h3>
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
              {/* Adicionamos '?' para segurança caso 'paciente' ou 'aluno' sejam nulos */}
              <p><strong>Paciente:</strong> {prontuario.paciente?.nome_completo || 'Não informado'}</p>
              <p><strong>Aluno:</strong> {prontuario.aluno?.nome_completo || 'Não informado'}</p>
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