// Core domain types for MindBloom AI

export type MoodType = 'excited' | 'happy' | 'neutral' | 'anxious' | 'sad' | 'overwhelmed';

export type ExamType = 'JEE' | 'NEET' | 'UPSC' | 'CAT' | 'GATE' | 'CUET' | 'Other';

export type BurnoutRisk = 'low' | 'moderate' | 'high' | 'critical';

export interface DailyCheckIn {
  id: string;
  date: Date;
  mood: MoodType;
  stressLevel: number; // 1-10
  sleepHours: number;
  studyHours: number;
  waterIntake: number; // glasses
  energyLevel: number; // 1-10
  exam: ExamType;
  journalEntry: string;
  timestamp: number;
}

export interface EmotionSummary {
  primaryEmotion: string;
  emotionalIntensity: number; // 0-100
  emotionalState: string;
  confidenceLevel: number; // 0-100
}

export interface StressTrigger {
  trigger: string;
  severity: 'low' | 'medium' | 'high';
  category: 'academic' | 'social' | 'physical' | 'environmental';
}

export interface ThoughtPattern {
  pattern: string;
  type: 'negative' | 'positive' | 'neutral';
  frequency: 'occasional' | 'recurring' | 'persistent';
}

export interface MindfulnessExercise {
  title: string;
  duration: number; // minutes
  instructions: string[];
  breathingPattern?: {
    inhale: number;
    hold: number;
    exhale: number;
    cycles: number;
  };
}

export interface WellnessPlan {
  morning: string[];
  studyBlocks: string[];
  breaks: string[];
  evening: string[];
  bedtimeRoutine: string[];
}

export interface AIAnalysis {
  emotionSummary: EmotionSummary;
  stressScore: number; // 0-100
  burnoutRisk: BurnoutRisk;
  hiddenStressTriggers: StressTrigger[];
  thoughtPatterns: ThoughtPattern[];
  confidenceLevel: number; // 0-100
  recommendedActions: string[];
  mindfulnessExercise: MindfulnessExercise;
  motivationalMessage: string;
  tomorrowPlan: WellnessPlan;
  wellnessScore: number; // 0-100
  sleepAnalysis: string;
  studyLifeBalance: string;
  emergencyConcern: boolean;
  emergencyMessage?: string;
}

export interface HistoricalPattern {
  pattern: string;
  insight: string;
  recommendation: string;
  confidence: number; // 0-100
}

export interface DashboardData {
  todayCheckIn: DailyCheckIn | null;
  todayAnalysis: AIAnalysis | null;
  weeklyTrend: {
    stress: number[];
    mood: number[];
    sleep: number[];
    wellness: number[];
    dates: string[];
  };
  historicalPatterns: HistoricalPattern[];
  streakDays: number;
}
