# MindBloom AI - Architecture Documentation

## System Overview

MindBloom AI is a client-side-first wellness application with AI-powered analysis running on Next.js 15 with serverless API routes. The application emphasizes **privacy**, **performance**, and **responsible AI**.

## Architecture Principles

### 1. **Privacy-First Design**
- All user data stored locally (localStorage)
- No user authentication required
- No server-side data persistence
- API only processes data transiently

### 2. **Clean Architecture**
Separation of concerns across layers:
- **Presentation** (UI Components)
- **Application** (API Routes, Hooks)
- **Domain** (Types, Business Logic)
- **Infrastructure** (AI Client, Storage)

### 3. **Type Safety**
- Strict TypeScript throughout
- Zod schemas for runtime validation
- Compile-time type checking prevents bugs

### 4. **Responsible AI**
- Structured prompts prevent prompt injection
- Crisis detection and emergency response
- Fallback mechanisms for AI failures
- Never claims to replace professional care

## System Architecture Diagram

```
┌─────────────────────────────────────────────────────────────┐
│                         Client (Browser)                      │
├─────────────────────────────────────────────────────────────┤
│  ┌───────────────┐  ┌───────────────┐  ┌──────────────────┐│
│  │  Landing Page │  │  Check-in Page│  │  Dashboard Page  ││
│  │  (page.tsx)   │→ │  (checkin/)   │→ │  (dashboard/)    ││
│  └───────────────┘  └───────────────┘  └──────────────────┘│
│                            ↓                      ↑           │
│                    ┌───────────────┐             │           │
│                    │  Form Submit  │             │           │
│                    └───────────────┘             │           │
│                            ↓                      │           │
│                    ┌───────────────┐             │           │
│                    │ Validation    │             │           │
│                    │ (Zod Schema)  │             │           │
│                    └───────────────┘             │           │
│                            ↓                      │           │
├────────────────────────────┼──────────────────────┼──────────┤
│                            ↓                      │           │
│  ┌────────────────────────────────────────────────┴────────┐ │
│  │           API Route: /api/analyze (POST)                 │ │
│  │  ┌──────────────────────────────────────────────────┐   │ │
│  │  │  1. Validate Input (checkInSchema)               │   │ │
│  │  │  2. Call analyzeCheckIn()                        │   │ │
│  │  │  3. Call detectPatterns() (if historical data)   │   │ │
│  │  │  4. Return JSON response                         │   │ │
│  │  └──────────────────────────────────────────────────┘   │ │
│  └──────────────────────────────────────────────────────────┘ │
│                            ↓                                   │
├────────────────────────────┼───────────────────────────────────┤
│  AI Analysis Layer         │                                   │
│  ┌─────────────────────────▼────────────────────────────────┐ │
│  │  analyzer.ts                                              │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │  analyzeCheckIn(checkIn, historicalData)           │ │ │
│  │  │    1. Build structured prompt                       │ │ │
│  │  │    2. Call Gemini API                               │ │ │
│  │  │    3. Parse JSON response                           │ │ │
│  │  │    4. Validate structure                            │ │ │
│  │  │    5. Return AIAnalysis object                      │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  │  ┌─────────────────────────────────────────────────────┐ │ │
│  │  │  detectPatterns(checkIns)                          │ │ │
│  │  │    1. Build pattern detection prompt                │ │ │
│  │  │    2. Call Gemini API                               │ │ │
│  │  │    3. Parse JSON response                           │ │ │
│  │  │    4. Filter by confidence > 60%                    │ │ │
│  │  │    5. Return HistoricalPattern[]                    │ │ │
│  │  └─────────────────────────────────────────────────────┘ │ │
│  └──────────────────────────────────────────────────────────┘ │
│                            ↓                                   │
│  ┌─────────────────────────▼────────────────────────────────┐ │
│  │  Gemini Client (gemini-client.ts)                        │ │
│  │  - Singleton pattern                                      │ │
│  │  - Model: gemini-1.5-pro                                  │ │
│  │  - Config: temperature=0.7, maxTokens=8192               │ │
│  └──────────────────────────────────────────────────────────┘ │
│                            ↓                                   │
├────────────────────────────┼───────────────────────────────────┤
│  External Service          │                                   │
│  ┌─────────────────────────▼────────────────────────────────┐ │
│  │           Google Gemini API                               │ │
│  │           (AI Processing)                                 │ │
│  └──────────────────────────────────────────────────────────┘ │
├──────────────────────────────────────────────────────────────┤
│  Response Flow (Back to Client)                               │
│                            ↑                                   │
│                    ┌───────┴───────┐                          │
│                    │ JSON Response │                          │
│                    │ {analysis,    │                          │
│                    │  patterns}    │                          │
│                    └───────────────┘                          │
│                            ↓                                   │
│                    ┌───────────────┐                          │
│                    │ Save to Local │                          │
│                    │ Storage       │                          │
│                    └───────────────┘                          │
│                            ↓                                   │
│                    ┌───────────────┐                          │
│                    │ Navigate to   │                          │
│                    │ Dashboard     │                          │
│                    └───────────────┘                          │
└──────────────────────────────────────────────────────────────┘
```

