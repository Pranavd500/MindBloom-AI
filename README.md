# MindBloom AI 🌱

**Your AI Wellness Companion for Students**

An AI-powered emotional intelligence and wellness platform designed specifically for students preparing for competitive exams (JEE, NEET, UPSC, CAT, GATE, CUET). MindBloom AI goes beyond simple mood tracking—it understands your emotional patterns, detects hidden stress triggers, and provides personalized wellness guidance.

## 🎯 Problem Statement

Students preparing for highly competitive examinations experience chronic stress, burnout, anxiety, loneliness, and declining motivation. Traditional mood tracking applications only record moods but fail to understand **WHY** a student is stressed.

MindBloom AI solves this by:
- Analyzing daily journals to discover hidden emotional patterns
- Detecting stress triggers that standard trackers miss
- Providing personalized wellness recommendations
- Encouraging healthier study habits
- Acting as an empathetic AI companion

## ✨ Key Features

### 🧠 AI-Powered Analysis
- **Deep Emotion Detection**: Goes beyond basic mood tracking to understand emotional nuances
- **Hidden Trigger Discovery**: Identifies specific stress factors (not just "exam pressure")
- **Thought Pattern Recognition**: Detects cognitive patterns like perfectionism, comparison, and catastrophizing
- **Burnout Risk Assessment**: Proactive warning system for mental exhaustion

### 📊 Intelligent Insights
- **Historical Pattern Detection**: Discovers correlations across multiple check-ins (e.g., "stress increases when sleep drops below 6 hours")
- **Behavioral Trend Analysis**: Tracks wellness trajectory over time
- **Confidence Tracking**: Monitors self-confidence levels
- **Sleep & Study Balance**: Analyzes work-life balance

### 🎯 Personalized Recommendations
- **Actionable Advice**: Specific, contextual suggestions (not generic platitudes)
- **Custom Mindfulness Exercises**: AI-generated breathing exercises tailored to stress level
- **Daily Wellness Plans**: Structured schedules for morning, study, breaks, and bedtime
- **Motivational Messages**: Personalized encouragement based on exam and emotional state

### 🛡️ Responsible AI
- **Crisis Detection**: Identifies concerning language indicating self-harm or severe distress
- **Emergency Resources**: Provides helpline information when needed
- **Privacy-First**: All data stored locally, no accounts required
- **Ethical Boundaries**: Never claims to replace professional mental health care

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS v4
- **AI**: Google Gemini 1.5 Pro
- **Validation**: Zod
- **Forms**: React Hook Form
- **Icons**: Lucide React
- **Animations**: Framer Motion

### Project Structure
```
mindbloom-ai/
├── app/
│   ├── api/
│   │   └── analyze/          # AI analysis API endpoint
│   ├── checkin/              # Daily check-in page
│   ├── dashboard/            # Wellness dashboard
│   ├── layout.tsx            # Root layout
│   ├── page.tsx              # Landing page
│   └── globals.css           # Global styles
├── components/
│   ├── features/             # Feature components
│   │   ├── EmergencyModal.tsx
│   │   ├── MindfulnessCard.tsx
│   │   └── WellnessPlanCard.tsx
│   ├── layout/               # Layout components
│   └── ui/                   # Reusable UI components
├── lib/
│   ├── ai/                   # AI integration
│   │   ├── gemini-client.ts  # Gemini client singleton
│   │   ├── prompt-builder.ts # Prompt engineering
│   │   └── analyzer.ts       # Analysis orchestration
│   ├── utils/                # Utilities
│   │   └── storage.ts        # Local storage service
│   └── validators/           # Input validation
│       └── checkin.ts        # Check-in schema
├── types/
│   └── index.ts              # TypeScript types
└── hooks/                    # Custom React hooks
```

### Data Flow

```
User Input (Check-in Form)
    ↓
Validation (Zod Schema)
    ↓
API Route (/api/analyze)
    ↓
Prompt Builder (Structured Prompt)
    ↓
Gemini AI (Analysis)
    ↓
Structured JSON Response
    ↓
Pattern Detection (Historical Analysis)
    ↓
Local Storage (Persistence)
    ↓
Dashboard (Visualization)
```

