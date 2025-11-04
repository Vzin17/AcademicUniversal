import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient.js'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
 const [user, setUser] = useState(null); 
 const [session, setSession] = useState(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
   // Função para buscar o perfil do usuário
   const fetchUserProfile = async (authUser) => {
     if (!authUser) {
       setUser(null);
       return;
     }

     const { data: profile, error } = await supabase
       .from('perfis')
       .select('*, area:area_id(name)')
       .eq('id', authUser.id)
       .single();

     if (error) {
       console.error("Erro ao buscar perfil:", error);
       setUser(authUser); // Usa dados básicos se o perfil falhar
     } else if (profile) {
       const finalUser = { ...authUser, ...profile };
       if (profile.area) {
         finalUser.area = profile.area;
       }
       setUser(finalUser);
     } else {
       setUser(authUser);
     }
   };

   // Verifica a sessão inicial
   supabase.auth.getSession().then(({ data: { session } }) => {
     setSession(session);
     fetchUserProfile(session?.user).finally(() => setLoading(false));
   });

   const { data: { subscription } } = supabase.auth.onAuthStateChange(
     async (_event, session) => {
       setSession(session);
        const authUser = session?.user;

        if (authUser) {
          // Busca o perfil do usuário logado
          const { data: profile, error } = await supabase
            .from('perfis')
            .select('*, area:area_id(name)')
            .eq('id', authUser.id)
            .single();

          if (error) {
            console.error("Erro ao buscar perfil:", error);
            setUser(authUser); // Se falhar, usa os dados básicos da autenticação
          } else if (profile) {
            // Combina os dados da autenticação com os do perfil
            const finalUser = { ...authUser, ...profile };
            if (profile.area) {
              finalUser.area = profile.area;
            }
            setUser(finalUser);
          } else {
            setUser(authUser);
          }
       } else {
          // Se não há sessão, limpa o usuário
          setUser(null);
          setLoading(false); // Garante que o carregamento termine se não houver usuário
        }
     }
   );

   return () => {
     subscription.unsubscribe();
   };
 }, []);

 const value = {
  session,
  user, 
  loading, 
  logout: () => supabase.auth.signOut(),
 };

 if (loading) {
 
  return <AuthContext.Provider value={{ loading: true, user: null, session: null, logout: () => supabase.auth.signOut() }}>{children}</AuthContext.Provider>;
 }

 return (
  <AuthContext.Provider value={value}>
   {children}
  </AuthContext.Provider>
 );
};

export const useAuth = () => {
 return useContext(AuthContext);
};