import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../Contexts/AuthContext.jsx';
import './CSS_Pgs/Paciente.css';

function FichaPaciente() {
  const { id } = useParams();
  const { user } = useAuth();
  const [paciente, setPaciente] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [prontuarios, setProntuarios] = useState([]);
  const [editandoProntuario, setEditandoProntuario] = useState(null);
  const [prontuarioEditado, setProntuarioEditado] = useState({
    titulo: '',
    conteudo: '',
    duracao_procedimento: '',
    aluno_parceiro_nome: '',
    supervisor_nome: '',
  });
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      setCarregando(true);
      
      try {
        // Busca dados reais do paciente
        const { data: pacienteData, error: pacienteError } = await supabase
          .from('perfis')
          .select('*')
          .eq('id', id)
          .eq('funcao', 'paciente')
          .single();
        
        if (pacienteError) throw pacienteError;
        setPaciente(pacienteData);

        // Busca prontuários do paciente
        const { data: prontuariosData, error: prontuariosError } = await supabase
          .from('prontuarios')
          .select(`
            *, 
            aluno:perfis!prontuarios_aluno_id_fkey(id, nome_completo)
          `)
          .eq('paciente_id', id)
          .order('created_at', { ascending: false });
        
        if (prontuariosError) throw prontuariosError;
        setProntuarios(prontuariosData || []);

      } catch (error) {
        console.error('Erro na busca:', error);
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, [id]);

  const handleEditarProntuario = (prontuario) => {
    setEditandoProntuario(prontuario);
    setProntuarioEditado({
      titulo: prontuario.titulo,
      conteudo: prontuario.conteudo,
      duracao_procedimento: prontuario.duracao_procedimento?.toString() || '',
      aluno_parceiro_nome: prontuario.aluno_parceiro_nome || '',
      supervisor_nome: prontuario.supervisor_nome || ''
    });
  };

  const handleSalvarEdicao = async (e) => {
    e.preventDefault();
    if (!user) return;

    setEditando(true);
    try {
      const dadosAtualizados = {
        titulo: prontuarioEditado.titulo,
        conteudo: prontuarioEditado.conteudo,
        duracao_procedimento: parseInt(prontuarioEditado.duracao_procedimento) || 0,
        aluno_parceiro_nome: prontuarioEditado.aluno_parceiro_nome || null,
        supervisor_nome: prontuarioEditado.supervisor_nome || null,
      };

      const { error } = await supabase
        .from('prontuarios')
        .update(dadosAtualizados)
        .eq('id', editandoProntuario.id);

      if (error) throw error;

      alert('Prontuário atualizado com sucesso!');
      setEditandoProntuario(null);
      
      // Atualiza a lista localmente para não precisar recarregar tudo
      setProntuarios(prontuarios.map(p => 
        p.id === editandoProntuario.id ? { ...p, ...dadosAtualizados } : p
      ));
      
    } catch (error) {
      console.error('Erro ao atualizar prontuário:', error);
      alert('Erro ao atualizar. Tente novamente.');
    } finally {
      setEditando(false);
    }
  };

  const podeEditarProntuario = (prontuario) => {
    if (!user) return false;
    if (user.funcao === 'coordenador') return true;
    if (user.funcao === 'professor') {
      return prontuario.supervisor_nome && 
             prontuario.supervisor_nome.toLowerCase().includes(user.nome_completo.toLowerCase());
    }
    if (user.funcao === 'aluno') {
      return prontuario.aluno_id === user.id;
    }
    return false;
  };

  const formatarDataHora = (dataISO) => {
    const data = new Date(dataISO);
    return data.toLocaleString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  };

  if (carregando) return <div className="ficha-paciente-container"><p>Carregando...</p></div>;
  if (!paciente) return <div className="ficha-paciente-container"><p>Paciente não encontrado.</p></div>;

  return (
    <div className="ficha-paciente-container">
      
      {/* Cabeçalho */}
      <div className="ficha-header">
        <h2>Ficha do Paciente</h2>
        <div className="ficha-acoes">
          <Link to="/pacientes" className="btn-voltar">← Voltar</Link>
          <Link to={`/pacientes/${id}/criar-prontuario`} className="btn-prontuario">
            Adicionar Prontuário
          </Link>
        </div>
      </div>

      {/* Dados Pessoais */}
      <div className="ficha-dados">
        <div className="dados-pessoais">
          <h3>Dados Pessoais</h3>
          <div className="campo">
            <label>Nome Completo:</label>
            <span>{paciente.nome_completo}</span>
          </div>
          <div className="campo">
            <label>Email:</label>
            <span>{paciente.email}</span>
          </div>
          {paciente.telefone && (
            <div className="campo">
              <label>Telefone:</label>
              <span>{paciente.telefone}</span>
            </div>
          )}
        </div>
      </div>

      {/* Lista de Prontuários */}
      <div className="prontuarios-section">
        <h3>Prontuários</h3>
        
        {/* Formulário de Edição (Modal/Pop-up) */}
        {editandoProntuario && (
          <div className="editar-prontuario-form">
            <h4>Editar Prontuário</h4>
            <form onSubmit={handleSalvarEdicao}>
              <div className="form-group">
                <label>Título:</label>
                <input
                  type="text"
                  value={prontuarioEditado.titulo}
                  onChange={(e) => setProntuarioEditado({...prontuarioEditado, titulo: e.target.value})}
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Conteúdo:</label>
                <textarea
                  value={prontuarioEditado.conteudo}
                  onChange={(e) => setProntuarioEditado({...prontuarioEditado, conteudo: e.target.value})}
                  rows="5"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Duração (minutos):</label>
                <input
                  type="number"
                  value={prontuarioEditado.duracao_procedimento}
                  onChange={(e) => setProntuarioEditado({...prontuarioEditado, duracao_procedimento: e.target.value})}
                />
              </div>
              
              <div className="form-group">
                <label>Aluno Parceiro:</label>
                <input
                  type="text"
                  value={prontuarioEditado.aluno_parceiro_nome}
                  onChange={(e) => setProntuarioEditado({...prontuarioEditado, aluno_parceiro_nome: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Supervisor:</label>
                <input
                  type="text"
                  value={prontuarioEditado.supervisor_nome}
                  onChange={(e) => setProntuarioEditado({...prontuarioEditado, supervisor_nome: e.target.value})}
                />
              </div>
              
              <div className="form-actions">
                <button type="button" onClick={() => setEditandoProntuario(null)}>
                  Cancelar
                </button>
                <button type="submit" disabled={editando}>
                  {editando ? 'Salvando...' : 'Salvar Alterações'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Lista */}
        <div className="prontuarios-lista">
          {prontuarios.length === 0 ? (
            <p className="sem-prontuarios">Nenhum prontuário encontrado.</p>
          ) : (
            prontuarios.map((prontuario) => (
              <div key={prontuario.id} className="prontuario-item">
                <div className="prontuario-header">
                  <h4>{prontuario.titulo}</h4>
                  <div className="prontuario-meta">
                    <span title="Data e Hora">
                      {formatarDataHora(prontuario.created_at)}
                    </span>
                    {prontuario.aluno && (
                      <span title="Aluno Responsável">
                        {prontuario.aluno.nome_completo}
                      </span>
                    )}
                    {prontuario.aluno_parceiro_nome && (
                      <span title="Aluno Parceiro">
                        {prontuario.aluno_parceiro_nome}
                      </span>
                    )}
                    {prontuario.supervisor_nome && (
                      <span title="Supervisor">
                        {prontuario.supervisor_nome}
                      </span>
                    )}
                    {prontuario.duracao_procedimento > 0 && (
                      <span title="Duração">
                        {prontuario.duracao_procedimento} min
                      </span>
                    )}
                  </div>
                </div>
                
                <div className="prontuario-conteudo">
                  <p>{prontuario.conteudo}</p>
                </div>
                
                {podeEditarProntuario(prontuario) && (
                  <div className="prontuario-acoes">
                    <button 
                      onClick={() => handleEditarProntuario(prontuario)}
                      className="btn-editar"
                    >
                      Editar Prontuário
                    </button>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default FichaPaciente;