import { IncidentType } from '@/types';

/**
 * Builds the prompt sent to Gemini for generating an operational playbook.
 * Kept as a pure function so prompts can be tweaked without touching API logic.
 */
export function buildPlaybookPrompt(params: {
  matchId: string;
  stadiumName: string;
  eventType: IncidentType;
  description: string;
  stadiumId: string;
}): string {
  const { matchId, stadiumName, eventType, description, stadiumId } = params;

  return `
You are an expert AI Stadium Operations Expert for the FIFA World Cup.
An incident has occurred during a match. Analyze the situation and generate a structured operational playbook in JSON format.

Match ID: ${matchId}
Stadium Name: ${stadiumName}
Event Type: ${eventType}
Incident Description: "${description}"

You must return a single JSON object (with no markdown block wrapper, pure JSON) containing exactly these keys:
{
  "title": "A short, professional title for the playbook",
  "eventType": "${eventType}",
  "stadiumId": "${stadiumId}",
  "stadiumName": "${stadiumName}",
  "problem": "Detailed description of the operational problem caused by this event",
  "rootCause": "The underlying cause of why this incident occurred or was exacerbated",
  "operationalRisk": "Specific safety, security, logistical, or brand risks if not managed",
  "recommendedActions": ["Action 1", "Action 2", "Action 3"],
  "expectedImpact": "The estimated improvement or mitigation outcome",
  "lessonsLearned": "What future matches must do to prevent this incident entirely",
  "confidenceScore": 85,
  "alternativeStrategy": "Back-up plan in case recommended actions cannot be fully executed"
}
Make sure confidenceScore is a number between 0 and 100.
`;
}
