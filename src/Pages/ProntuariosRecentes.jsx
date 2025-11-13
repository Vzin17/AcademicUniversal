import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import './CSS_Pgs/ProntuariosRecentes.css';

const ProntuariosRecentes = () => {
  const { user } = useAuth();
  const [prontuarios, setProntuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) return;

    const fetchProntuarios = async () => {
      setLoading(true);
      const umaSemanaAtras = new Date();
      umaSemanaAtras.setDate(umaSemanaAtras.getDate() - 7);

      let query = supabase
        .from('prontuarios')
        .select(`
          id,
          titulo,
          supervisor_nome,
          created_at,
          paciente_id,
          paciente:paciente_id(nome_completo),
          aluno:aluno_id(nome_completo, especialidade_id)
        `)
        .gte('created_at', umaSemanaAtras.toISOString())
        .order('created_at', { ascending: false });

      // Filtros reativados com a coluna correta 'especialidade_id'
      if (user.funcao === 'coordenador' && user.especialidade_id) {
        query = query.eq('aluno.especialidade_id', user.especialidade_id);
      }
      else if (user.funcao === 'professor') {
        query = query.ilike('supervisor_nome', `%${user.nome_completo}%`);
      }

      const { data, error: prontuariosError } = await query;

      if (prontuariosError) {
        console.error('Erro ao buscar prontuários recentes:', prontuariosError);
        setError('Não foi possível carregar os prontuários.');
      } else {
        setProntuarios(data || []);
      }
      setLoading(false);
    };

    fetchProntuarios();
  }, [user]);

  const formatarData = (dataISO) => new Date(dataISO).toLocaleDateString('pt-BR');

  return (
    <div className="prontuarios-page-container">
      <h1>Prontuários da Última Semana</h1>
      {loading && <p>Carregando...</p>}
      {error && <p className="error-message">{error}</p>}
      {!loading && !error && (
        <div className="prontuarios-lista-detalhada">
          {prontuarios.length === 0 ? (
            <p className="info-message">Nenhum prontuário recente encontrado.</p>
          ) : (
            prontuarios.map(prontuario => (
              <div key={prontuario.id} className="prontuario-card-detalhado">
                <h3>{prontuario.titulo}</h3>
                <p><strong>Paciente:</strong> {prontuario.paciente?.nome_completo || 'Não identificado'}</p>
                <p><strong>Aluno:</strong> {prontuario.aluno?.nome_completo || 'Não identificado'}</p>
              <p><strong>Data:</strong> {formatarData(prontuario.created_at)}</p>
                <div className="prontuario-card-actions">
                  <Link to={`/pacientes/${prontuario.paciente_id}`} className="btn-action ver">Ver Ficha</Link>
                  <Link to={`/pacientes/${prontuario.paciente_id}?editarProntuario=${prontuario.id}`} className="btn-action editar">
                    Editar Prontuário
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default ProntuariosRecentes;