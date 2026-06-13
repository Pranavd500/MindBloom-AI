'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getCheckIns, getAnalyses } from '@/lib/utils/storage';
import { DailyCheckIn, AIAnalysis } from '@/types';
import { Calendar, TrendingUp, Brain, ArrowRight } from 'lucide-react';
import { format } from 'date-fns';

export default function HistoryPage() {
  const router = useRouter();
  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>([]);
  const [analyses, setAnalyses] = useState<Record<string, AIAnalysis>>({});

  useEffect(() => {
    setCheckIns(getCheckIns());
    setAnalyses(getAnalyses());
  }, []);

  const getMoodEmoji = (mood: string) => {
    const emojis = {
      excited: '🤩',
      happy: '😊',
      neutral: '😐',
      anxious: '😰',
      sad: '😔',
      overwhelmed: '😫',
    };
    return emojis[mood as keyof typeof emojis] || '😐';
  };

  const getBurnoutColor = (risk: string) => {
    const colors = {
      low: 'bg-green-100 text-green-700 dark:bg-green-950/20 dark:text-green-400',
      moderate: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-950/20 dark:text-yellow-400',
      high: 'bg-orange-100 text-orange-700 dark:bg-orange-950/20 dark:text-orange-400',
      critical: 'bg-red-100 text-red-700 dark:bg-red-950/20 dark:text-red-400',
    };
    return colors[risk as keyof typeof colors] || colors.moderate;
  };

  if (checkIns.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-950/10 dark:via-background dark:to-blue-950/10">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="text-center py-20">
            <Calendar className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">No History Yet</h2>
            <p className="text-muted-foreground mb-8">
              Complete your first check-in to start tracking your wellness journey
            </p>
            <button
              onClick={() => router.push('/checkin')}
              className="rounded-lg bg-primary px-8 py-3 text-base font-semibold text-white shadow-lg hover:bg-primary/90 transition-all"
            >
              Start Check-in
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-950/10 dark:via-background dark:to-blue-950/10">
      <div className="mx-auto max-w-7xl px-6 py-12">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground flex items-center gap-2">
            <Calendar className="h-8 w-8 text-primary" />
            Your Wellness History
          </h1>
          <p className="mt-2 text-muted-foreground">
            Review your past check-ins and track your progress
          </p>
        </div>

        {/* Stats Overview */}
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">Total Check-ins</p>
            <p className="text-3xl font-bold text-foreground mt-2">{checkIns.length}</p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">Average Wellness</p>
            <p className="text-3xl font-bold text-foreground mt-2">
              {Math.round(
                Object.values(analyses).reduce((acc, a) => acc + a.wellnessScore, 0) /
                  Math.max(Object.values(analyses).length, 1)
              )}
            </p>
          </div>
          <div className="rounded-xl border border-border bg-card p-6">
            <p className="text-sm text-muted-foreground">Days Tracked</p>
            <p className="text-3xl font-bold text-foreground mt-2">
              {new Set(checkIns.map((c) => format(new Date(c.date), 'yyyy-MM-dd'))).size}
            </p>
          </div>
        </div>

        {/* History Timeline */}
        <div className="space-y-4">
          {checkIns.map((checkIn) => {
            const analysis = analyses[checkIn.id];
            return (
              <div
                key={checkIn.id}
                className="rounded-2xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => {
                  // Store selected check-in and navigate to detail view
                  localStorage.setItem('selected_checkin', checkIn.id);
                  router.push('/dashboard');
                }}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="text-4xl">{getMoodEmoji(checkIn.mood)}</div>
                    <div>
                      <h3 className="text-lg font-semibold text-foreground capitalize">
                        {checkIn.mood}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(checkIn.date), 'EEEE, MMMM d, yyyy')}
                      </p>
                    </div>
                  </div>
                  {analysis && (
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getBurnoutColor(
                          analysis.burnoutRisk
                        )}`}
                      >
                        {analysis.burnoutRisk} risk
                      </span>
                      <ArrowRight className="h-5 w-5 text-muted-foreground" />
                    </div>
                  )}
                </div>

                {/* Quick Stats */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-muted-foreground">Stress</p>
                    <p className="text-sm font-semibold">{checkIn.stressLevel}/10</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Sleep</p>
                    <p className="text-sm font-semibold">{checkIn.sleepHours}h</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">Study</p>
                    <p className="text-sm font-semibold">{checkIn.studyHours}h</p>
                  </div>
                  {analysis && (
                    <div>
                      <p className="text-xs text-muted-foreground">Wellness</p>
                      <p className="text-sm font-semibold">{analysis.wellnessScore}</p>
                    </div>
                  )}
                </div>

                {/* Journal Preview */}
                <div className="border-t border-border pt-4">
                  <p className="text-sm text-muted-foreground mb-2">Journal Entry:</p>
                  <p className="text-sm text-foreground line-clamp-2">
                    {checkIn.journalEntry}
                  </p>
                </div>

                {/* AI Insights Preview */}
                {analysis && analysis.hiddenStressTriggers.length > 0 && (
                  <div className="mt-4 flex items-center gap-2">
                    <Brain className="h-4 w-4 text-primary" />
                    <p className="text-xs text-muted-foreground">
                      {analysis.hiddenStressTriggers.length} stress triggers detected
                    </p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* View Insights Button */}
        <div className="mt-8 text-center">
          <button
            onClick={() => router.push('/insights')}
            className="rounded-lg bg-primary px-8 py-3 text-base font-semibold text-white shadow-lg hover:bg-primary/90 transition-all inline-flex items-center gap-2"
          >
            <TrendingUp className="h-5 w-5" />
            View Overall Insights
          </button>
        </div>
      </div>
    </div>
  );
}
