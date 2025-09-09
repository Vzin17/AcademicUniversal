import React, { useState } from 'react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css'; // Estilos padrão do calendário
import './CSS_Pgs/Agendamento.css'; // Seus estilos personalizados

// Lista de áreas de atendimento
const areasDeAtendimento = [
  'Direito', 'Psicologia', 'Fisioterapia', 'Odontologia', 'Farmácia'
];

// Componente principal do Agendamento
function Agendamento() {
  const [areaSelecionada, setAreaSelecionada] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState(null);

  /**
   * Função para verificar se uma data deve ser desabilitada no calendário.
   */
  const isDiaDesabilitado = ({ date }) => {
    // Regra 1: Desabilitar Sábados (6) e Domingos (0)
    const diaDaSemana = date.getDay();
    if (diaDaSemana === 0 || diaDaSemana === 6) {
      return true;
    }

    // Regra 2: Desabilitar datas anteriores ao dia de hoje
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0); // Zera o tempo para comparar apenas a data
    if (date < hoje) {
      return true;
    }

    /*
    if (areaSelecionada) {
      switch (areaSelecionada) {
        case 'Direito':
          // Direito atende apenas às Segundas (1) e Quartas (3)
          if (diaDaSemana !== 1 && diaDaSemana !== 3) {
            return true;
          }
          break;
        case 'Psicologia':
          // Psicologia atende apenas às Terças (2) e Quintas (4)
          if (diaDaSemana !== 2 && diaDaSemana !== 4) {
            return true;
          }
          break;
        case 'Fisioterapia':
          // Fisioterapia atende apenas às Sextas (5)
          if (diaDaSemana !== 5) {
            return true;
          }
          break;
        // Para 'Odontologia' e 'Farmácia', não há regra específica,
        // então eles atendem em qualquer dia de semana (já filtrado acima).
        default:
          break;
      }
    }
    */



    // Se a data passou por todas as regras, ela não será desabilitada
    return false;
  };

  /**
   * Lida com o clique em uma área de atendimento
   */
  const handleSelecionarArea = (area) => {
    setAreaSelecionada(area);
    setDataSelecionada(null); // Limpa a data selecionada ao trocar de área
  };
  
  /**
   * Lida com o envio do formulário de agendamento.
   */
  function handleSubmit(e) {
    e.preventDefault();
    if (!areaSelecionada || !dataSelecionada) {
      alert('Por favor, selecione uma área e uma data disponível.');
      return;
    }
    alert(`Agendamento para ${areaSelecionada} no dia ${dataSelecionada.toLocaleDateString('pt-BR')} foi enviado!`);

    // Limpa os campos após o envio
    setAreaSelecionada('');
    setDataSelecionada(null);
  }

  // O restante do seu código (a parte visual do componente) continua igual.
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
            onClickDay={setDataSelecionada}
            value={dataSelecionada}
            tileDisabled={isDiaDesabilitado}
            locale="pt-BR"
          />
        </div>
      </div>

      <div className="selection-info">
        {areaSelecionada && dataSelecionada
          ? `Seleção: ${areaSelecionada} em ${dataSelecionada.toLocaleDateString('pt-BR')}`
          : 'Aguardando seleção...'}
      </div>

      <form onSubmit={handleSubmit} className="agendamento-form">
        <button
          type="submit"
          className="agendamento-submit-btn"
          disabled={!areaSelecionada || !dataSelecionada}
        >
          Confirmar Agendamento
        </button>
      </form>
    </main>
  );
}

export default Agendamento;