// Importa o React para criar o componente
import React from 'react';
// Importa o Link do react-router-dom para navegação
import { Link } from 'react-router-dom';

// Define o componente funcional
function PaginaNaoAutorizado() {
  return (
    <div className="container-nao-autorizado">
      <h1 className="titulo-nao-autorizado">Acesso Negado</h1>
      <p className="mensagem-nao-autorizado">
        Você não tem permissão para visualizar esta página.
      </p>
      <Link to="/" className="link-voltar">
        Voltar para a página inicial
      </Link>
    </div>
  );
}

// Exporta o componente para que ele possa ser usado em outras partes do seu app
export default PaginaNaoAutorizado;