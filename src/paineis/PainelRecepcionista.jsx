import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../supabaseClient';
import { Link } from 'react-router-dom';
import '../Pages/CSS_Pgs/PainelCoordenador.css'; 

function PainelRecepcionista() {
    const { user } = useAuth();
    const [agendamentos, setAgendamentos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!user?.area?.name) return;

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
                        paciente:usuario_id (id, nome_completo)
                    `)
                    .eq('area_especialidade', user.area.name)
                    .gte('data_consulta', inicioDoDia)
                    .lte('data_consulta', fimDoDia)
                    .order('data_consulta', { ascending: true });

                if (agendamentosError) throw agendamentosError;
                setAgendamentos(data);
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
        <div className="painel-coordenador-container">
            <h2>Olá, {user.nome_completo}!</h2>
            <p>Aqui você pode gerenciar os agendamentos do dia.</p>

            <div className="acoes-rapidas-section">
                <h3>Ações Rápidas</h3>
                <div className="acoes-rapidas-container">
                    <Link to="/agendamento" className="botao-acao">Novo Agendamento</Link>
                </div>
            </div>

            <div className="prontuarios-recentes-container">
                <h3>Agendamentos de Hoje</h3>
                {loading && <p>Carregando agendamentos...</p>}
                {error && <p className="error-message">{error}</p>}
                {!loading && !error && (
                    <div className="lista-prontuarios-recentes">
                        {agendamentos.length === 0 ? (
                            <p className="info-message">Nenhum agendamento para hoje.</p>
                        ) : (
                            agendamentos.map(ag => (
                                <Link to={`/pacientes/${ag.paciente.id}`} key={ag.id} className="prontuario-recente-card">
                                    <h4>{ag.paciente.nome_completo}</h4>
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