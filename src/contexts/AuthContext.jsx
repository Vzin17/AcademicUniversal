// src/contexts/AuthContext.jsx - VERSÃO CORRIGIDA COM SUPABASE

import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient'; // Garanta que o caminho está correto

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  // Este useEffect é o nosso "vigia". Ele roda uma vez e fica ouvindo.
  useEffect(() => {
    // Pega a sessão atual do Supabase quando o app carrega
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null); // Se tiver sessão, define o usuário
      setLoading(false);
    });

    // Ouve por qualquer mudança no estado de autenticação (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        setUser(session?.user ?? null);
      }
    );

    // Limpa o "ouvinte" quando o componente não for mais usado
    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // O valor que o nosso contexto vai fornecer para o resto do app
  const value = {
    session,
    user,
    // Função de logout para conveniência
    logout: () => supabase.auth.signOut(),
  };

  // Enquanto estiver carregando a sessão, não mostra nada para evitar "piscadas" na tela
  if (loading) {
    return null; 
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Hook personalizado para usar o contexto mais facilmente
export const useAuth = () => {
  return useContext(AuthContext);
};