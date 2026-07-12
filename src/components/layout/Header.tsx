'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Bell, Search, Menu, X, Database, Radio } from 'lucide-react';
import { useApp } from '@/context/AppContext';
import { Badge } from '../ui/Badge';
import { NAV_ITEMS } from '@/config/nav';
import { IncidentCard } from '../common/IncidentCard';

export function Header() {
  const pathname = usePathname();
  const { platformMode, incidents, resolveActiveIncident } = useApp();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);

  const activeIncidents = incidents.filter(i => i.status === 'Active');

  return (
    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-slate-800/80 bg-slate-950/80 px-6 backdrop-blur-md lg:pl-70">
      {/* Mobile logo/menu trigger */}
      <div className="flex items-center gap-3 lg:hidden">
        <button
          onClick={() => setMobileMenuOpen(true)}
          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors cursor-pointer"
          aria-label="Open navigation menu"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-500" aria-hidden="true">
            <Radio className="h-4 w-4 text-white animate-pulse" />
          </div>
          <span className="text-sm font-bold text-slate-100">SKN</span>
        </div>
      </div>

      {/* Search Bar (Desktop) */}
      <div className="relative hidden w-96 lg:block">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" aria-hidden="true" />
        <input
          type="search"
          placeholder="Search stadiums, playbooks, matches..."
          aria-label="Search the platform"
          className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-2 pl-9 pr-4 text-xs text-slate-200 outline-none placeholder-slate-500 focus:border-indigo-500/50 focus:bg-slate-900 transition-all duration-200"
        />
      </div>

      {/* Header Actions */}
      <div className="flex items-center gap-4">
        {/* Mode Tag */}
        <div className="flex items-center gap-2">
          {platformMode === 'LIVE' ? (
            <Badge variant="success" className="gap-1 px-2.5 py-1 text-[10px] font-medium border-emerald-500/35">
              <Database className="h-3 w-3 text-emerald-400" aria-hidden="true" /> Live Mode
            </Badge>
          ) : (
            <Badge variant="warning" className="gap-1 px-2.5 py-1 text-[10px] font-medium border-amber-500/35">
              <Database className="h-3 w-3 text-amber-400 animate-pulse" aria-hidden="true" /> Sandbox Mode
            </Badge>
          )}
        </div>

        {/* Notifications Panel */}
        <div className="relative">
          <button
            onClick={() => setNotifOpen(!notifOpen)}
            className="relative rounded-xl border border-slate-800 bg-slate-900/40 p-2 text-slate-400 hover:bg-slate-800/80 hover:text-slate-100 transition-all duration-200 cursor-pointer"
            aria-label={`Notifications — ${activeIncidents.length} active alert${activeIncidents.length !== 1 ? 's' : ''}`}
            aria-expanded={notifOpen}
            aria-haspopup="true"
          >
            <Bell className="h-4 w-4" aria-hidden="true" />
            {activeIncidents.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-rose-600 text-[9px] font-bold text-white animate-pulse" aria-hidden="true">
                {activeIncidents.length}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {notifOpen && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setNotifOpen(false)} aria-hidden="true" />
              <div
                className="absolute right-0 mt-3 w-80 z-20 rounded-2xl border border-slate-800 bg-slate-900/95 p-4 shadow-xl backdrop-blur-md animate-slide-in"
                role="dialog"
                aria-label="Active incident alerts"
              >
                <div className="flex items-center justify-between border-b border-slate-800 pb-2 mb-3">
                  <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider">Active Alerts</h4>
                  <span className="text-[10px] text-slate-500">{activeIncidents.length} alert{activeIncidents.length !== 1 ? 's' : ''}</span>
                </div>
                <div className="flex flex-col gap-2 max-h-60 overflow-y-auto" role="list">
                  {activeIncidents.length === 0 ? (
                    <div className="text-center py-6 text-xs text-slate-500">
                      No active operational incidents
                    </div>
                  ) : (
                    activeIncidents.map(inc => (
                      <div key={inc.id} role="listitem">
                        <IncidentCard
                          incident={inc}
                          onResolve={(id) => { resolveActiveIncident(id); }}
                          compact
                        />
                      </div>
                    ))
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-slate-950/90 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} aria-hidden="true" />
          <nav className="absolute bottom-0 left-0 top-0 w-72 bg-slate-900 border-r border-slate-800 p-6 flex flex-col justify-between" aria-label="Mobile navigation">
            <div className="flex flex-col gap-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-indigo-600 to-purple-500" aria-hidden="true">
                    <Radio className="h-4 w-4 text-white" />
                  </div>
                  <span className="text-sm font-bold text-slate-100">SKN</span>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
                  aria-label="Close navigation menu"
                >
                  <X className="h-5 w-5" aria-hidden="true" />
                </button>
              </div>

              <div className="flex flex-col gap-1.5">
                {NAV_ITEMS.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.name}
                      href={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      aria-current={isActive ? 'page' : undefined}
                      className={`flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                          : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-100'
                      }`}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            <div className="border-t border-slate-800/80 pt-4 flex flex-col gap-2 text-center">
              <p className="text-[10px] text-slate-500 font-medium">Stadium Knowledge Network</p>
              <p className="text-[9px] text-indigo-400">&quot;Every Match Makes Every Stadium Smarter.&quot;</p>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
