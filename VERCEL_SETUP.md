# Vercel Deployment Setup Guide

## Fixing the 500 Error: Missing GROQ_API_KEY

The 500 error you're seeing means the `GROQ_API_KEY` environment variable is not set in your Vercel project.

## Step-by-Step: Add Environment Variable to Vercel

### Option 1: Via Vercel Dashboard (Recommended)

1. **Go to your Vercel Dashboard**
   - Visit [https://vercel.com/dashboard](https://vercel.com/dashboard)
   - Sign in if needed

2. **Select Your Project**
   - Click on your portfolio project (`my-portfolio`)

3. **Navigate to Settings**
   - Click on the **Settings** tab at the top
   - Or go to: `https://vercel.com/[your-username]/[your-project]/settings`

4. **Go to Environment Variables**
   - In the left sidebar, click on **Environment Variables**
   - Or scroll down to the "Environment Variables" section

5. **Add New Variable**
   - Click **Add New** or **Add Environment Variable**
   - Fill in:
     - **Key:** `GROQ_API_KEY`
     - **Value:** Your Groq API key (starts with `gsk_...`)
     - **Environment:** Select all three:
       - ✅ Production
       - ✅ Preview  
       - ✅ Development
   - Click **Save**

6. **Redeploy Your Application**
   - Go to the **Deployments** tab
   - Find your latest deployment
   - Click the **⋯** (three dots) menu
   - Click **Redeploy**
   - Or push a new commit to trigger a redeploy

### Option 2: Via Vercel CLI

1. **Install Vercel CLI** (if not already installed)
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**
   ```bash
   vercel login
   ```

3. **Link your project** (if not already linked)
   ```bash
   vercel link
   ```

4. **Add the environment variable**
   ```bash
   vercel env add GROQ_API_KEY
   ```
   - When prompted, paste your Groq API key
   - Select all environments (Production, Preview, Development)

5. **Redeploy**
   ```bash
   vercel --prod
   ```

## Verify Your Setup

After adding the environment variable and redeploying:

1. **Check the deployment logs**
   - Go to your deployment in Vercel
   - Click on the deployment
   - Check the "Functions" tab to see if there are any errors

2. **Test the chatbot**
   - Visit your deployed site
   - Click the "Chat with Me" button
   - Try sending a message
   - It should work now!

## Troubleshooting

### Still getting 500 error?

1. **Verify the API key is correct**
   - Make sure there are no extra spaces
   - The key should start with `gsk_`
   - Get a fresh key from [Groq Console](https://console.groq.com/) if needed

2. **Check Vercel logs**
   - Go to your deployment → Functions → `api/chat`
   - Look for error messages
   - Common issues:
     - "GROQ_API_KEY is not configured" → Variable not set correctly
     - "Invalid API key" → Wrong key value
     - "Rate limit exceeded" → Too many requests

3. **Make sure you redeployed**
   - Environment variables only take effect after redeployment
   - Push a new commit or manually redeploy

4. **Check variable scope**
   - Make sure the variable is set for the correct environment (Production/Preview/Development)

### Getting 401 Unauthorized?

- Your API key is invalid or expired
- Get a new key from [Groq Console](https://console.groq.com/)
- Update it in Vercel and redeploy

### Getting 429 Rate Limit?

- You've exceeded Groq's rate limits
- Wait a few minutes and try again
- Consider upgrading your Groq plan if this happens frequently

## Quick Checklist

- [ ] Got Groq API key from [console.groq.com](https://console.groq.com/)
- [ ] Added `GROQ_API_KEY` to Vercel environment variables
- [ ] Selected all environments (Production, Preview, Development)
- [ ] Redeployed the application
- [ ] Tested the chatbot on the deployed site

## Need Help?

- **Vercel Docs:** [https://vercel.com/docs/concepts/projects/environment-variables](https://vercel.com/docs/concepts/projects/environment-variables)
- **Groq Console:** [https://console.groq.com/](https://console.groq.com/)
- **Check your deployment logs** in Vercel dashboard for specific error messages
