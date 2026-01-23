# Local Development Guide

## Important: API Routes Only Work with Vercel CLI

The chatbot API routes (`api/chat.js`) are **Vercel serverless functions** and **only work** when using Vercel CLI for local development.

## ❌ This Won't Work

```bash
npm run dev
```

When you run `npm run dev`, Vite starts on `http://localhost:5173`, but:
- ❌ The `api/` folder is **not** served by Vite
- ❌ API routes will return **404 errors**
- ❌ The chatbot won't work locally

## ✅ Use This Instead

### Option 1: Vercel CLI (Recommended)

```bash
# Install Vercel CLI globally (one-time setup)
npm install -g vercel

# Run local development with API routes
vercel dev
```

This will:
- ✅ Start the frontend (Vite)
- ✅ Serve API routes from `api/` folder
- ✅ Load environment variables from `.env`
- ✅ Simulate Vercel deployment locally

### Option 2: Test on Deployed Site

Simply test the chatbot on your deployed Vercel site:
- Production: `https://your-domain.vercel.app`
- Preview: Check your Vercel dashboard for preview URLs

## Setup Steps

1. **Install Vercel CLI** (if not already installed):
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Link your project** (first time only):
   ```bash
   vercel link
   ```
   - Select your existing project or create a new one

4. **Start development server**:
   ```bash
   vercel dev
   ```

5. **Open your browser**:
   - The terminal will show the local URL (usually `http://localhost:3000`)
   - Open that URL in your browser
   - The chatbot should now work!

## Environment Variables

Make sure your `.env` file exists in the root directory:
```
GROQ_API_KEY=your_groq_api_key_here
```

Vercel CLI will automatically load this file.

## Troubleshooting

### "Command not found: vercel"
- Install Vercel CLI: `npm install -g vercel`

### "API route still returns 404"
- Make sure you're using `vercel dev`, not `npm run dev`
- Check that `api/chat.js` exists in your project
- Verify you're accessing the correct URL (check terminal output)

### "GROQ_API_KEY not configured"
- Create a `.env` file in the root directory
- Add: `GROQ_API_KEY=your_key_here`
- Restart `vercel dev`

## Quick Reference

| Command | Frontend | API Routes | Use Case |
|---------|----------|------------|----------|
| `npm run dev` | ✅ Yes | ❌ No | Frontend-only development |
| `vercel dev` | ✅ Yes | ✅ Yes | Full-stack development |
| Deployed site | ✅ Yes | ✅ Yes | Production testing |

## Why This Happens

- **Vite** (`npm run dev`) is a frontend build tool - it only serves static files and your React app
- **Vercel serverless functions** (`api/` folder) need a Node.js runtime
- **Vercel CLI** (`vercel dev`) provides the Node.js runtime needed for serverless functions

This is normal and expected behavior! Use `vercel dev` for local development with API routes.
