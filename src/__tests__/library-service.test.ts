import { describe, it, expect } from 'vitest';
import { comparePlaybooks } from '@/services/library.service';
import { Playbook } from '@/types';

function makePlaybook(overrides: Partial<Playbook> = {}): Playbook {
  return {
    id: 'pb-1',
    title: 'Rain Protocol',
    eventType: 'Heavy Rain',
    stadiumId: 's1',
    stadiumName: 'Test Stadium',
    problem: 'Heavy rainfall causing crowd congestion at gate B entrance',
    rootCause: 'Weather',
    operationalRisk: 'Safety',
    recommendedActions: ['Open gates', 'Deploy staff'],
    expectedImpact: 'Better',
    lessonsLearned: 'Monitor weather',
    confidenceScore: 85,
    alternativeStrategy: 'Backup',
    createdAt: '2026-07-15T10:00:00.000Z',
    ...overrides,
  };
}

describe('library.service', () => {
  describe('comparePlaybooks', () => {
    const playbooks = [
      makePlaybook({ id: 'pb-1', eventType: 'Heavy Rain', title: 'Rain Emergency Protocol', problem: 'Heavy rainfall causing crowd congestion at gate entrance' }),
      makePlaybook({ id: 'pb-2', eventType: 'Heavy Rain', title: 'Weather Contingency Plan', problem: 'Storm surge causing parking lot flooding' }),
      makePlaybook({ id: 'pb-3', eventType: 'Large Crowd', title: 'Crowd Management', problem: 'Large crowd bottleneck at entry gate' }),
    ];

    it('should only return playbooks matching the category', () => {
      const results = comparePlaybooks(playbooks, 'Heavy Rain', 'rain');
      expect(results).toHaveLength(2);
      for (const r of results) {
        expect(r.eventType).toBe('Heavy Rain');
      }
    });

    it('should return empty array when no playbooks match category', () => {
      const results = comparePlaybooks(playbooks, 'Power Failure', 'test');
      expect(results).toHaveLength(0);
    });

    it('should enrich results with similarityScore', () => {
      const results = comparePlaybooks(playbooks, 'Heavy Rain', 'rain');
      for (const r of results) {
        expect(r).toHaveProperty('similarityScore');
        expect(typeof r.similarityScore).toBe('number');
      }
    });

    it('should sort by similarityScore descending', () => {
      const results = comparePlaybooks(playbooks, 'Heavy Rain', 'rain gate');
      for (let i = 1; i < results.length; i++) {
        expect(results[i].similarityScore).toBeLessThanOrEqual(results[i - 1].similarityScore);
      }
    });

    it('should handle empty playbooks array', () => {
      const results = comparePlaybooks([], 'Heavy Rain', 'test');
      expect(results).toHaveLength(0);
    });

    it('should handle empty scenario string', () => {
      const results = comparePlaybooks(playbooks, 'Heavy Rain', '');
      expect(results).toHaveLength(2);
      for (const r of results) {
        expect(r.similarityScore).toBeGreaterThanOrEqual(65);
      }
    });

    it('should give higher scores for more keyword matches', () => {
      const withMatches = comparePlaybooks(playbooks, 'Heavy Rain', 'rain congestion gate');
      const withoutMatches = comparePlaybooks(playbooks, 'Heavy Rain', 'xyz');
      expect(withMatches[0].similarityScore).toBeGreaterThanOrEqual(withoutMatches[0].similarityScore);
    });

    it('should cap similarityScore at 98', () => {
      const results = comparePlaybooks(playbooks, 'Heavy Rain', 'rain crowd congestion gate entrance flooding storm weather');
      for (const r of results) {
        expect(r.similarityScore).toBeLessThanOrEqual(98);
      }
    });

    it('should not mutate original playbooks array', () => {
      const original = [...playbooks];
      comparePlaybooks(playbooks, 'Heavy Rain', 'test');
      expect(playbooks).toEqual(original);
    });
  });
});
