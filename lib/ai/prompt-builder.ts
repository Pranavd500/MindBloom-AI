import { DailyCheckIn } from '@/types';

/**
 * Builds a structured prompt for Gemini to analyze student wellness data
 * This is designed to produce consistent, structured JSON output
 */
export function buildAnalysisPrompt(checkIn: DailyCheckIn, historicalData?: DailyCheckIn[]): string {
  const moodEmoji = {
    excited: '🤩',
    happy: '😊',
    neutral: '😐',
    anxious: '😰',
    sad: '😔',
    overwhelmed: '😫',
  };

  const prompt = `You are an empathetic AI wellness companion specialized in supporting students preparing for competitive exams. Your role is to analyze their emotional state, identify hidden stress patterns, and provide personalized, actionable wellness guidance.

## Today's Check-in Data
- Date: ${new Date(checkIn.date).toLocaleDateString()}
- Mood: ${checkIn.mood} ${moodEmoji[checkIn.mood]}
- Stress Level: ${checkIn.stressLevel}/10
- Sleep: ${checkIn.sleepHours} hours
- Study Time: ${checkIn.studyHours} hours
- Water Intake: ${checkIn.waterIntake} glasses
- Energy Level: ${checkIn.energyLevel}/10
- Preparing for: ${checkIn.exam}

## Journal Entry
"${checkIn.journalEntry}"

${historicalData && historicalData.length > 0 ? `
## Historical Context (Last ${historicalData.length} entries)
${historicalData.map((entry, idx) => `
Entry ${idx + 1} (${new Date(entry.date).toLocaleDateString()}):
- Mood: ${entry.mood}, Stress: ${entry.stressLevel}/10, Sleep: ${entry.sleepHours}h, Study: ${entry.studyHours}h
- Journal: "${entry.journalEntry.substring(0, 150)}..."
`).join('\n')}
` : ''}

## Your Task
Analyze this data deeply and provide a comprehensive wellness assessment. Look beyond surface-level observations to identify:

1. **Emotional Patterns**: What's really going on emotionally? What are the underlying feelings?
2. **Hidden Stress Triggers**: What specific factors (not just "exam pressure") are causing stress?
3. **Behavioral Patterns**: Are there concerning patterns in sleep, study habits, or self-care?
4. **Thought Patterns**: What cognitive patterns emerge (perfectionism, comparison, catastrophizing)?
5. **Risk Assessment**: Is there any concerning language indicating crisis, self-harm, or severe distress?

## Critical Safety Protocol
If the journal contains ANY indication of:
- Self-harm ideation or behavior
- Suicidal thoughts or hopelessness
- Severe emotional crisis
- Extreme distress beyond normal exam stress

Set "emergencyConcern": true and provide appropriate supportive messaging.

## Output Format
You MUST respond with ONLY valid JSON. No markdown, no explanations, no additional text.

{
  "emotionSummary": {
    "primaryEmotion": "string (specific emotion, not just mood)",
    "emotionalIntensity": number (0-100),
    "emotionalState": "string (brief description)",
    "confidenceLevel": number (0-100, student's self-confidence)
  },
  "stressScore": number (0-100, composite stress assessment),
  "burnoutRisk": "low" | "moderate" | "high" | "critical",
  "hiddenStressTriggers": [
    {
      "trigger": "string (specific, actionable trigger)",
      "severity": "low" | "medium" | "high",
      "category": "academic" | "social" | "physical" | "environmental"
    }
  ],
  "thoughtPatterns": [
    {
      "pattern": "string (specific cognitive pattern observed)",
      "type": "negative" | "positive" | "neutral",
      "frequency": "occasional" | "recurring" | "persistent"
    }
  ],
  "confidenceLevel": number (0-100),
  "recommendedActions": [
    "string (specific, actionable recommendation)"
  ],
  "mindfulnessExercise": {
    "title": "string",
    "duration": number (minutes),
    "instructions": ["string", "string", ...],
    "breathingPattern": {
      "inhale": number (seconds),
      "hold": number (seconds),
      "exhale": number (seconds),
      "cycles": number
    }
  },
  "motivationalMessage": "string (personalized, empathetic, contextual to their exam and situation)",
  "tomorrowPlan": {
    "morning": ["string (time + activity)"],
    "studyBlocks": ["string (time + activity)"],
    "breaks": ["string (time + activity)"],
    "evening": ["string (time + activity)"],
    "bedtimeRoutine": ["string (time + activity)"]
  },
  "wellnessScore": number (0-100, holistic wellness assessment),
  "sleepAnalysis": "string (brief analysis of sleep patterns and impact)",
  "studyLifeBalance": "string (brief analysis of balance and recommendations)",
  "emergencyConcern": boolean,
  "emergencyMessage": "string (only if emergencyConcern is true)"
}

## Guidelines
- Be empathetic but honest
- Provide specific, actionable advice (not generic platitudes)
- Consider the exam they're preparing for (${checkIn.exam}) in your context
- If sleep is low, stress is high, emphasize recovery
- Identify patterns that the student might not consciously recognize
- Make the motivational message feel personal and genuine
- Create a realistic tomorrow plan based on their current state
- The mindfulness exercise should match their stress level and available time

Return ONLY the JSON object. No other text.`;

  return prompt;
}

/**
 * Builds a prompt for detecting patterns across multiple check-ins
 */
export function buildPatternDetectionPrompt(checkIns: DailyCheckIn[]): string {
  if (checkIns.length < 3) {
    return '';
  }

  const prompt = `You are analyzing ${checkIns.length} days of wellness data for a student preparing for competitive exams.

## Data Summary
${checkIns.map((entry, idx) => `
Day ${idx + 1} (${new Date(entry.date).toLocaleDateString()}):
- Mood: ${entry.mood}, Stress: ${entry.stressLevel}/10
- Sleep: ${entry.sleepHours}h, Study: ${entry.studyHours}h, Energy: ${entry.energyLevel}/10
- Journal snippet: "${entry.journalEntry.substring(0, 200)}..."
`).join('\n')}

## Your Task
Identify meaningful behavioral and emotional patterns across these entries. Look for:
- Correlations (e.g., "stress increases when sleep drops below 6 hours")
- Recurring triggers or themes
- Behavioral trends (improving, declining, cyclical)
- Non-obvious insights the student might miss

Return ONLY valid JSON (no markdown, no other text):

[
  {
    "pattern": "string (specific pattern observed)",
    "insight": "string (what this means for the student)",
    "recommendation": "string (specific, actionable suggestion)",
    "confidence": number (0-100, how confident you are in this pattern)
  }
]

Provide 2-4 high-quality patterns. Focus on actionable insights.`;

  return prompt;
}
