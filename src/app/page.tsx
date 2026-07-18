'use client';

import React from 'react';
import { Radio } from 'lucide-react';
import { useAuthForm } from '@/hooks/useAuthForm';
import { HeroSection } from '@/components/home/HeroSection';
import { FeaturesSection } from '@/components/home/FeaturesSection';
import { AuthPanel } from '@/components/home/AuthPanel';
import { Footer } from '@/components/home/Footer';

/**
 * Landing / login page — responsible only for page-level layout and composition.
 * Auth logic lives in `useAuthForm`; each visual section is a self-contained component.
 */
export default function LandingPage() {
  const auth = useAuthForm();

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-950/40 via-slate-950 to-slate-950 text-slate-100 flex flex-col justify-between overflow-hidden">
      {/* Navbar */}
      <header className="w-full max-w-7xl mx-auto px-6 h-20 flex items-center justify-between border-b border-slate-900/50">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 shadow-md shadow-indigo-500/20">
            <Radio className="h-5 w-5 text-white animate-pulse" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-100">SKN</h1>
            <p className="text-[9px] text-indigo-400 font-semibold tracking-widest uppercase">
              Stadium Knowledge Network
            </p>
          </div>
        </div>
        <div className="text-xs text-slate-500 hidden md:block">
          FIFA World Cup Operations Platform • 2026
        </div>
      </header>

      {/* Hero + Auth */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-6 py-12 md:py-20 grid grid-cols-1 lg:grid-cols-12 gap-12 md:gap-16 items-center">
        <div className="lg:col-span-7 flex flex-col gap-8">
          <HeroSection />
          <FeaturesSection />
        </div>
        <AuthPanel {...auth} />
      </main>

      <Footer />
    </div>
  );
}
