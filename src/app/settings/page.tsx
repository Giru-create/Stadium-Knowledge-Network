'use client';

import React, { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { 
  Database, 
  Key, 
  RefreshCw, 
  User, 
  CheckCircle,
  Copy,
  Terminal
} from 'lucide-react';

export default function SettingsPage() {
  const { user } = useApp();

  const [geminiKey, setGeminiKey] = useState(
    typeof window !== 'undefined' ? localStorage.getItem('skn_custom_gemini_key') || '' : ''
  );
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [clearing, setClearing] = useState(false);
  const [copiedEnv, setCopiedEnv] = useState(false);

  const handleSaveKeys = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== 'undefined') {
      localStorage.setItem('skn_custom_gemini_key', geminiKey);
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const handleResetLocalStorage = () => {
    setClearing(true);
    if (typeof window !== 'undefined') {
      // Clear specific stores
      localStorage.removeItem('skn_events');
      localStorage.removeItem('skn_recommendations');
      localStorage.removeItem('skn_stadiums');
      localStorage.removeItem('skn_matches');
      localStorage.removeItem('skn_playbooks');
      
      // Reload page to re-seed default values
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    }
  };

  const envTemplate = `NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id

NEXT_PUBLIC_GEMINI_API_KEY=your_gemini_api_key`;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(envTemplate);
    setCopiedEnv(true);
    setTimeout(() => setCopiedEnv(false), 3000);
  };

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
            Settings Panel
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            Platform configurations, authentication integrations, and simulator cache options.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Keys and Credentials (7 columns) */}
          <div className="lg:col-span-8 flex flex-col gap-8">
            {/* API Config Box */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="h-4.5 w-4.5 text-indigo-400" /> API Credentials
                </CardTitle>
                <CardDescription>
                  Configure your Gemini API key to enable live AI Playbook generation.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSaveKeys} className="flex flex-col gap-4">
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Gemini API Key</label>
                    <input
                      type="password"
                      placeholder="Paste your Gemini AI API key (AI_KEY_...)"
                      value={geminiKey}
                      onChange={(e) => setGeminiKey(e.target.value)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-slate-200 outline-none focus:border-indigo-500/50"
                    />
                    <p className="text-[10px] text-slate-500 leading-normal">
                      The key is saved locally in your browser cache to authenticate fetch requests directly with Google Language APIs.
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-2">
                    {saveSuccess && (
                      <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                        <CheckCircle className="h-4 w-4" /> Keys updated.
                      </span>
                    )}
                    <Button type="submit" variant="primary" className="ml-auto">
                      Save API Credentials
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Environment Template */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="flex items-center gap-2">
                      <Terminal className="h-4.5 w-4.5 text-indigo-400" /> Environment Variables Setup
                    </CardTitle>
                    <CardDescription>
                      Copy these properties into a <code>.env.local</code> file in your project directory to trigger Live Firebase modes.
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={copyToClipboard}>
                    {copiedEnv ? 'Copied!' : <Copy className="h-4 w-4" />}
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <pre className="rounded-xl bg-slate-950 p-4 font-mono text-[10px] text-slate-400 overflow-x-auto leading-relaxed border border-slate-900 select-text">
                  {envTemplate}
                </pre>
              </CardContent>
            </Card>
          </div>

          {/* Right Column: Database reset & account details (5 columns) */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            {/* Account Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-4.5 w-4.5 text-indigo-400" /> Account Profile
                </CardTitle>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <div className="rounded-xl border border-slate-800 bg-slate-950/40 p-4 flex flex-col gap-2.5">
                  <div className="flex flex-col">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Display Name</span>
                    <span className="text-xs font-semibold text-slate-200">{user?.displayName}</span>
                  </div>
                  <div className="flex flex-col border-t border-slate-900 pt-2">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Email Address</span>
                    <span className="text-xs font-semibold text-slate-200">{user?.email}</span>
                  </div>
                  <div className="flex flex-col border-t border-slate-900 pt-2">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Security Access Level</span>
                    <span className="text-xs font-semibold text-indigo-400 flex items-center gap-1.5 mt-0.5">
                      🛡️ {user?.role}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* DB reset panel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Database className="h-4.5 w-4.5 text-rose-500" /> Sandbox Cache
                </CardTitle>
                <CardDescription>
                  Reset simulator incident history and flush mock database back to defaults.
                </CardDescription>
              </CardHeader>
              <CardContent className="flex flex-col gap-4">
                <p className="text-[11px] text-slate-400 leading-relaxed bg-rose-500/5 p-3 rounded-xl border border-rose-500/10">
                  ⚠️ <b>Warning:</b> This clears all simulated weather updates, parking jam logs, active AI recommendations, and restores original seed playbooks.
                </p>

                <Button 
                  variant="rose" 
                  onClick={handleResetLocalStorage} 
                  loading={clearing}
                  className="w-full flex items-center justify-center gap-2 py-2.5"
                >
                  <RefreshCw className={`h-4 w-4 ${clearing ? 'animate-spin' : ''}`} />
                  Clear Simulator Databases
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
