'use client';

import { useRouter } from 'next/navigation';
import { Sparkles, Brain, Heart, Target, TrendingUp, Shield } from 'lucide-react';

export default function HomePage() {
  const router = useRouter();

  const features = [
    {
      icon: Brain,
      title: 'AI Journal Analysis',
      description: 'Advanced emotion detection and stress pattern recognition',
    },
    {
      icon: Target,
      title: 'Hidden Trigger Detection',
      description: 'Uncover stress triggers that standard trackers miss',
    },
    {
      icon: Heart,
      title: 'Personalized Wellness Plan',
      description: 'Daily action plans tailored to your emotional state',
    },
    {
      icon: TrendingUp,
      title: 'Progress Tracking',
      description: 'Visualize your emotional patterns and wellness trends',
    },
    {
      icon: Sparkles,
      title: 'Mindfulness Exercises',
      description: 'AI-generated breathing exercises and meditation guidance',
    },
    {
      icon: Shield,
      title: 'Safe & Private',
      description: 'Your data stays local. No accounts required.',
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-950/20 dark:via-background dark:to-blue-950/20">
        <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25"></div>
        
        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-8 flex justify-center">
              <div className="relative rounded-full px-3 py-1 text-sm leading-6 text-muted-foreground ring-1 ring-purple-600/20 hover:ring-purple-600/30">
                AI-powered emotional intelligence for students{' '}
                <span className="font-semibold text-primary">
                  <span aria-hidden="true" className="absolute inset-0"></span>
                </span>
              </div>
            </div>

            <h1 className="text-5xl font-bold tracking-tight text-foreground sm:text-7xl">
              MindBloom<span className="text-primary"> AI</span>
            </h1>
            
            <p className="mt-6 text-lg leading-8 text-muted-foreground">
              Your AI wellness companion for surviving exam preparation.
              <br />
              <span className="font-medium text-foreground">
                Not a chatbot. A daily mental wellness system.
              </span>
            </p>

            <div className="mt-10 flex items-center justify-center gap-x-6">
              <button
                onClick={() => router.push('/checkin')}
                className="rounded-lg bg-primary px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all hover:scale-105"
              >
                Start Today&apos;s Check-in
              </button>
            </div>

            <div className="mt-8 flex items-center justify-center gap-x-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-x-2">
                <Shield className="h-4 w-4" />
                <span>No sign-up required</span>
              </div>
              <div className="flex items-center gap-x-2">
                <Heart className="h-4 w-4" />
                <span>100% private</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Everything you need for mental wellness
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              Powered by advanced AI to understand your emotional patterns and provide personalized support
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-7xl">
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, index) => {
                const Icon = feature.icon;
                return (
                  <div
                    key={index}
                    className="relative rounded-2xl border border-border bg-card p-8 shadow-sm hover:shadow-md transition-shadow"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <h3 className="mt-4 text-lg font-semibold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {feature.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-muted/50 py-24 sm:py-32">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
              Your wellness journey
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              A structured approach to mental wellness, not endless chatting
            </p>
          </div>

          <div className="mx-auto mt-16 max-w-3xl">
            <div className="space-y-8">
              {[
                { step: 1, title: 'Daily Check-in', description: 'Answer quick questions about your mood, stress, sleep, and study habits' },
                { step: 2, title: 'Journal', description: 'Write about your day in your own words' },
                { step: 3, title: 'AI Analysis', description: 'Get deep insights into your emotional patterns and stress triggers' },
                { step: 4, title: 'Personalized Plan', description: 'Receive actionable wellness recommendations and mindfulness exercises' },
                { step: 5, title: 'Track Progress', description: 'Watch your wellness trends improve over time' },
              ].map((item) => (
                <div key={item.step} className="flex gap-x-4">
                  <div className="flex-none">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-white font-semibold">
                      {item.step}
                    </div>
                  </div>
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground">{item.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-16 text-center">
            <button
              onClick={() => router.push('/checkin')}
              className="rounded-lg bg-primary px-8 py-4 text-base font-semibold text-white shadow-lg hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all"
            >
              Get Started
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border">
        <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
          <p className="text-center text-sm text-muted-foreground">
            <strong>Important:</strong> MindBloom AI is a wellness tool, not a replacement for professional mental health care.
            <br />
            If you&apos;re experiencing a crisis, please contact a mental health professional or emergency services.
          </p>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            © 2024 MindBloom AI. Built with care for student wellness.
          </p>
        </div>
      </footer>
    </div>
  );
}
