'use client';

import React from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { useLibrary } from '@/hooks/useLibrary';
import { LoadingState } from '@/components/library/LoadingState';
import { LibraryHeader } from '@/components/library/LibraryHeader';
import { SearchBar } from '@/components/library/SearchBar';
import { FilterPanel } from '@/components/library/FilterPanel';
import { ResourceGrid } from '@/components/library/ResourceGrid';
import { EmptyState } from '@/components/library/EmptyState';
import { ComparePanel } from '@/components/library/ComparePanel';
import { PlaybookDetailModal } from '@/components/library/PlaybookDetailModal';

export default function LibraryPage() {
  const lib = useLibrary();

  if (lib.loading) return <LoadingState />;

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <LibraryHeader compareMode={lib.compareMode} onToggleCompare={() => lib.setCompareMode(!lib.compareMode)} />

        {lib.compareMode ? (
          <ComparePanel
            compareCategory={lib.compareCategory}
            onCategoryChange={lib.setCompareCategory}
            customScenario={lib.customScenario}
            onScenarioChange={lib.setCustomScenario}
            onCompare={lib.handleCompare}
            comparisonResults={lib.comparisonResults}
            onInspect={lib.setActivePlaybook}
            categories={lib.categories}
          />
        ) : (
          <div className="flex flex-col gap-6">
            <Card className="p-4 flex flex-col md:flex-row gap-4 items-center justify-between">
              <SearchBar value={lib.search} onChange={lib.setSearch} />
              <FilterPanel
                selectedType={lib.selectedType}
                onTypeChange={lib.setSelectedType}
                selectedStadium={lib.selectedStadium}
                onStadiumChange={lib.setSelectedStadium}
                sortBy={lib.sortBy}
                onSortChange={lib.setSortBy}
                stadiums={lib.stadiums}
              />
            </Card>

            {lib.filteredPlaybooks.length === 0 ? (
              <EmptyState />
            ) : (
              <ResourceGrid playbooks={lib.filteredPlaybooks} onInspect={lib.setActivePlaybook} />
            )}
          </div>
        )}

        <PlaybookDetailModal playbook={lib.activePlaybook} onClose={() => lib.setActivePlaybook(null)} />
      </div>
    </DashboardLayout>
  );
}
