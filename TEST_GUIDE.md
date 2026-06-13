# Testing Guide for MindBloom AI

## Quick Test (5 minutes)

### 1. Start Development Server
```bash
npm run dev
```
Visit: http://localhost:3000

### 2. Landing Page Test
- ✅ Check hero section loads
- ✅ Click "Start Today's Check-in" button
- ✅ Verify navigation to /checkin

### 3. Check-in Flow Test
- ✅ Select a mood (e.g., "Anxious")
- ✅ Set stress level to 7
- ✅ Set sleep hours to 5
- ✅ Set study hours to 9
- ✅ Set water intake to 4
- ✅ Set energy level to 4
- ✅ Select exam: JEE
- ✅ Write journal entry (50+ words):
```
Today was really stressful. I studied for 9 hours but feel like I didn't retain much. 
My mock test score was lower than expected and now I'm worried about the actual exam. 
I compared myself to my friend who scored better and felt really discouraged. 
I couldn't sleep well last night thinking about it.
```
- ✅ Click "Analyze My Wellness"
- ✅ Wait for AI analysis (15-30 seconds)
- ✅ Verify navigation to /dashboard

### 4. Dashboard Test
- ✅ Check wellness score displays
- ✅ Verify stress level shows (should be high)
- ✅ Check confidence level
- ✅ Verify burnout risk indicator
- ✅ Read emotional analysis
- ✅ Check motivational message
- ✅ Verify hidden stress triggers appear
- ✅ Check thought patterns section
- ✅ Review recommended actions
- ✅ Check mindfulness exercise card
- ✅ Review tomorrow's wellness plan
- ✅ Verify sleep analysis
- ✅ Check study-life balance feedback

### 5. Edge Cases Test

#### Test Short Journal (Should Fail)
- Go to /checkin
- Enter only "Good" in journal
- Try to submit
- ✅ Verify error message appears

#### Test Long Journal (Should Fail)
- Enter 2100+ characters
- ✅ Verify error message appears

#### Test Missing Fields
- Leave mood unselected
- Try to submit
- ✅ Verify error message

### 6. Crisis Detection Test

⚠️ **Note**: This tests the safety feature

- Complete check-in with journal containing:
```
I feel completely hopeless. Nothing matters anymore. 
I don't see the point in continuing.
```
- Submit
- ✅ Emergency modal should appear
- ✅ Check helpline numbers are displayed
- ✅ Verify supportive messaging

### 7. Second Check-in Test (Pattern Detection)

