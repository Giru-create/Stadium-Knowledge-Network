/** Gemini API response shape (simplified). */
interface GeminiCandidate {
  content: { parts: { text: string }[] };
}

interface GeminiResponse {
  candidates?: GeminiCandidate[];
}

const API_BASE = 'https://generativelanguage.googleapis.com/v1beta/models';
const MODEL_NAME = 'gemini-1.5-flash';

/** Maximum time (ms) to wait for the Gemini API before aborting. */
const REQUEST_TIMEOUT_MS = 30_000;

/**
 * Sends a text prompt to the Gemini API and returns the raw text response.
 * Uses the `x-goog-api-key` header instead of a URL query parameter
 * to avoid key leakage in logs, referer headers, and browser history.
 *
 * @throws {Error} If the API key is missing or the request fails.
 */
export async function callGemini(prompt: string): Promise<string> {
  const apiKey = process.env.NEXT_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('AI service is not configured');
  }

  const url = `${API_BASE}/${MODEL_NAME}:generateContent`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-goog-api-key': apiKey,
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: { responseMimeType: 'application/json' },
      }),
      signal: controller.signal,
    });

    if (!response.ok) {
      const status = response.status;
      if (status === 429) throw new Error('AI service is rate-limited. Please try again later.');
      if (status >= 500) throw new Error('AI service is temporarily unavailable.');
      throw new Error('AI request failed');
    }

    const json: GeminiResponse = await response.json();

    // Guard against empty/filtered responses from safety filters
    const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) {
      throw new Error('AI returned an empty response');
    }

    return text;
  } catch (err: unknown) {
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new Error('AI request timed out. Please try again.');
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }
}

/** Returns true if a Gemini API key is available in the environment. */
export function isGeminiConfigured(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_GEMINI_API_KEY);
}
