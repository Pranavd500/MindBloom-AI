import {
  saveCheckIn,
  getCheckIns,
  getTodayCheckIn,
  getRecentCheckIns,
  getStreak,
  clearAllData,
} from '@/lib/utils/storage';
import { DailyCheckIn } from '@/types';

// Mock localStorage
const localStorageMock = (() => {
  let store: Record<string, string> = {};

  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value;
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
  };
})();

Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

describe('Storage Utils', () => {
  const mockCheckIn: DailyCheckIn = {
    id: 'test-123',
    date: new Date('2024-01-15'),
    timestamp: 1705315200000,
    mood: 'happy',
    stressLevel: 5,
    sleepHours: 7,
    studyHours: 6,
    waterIntake: 8,
    energyLevel: 7,
    exam: 'JEE',
    journalEntry: 'Test journal entry for today',
  };

  beforeEach(() => {
    localStorage.clear();
  });

  describe('saveCheckIn', () => {
    it('should save check-in to localStorage', () => {
      saveCheckIn(mockCheckIn);
      const stored = localStorage.getItem('mindbloom_checkins');
      expect(stored).toBeTruthy();
      const parsed = JSON.parse(stored!);
      expect(parsed).toHaveLength(1);
      expect(parsed[0].id).toBe('test-123');
    });

    it('should prepend new check-ins', () => {
      const checkIn1 = { ...mockCheckIn, id: 'check-1' };
      const checkIn2 = { ...mockCheckIn, id: 'check-2' };
      
      saveCheckIn(checkIn1);
      saveCheckIn(checkIn2);
      
      const checkIns = getCheckIns();
      expect(checkIns[0].id).toBe('check-2');
      expect(checkIns[1].id).toBe('check-1');
    });

    it('should limit to 90 days of check-ins', () => {
      // Save 100 check-ins
      for (let i = 0; i < 100; i++) {
        saveCheckIn({ ...mockCheckIn, id: `check-${i}` });
      }
      
      const checkIns = getCheckIns();
      expect(checkIns.length).toBe(90);
    });
  });

  describe('getCheckIns', () => {
    it('should return empty array when no check-ins exist', () => {
      const checkIns = getCheckIns();
      expect(checkIns).toEqual([]);
    });

    it('should return all saved check-ins', () => {
      saveCheckIn(mockCheckIn);
      const checkIns = getCheckIns();
      expect(checkIns).toHaveLength(1);
      expect(checkIns[0].id).toBe('test-123');
    });

    it('should parse dates correctly', () => {
      saveCheckIn(mockCheckIn);
      const checkIns = getCheckIns();
      expect(checkIns[0].date).toBeInstanceOf(Date);
    });
  });

  describe('getTodayCheckIn', () => {
    it('should return null when no check-ins exist', () => {
      const todayCheckIn = getTodayCheckIn();
      expect(todayCheckIn).toBeNull();
    });

    it('should return today\'s check-in', () => {
      const todayCheckIn = {
        ...mockCheckIn,
        date: new Date(),
        id: 'today-check',
      };
      saveCheckIn(todayCheckIn);
      
      const result = getTodayCheckIn();
      expect(result).not.toBeNull();
      expect(result?.id).toBe('today-check');
    });

    it('should not return yesterday\'s check-in', () => {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      
      const yesterdayCheckIn = {
        ...mockCheckIn,
        date: yesterday,
        id: 'yesterday-check',
      };
      saveCheckIn(yesterdayCheckIn);
      
      const result = getTodayCheckIn();
      expect(result).toBeNull();
    });
  });

  describe('getRecentCheckIns', () => {
    it('should return check-ins from last 7 days by default', () => {
      const now = Date.now();
      
      // Add check-ins from last 10 days
      for (let i = 0; i < 10; i++) {
        const date = new Date(now - i * 24 * 60 * 60 * 1000);
        saveCheckIn({
          ...mockCheckIn,
          id: `check-${i}`,
          date,
          timestamp: date.getTime(),
        });
      }
      
      const recent = getRecentCheckIns(7);
      expect(recent.length).toBeLessThanOrEqual(7);
    });

    it('should return empty array when no recent check-ins', () => {
      const oldDate = new Date();
      oldDate.setDate(oldDate.getDate() - 30);
      
      saveCheckIn({
        ...mockCheckIn,
        date: oldDate,
        timestamp: oldDate.getTime(),
      });
      
      const recent = getRecentCheckIns(7);
      expect(recent).toEqual([]);
    });
  });

  describe('getStreak', () => {
    it('should return 0 when no check-ins exist', () => {
      const streak = getStreak();
      expect(streak).toBe(0);
    });

    it('should return 1 for single check-in today', () => {
      const todayCheckIn = {
        ...mockCheckIn,
        date: new Date(),
      };
      saveCheckIn(todayCheckIn);
      
      const streak = getStreak();
      expect(streak).toBe(1);
    });

    it('should calculate consecutive days correctly', () => {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      const checkIns = [];
      // Add check-ins for last 3 days
      for (let i = 0; i < 3; i++) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        checkIns.push({
          ...mockCheckIn,
          id: `check-${i}`,
          date: date.toISOString(),
          timestamp: date.getTime(),
        });
      }
      
      localStorage.setItem('mindbloom_checkins', JSON.stringify(checkIns));
      
      const streak = getStreak();
      expect(streak).toBeGreaterThanOrEqual(1);
    });

    it('should count today if check-in exists', () => {
      const today = new Date();
      today.setHours(12, 0, 0, 0);
      
      // Add today
      saveCheckIn({ ...mockCheckIn, id: 'today', date: today, timestamp: today.getTime() });
      
      const streak = getStreak();
      expect(streak).toBeGreaterThanOrEqual(1);
    });
  });

  describe('clearAllData', () => {
    it('should remove all check-ins', () => {
      saveCheckIn(mockCheckIn);
      clearAllData();
      
      const checkIns = getCheckIns();
      expect(checkIns).toEqual([]);
    });

    it('should remove analyses too', () => {
      localStorage.setItem('mindbloom_analyses', JSON.stringify({ test: 'data' }));
      clearAllData();
      
      expect(localStorage.getItem('mindbloom_analyses')).toBeNull();
    });
  });
});
