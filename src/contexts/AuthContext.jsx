import { createContext, useState, useEffect, useContext } from 'react';
import { supabase } from '../supabaseClient.js'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
 const [user, setUser] = useState(null); 
 const [session, setSession] = useState(null);
 const [loading, setLoading] = useState(true);

 useEffect(() => {
   // ### INÍCIO DA CORREÇÃO ###
   const fetchUserProfile = async (authUser) => {
     if (!authUser) return;
     console.log("[AuthContext] PASSO 1: A buscar perfil...");

     // 1. Busca o perfil (sem tentar o join)
     const { data: profileData, error: profileError } = await supabase
       .from('perfis')
       .select('*') // Só o perfil, por enquanto
       .eq('id', authUser.id)
       .single();

     if (profileError) {
       console.error("[AuthContext] PASSO 2: FALHA AO BUSCAR PERFIL!", profileError);
       setUser(authUser); // Define o usuário só com os dados básicos
       return; // Sai da função
     }

     console.log("[AuthContext] PASSO 2: SUCESSO AO BUSCAR PERFIL!", profileData);

     // 2. Se o perfil tem uma especialidade_id, busca o nome
     if (profileData && profileData.especialidade_id) {
       console.log(`[AuthContext] PASSO 3: Buscando nome da especialidade com ID: ${profileData.especialidade_id}`);
       
       const { data: areaData, error: areaError } = await supabase
         .from('areas')
         .select('name')
         .eq('id', profileData.especialidade_id)
         .single();

       if (areaError) {
         console.error("[AuthContext] PASSO 4: FALHA AO BUSCAR NOME DA ÁREA", areaError);
         // Define o usuário sem a área, mas com o resto
         setUser({
           ...authUser,
           ...profileData,
           areas: null // Falhou, então fica null
         });
       } else {
         console.log("[AuthContext] PASSO 4: SUCESSO AO BUSCAR NOME DA ÁREA", areaData);
         // SUCESSO! Combina tudo
         setUser({
           ...authUser,
           ...profileData,
           areas: areaData // areaData aqui será { name: "Fisioterapia" }
         });
       }
     } else {
       // O usuário não tem especialidade_id, define o usuário sem a área
       setUser({
         ...authUser,
         ...profileData,
       });
     }
   };
   // ### FIM DA CORREÇÃO ###


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