import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import './CSS_Pgs/Agendamento.css';
import { supabase } from '../supabaseClient'; // NOVO: Importa o cliente Supabase

// Lista de áreas de atendimento
const areasDeAtendimento = [
  'Direito', 'Psicologia', 'Fisioterapia', 'Odontologia', 'Farmácia'
];

// NOVO: Lista de horários disponíveis
const horariosDisponiveis = [
  '09:00', '10:00', '11:00', '14:00', '15:00', '16:00'
];

function Agendamento() {
  const [areaSelecionada, setAreaSelecionada] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [horaSelecionada, setHoraSelecionada] = useState(''); // NOVO: Estado para a hora

  const isDiaDesabilitado = ({ date }) => {
    const diaDaSemana = date.getDay();
    if (diaDaSemana === 0 || diaDaSemana === 6) {
      return true;
    }
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    if (date < hoje) {
      return true;
    }
    return false;
  };

  const handleSelecionarArea = (area) => {
    setAreaSelecionada(area);
    setDataSelecionada(null);
    setHoraSelecionada(''); // NOVO: Limpa a hora ao trocar de área
  };

  const handleSelecionarData = (data) => {
    setDataSelecionada(data);
    setHoraSelecionada(''); // NOVO: Limpa a hora ao escolher um novo dia
  };

  // ALTERADO: A função de envio agora é assíncrona e salva no Supabase
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!areaSelecionada || !dataSelecionada || !horaSelecionada) {
      alert('Por favor, selecione uma área, um dia e um horário.');
      return;
    }

    try {
      // 1. Pega o usuário que está logado no momento
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        alert("Erro: Você precisa estar logado para fazer um agendamento.");
        return;
      }

      // 2. Combina a data e a hora selecionadas em um único objeto Date
      const [horas, minutos] = horaSelecionada.split(':');
      const dataConsultaFinal = new Date(dataSelecionada);
      dataConsultaFinal.setHours(parseInt(horas), parseInt(minutos), 0, 0);

      // 3. Insere os dados na tabela 'agendamentos' do Supabase
      const { data, error } = await supabase
        .from('agendamentos')
        .insert([
          { 
            area_especialidade: areaSelecionada,
            data_consulta: dataConsultaFinal.toISOString(),
            usuario_id: user.id
          },
        ]);

      if (error) {
        throw error; // Joga o erro para o bloco catch
      }

      alert(`Agendamento confirmado para ${areaSelecionada} no dia ${dataConsultaFinal.toLocaleString('pt-BR')}!`);

      // Limpa os campos após o sucesso
      setAreaSelecionada('');
      setDataSelecionada(null);
      setHoraSelecionada('');

    } catch (error) {
      console.error('Erro ao criar agendamento:', error);
      alert(`Ocorreu um erro ao agendar: ${error.message}`);
    }
  };

  return (
    <main className="agendamento-container">
      <h2 className="agendamento-header">Agendamento de Atendimento</h2>
      <div className="agendamento-content">
        <div className="areas-container">
          <h3 className="areas-title">1. Selecione a Área</h3>
          {areasDeAtendimento.map((area) => (
            <div
              key={area}
              className={`area-item ${area === areaSelecionada ? 'selected' : ''}`}
              onClick={() => handleSelecionarArea(area)}
            >
              {area}
            </div>
          ))}
        </div>

        <div className="calendar-container">
          <h3 className="calendar-title">2. Escolha um Dia Disponível</h3>
          <Calendar
            onClickDay={handleSelecionarData}
            value={dataSelecionada}
            tileDisabled={isDiaDesabilitado}
            locale="pt-BR"
          />
        </div>

        {/* NOVO: Seção para escolher o horário, só aparece se um dia for selecionado */}
        {dataSelecionada && (
          <div className="horarios-container">
            <h3 className="horarios-title">3. Escolha um Horário</h3>
            <div className="horarios-grid">
              {horariosDisponiveis.map((horario) => (
                <div
                  key={horario}
                  className={`horario-item ${horario === horaSelecionada ? 'selected' : ''}`}
                  onClick={() => setHoraSelecionada(horario)}
                >
                  {horario}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="selection-info">
        {areaSelecionada && dataSelecionada && horaSelecionada
          ? `Seleção: ${areaSelecionada} em ${dataSelecionada.toLocaleDateString('pt-BR')} às ${horaSelecionada}`
          : 'Aguardando seleção...'}
      </div>

      <form onSubmit={handleSubmit} className="agendamento-form">
        <button
          type="submit"
          className="agendamento-submit-btn"
          disabled={!areaSelecionada || !dataSelecionada || !horaSelecionada}
        >
          Confirmar Agendamento
        </button>
      </form>
    </main>
  );
}

export default Agendamento;