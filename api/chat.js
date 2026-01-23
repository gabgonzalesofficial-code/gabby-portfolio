import Groq from 'groq-sdk';

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle OPTIONS request
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Check if API key is configured
  if (!process.env.GROQ_API_KEY) {
    console.error('GROQ_API_KEY is not configured');
    return res.status(500).json({ 
      error: 'API key not configured. Please set GROQ_API_KEY in your Vercel environment variables.',
      details: 'The GROQ_API_KEY environment variable is missing or empty.'
    });
  }

  // Initialize Groq client (do this inside the handler to ensure env vars are loaded)
  const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY,
  });

  try {
    // Parse body if it's a string (Vercel sometimes sends stringified JSON)
    let requestBody = req.body;
    if (typeof req.body === 'string') {
      try {
        requestBody = JSON.parse(req.body);
      } catch (e) {
        console.error('Failed to parse request body:', e);
        return res.status(400).json({ error: 'Invalid request body format' });
      }
    }

    const { message, conversationHistory = [] } = requestBody || {};

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build conversation messages
    const messages = [
      {
        role: 'system',
        content: `You are Gabriel Gonzales, a witty and humorous Web/WordPress Developer based in Cebu City, Philippines. You're speaking as yourself through your portfolio's AI chatbot.

**Your Personality & Tone:**
- Witty, humorous, but always polite and respectful
- Helpful, confident, and kind
- You have a great sense of humor and aren't afraid to show it
- You're approachable and make people feel comfortable
- You can be playful with your responses while staying professional

**About You:**
- You're a Web Developer, currently immersed in WordPress CRM development
- You have great fundamentals in programming, which makes you quick to catch on to new topics
- You're highly adaptable and a motivated learner
- You're a great team player but also efficient working independently
- You have exemplary usage of AI tools like Cursor, ChatGPT, and Gemini - allowing for faster and time-efficient builds without sacrificing quality
- Your tech stack includes: HTML, CSS, JavaScript, React, Vue.js, PHP, Laravel, Python, WordPress, MySQL, and various other technologies (check the portfolio for the full list)
- You have varying mastery levels across different technologies, which you're honest about

**Beyond Coding:**
- You've written several poems, mostly about love - you're a bit of a hopeless romantic
- You love cooking and would like to know more dishes if given the resources (and a beautiful kitchen!)
- You're currently exploring AI integration in your developments
- In the future, you'd like to delve into game development and develop one on your own

**How to Respond:**
- Answer questions about your skills, experience, projects, and work
- Be conversational and engaging - use your wit and humor naturally
- If asked about something not in your knowledge, politely direct them to use the contact form or check the portfolio sections
- Feel free to share your interests (poetry, cooking, future game dev plans) when relevant
- Be authentic to Gabriel's personality - witty, helpful, confident, and kind
- Keep responses concise but personable
- Use emojis sparingly and naturally when appropriate
- If someone asks about your cooking or poetry, feel free to be enthusiastic and share your passion!`
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ];

    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages,
      model: 'llama-3.3-70b-versatile',
      temperature: 0.8, // Higher for more creative/witty responses
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    });

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.';

    return res.status(200).json({ 
      response,
      usage: completion.usage 
    });

  } catch (error) {
    // Log full error details for debugging
    console.error('Groq API Error:', {
      message: error.message,
      status: error.status,
      statusCode: error.statusCode,
      code: error.code,
      type: error.constructor?.name,
      stack: error.stack?.substring(0, 500) // Limit stack trace length
    });
    
    // Handle specific error cases
    if (error.status === 401 || error.statusCode === 401 || error.message?.includes('401') || error.message?.includes('Unauthorized') || error.message?.includes('authentication')) {
      return res.status(401).json({ 
        error: 'Invalid API key. Please check your GROQ_API_KEY in Vercel environment variables.',
        details: 'The API key may be missing, incorrect, or expired.'
      });
    }
    
    if (error.status === 429 || error.statusCode === 429 || error.message?.includes('429') || error.message?.includes('rate limit') || error.message?.includes('quota')) {
      return res.status(429).json({ 
        error: 'Rate limit exceeded. Please try again later.',
        details: 'You have exceeded the API rate limit. Please wait a moment before trying again.'
      });
    }

    // Handle network/connection errors
    if (error.message?.includes('fetch') || error.message?.includes('network') || error.message?.includes('ECONNREFUSED') || error.code === 'ECONNREFUSED') {
      return res.status(503).json({ 
        error: 'Unable to connect to AI service. Please try again later.',
        details: 'There may be a network issue or the service is temporarily unavailable.'
      });
    }

    // Handle invalid model errors
    if (error.message?.includes('model') || error.message?.includes('invalid')) {
      return res.status(400).json({ 
        error: 'Invalid model configuration.',
        details: error.message || 'The specified model may not be available.'
      });
    }

    // Generic error response with more details
    const errorMessage = error.message || 'Unknown error occurred';
    const isDevelopment = process.env.VERCEL_ENV === 'development' || process.env.NODE_ENV === 'development' || process.env.VERCEL_ENV === 'preview';
    
    // Log full error for debugging
    console.error('Full error object:', JSON.stringify(error, Object.getOwnPropertyNames(error)));
    
    return res.status(500).json({ 
      error: 'Failed to get response from AI. Please try again.',
      details: isDevelopment ? `${errorMessage} (Type: ${error.constructor?.name || 'Unknown'})` : 'Check Vercel function logs for details. Error type: ' + (error.constructor?.name || 'Unknown')
    });
  }
}
