import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient.js'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
 const [user, setUser] = useState(null); 
 const [session, setSession] = useState(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
   const fetchUserProfile = async (authUser) => {
     if (!authUser) return;
     
     // Busca o perfil do usuário logado
     const { data: profile, error } = await supabase
       .from('perfis')
       .select('*, area:areas(id, name)')
       .eq('id', authUser.id)
       .single();

     if (error) {
       console.error("Erro ao buscar perfil:", error);
       setUser(authUser); // Se falhar, usa os dados básicos da autenticação
     } else {
       // Combina os dados da autenticação com os do perfil
       setUser({ ...authUser, ...profile });
     }
   };

   supabase.auth.getSession().then(({ data: { session } }) => {
     setSession(session);
     fetchUserProfile(session?.user); 
     setLoading(false);
   });

   const { data: { subscription } } = supabase.auth.onAuthStateChange(
     (_event, session) => {
       setSession(session);
       if (session?.user) {
         fetchUserProfile(session.user);
       } else {
         setUser(null);
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
  return null; 
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