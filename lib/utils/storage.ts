import { DailyCheckIn, AIAnalysis } from '@/types';

// Local storage keys
const CHECKINS_KEY = 'mindbloom_checkins';
const ANALYSES_KEY = 'mindbloom_analyses';

/**
 * Storage service for persisting check-ins and analyses locally
 * Using localStorage for simplicity - can be upgraded to IndexedDB for larger datasets
 */

export function saveCheckIn(checkIn: DailyCheckIn): void {
  if (typeof window === 'undefined') return;

  try {
    const existing = getCheckIns();
    const updated = [checkIn, ...existing];
    
    // Keep last 90 days
    const filtered = updated.slice(0, 90);
    
    localStorage.setItem(CHECKINS_KEY, JSON.stringify(filtered));
  } catch (error) {
    console.error('Error saving check-in:', error);
  }
}

export function getCheckIns(): DailyCheckIn[] {
  if (typeof window === 'undefined') return [];

  try {
    const stored = localStorage.getItem(CHECKINS_KEY);
    if (!stored) return [];

    const checkIns = JSON.parse(stored) as DailyCheckIn[];
    
    // Convert date strings back to Date objects
    return checkIns.map(c => ({
      ...c,
      date: new Date(c.date),
    }));
  } catch (error) {
    console.error('Error loading check-ins:', error);
    return [];
  }
}

export function getTodayCheckIn(): DailyCheckIn | null {
  const checkIns = getCheckIns();
  const today = new Date().toDateString();
  
  return checkIns.find(c => new Date(c.date).toDateString() === today) || null;
}

export function getRecentCheckIns(days: number = 7): DailyCheckIn[] {
  const checkIns = getCheckIns();
  const cutoff = Date.now() - (days * 24 * 60 * 60 * 1000);
  
  return checkIns.filter(c => c.timestamp > cutoff);
}

export function saveAnalysis(checkInId: string, analysis: AIAnalysis): void {
  if (typeof window === 'undefined') return;

  try {
    const existing = getAnalyses();
    existing[checkInId] = analysis;
    
    localStorage.setItem(ANALYSES_KEY, JSON.stringify(existing));
  } catch (error) {
    console.error('Error saving analysis:', error);
  }
}

export function getAnalyses(): Record<string, AIAnalysis> {
  if (typeof window === 'undefined') return {};

  try {
    const stored = localStorage.getItem(ANALYSES_KEY);
    return stored ? JSON.parse(stored) : {};
  } catch (error) {
    console.error('Error loading analyses:', error);
    return {};
  }
}

export function getAnalysisForCheckIn(checkInId: string): AIAnalysis | null {
  const analyses = getAnalyses();
  return analyses[checkInId] || null;
}

export function getTodayAnalysis(): AIAnalysis | null {
  const todayCheckIn = getTodayCheckIn();
  if (!todayCheckIn) return null;
  
  return getAnalysisForCheckIn(todayCheckIn.id);
}

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

export function clearAllData(): void {
  if (typeof window === 'undefined') return;

  localStorage.removeItem(CHECKINS_KEY);
  localStorage.removeItem(ANALYSES_KEY);
}
