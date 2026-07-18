import React from 'react';
import { Stadium } from '@/types';
import { SlidersHorizontal } from 'lucide-react';
import { SortKey, CATEGORY_OPTIONS } from '@/utils/library';

interface FilterPanelProps {
  selectedType: string;
  onTypeChange: (v: string) => void;
  selectedStadium: string;
  onStadiumChange: (v: string) => void;
  sortBy: SortKey;
  onSortChange: (v: SortKey) => void;
  stadiums: Stadium[];
}

/** Dropdown filters for category, stadium, and sort order. */
export function FilterPanel({
  selectedType,
  onTypeChange,
  selectedStadium,
  onStadiumChange,
  sortBy,
  onSortChange,
  stadiums,
}: FilterPanelProps) {
  return (
    <div className="flex flex-wrap gap-3 w-full md:w-auto items-center justify-end">
      <div className="flex items-center gap-2">
        <SlidersHorizontal className="h-4 w-4 text-slate-500" aria-hidden="true" />
        <label htmlFor="library-category" className="sr-only">Category filter</label>
        <select
          id="library-category"
          value={selectedType}
          onChange={(e) => onTypeChange(e.target.value)}
          className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 outline-none cursor-pointer"
        >
          {CATEGORY_OPTIONS.map((cat) => (
            <option key={cat} value={cat}>
              {cat === 'All' ? 'All Categories' : cat}
            </option>
          ))}
        </select>
      </div>

      <label htmlFor="library-stadium" className="sr-only">Stadium filter</label>
      <select
        id="library-stadium"
        value={selectedStadium}
        onChange={(e) => onStadiumChange(e.target.value)}
        className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 outline-none cursor-pointer"
      >
        <option value="All">All Stadiums</option>
        {stadiums.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>

      <label htmlFor="library-sort" className="sr-only">Sort order</label>
      <select
        id="library-sort"
        value={sortBy}
        onChange={(e) => onSortChange(e.target.value as SortKey)}
        className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 outline-none cursor-pointer"
      >
        <option value="date">Newest Date</option>
        <option value="confidence">High Confidence</option>
      </select>
    </div>
  );
}
