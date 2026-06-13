import { DailyCheckIn, AIAnalysis } from '@/types';
import { STORAGE_KEYS, RETENTION } from '@/lib/constants';

/**
 * Storage service for persisting check-ins and analyses locally
 * Using localStorage for privacy-first, client-side storage
 * 
 * @module Storage
 */

/**
 * Saves a daily check-in to local storage
 * Automatically manages retention (keeps last 90 days)
 * 
 * @param {DailyCheckIn} checkIn - The check-in data to save
 * 
 * @example
 * saveCheckIn(todayCheckIn);
 */
export function saveCheckIn(checkIn: DailyCheckIn): void {
  if (typeof window === 'undefined') return;

  try {
    const existing = getCheckIns();
    const updated = [checkIn, ...existing];

    // Keep last 90 days for performance
    const filtered = updated.slice(0, RETENTION.MAX_CHECKINS);

    localStorage.setItem(STORAGE_KEYS.CHECKINS, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error saving check-in:', error);
  }
}

/**
 * Retrieves all check-ins from local storage
 * Automatically parses dates from JSON
 * 
 * @returns {DailyCheckIn[]} Array of check-ins, newest first
 * 
 * @example
 * const allCheckIns = getCheckIns();
 */
export function getCheckIns(): DailyCheckIn[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.CHECKINS);
    if (!stored) return [];

    const checkIns = JSON.parse(stored) as DailyCheckIn[];

    // Convert date strings back to Date objects
    return checkIns.map((c) => ({
      ...c,
      date: new Date(c.date),
    }));
  } catch (error) {
    console.error('Error loading check-ins:', error);
    return [];
  }
}

/**
 * Gets today's check-in if it exists
 * 
 * @returns {DailyCheckIn | null} Today's check-in or null if not found
 * 
 * @example
 * const todayCheckIn = getTodayCheckIn();
 * if (todayCheckIn) {
 *   console.log('Already checked in today');
 * }
 */
export function getTodayCheckIn(): DailyCheckIn | null {
  const checkIns = getCheckIns();
  const today = new Date().toDateString();

  return checkIns.find((c) => new Date(c.date).toDateString() === today) || null;
}

/**
 * Gets recent check-ins within specified number of days
 * 
 * @param {number} [days=7] - Number of days to look back
 * @returns {DailyCheckIn[]} Array of recent check-ins
 * 
 * @example
 * const lastWeek = getRecentCheckIns(7);
 */
export function getRecentCheckIns(days: number = RETENTION.RECENT_DAYS): DailyCheckIn[] {
  const checkIns = getCheckIns();
  const cutoff = Date.now() - days * 24 * 60 * 60 * 1000;

  return checkIns.filter((c) => c.timestamp > cutoff);
}

/**
 * Saves AI analysis for a specific check-in
 * 
 * @param {string} checkInId - The check-in ID this analysis belongs to
 * @param {AIAnalysis} analysis - The AI-generated analysis
 * 
 * @example
 * saveAnalysis(checkIn.id, aiAnalysisResult);
 */
export function saveAnalysis(checkInId: string, analysis: AIAnalysis): void {
  if (typeof window === 'undefined') return;

  try {
    const existing = getAnalyses();
    existing[checkInId] = analysis;

    localStorage.setItem(STORAGE_KEYS.ANALYSES, JSON.stringify(existing));
  } catch (error) {
    console.error('Error saving analysis:', error);
  }
}

/**
 * Gets all saved analyses
 * 
 * @returns {Record<string, AIAnalysis>} Map of check-in IDs to their analyses
 */
export function getAnalyses(): Record<string, AIAnalysis> {
  if (typeof window === 'undefined') return {};

  try {
    const stored = localStorage.getItem(STORAGE_KEYS.ANALYSES);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error loading analyses:', error);
    return {};
  }
}

/**
 * Gets analysis for a specific check-in
 * 
 * @param {string} checkInId - The check-in ID
 * @returns {AIAnalysis | null} The analysis or null if not found
 * 
 * @example
 * const analysis = getAnalysisForCheckIn(checkIn.id);
 */
export function getAnalysisForCheckIn(checkInId: string): AIAnalysis | null {
  const analyses = getAnalyses();
  return analyses[checkInId] || null;
}

/**
 * Gets today's analysis if it exists
 * 
 * @returns {AIAnalysis | null} Today's analysis or null
 */
export function getTodayAnalysis(): AIAnalysis | null {
  const todayCheckIn = getTodayCheckIn();
  if (!todayCheckIn) return null;

  return getAnalysisForCheckIn(todayCheckIn.id);
}

/**
 * Calculates the current check-in streak (consecutive days)
 * 
 * @returns {number} Number of consecutive days with check-ins
 * 
 * @example
 * const streak = getStreak();
 * console.log(`${streak} day streak!`);
 */
export function getStreak(): number {
  const checkIns = getCheckIns();
  if (checkIns.length === 0) return 0;

  let streak = 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 0; i < checkIns.length; i++) {
    const checkInDate = new Date(checkIns[i].date);
    checkInDate.setHours(0, 0, 0, 0);

    const expectedDate = new Date(today);
    expectedDate.setDate(expectedDate.getDate() - i);

    if (checkInDate.getTime() === expectedDate.getTime()) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

/**
 * Clears all data from local storage
 * Used for reset or logout functionality
 * 
 * @example
 * clearAllData(); // Removes all check-ins and analyses
 */
export function clearAllData(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(STORAGE_KEYS.CHECKINS);
  localStorage.removeItem(STORAGE_KEYS.ANALYSES);
}
