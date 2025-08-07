
import './CSS_Pgs/Servicos.css'; 

const servicesData = [
    {
      icon: "fa-solid fa-tooth",
      title: "Um Sorriso Saudável Transforma Tudo",
      description: "Cuidar da sua saúde bucal é essencial para o seu bem-estar geral. Nossa equipe está pronta para ajudar você a sorrir com mais confiança.",
      items: ["Avaliação e diagnóstico bucal", "Limpeza, profilaxia e flúor", "Restaurações (obturações) simples", "Orientações sobre higiene bucal"]
    },
    {
      icon: "fa-solid fa-brain",
      title: "Cuidando da Sua Saúde Mental",
      description: "Em um ambiente de escuta segura, oferecemos apoio para você lidar com os desafios emocionais do dia a dia e encontrar equilíbrio.",
      items: ["Acolhimento e escuta psicológica", "Orientação para estresse e ansiedade", "Aconselhamento para desenvolvimento pessoal", "Grupos de apoio e rodas de conversa"]
    },
    {
      icon: "fa-solid fa-person-running",
      title: "Movimento é Vida. Recupere a Sua.",
      description: "Seja para aliviar uma dor ou recuperar-se de uma lesão, nossos futuros fisioterapeutas podem guiar você no caminho da recuperação.",
      items: ["Avaliação postural e de movimento", "Tratamento e alívio para dores", "Reabilitação pós-lesão simples", "Exercícios terapêuticos guiados"]
    },
    {
      icon: "fa-solid fa-gavel",
      title: "Seus Direitos, Nossa Missão",
      description: "Entender seus direitos é o primeiro passo para a cidadania. Oferecemos orientação jurídica clara e acessível para resolver questões do cotidiano.",
      items: ["Orientação em Direito da Família", "Apoio em Direito do Consumidor", "Esclarecimentos sobre contratos", "Mediação de conflitos"]
    },
];

function Servicos() {
  return (
    // 2. Usando className para conectar com o arquivo .css
    <section className="services-section">
      <div className="container">

        <h1 className="section-title">Cuidado, Bem-Estar e Cidadania ao Seu Alcance</h1>
        <p className="section-intro">
          Descubra como nossa plataforma conecta você a uma nova geração de profissionais dedicados. Todos os nossos serviços são <strong>totalmente gratuitos</strong> e realizados por estudantes universitários sob a <strong>supervisão constante de professores experientes</strong>.
        </p>

        <div className="services-container">
          {servicesData.map((service, index) => (
            <div className="service-card" key={index}>
              <div className="icon">
                {/* 3. O ícone agora é uma tag <i> com a classe vinda dos dados */}
                <i className={service.icon}></i>
              </div>
              <h3 className="card-title">{service.title}</h3>
              <p className="card-description">{service.description}</p>
              <ul className="services-list">
                {service.items.map((item, itemIndex) => (
                  <li key={itemIndex}>
                    <i className="fa-solid fa-check"></i> 
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        
        <div className="how-it-works">
            <h2 className="section-title">Como Funciona? É Simples!</h2>
            <ol className="steps-list">
                <li><span className="step-number">1</span><strong>Faça seu Cadastro:</strong> Crie sua conta em nossa plataforma.</li>
                <li><span className="step-number">2</span><strong>Escolha o Serviço:</strong> Navegue pelas áreas e escolha o que precisa.</li>
                <li><span className="step-number">3</span><strong>Agende seu Horário:</strong> Marque sua consulta gratuita.</li>
                <li><span className="step-number">4</span><strong>Compareça ao Atendimento:</strong> Vá até a clínica no dia e hora marcados.</li>
            </ol>
        </div>

        <div className="cta-section">
          <h2>Pronto para Dar o Próximo Passo?</h2>
          <p>Sua saúde e seus direitos são importantes. Não deixe para depois. Estamos aqui para ajudar.</p>
          {/* O botão pode ser um link para a página de cadastro */}
          <a href="/cadastro" className="cta-button">AGENDAR MEU ATENDIMENTO GRATUITO</a>
        </div>

      </div>
    </section>
  );
}

export default Servicos;
