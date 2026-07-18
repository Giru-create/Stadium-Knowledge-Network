'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import type { UserRole } from '@/types';

/** Shape of the auth form state exposed by the hook. */
export interface AuthFormState {
  isLogin: boolean;
  email: string;
  password: string;
  displayName: string;
  role: UserRole;
  authError: string;
  authLoading: boolean;
}

/** Handlers for interacting with the auth form. */
export interface AuthFormActions {
  setIsLogin: (value: boolean) => void;
  setEmail: (value: string) => void;
  setPassword: (value: string) => void;
  setDisplayName: (value: string) => void;
  setRole: (value: UserRole) => void;
  handleSubmit: (e: React.FormEvent) => Promise<void>;
  toggleMode: () => void;
}

/**
 * Encapsulates all authentication form state and logic for the landing page.
 *
 * - Redirects already-authenticated users to `/dashboard`.
 * - Manages login vs. signup mode with full validation.
 * - Returns memoised handlers to avoid unnecessary child re-renders.
 */
export function useAuthForm(): AuthFormState & AuthFormActions {
  const { user, login, signUp } = useApp();
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('controller@skn.fifa.com');
  const [password, setPassword] = useState('password123');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<UserRole>('Admin');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  useEffect(() => {
    if (user) router.push('/dashboard');
  }, [user, router]);

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      setAuthError('');
      setAuthLoading(true);

      try {
        if (isLogin) {
          const success = await login(email, password);
          if (success) {
            router.push('/dashboard');
          } else {
            setAuthError('Authentication failed. Check credentials.');
          }
        } else {
          if (!displayName) {
            setAuthError('Display Name is required');
            setAuthLoading(false);
            return;
          }
          const success = await signUp(email, password, displayName, role);
          if (success) {
            router.push('/dashboard');
          } else {
            setAuthError('Registration failed. Email might be taken.');
          }
        }
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Authentication error';
        setAuthError(message);
      } finally {
        setAuthLoading(false);
      }
    },
    [isLogin, email, password, displayName, role, login, signUp, router],
  );

  const toggleMode = useCallback(() => {
    setIsLogin((prev) => !prev);
    setAuthError('');
  }, []);

  return {
    isLogin,
    email,
    password,
    displayName,
    role,
    authError,
    authLoading,
    setIsLogin,
    setEmail,
    setPassword,
    setDisplayName,
    setRole,
    handleSubmit,
    toggleMode,
  };
}
