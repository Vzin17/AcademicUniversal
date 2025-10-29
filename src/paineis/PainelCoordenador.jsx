import React from 'react';
import { useAuth } from './Contexts/AuthContext.jsx'; 
import "./PainelCoordenador.css";
import { Link } from 'react-router-dom'; 

function PainelCoordenador() {
    const { user } = useAuth();
    
    if (!user) {
        return <div>Carregando informações...</div>;
    }

    return (
        <div className="painel-coordenador-container">
            
            <h2>Bem-vindo, {user.nome_completo}!</h2>
            <p>Painel do Coordenador - Acompanhe os prontuários da especialidade</p>

            <div className="cards-painel-superior">
                
                <Link to="/prontuarios" className="card-painel">
                    <h3>Prontuários Recentes</h3>
                    <p>Últimos prontuários criados pelos alunos</p>
                </Link>

                <div className="card-painel">
                    <h3>Especialidade</h3>
                    {/* Agora user.areas (do AuthContext) deve vir preenchido */}
                    <p>{user.areas?.name || 'Não definida'}</p>
                </div>

            </div>

            <div className="notificacoes-container">
                 {/* <NotificacoesProntuarios />  Podes descomentar isto se quiseres */}
                 <p>Nenhuma notificação encontrada.</p>
            </div>

            <div className="acoes-rapidas">
                <h3>Ações Rápidas</h3>
                <Link to="/" className="botao-acao">Início</Link>
                <Link to="/pacientes" className="botao-acao">Buscar Pacientes</Link>
                <Link to="/agendamento" className="botao-acao">Ver Agendamentos</Link>
                <Link to="/admin" className="botao-acao">Painel Administrativo</Link>
            </div>

        </div>
    );
}

export default PainelCoordenador;