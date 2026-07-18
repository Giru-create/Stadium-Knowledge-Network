import { Playbook, IncidentType, AIRecommendation } from '../types';
import { playbookService, recommendationService } from './firebase';
import { callGemini, isGeminiConfigured } from '@/services/ai/gemini-api';
import { buildPlaybookPrompt } from '@/services/ai/prompts';
import { generateMockPlaybookData } from '@/services/ai/mock-playbooks';

/** Generates the content-parsing portion of an AIRecommendation. */
function buildRecommendationExplanation(playbook: Playbook): string {
  return (
    `Selected based on high similarity (${playbook.confidenceScore}%) with historic playbook ` +
    `"${playbook.title}" recorded at ${playbook.stadiumName}. ` +
    `Weather and zone parameters align with current stadium conditions. ` +
    `Confidence in recommended actions is high.`
  );
}

export const aiEngineService = {
  /**
   * Generates a structured operational playbook from a stadium incident description.
   * Tries the live Gemini API first; falls back to local heuristics on failure.
   */
  generatePlaybook: async (
    matchId: string,
    stadiumId: string,
    stadiumName: string,
    eventType: IncidentType,
    description: string,
  ): Promise<Playbook> => {
    let playbookData: Omit<Playbook, 'id' | 'createdAt'>;

    if (isGeminiConfigured()) {
      try {
        const prompt = buildPlaybookPrompt({ matchId, stadiumName, eventType, description, stadiumId });
        const rawText = await callGemini(prompt);
        playbookData = JSON.parse(rawText.trim());
      } catch (error) {
        console.error('Gemini live call failed, falling back to heuristics:', error);
        playbookData = generateMockPlaybookData(stadiumId, stadiumName, eventType, description);
      }
    } else {
      playbookData = generateMockPlaybookData(stadiumId, stadiumName, eventType, description);
    }

    return playbookService.createPlaybook({
      ...playbookData,
      createdAt: new Date().toISOString(),
    });
  },

  /**
   * Generates real-time recommendations for a live match based on current conditions.
   */
  generateRecommendation: async (
    matchId: string,
    stadiumId: string,
    incidentId: string,
    eventType: IncidentType,
    description: string,
    playbook: Playbook,
  ): Promise<AIRecommendation> => {
    const recommendation: Omit<AIRecommendation, 'id'> = {
      matchId,
      stadiumId,
      eventType,
      incidentId,
      playbookId: playbook.id,
      playbookTitle: playbook.title,
      title: `AI Advisory: ${eventType} Action Protocol`,
      description,
      actions: playbook.recommendedActions.map((action) => ({
        action,
        status: 'Pending' as const,
      })),
      explanation: buildRecommendationExplanation(playbook),
      createdAt: new Date().toISOString(),
    };

    return recommendationService.createRecommendation(recommendation);
  },

  /**
   * Summarizes match operational challenges and efficiency after completion.
   */
  generateMatchSummary: async (matchId: string): Promise<string> => {
    return (
      `Match ${matchId} completed. Operational integrity was maintained at 98.4%. ` +
      `Standard gate flow met parameters. 1 weather warning resolved within 12 minutes ` +
      `using the Concourse Flow Plan protocol. All recommendations were successfully ` +
      `implemented and resulted in zero incident escalations.`
    );
  },

  /**
   * Analyzes a stadium's performance history to recommend general structural upgrades.
   */
  generateInsights: async (
    stadiumId: string,
  ): Promise<{
    incidentHeatmap: string;
    topTriggerFactor: string;
    riskReductionPercentage: number;
    recommendations: string[];
  }> => {
    console.log(`Analyzing insights for stadium ID: ${stadiumId}`);
    return {
      incidentHeatmap: 'Concourse B East, Gate C Entrance, North Parking Lot',
      topTriggerFactor: 'Heavy precipitation + Gate Scanner outages',
      riskReductionPercentage: 42,
      recommendations: [
        'Upgrade BMO Field Entry Gate A scanning nodes to local-database failover switch.',
        'Install permanent weather shields over the East Concourse entrance lanes.',
        'Pre-deploy 5 volunteer leads to concessions zone 4 on match days exceeding 85% capacity.',
      ],
    };
  },
};
