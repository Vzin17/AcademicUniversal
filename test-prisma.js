// test-prisma.js

// Note que o caminho para a importação mudou um pouco, pois estamos na raiz do projeto
import { PrismaClient } from './src/generated/prisma/index.js';

const prisma = new PrismaClient();

async function main() {
  console.log("🚀 Conectado e pronto para usar o Prisma!");

  // Exemplo: Criar um usuário
  console.log("Criando um novo usuário...");
  const novoUsuario = await prisma.user.create({
    data: {
      name: 'Aliny Vencedora',
      // Email aleatório para poder rodar o script várias vezes sem erro de email único
      email: `aliny.vitoria${Math.floor(Math.random() * 1000)}@email.com`,
    },
  });
  console.log("Usuário criado com sucesso:", novoUsuario);

  // Exemplo: Listar todos os usuários no banco
  console.log("\nBuscando todos os usuários...");
  const todosUsuarios = await prisma.user.findMany();
  console.log("Usuários encontrados no banco:", todosUsuarios);
}

main()
  .catch((e) => {
    console.error("Ocorreu um erro:", e);
  })
  .finally(async () => {
    // É importante sempre se desconectar do banco
    await prisma.$disconnect();
    console.log("\nDesconectado do banco de dados.");
  });