// server.js
import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config'; // Carrega as variáveis do .env

const app = express();
const prisma = new PrismaClient();

app.use(cors()); // Permite requisições de outras origens (seu front-end)
app.use(express.json()); // Permite que o express entenda JSON no corpo das requisições

// Rota para CRIAR um usuário (Cadastro)
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  // Criptografa a senha antes de salvar
  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    // Não retorne a senha!
    delete user.password;
    res.status(201).json(user);

  } catch (error) {
    // Código 'P2002' é o código de erro do Prisma para campos únicos duplicados
    if (error.code === 'P2002') {
      return res.status(409).json({ error: "Este email já está em uso." });
    }
    res.status(500).json({ error: "Ocorreu um erro ao registrar o usuário." });
  }
});

// Rota para AUTENTICAR um usuário (Login) - A que seu AuthContext chama!
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // 1. Encontrar o usuário pelo email
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Email ou senha inválidos.' });
    }

    // 2. Comparar a senha enviada com a senha criptografada no banco
    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Email ou senha inválidos.' });
    }

    // 3. Gerar o Token JWT
    const token = jwt.sign(
      { userId: user.id }, // O que você quer armazenar no token
      process.env.JWT_SECRET, // Sua chave secreta
      { expiresIn: '7d' } // Tempo de expiração do token
    );

    // 4. Enviar a resposta para o front-end
    delete user.password; // Nunca envie a senha criptografada de volta!
    res.json({
      user,
      token,
    });

  } catch (error) {
    res.status(500).json({ error: "Ocorreu um erro ao fazer login." });
  }
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
});