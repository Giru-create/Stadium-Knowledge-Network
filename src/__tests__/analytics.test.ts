import { describe, it, expect } from 'vitest';
import {
  categorisePlaybook,
  PIE_COLORS,
  CATEGORY_ORDER,
  CATEGORY_OFFSETS,
  TIMELINE_BASELINES,
} from '@/utils/analytics';
import {
  countImplementedActions,
  buildTimelineData,
  buildCategoryDistribution,
  buildLearningData,
} from '@/services/analytics.service';
import { Playbook, AIRecommendation, IncidentType } from '@/types';

describe('analytics utils', () => {
  describe('PIE_COLORS', () => {
    it('should have 4 colors', () => {
      expect(PIE_COLORS).toHaveLength(4);
    });

    it('should be valid hex colors', () => {
      for (const color of PIE_COLORS) {
        expect(color).toMatch(/^#[0-9a-fA-F]{6}$/);
      }
    });
  });

  describe('CATEGORY_ORDER', () => {
    it('should have 4 categories', () => {
      expect(CATEGORY_ORDER).toHaveLength(4);
    });

    it('should include all expected categories', () => {
      expect(CATEGORY_ORDER).toContain('Weather');
      expect(CATEGORY_ORDER).toContain('Crowd Flow');
      expect(CATEGORY_ORDER).toContain('Logistics');
      expect(CATEGORY_ORDER).toContain('Emergencies');
    });
  });

  describe('CATEGORY_OFFSETS', () => {
    it('should have an offset for each category in CATEGORY_ORDER', () => {
      for (const cat of CATEGORY_ORDER) {
        expect(CATEGORY_OFFSETS).toHaveProperty(cat);
        expect(typeof CATEGORY_OFFSETS[cat]).toBe('number');
      }
    });
  });

  describe('TIMELINE_BASELINES', () => {
    it('should have 5 months', () => {
      expect(TIMELINE_BASELINES).toHaveLength(5);
    });

    it('each entry should have month, Playbooks, and Resolved', () => {
      for (const entry of TIMELINE_BASELINES) {
        expect(entry).toHaveProperty('month');
        expect(entry).toHaveProperty('Playbooks');
        expect(entry).toHaveProperty('Resolved');
        expect(typeof entry.month).toBe('string');
        expect(typeof entry.Playbooks).toBe('number');
        expect(typeof entry.Resolved).toBe('number');
      }
    });
  });

  describe('categorisePlaybook', () => {
    it('should map Heavy Rain to Weather', () => {
      expect(categorisePlaybook('Heavy Rain')).toBe('Weather');
    });

    it('should map Large Crowd to Crowd Flow', () => {
      expect(categorisePlaybook('Large Crowd')).toBe('Crowd Flow');
    });

    it('should map Gate Closed to Crowd Flow', () => {
      expect(categorisePlaybook('Gate Closed')).toBe('Crowd Flow');
    });

    it('should map Food Queue to Logistics', () => {
      expect(categorisePlaybook('Food Queue')).toBe('Logistics');
    });

    it('should map Parking Jam to Logistics', () => {
      expect(categorisePlaybook('Parking Jam')).toBe('Logistics');
    });

    it('should map Metro Delay to Logistics', () => {
      expect(categorisePlaybook('Metro Delay')).toBe('Logistics');
    });

    it('should map Medical Emergency to Emergencies', () => {
      expect(categorisePlaybook('Medical Emergency')).toBe('Emergencies');
    });

    it('should map Power Failure to Emergencies', () => {
      expect(categorisePlaybook('Power Failure')).toBe('Emergencies');
    });

    it('should map Lost Child to Emergencies', () => {
      expect(categorisePlaybook('Lost Child')).toBe('Emergencies');
    });

    it('should fallback to Logistics for unknown types', () => {
      expect(categorisePlaybook('Unknown Type' as IncidentType)).toBe('Logistics');
    });
  });
});

describe('analytics service', () => {
  describe('countImplementedActions', () => {
    it('should return 0 for empty recommendations', () => {
      expect(countImplementedActions([])).toBe(0);
    });

    it('should count only Implemented actions', () => {
      const recs: AIRecommendation[] = [
        {
          id: 'r1', matchId: 'm1', stadiumId: 's1', eventType: 'Heavy Rain',
          incidentId: 'i1', playbookId: 'p1', playbookTitle: 'PT', title: 'T',
          description: 'D', explanation: 'E', createdAt: '',
          actions: [
            { action: 'A1', status: 'Implemented' },
            { action: 'A2', status: 'Pending' },
            { action: 'A3', status: 'In Progress' },
          ],
        },
      ];
      expect(countImplementedActions(recs)).toBe(1);
    });

    it('should sum across multiple recommendations', () => {
      const recs: AIRecommendation[] = [
        {
          id: 'r1', matchId: 'm1', stadiumId: 's1', eventType: 'Heavy Rain',
          incidentId: 'i1', playbookId: 'p1', playbookTitle: 'PT', title: 'T',
          description: 'D', explanation: 'E', createdAt: '',
          actions: [
            { action: 'A1', status: 'Implemented' },
            { action: 'A2', status: 'Implemented' },
          ],
        },
        {
          id: 'r2', matchId: 'm1', stadiumId: 's1', eventType: 'Large Crowd',
          incidentId: 'i2', playbookId: 'p2', playbookTitle: 'PT2', title: 'T2',
          description: 'D2', explanation: 'E2', createdAt: '',
          actions: [
            { action: 'A3', status: 'Implemented' },
          ],
        },
      ];
      expect(countImplementedActions(recs)).toBe(3);
    });

    it('should return 0 when no actions are implemented', () => {
      const recs: AIRecommendation[] = [
        {
          id: 'r1', matchId: 'm1', stadiumId: 's1', eventType: 'Heavy Rain',
          incidentId: 'i1', playbookId: 'p1', playbookTitle: 'PT', title: 'T',
          description: 'D', explanation: 'E', createdAt: '',
          actions: [
            { action: 'A1', status: 'Pending' },
            { action: 'A2', status: 'In Progress' },
          ],
        },
      ];
      expect(countImplementedActions(recs)).toBe(0);
    });
  });

  describe('buildTimelineData', () => {
    it('should return 6 data points (5 baseline + 1 dynamic)', () => {
      const data = buildTimelineData(10, 5);
      expect(data).toHaveLength(6);
    });

    it('last entry should use provided playbook and action counts', () => {
      const data = buildTimelineData(10, 5);
      const last = data[data.length - 1];
      expect(last.month).toBe('Jun');
      expect(last.Playbooks).toBe(28); // 10 + 18
      expect(last.Resolved).toBe(125); // 5 + 120
    });

    it('should handle zero playbooks and actions', () => {
      const data = buildTimelineData(0, 0);
      const last = data[data.length - 1];
      expect(last.Playbooks).toBe(18);
      expect(last.Resolved).toBe(120);
    });
  });

  describe('buildCategoryDistribution', () => {
    it('should return 4 category entries', () => {
      const data = buildCategoryDistribution([]);
      expect(data).toHaveLength(4);
    });

    it('each entry should have category and count', () => {
      const data = buildCategoryDistribution([]);
      for (const entry of data) {
        expect(entry).toHaveProperty('category');
        expect(entry).toHaveProperty('count');
        expect(typeof entry.count).toBe('number');
      }
    });

    it('should apply seed offsets when no playbooks', () => {
      const data = buildCategoryDistribution([]);
      const weather = data.find(d => d.category === 'Weather');
      expect(weather?.count).toBe(12); // CATEGORY_OFFSETS.Weather
    });

    it('should aggregate playbooks into correct categories', () => {
      const playbooks: Playbook[] = [
        { id: '1', title: 'T', eventType: 'Heavy Rain', stadiumId: 's', stadiumName: 'SN', problem: 'P', rootCause: 'R', operationalRisk: 'OR', recommendedActions: [], expectedImpact: 'EI', lessonsLearned: 'LL', confidenceScore: 80, alternativeStrategy: 'AS', createdAt: '' },
        { id: '2', title: 'T2', eventType: 'Heavy Rain', stadiumId: 's', stadiumName: 'SN', problem: 'P', rootCause: 'R', operationalRisk: 'OR', recommendedActions: [], expectedImpact: 'EI', lessonsLearned: 'LL', confidenceScore: 85, alternativeStrategy: 'AS', createdAt: '' },
      ];
      const data = buildCategoryDistribution(playbooks);
      const weather = data.find(d => d.category === 'Weather');
      expect(weather?.count).toBe(14); // 2 playbooks + 12 offset
    });
  });

  describe('buildLearningData', () => {
    it('should return 5 data points', () => {
      const data = buildLearningData();
      expect(data).toHaveLength(5);
    });

    it('each entry should have match, responseTime, and score', () => {
      const data = buildLearningData();
      for (const entry of data) {
        expect(entry).toHaveProperty('match');
        expect(entry).toHaveProperty('responseTime');
        expect(entry).toHaveProperty('score');
      }
    });

    it('response times should decrease across matches', () => {
      const data = buildLearningData();
      const times = data.map(d => d.responseTime);
      for (let i = 1; i < times.length; i++) {
        expect(times[i]).toBeLessThan(times[i - 1]);
      }
    });

    it('scores should increase across matches', () => {
      const data = buildLearningData();
      const scores = data.map(d => d.score);
      for (let i = 1; i < scores.length; i++) {
        expect(scores[i]).toBeGreaterThan(scores[i - 1]);
      }
    });
  });
});
