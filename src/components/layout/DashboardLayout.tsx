'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useApp } from '@/context/AppContext';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { Loader2 } from 'lucide-react';

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const { user, loading } = useApp();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) {
      router.push('/');
    }
  }, [user, loading, router]);

  if (loading) {
    return (
      <div className="flex h-screen w-screen flex-col items-center justify-center bg-slate-950 gap-4">
        <div className="relative flex items-center justify-center">
          <div className="absolute h-16 w-16 rounded-full border-4 border-indigo-500/10 border-t-indigo-500 animate-spin" />
          <Loader2 className="h-8 w-8 text-indigo-400 animate-pulse" />
        </div>
        <p className="text-sm font-semibold tracking-wide text-indigo-400 uppercase animate-pulse">
          Loading Stadium Knowledge Network
        </p>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col">
      {/* Navigation Sidebar */}
      <Sidebar />

      {/* Main Page Area */}
      <div className="flex flex-col flex-1 lg:pl-64">
        {/* Global Dashboard Header */}
        <Header />
        
        {/* Sub-Page Content Container */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto animate-in fade-in duration-300">
          {children}
        </main>
      </div>
    </div>
  );
}
