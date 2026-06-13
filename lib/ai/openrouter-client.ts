import OpenAI from 'openai';

/**
 * OpenRouter client for AI-powered wellness analysis
 * Using DeepSeek V3 for high-quality structured JSON responses
 * 
 * @module OpenRouterClient
 * @see https://openrouter.ai/docs
 */

// Singleton pattern for OpenRouter client
let clientInstance: OpenAI | null = null;

/**
 * Gets or creates the OpenRouter client instance (Singleton pattern)
 * 
 * @returns {OpenAI} The OpenRouter client instance
 * @throws {Error} If OPENROUTER_API_KEY environment variable is not set
 * 
 * @example
 * const client = getOpenRouterClient();
 */
export function getOpenRouterClient(): OpenAI {
  if (!clientInstance) {
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey) {
      throw new Error('OPENROUTER_API_KEY environment variable is not configured');
    }

    clientInstance = new OpenAI({
      apiKey,
      baseURL: 'https://openrouter.ai/api/v1',
    });
  }

  return clientInstance;
}

/**
 * Available models on OpenRouter (free tier)
 * - deepseek/deepseek-chat-v3-0324:free (Recommended - Best overall)
 * - qwen/qwen-3-235b-instruct:free (Excellent reasoning)
 * - meta-llama/llama-4-scout:free (Good performance)
 */
export const RECOMMENDED_MODEL = 'deepseek/deepseek-chat-v3-0324:free';

/**
 * Call OpenRouter with a prompt and get structured JSON response
 * 
 * @param {string} prompt - The prompt to send to the AI model
 * @param {string} [model=RECOMMENDED_MODEL] - The model to use for generation
 * @returns {Promise<string>} The AI-generated response as a JSON string
 * @throws {Error} If the API call fails or no response is received
 * 
 * @example
 * const prompt = "Analyze this wellness data...";
 * const response = await callOpenRouter(prompt);
 * const analysis = JSON.parse(response);
 */
export async function callOpenRouter(
  prompt: string,
  model: string = RECOMMENDED_MODEL
): Promise<string> {
  const client = getOpenRouterClient();

  try {
    const response = await client.chat.completions.create({
      model,
      messages: [
        {
          role: 'system',
          content:
            'You are an empathetic AI wellness companion specialized in supporting students preparing for competitive exams. You provide structured, actionable wellness guidance. Always respond with valid JSON only, no markdown formatting.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4096,
      response_format: { type: 'json_object' }, // Force JSON response
    });

    const content = response.choices[0]?.message?.content;

    if (!content) {
      throw new Error('No response from OpenRouter');
    }

    return content;
  } catch (error) {
    console.error('OpenRouter API error:', error);
    throw error;
  }
}

