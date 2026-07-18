import React from 'react';
import { Card, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Award, Clock, ChevronRight } from 'lucide-react';
import { Playbook } from '@/types';

interface ResourceCardProps {
  playbook: Playbook;
  onInspect: (pb: Playbook) => void;
}

/** Single playbook card displaying title, confidence, problem summary, and inspect action. */
export function ResourceCard({ playbook, onInspect }: ResourceCardProps) {
  return (
    <Card className="flex flex-col justify-between h-[320px] hover:scale-[1.01]">
      <div className="flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <Badge variant="primary" className="text-[9px]">
            {playbook.eventType}
          </Badge>
          <Badge variant="success" className="gap-1 text-[9px]">
            <Award className="h-3 w-3" /> {playbook.confidenceScore}% Confidence
          </Badge>
        </div>

        <div className="flex flex-col gap-1 mt-1">
          <h4 className="text-sm font-bold text-slate-200 line-clamp-2 min-h-[40px]">
            {playbook.title}
          </h4>
          <span className="text-[10px] text-slate-500">📍 {playbook.stadiumName}</span>
        </div>

        <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mt-2">
          {playbook.problem}
        </p>
      </div>

      <CardFooter className="px-0 pb-0 mt-4 border-t border-slate-800/40 pt-3 flex items-center justify-between">
        <span className="text-[10px] text-slate-500 flex items-center gap-1">
          <Clock className="h-3 w-3" /> {new Date(playbook.createdAt).toLocaleDateString()}
        </span>
        <button
          onClick={() => onInspect(playbook)}
          className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 transition-colors cursor-pointer"
        >
          Inspect SOP <ChevronRight className="h-3.5 w-3.5" />
        </button>
      </CardFooter>
    </Card>
  );
}