## Core Components

### Data Flow Layer

#### 1. **Check-in Form** (`app/checkin/page.tsx`)
**Responsibilities:**
- Collect structured wellness data
- Validate input with React Hook Form + Zod
- Submit to API route
- Handle loading and error states

**Key Features:**
- Visual mood selector (emoji buttons)
- Range sliders for numeric inputs
- Textarea for journal entry
- Real-time validation feedback

#### 2. **API Route** (`app/api/analyze/route.ts`)
**Responsibilities:**
- Validate incoming requests
- Orchestrate AI analysis
- Return structured JSON
- Handle errors gracefully

**Security:**
- Input validation (Zod)
- Rate limiting (recommended for production)
- Error sanitization

#### 3. **AI Analyzer** (`lib/ai/analyzer.ts`)
**Responsibilities:**
- Build AI prompts
- Call Gemini API
- Parse and validate responses
- Provide fallback on failure

**Multi-Agent Pattern:**
The analyzer implements a **multi-stage AI pipeline**:
1. **Emotion Analyzer**: Detects primary emotion and intensity
2. **Stress Detector**: Calculates stress score and triggers
3. **Risk Assessor**: Evaluates burnout risk
4. **Pattern Recognizer**: Identifies thought patterns
5. **Wellness Planner**: Generates personalized action plan
6. **Historical Analyzer**: Detects patterns across multiple entries

### Prompt Engineering

#### Analysis Prompt Structure (`lib/ai/prompt-builder.ts`)

```typescript
// Structured prompt format
{
  "context": "Today's wellness data + historical context",
  "task": "Specific analysis instructions",
  "safety_protocol": "Crisis detection rules",
  "output_format": "Strict JSON schema",
  "guidelines": "Behavioral constraints"
}
```

**Key Principles:**
1. **Structured Output**: Force JSON-only responses
2. **Context Injection**: Include historical data for pattern detection
3. **Safety First**: Explicit crisis detection instructions
4. **Actionable Insights**: Require specific, not generic, advice
5. **Exam Context**: Consider user's specific exam for relevance

### Data Persistence Layer

#### Local Storage Service (`lib/utils/storage.ts`)

```typescript
// Data structure
localStorage.setItem('mindbloom_checkins', JSON.stringify([
  {
    id: 'checkin-1234567890',
    date: Date,
    mood: 'happy',
    stressLevel: 5,
    // ... more fields
  }
]))

localStorage.setItem('mindbloom_analyses', JSON.stringify({
  'checkin-1234567890': {
    emotionSummary: {...},
    stressScore: 45,
    // ... AI analysis
  }
}))

localStorage.setItem('mindbloom_patterns', JSON.stringify([
  {
    pattern: 'Stress increases when...',
    insight: '...',
    recommendation: '...'
  }
]))
```

**Storage Strategy:**
- Keep last 90 days of check-ins
- Store analyses separately for efficient retrieval
- Patterns updated on each analysis

### Presentation Layer

#### Dashboard (`app/dashboard/page.tsx`)
**Responsibilities:**
- Display wellness insights
- Visualize trends
- Show AI recommendations
- Emergency modal if crisis detected

**Component Hierarchy:**
```
DashboardPage
├── QuickStatsGrid
│   ├── WellnessScoreCard
│   ├── StressLevelCard
│   ├── ConfidenceCard
│   └── BurnoutRiskCard
├── EmotionalAnalysisCard
├── MotivationalMessageCard
├── HiddenTriggersCard
├── ThoughtPatternsCard
├── HistoricalPatternsCard
├── RecommendedActionsCard
├── MindfulnessCard
├── WellnessPlanCard
└── EmergencyModal (conditional)
```

## Type System

### Core Domain Types (`types/index.ts`)

```typescript
// Input
DailyCheckIn {
  mood, stressLevel, sleep, study, water, energy, exam, journal
}

// Output
AIAnalysis {
  emotionSummary, stressScore, burnoutRisk, triggers,
  thoughtPatterns, actions, mindfulness, plan, wellnessScore
}

// Historical
HistoricalPattern {
  pattern, insight, recommendation, confidence
}
```

