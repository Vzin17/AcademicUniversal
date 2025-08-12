import './Inicio.css';

function Inicio(){

    return(
    <main>
    <section className="hero">
        <h1>Conectando Universitários e Profissionais,</h1>
        <h1> para atendimento gratuito para a comunidade.</h1>
        <p>Unindo estudantes e professores para oferecer o apoio jurídico, psicológico e de saúde que você precisa!</p>
        


    </section>

    <section className="features">
        <h2>Como Podemos Ajudar</h2>
        <div className="cards">

            <div className="card">
                <h3>Apoio Jurídico Gratuito</h3>
                <p>Orientação para resolver questões de família, consumidor, contratos e outros direitos.</p>
            </div>

            <div className="card">
                <h3>Acolhimento Psicológico</h3>
                <p>Um espaço seguro de escuta e cuidado para sua saúde mental e bem-estar emocional.</p>
            </div>

            <div className="card">
                <h3>Cuidados em Saúde</h3>
                <p>Atendimentos em Fisioterapia, Odontologia e orientação sobre o uso de medicamentos.</p>
            </div>
            
            <div className="card">
                <h3>Atendimento Integrado</h3>
                <p>Nossa equipe de diferentes áreas olhando para você de forma completa e humanizada.</p>
            </div>

        </div>
    </section>
    </main>

    );
}


export default Inicio;