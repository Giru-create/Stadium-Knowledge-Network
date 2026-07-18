import { describe, it, expect, vi, beforeEach } from 'vitest';

// Mock Firebase services
vi.mock('../lib/firebase', () => ({
  playbookService: {
    createPlaybook: vi.fn((data) => Promise.resolve({ id: 'test-playbook-id', ...data })),
  },
  recommendationService: {
    createRecommendation: vi.fn((data) => Promise.resolve({ id: 'test-recommendation-id', ...data })),
  },
}));

import { aiEngineService } from '../lib/gemini';

describe('Gemini AI Edge Cases', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  });

  describe('generatePlaybook', () => {
    it('should use fallback when API key is missing', async () => {
      const result = await aiEngineService.generatePlaybook(
        'm1', 's1', 'Stadium A', 'Heavy Rain', 'Heavy rain during match'
      );
      expect(result).toBeDefined();
      expect(result.id).toBe('test-playbook-id');
      expect(result.eventType).toBe('Heavy Rain');
    });

    it('should use fallback when API fetch fails', async () => {
      process.env.NEXT_PUBLIC_GEMINI_API_KEY = 'test-key';
      vi.resetModules();

      global.fetch = vi.fn(() => Promise.resolve({ ok: false, status: 500 })) as unknown as typeof fetch;

      const mod = await import('../lib/gemini');
      const result = await mod.aiEngineService.generatePlaybook(
        'm1', 's1', 'Test Stadium', 'Power Failure', 'Lights went out'
      );
      expect(result).toBeDefined();
      expect(result.eventType).toBe('Power Failure');
    });

    it('should handle invalid JSON from API gracefully', async () => {
      process.env.NEXT_PUBLIC_GEMINI_API_KEY = 'test-key';
      vi.resetModules();

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({
            candidates: [{ content: { parts: [{ text: 'not valid json {{{' }] } }],
          }),
        })
      ) as unknown as typeof fetch;

      const mod = await import('../lib/gemini');
      const result = await mod.aiEngineService.generatePlaybook(
        'm1', 's1', 'Test Stadium', 'Large Crowd', 'Crowd surge'
      );
      expect(result).toBeDefined();
      expect(result.eventType).toBe('Large Crowd');
    });

    it('should handle empty API response', async () => {
      process.env.NEXT_PUBLIC_GEMINI_API_KEY = 'test-key';
      vi.resetModules();

      global.fetch = vi.fn(() =>
        Promise.resolve({
          ok: true,
          json: () => Promise.resolve({ candidates: [] }),
        })
      ) as unknown as typeof fetch;

      const mod = await import('../lib/gemini');
      const result = await mod.aiEngineService.generatePlaybook(
        'm1', 's1', 'Test Stadium', 'Medical Emergency', 'Fan collapse'
      );
      expect(result).toBeDefined();
    });

    it('should handle network timeout', async () => {
      process.env.NEXT_PUBLIC_GEMINI_API_KEY = 'test-key';
      vi.resetModules();

      global.fetch = vi.fn(() => Promise.reject(new DOMException('Aborted', 'AbortError'))) as unknown as typeof fetch;

      const mod = await import('../lib/gemini');
      const result = await mod.aiEngineService.generatePlaybook(
        'm1', 's1', 'Test Stadium', 'Food Queue', 'Long queue'
      );
      expect(result).toBeDefined();
    });
  });

  describe('generateRecommendation', () => {
    it('should create recommendation with correct structure', async () => {
      const playbook = {
        id: 'pb1',
        title: 'Safety Protocol',
        stadiumName: 'Test Stadium',
        confidenceScore: 90,
        recommendedActions: ['Deploy security', 'Open gates'],
      } as unknown as import('@/types').Playbook;

      const result = await aiEngineService.generateRecommendation(
        'm1', 's1', 'i1', 'Large Crowd', 'Crowd increasing', playbook
      );

      expect(result).toBeDefined();
      expect(result.id).toBe('test-recommendation-id');
      expect(result.title).toContain('AI Advisory');
      expect(result.actions).toHaveLength(2);
      expect(result.actions[0].status).toBe('Pending');
    });

    it('should handle playbook with empty actions', async () => {
      const playbook = {
        id: 'pb1',
        title: 'Empty Protocol',
        stadiumName: 'Test Stadium',
        confidenceScore: 70,
        recommendedActions: [],
      } as unknown as import('@/types').Playbook;

      const result = await aiEngineService.generateRecommendation(
        'm1', 's1', 'i1', 'Heavy Rain', 'Rain', playbook
      );
      expect(result.actions).toHaveLength(0);
    });
  });

  describe('generateMatchSummary', () => {
    it('should include match ID in summary', async () => {
      const result = await aiEngineService.generateMatchSummary('match-123');
      expect(result).toContain('match-123');
    });

    it('should return a non-empty string', async () => {
      const result = await aiEngineService.generateMatchSummary('m1');
      expect(result.length).toBeGreaterThan(0);
    });
  });

  describe('generateInsights', () => {
    it('should return object with required fields', async () => {
      const result = await aiEngineService.generateInsights('s1');
      expect(result).toHaveProperty('incidentHeatmap');
      expect(result).toHaveProperty('topTriggerFactor');
      expect(result).toHaveProperty('riskReductionPercentage');
      expect(result).toHaveProperty('recommendations');
    });

    it('should return non-empty recommendations array', async () => {
      const result = await aiEngineService.generateInsights('s1');
      expect(result.recommendations.length).toBeGreaterThan(0);
    });

    it('should return a positive risk reduction percentage', async () => {
      const result = await aiEngineService.generateInsights('s1');
      expect(result.riskReductionPercentage).toBeGreaterThan(0);
    });
  });
});