## 🔒 Security Features

1. **Input Validation**: All user input validated with Zod schemas
2. **Sanitization**: XSS protection through input sanitization
3. **Prompt Injection Prevention**: Structured prompts prevent manipulation
4. **Environment Variables**: API keys secured via environment variables
5. **No Backend Storage**: Data stays on user's device
6. **Character Limits**: Journal entries capped at 2000 characters

## ♿ Accessibility

- **Semantic HTML**: Proper heading hierarchy and landmarks
- **ARIA Labels**: Screen reader support throughout
- **Keyboard Navigation**: Full keyboard accessibility
- **Color Contrast**: WCAG AA compliant color schemes
- **Focus Management**: Visible focus indicators
- **Responsive Design**: Mobile-first approach

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ installed
- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd mindbloom-ai
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
```bash
cp .env.local.example .env.local
```

Edit `.env.local` and add your Gemini API key:
```
GEMINI_API_KEY=your_actual_api_key_here
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 🧪 Testing

### Manual Testing Checklist
- [ ] Complete daily check-in flow
- [ ] Verify AI analysis generates structured output
- [ ] Test emergency detection with crisis language
- [ ] Confirm local storage persistence
- [ ] Test pattern detection with multiple check-ins
- [ ] Verify responsive design on mobile
- [ ] Test keyboard navigation
- [ ] Validate form error handling

### Test Cases
```bash
npm test  # Run test suite (when implemented)
```

## 📦 Deployment

### Vercel (Recommended)

1. Push code to GitHub
2. Import project in Vercel dashboard
3. Add `GEMINI_API_KEY` environment variable
4. Deploy!

```bash
# Or use Vercel CLI
vercel --prod
```

### Environment Variables for Production
```
GEMINI_API_KEY=your_production_api_key
```

## 🎨 Design Philosophy

MindBloom AI follows a **structured wellness journey** approach rather than a chatbot interface:

1. **Guided Check-in**: Structured questions reduce cognitive load
2. **Visual Analysis**: Information presented as cards, not walls of text
3. **Actionable Insights**: Every insight comes with specific recommendations
4. **Calm Aesthetic**: Generous whitespace, soft gradients, minimal design
5. **Progressive Disclosure**: Information revealed gradually to prevent overwhelm

Inspired by: Linear, Notion, Apple Health, Headspace

## 🌟 What Makes MindBloom AI Special

### vs Traditional Mood Trackers
- **Standard Tracker**: "How are you feeling? 😊😐😔"
- **MindBloom AI**: Analyzes *why* you're feeling that way and what triggers it

### vs Generic Chatbots
- **Chatbot**: Open-ended conversation, no structure
- **MindBloom AI**: Structured daily check-ins with consistent, comparable data

### Multi-Agent AI Workflow
Not just one AI call, but an intelligent pipeline:
1. Emotion Analyzer
2. Stress Pattern Detector
3. Risk Assessment
4. Personalized Wellness Planner
5. Mindfulness Generator
6. Historical Pattern Analyzer

## 📈 Future Enhancements

- [ ] Interactive mood and stress charts (Recharts)
- [ ] Study companion with AI-generated study schedules
- [ ] Focus timer with Pomodoro technique
- [ ] Guided breathing animations
- [ ] Daily streaks and positive reinforcement
- [ ] Export wellness reports (PDF)
- [ ] Voice journal input
- [ ] Multi-language support
- [ ] PWA for offline access
- [ ] Integration with calendar apps

## ⚠️ Disclaimer

**MindBloom AI is a wellness tool, not a replacement for professional mental health care.**

If you're experiencing a mental health crisis, please contact:
- **National Crisis Helpline**: 988 or 1-800-273-8255
- **Crisis Text Line**: Text "HELLO" to 741741
- **International**: [findahelpline.com](https://findahelpline.com)

## 📄 License

MIT License - feel free to use this project for learning or personal use.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 👨‍💻 Developer

Built with ❤️ for students navigating the stress of competitive exam preparation.

---

**Remember**: Consistency matters more than intensity. Take it one day at a time. 🌱
