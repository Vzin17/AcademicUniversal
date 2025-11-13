import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import '../Pages/CSS_Pgs/PainelRecepcionista.css'; // O import está correto

function PainelRecepcionista() {
    const { user } = useAuth();
    const [agendamentos, setAgendamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 1. CORREÇÃO: Voltámos a verificar user.area.name
        // Aparentemente o teu AuthContext já faz a "junção" e traz o nome da área.
        // Se o user (recepcionista) não tiver uma área, não podemos filtrar.
        if (!user?.area?.name) { 
            setLoading(false);
            // Se a recepcionista não tiver área, podemos mostrar uma mensagem
            // setError("Sua conta não está associada a uma especialidade.");
            return;
        }

        async function fetchAgendamentos() {
            setLoading(true);
            const hoje = new Date();
            const inicioDoDia = new Date(hoje.setHours(0, 0, 0, 0)).toISOString();
            const fimDoDia = new Date(hoje.setHours(23, 59, 59, 999)).toISOString();

            try {
                const { data, error: agendamentosError } = await supabase
                    .from('agendamentos')
                    .select(`
                        id,
                        data_consulta,
                            
                            // 2. CORREÇÃO: Voltámos a usar 'usuario_id'
                        paciente:usuario_id (id, nome_completo) 
                    `)
                        // 3. CORREÇÃO: Voltámos a filtrar por 'area_especialidade' (string)
                    .eq('area_especialidade', user.area.name) 
                    .gte('data_consulta', inicioDoDia)
                    .lte('data_consulta', fimDoDia)
                    .order('data_consulta', { ascending: true });

                if (agendamentosError) throw agendamentosError;
                setAgendamentos(data || []); 
            } catch (err) {
                console.error("Erro ao buscar agendamentos:", err);
                setError("Não foi possível carregar os agendamentos.");
            } finally {
                setLoading(false);
            }
        }

        fetchAgendamentos();
    }, [user]); 

    const formatarHora = (dataISO) => new Date(dataISO).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

    return (
        <div className="painel-recepcionista-container">
            <h2>Olá, {user?.nome_completo || 'Recepcionista'}!</h2>
            <p className="subtitulo">Aqui você pode gerenciar os agendamentos do dia.</p>

            <div className="acoes-rapidas-section">
                <h3>Ações Rápidas</h3>
                <div className="acoes-rapidas-container">
                    <Link to="/agendamento" className="botao-acao-recepcionista">Novo Agendamento</Link>
                </div>
            </div>

            <div className="agendamentos-container">
                <h3>Agendamentos de Hoje</h3>
                {loading && <p>Carregando agendamentos...</p>}
                {error && <p className="error-message">{error}</p>}
                {!loading && !error && (
                    <div className="lista-agendamentos">
                        {agendamentos.length === 0 ? (
                            <p className="info-message">Nenhum agendamento para hoje.</p>
                        ) : (
                            agendamentos.map(ag => (
                                <Link to={`/pacientes/${ag.paciente.id}`} key={ag.id} className="agendamento-card-link">
                                    <h4>{ag.paciente?.nome_completo || 'Paciente não encontrado'}</h4>
                                    <span><strong>Horário:</strong> {formatarHora(ag.data_consulta)}</span>
                                </Link>
                            ))
                        )}
                    </div>
                )}
            </div>
        </div>
    );
}

export default PainelRecepcionista;