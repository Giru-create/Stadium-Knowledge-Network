import { useState, useMemo, useCallback } from 'react';
import { useApp } from '@/context/AppContext';
import { Playbook, IncidentType } from '@/types';
import { filterPlaybooks, sortPlaybooks, SortKey, INCIDENT_CATEGORIES } from '@/utils/library';
import { comparePlaybooks } from '@/services/library.service';

interface UseLibraryReturn {
  playbooks: Playbook[];
  stadiums: ReturnType<typeof useApp>['stadiums'];
  loading: boolean;
  search: string;
  setSearch: (v: string) => void;
  selectedType: string;
  setSelectedType: (v: string) => void;
  selectedStadium: string;
  setSelectedStadium: (v: string) => void;
  sortBy: SortKey;
  setSortBy: (v: SortKey) => void;
  filteredPlaybooks: Playbook[];
  activePlaybook: Playbook | null;
  setActivePlaybook: (pb: Playbook | null) => void;
  compareMode: boolean;
  setCompareMode: (v: boolean) => void;
  customScenario: string;
  setCustomScenario: (v: string) => void;
  compareCategory: IncidentType;
  setCompareCategory: (v: IncidentType) => void;
  comparisonResults: (Playbook & { similarityScore: number })[];
  handleCompare: () => void;
  categories: readonly string[];
}

/**
 * Encapsulates all library-page state, filtering logic, and comparison handling.
 * Keeps the page component as a pure layout coordinator.
 */
export function useLibrary(): UseLibraryReturn {
  const { playbooks, stadiums, loading } = useApp();

  const [search, setSearch] = useState('');
  const [selectedType, setSelectedType] = useState<string>('All');
  const [selectedStadium, setSelectedStadium] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortKey>('date');
  const [activePlaybook, setActivePlaybook] = useState<Playbook | null>(null);

  const [compareMode, setCompareMode] = useState(false);
  const [customScenario, setCustomScenario] = useState(
    'Heavy wind causing temporary shade sails to flap violently near gate entrance.',
  );
  const [compareCategory, setCompareCategory] = useState<IncidentType>('Heavy Rain');
  const [comparisonResults, setComparisonResults] = useState<(Playbook & { similarityScore: number })[]>([]);

  const filteredPlaybooks = useMemo(
    () => sortPlaybooks(filterPlaybooks(playbooks, { search, selectedType, selectedStadium }), sortBy),
    [playbooks, search, selectedType, selectedStadium, sortBy],
  );

  const handleCompare = useCallback(() => {
    const results = comparePlaybooks(playbooks, compareCategory, customScenario);
    setComparisonResults(results);
    console.log(
      `[Comparator] Scenario compared against ${results.length} historical playbooks. ` +
        `High match found: ${results[0]?.title || 'None'}`,
    );
  }, [playbooks, compareCategory, customScenario]);

  return {
    playbooks,
    stadiums,
    loading,
    search,
    setSearch,
    selectedType,
    setSelectedType,
    selectedStadium,
    setSelectedStadium,
    sortBy,
    setSortBy,
    filteredPlaybooks,
    activePlaybook,
    setActivePlaybook,
    compareMode,
    setCompareMode,
    customScenario,
    setCustomScenario,
    compareCategory,
    setCompareCategory,
    comparisonResults,
    handleCompare,
    categories: INCIDENT_CATEGORIES,
  };
}
