import React from 'react';
import { Search } from 'lucide-react';

interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
}

/** Text search input for filtering playbooks by title, problem, or actions. */
export function SearchBar({ value, onChange }: SearchBarProps) {
  return (
    <div className="relative w-full md:w-80">
      <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" aria-hidden="true" />
      <input
        type="text"
        placeholder="Search playbooks..."
        aria-label="Search playbooks"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-2 pl-9 pr-4 text-xs text-slate-200 outline-none focus:border-indigo-500/50"
      />
    </div>
  );
}
