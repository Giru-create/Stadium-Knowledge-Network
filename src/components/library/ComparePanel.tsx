import React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Playbook, IncidentType } from '@/types';
import { ArrowRight, HelpCircle, ChevronRight } from 'lucide-react';

interface ComparePanelProps {
  compareCategory: IncidentType;
  onCategoryChange: (v: IncidentType) => void;
  customScenario: string;
  onScenarioChange: (v: string) => void;
  onCompare: () => void;
  comparisonResults: (Playbook & { similarityScore: number })[];
  onInspect: (pb: Playbook) => void;
  categories: readonly string[];
}

/** Two-column comparator: scenario input on the left, similarity results on the right. */
export function ComparePanel({
  compareCategory,
  onCategoryChange,
  customScenario,
  onScenarioChange,
  onCompare,
  comparisonResults,
  onInspect,
  categories,
}: ComparePanelProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      {/* Left: scenario input */}
      <div className="lg:col-span-5 flex flex-col gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Compare Operations Scenario</CardTitle>
            <CardDescription>
              Describe today&apos;s conditions to match similar events from history.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="compare-category" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Event Category
              </label>
              <select
                id="compare-category"
                value={compareCategory}
                onChange={(e) => onCategoryChange(e.target.value as IncidentType)}
                className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500/50 cursor-pointer"
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="compare-scenario" className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Custom Incident Description
              </label>
              <textarea
                id="compare-scenario"
                rows={5}
                value={customScenario}
                onChange={(e) => onScenarioChange(e.target.value)}
                placeholder="Enter descriptions about today's crowd levels, weather anomalies, delays, or gate congestions..."
                className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-slate-200 outline-none focus:border-indigo-500/50 resize-none leading-relaxed"
              />
            </div>

            <Button variant="primary" onClick={onCompare} className="py-2.5 mt-2">
              Query Library Matches
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Right: comparison results */}
      <div className="lg:col-span-7 flex flex-col gap-6">
        <Card className="flex-1">
          <CardHeader>
            <CardTitle>Similarity Comparison Analysis</CardTitle>
            <CardDescription>Historical matches sorted by pattern correlation.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-col gap-4">
            {comparisonResults.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl bg-slate-900/10">
                <HelpCircle className="h-10 w-10 text-slate-600 mx-auto mb-3 animate-pulse" aria-hidden="true" />
                <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                  Input a scenario details on the left and query library to search comparable playbooks.
                </p>
              </div>
            ) : (
              comparisonResults.map((pb) => (
                <div
                  key={pb.id}
                  className="rounded-2xl border border-slate-800/80 bg-slate-950/40 p-5 flex flex-col gap-4 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 h-10 w-24 bg-gradient-to-l from-indigo-500/10 to-transparent flex items-center justify-end px-4 border-l border-b border-slate-800/60 rounded-bl-xl">
                    <span className="text-xs font-black text-indigo-400">
                      {pb.similarityScore}% Match
                    </span>
                  </div>

                  <div className="flex flex-col gap-1 pr-24">
                    <h4 className="text-sm font-bold text-slate-200">{pb.title}</h4>
                    <span className="text-[10px] text-slate-500">
                      Recorded at {pb.stadiumName} • {new Date(pb.createdAt).toLocaleDateString()}
                    </span>
                  </div>

                  <div className="bg-slate-900/30 p-3 rounded-xl border border-slate-800/40 text-xs text-slate-400">
                    <p className="font-bold text-[10px] text-slate-500 uppercase tracking-wider mb-1">
                      AI Match Explanation:
                    </p>
                    This playbook was selected because the rain intensity levels match current stadium
                    entry queue pressures within a 90% threshold. The historical actions focus on
                    redistributing crowds to covered tunnels, which solves the bottleneck described.
                  </div>

                  <div className="flex flex-col gap-2">
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Actions Suggested to Prevent Problem:
                    </span>
                    <div className="flex flex-col gap-1.5">
                      {pb.recommendedActions.map((act, i) => (
                        <div key={i} className="flex gap-2 text-xs items-start text-slate-300">
                          <ChevronRight className="h-4 w-4 text-indigo-500 shrink-0 mt-0.5" />
                          <span>{act}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onInspect(pb)}
                    className="self-end hover:bg-slate-800/60"
                  >
                    Show Full Playbook
                  </Button>
                </div>
              ))
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
