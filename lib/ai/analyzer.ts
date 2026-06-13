import { callOpenRouter } from './openrouter-client';
import { buildAnalysisPrompt, buildPatternDetectionPrompt } from './prompt-builder';
import { AIAnalysis, DailyCheckIn, HistoricalPattern } from '@/types';

/**
 * Analyzes a daily check-in using OpenRouter AI (DeepSeek V3)
 * Returns structured wellness assessment
 */
export async function analyzeCheckIn(
  checkIn: DailyCheckIn,
  historicalData?: DailyCheckIn[]
): Promise<AIAnalysis> {
  const prompt = buildAnalysisPrompt(checkIn, historicalData);

  try {
    const responseText = await callOpenRouter(prompt);

    // Parse JSON response
    const analysis = JSON.parse(responseText) as AIAnalysis;

    // Validation: Ensure all required fields exist
    validateAnalysis(analysis);

    return analysis;
  } catch (error) {
    console.error('Error analyzing check-in:', error);
    
    // Fallback: Return safe default response
    return createFallbackAnalysis(checkIn);
  }
}

/**
 * Detects patterns across multiple check-ins
 */
export async function detectPatterns(checkIns: DailyCheckIn[]): Promise<HistoricalPattern[]> {
  if (checkIns.length < 3) {
    return [];
  }

  const prompt = buildPatternDetectionPrompt(checkIns);

  try {
    const responseText = await callOpenRouter(prompt);
    const patterns = JSON.parse(responseText) as HistoricalPattern[];

    return patterns.filter(p => p.confidence > 60); // Only high-confidence patterns
  } catch (error) {
    console.error('Error detecting patterns:', error);
    return [];
  }
}

/**
 * Validates that the analysis has all required fields
 */
function validateAnalysis(analysis: AIAnalysis): void {
  const required = [
    'emotionSummary',
    'stressScore',
    'burnoutRisk',
    'hiddenStressTriggers',
    'thoughtPatterns',
    'recommendedActions',
    'mindfulnessExercise',
    'motivationalMessage',
    'tomorrowPlan',
    'wellnessScore',
  ];

  for (const field of required) {
    if (!(field in analysis)) {
      throw new Error(`Missing required field: ${field}`);
    }
  }
}

/**
 * Creates a safe fallback analysis if AI fails
 */
function createFallbackAnalysis(checkIn: DailyCheckIn): AIAnalysis {
  const stressLevel = checkIn.stressLevel * 10; // Convert 1-10 to 0-100

  return {
    emotionSummary: {
      primaryEmotion: checkIn.mood,
      emotionalIntensity: stressLevel,
      emotionalState: `Experiencing ${checkIn.mood} feelings`,
      confidenceLevel: 50,
    },
    stressScore: stressLevel,
    burnoutRisk: stressLevel > 70 ? 'high' : stressLevel > 40 ? 'moderate' : 'low',
    hiddenStressTriggers: [
      {
        trigger: 'Exam preparation pressure',
        severity: 'medium',
        category: 'academic',
      },
    ],
    thoughtPatterns: [],
    confidenceLevel: 50,
    recommendedActions: [
      'Take regular breaks during study sessions',
      'Maintain a consistent sleep schedule',
      'Practice deep breathing exercises',
    ],
    mindfulnessExercise: {
      title: 'Box Breathing',
      duration: 5,
      instructions: [
        'Find a comfortable seated position',
        'Breathe in for 4 counts',
        'Hold for 4 counts',
        'Exhale for 4 counts',
        'Hold for 4 counts',
        'Repeat for 5 minutes',
      ],
      breathingPattern: {
        inhale: 4,
        hold: 4,
        exhale: 4,
        cycles: 5,
      },
    },
    motivationalMessage: `You're doing your best preparing for ${checkIn.exam}. Remember, consistent effort matters more than perfection.`,
    tomorrowPlan: {
      morning: ['7:00 AM - Wake up and hydrate', '7:30 AM - Light stretching'],
      studyBlocks: ['9:00 AM - Study session 1', '2:00 PM - Study session 2'],
      breaks: ['11:00 AM - Break', '4:00 PM - Break'],
      evening: ['6:00 PM - Exercise or walk', '7:00 PM - Dinner'],
      bedtimeRoutine: ['10:00 PM - Wind down', '10:30 PM - Sleep'],
    },
    wellnessScore: Math.max(0, 100 - stressLevel),
    sleepAnalysis: checkIn.sleepHours < 6 ? 'Sleep is below recommended levels' : 'Sleep duration is adequate',
    studyLifeBalance: checkIn.studyHours > 10 ? 'Consider reducing study hours to prevent burnout' : 'Study hours seem manageable',
    emergencyConcern: false,
  };
}
