import { Playbook, IncidentType } from '@/types';

/** All selectable incident categories. */
export const INCIDENT_CATEGORIES: IncidentType[] = [
  'Heavy Rain',
  'Large Crowd',
  'Food Queue',
  'Parking Jam',
  'Power Failure',
  'Lost Child',
  'Medical Emergency',
  'Accessibility Request',
  'Volunteer Shortage',
  'Metro Delay',
];

/** Category filter including the "All" sentinel. */
export const CATEGORY_OPTIONS = ['All', ...INCIDENT_CATEGORIES] as const;

/** Sort key for playbooks. */
export type SortKey = 'date' | 'confidence';

/**
 * Filters playbooks by search query, event type, and stadium.
 * @returns A new array (does not mutate the input).
 */
export function filterPlaybooks(
  playbooks: Playbook[],
  params: { search: string; selectedType: string; selectedStadium: string },
): Playbook[] {
  const { search, selectedType, selectedStadium } = params;
  let result = [...playbooks];

  if (search.trim()) {
    const q = search.toLowerCase();
    result = result.filter(
      (pb) =>
        pb.title.toLowerCase().includes(q) ||
        pb.problem.toLowerCase().includes(q) ||
        pb.recommendedActions.some((a) => a.toLowerCase().includes(q)),
    );
  }

  if (selectedType !== 'All') {
    result = result.filter((pb) => pb.eventType === selectedType);
  }

  if (selectedStadium !== 'All') {
    result = result.filter((pb) => pb.stadiumId === selectedStadium);
  }

  return result;
}

/**
 * Sorts playbooks by date (newest first) or confidence (highest first).
 * @returns A new sorted array.
 */
export function sortPlaybooks(playbooks: Playbook[], sortBy: SortKey): Playbook[] {
  const sorted = [...playbooks];
  if (sortBy === 'date') {
    sorted.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  } else {
    sorted.sort((a, b) => b.confidenceScore - a.confidenceScore);
  }
  return sorted;
}
