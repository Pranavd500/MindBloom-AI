'use client';

import { Calendar, Sun, BookOpen, Coffee, Moon } from 'lucide-react';
import { WellnessPlan } from '@/types';

interface WellnessPlanCardProps {
  plan: WellnessPlan;
}

export default function WellnessPlanCard({ plan }: WellnessPlanCardProps) {
  const sections = [
    { title: 'Morning Routine', items: plan.morning, icon: Sun, color: 'text-yellow-600' },
    { title: 'Study Blocks', items: plan.studyBlocks, icon: BookOpen, color: 'text-blue-600' },
    { title: 'Breaks', items: plan.breaks, icon: Coffee, color: 'text-green-600' },
    { title: 'Evening', items: plan.evening, icon: Sun, color: 'text-orange-600' },
    { title: 'Bedtime Routine', items: plan.bedtimeRoutine, icon: Moon, color: 'text-indigo-600' },
  ];

  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-sm mb-8">
      <div className="flex items-center gap-2 mb-6">
        <Calendar className="h-5 w-5 text-primary" />
        <h2 className="text-lg font-semibold">Tomorrow's Wellness Plan</h2>
      </div>

      <div className="space-y-6">
        {sections.map((section, idx) => {
          const Icon = section.icon;
          return section.items.length > 0 ? (
            <div key={idx}>
              <div className="flex items-center gap-2 mb-3">
                <Icon className={`h-4 w-4 ${section.color}`} />
                <h3 className="text-sm font-semibold text-foreground">{section.title}</h3>
              </div>
              <ul className="space-y-2 ml-6">
                {section.items.map((item, itemIdx) => (
                  <li key={itemIdx} className="flex items-start gap-2">
                    <span className="mt-1.5 h-1.5 w-1.5 rounded-full bg-muted-foreground flex-shrink-0" />
                    <span className="text-sm text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          ) : null;
        })}
      </div>

      <div className="mt-6 rounded-lg bg-primary/10 p-4">
        <p className="text-sm text-foreground">
          <strong>Tip:</strong> This plan is tailored to your current stress level and energy. Adjust as needed based on how you feel.
        </p>
      </div>
    </div>
  );
}
