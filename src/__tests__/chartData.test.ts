import { describe, it, expect } from 'vitest';
import { crowdFlowData } from '@/utils/chartData';

describe('chartData', () => {
  describe('crowdFlowData', () => {
    it('should be a non-empty array', () => {
      expect(Array.isArray(crowdFlowData)).toBe(true);
      expect(crowdFlowData.length).toBeGreaterThan(0);
    });

    it('each entry should have time, density, and flowRate', () => {
      for (const entry of crowdFlowData) {
        expect(entry).toHaveProperty('time');
        expect(entry).toHaveProperty('density');
        expect(entry).toHaveProperty('flowRate');
        expect(typeof entry.time).toBe('string');
        expect(typeof entry.density).toBe('number');
        expect(typeof entry.flowRate).toBe('number');
      }
    });

    it('density values should be between 0 and 100', () => {
      for (const entry of crowdFlowData) {
        expect(entry.density).toBeGreaterThanOrEqual(0);
        expect(entry.density).toBeLessThanOrEqual(100);
      }
    });

    it('flowRate values should be non-negative', () => {
      for (const entry of crowdFlowData) {
        expect(entry.flowRate).toBeGreaterThanOrEqual(0);
      }
    });

    it('time entries should be in HH:MM format', () => {
      for (const entry of crowdFlowData) {
        expect(entry.time).toMatch(/^\d{2}:\d{2}$/);
      }
    });

    it('should have 7 data points', () => {
      expect(crowdFlowData).toHaveLength(7);
    });
  });
});
