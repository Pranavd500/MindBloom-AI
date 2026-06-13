'use client';

import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft, Home, Activity } from 'lucide-react';

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();

  // Don't show header on home page
  if (pathname === '/') {
    return null;
  }

  const getPageTitle = () => {
    switch (pathname) {
      case '/checkin':
        return 'Daily Check-in';
      case '/dashboard':
        return 'Dashboard';
      default:
        return 'MindBloom AI';
    }
  };

  const canGoBack = pathname === '/dashboard' || pathname === '/checkin';

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="mx-auto max-w-7xl px-6 py-4">
        <div className="flex items-center justify-between">
          {/* Left: Back/Home button */}
          <div className="flex items-center gap-4">
            {canGoBack && (
              <button
                onClick={() => router.back()}
                className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                aria-label="Go back"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Back</span>
              </button>
            )}
            <button
              onClick={() => router.push('/')}
              className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
              aria-label="Go to home"
            >
              <Home className="h-4 w-4" />
              <span className="hidden sm:inline">Home</span>
            </button>
          </div>

          {/* Center: Page title */}
          <div className="flex items-center gap-2">
            <Activity className="h-5 w-5 text-primary" />
            <h1 className="text-lg font-semibold text-foreground">
              {getPageTitle()}
            </h1>
          </div>

          {/* Right: Logo/Brand */}
          <div className="flex items-center">
            <span className="text-sm font-semibold">
              MindBloom<span className="text-primary"> AI</span>
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}
