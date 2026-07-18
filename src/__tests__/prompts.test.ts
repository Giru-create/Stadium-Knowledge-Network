import { describe, it, expect } from 'vitest';
import { buildPlaybookPrompt } from '@/services/ai/prompts';

describe('buildPlaybookPrompt', () => {
  const baseParams = {
    matchId: 'match-001',
    stadiumName: 'Wembley Stadium',
    eventType: 'Heavy Rain' as const,
    description: 'Heavy rainfall during second half',
    stadiumId: 'stadium-001',
  };

  it('should return a string containing the match ID', () => {
    const prompt = buildPlaybookPrompt(baseParams);
    expect(prompt).toContain('match-001');
  });

  it('should return a string containing the stadium name', () => {
    const prompt = buildPlaybookPrompt(baseParams);
    expect(prompt).toContain('Wembley Stadium');
  });

  it('should return a string containing the event type', () => {
    const prompt = buildPlaybookPrompt(baseParams);
    expect(prompt).toContain('Heavy Rain');
  });

  it('should return a string containing the description', () => {
    const prompt = buildPlaybookPrompt(baseParams);
    expect(prompt).toContain('Heavy rainfall during second half');
  });

  it('should return a string containing the stadium ID', () => {
    const prompt = buildPlaybookPrompt(baseParams);
    expect(prompt).toContain('stadium-001');
  });

  it('should contain JSON structure instructions', () => {
    const prompt = buildPlaybookPrompt(baseParams);
    expect(prompt).toContain('JSON');
    expect(prompt).toContain('title');
    expect(prompt).toContain('confidenceScore');
  });

  it('should handle different event types', () => {
    const prompt = buildPlaybookPrompt({ ...baseParams, eventType: 'Medical Emergency' });
    expect(prompt).toContain('Medical Emergency');
  });

  it('should handle empty description', () => {
    const prompt = buildPlaybookPrompt({ ...baseParams, description: '' });
    expect(prompt).toContain('Incident Description: ""');
  });
});