**Type Safety Benefits:**
- Autocomplete in IDE
- Compile-time error detection
- Self-documenting code
- Refactoring safety

## Security Architecture

### 1. **Input Validation**
```typescript
// Zod schema ensures type safety and validation
checkInSchema
  .string().min(10).max(2000)  // Length limits
  .refine(noScriptTags)         // XSS prevention
```

### 2. **API Security**
- Environment variables for API keys
- Server-side API calls only (never client-side)
- No sensitive data in responses

### 3. **Prompt Injection Prevention**
- Structured prompts with clear boundaries
- User input wrapped in context
- JSON-only output format prevents text manipulation

### 4. **Crisis Detection**
```typescript
if (analysis.emergencyConcern) {
  // Show emergency resources
  // Pause normal flow
  // Provide helpline information
}
```

## Performance Optimizations

### 1. **Next.js App Router Benefits**
- Server Components by default
- Automatic code splitting
- Route prefetching
- Optimized bundling

### 2. **Client-Side Caching**
- localStorage for persistence
- No network calls for historical data
- Instant dashboard loading

### 3. **Lazy Loading**
```typescript
// Dashboard components load progressively
// Heavy components can be lazy-loaded
const MindfulnessCard = dynamic(() => import('./MindfulnessCard'))
```

### 4. **API Optimization**
- Single AI call per check-in
- Batch historical analysis
- Fallback prevents blocking

## Error Handling Strategy

### 1. **Graceful Degradation**
```typescript
try {
  const analysis = await analyzeCheckIn(...)
} catch (error) {
  return createFallbackAnalysis(checkIn)  // Safe default
}
```

### 2. **User Feedback**
- Loading states during AI processing
- Clear error messages
- Retry mechanisms

### 3. **AI Response Validation**
```typescript
// Ensure AI returned all required fields
validateAnalysis(aiResponse)
// If invalid, use fallback
```

## Accessibility Architecture

### 1. **Semantic HTML**
```tsx
<main>
  <section aria-labelledby="wellness-score">
    <h2 id="wellness-score">Wellness Score</h2>
  </section>
</main>
```

### 2. **Keyboard Navigation**
- All interactive elements focusable
- Logical tab order
- Skip navigation links

### 3. **Screen Reader Support**
- ARIA labels on custom controls
- Alt text on meaningful images
- Live regions for dynamic updates

### 4. **Color Accessibility**
- WCAG AA contrast ratios
- Color not the only indicator
- High contrast mode support

## Testing Strategy

### 1. **Unit Tests**
- Validation schemas (Zod)
- Utility functions
- Type guards

### 2. **Integration Tests**
- API route handlers
- AI prompt building
- Storage operations

### 3. **E2E Tests** (Recommended)
```typescript
test('Complete check-in flow', async () => {
  await fillCheckInForm()
  await submitForm()
  await waitForAnalysis()
  expect(dashboardVisible()).toBe(true)
})
```

### 4. **Manual Testing Checklist**
- [ ] Crisis language detection
- [ ] Emergency modal display
- [ ] Pattern detection accuracy
- [ ] Mobile responsiveness
- [ ] Dark mode support

## Deployment Architecture

### Serverless (Vercel/Netlify)
```
User Request → CDN → Edge Function → Gemini API → Response
              ↓
        Static Assets (HTML/CSS/JS)
```

**Benefits:**
- Zero infrastructure management
- Automatic scaling
- Global CDN
- HTTPS by default

## Future Architecture Improvements

### 1. **Database Layer** (Optional)
- PostgreSQL for multi-device sync
- Supabase for auth + storage
- Encrypted at rest

### 2. **Real-time Features**
- WebSocket for live updates
- Push notifications for reminders
- Progressive Web App (PWA)

### 3. **Advanced Analytics**
- Recharts for trend visualization
- Statistical analysis of patterns
- Predictive stress modeling

### 4. **Microservices** (Scale)
```
API Gateway
├── Emotion Analysis Service
├── Pattern Detection Service
├── Recommendation Engine
└── Crisis Detection Service
```

## Conclusion

MindBloom AI's architecture prioritizes **privacy**, **simplicity**, and **responsible AI** while maintaining production-quality code standards. The clean separation of concerns allows for easy testing, maintenance, and future enhancements.

---

**Architecture Version:** 1.0  
**Last Updated:** 2024  
**Maintainer:** MindBloom AI Team
