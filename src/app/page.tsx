'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Shield, Sparkles, Cpu, Library, ArrowRight, Radio } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { UserRole } from '@/types';

export default function LandingPage() {
  const { user, login, signUp } = useApp();
  const router = useRouter();

  // If user is already logged in, bypass landing page
  useEffect(() => {
    if (user) {
      router.push('/dashboard');
    }
  }, [user, router]);

  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('controller@skn.fifa.com');
  const [password, setPassword] = useState('password123');
  const [displayName, setDisplayName] = useState('');
  const [role, setRole] = useState<UserRole>('Admin');
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  const handleAuthSubmit = async (e: React.FormEvent) => {
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
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-slate-950 to-slate-950 text-slate-100 flex flex-col justify-between overflow-x-hidden">
      {/* Navbar Header */}
      <header className="w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 shadow-md shadow-indigo-500/20">
            <Radio className="h-5 w-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-100">SKN</h1>
            <p className="text-[9px] text-indigo-400 font-semibold tracking-widest uppercase">Stadium Knowledge Network</p>
          </div>
        </div>
        <div className="text-xs text-slate-500 hidden md:block">
          FIFA World Cup Operations Platform • 2026
        </div>
      </header>

      {/* Main Hero & Auth Section */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center">
        {/* Left: Headline & Features */}
        <div className="lg:col-span-7 flex flex-col gap-8">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 text-indigo-300 border border-indigo-500/25 px-3 py-1 rounded-full text-xs font-semibold w-fit">
            <Sparkles className="h-3.5 w-3.5" />
            <span>Next-Gen Stadium Intelligence</span>
          </div>

          <div className="flex flex-col gap-4">
            <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
              Every Match Makes <br />
              <span className="text-gradient-primary">Every Stadium Smarter.</span>
            </h2>
            <p className="text-slate-400 text-base md:text-lg max-w-xl leading-relaxed">
              SKN turns real-time stadium operational incidents into AI playbooks. 
              Future host stadiums query weather, transport, and crowd models to proactively prevent bottlenecks before they occur.
            </p>
          </div>

          {/* Interactive Statistics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 border-t border-slate-900 pt-8 max-w-lg">
            <div>
              <div className="text-3xl font-black text-slate-100">12</div>
              <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider mt-1">Host Stadiums</div>
            </div>
            <div>
              <div className="text-3xl font-black text-slate-100">94.2%</div>
              <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider mt-1">AI Confidence</div>
            </div>
            <div>
              <div className="text-3xl font-black text-slate-100">420+</div>
              <div className="text-xs text-slate-500 uppercase font-semibold tracking-wider mt-1">SOPs Prevented</div>
            </div>
          </div>

          {/* Key pillars */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-2">
            <div className="flex gap-3 items-start">
              <div className="p-2 rounded-lg bg-indigo-500/5 border border-indigo-500/10 text-indigo-400">
                <Cpu className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Incident Simulation</h4>
                <p className="text-[11px] text-slate-500 leading-normal mt-0.5">Test heavy rain or gate shutdowns and watch recommended playbooks execute.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="p-2 rounded-lg bg-emerald-500/5 border border-emerald-500/10 text-emerald-400">
                <Library className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Knowledge Library</h4>
                <p className="text-[11px] text-slate-500 leading-normal mt-0.5">Filter, search, and sort structured incident responses with full telemetry details.</p>
              </div>
            </div>
            <div className="flex gap-3 items-start">
              <div className="p-2 rounded-lg bg-purple-500/5 border border-purple-500/10 text-purple-400">
                <Shield className="h-4.5 w-4.5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-200">Interactive Map</h4>
                <p className="text-[11px] text-slate-500 leading-normal mt-0.5">Track live crowd densities, food court waits, and parking flow patterns visually.</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right: Glassmorphic Auth Panel */}
        <div className="lg:col-span-5 flex justify-center">
          <Card className="w-full max-w-md p-8 relative overflow-hidden bg-slate-900/60 border border-slate-800/80 backdrop-blur-xl rounded-3xl shadow-2xl">
            <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-600/5 blur-3xl rounded-full" />
            <div className="absolute bottom-0 left-0 h-40 w-40 bg-purple-600/5 blur-3xl rounded-full" />

            <div className="flex flex-col gap-6 relative z-10">
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

              {authError && (
                <div className="p-3.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium">
                  ⚠️ {authError}
                </div>
              )}

              <form onSubmit={handleAuthSubmit} className="flex flex-col gap-4">
                {!isLogin && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Display Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Chief Ops Officer"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-xs text-slate-200 outline-none focus:border-indigo-500/50 focus:bg-slate-950 transition-all duration-200"
                    />
                  </div>
                )}

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="operator@skn.fifa.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-xs text-slate-200 outline-none focus:border-indigo-500/50 focus:bg-slate-950 transition-all duration-200"
                  />
                </div>

                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Security Password</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-xs text-slate-200 outline-none focus:border-indigo-500/50 focus:bg-slate-950 transition-all duration-200"
                  />
                </div>

                {!isLogin && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Operator Role</label>
                    <select
                      value={role}
                      onChange={(e) => setRole(e.target.value as UserRole)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950/60 px-4 py-3 text-xs text-slate-200 outline-none focus:border-indigo-500/50 focus:bg-slate-950 transition-all duration-200 cursor-pointer"
                    >
                      <option value="Admin">System Administrator</option>
                      <option value="Stadium Manager">Stadium Manager</option>
                      <option value="Operator">Control Room Operator</option>
                    </select>
                  </div>
                )}

                <Button type="submit" variant="primary" className="py-3 mt-2" loading={authLoading}>
                  {isLogin ? 'Log In to Dashboard' : 'Initialize Account'}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </form>

              {/* Toggle switch */}
              <div className="text-center pt-2 border-t border-slate-800/40">
                <button
                  onClick={() => {
                    setIsLogin(!isLogin);
                    setAuthError('');
                  }}
                  className="text-xs text-slate-400 hover:text-indigo-400 transition-colors font-medium cursor-pointer"
                >
                  {isLogin ? "Don't have an operator profile? Create one" : 'Already registered? Access Control'}
                </button>
              </div>

              {/* Demo hints */}
              <div className="rounded-xl bg-slate-950/30 border border-slate-800/30 p-3 text-[10px] text-slate-500 text-center leading-normal">
                💡 <b>Sandbox Tip:</b> Pressing <b>Log In</b> will log in automatically using default demo details if database keys are blank.
              </div>
            </div>
          </Card>
        </div>
      </main>

      {/* Footer copyright */}
      <footer className="w-full max-w-7xl mx-auto px-6 h-16 flex items-center justify-between border-t border-slate-900/50 text-[10px] text-slate-600">
        <div>© 2026 Stadium Knowledge Network. All rights reserved.</div>
        <div className="flex gap-4">
          <span className="hover:text-slate-400 cursor-pointer">Security Policy</span>
          <span className="hover:text-slate-400 cursor-pointer">System Status</span>
        </div>
      </footer>
    </div>
  );
}
