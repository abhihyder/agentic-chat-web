'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { useUserProfile, useLogout } from '../actions/auth';

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
export const getCookie = (name: string): string | null => {
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

// Helper to get cached user from cookie
const getCachedUser = (): User | null => {
  const userDataCookie = getCookie('user_data');
  if (!userDataCookie) return null;
  try {
    return JSON.parse(decodeURIComponent(userDataCookie));
  } catch {
    return null;
  }
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [hasToken, setHasToken] = useState(false);
  const [cachedUser, setCachedUser] = useState<User | null>(null);

  // Check for token on mount
  useEffect(() => {
    const token = getCookie('access_token');
    setHasToken(!!token);
    if (token) {
      setCachedUser(getCachedUser());
    }
  }, []);

  // Fetch user profile using react-query
  const { 
    data: profileData, 
    isLoading: profileLoading,
    isError,
  } = useUserProfile(hasToken);

  // Logout mutation
  const logoutMutation = useLogout();

  // Use profile data if available, otherwise fall back to cached user
  const user = profileData || cachedUser;
  const loading = hasToken && profileLoading && !cachedUser;

  const login = useCallback((userData: User, token: string) => {
    const expirationDays = 7;
    const expires = new Date();
    expires.setDate(expires.getDate() + expirationDays);
    
    document.cookie = `access_token=${token}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    document.cookie = `user_data=${encodeURIComponent(JSON.stringify(userData))}; expires=${expires.toUTCString()}; path=/; SameSite=Lax`;
    
    setHasToken(true);
    setCachedUser(userData);
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutMutation.mutateAsync();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      clearCookies();
      setHasToken(false);
      setCachedUser(null);
    }
  }, [logoutMutation]);

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
