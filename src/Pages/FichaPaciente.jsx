import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../contexts/AuthContext';
import './CSS_Pgs/Paciente.css';

function FichaPaciente() {
  const { id } = useParams();
  const { user } = useAuth();
  const [paciente, setPaciente] = useState(null);
  const [carregando, setCarregando] = useState(true);
  const [prontuarios, setProntuarios] = useState([]);
  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [novoProntuario, setNovoProntuario] = useState({
    titulo: '',
    conteudo: '',
    duracao_procedimento: '',
    aluno_parceiro_nome: '',
    supervisor_nome: ''
  });
  const [editandoProntuario, setEditandoProntuario] = useState(null);
  const [prontuarioEditado, setProntuarioEditado] = useState({
    titulo: '',
    conteudo: '',
    duracao_procedimento: '',
    aluno_parceiro_nome: '',
    supervisor_nome: ''
  });
  const [editando, setEditando] = useState(false);

  useEffect(() => {
    // Carregamento de dados reais do paciente e prontuários
    const carregarDados = async () => {
      setCarregando(true);
      
      try {
        // Busca dados reais do paciente na tabela perfis
        const { data: pacienteData, error: pacienteError } = await supabase
          .from('perfis')
          .select('*')
          .eq('id', id)
          .eq('funcao', 'paciente')
          .single();
        
        if (pacienteError) {
          console.error('Erro ao buscar paciente:', pacienteError);
          setPaciente(null);
        } else {
          setPaciente(pacienteData);
        }

        // Busca prontuários do paciente com informações dos participantes
        const { data: prontuariosData, error: prontuariosError } = await supabase
          .from('prontuarios')
          .select(`
            *,
            aluno:perfis!prontuarios_aluno_id_fkey(nome_completo)
          `)
          .eq('paciente_id', id)
          .order('created_at', { ascending: false });
        
        if (prontuariosError) {
          console.error('Erro ao buscar prontuários:', prontuariosError);
          setProntuarios([]);
        } else {
          setProntuarios(prontuariosData || []);
        }
      } catch (error) {
        console.error('Erro na busca:', error);
        setPaciente(null);
        setProntuarios([]);
      } finally {
        setCarregando(false);
      }
    };

    carregarDados();
  }, [id]);

  const handleSalvarProntuario = async (e) => {
    e.preventDefault();
    if (!user) {
      alert('Você precisa estar logado para adicionar prontuários.');
      return;
    }

    setSalvando(true);
    try {
      // Primeiro, vamos tentar salvar sem as novas colunas para testar
      const prontuarioData = {
        paciente_id: id,
        aluno_id: user.id,
        titulo: novoProntuario.titulo,
        conteudo: novoProntuario.conteudo,
        duracao_procedimento: parseInt(novoProntuario.duracao_procedimento) || 0,
        created_at: new Date().toISOString()
      };

      // Se as novas colunas existirem, adicionamos elas
      if (novoProntuario.aluno_parceiro_nome) {
        prontuarioData.aluno_parceiro_nome = novoProntuario.aluno_parceiro_nome;
      }
      if (novoProntuario.supervisor_nome) {
        prontuarioData.supervisor_nome = novoProntuario.supervisor_nome;
      }

      console.log('Dados do prontuário a serem salvos:', prontuarioData);

      const { data, error } = await supabase
        .from('prontuarios')
        .insert([prontuarioData]);

      if (error) {
        console.error('Erro detalhado ao salvar prontuário:', error);
        console.error('Código do erro:', error.code);
        console.error('Mensagem do erro:', error.message);
        console.error('Detalhes do erro:', error.details);
        alert(`Erro ao salvar prontuário: ${error.message}`);
      } else {
        alert('Prontuário salvo com sucesso!');
        setNovoProntuario({ titulo: '', conteudo: '', duracao_procedimento: '', aluno_parceiro_nome: '', supervisor_nome: '' });
        setMostrarFormulario(false);
        
        // Recarrega os prontuários
        const { data: prontuariosData } = await supabase
          .from('prontuarios')
          .select(`
            *,
            aluno:perfis!prontuarios_aluno_id_fkey(nome_completo)
          `)
          .eq('paciente_id', id)
          .order('created_at', { ascending: false });
        
        setProntuarios(prontuariosData || []);
      }
    } catch (error) {
      console.error('Erro ao salvar prontuário:', error);
      alert('Erro ao salvar prontuário. Tente novamente.');
    } finally {
      setSalvando(false);
    }
  };

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
        updated_at: new Date().toISOString()
      };

      console.log('Atualizando prontuário:', editandoProntuario.id, dadosAtualizados);

      const { error } = await supabase
        .from('prontuarios')
        .update(dadosAtualizados)
        .eq('id', editandoProntuario.id);

      if (error) {
        console.error('Erro ao atualizar prontuário:', error);
        alert(`Erro ao atualizar prontuário: ${error.message}`);
      } else {
        alert('Prontuário atualizado com sucesso!');
        setEditandoProntuario(null);
        
        // Recarrega os prontuários
        const { data: prontuariosData } = await supabase
          .from('prontuarios')
          .select(`
            *,
            aluno:perfis!prontuarios_aluno_id_fkey(nome_completo)
          `)
          .eq('paciente_id', id)
          .order('created_at', { ascending: false });
        
        setProntuarios(prontuariosData || []);
      }
    } catch (error) {
      console.error('Erro ao atualizar prontuário:', error);
      alert('Erro ao atualizar prontuário. Tente novamente.');
    } finally {
      setEditando(false);
    }
  };

  const podeEditarProntuario = (prontuario) => {
    if (!user) return false;
    
    // Coordenadores podem editar todos os prontuários da especialidade
    if (user.funcao === 'coordenador') {
      return true;
    }
    
    // Professores podem editar prontuários onde são supervisores
    if (user.funcao === 'professor') {
      return prontuario.supervisor_nome && 
             prontuario.supervisor_nome.toLowerCase().includes(user.nome_completo.toLowerCase());
    }
    
    // Alunos só podem editar seus próprios prontuários
    if (user.funcao === 'aluno') {
      return prontuario.aluno_id === user.id;
    }
    
    return false;
  };

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
    return (
      <div className="ficha-paciente-container">
        <div className="carregando">
          <p>Carregando dados do paciente...</p>
        </div>
      </div>
    );
  }

  if (!paciente) {
    return (
      <div className="ficha-paciente-container">
        <div className="erro">
          <p>Paciente não encontrado.</p>
          <Link to="/pacientes">← Voltar para busca</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="ficha-paciente-container">
      <div className="ficha-header">
        <h2>Ficha do Paciente</h2>
        <div className="ficha-acoes">
          <Link to="/pacientes" className="btn-voltar">← Voltar</Link>
          {/* Alterado para navegar para a página de criação de prontuário */}
          <Link to={`/pacientes/${id}/criar-prontuario`} className="btn-prontuario">
            Adicionar Prontuário
          </Link>
        </div>
      </div>

      <div className="ficha-dados">
        <div className="dados-pessoais">
          <h3>Dados Pessoais</h3>
          <div className="campo">
            <label>Nome Completo:</label>
            <span>{paciente.nome_completo}</span>
          </div>
          {paciente.cpf && (
            <div className="campo">
              <label>CPF:</label>
              <span>{paciente.cpf}</span>
            </div>
          )}
          {paciente.data_nascimento && (
            <div className="campo">
              <label>Data de Nascimento:</label>
              <span>{paciente.data_nascimento}</span>
            </div>
          )}
          {paciente.telefone && (
            <div className="campo">
              <label>Telefone:</label>
              <span>{paciente.telefone}</span>
            </div>
          )}
          {paciente.email && (
            <div className="campo">
              <label>Email:</label>
              <span>{paciente.email}</span>
            </div>
          )}
          {paciente.endereco && (
            <div className="campo">
              <label>Endereço:</label>
              <span>{paciente.endereco}</span>
            </div>
          )}
        </div>

        {paciente.observacoes && (
          <div className="observacoes">
            <h3>Observações</h3>
            <p>{paciente.observacoes}</p>
          </div>
        )}
      </div>

      {/* Seção de Prontuários */}
      <div className="prontuarios-section">
        <h3>Prontuários</h3>
        
        {/* Formulário para novo prontuário */}
        {mostrarFormulario && (
          <div className="novo-prontuario-form">
            <h4>Novo Prontuário</h4>
            <form onSubmit={handleSalvarProntuario}>
              <div className="form-group">
                <label>Título:</label>
                <input
                  type="text"
                  value={novoProntuario.titulo}
                  onChange={(e) => setNovoProntuario({...novoProntuario, titulo: e.target.value})}
                  placeholder="Ex: Consulta inicial, Retorno..."
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Conteúdo:</label>
                <textarea
                  value={novoProntuario.conteudo}
                  onChange={(e) => setNovoProntuario({...novoProntuario, conteudo: e.target.value})}
                  placeholder="Descreva o procedimento, observações, diagnóstico..."
                  rows="5"
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Duração (minutos):</label>
                <input
                  type="number"
                  value={novoProntuario.duracao_procedimento}
                  onChange={(e) => setNovoProntuario({...novoProntuario, duracao_procedimento: e.target.value})}
                  placeholder="Ex: 30"
                  min="0"
                />
              </div>
              
              <div className="form-group">
                <label>Aluno Parceiro (opcional):</label>
                <input
                  type="text"
                  value={novoProntuario.aluno_parceiro_nome}
                  onChange={(e) => setNovoProntuario({...novoProntuario, aluno_parceiro_nome: e.target.value})}
                  placeholder="Nome do aluno parceiro"
                />
              </div>
              
              <div className="form-group">
                <label>Supervisor (opcional):</label>
                <input
                  type="text"
                  value={novoProntuario.supervisor_nome}
                  onChange={(e) => setNovoProntuario({...novoProntuario, supervisor_nome: e.target.value})}
                  placeholder="Nome do supervisor"
                />
              </div>
              
              <div className="form-actions">
                <button type="submit" disabled={salvando}>
                  {salvando ? 'Salvando...' : 'Salvar Prontuário'}
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Formulário de edição de prontuário */}
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
                  placeholder="Ex: Consulta inicial, Retorno..."
                  required
                />
              </div>
              
              <div className="form-group">
                <label>Conteúdo:</label>
                <textarea
                  value={prontuarioEditado.conteudo}
                  onChange={(e) => setProntuarioEditado({...prontuarioEditado, conteudo: e.target.value})}
                  placeholder="Descreva o procedimento, observações, diagnóstico..."
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
                  placeholder="Ex: 30"
                  min="0"
                />
              </div>
              
              <div className="form-group">
                <label>Aluno Parceiro (opcional):</label>
                <input
                  type="text"
                  value={prontuarioEditado.aluno_parceiro_nome}
                  onChange={(e) => setProntuarioEditado({...prontuarioEditado, aluno_parceiro_nome: e.target.value})}
                  placeholder="Nome do aluno parceiro"
                />
              </div>
              
              <div className="form-group">
                <label>Supervisor (opcional):</label>
                <input
                  type="text"
                  value={prontuarioEditado.supervisor_nome}
                  onChange={(e) => setProntuarioEditado({...prontuarioEditado, supervisor_nome: e.target.value})}
                  placeholder="Nome do supervisor"
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

        {/* Lista de prontuários existentes */}
        <div className="prontuarios-lista">
          {prontuarios.length === 0 ? (
            <p className="sem-prontuarios">Nenhum prontuário encontrado.</p>
          ) : (
            prontuarios.map((prontuario) => (
              <div key={prontuario.id} className="prontuario-item">
                <div className="prontuario-header">
                  <h4>{prontuario.titulo}</h4>
                  <div className="prontuario-meta">
                    <span className="data-hora" title="Data e Hora">
                      <i className="fas fa-calendar-alt"></i>
                      {formatarDataHora(prontuario.created_at)}
                    </span>
                    {prontuario.aluno && (
                      <span className="autor" title="Aluno Responsável">
                        <i className="fas fa-user-graduate"></i>
                        {prontuario.aluno.nome_completo}
                      </span>
                    )}
                    {prontuario.aluno_parceiro_nome && (
                      <span className="parceiro" title="Aluno Parceiro">
                        <i className="fas fa-user-friends"></i>
                        {prontuario.aluno_parceiro_nome}
                      </span>
                    )}
                    {prontuario.supervisor_nome && (
                      <span className="supervisor" title="Supervisor">
                        <i className="fas fa-user-tie"></i>
                        {prontuario.supervisor_nome}
                      </span>
                    )}
                    {prontuario.duracao_procedimento > 0 && (
                      <span className="duracao" title="Duração">
                        <i className="fas fa-clock"></i>
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
