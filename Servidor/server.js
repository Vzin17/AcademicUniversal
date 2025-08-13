// ARQUIVO: server.js

import express from 'express';
import cors from 'cors';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import 'dotenv/config'; // Garante que as variáveis do .env sejam carregadas

const app = express();
const prisma = new PrismaClient(); // É ISTO que foi gerado! Nosso acesso ao banco.

app.use(cors());
app.use(express.json());

// --- ROTA DE CADASTRO ---
app.post('/register', async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    res.status(201).json({ id: user.id, name: user.name, email: user.email });

  } catch (error) {
    if (error.code === 'P2002') { // Erro de email duplicado
      return res.status(409).json({ error: "Este email já está em uso." });
    }
    console.error(error);
    res.status(500).json({ error: "Ocorreu um erro ao registrar o usuário." });
  }
});

// --- ROTA DE LOGIN ---
app.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(401).json({ error: 'Email ou senha inválidos.' });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);

    if (!isPasswordCorrect) {
      return res.status(401).json({ error: 'Email ou senha inválidos.' });
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Remove a senha antes de enviar a resposta
    delete user.password;
    res.json({ user, token });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Ocorreu um erro ao fazer login." });
  }
});

const PORT = process.env.PORT || 3333;
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando lindamente na porta ${PORT}`);
});