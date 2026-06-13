import { checkInSchema } from '@/lib/validators/checkin';

describe('Check-in Validation', () => {
  it('should validate correct check-in data', () => {
    const validData = {
      mood: 'happy',
      stressLevel: 5,
      sleepHours: 7,
      studyHours: 6,
      waterIntake: 8,
      energyLevel: 7,
      exam: 'JEE',
      journalEntry: 'Today was a productive day. I completed my physics revision and feel good about it.',
    };

    const result = checkInSchema.safeParse(validData);
    expect(result.success).toBe(true);
  });

  it('should reject stress level outside range', () => {
    const invalidData = {
      mood: 'happy',
      stressLevel: 15, // Invalid: max is 10
      sleepHours: 7,
      studyHours: 6,
      waterIntake: 8,
      energyLevel: 7,
      exam: 'JEE',
      journalEntry: 'Today was good.',
    };

    const result = checkInSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject journal entry that is too short', () => {
    const invalidData = {
      mood: 'happy',
      stressLevel: 5,
      sleepHours: 7,
      studyHours: 6,
      waterIntake: 8,
      energyLevel: 7,
      exam: 'JEE',
      journalEntry: 'Good', // Too short
    };

    const result = checkInSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject journal entry that is too long', () => {
    const invalidData = {
      mood: 'happy',
      stressLevel: 5,
      sleepHours: 7,
      studyHours: 6,
      waterIntake: 8,
      energyLevel: 7,
      exam: 'JEE',
      journalEntry: 'A'.repeat(2001), // Too long
    };

    const result = checkInSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject dangerous script injection attempts', () => {
    const invalidData = {
      mood: 'happy',
      stressLevel: 5,
      sleepHours: 7,
      studyHours: 6,
      waterIntake: 8,
      energyLevel: 7,
      exam: 'JEE',
      journalEntry: 'Today was <script>alert("xss")</script> good', // XSS attempt
    };

    const result = checkInSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject invalid mood values', () => {
    const invalidData = {
      mood: 'super-excited', // Not in enum
      stressLevel: 5,
      sleepHours: 7,
      studyHours: 6,
      waterIntake: 8,
      energyLevel: 7,
      exam: 'JEE',
      journalEntry: 'Today was great',
    };

    const result = checkInSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should reject invalid exam values', () => {
    const invalidData = {
      mood: 'happy',
      stressLevel: 5,
      sleepHours: 7,
      studyHours: 6,
      waterIntake: 8,
      energyLevel: 7,
      exam: 'INVALID_EXAM',
      journalEntry: 'Today was great',
    };

    const result = checkInSchema.safeParse(invalidData);
    expect(result.success).toBe(false);
  });

  it('should validate all valid exam types', () => {
    const exams = ['JEE', 'NEET', 'UPSC', 'CAT', 'GATE', 'CUET', 'Other'];
    
    exams.forEach(exam => {
      const validData = {
        mood: 'happy',
        stressLevel: 5,
        sleepHours: 7,
        studyHours: 6,
        waterIntake: 8,
        energyLevel: 7,
        exam,
        journalEntry: 'Today was productive',
      };

      const result = checkInSchema.safeParse(validData);
      expect(result.success).toBe(true);
    });
  });
});
