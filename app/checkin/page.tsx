'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Loader2, ArrowRight } from 'lucide-react';
import { checkInSchema, CheckInFormData } from '@/lib/validators/checkin';
import { saveCheckIn, saveAnalysis, getRecentCheckIns } from '@/lib/utils/storage';
import { DailyCheckIn, MoodType, ExamType } from '@/types';

const moodOptions: { value: MoodType; emoji: string; label: string }[] = [
  { value: 'excited', emoji: '🤩', label: 'Excited' },
  { value: 'happy', emoji: '😊', label: 'Happy' },
  { value: 'neutral', emoji: '😐', label: 'Neutral' },
  { value: 'anxious', emoji: '😰', label: 'Anxious' },
  { value: 'sad', emoji: '😔', label: 'Sad' },
  { value: 'overwhelmed', emoji: '😫', label: 'Overwhelmed' },
];

const examOptions: { value: ExamType; label: string }[] = [
  { value: 'JEE', label: 'JEE (Engineering)' },
  { value: 'NEET', label: 'NEET (Medical)' },
  { value: 'UPSC', label: 'UPSC (Civil Services)' },
  { value: 'CAT', label: 'CAT (Management)' },
  { value: 'GATE', label: 'GATE (Graduate)' },
  { value: 'CUET', label: 'CUET (University)' },
  { value: 'Other', label: 'Other' },
];

export default function CheckInPage() {
  const router = useRouter();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<CheckInFormData>({
    resolver: zodResolver(checkInSchema),
    defaultValues: {
      stressLevel: 5,
      sleepHours: 7,
      studyHours: 6,
      waterIntake: 6,
      energyLevel: 5,
    },
  });

  const selectedMood = watch('mood');
  const stressLevel = watch('stressLevel');
  const sleepHours = watch('sleepHours');
  const studyHours = watch('studyHours');
  const waterIntake = watch('waterIntake');
  const energyLevel = watch('energyLevel');

  const onSubmit = async (data: CheckInFormData) => {
    setIsAnalyzing(true);
    setError(null);

    try {
      // Create check-in object
      const checkIn: DailyCheckIn = {
        id: `checkin-${Date.now()}`,
        date: new Date(),
        timestamp: Date.now(),
        ...data,
      };

      // Get historical data for better analysis
      const historicalData = getRecentCheckIns(7);

      // Call API for analysis
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ checkIn, historicalData }),
      });

      if (!response.ok) {
        throw new Error('Failed to analyze check-in');
      }

      const { analysis, patterns } = await response.json();

      // Save to local storage
      saveCheckIn(checkIn);
      saveAnalysis(checkIn.id, analysis);

      // Store patterns separately if they exist
      if (patterns && patterns.length > 0) {
        localStorage.setItem('mindbloom_patterns', JSON.stringify(patterns));
      }

      // Navigate to dashboard
      router.push('/dashboard');
    } catch (err) {
      console.error('Check-in error:', err);
      setError(err instanceof Error ? err.message : 'Something went wrong');
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-950/10 dark:via-background dark:to-blue-950/10">
      <div className="mx-auto max-w-3xl px-6 py-12">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-foreground sm:text-4xl">
            Daily Wellness Check-in
          </h1>
          <p className="mt-2 text-muted-foreground">
            Take a moment to reflect on your day
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
          {/* Mood Selection */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <label className="block text-sm font-medium text-foreground mb-4">
              How are you feeling today?
            </label>
            <div className="grid grid-cols-3 gap-3 sm:grid-cols-6">
              {moodOptions.map((mood) => (
                <button
                  key={mood.value}
                  type="button"
                  onClick={() => setValue('mood', mood.value)}
                  className={`flex flex-col items-center gap-2 rounded-xl p-4 transition-all ${
                    selectedMood === mood.value
                      ? 'bg-primary text-white ring-2 ring-primary ring-offset-2'
                      : 'bg-muted hover:bg-muted/80'
                  }`}
                >
                  <span className="text-3xl">{mood.emoji}</span>
                  <span className="text-xs font-medium">{mood.label}</span>
                </button>
              ))}
            </div>
            {errors.mood && (
              <p className="mt-2 text-sm text-red-600">{errors.mood.message}</p>
            )}
          </div>

          {/* Stress Level */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <label className="block text-sm font-medium text-foreground mb-2">
              Stress Level: {stressLevel}/10
            </label>
            <input
              type="range"
              min="1"
              max="10"
              {...register('stressLevel', { valueAsNumber: true })}
              className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
            />
            <div className="flex justify-between mt-2 text-xs text-muted-foreground">
              <span>Low</span>
              <span>High</span>
            </div>
          </div>

          {/* Sleep & Study Grid */}
          <div className="grid gap-6 sm:grid-cols-2">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <label className="block text-sm font-medium text-foreground mb-2">
                Sleep: {sleepHours} hours
              </label>
              <input
                type="range"
                min="0"
                max="12"
                step="0.5"
                {...register('sleepHours', { valueAsNumber: true })}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <label className="block text-sm font-medium text-foreground mb-2">
                Study Time: {studyHours} hours
              </label>
              <input
                type="range"
                min="0"
                max="16"
                step="0.5"
                {...register('studyHours', { valueAsNumber: true })}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <label className="block text-sm font-medium text-foreground mb-2">
                Water: {waterIntake} glasses
              </label>
              <input
                type="range"
                min="0"
                max="15"
                {...register('waterIntake', { valueAsNumber: true })}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
              <label className="block text-sm font-medium text-foreground mb-2">
                Energy: {energyLevel}/10
              </label>
              <input
                type="range"
                min="1"
                max="10"
                {...register('energyLevel', { valueAsNumber: true })}
                className="w-full h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>
          </div>

          {/* Exam Selection */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <label className="block text-sm font-medium text-foreground mb-4">
              Which exam are you preparing for?
            </label>
            <select
              {...register('exam')}
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">Select exam</option>
              {examOptions.map((exam) => (
                <option key={exam.value} value={exam.value}>
                  {exam.label}
                </option>
              ))}
            </select>
            {errors.exam && (
              <p className="mt-2 text-sm text-red-600">{errors.exam.message}</p>
            )}
          </div>

          {/* Journal Entry */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <label className="block text-sm font-medium text-foreground mb-2">
              Tell us about your day
            </label>
            <p className="text-xs text-muted-foreground mb-4">
              What happened today? How did it make you feel? What&apos;s on your mind?
            </p>
            <textarea
              {...register('journalEntry')}
              rows={6}
              placeholder="Today was..."
              className="w-full rounded-lg border border-input bg-background px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary resize-none"
            />
            {errors.journalEntry && (
              <p className="mt-2 text-sm text-red-600">{errors.journalEntry.message}</p>
            )}
          </div>

          {/* Error Message */}
          {error && (
            <div className="rounded-lg bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 p-4">
              <p className="text-sm text-red-800 dark:text-red-200">{error}</p>
            </div>
          )}

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isAnalyzing}
            className="w-full rounded-lg bg-primary px-6 py-4 text-base font-semibold text-white shadow-lg hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {isAnalyzing ? (
              <>
                <Loader2 className="h-5 w-5 animate-spin" />
                Analyzing your wellness...
              </>
            ) : (
              <>
                Analyze My Wellness
                <ArrowRight className="h-5 w-5" />
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
