'use client';

import { useState } from 'react';
import { Wind, Play, Pause } from 'lucide-react';
import { MindfulnessExercise } from '@/types';

interface MindfulnessCardProps {
  exercise: MindfulnessExercise;
}

export default function MindfulnessCard({ exercise }: MindfulnessCardProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  const handleStart = () => {
    setIsPlaying(true);
    setCurrentStep(0);
  };

  const handleStop = () => {
    setIsPlaying(false);
    setCurrentStep(0);
  };

  return (
    <div className="rounded-2xl border border-border bg-gradient-to-br from-indigo-50 to-purple-50 dark:from-indigo-950/20 dark:to-purple-950/20 p-6 shadow-sm mb-8">
      <div className="flex items-center gap-2 mb-4">
        <Wind className="h-5 w-5 text-indigo-600" />
        <h2 className="text-lg font-semibold">Mindfulness Exercise</h2>
      </div>

      <div className="mb-4">
        <h3 className="text-xl font-semibold text-foreground mb-1">{exercise.title}</h3>
        <p className="text-sm text-muted-foreground">{exercise.duration} minutes</p>
      </div>

      {exercise.breathingPattern && (
        <div className="mb-6 rounded-lg bg-white/60 dark:bg-black/20 p-4">
          <p className="text-sm font-medium text-foreground mb-2">Breathing Pattern</p>
          <div className="grid grid-cols-4 gap-2 text-center">
            <div>
              <p className="text-2xl font-bold text-indigo-600">{exercise.breathingPattern.inhale}s</p>
              <p className="text-xs text-muted-foreground">Inhale</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-purple-600">{exercise.breathingPattern.hold}s</p>
              <p className="text-xs text-muted-foreground">Hold</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-pink-600">{exercise.breathingPattern.exhale}s</p>
              <p className="text-xs text-muted-foreground">Exhale</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-blue-600">{exercise.breathingPattern.cycles}</p>
              <p className="text-xs text-muted-foreground">Cycles</p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6">
        <p className="text-sm font-medium text-foreground mb-3">Instructions</p>
        <ol className="space-y-2">
          {exercise.instructions.map((instruction, index) => (
            <li
              key={index}
              className={`flex items-start gap-3 rounded-lg p-3 transition-colors ${
                isPlaying && currentStep === index
                  ? 'bg-indigo-100 dark:bg-indigo-950/40'
                  : 'bg-white/40 dark:bg-black/10'
              }`}
            >
              <span className="flex h-6 w-6 items-center justify-center rounded-full bg-indigo-600 text-xs font-bold text-white">
                {index + 1}
              </span>
              <span className="flex-1 text-sm text-foreground">{instruction}</span>
            </li>
          ))}
        </ol>
      </div>

      {exercise.breathingPattern && (
        <div className="flex items-center justify-center mb-6">
          <div
            className={`h-24 w-24 rounded-full bg-gradient-to-br from-indigo-400 to-purple-400 ${
              isPlaying ? 'animate-breathe' : ''
            }`}
          />
        </div>
      )}

      <div className="flex gap-3">
        {!isPlaying ? (
          <button
            onClick={handleStart}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-indigo-600 px-4 py-3 font-semibold text-white hover:bg-indigo-700 transition-colors"
          >
            <Play className="h-4 w-4" />
            Start Exercise
          </button>
        ) : (
          <button
            onClick={handleStop}
            className="flex-1 flex items-center justify-center gap-2 rounded-lg bg-gray-600 px-4 py-3 font-semibold text-white hover:bg-gray-700 transition-colors"
          >
            <Pause className="h-4 w-4" />
            Stop
          </button>
        )}
      </div>
    </div>
  );
}
