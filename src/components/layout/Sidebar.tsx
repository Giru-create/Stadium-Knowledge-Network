'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, ShieldCheck, Radio, Tv } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Badge } from '../ui/Badge';
import { NAV_ITEMS } from '@/config/nav';

export function Sidebar() {
  const pathname = usePathname();
  const { user, activeMatch, incidents, logout } = useApp();

  const activeIncidentsCount = incidents.filter(i => i.status === 'Active').length;

  return (
    <aside className="fixed bottom-0 left-0 top-0 z-30 hidden w-64 border-r border-slate-800/80 bg-slate-950/80 p-6 backdrop-blur-md lg:flex lg:flex-col justify-between">
      <div className="flex flex-col gap-8">
        {/* Logo Branding */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-500 shadow-md shadow-indigo-500/20">
            <Radio className="h-5 w-5 text-white animate-pulse" aria-hidden="true" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-slate-100">SKN</h1>
            <p className="text-[10px] text-indigo-400 font-medium tracking-wider uppercase">Stadium Knowledge</p>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex flex-col gap-1.5" aria-label="Main navigation">
          <p className="px-3 text-[10px] font-semibold text-slate-500 uppercase tracking-wider mb-2">Operations</p>
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`group flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                    : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-100 border border-transparent'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-transform group-hover:scale-110 ${isActive ? 'text-indigo-400' : 'text-slate-400'}`}
                    aria-hidden="true"
                  />
                  <span>{item.name}</span>
                </div>
                {item.name === 'Event Simulator' && activeIncidentsCount > 0 ? (
                  <Badge
                    variant="danger"
                    className="animate-pulse-alert px-1.5 py-0.5"
                    aria-label={`${activeIncidentsCount} active incidents`}
                  >
                    {activeIncidentsCount}
                  </Badge>
                ) : null}
              </Link>
            );
          })}
        </nav>
      </div>

      <div className="flex flex-col gap-6">
        {/* Active Match Telemetry Box */}
        {activeMatch && (
          <div className="rounded-xl border border-slate-800/60 bg-slate-900/40 p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-semibold uppercase text-slate-500 tracking-wide flex items-center gap-1.5">
                <Tv className="h-3 w-3 text-red-500 animate-pulse" aria-hidden="true" /> Live Match
              </span>
              <Badge variant="success" className="text-[9px] px-1 py-0">{activeMatch.status}</Badge>
            </div>
            <div className="text-xs font-semibold text-slate-200 flex items-center justify-between">
              <span className="truncate max-w-[80px]">{activeMatch.teams.home}</span>
              <span className="text-indigo-400 text-sm font-bold bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-500/15">
                {activeMatch.currentScore ? `${activeMatch.currentScore.home} - ${activeMatch.currentScore.away}` : 'VS'}
              </span>
              <span className="truncate max-w-[80px] text-right">{activeMatch.teams.away}</span>
            </div>
            <div className="mt-2 text-[10px] text-slate-500 truncate">
              📍 {activeMatch.stadiumName}
            </div>
          </div>
        )}

        {/* User Card */}
        {user && (
          <div className="flex items-center justify-between border-t border-slate-800/80 pt-4">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-800 border border-slate-700" aria-hidden="true">
                <ShieldCheck className="h-5 w-5 text-indigo-400" />
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="text-xs font-semibold text-slate-200 truncate">{user.displayName}</span>
                <span className="text-[10px] text-slate-500 truncate">{user.role}</span>
              </div>
            </div>
            <button
              onClick={logout}
              className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors cursor-pointer"
              aria-label="Log out"
              title="Logout"
            >
              <LogOut className="h-4 w-4" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}
