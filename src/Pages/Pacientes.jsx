import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import "./CSS_Pgs/Paciente.css"; 

function Pacientes() {
  const [termoBusca, setTermoBusca] = useState('');
  const [resultados, setResultados] = useState([]);
  const [buscando, setBuscando] = useState(false);

  
  useEffect(() => {
    const carregarTodosPacientes = async () => {
      try {
        const { data, error } = await supabase
          .from('perfis')
          .select('id, nome_completo, funcao')
          .eq('funcao', 'paciente');
        
        console.log('=== DEBUG: TODOS OS PACIENTES ===');
        console.log('Pacientes encontrados:', data);
        console.log('Erro:', error);
        console.log('Quantidade:', data?.length || 0);
        console.log('================================');
      } catch (error) {
        console.error('Erro ao carregar pacientes:', error);
      }
    };

    carregarTodosPacientes();
  }, []);

  // Busca automática com debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (termoBusca.trim().length >= 2) {
        buscarPacientes(termoBusca);
      } else {
        setResultados([]);
      }
    }, 500); // Aguarda 500ms após parar de digitar

    return () => clearTimeout(timeoutId);
  }, [termoBusca]);

  const buscarPacientes = async (termo) => {
    setBuscando(true);
    console.log('Buscando por:', termo);
    
    try {
      // Primeiro, vamos verificar se existem pacientes na tabela
      const { data: todosPacientes, error: erroTodos } = await supabase
        .from('perfis')
        .select('id, nome_completo, funcao')
        .eq('funcao', 'paciente');
      
      console.log('Todos os pacientes encontrados:', todosPacientes);
      console.log('Erro ao buscar todos os pacientes:', erroTodos);
      
      // Agora fazemos a busca específica
      const { data, error } = await supabase
        .from('perfis')
        .select('id, nome_completo')
        .eq('funcao', 'paciente')
        .ilike('nome_completo', `%${termo}%`);
      
      console.log('Resultado da busca específica:', data);
      console.log('Erro da busca específica:', error);
      
      if (error) {
        console.error('Erro ao buscar pacientes:', error);
        setResultados([]);
      } else {
        setResultados(data || []);
      }
    } catch (error) {
      console.error('Erro na busca:', error);
      setResultados([]);
    } finally {
      setBuscando(false);
    }
  };

  return (
    <div className="pacientes-container">
      <h2>Busca de Pacientes</h2>
      <p>Digite o nome do paciente (mínimo 2 caracteres) - a busca é automática.</p>

      <form className="pacientes-busca-form" onSubmit={(e) => e.preventDefault()}>
        <input 
          type="text" 
          placeholder="Digite o nome do paciente..."
          value={termoBusca}
          onChange={(e) => setTermoBusca(e.target.value)}
          autoComplete="off"
          autoFocus
        />
      </form>

      <div className="pacientes-resultados-busca">
        {buscando && <p>Carregando...</p>}
        
        {!buscando && resultados.length > 0 && (
          <ul>
            {resultados.map((paciente) => (
              <li key={paciente.id}>
                <Link to={`/pacientes/${paciente.id}`}>
                  <strong>{paciente.nome_completo}</strong>
                </Link>
              </li>
            ))}
          </ul>
        )}

        {!buscando && resultados.length === 0 && termoBusca.trim().length >= 2 && (
          <p>Nenhum paciente encontrado com "{termoBusca}".</p>
        )}

        {termoBusca.trim().length > 0 && termoBusca.trim().length < 2 && (
          <p>Digite pelo menos 2 caracteres para buscar.</p>
        )}
      </div>
    </div>
  );
}

export default Pacientes;
