'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  ArrowRight, 
  Brain, 
  TrendingUp, 
  Heart, 
  Sparkles,
  CheckCircle,
  Target
} from 'lucide-react';

export default function OnboardingPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);

  const steps = [
    {
      icon: Brain,
      title: 'Welcome to MindBloom AI',
      description: 'Your personal AI wellness companion for exam preparation',
      content: 'We help students like you understand stress patterns, track emotional wellness, and stay mentally healthy during your academic journey.',
      color: 'from-purple-500 to-blue-500',
    },
    {
      icon: Target,
      title: 'Track Your Wellness',
      description: 'Daily check-ins with context',
      content: 'Answer quick questions about your mood, stress, sleep, and study habits. Write a journal entry. We analyze everything to give you personalized insights.',
      color: 'from-blue-500 to-cyan-500',
    },
    {
      icon: TrendingUp,
      title: 'Discover Hidden Patterns',
      description: 'AI-powered emotional intelligence',
      content: 'Our AI identifies stress triggers you might miss—like "stress increases after 8+ study hours" or "comparing yourself to peers affects confidence."',
      color: 'from-cyan-500 to-teal-500',
    },
    {
      icon: Heart,
      title: 'Get Personalized Guidance',
      description: 'Actionable wellness plans',
      content: 'Receive daily wellness plans, mindfulness exercises, and motivational support tailored to your exam, stress level, and emotional state.',
      color: 'from-teal-500 to-green-500',
    },
    {
      icon: Sparkles,
      title: 'Stay Supported',
      description: 'Your AI coach is always available',
      content: 'Chat with your wellness coach anytime for guidance, tips, and support. It knows your context and provides personalized advice.',
      color: 'from-green-500 to-emerald-500',
    },
  ];

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleFinish();
    }
  };

  const handlePrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSkip = () => {
    handleFinish();
  };

  const handleFinish = () => {
    // Mark onboarding as complete
    localStorage.setItem('mindbloom_onboarding_complete', 'true');
    router.push('/checkin');
  };

  const step = steps[currentStep];
  const Icon = step.icon;
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50 dark:from-purple-950/10 dark:via-background dark:to-blue-950/10 flex items-center justify-center p-6">
      <div className="w-full max-w-2xl">
        {/* Skip Button */}
        <div className="flex justify-end mb-4">
          <button
            onClick={handleSkip}
            className="text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            Skip tutorial
          </button>
        </div>

        {/* Main Card */}
        <div className="rounded-3xl border border-border bg-card shadow-2xl overflow-hidden">
          {/* Progress Bar */}
          <div className="h-2 bg-muted">
            <div
              className={`h-full bg-gradient-to-r ${step.color} transition-all duration-500`}
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* Content */}
          <div className="p-8 sm:p-12">
            {/* Icon */}
            <div className="flex justify-center mb-6">
              <div
                className={`rounded-full bg-gradient-to-r ${step.color} p-6 shadow-lg animate-fade-in`}
              >
                <Icon className="h-12 w-12 text-white" />
              </div>
            </div>

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl font-bold text-center text-foreground mb-3 animate-fade-in">
              {step.title}
            </h1>

            {/* Description */}
            <p className="text-lg text-center text-muted-foreground mb-6 animate-fade-in">
              {step.description}
            </p>

            {/* Content */}
            <p className="text-center text-foreground leading-relaxed mb-8 animate-fade-in">
              {step.content}
            </p>

            {/* Step Indicators */}
            <div className="flex justify-center gap-2 mb-8">
              {steps.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentStep(index)}
                  className={`h-2 rounded-full transition-all ${
                    index === currentStep
                      ? 'w-8 bg-primary'
                      : 'w-2 bg-muted hover:bg-muted-foreground/50'
                  }`}
                  aria-label={`Go to step ${index + 1}`}
                />
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex gap-4">
              {currentStep > 0 && (
                <button
                  onClick={handlePrevious}
                  className="flex-1 rounded-lg border border-border bg-background px-6 py-4 text-base font-semibold text-foreground hover:bg-muted transition-colors"
                >
                  Previous
                </button>
              )}
              <button
                onClick={handleNext}
                className={`flex-1 rounded-lg bg-gradient-to-r ${step.color} px-6 py-4 text-base font-semibold text-white shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2 group`}
              >
                {currentStep === steps.length - 1 ? (
                  <>
                    Get Started
                    <CheckCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
                  </>
                ) : (
                  <>
                    Next
                    <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            {/* Step Counter */}
            <p className="text-center text-sm text-muted-foreground mt-6">
              Step {currentStep + 1} of {steps.length}
            </p>
          </div>
        </div>

        {/* Footer Note */}
        <p className="text-center text-sm text-muted-foreground mt-6">
          🔒 Your data stays private on your device. No account needed.
        </p>
      </div>
    </div>
  );
}
