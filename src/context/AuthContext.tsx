import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useDispatch, useSelector } from "react-redux";
import { setAuth, clearAuth, setLoading as setAuthLoading } from "@/store/slices/authSlice";
import { RootState } from "@/store";
import { toast } from "sonner";

export interface Address {
  id: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  isDefault: boolean;
}

export interface PaymentCard {
  id: string;
  type: string;
  last4: string;
  expiry: string;
}

export interface Occasion {
  id: string;
  name: string;
  date: string;
  type: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: "user" | "admin";
  avatar?: string;
  addresses: Address[];
  payments: PaymentCard[];
  occasions: Occasion[];
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<any>;
  register: (name: string, email: string, password: string) => Promise<any>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => void;
  // Temporary: these will be moved to RTK Query mutations in the next step
  addAddress: (address: Omit<Address, "id">) => void;
  removeAddress: (id: string) => void;
  addPayment: (card: Omit<PaymentCard, "id">) => void;
  removePayment: (id: string) => void;
  addOccasion: (occasion: Omit<Occasion, "id">) => void;
  removeOccasion: (id: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const { user: reduxUser, profile: reduxProfile, role: reduxRole, loading: isLoading } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    // Initial Session Check
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        handleAuthChange(session);
      } else {
        dispatch(clearAuth());
      }
    });

    // Listen for Auth Changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        handleAuthChange(session);
      } else {
        dispatch(clearAuth());
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  const handleAuthChange = async (session: any) => {
    const { user } = session;
    
    // Fetch Profile & Role
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('user_id', user.id)
      .single();

    const { data: roles } = await supabase
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id);

    const isAdmin = roles?.some(r => r.role === 'admin');

    dispatch(setAuth({
      user: { id: user.id, email: user.email },
      profile: profile || null,
      role: isAdmin ? 'admin' : 'user'
    }));
  };

  const login = async (email: string, password: string) => {
    dispatch(setAuthLoading(true));
    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;

      // Immediately fetch role so the UI can navigate
      const { data: roles } = await supabase
        .from('user_roles')
        .select('role')
        .eq('user_id', data.user.id);

      const isAdmin = roles?.some(r => r.role === 'admin');
      
      toast.success("Welcome back!");
      return { ...data.user, role: isAdmin ? 'admin' : 'user' };
    } catch (error: any) {
      toast.error(error.message || "Failed to login");
      throw error;
    } finally {
      dispatch(setAuthLoading(false));
    }
  };

  const register = async (name: string, email: string, password: string) => {
    dispatch(setAuthLoading(true));
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: name }
      }
    });
    if (error) {
      toast.error(error.message);
      dispatch(setAuthLoading(false));
      throw error;
    }
    toast.success("Check your email to confirm registration!");
    return data;
  };

  const logout = async () => {
    await supabase.auth.signOut();
    dispatch(clearAuth());
    toast.info("Logged out successfully");
  };

  const updateProfile = (data: Partial<User>) => {
    // This will be replaced by an RTK Query mutation
    console.log("Updating profile...", data);
  };

  // Adapter for existing components while we transition to RTK Query
  const contextValue: AuthContextType = {
    user: reduxUser ? {
      ...reduxUser,
      name: reduxProfile?.display_name || reduxUser.email.split('@')[0],
      role: reduxRole as "user" | "admin",
      avatar: reduxProfile?.avatar_url || undefined,
      addresses: [], // To be populated via RTK Query
      payments: [],
      occasions: []
    } : null,
    isLoading,
    login,
    register,
    logout,
    updateProfile,
    addAddress: () => {},
    removeAddress: () => {},
    addPayment: () => {},
    removePayment: () => {},
    addOccasion: () => {},
    removeOccasion: () => {}
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
};
