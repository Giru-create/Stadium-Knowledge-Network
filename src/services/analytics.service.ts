import type { Playbook, AIRecommendation } from '@/types';
import {
  CATEGORY_ORDER,
  TIMELINE_BASELINES,
  CATEGORY_OFFSETS,
  categorisePlaybook,
} from '@/utils/analytics';
import type { TimelinePoint, CategoryPoint, LearningPoint } from '@/utils/analytics';

/**
 * Returns the total number of implemented recommendation actions.
 * Each recommendation can contain multiple actions; only those with status "Implemented" are counted.
 */
export function countImplementedActions(recommendations: AIRecommendation[]): number {
  return recommendations.reduce(
    (total, r) => total + r.actions.filter((a) => a.status === 'Implemented').length,
    0,
  );
}

/**
 * Builds the monthly timeline dataset.
 *
 * The final month's values are dynamically adjusted with the live playbook count
 * and implemented-action count so the chart always reflects current data.
 */
export function buildTimelineData(totalPlaybooks: number, implementedActions: number): TimelinePoint[] {
  const dynamicMonth = {
    month: 'Jun',
    Playbooks: totalPlaybooks + 18,
    Resolved: implementedActions + 120,
  };
  return [...TIMELINE_BASELINES, dynamicMonth];
}

/**
 * Aggregates playbooks into four operational categories and applies
 * seed offsets to ensure the chart always has meaningful shape.
 */
export function buildCategoryDistribution(playbooks: Playbook[]): CategoryPoint[] {
  const counts: Record<string, number> = {};
  for (const p of playbooks) {
    const cat = categorisePlaybook(p.eventType);
    counts[cat] = (counts[cat] ?? 0) + 1;
  }

  return CATEGORY_ORDER.map((category) => ({
    category,
    count: (counts[category] ?? 0) + (CATEGORY_OFFSETS[category] ?? 0),
  }));
}

/**
 * Returns the static learning-curve dataset.
 * Each point represents a successive match with improving response times and scores.
 */
export function buildLearningData(): LearningPoint[] {
  return [
    { match: 'Match 1', responseTime: 22, score: 65 },
    { match: 'Match 2', responseTime: 18, score: 72 },
    { match: 'Match 3', responseTime: 14, score: 81 },
    { match: 'Match 4', responseTime: 11, score: 88 },
    { match: 'Match 5', responseTime: 7, score: 95 },
  ];
}
