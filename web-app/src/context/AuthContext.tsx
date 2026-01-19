import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { googleLogout } from '@react-oauth/google';

interface User {
  email: string;
  name: string;
  picture: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (token: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check local storage for existing session
    const storedToken = localStorage.getItem('google_access_token');
    if (storedToken) {
      // Validate token or just try to fetch user
      fetchUser(storedToken).catch(() => {
        // If fetch fails (token expired), clear storage
        logout();
      });
    } else {
      setIsLoading(false);
    }
  }, []);

  const fetchUser = async (token: string) => {
    setIsLoading(true);
    try {
      const response = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
        headers: { Authorization: `Bearer ${token}` },
      });
      
      if (!response.ok) throw new Error('Failed to fetch user');
      
      const userData = await response.json();
      setUser(userData);
      setAccessToken(token);
      localStorage.setItem('google_access_token', token);
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (token: string) => {
    await fetchUser(token);
  };

  const logout = () => {
    googleLogout();
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('google_access_token');
    setIsLoading(false);
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
