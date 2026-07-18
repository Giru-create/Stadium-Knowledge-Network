import { Playbook, IncidentType } from '@/types';

/**
 * Calculates a mock similarity score between a scenario description and a playbook.
 * Scores range from 65 (base) to 98 (max), boosted by keyword overlap.
 */
function computeSimilarityScore(scenario: string, playbook: Playbook): number {
  const words = scenario.toLowerCase().split(' ');
  let matchCount = 0;
  for (const word of words) {
    if (playbook.problem.toLowerCase().includes(word) || playbook.title.toLowerCase().includes(word)) {
      matchCount++;
    }
  }
  return Math.min(65 + matchCount * 4, 98);
}

/**
 * Compares a custom scenario against historical playbooks of a given category.
 * Returns playbooks enriched with a `similarityScore`, sorted best-match first.
 */
export function comparePlaybooks(
  playbooks: Playbook[],
  category: IncidentType,
  scenario: string,
): (Playbook & { similarityScore: number })[] {
  return playbooks
    .filter((pb) => pb.eventType === category)
    .map((pb) => ({ ...pb, similarityScore: computeSimilarityScore(scenario, pb) }))
    .sort((a, b) => b.similarityScore - a.similarityScore);
}
