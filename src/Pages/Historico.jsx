import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../Contexts/AuthContext';
import { supabase } from '../supabaseClient';
import './CSS_Pgs/Historico.css';

function Historico() {
  const { user } = useAuth();
  const [agendamentos, setAgendamentos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const carregarHistorico = async () => {
      if (!user) return;

      try {
        setLoading(true);
        
        // Data de hoje em formato ISO para comparar
        const hoje = new Date().toISOString();

        // Busca agendamentos passados (data menor que hoje OU status concluído/cancelado)
        // Nota: Ajuste 'agendamentos' se sua tabela tiver outro nome
        const { data, error } = await supabase
          .from('agendamentos') 
          .select('*')
          .eq('user_id', user.id) // Filtra pelo usuário logado
          // Ordena: os mais recentes primeiro
          .order('data_agendamento', { ascending: false });

        if (error) throw error;

        // Filtro opcional no front-end se quiser garantir apenas passados
        // const passados = data.filter(item => new Date(item.data_agendamento) < new Date());
        
        setAgendamentos(data || []);
      } catch (error) {
        console.error("Erro ao buscar histórico:", error);
      } finally {
        setLoading(false);
      }
    };

    carregarHistorico();
  }, [user]);

  // Função para formatar a data bonita (Ex: 26/11/2025)
  const formatarData = (dataString) => {
    if (!dataString) return '--/--/----';
    const data = new Date(dataString);
    return data.toLocaleDateString('pt-BR');
  };

  // Função para definir a classe CSS baseada no status
  const getStatusClass = (status) => {
    if (!status) return 'pendente';
    const s = status.toLowerCase();
    if (s.includes('conclu') || s.includes('realiz')) return 'concluido';
    if (s.includes('cancel')) return 'cancelado';
    return 'pendente';
  };

  return (
    <div className="historico-wrapper">
      <div className="historico-container">
        
        {/* Cabeçalho */}
        <div className="historico-header">
          <h1 className="historico-title">Histórico de Serviços</h1>
          <Link to="/minha-conta" className="btn-voltar">
            ← Voltar
          </Link>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="loading">Carregando seu histórico...</div>
        ) : (
          <div className="historico-lista">
            
            {/* Lista Vazia */}
            {agendamentos.length === 0 && (
              <div className="sem-historico">
                <h3>Nenhum agendamento encontrado.</h3>
                <p>Seus agendamentos futuros e passados aparecerão aqui.</p>
              </div>
            )}

            {/* Mapeamento dos Itens */}
            {agendamentos.map((item) => {
              const statusClass = getStatusClass(item.status);
              
              return (
                <div key={item.id} className={`historico-card ${statusClass}`}>
                  <div className="card-info">
                    <h3>{item.servico || 'Consulta Geral'}</h3>
                    
                    <div className="data-hora">
                      <span>📅 {formatarData(item.data_agendamento)}</span>
                      <span>⏰ {item.horario || 'Horário não def.'}</span>
                    </div>

                    {item.profissional_nome && (
                      <div className="profissional">
                        Com: Dr(a). {item.profissional_nome}
                      </div>
                    )}
                  </div>

                  <div className={`status-badge ${statusClass}`}>
                    {item.status || 'Agendado'}
                  </div>
                </div>
              );
            })}

          </div>
        )}
      </div>
    </div>
  );
}

export default Historico;