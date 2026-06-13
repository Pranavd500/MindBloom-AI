import { checkInSchema } from '@/lib/validators/checkin';

describe('Check-in Validation', () => {
  const validCheckIn = {
    mood: 'happy' as const,
    stressLevel: 5,
    sleepHours: 7,
    studyHours: 6,
    waterIntake: 8,
    energyLevel: 7,
    exam: 'JEE' as const,
    journalEntry: 'Today was a productive day. I completed my physics revision and feel good about it.',
  };

  describe('Valid Inputs', () => {
    it('should validate correct check-in data', () => {
      const result = checkInSchema.safeParse(validCheckIn);
      expect(result.success).toBe(true);
    });

    it('should accept all valid mood types', () => {
      const moods = ['excited', 'happy', 'neutral', 'anxious', 'sad', 'overwhelmed'];
      moods.forEach(mood => {
        const result = checkInSchema.safeParse({ ...validCheckIn, mood });
        expect(result.success).toBe(true);
      });
    });

    it('should accept all valid exam types', () => {
      const exams = ['JEE', 'NEET', 'UPSC', 'CAT', 'GATE', 'CUET', 'Other'];
      exams.forEach(exam => {
        const result = checkInSchema.safeParse({ ...validCheckIn, exam });
        expect(result.success).toBe(true);
      });
    });

    it('should accept minimum valid journal length', () => {
      const result = checkInSchema.safeParse({
        ...validCheckIn,
        journalEntry: 'Ten chars!',
      });
      expect(result.success).toBe(true);
    });

    it('should accept maximum valid journal length', () => {
      const result = checkInSchema.safeParse({
        ...validCheckIn,
        journalEntry: 'A'.repeat(2000),
      });
      expect(result.success).toBe(true);
    });
  });

  describe('Range Validations', () => {
    it('should reject stress level below minimum', () => {
      const result = checkInSchema.safeParse({
        ...validCheckIn,
        stressLevel: 0,
      });
      expect(result.success).toBe(false);
    });

    it('should reject stress level above maximum', () => {
      const result = checkInSchema.safeParse({
        ...validCheckIn,
        stressLevel: 11,
      });
      expect(result.success).toBe(false);
    });

    it('should accept stress level at boundaries', () => {
      const min = checkInSchema.safeParse({ ...validCheckIn, stressLevel: 1 });
      const max = checkInSchema.safeParse({ ...validCheckIn, stressLevel: 10 });
      expect(min.success).toBe(true);
      expect(max.success).toBe(true);
    });

    it('should reject negative sleep hours', () => {
      const result = checkInSchema.safeParse({
        ...validCheckIn,
        sleepHours: -1,
      });
      expect(result.success).toBe(false);
    });

    it('should reject sleep hours above 24', () => {
      const result = checkInSchema.safeParse({
        ...validCheckIn,
        sleepHours: 25,
      });
      expect(result.success).toBe(false);
    });

    it('should accept zero sleep hours', () => {
      const result = checkInSchema.safeParse({
        ...validCheckIn,
        sleepHours: 0,
      });
      expect(result.success).toBe(true);
    });
  });

  describe('Journal Entry Validation', () => {
    it('should reject journal entry that is too short', () => {
      const result = checkInSchema.safeParse({
        ...validCheckIn,
        journalEntry: 'Short',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('at least a few words');
      }
    });

    it('should reject journal entry that is too long', () => {
      const result = checkInSchema.safeParse({
        ...validCheckIn,
        journalEntry: 'A'.repeat(2001),
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('too long');
      }
    });

    it('should reject script tags in journal entry', () => {
      const result = checkInSchema.safeParse({
        ...validCheckIn,
        journalEntry: 'Today was <script>alert("xss")</script> good',
      });
      expect(result.success).toBe(false);
      if (!result.success) {
        expect(result.error.issues[0].message).toContain('Invalid characters');
      }
    });

    it('should reject javascript: protocol in journal entry', () => {
      const result = checkInSchema.safeParse({
        ...validCheckIn,
        journalEntry: 'Check this out javascript:alert(1) interesting link',
      });
      expect(result.success).toBe(false);
    });

    it('should reject onerror attribute in journal entry', () => {
      const result = checkInSchema.safeParse({
        ...validCheckIn,
        journalEntry: 'Image test <img src=x onerror=alert(1)> in my day',
      });
      expect(result.success).toBe(false);
    });

    it('should reject onclick attribute in journal entry', () => {
      const result = checkInSchema.safeParse({
        ...validCheckIn,
        journalEntry: 'Button test <button onclick=alert(1)> in content',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Invalid Enum Values', () => {
    it('should reject invalid mood values', () => {
      const result = checkInSchema.safeParse({
        ...validCheckIn,
        mood: 'super-excited',
      });
      expect(result.success).toBe(false);
    });

    it('should reject invalid exam values', () => {
      const result = checkInSchema.safeParse({
        ...validCheckIn,
        exam: 'INVALID_EXAM',
      });
      expect(result.success).toBe(false);
    });
  });

  describe('Missing Required Fields', () => {
    it('should reject missing mood', () => {
      const { mood, ...withoutMood } = validCheckIn;
      const result = checkInSchema.safeParse(withoutMood);
      expect(result.success).toBe(false);
    });

    it('should reject missing exam', () => {
      const { exam, ...withoutExam } = validCheckIn;
      const result = checkInSchema.safeParse(withoutExam);
      expect(result.success).toBe(false);
    });

    it('should reject missing journal entry', () => {
      const { journalEntry, ...withoutJournal } = validCheckIn;
      const result = checkInSchema.safeParse(withoutJournal);
      expect(result.success).toBe(false);
    });
  });

  describe('Type Validations', () => {
    it('should reject non-numeric stress level', () => {
      const result = checkInSchema.safeParse({
        ...validCheckIn,
        stressLevel: '5',
      });
      expect(result.success).toBe(false);
    });

    it('should reject non-numeric sleep hours', () => {
      const result = checkInSchema.safeParse({
        ...validCheckIn,
        sleepHours: '7',
      });
      expect(result.success).toBe(false);
    });

    it('should reject non-string journal entry', () => {
      const result = checkInSchema.safeParse({
        ...validCheckIn,
        journalEntry: 12345,
      });
      expect(result.success).toBe(false);
    });
  });
});
