import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Zap } from 'lucide-react';
import { AIRecommendation } from '@/types';

interface AdvisoryPanelProps {
  recommendations: AIRecommendation[];
  onUpdateAction: (recId: string, actionIndex: number, status: 'In Progress' | 'Implemented') => void;
}

export function AdvisoryPanel({ recommendations, onUpdateAction }: AdvisoryPanelProps) {
  return (
    <Card className="flex flex-col gap-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-4.5 w-4.5 text-indigo-400 animate-pulse" /> Live AI Operations Advisory
            </CardTitle>
            <CardDescription>
              Proactive operational adjustments generated automatically based on sensor inputs.
            </CardDescription>
          </div>
          <Badge variant="primary" className="text-[10px]">Real-time recommendations</Badge>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-4">
        {recommendations.length === 0 ? (
          <div className="text-center py-10 rounded-2xl border border-dashed border-slate-800 bg-slate-900/10">
            <p className="text-xs text-slate-500">
              System stable. Adjust match parameters in the <b>Event Simulator</b> to trigger anomalies and view AI advice.
            </p>
          </div>
        ) : (
          recommendations.slice(0, 3).map(rec => (
            <RecommendationCard key={rec.id} recommendation={rec} onUpdateAction={onUpdateAction} />
          ))
        )}
      </CardContent>
    </Card>
  );
}

interface RecommendationCardProps {
  recommendation: AIRecommendation;
  onUpdateAction: AdvisoryPanelProps['onUpdateAction'];
}

function RecommendationCard({ recommendation: rec, onUpdateAction }: RecommendationCardProps) {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-950/40 p-5 flex flex-col gap-4 relative overflow-hidden">
      <div className="absolute top-0 left-0 bottom-0 w-1 bg-indigo-500" />

      <div className="flex items-start justify-between gap-4">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-200">{rec.title}</span>
            <Badge variant="info" className="text-[8px] px-1 py-0">{rec.eventType}</Badge>
          </div>
          <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider mt-0.5">
            Linked to Playbook: <span className="text-indigo-400 font-bold">{rec.playbookTitle}</span>
          </span>
        </div>
        <span className="text-[10px] text-slate-500">
          {new Date(rec.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </span>
      </div>

      <p className="text-xs text-slate-400 leading-relaxed bg-slate-900/30 p-3 rounded-xl border border-slate-800/40">
        {rec.explanation}
      </p>

      <div className="flex flex-col gap-2.5">
        <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Required Operational Actions</span>
        {rec.actions.map((act, idx) => (
          <div key={idx} className="flex items-center justify-between rounded-xl border border-slate-900 bg-slate-900/20 px-4 py-2.5 text-xs">
            <span className="text-slate-300 font-medium max-w-[70%]">{act.action}</span>
            <div className="flex items-center gap-2">
              {act.status === 'Implemented' ? (
                <Badge variant="success">Implemented</Badge>
              ) : (
                <>
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={() => onUpdateAction(rec.id, idx, 'In Progress')}
                    disabled={act.status === 'In Progress'}
                    className="px-2 py-1 text-[10px]"
                  >
                    {act.status === 'In Progress' ? 'In Progress' : 'Deploy'}
                  </Button>
                  <Button
                    variant="emerald"
                    size="sm"
                    onClick={() => onUpdateAction(rec.id, idx, 'Implemented')}
                    className="px-2 py-1 text-[10px]"
                  >
                    Done
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
