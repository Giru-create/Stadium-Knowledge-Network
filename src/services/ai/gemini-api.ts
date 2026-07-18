/** Gemini API response shape (simplified). */
interface GeminiCandidate {
  content: { parts: { text: string }[] };
}

interface GeminiResponse {
  candidates: GeminiCandidate[];
}

const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const MODEL_NAME = 'gemini-1.5-flash';

/**
 * Sends a text prompt to the Gemini API and returns the raw text response.
 * @throws {Error} If the API key is missing or the request fails.
 */
export async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('NEXT_PUBLIC_GEMINI_API_KEY is not configured');
  }

  const url = `${API_BASE}/${MODEL_NAME}:generateContent?key=${apiKey}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: prompt }] }],
      generationConfig: { responseMimeType: 'application/json' },
    }),
  });

  if (!response.ok) {
    throw new Error(`Gemini API responded with status ${response.status}`);
  }

  const json: GeminiResponse = await response.json();
  return json.candidates[0].content.parts[0].text;
}

/** Returns true if a Gemini API key is available in the environment. */
export function isGeminiConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
}
