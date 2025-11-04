import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, useParams } from 'react-router-dom';
import './CSS_Pgs/CriarProntuario.css';

function CriarProntuario() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id: pacienteIdFromUrl } = useParams(); // Pega o ID do paciente da URL
  const [pacientes, setPacientes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [salvando, setSalvando] = useState(false); // Estado para o botão de salvar

  const [pacienteId, setPacienteId] = useState(pacienteIdFromUrl || ''); // Pré-seleciona o paciente
  const [titulo, setTitulo] = useState(''); // Máximo de 100 caracteres
  const [conteudo, setConteudo] = useState('');
  const [duracao, setDuracao] = useState('');
  const [alunoParceiroNome, setAlunoParceiroNome] = useState(''); // Novo estado para texto
  const [supervisorNome, setSupervisorNome] = useState(''); // Novo estado para texto

  useEffect(() => {
    async function fetchData() {
      if (!user) return;
      try {
        // Busca apenas os pacientes agora
        const { data: pacientesData, error: pacientesError } = await supabase
          .from('perfis')
          .select('id, nome_completo')
          .eq('funcao', 'paciente');
        
        if (pacientesError) throw pacientesError;
        setPacientes(pacientesData);

      } catch (error) {
        console.error('Erro ao buscar dados:', error);
        setError('Não foi possível carregar os dados.');
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [user]);

  const resetForm = () => {
    setPacienteId(pacienteIdFromUrl || '');
    setTitulo('');
    setConteudo('');
    setDuracao('');
    setAlunoParceiroNome('');
    setSupervisorNome('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      alert("Erro: Usuário não autenticado. Por favor, faça login novamente.");
      return;
    }

    setSalvando(true);

    const prontuarioData = {
      paciente_id: pacienteId,
      aluno_id: user.id,
      aluno_parceiro_nome: alunoParceiroNome || null,
      supervisor_nome: supervisorNome || null,
      titulo: titulo,
      conteudo: conteudo,
      duracao_procedimento: parseInt(duracao) || 0, // O valor já está em minutos
    };

    // Adicionado .select() para evitar o erro 403 de permissão de leitura
    const { error } = await supabase.from('prontuarios').insert([prontuarioData]);

    if (error) {
      console.error("Erro ao salvar prontuário:", error);
      alert("Ocorreu um erro ao salvar o prontuário. Verifique a consola para mais detalhes.");
    } else {
      alert("Prontuário salvo com sucesso!");
      resetForm(); // Limpa o formulário
      navigate('/pacientes'); // Navega para a lista de pacientes
    }
    setSalvando(false);
  };
  
  if (loading) return <div>A carregar dados do formulário...</div>;
  if (error) return <div>Erro: {error}</div>;

  return (
    <div className="prontuario-container">
      <h1>Criar Novo Prontuário</h1>
      
      {/* Corrigido para usar o layout de grade */}
      <form onSubmit={handleSubmit} className="prontuario-form form-grid">
        <div className="form-group">
            <label htmlFor="paciente-select">Paciente Atendido</label>
            <select id="paciente-select" value={pacienteId} onChange={(e) => setPacienteId(e.target.value)} required>
              <option value="" disabled>Selecione o paciente...</option>
              {pacientes.map((paciente) => (
                <option key={paciente.id} value={paciente.id}>{paciente.nome_completo}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="titulo">Título do Procedimento</label>
            <input 
              id="titulo" 
              type="text" 
              value={titulo} 
              onChange={(e) => setTitulo(e.target.value)} 
              maxLength="100"
              required 
            />
          </div>
          <div className="form-group full-width">
            <label htmlFor="conteudo">Descrição do Atendimento</label>
            <textarea 
              id="conteudo" 
              value={conteudo} 
              onChange={(e) => setConteudo(e.target.value)} 
              maxLength="1000"
              required 
              rows="6" 
            />
          </div>
          <div className="form-group">
            <label htmlFor="duracao">Duração do Procedimento (em minutos)</label>
            <input 
              id="duracao" type="number" value={duracao} 
              onChange={(e) => setDuracao(e.target.value)} 
              required min="0" max="240" step="1"
              placeholder="Ex: 30"
            />
          </div>
          <div className="form-group">
            <label htmlFor="parceiro-select">Aluno(a) Parceiro(a)</label>
            <input
              id="parceiro-input"
              type="text"
              value={alunoParceiroNome}
              onChange={(e) => setAlunoParceiroNome(e.target.value)}
              placeholder="Nome do aluno parceiro (opcional)"
            />
          </div>
          <div className="form-group full-width">
            <label>Professor(es) Supervisor(es)</label>
            <input
              id="supervisor-input"
              type="text"
              value={supervisorNome}
              onChange={(e) => setSupervisorNome(e.target.value)}
              placeholder="Nome(s) do(s) supervisor(es)"
            />
          </div>
        
        <button type="submit" disabled={salvando} className="full-width">
          {salvando ? 'Salvando...' : 'Salvar Prontuário'}
        </button>
      </form>
    </div>
  );
}

export default CriarProntuario;