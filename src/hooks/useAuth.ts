import { useCallback } from 'react';
import { UserProfile, UserRole } from '@/types';
import { authService } from '@/lib/firebase';

interface UseAuthParams {
  setUser: (user: UserProfile | null) => void;
}

interface UseAuthReturn {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  signUp: (email: string, password: string, displayName: string, role: UserRole) => Promise<boolean>;
}

/**
 * Encapsulates authentication operations (login, logout, signUp).
 * Accepts a `setUser` setter so it can update the parent context's state.
 */
export function useAuth({ setUser }: UseAuthParams): UseAuthReturn {
  const login = useCallback(async (email: string, password: string): Promise<boolean> => {
    try {
      const profile = await authService.login(email, password);
      if (profile) {
        setUser(profile);
        return true;
      }
      return false;
    } catch {
      console.error('Login failed');
      return false;
    }
  }, [setUser]);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, [setUser]);

  const signUp = useCallback(
    async (email: string, password: string, displayName: string, role: UserRole): Promise<boolean> => {
      try {
        const profile = await authService.signUp(email, password, displayName, role);
        if (profile) {
          setUser(profile);
          return true;
        }
        return false;
    } catch {
      console.error('SignUp failed');
      return false;
    }
    },
    [setUser],
  );

  return { login, logout, signUp };
}
