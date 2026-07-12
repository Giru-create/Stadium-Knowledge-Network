'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { 
  Zap, 
  PlayCircle
} from 'lucide-react';
import Link from 'next/link';
import { RecommendationSkeleton } from '@/components/ui/Skeleton';

export default function RecommendationsPage() {
  const { recommendations, updateActionItemStatus, loading } = useApp();

  if (loading) {
    return (
      <DashboardLayout>
        <div className="flex flex-col gap-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col gap-2">
              <div className="h-8 w-64 bg-slate-800/40 rounded-lg animate-pulse" />
              <div className="h-4 w-96 bg-slate-800/20 rounded-lg animate-pulse" />
            </div>
            <div className="h-10 w-48 bg-slate-800/20 rounded-lg animate-pulse" />
          </div>

          <div className="flex flex-col gap-6">
            <RecommendationSkeleton />
            <RecommendationSkeleton />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h2 className="text-2xl md:text-3xl font-extrabold text-slate-100 tracking-tight">
              AI Recommendations
            </h2>
            <p className="text-sm text-slate-400 mt-1">
              Active Advisory Actions generated to address live match telemetry anomalies.
            </p>
          </div>
          
          <Link href="/simulator">
            <Button variant="primary" className="text-xs">
              <PlayCircle className="mr-2 h-4 w-4" /> Trigger New Events
            </Button>
          </Link>
        </div>

        {/* Live recommendations overview */}
        <div className="flex flex-col gap-6">
          {recommendations.length === 0 ? (
            <Card className="text-center py-20">
              <CardContent className="flex flex-col items-center justify-center gap-4">
                <div className="h-12 w-12 rounded-full bg-indigo-500/10 text-indigo-400 flex items-center justify-center border border-indigo-500/20">
                  <Zap className="h-6 w-6 animate-pulse" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-200">No Recommendations Active</h3>
                  <p className="text-xs text-slate-500 max-w-sm mt-1 mx-auto leading-relaxed">
                    Stadium sensors report green status. Run match simulations in the <b>Event Simulator</b> to trigger alerts.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {recommendations.map(rec => {
                const totalActions = rec.actions.length;
                const completedActions = rec.actions.filter(a => a.status === 'Implemented').length;
                const progressPercentage = Math.round((completedActions / totalActions) * 100);

                return (
                  <Card key={rec.id} className="relative overflow-hidden">
                    <div className="absolute top-0 left-0 bottom-0 w-1.5 bg-gradient-to-b from-indigo-500 to-purple-500" />
                    
                    <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
                      <div className="flex flex-col gap-1.5">
                        <div className="flex items-center gap-2">
                          <CardTitle className="text-base">{rec.title}</CardTitle>
                          <Badge variant="info">{rec.eventType}</Badge>
                        </div>
                        <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider">
                          Triggered by Incident: <span className="text-rose-400 font-bold">{rec.description}</span>
                        </span>
                      </div>
                      <div className="flex items-center gap-3">
                        {/* Progress Meter */}
                        <div className="flex flex-col items-end gap-1">
                          <span className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider">Progress: {progressPercentage}%</span>
                          <div className="h-1.5 w-24 bg-slate-800 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-indigo-500 to-emerald-500 transition-all duration-500" 
                              style={{ width: `${progressPercentage}%` }}
                            />
                          </div>
                        </div>
                      </div>
                    </CardHeader>

                    <CardContent className="flex flex-col gap-5 mt-2">
                      {/* AI Rationale */}
                      <div className="rounded-xl bg-slate-950/40 border border-slate-800 p-4 text-xs text-slate-400">
                        <p className="font-bold text-[10px] text-indigo-400 uppercase tracking-wider mb-1">AI Recommendation Context & Match Rationale:</p>
                        {rec.explanation}
                      </div>

                      {/* Detailed Checklist */}
                      <div className="flex flex-col gap-3">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Action Step SOP Statuses</span>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                          {rec.actions.map((act, idx) => (
                            <div key={idx} className="rounded-xl border border-slate-800 bg-slate-950/20 px-4 py-3 flex items-center justify-between text-xs gap-3">
                              <span className="text-slate-300 font-medium leading-relaxed">{act.action}</span>
                              <div className="flex items-center gap-2 shrink-0">
                                {act.status === 'Implemented' ? (
                                  <Badge variant="success">Completed</Badge>
                                ) : (
                                  <>
                                    <Button 
                                      variant="secondary" 
                                      size="sm"
                                      onClick={() => updateActionItemStatus(rec.id, idx, 'In Progress')}
                                      disabled={act.status === 'In Progress'}
                                    >
                                      {act.status === 'In Progress' ? 'In Progress' : 'Start'}
                                    </Button>
                                    <Button 
                                      variant="emerald" 
                                      size="sm"
                                      onClick={() => updateActionItemStatus(rec.id, idx, 'Implemented')}
                                    >
                                      Finish
                                    </Button>
                                  </>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
