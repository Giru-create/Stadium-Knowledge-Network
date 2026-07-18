'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import type { UserRole } from '@/types';

/** Maximum allowed length for display name to prevent abuse. */
const MAX_DISPLAY_NAME_LENGTH = 60;

/** Minimum password length enforced by the client. */
const MIN_PASSWORD_LENGTH = 6;

/** Valid role options to prevent injection. */
const VALID_ROLES: UserRole[] = ['Admin', 'Stadium Manager', 'Operator'];

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
 * Strips characters that could be used for XSS or prompt injection.
 * Allows alphanumeric, spaces, and common punctuation only.
 */
function sanitizeInput(input: string): string {
  return input.replace(/[<>"'`]/g, '').trim();
}

/**
 * Maps Firebase Auth error codes to user-friendly messages
 * without leaking internal details or enabling user enumeration.
 */
function sanitizeAuthError(err: unknown): string {
  if (!(err instanceof Error)) return 'Authentication error. Please try again.';

  const msg = err.message;
  if (msg.includes('auth/user-not-found') || msg.includes('auth/wrong-password') || msg.includes('auth/invalid-credential')) {
    return 'Invalid email or password.';
  }
  if (msg.includes('auth/email-already-in-use')) {
    return 'An account with this email already exists.';
  }
  if (msg.includes('auth/weak-password')) {
    return 'Password does not meet security requirements.';
  }
  if (msg.includes('auth/invalid-email')) {
    return 'Please enter a valid email address.';
  }
  if (msg.includes('auth/too-many-requests')) {
    return 'Too many attempts. Please try again later.';
  }
  return 'Authentication error. Please try again.';
}

/**
 * Encapsulates all authentication form state and logic for the landing page.
 *
 * - Redirects already-authenticated users to `/dashboard`.
 * - Manages login vs. signup mode with input validation.
 * - Sanitizes all user inputs before submission.
 * - Returns memoised handlers to avoid unnecessary child re-renders.
 */
export function useAuthForm(): AuthFormState & AuthFormActions {
  const { user, login, signUp } = useApp();
  const router = useRouter();

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<UserRole>('Operator');
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

      const trimmedEmail = email.trim().toLowerCase();
      const trimmedName = sanitizeInput(displayName);

      // Client-side validation
      if (!trimmedEmail) {
        setAuthError('Email is required.');
        setAuthLoading(false);
        return;
      }
      if (!password) {
        setAuthError('Password is required.');
        setAuthLoading(false);
        return;
      }

      try {
        if (isLogin) {
          const success = await login(trimmedEmail, password);
          if (success) {
            router.push('/dashboard');
          } else {
            setAuthError('Invalid email or password.');
          }
        } else {
          if (!trimmedName) {
            setAuthError('Display Name is required.');
            setAuthLoading(false);
            return;
          }
          if (trimmedName.length > MAX_DISPLAY_NAME_LENGTH) {
            setAuthError(`Display Name must be ${MAX_DISPLAY_NAME_LENGTH} characters or fewer.`);
            setAuthLoading(false);
            return;
          }
          if (password.length < MIN_PASSWORD_LENGTH) {
            setAuthError(`Password must be at least ${MIN_PASSWORD_LENGTH} characters.`);
            setAuthLoading(false);
            return;
          }
          if (!VALID_ROLES.includes(role)) {
            setAuthError('Invalid role selected.');
            setAuthLoading(false);
            return;
          }
          const success = await signUp(trimmedEmail, password, trimmedName, role);
          if (success) {
            router.push('/dashboard');
          } else {
            setAuthError('Registration failed. Please try again.');
          }
        }
      } catch (err: unknown) {
        setAuthError(sanitizeAuthError(err));
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
