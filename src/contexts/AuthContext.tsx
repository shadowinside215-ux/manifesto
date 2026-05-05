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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<User | null>(null);
  const [isAdmin, setIsAdmin] = React.useState<boolean>(() => {
    return localStorage.getItem("is_admin") === "true";
  });
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
      // Ensure isAdmin is true if logged in and localStorage flag is set
      if (currentUser && localStorage.getItem("is_admin") === "true") {
        setIsAdmin(true);
      } else if (!currentUser) {
        setIsAdmin(false);
        localStorage.removeItem("is_admin");
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    if (username === "admin" && password === "admin2006") {
      try {
        await signInAnonymously(auth);
        setIsAdmin(true);
        localStorage.setItem("is_admin", "true");
        return true;
      } catch (error) {
        console.error("Anonymous sign in failed:", error);
        return false;
      }
    }
    return false;
  };

  const logout = async () => {
    try {
      await signOut(auth);
      setIsAdmin(false);
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
