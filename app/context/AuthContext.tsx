'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  login: (userData: User, token: string) => void;
  logout: () => Promise<void>;
}

const defaultAuthContext: AuthContextType = {
  user: null,
  loading: true,
  isAuthenticated: false,
  login: () => {},
  logout: async () => {},
};

const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// Helper to get cookie value
const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop()?.split(';').shift() || null;
  return null;
};

// Helper to clear cookies
const clearCookies = () => {
  if (typeof document === 'undefined') return;
  document.cookie = 'access_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
  document.cookie = 'user_data=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = getCookie('access_token');
      const userDataCookie = getCookie('user_data');

      if (!token || !userDataCookie) {
        setLoading(false);
        return;
      }

      try {
        // Parse user data from cookie
        const userData = JSON.parse(decodeURIComponent(userDataCookie));
        
        // Optionally verify token with backend
        const response = await fetch(`${API_URL}/api/user/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });

        if (response.ok) {
          const profileData = await response.json();
          setUser(profileData);
        } else {
          // Token invalid, use cached user data for now or clear
          setUser(userData);
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        // Use cached user data if API fails
        try {
          const userData = JSON.parse(decodeURIComponent(userDataCookie));
          setUser(userData);
        } catch {
          clearCookies();
          setUser(null);
        }
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = useCallback((userData: User, token: string) => {
    // Store token in cookie
    const expirationDays = 7;
    const expires = new Date();
    expires.setDate(expires.getDate() + expirationDays);
    
    document.cookie = `access_token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    document.cookie = `user_data=${encodeURIComponent(JSON.stringify(userData))}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    
    setUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      const token = getCookie('access_token');
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        });
      }
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearCookies();
      setUser(null);
    }
  }, []);

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
