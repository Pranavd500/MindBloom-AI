'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  getTodayCheckIn,
  getTodayAnalysis,
  getRecentCheckIns,
  getStreak,
} from '@/lib/utils/storage';
import { AIAnalysis, DailyCheckIn, HistoricalPattern } from '@/types';
import {
  Brain,
  Heart,
  Activity,
  Moon,
  BookOpen,
  Droplet,
  Zap,
  AlertCircle,
  TrendingUp,
  Calendar,
  Target,
  Sparkles,
  Plus,
} from 'lucide-react';
import EmergencyModal from '@/components/features/EmergencyModal';
import MindfulnessCard from '@/components/features/MindfulnessCard';
import WellnessPlanCard from '@/components/features/WellnessPlanCard';

export default function DashboardPage() {
  const router = useRouter();
  const [checkIn, setCheckIn] = useState<DailyCheckIn | null>(null);
  const [analysis, setAnalysis] = useState<AIAnalysis | null>(null);
  const [patterns, setPatterns] = useState<HistoricalPattern[]>([]);
  const [streak, setStreak] = useState(0);
  const [showEmergency, setShowEmergency] = useState(false);

  useEffect(() => {
    const loadData = () => {
      const todayCheckIn = getTodayCheckIn();
      const todayAnalysis = getTodayAnalysis();

      if (!todayCheckIn) {
        router.push('/checkin');
        return;
      }

      setCheckIn(todayCheckIn);
      setAnalysis(todayAnalysis);
      setStreak(getStreak());

      // Load patterns
      const storedPatterns = localStorage.getItem('mindbloom_patterns');
      if (storedPatterns) {
        setPatterns(JSON.parse(storedPatterns));
      }

      // Check for emergency concern
      if (todayAnalysis?.emergencyConcern) {
        setShowEmergency(true);
      }
    };

    loadData();
  }, [router]);

  if (!checkIn || !analysis) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading your wellness insights...</p>
        </div>
      </div>
    );
  }

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case 'low':
        return 'text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-950/20';
      case 'moderate':
        return 'text-yellow-600 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/20';
      case 'high':
        return 'text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-950/20';
      case 'critical':
        return 'text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-950/20';
      default:
        return 'text-gray-600 dark:text-gray-400 bg-gray-50 dark:bg-gray-950/20';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-950/10 dark:via-background dark:to-blue-950/10">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-foreground">Your Wellness Dashboard</h1>
            <p className="mt-1 text-muted-foreground">
              {new Date(checkIn.date).toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="flex items-center gap-2 rounded-xl bg-primary/10 px-4 py-2">
            <Calendar className="h-5 w-5 text-primary" />
            <span className="text-sm font-medium">
              <span className="text-2xl font-bold text-primary">{streak}</span>
              <span className="text-muted-foreground ml-1">day streak</span>
            </span>
          </div>
        </div>

        {/* Quick Stats Grid */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Wellness Score */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Wellness Score</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{analysis.wellnessScore}</p>
              </div>
              <div className="rounded-full bg-primary/10 p-3">
                <Heart className="h-6 w-6 text-primary" />
              </div>
            </div>
          </div>

          {/* Stress Level */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Stress Level</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{analysis.stressScore}</p>
              </div>
              <div className="rounded-full bg-orange-100 dark:bg-orange-950/20 p-3">
                <Activity className="h-6 w-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
          </div>

          {/* Confidence */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Confidence</p>
                <p className="mt-2 text-3xl font-bold text-foreground">{analysis.confidenceLevel}%</p>
              </div>
              <div className="rounded-full bg-blue-100 dark:bg-blue-950/20 p-3">
                <Target className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
          </div>

          {/* Burnout Risk */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Burnout Risk</p>
                <p className={`mt-2 text-lg font-bold capitalize ${getRiskColor(analysis.burnoutRisk).split(' ')[0]}`}>
                  {analysis.burnoutRisk}
                </p>
              </div>
              <div className={`rounded-full p-3 ${getRiskColor(analysis.burnoutRisk).split(' ').slice(2).join(' ')}`}>
                <AlertCircle className={`h-6 w-6 ${getRiskColor(analysis.burnoutRisk).split(' ')[0]}`} />
              </div>
            </div>
          </div>
        </div>

        {/* Today&apos;s Data */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <Moon className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Sleep</p>
                <p className="text-lg font-semibold">{checkIn.sleepHours}h</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Study Time</p>
                <p className="text-lg font-semibold">{checkIn.studyHours}h</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <Droplet className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Water</p>
                <p className="text-lg font-semibold">{checkIn.waterIntake} glasses</p>
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-border bg-card p-4">
            <div className="flex items-center gap-3">
              <Zap className="h-5 w-5 text-muted-foreground" />
              <div>
                <p className="text-xs text-muted-foreground">Energy</p>
                <p className="text-lg font-semibold">{checkIn.energyLevel}/10</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          {/* Emotional Summary */}
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Emotional Analysis</h2>
            </div>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Primary Emotion</p>
                <p className="text-xl font-semibold text-foreground capitalize">
                  {analysis.emotionSummary.primaryEmotion}
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-2">Emotional Intensity</p>
                <div className="h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${analysis.emotionSummary.emotionalIntensity}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {analysis.emotionSummary.emotionalIntensity}%
                </p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">State</p>
                <p className="text-sm text-foreground">{analysis.emotionSummary.emotionalState}</p>
              </div>
            </div>
          </div>

          {/* Motivational Message */}
          <div className="rounded-2xl border border-border bg-gradient-to-br from-primary/10 to-primary/5 p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="h-5 w-5 text-primary" />
              <h2 className="text-lg font-semibold">Today&apos;s Motivation</h2>
            </div>
            <p className="text-foreground leading-relaxed">{analysis.motivationalMessage}</p>
          </div>
        </div>

        {/* Continue in next sections... */}
        {/* Hidden Stress Triggers */}
        {analysis.hiddenStressTriggers.length > 0 && (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm mb-8">
            <div className="flex items-center gap-2 mb-4">
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <h2 className="text-lg font-semibold">Hidden Stress Triggers</h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {analysis.hiddenStressTriggers.map((trigger, index) => (
                <div
                  key={index}
                  className={`rounded-lg p-4 ${
                    trigger.severity === 'high'
                      ? 'bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900'
                      : trigger.severity === 'medium'
                      ? 'bg-orange-50 dark:bg-orange-950/20 border border-orange-200 dark:border-orange-900'
                      : 'bg-yellow-50 dark:bg-yellow-950/20 border border-yellow-200 dark:border-yellow-900'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-medium text-sm text-foreground">{trigger.trigger}</p>
                      <p className="text-xs text-muted-foreground mt-1 capitalize">
                        {trigger.category} • {trigger.severity} severity
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Thought Patterns */}
        {analysis.thoughtPatterns.length > 0 && (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Brain className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold">Thought Patterns</h2>
            </div>
            <div className="space-y-3">
              {analysis.thoughtPatterns.map((pattern, index) => (
                <div
                  key={index}
                  className="flex items-start gap-3 rounded-lg bg-muted/50 p-4"
                >
                  <div
                    className={`mt-0.5 h-2 w-2 rounded-full ${
                      pattern.type === 'positive'
                        ? 'bg-green-500'
                        : pattern.type === 'negative'
                        ? 'bg-red-500'
                        : 'bg-gray-500'
                    }`}
                  />
                  <div className="flex-1">
                    <p className="text-sm text-foreground">{pattern.pattern}</p>
                    <p className="text-xs text-muted-foreground mt-1 capitalize">
                      {pattern.type} • {pattern.frequency}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Historical Patterns */}
        {patterns.length > 0 && (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm mb-8">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              <h2 className="text-lg font-semibold">Patterns Over Time</h2>
            </div>
            <div className="space-y-4">
              {patterns.map((pattern, index) => (
                <div key={index} className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-4">
                  <p className="font-medium text-sm text-foreground mb-2">{pattern.pattern}</p>
                  <p className="text-sm text-muted-foreground mb-2">{pattern.insight}</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    💡 {pattern.recommendation}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Recommended Actions */}
        {analysis.recommendedActions.length > 0 && (
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm mb-8">
            <div className="flex items-center gap-2 mb-4">
              <Target className="h-5 w-5 text-green-600" />
              <h2 className="text-lg font-semibold">Recommended Actions</h2>
            </div>
            <ul className="space-y-2">
              {analysis.recommendedActions.map((action, index) => (
                <li key={index} className="flex items-start gap-3">
                  <div className="mt-1 h-1.5 w-1.5 rounded-full bg-green-500" />
                  <p className="text-sm text-foreground flex-1">{action}</p>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Mindfulness Exercise */}
        <MindfulnessCard exercise={analysis.mindfulnessExercise} />

        {/* Tomorrow's Wellness Plan */}
        <WellnessPlanCard plan={analysis.tomorrowPlan} />

        {/* Sleep & Study Analysis */}
        <div className="grid gap-6 lg:grid-cols-2 mb-8">
          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <Moon className="h-5 w-5 text-indigo-600" />
              <h2 className="text-lg font-semibold">Sleep Analysis</h2>
            </div>
            <p className="text-sm text-foreground">{analysis.sleepAnalysis}</p>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="h-5 w-5 text-purple-600" />
              <h2 className="text-lg font-semibold">Study-Life Balance</h2>
            </div>
            <p className="text-sm text-foreground">{analysis.studyLifeBalance}</p>
          </div>
        </div>

        {/* New Check-in Button */}
        <div className="text-center mb-8">
          <button
            onClick={() => router.push('/checkin')}
            className="rounded-lg bg-primary px-8 py-3 text-base font-semibold text-white shadow-lg hover:bg-primary/90 transition-all"
          >
            Complete Tomorrow&apos;s Check-in
          </button>
        </div>
      </div>

      {/* Emergency Modal */}
      {showEmergency && analysis.emergencyMessage && (
        <EmergencyModal
          message={analysis.emergencyMessage}
          onClose={() => setShowEmergency(false)}
        />
      )}

      {/* Floating Action Button for New Check-in */}
      <button
        onClick={() => router.push('/checkin')}
        className="fixed bottom-8 right-8 flex items-center gap-2 rounded-full bg-primary px-6 py-4 text-base font-semibold text-white shadow-2xl hover:bg-primary/90 hover:scale-105 transition-all z-40"
        aria-label="New check-in"
      >
        <Plus className="h-5 w-5" />
        <span className="hidden sm:inline">New Check-in</span>
      </button>
    </div>
  );
}
