# Chatbot Setup Guide

This guide will help you set up the Groq AI chatbot for your portfolio.

## Prerequisites

1. A Groq account - Sign up at [https://console.groq.com/](https://console.groq.com/)
2. A Groq API key (free tier available)

## Step 1: Get Your Groq API Key

1. Go to [Groq Console](https://console.groq.com/)
2. Sign up or log in
3. Navigate to API Keys section
4. Create a new API key
5. Copy the API key (you'll need it in the next steps)

## Step 2: Local Development Setup

1. Create a `.env` file in the root directory of your project:
   ```
   GROQ_API_KEY=your_groq_api_key_here
   ```

2. For local development, you'll need Vercel CLI to run the API routes:
   ```bash
   npm install -g vercel
   vercel dev
   ```
   
   This will start both the frontend (Vite) and API routes locally.

   **Alternative:** If you prefer using `npm run dev`, you'll need to set up a proxy in `vite.config.js` or use a separate backend server.

## Step 3: Vercel Deployment Setup

1. Deploy your project to Vercel (if not already deployed)

2. Go to your Vercel project dashboard

3. Navigate to **Settings** → **Environment Variables**

4. Add a new environment variable:
   - **Name:** `GROQ_API_KEY`
   - **Value:** Your Groq API key
   - **Environment:** Production, Preview, and Development (select all)

5. Redeploy your application

## Step 4: Test the Chatbot

1. Open your portfolio website
2. Look for the "Chat with Me" button in the bottom-right corner
3. Click it to open the chatbot
4. Try asking questions like:
   - "Tell me about Gabriel's skills"
   - "What projects has Gabriel worked on?"
   - "What is Gabriel's experience?"

## Customization

### Changing the AI Model

You can change the Groq model in `api/chat.js`:
```javascript
model: 'llama-3.1-70b-versatile', // Change this to other models like:
// 'llama-3.1-8b-instant'
// 'mixtral-8x7b-32768'
// 'gemma-7b-it'
```

### Customizing the System Prompt

Edit the system message in `api/chat.js` to change how the AI behaves:
```javascript
{
  role: 'system',
  content: `Your custom system prompt here...`
}
```

### Styling the Chatbot

The chatbot component is in `src/components/ChatBot.jsx`. You can customize:
- Colors and themes
- Chat window size
- Message styling
- Animations

## Troubleshooting

### Chatbot not responding
- Check that `GROQ_API_KEY` is set correctly
- Verify the API key is valid in Groq Console
- Check browser console for errors
- Ensure API route is accessible (check Network tab)

### API route not found (404)
- Make sure you're using `vercel dev` for local development
- Verify the `api/chat.js` file exists
- Check Vercel deployment logs

### Rate limit errors
- Groq has rate limits on free tier
- Wait a few moments and try again
- Consider upgrading your Groq plan if needed

## Security Notes

- **Never commit your `.env` file** - it's already in `.gitignore`
- Keep your API key secure
- Consider adding rate limiting for production use
- Monitor API usage in Groq Console

## Support

For issues with:
- **Groq API:** Check [Groq Documentation](https://console.groq.com/docs)
- **Vercel:** Check [Vercel Documentation](https://vercel.com/docs)
- **This Implementation:** Check the code comments in `api/chat.js` and `src/components/ChatBot.jsx`
