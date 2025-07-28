import './MeuBotao.css'; // Importando o CSS
import botao from './assets/BUTAAO.jpeg'; // 1. IMPORTANDO A IMAGEM

function MeuBotaoDeLixeira() {

  function handleClick() {
    alert("Botão de deletar clicado!");
  }

  return (
    // 2. O botão agora envolve a imagem
    // Dica de Acessibilidade: 'aria-label' descreve o botão para leitores de tela
    <button className="botao-com-icone" onClick={handleClick} aria-label="Deletar item">
      
      {/* 3. A imagem é usada aqui, com o 'src' vindo da importação */}
      <img src={botao} alt="Botão loco" />

    </button>
  );
}

export default MeuBotaoDeLixeira;