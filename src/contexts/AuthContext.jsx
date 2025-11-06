import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient.js'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); 
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    
    const fetchUserProfile = async (authUser) => {
      if (!authUser) {
        setUser(null);
        setLoading(false);
        return;
      }
  
      // Busca o perfil do usuário na tabela 'perfis'
      const { data: profile, error } = await supabase
        .from('perfis')
        .select('*, area:area_id(name)') // Seu select original
        .eq('id', authUser.id)
        .single();
  
      if (error) {
        console.error("Erro ao buscar perfil:", error);
        setUser(authUser); // Em último caso, usa dados básicos se o perfil falhar
      } else {
        // Junta os dados do Auth (email) com os dados do Perfil (funcao, nome, etc.)
        setUser({ ...authUser, ...profile });
      }
      setLoading(false);
    };
  
    // 1. Verifica a sessão existente na carga inicial
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      fetchUserProfile(session?.user); // Busca perfil na carga inicial
    });
  
    // 2. Ouve as mudanças de estado (login/logout)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setSession(session);
      
        fetchUserProfile(session?.user);
      }
    );
  
    return () => {
      subscription.unsubscribe();
    };
  }, []); // Roda apenas uma vez

  const value = {
    session,
    user, 
    loading, 
    logout: () => supabase.auth.signOut(),
  };

  // Otimização: Não renderiza o 'children' se estiver 'loading'
  // Mostra 'children' apenas quando 'loading' for 'false'
  return (
   <AuthContext.Provider value={value}>
    {children} 
   </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};