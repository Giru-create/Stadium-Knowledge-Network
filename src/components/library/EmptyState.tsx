import React from 'react';

/** Shown when filtered playbooks list is empty. */
export function EmptyState() {
  return (
    <div className="text-center py-20 border border-dashed border-slate-800 rounded-3xl bg-slate-900/10">
      <p className="text-sm text-slate-500">No playbooks match your search parameters.</p>
    </div>
  );
}
