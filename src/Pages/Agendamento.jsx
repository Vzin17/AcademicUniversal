import React, { useState, useMemo } from 'react';
import './CSS_Pgs/Agendamento.css';

// Dados de exemplo
const disponibilidade = {
  'Direito': ['2025-09-10', '2025-09-12', '2025-09-18', '2025-09-25'],
  'Psicologia': ['2025-09-11', '2025-09-15', '2025-09-16', '2025-09-23'],
  'Fisioterapia': ['2025-09-10', '2025-09-17', '2025-09-24'],
  'Odontologia': ['2025-09-12', '2025-09-19', '2025-09-26'],
  'Farmácia': [],
};

const areasDeAtendimento = [
  'Direito', 'Psicologia', 'Fisioterapia', 'Odontologia', 'Farmácia'
];

function Agendamento() {
  const [areaSelecionada, setAreaSelecionada] = useState('');
  const [dataSelecionada, setDataSelecionada] = useState('');
  const [mesAtual, setMesAtual] = useState(new Date().getMonth());
  const [anoAtual, setAnoAtual] = useState(new Date().getFullYear());

  const diasDisponiveis = useMemo(() => {
    return areaSelecionada ? disponibilidade[areaSelecionada] || [] : [];
  }, [areaSelecionada]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!areaSelecionada || !dataSelecionada) {
      alert('Por favor, selecione uma área e uma data disponível.');
      return;
    }
    alert(`Agendamento para ${areaSelecionada} no dia ${new Date(dataSelecionada + 'T00:00:00').toLocaleDateString('pt-BR')} foi enviado!`);
    
    setAreaSelecionada('');
    setDataSelecionada('');
  }

  const handleSelecionarDia = (dia) => {
    if (!areaSelecionada) {
      alert('Por favor, selecione uma área primeiro!');
      return;
    }
    const dataFormatada = `${anoAtual}-${String(mesAtual + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
    
    if (diasDisponiveis.includes(dataFormatada)) {
      setDataSelecionada(dataFormatada);
    } else {
      alert('Este dia não está disponível para a área selecionada.');
    }
  };

  const mudarMes = (incremento) => {
    const novaData = new Date(anoAtual, mesAtual + incremento);
    setMesAtual(novaData.getMonth());
    setAnoAtual(novaData.getFullYear());
  };

  const renderizarCalendario = () => {
    const diasNoMes = new Date(anoAtual, mesAtual + 1, 0).getDate();
    const primeiroDiaDoMes = new Date(anoAtual, mesAtual, 1).getDay();
    const diasDaSemana = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const calendario = [];

    diasDaSemana.forEach(dia => {
      calendario.push(<div key={dia} className="calendar-day-header">{dia}</div>);
    });

    for (let i = 0; i < primeiroDiaDoMes; i++) {
      calendario.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
    }

    for (let dia = 1; dia <= diasNoMes; dia++) {
      const dataCompleta = `${anoAtual}-${String(mesAtual + 1).padStart(2, '0')}-${String(dia).padStart(2, '0')}`;
      const isDisponivel = areaSelecionada && diasDisponiveis.includes(dataCompleta);
      const isSelecionado = dataCompleta === dataSelecionada;

      let className = "calendar-day";
      if (isDisponivel) className += " available";
      if (isSelecionado) className += " selected";

      calendario.push(
        <div key={dia} className={className} onClick={() => handleSelecionarDia(dia)}>
          {dia}
        </div>
      );
    }

    return calendario;
  };

  return (
    <main className="agendamento-container">
      <h2 className="agendamento-header">Agendamento de Atendimento</h2>
      <div className="agendamento-content">
        {/* Coluna da Esquerda */}
        <div className="areas-container">
          <h3 className="areas-title">1. Selecione a Área</h3>
          {areasDeAtendimento.map((area) => (
            <div
              key={area}
              className={`area-item ${area === areaSelecionada ? 'selected' : ''}`}
              onClick={() => {
                setAreaSelecionada(area);
                setDataSelecionada('');
              }}
            >
              {area}
            </div>
          ))}
        </div>

        {/* Coluna da Direita */}
        <div className="calendar-container">
          <h3 className="calendar-title">2. Escolha um Dia Disponível</h3>
          <div className="calendar-header">
            <button className="calendar-nav-btn" onClick={() => mudarMes(-1)}>&lt;</button>
            <strong>{new Date(anoAtual, mesAtual).toLocaleString('pt-BR', { month: 'long', year: 'numeric' })}</strong>
            <button className="calendar-nav-btn" onClick={() => mudarMes(1)}>&gt;</button>
          </div>
          <div className="calendar-grid">
            {renderizarCalendario()}
          </div>
        </div>
      </div>

      <div className="selection-info">
        {areaSelecionada && dataSelecionada 
          ? `Seleção: ${areaSelecionada} em ${new Date(dataSelecionada + 'T00:00:00').toLocaleDateString('pt-BR')}`
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
