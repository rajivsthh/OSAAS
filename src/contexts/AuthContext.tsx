import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface User {
  name: string;
  email: string;
  avatar?: string;
  uid?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Lazily initialize Firebase auth listeners only if API key is provided.
    // This prevents runtime errors (and a white screen) when Firebase isn't configured.
    const apiKey = import.meta.env.VITE_FIREBASE_API_KEY as string | undefined;
    if (!apiKey || apiKey.startsWith("YOUR_") || apiKey === "") {
      // No valid Firebase config - skip initializing auth and mark loading false.
      setLoading(false);
      return;
    }

    let unsubscribe: (() => void) | null = null;
    let mounted = true;

    (async () => {
      try {
        const firebaseModule = await import("@/lib/firebase");
        const auth = firebaseModule.auth;
        const firebaseAuth = await import("firebase/auth");

        unsubscribe = firebaseAuth.onAuthStateChanged(auth, (firebaseUser: any | null) => {
          if (!mounted) return;
          if (firebaseUser) {
            setIsAuthenticated(true);
            setUser({
              name: firebaseUser.displayName || firebaseUser.email?.split("@")[0] || "User",
              email: firebaseUser.email || "",
              avatar: firebaseUser.photoURL || undefined,
              uid: firebaseUser.uid,
            });
          } else {
            setIsAuthenticated(false);
            setUser(null);
          }
          setLoading(false);
        });
      } catch (e) {
        // If anything goes wrong (invalid API key, network, etc), don't crash the app.
        setLoading(false);
      }
    })();

    return () => {
      mounted = false;
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const logout = async () => {
    try {
      const apiKey = import.meta.env.VITE_FIREBASE_API_KEY as string | undefined;
      if (!apiKey || apiKey.startsWith("YOUR_") || apiKey === "") {
        setIsAuthenticated(false);
        setUser(null);
        return;
      }
      const firebaseModule = await import("@/lib/firebase");
      const firebaseAuth = await import("firebase/auth");
      await firebaseAuth.signOut(firebaseModule.auth);
      setIsAuthenticated(false);
      setUser(null);
    } catch (e) {
      setIsAuthenticated(false);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
