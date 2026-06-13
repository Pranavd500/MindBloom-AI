'use client';

import { useEffect, useState } from 'react';
import { getCheckIns, getAnalyses } from '@/lib/utils/storage';
import { DailyCheckIn, AIAnalysis } from '@/types';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { TrendingUp, TrendingDown, Minus, Brain, Moon, BookOpen, Activity } from 'lucide-react';
import { format } from 'date-fns';

export default function InsightsPage() {
  const [checkIns, setCheckIns] = useState<DailyCheckIn[]>([]);
  const [analyses, setAnalyses] = useState<Record<string, AIAnalysis>>({});
  const [chartData, setChartData] = useState<any[]>([]);

  useEffect(() => {
    const allCheckIns = getCheckIns();
    const allAnalyses = getAnalyses();
    
    setCheckIns(allCheckIns);
    setAnalyses(allAnalyses);

    // Prepare chart data
    const data = allCheckIns.slice(0, 14).reverse().map((checkIn) => {
      const analysis = allAnalyses[checkIn.id];
      return {
        date: format(new Date(checkIn.date), 'MMM d'),
        stress: checkIn.stressLevel * 10,
        wellness: analysis?.wellnessScore || 0,
        sleep: checkIn.sleepHours,
        study: checkIn.studyHours,
      };
    });
    setChartData(data);
  }, []);

  const getTrend = (data: number[]) => {
    if (data.length < 2) return 'stable';
    const recent = data.slice(-3).reduce((a, b) => a + b, 0) / 3;
    const previous = data.slice(-6, -3).reduce((a, b) => a + b, 0) / 3;
    if (recent > previous + 5) return 'up';
    if (recent < previous - 5) return 'down';
    return 'stable';
  };

  const stressData = checkIns.map((c) => c.stressLevel * 10);
  const wellnessData = checkIns
    .map((c) => analyses[c.id]?.wellnessScore)
    .filter((s): s is number => s !== undefined);

  const stressTrend = getTrend(stressData);
  const wellnessTrend = getTrend(wellnessData);

  const avgSleep =
    checkIns.reduce((acc, c) => acc + c.sleepHours, 0) / Math.max(checkIns.length, 1);
  const avgStudy =
    checkIns.reduce((acc, c) => acc + c.studyHours, 0) / Math.max(checkIns.length, 1);
  const avgStress =
    checkIns.reduce((acc, c) => acc + c.stressLevel, 0) / Math.max(checkIns.length, 1);

  if (checkIns.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-950/10 dark:via-background dark:to-blue-950/10">
        <div className="mx-auto max-w-7xl px-6 py-12">
          <div className="text-center py-20">
            <TrendingUp className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">No Data Yet</h2>
            <p className="text-muted-foreground mb-8">
              Complete multiple check-ins to see your wellness trends and insights
            </p>
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
            <Brain className="h-8 w-8 text-primary" />
            Wellness Insights & Trends
          </h1>
          <p className="mt-2 text-muted-foreground">
            Visualize your wellness journey and discover patterns
          </p>
        </div>

        {/* Trend Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Stress Trend</p>
              {stressTrend === 'up' ? (
                <TrendingUp className="h-5 w-5 text-red-500" />
              ) : stressTrend === 'down' ? (
                <TrendingDown className="h-5 w-5 text-green-500" />
              ) : (
                <Minus className="h-5 w-5 text-gray-500" />
              )}
            </div>
            <p className="text-2xl font-bold">{avgStress.toFixed(1)}/10</p>
            <p className="text-xs text-muted-foreground mt-1">Average</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center justify-between mb-2">
              <p className="text-sm text-muted-foreground">Wellness Trend</p>
              {wellnessTrend === 'up' ? (
                <TrendingUp className="h-5 w-5 text-green-500" />
              ) : wellnessTrend === 'down' ? (
                <TrendingDown className="h-5 w-5 text-red-500" />
              ) : (
                <Minus className="h-5 w-5 text-gray-500" />
              )}
            </div>
            <p className="text-2xl font-bold">
              {wellnessData.length > 0
                ? (wellnessData.reduce((a, b) => a + b, 0) / wellnessData.length).toFixed(0)
                : '0'}
            </p>
            <p className="text-xs text-muted-foreground mt-1">Average</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-2">
              <Moon className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Sleep</p>
            </div>
            <p className="text-2xl font-bold">{avgSleep.toFixed(1)}h</p>
            <p className="text-xs text-muted-foreground mt-1">Average per night</p>
          </div>

          <div className="rounded-xl border border-border bg-card p-6">
            <div className="flex items-center gap-2 mb-2">
              <BookOpen className="h-4 w-4 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">Study</p>
            </div>
            <p className="text-2xl font-bold">{avgStudy.toFixed(1)}h</p>
            <p className="text-xs text-muted-foreground mt-1">Average per day</p>
          </div>
        </div>

        {/* Stress & Wellness Chart */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            Stress & Wellness Trends (Last 14 Days)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line
                type="monotone"
                dataKey="stress"
                stroke="#ef4444"
                name="Stress"
                strokeWidth={2}
              />
              <Line
                type="monotone"
                dataKey="wellness"
                stroke="#22c55e"
                name="Wellness"
                strokeWidth={2}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Sleep & Study Chart */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm mb-8">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            Sleep & Study Hours (Last 14 Days)
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="sleep" fill="#6366f1" name="Sleep (hours)" />
              <Bar dataKey="study" fill="#8b5cf6" name="Study (hours)" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Key Insights */}
        <div className="rounded-2xl border border-border bg-card p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Key Insights</h2>
          <div className="space-y-3">
            {avgSleep < 6 && (
              <div className="rounded-lg bg-red-50 dark:bg-red-950/20 p-4 border border-red-200 dark:border-red-900">
                <p className="text-sm text-red-800 dark:text-red-200">
                  ⚠️ Your average sleep ({avgSleep.toFixed(1)}h) is below recommended levels. Consider
                  prioritizing rest.
                </p>
              </div>
            )}
            {avgStudy > 10 && (
              <div className="rounded-lg bg-orange-50 dark:bg-orange-950/20 p-4 border border-orange-200 dark:border-orange-900">
                <p className="text-sm text-orange-800 dark:text-orange-200">
                  ⚠️ You&apos;re studying {avgStudy.toFixed(1)}h per day on average. Consider taking more
                  breaks to avoid burnout.
                </p>
              </div>
            )}
            {stressTrend === 'up' && (
              <div className="rounded-lg bg-yellow-50 dark:bg-yellow-950/20 p-4 border border-yellow-200 dark:border-yellow-900">
                <p className="text-sm text-yellow-800 dark:text-yellow-200">
                  📈 Your stress levels are trending upward. Consider implementing stress management
                  techniques.
                </p>
              </div>
            )}
            {wellnessTrend === 'up' && (
              <div className="rounded-lg bg-green-50 dark:bg-green-950/20 p-4 border border-green-200 dark:border-green-900">
                <p className="text-sm text-green-800 dark:text-green-200">
                  ✅ Great progress! Your wellness score is improving. Keep up the positive habits!
                </p>
              </div>
            )}
            {avgSleep >= 7 && avgStudy <= 8 && (
              <div className="rounded-lg bg-blue-50 dark:bg-blue-950/20 p-4 border border-blue-200 dark:border-blue-900">
                <p className="text-sm text-blue-800 dark:text-blue-200">
                  🎯 You&apos;re maintaining a healthy balance between sleep and study. Excellent work!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
