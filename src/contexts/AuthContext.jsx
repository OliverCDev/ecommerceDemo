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
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem('auth_user');
    return stored ? JSON.parse(stored) : null;
  });

  const [profile, setProfile] = useState(() => {
    const stored = localStorage.getItem('auth_profile');
    return stored ? JSON.parse(stored) : null;
  });

  // 👇 LO NUEVO
  const [initializing, setInitializing] = useState(true); // solo para la PRIMER CARGA
  const [loading, setLoading] = useState(false); // solo para login/register/logout

  // ======= CARGA INICIAL DE SESIÓN =======
  useEffect(() => {
    const initialize = async () => {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        setUser(session.user);
        localStorage.setItem("auth_user", JSON.stringify(session.user));
        await loadUserProfile(session.user.id);
      } else {
        setUser(null);
        setProfile(null);
        localStorage.removeItem("auth_user");
        localStorage.removeItem("auth_profile");
      }

      setInitializing(false); // 👈 Solo aquí
    };

    initialize();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (session?.user) {
          setUser(session.user);
          localStorage.setItem("auth_user", JSON.stringify(session.user));
          await loadUserProfile(session.user.id);
        } else {
          setUser(null);
          setProfile(null);
          localStorage.removeItem("auth_user");
          localStorage.removeItem("auth_profile");
        }
      }
    );

    return () => listener.subscription.unsubscribe();
  }, []);

  // ======= CARGA DEL PERFIL =======
  const loadUserProfile = async (userId) => {
    if (!userId) {
      setProfile(null);
      return;
    }
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single();

    if (!error && data) {
      setProfile(data);
      localStorage.setItem("auth_profile", JSON.stringify(data));
    }
  };

  // ======= LOGIN =======
  const login = async (email, password) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      toast({ title: "¡Bienvenido!", description: "Sesión iniciada correctamente." });
      return true;
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ======= REGISTRO =======
  const register = async (userData) => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signUp({
        email: userData.email,
        password: userData.password,
        options: {
          data: { full_name: userData.name }
        }
      });

      if (error) throw error;

      toast({
        title: "Registro Exitoso",
        description: "Revisa tu correo para confirmar tu cuenta."
      });

      return true;
    } catch (err) {
      toast({ title: "Error", description: err.message, variant: "destructive" });
      return false;
    } finally {
      setLoading(false);
    }
  };

  // ======= LOGIN CON GOOGLE =======
  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: { redirectTo: window.location.origin }
      });

      if (error) throw error;
    } catch (err) {
      console.error(err);
      toast({ title: "Error con Google", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  // ======= LOGOUT =======
  const logout = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;

      localStorage.removeItem("auth_user");
      localStorage.removeItem("auth_profile");
    } catch (err) {
      toast({ title: "Error al cerrar sesión", description: err.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    profile,
    initializing, // 👈 nuevo
    loading,      // 👈 solo para botones
    isAuthenticated: !!user,
    isAdmin: profile?.role === "admin",
    isClient: profile?.role === "client",
    login,
    register,
    loginWithGoogle,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};