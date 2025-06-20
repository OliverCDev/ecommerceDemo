import React, { createContext, useContext, useState, useEffect } from 'react';
import { toast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    setLoading(true);
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        setUser(session.user);
        await loadUserProfile(session.user.id);
      }
      setLoading(false);
    };

    getSession();

    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setLoading(true); 
        setUser(session?.user ?? null);
        if (session?.user) {
          await loadUserProfile(session.user.id);
          if (event === 'SIGNED_IN' || event === 'USER_UPDATED') { 
            const { data: existingProfile, error: fetchError } = await supabase
              .from('profiles')
              .select('id')
              .eq('id', session.user.id)
              .single();

            if (fetchError && fetchError.code !== 'PGRST116') { 
              console.error('Error fetching profile:', fetchError);
            }
            
            if (!existingProfile) {
              const userMetadata = session.user.user_metadata;
              const emailSplit = session.user.email ? session.user.email.split('@')[0] : 'Usuario Anónimo';
              const fullName = userMetadata?.full_name || userMetadata?.name || emailSplit;
              
              const { error: insertError } = await supabase.from('profiles').insert({
                id: session.user.id,
                email: session.user.email,
                full_name: fullName,
                role: 'client' 
              });
              if (insertError) {
                console.error('Error creating profile on SIGNED_IN/USER_UPDATED:', insertError);
              } else {
                 await loadUserProfile(session.user.id); 
              }
            }
          }
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  const loadUserProfile = async (userId) => {
    if (!userId) {
      setProfile(null);
      return;
    }
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();
      
      if (error && error.code !== 'PGRST116') { 
        console.error('Error loading user profile:', error);
        setProfile(null); 
        return;
      }
      setProfile(data);
    } catch (error) {
      console.error('Catch block error loading user profile:', error);
      setProfile(null);
    }
  };

  const login = async (email, password) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      toast({
        title: "¡Bienvenido de nuevo!",
        description: `Has iniciado sesión correctamente.`, 
      });
      // User and profile will be set by onAuthStateChange
      // setLoading(false) will be handled by onAuthStateChange
      return true;
    } catch (error) {
      toast({
        title: "Error de autenticación",
        description: error.message || "Email o contraseña incorrectos",
        variant: "destructive"
      });
      setLoading(false);
      return false;
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: {
            full_name: userData.name,
          }
        }
      });
      if (error) throw error;
      
      toast({
        title: "¡Registro exitoso!",
        description: `Bienvenido ${userData.name}. Revisa tu email para confirmar tu cuenta.`,
      });
      // Profile creation and setLoading(false) handled by onAuthStateChange
      return true;
    } catch (error) {
      toast({
        title: "Error de registro",
        description: error.message || "No se pudo registrar el usuario",
        variant: "destructive"
      });
      setLoading(false);
      return false;
    }
  };
  
  const createAdmin = async (adminData) => {
    setLoading(true);
    try {
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: adminData.email,
        password: adminData.password,
         options: {
          data: {
            full_name: adminData.name,
          }
        }
      });

      if (authError) throw authError;

      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .upsert({ 
            id: authData.user.id, 
            email: adminData.email,
            full_name: adminData.name,
            role: 'admin' 
          }, { onConflict: 'id' });

        if (profileError) {
          console.error("Error creating/updating admin profile:", profileError);
          throw profileError;
        }
        
        toast({
          title: "¡Administrador creado!",
          description: `El administrador ${adminData.name} ha sido creado. Pídele que confirme su email.`,
        });
      } else {
        throw new Error("No se pudo crear el usuario de autenticación.");
      }
      setLoading(false);
      return true;
    } catch (error) {
      toast({
        title: "Error al crear administrador",
        description: error.message || "No se pudo crear el administrador.",
        variant: "destructive"
      });
      setLoading(false);
      return false;
    }
  };


  const getAllUsers = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.from('profiles').select('*');
      if (error) throw error;
      setLoading(false);
      return data;
    } catch (error) {
      toast({
        title: "Error",
        description: "No se pudieron cargar los usuarios.",
        variant: "destructive"
      });
      setLoading(false);
      return [];
    }
  };

  const deleteUser = async (userId) => {
    setLoading(true);
    try {
      const { error: profileError } = await supabase.from('profiles').delete().eq('id', userId);
      if (profileError) {
        console.error("Error deleting profile:", profileError);
      }

      toast({
        title: "Eliminación de Perfil Iniciada",
        description: "El perfil del usuario ha sido eliminado. La eliminación del usuario de autenticación requiere una función de administrador.",
        variant: "default",
        duration: 7000,
      });
      if (user && user.id === userId) { 
        await logout(); 
      }
    } catch (error) {
      toast({
        title: "Error al eliminar usuario",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      toast({
        title: "Sesión cerrada",
        description: "Has cerrado sesión correctamente",
      });
    } catch (error) {
      toast({
        title: "Error al cerrar sesión",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      // onAuthStateChange will set user/profile to null and setLoading to false
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true); 
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: window.location.origin 
        }
      });
      if (error) {
        toast({
          title: "Error de Autenticación con Google",
          description: error.message || "No se pudo iniciar sesión con Google.",
          variant: "destructive",
        });
        setLoading(false); 
        throw error; 
      }
    } catch (errorCaught) {
      if (!errorCaught.message.includes("No se pudo iniciar sesión con Google")) {
          toast({
            title: "Error Inesperado",
            description: "Ocurrió un error durante el inicio de sesión con Google.",
            variant: "destructive",
          });
      }
      setLoading(false); 
    }
  };

  const value = {
    user,
    profile,
    login,
    register,
    createAdmin,
    getAllUsers,
    deleteUser,
    logout,
    loginWithGoogle,
    loading,
    isAuthenticated: !!user,
    isAdmin: profile?.role === 'admin',
    isClient: profile?.role === 'client'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};