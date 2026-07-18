'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import type { AuthFormState, AuthFormActions } from '@/hooks/useAuthForm';

type AuthPanelProps = AuthFormState & AuthFormActions;

const INPUT_CLASS =
  'w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-xs text-slate-200 outline-none focus:border-indigo-500/50 focus:bg-slate-950 transition-all duration-200';

const ROLE_OPTIONS = [
  { value: 'Admin', label: 'System Administrator' },
  { value: 'Stadium Manager', label: 'Stadium Manager' },
  { value: 'Operator', label: 'Control Room Operator' },
] as const;

/**
 * Glassmorphic authentication card supporting both login and signup modes.
 *
 * Receives all form state and handlers from `useAuthForm` via props,
 * keeping this component purely presentational.
 */
export function AuthPanel({
  isLogin,
  email,
  password,
  displayName,
  role,
  authError,
  authLoading,
  setEmail,
  setPassword,
  setDisplayName,
  setRole,
  handleSubmit,
  toggleMode,
}: AuthPanelProps) {
  return (
    <div className="lg:col-span-5 flex justify-center">
      <Card className="w-full max-w-md p-8 relative overflow-hidden bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl">
        <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-600/5 blur-3xl rounded-full" />
        <div className="absolute bottom-0 left-0 h-40 w-40 bg-purple-600/5 blur-3xl rounded-full" />

        <div className="flex flex-col gap-6 relative z-10">
          {/* Heading */}
          <div className="flex flex-col gap-2">
            <h3 className="text-2xl font-bold text-slate-100">
              {isLogin ? 'Control Center Access' : 'Create Operator Account'}
            </h3>
            <p className="text-xs text-slate-500">
              {isLogin
                ? 'Enter operator credentials to access matching networks.'
                : 'Register profile to participate in global simulation.'}
            </p>
          </div>

          {/* Error banner */}
          {authError && (
            <div role="alert" className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
              ⚠️ {authError}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {!isLogin && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="auth-display-name" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Display Name
                </label>
                <input
                  id="auth-display-name"
                  type="text"
                  required
                  placeholder="e.g. Chief Ops Officer"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className={INPUT_CLASS}
                />
              </div>
            )}

            <div className="flex flex-col gap-1.5">
              <label htmlFor="auth-email" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Email Address
              </label>
              <input
                id="auth-email"
                type="email"
                required
                placeholder="operator@skn.fifa.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={INPUT_CLASS}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="auth-password" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Security Password
              </label>
              <input
                id="auth-password"
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className={INPUT_CLASS}
              />
            </div>

            {!isLogin && (
              <div className="flex flex-col gap-1.5">
                <label htmlFor="auth-role" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                  Operator Role
                </label>
                <select
                  id="auth-role"
                  value={role}
                  onChange={(e) => setRole(e.target.value as AuthPanelProps['role'])}
                  className={INPUT_CLASS}
                >
                  {ROLE_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
              </div>
            )}

            <Button
              type="submit"
              variant="primary"
              className="py-3 mt-2"
              loading={authLoading}
            >
              {isLogin ? 'Log In to Dashboard' : 'Initialize Account'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </form>

          {/* Toggle */}
          <div className="text-center pt-2 border-t border-slate-800/40">
            <button
              onClick={toggleMode}
              className="text-xs text-slate-400 hover:text-indigo-400 transition-colors font-medium cursor-pointer"
            >
              {isLogin
                ? "Don't have an operator profile? Create one"
                : 'Already registered? Access Control'}
            </button>
          </div>

          {/* Demo hint */}
          <div className="rounded-xl bg-slate-950/30 border border-slate-800/30 p-3 text-[10px] text-slate-500 text-center leading-normal">
            💡 <b>Sandbox Tip:</b> Pressing <b>Log In</b> will log in
            automatically using default demo details if database keys are blank.
          </div>
        </div>
      </Card>
    </div>
  );
}
