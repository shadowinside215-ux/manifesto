import * as React from "react";
import { auth, signInAnonymously, signOut, onAuthStateChanged, User } from "@/lib/firebase";

interface AuthContextType {
  user: User | null;
  isAdmin: boolean;
  loading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export const HIDE_ADMIN_FEATURES = true;

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [isAdminState, setIsAdminState] = React.useState<boolean>(() => {
    return localStorage.getItem("is_admin") === "true";
  });
  const [loading, setLoading] = React.useState(true);

  // isAdmin is only true if HIDE_ADMIN_FEATURES is false, we have a user AND the flag is set
  const isAdmin = !HIDE_ADMIN_FEATURES && !!user && isAdminState;

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      
      if (!currentUser) {
        setIsAdminState(false);
        localStorage.removeItem("is_admin");
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    const cleanUsername = (username || "").trim();
    const cleanPassword = (password || "").replace(/\s+/g, ""); // Remove all space characters in case of space typos
    
    if (cleanUsername === "admin" && cleanPassword === "admin2006") {
      try {
        await signInAnonymously(auth);
        setIsAdminState(true);
        localStorage.setItem("is_admin", "true");
        return true;
      } catch (error) {
        console.error("Anonymous sign in failed:", error);
        alert("Login failed: " + (error instanceof Error ? error.message : "Unknown error"));
        return false;
      }
    }
    return false;
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setIsAdminState(false);
      localStorage.removeItem("is_admin");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <AuthContext.Provider value={{ 
      user,
      isAdmin, 
      loading, 
      login, 
      logout 
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
