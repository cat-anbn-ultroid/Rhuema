import React, { createContext, useContext, useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

type AppRole = 'patient' | 'clinician' | 'admin';

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  userRole: AppRole | null;
  signUp: (
    email: string,
    password: string,
    fullName: string,
    role: 'patient' | 'clinician'
  ) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<AppRole | null>(null);

  const navigate = useNavigate();

  const fetchUserRole = async (userId: string): Promise<AppRole | null> => {
    const { data, error } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', userId)
      .maybeSingle();

    if (error) {
      console.error('Role lookup failed:', error);
      return null;
    }

    return (data?.role as AppRole) ?? null;
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      try {
        const {
          data: { session: currentSession },
          error,
        } = await supabase.auth.getSession();

        if (error) throw error;

        if (!mounted) return;

        setSession(currentSession);
        setUser(currentSession?.user ?? null);

        if (currentSession?.user) {
          const role = await fetchUserRole(currentSession.user.id);
          if (mounted) setUserRole(role);
        } else {
          setUserRole(null);
        }
      } catch (error) {
        console.error('Auth initialization failed:', error);
      } finally {
        if (mounted) setLoading(false);
      }
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, newSession) => {
      if (!mounted) return;

      setSession(newSession);
      setUser(newSession?.user ?? null);

      if (!newSession?.user) {
        setUserRole(null);
        return;
      }

      // Avoid awaiting Supabase calls inside the auth callback.
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        setLoading(true);

        Promise.resolve().then(async () => {
          const role = await fetchUserRole(newSession.user.id);

          if (mounted) {
            setUserRole(role);
            setLoading(false);
          }
        });
      }
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signUp = async (
    email: string,
    password: string,
    fullName: string,
    role: 'patient' | 'clinician'
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            requested_role: role,
          },
          emailRedirectTo: `${window.location.origin}/auth`,
        },
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error('Account creation did not return a user.');
      }

      // With email confirmation enabled, Supabase may not return a session.
      if (!data.session) {
        toast.success('Account created. Please check your email to verify your account.');
        return;
      }

      // Role/profile records are created by the database trigger.
      const actualRole = await fetchUserRole(data.user.id);
      setUserRole(actualRole);

      if (actualRole === 'patient') {
        toast.success('Account created successfully!');
        navigate('/patient');
      } else {
        toast.success('Account created. Clinician access may require approval.');
        navigate('/');
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      toast.error(error?.message || 'Failed to create account');
      throw error;
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      if (!data.user) {
        throw new Error('Login succeeded but user information is unavailable.');
      }

      const role = await fetchUserRole(data.user.id);

      if (!role) {
        await supabase.auth.signOut();
        throw new Error(
          'Your account role is not configured yet. Please contact support.'
        );
      }

      setUserRole(role);
      toast.success('Welcome back!');

      if (role === 'patient') {
        navigate('/patient');
      } else if (role === 'clinician') {
        navigate('/clinician');
      } else {
        navigate('/');
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      toast.error(error?.message || 'Failed to sign in');
      throw error;
    }
  };

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) throw error;

      setUser(null);
      setSession(null);
      setUserRole(null);

      toast.success('Signed out successfully');
      navigate('/');
    } catch (error: any) {
      console.error('Sign out error:', error);
      toast.error(error?.message || 'Failed to sign out');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        userRole,
        signUp,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
