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
      console.log("[AuthContext] PASSO 1: A buscar perfil...");

   const { data: profileData, error } = await supabase
    .from('perfis') 

    .select('*, areas!perfis_especialidade_id_fkey(name)') 
    .eq('id', authUser.id) 
    .single(); 


   if (error) {
    console.error("[AuthContext] PASSO 2: FALHA AO BUSCAR PERFIL!", error);
   } else {
    console.log("[AuthContext] PASSO 2: SUCESSO AO BUSCAR PERFIL!", profileData);
   }
   
   setUser({
    ...authUser,
    ...profileData, 
   });
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