import { describe, it, expect, vi, beforeEach } from 'vitest';
import { isGeminiConfigured } from '@/services/ai/gemini-api';

describe('gemini-api', () => {
  beforeEach(() => {
    vi.unstubAllGlobals();
  });

  describe('isGeminiConfigured', () => {
    it('should return false when env var is not set', () => {
      delete process.env.NEXT_PUBLIC_GEMINI_API_KEY;
      expect(isGeminiConfigured()).toBe(false);
    });

    it('should return true when env var is set', () => {
      process.env.NEXT_PUBLIC_GEMINI_API_KEY = 'test-key';
      expect(isGeminiConfigured()).toBe(true);
    });
  });
});
