import React from 'react';
import { Modal } from '@/components/ui/Modal';
import { Playbook } from '@/types';

interface PlaybookDetailModalProps {
  playbook: Playbook | null;
  onClose: () => void;
}

/** Full detail modal for inspecting a playbook's SOP fields. */
export function PlaybookDetailModal({ playbook, onClose }: PlaybookDetailModalProps) {
  return (
    <Modal isOpen={playbook !== null} onClose={onClose} title={playbook?.title || 'Playbook Specifications'} size="lg">
      {playbook && (
        <div className="flex flex-col gap-6 select-text">
          {/* Metadata row */}
          <div className="flex flex-wrap gap-4 items-center justify-between border-b border-slate-800/50 pb-4">
            {([
              ['Incident Category', playbook.eventType],
              ['Originating Stadium', playbook.stadiumName],
              ['Confidence Score', `${playbook.confidenceScore}%`],
              ['Created Date', new Date(playbook.createdAt).toLocaleDateString()],
            ] as [string, string][]).map(([label, value]) => (
              <div key={label} className="flex flex-col">
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">{label}</span>
                <span className={`text-sm font-semibold ${label === 'Confidence Score' ? 'text-emerald-400 font-bold' : 'text-slate-300'}`}>
                  {value}
                </span>
              </div>
            ))}
          </div>

          {/* Problem */}
          <div className="flex flex-col gap-2">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Operational Problem</h4>
            <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800/50">
              {playbook.problem}
            </p>
          </div>

          {/* Root Cause + Risk */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Root Cause</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{playbook.rootCause}</p>
            </div>
            <div className="flex flex-col gap-2">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Operational Risk</h4>
              <p className="text-xs text-slate-400 leading-relaxed">{playbook.operationalRisk}</p>
            </div>
          </div>

          {/* Recommended Actions */}
          <div className="flex flex-col gap-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recommended SOP Actions</h4>
            <div className="flex flex-col gap-2">
              {playbook.recommendedActions.map((action, index) => (
                <div
                  key={index}
                  className="flex gap-3 bg-slate-950/30 border border-slate-800/40 rounded-xl px-4 py-3 text-xs text-slate-300 items-start"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400">
                    {index + 1}
                  </span>
                  <p className="leading-relaxed">{action}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Impact + Alt Strategy */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800/50 pt-4">
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Expected Impact</span>
              <p className="text-xs text-slate-400 leading-relaxed">{playbook.expectedImpact}</p>
            </div>
            <div className="flex flex-col gap-1.5">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Alternative Strategy</span>
              <p className="text-xs text-slate-400 leading-relaxed">{playbook.alternativeStrategy}</p>
            </div>
          </div>

          {/* Lessons Learned */}
          <div className="rounded-xl bg-slate-950/40 border border-slate-800/60 p-4 text-xs text-slate-400">
            <p className="font-bold text-[10px] text-slate-500 uppercase tracking-wider mb-1">
              Lessons Learned for Future Matches:
            </p>
            {playbook.lessonsLearned}
          </div>
        </div>
      )}
    </Modal>
  );
}
