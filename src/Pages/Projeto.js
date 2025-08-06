import './CSS_Pgs/Projeto.css';

function Projeto() {
  return (
<section className="about-project-section">
      <div className="container">
        <h1 className="main-title">Sobre o Projeto Vincle</h1>

        <div className="content-block">
          <h2>A Essência do Projeto</h2>
          <p>
            O Projeto InterSocial nasceu de uma ideia simples, mas poderosa: construir uma ponte real e funcional entre o universo acadêmico e a comunidade. Somos uma iniciativa de impacto social que utiliza a tecnologia para conectar o conhecimento, a energia e a dedicação de estudantes universitários com as necessidades de atendimento da população, de forma totalmente gratuita e acessível.
          </p>
        </div>

        <div className="content-block">
          <h2>O Problema que Queremos Resolver</h2>
          <p>
            Identificamos duas realidades que caminham em paralelo: de um lado, cidadãos que muitas vezes encontram barreiras financeiras ou geográficas para ter acesso a serviços essenciais de saúde e orientação jurídica. Do outro, estudantes universitários talentosos, em fase final de sua formação, ansiosos por aplicar seus conhecimentos em situações práticas e desenvolver uma visão mais humana de sua futura profissão. O InterSocial surge para unir essas duas pontas.
          </p>
        </div>

        <div className="content-block">
          <h2>Nossa Solução: Uma Plataforma de Atendimento Interdisciplinar</h2>
          <p>
            Nossa solução é uma plataforma digital que organiza e facilita o agendamento de atendimentos gratuitos nas clínicas-escola das instituições de ensino. Por meio dela, estudantes dos cursos de Direito, Psicologia, Fisioterapia, Odontologia e Farmácia, sempre com a supervisão rigorosa de seus professores, prestam serviços de qualidade à comunidade. A tecnologia aqui não é o fim, mas o meio para tornar essa colaboração eficiente, segura e organizada.
          </p>
        </div>

        <div className="content-block">
          <h2>O Pilar Interdisciplinar: Cuidando do Ser Humano por Completo</h2>
          <p>
            Acreditamos que um ser humano não pode ser visto em partes. Um problema jurídico pode afetar a saúde mental. Uma condição física pode necessitar de orientação farmacêutica, e a saúde bucal impacta o corpo todo. Por isso, o nosso grande diferencial é a abordagem interdisciplinar. Incentivamos a colaboração entre as diferentes áreas para oferecer um cuidado mais completo, integrado e que realmente compreenda as necessidades de cada pessoa.
          </p>
        </div>

        <div className="content-block">
          <h2>Visão de Futuro e Impacto Esperado</h2>
          <ul className="impact-list">
            <li>
              {/* O ícone Font Awesome para a lista */}
              <i className="fa-solid fa-check-circle"></i>
              <div>
                <strong>Para a Comunidade:</strong> Cidadania fortalecida, com mais acesso à saúde e à justiça.
              </div>
            </li>
            <li>
              <i className="fa-solid fa-check-circle"></i>
              <div>
                <strong>Para os Estudantes:</strong> Formação de profissionais mais humanos, éticos e conscientes de seu papel social.
              </div>
            </li>
            <li>
              <i className="fa-solid fa-check-circle"></i>
              <div>
                <strong>Para a Universidade:</strong> Consolidação de sua função como um verdadeiro agente de transformação na sociedade.
              </div>
            </li>
          </ul>
        </div>

      </div>
    </section>
  );
}

export default Projeto;
