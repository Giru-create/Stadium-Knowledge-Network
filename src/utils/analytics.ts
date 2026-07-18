import type { IncidentType } from '@/types';

/** Color palette for the category distribution bar chart. */
export const PIE_COLORS = ['#6366f1', '#a855f7', '#10b981', '#f43f5e'] as const;

/** Maps a playbook eventType to one of four operational categories. */
const CATEGORY_MAP: Record<string, string> = {
  'Heavy Rain': 'Weather',
  'Large Crowd': 'Crowd Flow',
  'Gate Closed': 'Crowd Flow',
  'Food Queue': 'Logistics',
  'Parking Jam': 'Logistics',
  'Metro Delay': 'Logistics',
  'Medical Emergency': 'Emergencies',
  'Power Failure': 'Emergencies',
  'Lost Child': 'Emergencies',
} as const;

/** Canonical category names used across the UI. */
export const CATEGORY_ORDER = ['Weather', 'Crowd Flow', 'Logistics', 'Emergencies'] as const;

/** Seed offsets applied to each category so chart data looks realistic regardless of playbook count. */
export const CATEGORY_OFFSETS: Record<string, number> = {
  Weather: 12,
  'Crowd Flow': 18,
  Logistics: 15,
  Emergencies: 8,
};

/** Baseline monthly timeline values before playbook/implementation adjustments. */
export const TIMELINE_BASELINES = [
  { month: 'Jan', Playbooks: 4, Resolved: 12 },
  { month: 'Feb', Playbooks: 7, Resolved: 22 },
  { month: 'Mar', Playbooks: 12, Resolved: 35 },
  { month: 'Apr', Playbooks: 15, Resolved: 58 },
  { month: 'May', Playbooks: 20, Resolved: 84 },
];

export type TimelinePoint = { month: string; Playbooks: number; Resolved: number };
export type CategoryPoint = { category: string; count: number };
export type LearningPoint = { match: string; responseTime: number; score: number };

/**
 * Determines which operational category a playbook belongs to based on its eventType.
 * Falls back to "Logistics" for unrecognised event types.
 */
export function categorisePlaybook(eventType: IncidentType): string {
  return CATEGORY_MAP[eventType] ?? 'Logistics';
}
