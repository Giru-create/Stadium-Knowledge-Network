import { describe, it, expect } from 'vitest';
import {
  filterPlaybooks,
  sortPlaybooks,
  INCIDENT_CATEGORIES,
  CATEGORY_OPTIONS,
} from '@/utils/library';
import { Playbook } from '@/types';

function makePlaybook(overrides: Partial<Playbook> = {}): Playbook {
  return {
    id: 'pb-1',
    title: 'Rain Emergency Protocol',
    eventType: 'Heavy Rain',
    stadiumId: 'stadium-1',
    stadiumName: 'Test Stadium',
    problem: 'Heavy rainfall causing crowd congestion at gate B',
    rootCause: 'Weather conditions',
    operationalRisk: 'Crowd safety',
    recommendedActions: ['Open emergency exits', 'Redirect crowd flow'],
    expectedImpact: 'Reduced congestion',
    lessonsLearned: 'Monitor weather forecasts',
    confidenceScore: 85,
    alternativeStrategy: 'Use backup gates',
    createdAt: '2026-07-15T10:00:00.000Z',
    ...overrides,
  };
}

describe('library utils', () => {
  describe('INCIDENT_CATEGORIES', () => {
    it('should contain all expected incident types', () => {
      expect(INCIDENT_CATEGORIES).toContain('Heavy Rain');
      expect(INCIDENT_CATEGORIES).toContain('Medical Emergency');
      expect(INCIDENT_CATEGORIES).toContain('Power Failure');
      expect(INCIDENT_CATEGORIES).toContain('Large Crowd');
      expect(INCIDENT_CATEGORIES).toContain('Metro Delay');
    });

    it('should have 10 categories', () => {
      expect(INCIDENT_CATEGORIES).toHaveLength(10);
    });
  });

  describe('CATEGORY_OPTIONS', () => {
    it('should start with "All"', () => {
      expect(CATEGORY_OPTIONS[0]).toBe('All');
    });

    it('should have one more entry than INCIDENT_CATEGORIES', () => {
      expect(CATEGORY_OPTIONS).toHaveLength(INCIDENT_CATEGORIES.length + 1);
    });
  });

  describe('filterPlaybooks', () => {
    const playbooks = [
      makePlaybook({ id: 'pb-1', title: 'Rain Protocol', eventType: 'Heavy Rain', stadiumId: 's1', problem: 'Rain problem', recommendedActions: ['Open gates'] }),
      makePlaybook({ id: 'pb-2', title: 'Crowd Control', eventType: 'Large Crowd', stadiumId: 's1', problem: 'Crowd problem', recommendedActions: ['Deploy staff'] }),
      makePlaybook({ id: 'pb-3', title: 'Medical Response', eventType: 'Medical Emergency', stadiumId: 's2', problem: 'Medical problem', recommendedActions: ['Call ambulance'] }),
    ];

    it('should return all playbooks when filters are default', () => {
      const result = filterPlaybooks(playbooks, { search: '', selectedType: 'All', selectedStadium: 'All' });
      expect(result).toHaveLength(3);
    });

    it('should filter by search query matching title', () => {
      const result = filterPlaybooks(playbooks, { search: 'Rain', selectedType: 'All', selectedStadium: 'All' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('pb-1');
    });

    it('should filter by search query matching problem', () => {
      const result = filterPlaybooks(playbooks, { search: 'ambulance', selectedType: 'All', selectedStadium: 'All' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('pb-3');
    });

    it('should filter by search query matching recommended actions', () => {
      const result = filterPlaybooks(playbooks, { search: 'deploy', selectedType: 'All', selectedStadium: 'All' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('pb-2');
    });

    it('should be case-insensitive for search', () => {
      const result = filterPlaybooks(playbooks, { search: 'rain', selectedType: 'All', selectedStadium: 'All' });
      expect(result).toHaveLength(1);
    });

    it('should filter by event type', () => {
      const result = filterPlaybooks(playbooks, { search: '', selectedType: 'Large Crowd', selectedStadium: 'All' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('pb-2');
    });

    it('should filter by stadium', () => {
      const result = filterPlaybooks(playbooks, { search: '', selectedType: 'All', selectedStadium: 's2' });
      expect(result).toHaveLength(1);
      expect(result[0].id).toBe('pb-3');
    });

    it('should combine search and type filters', () => {
      const result = filterPlaybooks(playbooks, { search: 'Rain', selectedType: 'Heavy Rain', selectedStadium: 'All' });
      expect(result).toHaveLength(1);
    });

    it('should return empty array when no match', () => {
      const result = filterPlaybooks(playbooks, { search: 'xyz_nonexistent', selectedType: 'All', selectedStadium: 'All' });
      expect(result).toHaveLength(0);
    });

    it('should return empty array for empty input', () => {
      const result = filterPlaybooks([], { search: 'test', selectedType: 'All', selectedStadium: 'All' });
      expect(result).toHaveLength(0);
    });

    it('should not mutate the original array', () => {
      const original = [...playbooks];
      filterPlaybooks(playbooks, { search: 'Rain', selectedType: 'All', selectedStadium: 'All' });
      expect(playbooks).toEqual(original);
    });

    it('should handle whitespace-only search as empty', () => {
      const result = filterPlaybooks(playbooks, { search: '   ', selectedType: 'All', selectedStadium: 'All' });
      expect(result).toHaveLength(3);
    });
  });

  describe('sortPlaybooks', () => {
    const playbooks = [
      makePlaybook({ id: 'pb-1', confidenceScore: 70, createdAt: '2026-01-01T00:00:00.000Z' }),
      makePlaybook({ id: 'pb-2', confidenceScore: 95, createdAt: '2026-06-01T00:00:00.000Z' }),
      makePlaybook({ id: 'pb-3', confidenceScore: 85, createdAt: '2026-03-01T00:00:00.000Z' }),
    ];

    it('should sort by date (newest first)', () => {
      const sorted = sortPlaybooks(playbooks, 'date');
      expect(sorted[0].id).toBe('pb-2');
      expect(sorted[1].id).toBe('pb-3');
      expect(sorted[2].id).toBe('pb-1');
    });

    it('should sort by confidence (highest first)', () => {
      const sorted = sortPlaybooks(playbooks, 'confidence');
      expect(sorted[0].id).toBe('pb-2');
      expect(sorted[1].id).toBe('pb-3');
      expect(sorted[2].id).toBe('pb-1');
    });

    it('should not mutate the original array', () => {
      const original = [...playbooks];
      sortPlaybooks(playbooks, 'date');
      expect(playbooks).toEqual(original);
    });

    it('should handle empty array', () => {
      expect(sortPlaybooks([], 'date')).toHaveLength(0);
      expect(sortPlaybooks([], 'confidence')).toHaveLength(0);
    });

    it('should handle single element', () => {
      const sorted = sortPlaybooks([playbooks[0]], 'date');
      expect(sorted).toHaveLength(1);
      expect(sorted[0].id).toBe('pb-1');
    });
  });
});
