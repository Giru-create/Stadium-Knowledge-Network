'use client';

import { useMemo } from 'react';
import { useApp } from '@/context/AppContext';
import {
  countImplementedActions,
  buildTimelineData,
  buildCategoryDistribution,
  buildLearningData,
} from '@/services/analytics.service';
import { PIE_COLORS } from '@/utils/analytics';

/**
 * Provides all derived analytics data required by the analytics page.
 *
 * Every expensive computation is wrapped in `useMemo` so values are only
 * recalculated when their specific dependencies change.
 *
 * @returns Memoised chart datasets, summary statistics, and the pie-color palette.
 */
export function useAnalytics() {
  const { playbooks, recommendations } = useApp();

  const totalPlaybooks = playbooks.length;

  const implementedActions = useMemo(
    () => countImplementedActions(recommendations),
    [recommendations],
  );

  const timelineData = useMemo(
    () => buildTimelineData(totalPlaybooks, implementedActions),
    [totalPlaybooks, implementedActions],
  );

  const categoryDistribution = useMemo(
    () => buildCategoryDistribution(playbooks),
    [playbooks],
  );

  const learningData = useMemo(() => buildLearningData(), []);

  return {
    totalPlaybooks,
    implementedActions,
    timelineData,
    categoryDistribution,
    learningData,
    PIE_COLORS,
  };
}
