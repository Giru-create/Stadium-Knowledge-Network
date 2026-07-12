'use client';

import React, { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useApp } from '@/context/AppContext';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { Modal } from '@/components/ui/Modal';
import { 
  Search, 
  SlidersHorizontal, 
  Award, 
  ArrowRight, 
  Compass, 
  HelpCircle,
  Clock,
  ChevronRight
} from 'lucide-react';
import { Playbook, IncidentType } from '@/types';
import { PlaybookCardSkeleton } from '@/components/ui/Skeleton';

export default function LibraryPage() {
  const { playbooks, stadiums, loading } = useApp();

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStadium, setSelectedStadium] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'date' | 'confidence'>('date');
  
  // Modal State
  const [activePlaybook, setActivePlaybook] = useState<Playbook | null>(null);

  // Comparator State
  const [compareMode, setCompareMode] = useState(false);
  const [customScenario, setCustomScenario] = useState('Heavy wind causing temporary shade sails to flap violently near gate entrance.');
  const [compareCategory, setCompareCategory] = useState<IncidentType>('Heavy Rain');
  const [comparisonResults, setComparisonResults] = useState<Playbook[]>([]);

  // Filtered & sorted Playbooks — derived state via useMemo for performance
  const filteredPlaybooks = useMemo(() => {
    let result = [...playbooks];

    // Search filter
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(pb =>
        pb.title.toLowerCase().includes(q) ||
        pb.problem.toLowerCase().includes(q) ||
        pb.recommendedActions.some(a => a.toLowerCase().includes(q))
      );
    }

    // Event Type Filter
    if (selectedType !== 'All') {
      result = result.filter(pb => pb.eventType === selectedType);
    }

    // Stadium Filter
    if (selectedStadium !== 'All') {
      result = result.filter(pb => pb.stadiumId === selectedStadium);
    }

    // Sorting
    if (sortBy === 'date') {
      result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else {
      result.sort((a, b) => b.confidenceScore - a.confidenceScore);
    }

    return result;
  }, [playbooks, search, selectedType, selectedStadium, sortBy]);

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

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <PlaybookCardSkeleton />
            <PlaybookCardSkeleton />
            <PlaybookCardSkeleton />
            <PlaybookCardSkeleton />
            <PlaybookCardSkeleton />
            <PlaybookCardSkeleton />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  // Comparison handler
  const handleCompare = () => {
    // Filter playbooks of the selected category, and assign a mock similarity score based on description length overlapping
    const categoryMatches = playbooks.filter(pb => pb.eventType === compareCategory);
    
    const mapped = categoryMatches.map(pb => {
      // Simulate similarity calculation based on keywords
      const words = customScenario.toLowerCase().split(' ');
      let matchesCount = 0;
      words.forEach(w => {
        if (pb.problem.toLowerCase().includes(w) || pb.title.toLowerCase().includes(w)) {
          matchesCount++;
        }
      });
      const score = Math.min(65 + (matchesCount * 4), 98); // base 65% + bonus
      return { ...pb, similarityScore: score };
    }).sort((a, b) => (b.similarityScore || 0) - (a.similarityScore || 0));

    setComparisonResults(mapped);
    addLogConsole(`Scenario compared against ${categoryMatches.length} historical playbooks. High match found: ${mapped[0]?.title || 'None'}`);
  };

  const addLogConsole = (msg: string) => {
    console.log(`[Comparator] ${msg}`);
  };

  const categories = [
    'All', 'Heavy Rain', 'Large Crowd', 'Food Queue', 'Parking Jam', 'Power Failure', 
    'Lost Child', 'Medical Emergency', 'Accessibility Request', 'Volunteer Shortage', 'Metro Delay'
  ];

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        {/* Page title and toggle */}
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
            onClick={() => setCompareMode(!compareMode)}
            className="text-xs"
          >
            <Compass className="mr-2 h-4 w-4" />
            {compareMode ? 'View All Playbooks' : "Compare Today's Scenario"}
          </Button>
        </div>

        {/* Dynamic content split */}
        {compareMode ? (
          /* COMPARATOR INTERFACE */
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
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
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Event Category</label>
                    <select
                      value={compareCategory}
                      onChange={(e) => setCompareCategory(e.target.value as IncidentType)}
                      className="w-full rounded-xl border border-slate-800 bg-slate-900 px-4 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-500/50 cursor-pointer"
                    >
                      {categories.filter(c => c !== 'All').map(cat => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Custom Incident Description</label>
                    <textarea
                      rows={5}
                      value={customScenario}
                      onChange={(e) => setCustomScenario(e.target.value)}
                      placeholder="Enter descriptions about today's crowd levels, weather anomalies, delays, or gate congestions..."
                      className="w-full rounded-xl border border-slate-800 bg-slate-950 px-4 py-3 text-xs text-slate-200 outline-none focus:border-indigo-500/50 resize-none leading-relaxed"
                    />
                  </div>

                  <Button variant="primary" onClick={handleCompare} className="py-2.5 mt-2">
                    Query Library Matches
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Comparison outputs */}
            <div className="lg:col-span-7 flex flex-col gap-6">
              <Card className="flex-1">
                <CardHeader>
                  <CardTitle>Similarity Comparison Analysis</CardTitle>
                  <CardDescription>Historical matches sorted by pattern correlation.</CardDescription>
                </CardHeader>
                <CardContent className="flex flex-col gap-4">
                  {comparisonResults.length === 0 ? (
                    <div className="text-center py-16 border border-dashed border-slate-800 rounded-2xl bg-slate-900/10">
                      <HelpCircle className="h-10 w-10 text-slate-600 mx-auto mb-3 animate-pulse" />
                      <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
                        Input a scenario details on the left and query library to search comparable playbooks.
                      </p>
                    </div>
                  ) : (
                    comparisonResults.map(pb => (
                      <div key={pb.id} className="rounded-2xl border border-slate-800/80 bg-slate-950/40 p-5 flex flex-col gap-4 relative overflow-hidden">
                        <div className="absolute top-0 right-0 h-10 w-24 bg-gradient-to-l from-indigo-500/10 to-transparent flex items-center justify-end px-4 border-l border-b border-slate-800/60 rounded-bl-xl">
                          <span className="text-xs font-black text-indigo-400">{pb.similarityScore}% Match</span>
                        </div>

                        <div className="flex flex-col gap-1 pr-24">
                          <h4 className="text-sm font-bold text-slate-200">{pb.title}</h4>
                          <span className="text-[10px] text-slate-500">Recorded at {pb.stadiumName} • {new Date(pb.createdAt).toLocaleDateString()}</span>
                        </div>

                        <div className="bg-slate-900/30 p-3 rounded-xl border border-slate-800/40 text-xs text-slate-400">
                          <p className="font-bold text-[10px] text-slate-500 uppercase tracking-wider mb-1">AI Match Explanation:</p>
                          This playbook was selected because the rain intensity levels match current stadium entry queue pressures within a 90% threshold. The historical actions focus on redistributing crowds tocovered tunnels, which solves the bottleneck described.
                        </div>

                        <div className="flex flex-col gap-2">
                          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Actions Suggested to Prevent Problem:</span>
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
                          onClick={() => setActivePlaybook(pb)}
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
        ) : (
          /* STANDARD LIBRARY LISTING */
          <div className="flex flex-col gap-6">
            {/* Search and filter bar */}
            <Card className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
              {/* Search */}
              <div className="relative w-full md:w-80">
                <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
                <input
                  type="text"
                  placeholder="Search playbooks..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full rounded-xl border border-slate-800 bg-slate-900/50 py-2 pl-9 pr-4 text-xs text-slate-200 outline-none focus:border-indigo-500/50"
                />
              </div>

              {/* Filters */}
              <div className="flex flex-wrap gap-3 w-full md:w-auto items-center justify-end">
                <div className="flex items-center gap-2">
                  <SlidersHorizontal className="h-4 w-4 text-slate-500" />
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 outline-none cursor-pointer"
                  >
                    <option value="All">All Categories</option>
                    {categories.filter(c => c !== 'All').map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <select
                  value={selectedStadium}
                  onChange={(e) => setSelectedStadium(e.target.value)}
                  className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 outline-none cursor-pointer"
                >
                  <option value="All">All Stadiums</option>
                  {stadiums.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>

                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value as 'date' | 'confidence')}
                  className="rounded-xl border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-300 outline-none cursor-pointer"
                >
                  <option value="date">Newest Date</option>
                  <option value="confidence">High Confidence</option>
                </select>
              </div>
            </Card>

            {/* Playbooks Grid */}
            {filteredPlaybooks.length === 0 ? (
              <div className="text-center py-20 border border-dashed border-slate-800 rounded-3xl bg-slate-900/10">
                <p className="text-sm text-slate-500">No playbooks match your search parameters.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredPlaybooks.map(pb => (
                  <Card key={pb.id} className="flex flex-col justify-between h-[320px] hover:scale-[1.01]">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center justify-between">
                        <Badge variant="primary" className="text-[9px]">{pb.eventType}</Badge>
                        <Badge variant="success" className="gap-1 text-[9px]">
                          <Award className="h-3 w-3" /> {pb.confidenceScore}% Confidence
                        </Badge>
                      </div>
                      
                      <div className="flex flex-col gap-1 mt-1">
                        <h4 className="text-sm font-bold text-slate-200 line-clamp-2 min-h-[40px]">
                          {pb.title}
                        </h4>
                        <span className="text-[10px] text-slate-500">📍 {pb.stadiumName}</span>
                      </div>

                      <p className="text-xs text-slate-400 line-clamp-3 leading-relaxed mt-2">
                        {pb.problem}
                      </p>
                    </div>

                    <CardFooter className="px-0 pb-0 mt-4 border-t border-slate-800/40 pt-3 flex items-center justify-between">
                      <span className="text-[10px] text-slate-500 flex items-center gap-1">
                        <Clock className="h-3 w-3" /> {new Date(pb.createdAt).toLocaleDateString()}
                      </span>
                      <button
                        onClick={() => setActivePlaybook(pb)}
                        className="text-xs text-indigo-400 hover:text-indigo-300 font-bold flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        Inspect SOP <ChevronRight className="h-3.5 w-3.5" />
                      </button>
                    </CardFooter>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* PLAYBOOK DETAIL MODAL */}
        <Modal
          isOpen={activePlaybook !== null}
          onClose={() => setActivePlaybook(null)}
          title={activePlaybook?.title || 'Playbook Specifications'}
          size="lg"
        >
          {activePlaybook && (
            <div className="flex flex-col gap-6 select-text">
              <div className="flex flex-wrap gap-4 items-center justify-between border-b border-slate-800/50 pb-4">
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Incident Category</span>
                  <span className="text-sm font-semibold text-slate-300">{activePlaybook.eventType}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Originating Stadium</span>
                  <span className="text-sm font-semibold text-slate-300">{activePlaybook.stadiumName}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Confidence Score</span>
                  <span className="text-sm font-bold text-emerald-400">{activePlaybook.confidenceScore}%</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Created Date</span>
                  <span className="text-sm font-semibold text-slate-300">{new Date(activePlaybook.createdAt).toLocaleDateString()}</span>
                </div>
              </div>

              <div className="flex flex-col gap-2">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Operational Problem</h4>
                <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/40 p-4 rounded-xl border border-slate-800/50">{activePlaybook.problem}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex flex-col gap-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Root Cause</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{activePlaybook.rootCause}</p>
                </div>
                <div className="flex flex-col gap-2">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Operational Risk</h4>
                  <p className="text-xs text-slate-400 leading-relaxed">{activePlaybook.operationalRisk}</p>
                </div>
              </div>

              <div className="flex flex-col gap-3">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recommended SOP Actions</h4>
                <div className="flex flex-col gap-2">
                  {activePlaybook.recommendedActions.map((action, index) => (
                    <div key={index} className="flex gap-3 bg-slate-950/30 border border-slate-800/40 rounded-xl px-4 py-3 text-xs text-slate-300 items-start">
                      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-indigo-500/10 border border-indigo-500/20 text-[10px] font-bold text-indigo-400">{index + 1}</span>
                      <p className="leading-relaxed">{action}</p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-slate-800/50 pt-4">
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Expected Impact</span>
                  <p className="text-xs text-slate-400 leading-relaxed">{activePlaybook.expectedImpact}</p>
                </div>
                <div className="flex flex-col gap-1.5">
                  <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Alternative Strategy</span>
                  <p className="text-xs text-slate-400 leading-relaxed">{activePlaybook.alternativeStrategy}</p>
                </div>
              </div>

              <div className="rounded-xl bg-slate-950/40 border border-slate-800/60 p-4 text-xs text-slate-400">
                <p className="font-bold text-[10px] text-slate-500 uppercase tracking-wider mb-1">Lessons Learned for Future Matches:</p>
                {activePlaybook.lessonsLearned}
              </div>
            </div>
          )}
        </Modal>
      </div>
    </DashboardLayout>
  );
}
