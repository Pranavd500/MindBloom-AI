/**
 * Application-wide constants
 * Centralized configuration for maintainability
 */

/**
 * Local storage keys used throughout the application
 */
export const STORAGE_KEYS = {
  CHECKINS: 'mindbloom_checkins',
  ANALYSES: 'mindbloom_analyses',
  PATTERNS: 'mindbloom_patterns',
} as const;

/**
 * Data retention limits
 */
export const RETENTION = {
  MAX_CHECKINS: 90, // Keep last 90 days
  RECENT_DAYS: 7, // Default for recent check-ins
  MIN_PATTERN_DETECTION: 3, // Minimum check-ins for pattern detection
} as const;

/**
 * Validation limits
 */
export const VALIDATION = {
  JOURNAL_MIN_LENGTH: 10,
  JOURNAL_MAX_LENGTH: 2000,
  STRESS_MIN: 1,
  STRESS_MAX: 10,
  ENERGY_MIN: 1,
  ENERGY_MAX: 10,
  SLEEP_MIN: 0,
  SLEEP_MAX: 24,
  STUDY_MIN: 0,
  STUDY_MAX: 24,
  WATER_MIN: 0,
  WATER_MAX: 20,
} as const;

/**
 * AI configuration
 */
export const AI_CONFIG = {
  MODEL: 'deepseek/deepseek-chat-v3-0324:free',
  TEMPERATURE: 0.7,
  MAX_TOKENS: 4096,
  MIN_PATTERN_CONFIDENCE: 60,
} as const;

/**
 * Emergency resources
 */
export const EMERGENCY_RESOURCES = {
  CRISIS_HELPLINE: '988',
  CRISIS_HOTLINE: '1-800-273-8255',
  TEXT_LINE: '741741',
  TEXT_KEYWORD: 'HELLO',
  INTERNATIONAL_URL: 'https://findahelpline.com',
} as const;

/**
 * Mood emoji mappings
 */
export const MOOD_EMOJIS = {
  excited: '🤩',
  happy: '😊',
  neutral: '😐',
  anxious: '😰',
  sad: '😔',
  overwhelmed: '😫',
} as const;

/**
 * Exam full names
 */
export const EXAM_NAMES = {
  JEE: 'JEE (Engineering)',
  NEET: 'NEET (Medical)',
  UPSC: 'UPSC (Civil Services)',
  CAT: 'CAT (Management)',
  GATE: 'GATE (Graduate)',
  CUET: 'CUET (University)',
  Other: 'Other',
} as const;
