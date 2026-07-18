import React from 'react';
import { Playbook } from '@/types';
import { ResourceCard } from './ResourceCard';

interface ResourceGridProps {
  playbooks: Playbook[];
  onInspect: (pb: Playbook) => void;
}

/** Responsive grid of playbook cards. */
export function ResourceGrid({ playbooks, onInspect }: ResourceGridProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {playbooks.map((pb) => (
        <ResourceCard key={pb.id} playbook={pb} onInspect={onInspect} />
      ))}
    </div>
  );
}