- Go back to home (http://localhost:3000/checkin)
- Complete another check-in with different data
- ✅ On dashboard, check if "Patterns Over Time" section appears
- ✅ Verify AI detected correlations

### 8. Mobile Responsiveness Test

- Open DevTools (F12)
- Toggle device toolbar (Ctrl+Shift+M / Cmd+Shift+M)
- Test on iPhone SE, iPad, Desktop
- ✅ Verify layout adapts correctly
- ✅ Check all buttons are tappable
- ✅ Verify text is readable

### 9. Dark Mode Test

- Change system to dark mode
- Refresh page
- ✅ Verify dark theme applies
- ✅ Check contrast is maintained
- ✅ Verify all text is readable

### 10. Keyboard Navigation Test

- Use Tab key to navigate
- ✅ Verify focus indicators visible
- ✅ Check tab order is logical
- ✅ Test form submission with Enter key
- ✅ Verify modal can be closed with Escape

---

## API Test

### Test API Endpoint Directly

```bash
curl -X POST http://localhost:3000/api/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "checkIn": {
      "id": "test-123",
      "date": "2024-01-15T10:00:00Z",
      "timestamp": 1705315200000,
      "mood": "anxious",
      "stressLevel": 8,
      "sleepHours": 5,
      "studyHours": 10,
      "waterIntake": 3,
      "energyLevel": 3,
      "exam": "JEE",
      "journalEntry": "Feeling very stressed about upcoming exams. Studied all day but still feel unprepared. Worried about disappointing everyone."
    }
  }'
```

Expected response:
```json
{
  "success": true,
  "analysis": {
    "emotionSummary": { ... },
    "stressScore": 80,
    "burnoutRisk": "high",
    ...
  },
  "patterns": []
}
```

---

## Local Storage Test

### Check Data Persistence

1. Complete a check-in
2. Open DevTools → Application → Local Storage
3. ✅ Verify `mindbloom_checkins` exists
4. ✅ Verify `mindbloom_analyses` exists
5. Close browser
6. Reopen http://localhost:3000
7. ✅ Verify you're redirected to dashboard (data persists)

### Clear Data Test

```javascript
// In browser console:
localStorage.clear();
location.reload();
```
✅ Should redirect to home page

---

## Build Test

### Production Build

```bash
npm run build
```

✅ Should complete without errors

### Start Production Server

```bash
npm start
```

Visit: http://localhost:3000
✅ Repeat all tests above

---

## Performance Test

### Lighthouse Audit

1. Open DevTools → Lighthouse
2. Run audit for:
   - Performance
   - Accessibility
   - Best Practices
   - SEO

Target Scores:
- Performance: 90+
- Accessibility: 95+
- Best Practices: 90+
- SEO: 90+

---

## AI Quality Test

### Test Different Scenarios

1. **High Stress Student**
```
Journal: "I'm completely overwhelmed. 12 hours of study but nothing is sticking. 
Everyone else seems so much better prepared. I feel like a failure."
```
✅ Should detect: high stress, comparison with peers, perfectionism

2. **Balanced Student**
```
Journal: "Had a good productive day. Followed my study schedule, 
took breaks, went for a walk. Feeling confident about tomorrow."
```
✅ Should detect: positive patterns, good self-care

3. **Burnout Risk**
```
Journal: "Can't focus anymore. Too tired to study. Haven't slept properly in days. 
Everything feels pointless. Just going through the motions."
```
✅ Should detect: burnout risk, sleep deprivation, motivation issues

---

## Browser Compatibility Test

Test on:
- ✅ Chrome (latest)
- ✅ Firefox (latest)
- ✅ Safari (latest)
- ✅ Edge (latest)

---

## Error Handling Test

### Test API Failure

1. Stop the dev server
2. Try to submit a check-in
3. ✅ Verify error message appears
4. ✅ Check user isn't stuck in loading state

### Test Network Timeout

1. Set network throttling to "Slow 3G"
2. Submit check-in
3. ✅ Verify loading state appears
4. ✅ Check request eventually completes or times out gracefully

---

## Accessibility Test Tools

### Run axe DevTools

1. Install axe DevTools extension
2. Run scan on each page
3. ✅ Target: 0 violations

### Screen Reader Test

1. Enable VoiceOver (Mac) or NVDA (Windows)
2. Navigate through the app
3. ✅ Verify all content is announced
4. ✅ Check form labels are read correctly
5. ✅ Verify error messages are announced

---

## Test Results Template

```markdown
## Test Results - [Date]

### Functional Tests
- [ ] Landing page
- [ ] Check-in flow
- [ ] Dashboard display
- [ ] AI analysis
- [ ] Pattern detection
- [ ] Crisis detection
- [ ] Local storage

### Quality Tests
- [ ] Mobile responsive
- [ ] Dark mode
- [ ] Keyboard navigation
- [ ] Build success
- [ ] Performance (Lighthouse)
- [ ] Accessibility (axe)

### Browser Tests
- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

### Issues Found
[List any bugs or issues]

### Overall Status
✅ PASS / ❌ FAIL
```

---

## Quick Smoke Test (1 minute)

```bash
# 1. Build
npm run build

# 2. Check for errors
echo $?  # Should be 0

# 3. Start
npm start

# 4. Visit http://localhost:3000
# 5. Complete one check-in
# 6. Verify dashboard loads
```

✅ If all steps pass → **READY FOR SUBMISSION**

---

## Production Checklist

Before deploying:
- [ ] Build passes
- [ ] All tests pass
- [ ] Environment variables set
- [ ] README.md updated
- [ ] .env.example provided
- [ ] No console.log in production
- [ ] No hardcoded API keys
- [ ] Error tracking configured (optional)
- [ ] Analytics configured (optional)

---

**Testing Status: COMPREHENSIVE** ✅

**Confidence: Very High** 🎯
