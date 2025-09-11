// src/seed.js
import { supabase } from './supabaseClient'; // Certifique-se que o caminho está correto

const usuariosParaCriar = [
  { email: 'teste.coordenador@gmail.com', password: 'password-segura-123', role: 'coordenador', full_name: 'Coordenador Teste' },
  { email: 'teste.recepcionista@gmail.com', password: 'password-segura-123', role: 'recepcionista', full_name: 'Recepcionista Teste' },
  { email: 'teste.aluno@gmail.com', password: 'password-segura-123', role: 'aluno', full_name: 'Aluno Teste' },
  { email: 'teste.comunidade@gmail.com', password: 'password-segura-123', role: 'comunidade', full_name: 'Comunidade Teste' }
];

export async function popularBancoComUsuarios() {
  console.log('--- Iniciando script para criar utilizadores de teste ---');
  for (const usuario of usuariosParaCriar) {
    console.log(`A processar: ${usuario.email}`);

    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: usuario.email,
      password: usuario.password
    });

    if (authError && !authError.message.includes('already registered')) {
      console.error(`ERRO na autenticação de ${usuario.email}:`, authError.message);
      continue;
    }

    const user = authData.user;
    if (!user) {
      console.error(`Falha ao obter o utilizador para ${usuario.email}. Pode já existir um perfil. Pulando.`);
      continue;
    }

    const { error: profileError } = await supabase.from('profiles').insert({
      id: user.id,
      full_name: usuario.full_name,
      role: usuario.role
    });

    if (profileError && profileError.code !== '23505') { // 23505 = já existe
      console.error(`ERRO ao criar perfil de ${usuario.email}:`, profileError.message);
    } else {
      console.log(`SUCESSO para ${usuario.email} com o papel '${usuario.role}'.`);
    }
  }
  console.log('--- Script concluído! ---');
}