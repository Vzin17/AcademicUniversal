import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient'; // Garanta que o caminho está correto

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // Seus estados estão perfeitos. Mudei apenas o setUser inicial para null.
  const [user, setUser] = useState(null); 
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // --- Início da lógica para buscar o perfil ---

    // <-- ADICIONADO: Função para buscar dados da tabela 'perfis'
    const fetchUserProfile = async (authUser) => {
      // Se não houver usuário na autenticação, não faz nada.
      if (!authUser) return;

      const { data: profileData, error } = await supabase
        .from('perfis') // Nome da nossa tabela de perfis
        .select('*') // Pega todas as colunas (nome_completo, funcao, ra)
        .eq('id', authUser.id) // Onde o 'id' da tabela perfis seja igual ao id do usuário logado
        .single(); // Esperamos apenas um resultado

      if (error) {
        console.error("Erro ao buscar perfil do usuário:", error);
      }
      
      // <-- ADICIONADO: Juntamos os dados da autenticação com os dados do perfil
      // O resultado é um super-objeto 'user' com tudo o que precisamos
      setUser({
        ...authUser,     // Mantém id, email, etc. da autenticação
        ...profileData,  // Adiciona nome_completo, funcao, ra, etc. do perfil
      });
    };

    // --- Fim da lógica para buscar o perfil ---

    // Pega a sessão atual do Supabase quando o app carrega
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      // <-- ALTERADO: Agora chamamos nossa nova função para buscar o perfil
      fetchUserProfile(session?.user); 
      setLoading(false);
    });

    // Ouve por qualquer mudança no estado de autenticação (login, logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        setSession(session);
        // <-- ALTERADO: Também chamamos a função aqui quando o usuário loga
        if (session?.user) {
          fetchUserProfile(session.user);
        } else {
          // Se o usuário deslogar, limpamos o estado do usuário
          setUser(null);
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // O resto do seu código está perfeito e não precisa de alterações.
  const value = {
    session,
    user, // Agora este 'user' contém os dados do perfil!
    logout: () => supabase.auth.signOut(),
  };

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