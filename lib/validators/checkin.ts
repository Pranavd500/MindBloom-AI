import { z } from 'zod';

// Security: Input validation to prevent injection and ensure data integrity
export const checkInSchema = z.object({
  mood: z.enum(['excited', 'happy', 'neutral', 'anxious', 'sad', 'overwhelmed']),
  stressLevel: z.number().min(1).max(10),
  sleepHours: z.number().min(0).max(24),
  studyHours: z.number().min(0).max(24),
  waterIntake: z.number().min(0).max(20),
  energyLevel: z.number().min(1).max(10),
  exam: z.enum(['JEE', 'NEET', 'UPSC', 'CAT', 'GATE', 'CUET', 'Other']),
  journalEntry: z.string()
    .min(10, 'Please share at least a few words about your day')
    .max(2000, 'Journal entry is too long (max 2000 characters)')
    .refine(
      (text) => {
        // Security: Basic sanitization check - prevent script injection
        const dangerousPatterns = /<script|javascript:|onerror=|onclick=/i;
        return !dangerousPatterns.test(text);
      },
      { message: 'Invalid characters detected in journal entry' }
    ),
});

export type CheckInFormData = z.infer<typeof checkInSchema>;
