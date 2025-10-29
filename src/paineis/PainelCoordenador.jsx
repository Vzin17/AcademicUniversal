import React from 'react';
import { useAuth } from '../../Contexts/AuthContext.jsx'; 

import "../CSS_Pgs/PainelCoordenador.css";

import { Link } from 'react-router-dom'; 

function PainelCoordenador() {
    const { user } = useAuth();
    
    if (!user) {
        return <div>Carregando informações...</div>;
    }

    console.log('### ESTOU NO COMPONENTE CORRETO ###');

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
                    <p>{user.areas?.name || 'Não definida'}</p>
                </div>

            </div>

            <div className="notificacoes-container">
                 <p>Nenhuma notificação encontrada.</p>
            </div>

            {/* Seção de Ações Rápidas */}
            <div className="acoes-rapidas-section">
                <h3>Ações Rápidas</h3>
                <div className="acoes-rapidas-container">
                    <Link to="/" className="botao-acao">Início</Link>
                    <Link to="/pacientes" className="botao-acao">Buscar Pacientes</Link>
                    <Link to="/agendamento" className="botao-acao">Ver Agendamentos</Link>
                    <Link to="/admin" className="botao-acao">Painel Administrativo</Link>
                </div>
            </div>

        </div>
    );
}

export default PainelCoordenador;