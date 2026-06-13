import { NextRequest, NextResponse } from 'next/server';
import { callOpenRouter } from '@/lib/ai/openrouter-client';

export async function POST(request: NextRequest) {
  try {
    const { message, context, conversationHistory } = await request.json();

    // Build contextual prompt
    const systemPrompt = `You are an empathetic AI Wellness Coach supporting students preparing for competitive exams in India. You provide brief, actionable guidance focused on mental wellness.

User Context:
- Has completed check-in: ${context.hasCheckIn ? 'Yes' : 'No'}
- Current wellness score: ${context.wellness || 'N/A'}
- Stress level: ${context.stress ? `${context.stress}/10` : 'N/A'}
- Burnout risk: ${context.burnoutRisk || 'N/A'}
- Preparing for: ${context.exam || 'Unknown'}
- Recent check-ins: ${context.recentCount} in last 7 days

Guidelines:
1. Keep responses under 100 words (be concise and actionable)
2. Be warm, supportive, and empathetic
3. Provide specific, practical advice (not generic)
4. Reference their exam preparation context
5. If they mention crisis/self-harm, provide emergency resources
6. Focus on: stress management, study techniques, sleep, balance
7. Never diagnose or claim to be a therapist
8. Encourage healthy habits without being preachy

Response style: Supportive friend + knowledgeable coach`;

    // Build conversation context
    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.map((msg: any) => ({
        role: msg.role,
        content: msg.content,
      })),
      { role: 'user', content: message },
    ];

    // Get AI response
    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'deepseek/deepseek-chat-v3-0324:free',
        messages,
        temperature: 0.8, // More conversational
        max_tokens: 300,
      }),
    });

    if (!response.ok) {
      throw new Error('AI service unavailable');
    }

    const data = await response.json();
    const aiResponse = data.choices[0]?.message?.content;

    if (!aiResponse) {
      throw new Error('No response from AI');
    }

    return NextResponse.json({ response: aiResponse });
  } catch (error) {
    console.error('Coach API error:', error);

    // Fallback response
    const fallbackResponse =
      "I'm here to support you. Remember: it's okay to feel stressed during exam prep. Take it one day at a time. Would you like some specific tips for managing stress or improving focus?";

    return NextResponse.json({ response: fallbackResponse });
  }
}
