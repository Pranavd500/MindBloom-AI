# Deployment Guide for MindBloom AI

## Prerequisites

- Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))
- Vercel account (recommended) or any Node.js hosting platform

## Option 1: Deploy to Vercel (Recommended)

Vercel is the easiest way to deploy Next.js applications and offers zero-configuration deployment.

### Steps:

1. **Push your code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

2. **Import project in Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Add New" → "Project"
   - Import your GitHub repository

3. **Configure environment variables**
   - In Vercel project settings, go to "Environment Variables"
   - Add: `GEMINI_API_KEY` with your API key
   - Click "Save"

4. **Deploy**
   - Vercel will automatically deploy your app
   - You'll get a URL like: `https://mindbloom-ai.vercel.app`

### Vercel CLI Method:

```bash
# Install Vercel CLI
npm install -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# Set environment variable
vercel env add GEMINI_API_KEY production

# Deploy to production
vercel --prod
```

## Option 2: Deploy to Netlify

1. **Push code to GitHub** (same as above)

2. **Create netlify.toml**
   ```toml
   [build]
     command = "npm run build"
     publish = ".next"

   [[plugins]]
     package = "@netlify/plugin-nextjs"
   ```

3. **Deploy on Netlify**
   - Go to [netlify.com](https://netlify.com)
   - Click "Add new site" → "Import an existing project"
   - Connect to GitHub and select your repository
   - Add environment variable: `GEMINI_API_KEY`
   - Click "Deploy"

## Option 3: Docker Deployment

Create `Dockerfile`:

```dockerfile
FROM node:18-alpine AS base

# Install dependencies
FROM base AS deps
WORKDIR /app
COPY package*.json ./
RUN npm ci

# Build application
FROM base AS builder
WORKDIR /app
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

# Production image
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

CMD ["node", "server.js"]
```

Build and run:
```bash
docker build -t mindbloom-ai .
docker run -p 3000:3000 -e GEMINI_API_KEY=your_key mindbloom-ai
```

## Option 4: Self-Hosted (VPS/AWS/DigitalOcean)

1. **Setup Node.js on server**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

2. **Clone and setup**
   ```bash
   git clone <your-repo>
   cd mindbloom-ai
   npm install
   npm run build
   ```

3. **Configure environment**
   ```bash
   echo "GEMINI_API_KEY=your_key" > .env.local
   ```

4. **Run with PM2** (process manager)
   ```bash
   sudo npm install -g pm2
   pm2 start npm --name "mindbloom-ai" -- start
   pm2 startup
   pm2 save
   ```

5. **Setup Nginx reverse proxy**
   ```nginx
   server {
       listen 80;
       server_name your-domain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

## Environment Variables

All deployment platforms require the following environment variable:

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key for AI analysis | Yes |

## Post-Deployment Checklist

- [ ] Verify environment variables are set correctly
- [ ] Test check-in flow end-to-end
- [ ] Confirm AI analysis is working
- [ ] Test on mobile devices
- [ ] Verify HTTPS is enabled
- [ ] Test emergency modal triggers correctly
- [ ] Check browser console for errors
- [ ] Verify local storage is working
- [ ] Test keyboard navigation
- [ ] Confirm all routes are accessible

## Performance Optimization

### Enable Next.js Caching
Already configured in `next.config.ts` with automatic optimizations.

### CDN Configuration
Vercel and Netlify automatically provide CDN. For self-hosted:
- Use Cloudflare for CDN and DDoS protection
- Enable gzip/brotli compression in Nginx
- Implement browser caching headers

### API Rate Limiting
Consider implementing rate limiting for `/api/analyze`:

```typescript
// Add to api/analyze/route.ts
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const ratelimit = new Ratelimit({
  redis: Redis.fromEnv(),
  limiter: Ratelimit.slidingWindow(10, "1 h"),
});
```

## Monitoring

### Vercel Analytics
Enable in Vercel dashboard → Analytics

### Error Tracking
Add Sentry for production error tracking:
```bash
npm install @sentry/nextjs
```

### Health Check
Access `/api/analyze` (GET) to verify API is responding.

## Troubleshooting

### "GEMINI_API_KEY is not configured" error
- Verify environment variable is set in deployment platform
- Restart/redeploy after adding environment variable

### API rate limits exceeded
- Gemini has rate limits on free tier
- Consider implementing request caching
- Upgrade to paid Gemini API plan

### Build fails on Vercel
- Check build logs for specific errors
- Verify all dependencies in package.json
- Ensure TypeScript has no errors: `npm run build` locally

### App works locally but not in production
- Check browser console for errors
- Verify environment variables are set
- Ensure API routes are accessible
- Check for CORS issues

## Security Considerations

1. **Never commit .env.local to git**
   - Already in .gitignore
   - Use environment variables in deployment platform

2. **API Key Security**
   - Never expose Gemini API key to client-side
   - All AI calls go through `/api/analyze` server route

3. **Input Sanitization**
   - Already implemented in validators
   - Zod schema validates all inputs

4. **Rate Limiting**
   - Consider implementing for production
   - Prevents abuse of AI API

## Support

For deployment issues:
1. Check Vercel/platform-specific documentation
2. Review Next.js deployment docs: https://nextjs.org/docs/deployment
3. Check Google Gemini API status: https://status.cloud.google.com/

---

**Need help?** Open an issue on GitHub or consult the main README.md
