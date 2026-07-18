import React from 'react';
import { Button } from '@/components/ui/Button';
import { Compass } from 'lucide-react';

interface LibraryHeaderProps {
  compareMode: boolean;
  onToggleCompare: () => void;
}

/** Page title and compare-mode toggle. */
export function LibraryHeader({ compareMode, onToggleCompare }: LibraryHeaderProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
          Knowledge Library
        </h2>
        <p className="text-sm text-slate-400 mt-1">
          Historical Operational Playbooks. Every match incident becomes a structured SOP.
        </p>
      </div>

      <Button
        variant={compareMode ? 'emerald' : 'secondary'}
        onClick={onToggleCompare}
        className="text-xs"
      >
        <Compass className="mr-2 h-4 w-4" />
        {compareMode ? 'View All Playbooks' : "Compare Today's Scenario"}
      </Button>
    </div>
  );
}
