import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import './CSS_Pgs/CriarProntuario.css';

function CriarProntuario() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [pacientes, setPacientes] = useState([]);
  const [supervisores, setSupervisores] = useState([]);
  const [alunosParceiros, setAlunosParceiros] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [selectedPaciente, setSelectedPaciente] = useState('');
  const [titulo, setTitulo] = useState('');
  const [conteudo, setConteudo] = useState('');
  const [duracao, setDuracao] = useState('');
  const [selectedParceiro, setSelectedParceiro] = useState('');
  const [selectedSupervisores, setSelectedSupervisores] = useState([]);

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        const [pacientesRes, supervisoresRes, alunosRes] = await Promise.all([
          supabase.from('perfis').select('id, nome_completo').eq('funcao', 'paciente'),
          supabase.from('perfis').select('id, nome_completo').eq('funcao', 'professor').eq('especialidade_id', user.especialidade_id),
          supabase.from('perfis').select('id, nome_completo').eq('funcao', 'aluno').eq('especialidade_id', user.especialidade_id).not('id', 'eq', user.id)
        ]);
        if (pacientesRes.error) throw pacientesRes.error;
        if (supervisoresRes.error) throw supervisoresRes.error;
        if (alunosRes.error) throw alunosRes.error;
        
        setPacientes(pacientesRes.data);
        setSupervisores(supervisoresRes.data);
        setAlunosParceiros(alunosRes.data);

      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError('Não foi possível carregar os dados.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const handleSupervisorChange = (supervisorId) => {
    setSelectedSupervisores(prevSelected => {
      if (prevSelected.includes(supervisorId)) {
        return prevSelected.filter(id => id !== supervisorId);
      } else {
        return [...prevSelected, supervisorId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const prontuarioData = {
      paciente_id: selectedPaciente,
      aluno_id: user.id,
      aluno_parceiro_id: selectedParceiro || null,
      supervisor_id: selectedSupervisores,
      titulo: titulo,
      conteudo: conteudo,
      duracao_procedimento: parseInt(duracao),
    };

    const { error } = await supabase.from('prontuarios').insert([prontuarioData]);

    if (error) {
      console.error("Erro ao salvar prontuário:", error);
      alert("Ocorreu um erro ao salvar o prontuário. Verifique a consola para mais detalhes.");
    } else {
      alert("Prontuário salvo com sucesso!");
      navigate('/');
    }
  };
  
  if (loading) return <div>A carregar dados do formulário...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="prontuario-container">
      <h1>Criar Novo Prontuário</h1>
      
      <form onSubmit={handleSubmit} className="prontuario-form">
        <div>
          <label htmlFor="paciente-select">Paciente Atendido</label>
          <select id="paciente-select" value={selectedPaciente} onChange={(e) => setSelectedPaciente(e.target.value)} required>
            <option value="" disabled>Selecione o paciente...</option>
            {pacientes.map(paciente => (
              <option key={paciente.id} value={paciente.id}>{paciente.nome_completo}</option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="titulo">Título do Procedimento</label>
          <input id="titulo" type="text" value={titulo} onChange={(e) => setTitulo(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="conteudo">Descrição do Atendimento</label>
          <textarea id="conteudo" value={conteudo} onChange={(e) => setConteudo(e.target.value)} required rows="6" />
        </div>
        <div>
          <label htmlFor="duracao">Duração do Procedimento (em minutos)</label>
          <input id="duracao" type="number" value={duracao} onChange={(e) => setDuracao(e.target.value)} required />
        </div>
        <div>
          <label htmlFor="parceiro-select">Aluno(a) Parceiro(a)</label>
          <select id="parceiro-select" value={selectedParceiro} onChange={(e) => setSelectedParceiro(e.target.value)}>
            <option value="">Ninguém (atendimento individual)</option>
            {alunosParceiros.map(aluno => (
              <option key={aluno.id} value={aluno.id}>{aluno.nome_completo}</option>
            ))}
          </select>
        </div>
        
        <div>
          <label>Professor(es) Supervisor(es)</label>
          <div className="checkbox-group">
            {supervisores.map(supervisor => (
              <div key={supervisor.id} className="checkbox-item">
                <input
                  type="checkbox"
                  id={`supervisor-${supervisor.id}`}
                  value={supervisor.id}
                  checked={selectedSupervisores.includes(supervisor.id)}
                  onChange={() => handleSupervisorChange(supervisor.id)}
                />
                <label htmlFor={`supervisor-${supervisor.id}`}>{supervisor.nome_completo}</label>
              </div>
            ))}
          </div>
        </div>
        
        <button type="submit">Salvar Prontuário</button>
      </form>
    </div>
  );
}

export default CriarProntuario;