import Groq from 'groq-sdk';

// Rate limiting: Store IP addresses and their request counts
// In production, consider using Redis or a database for distributed systems
const rateLimitMap = new Map();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute in milliseconds
const RATE_LIMIT_MAX_REQUESTS = 10; // Max requests per window

// Clean up old entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now - data.resetTime > RATE_LIMIT_WINDOW) {
      rateLimitMap.delete(ip);
    }
  }
}, 5 * 60 * 1000); // Clean up every 5 minutes

// Security configuration
const MAX_MESSAGE_LENGTH = 2000; // Maximum characters per message
const MAX_CONVERSATION_HISTORY_LENGTH = 20; // Maximum conversation history items
const REQUEST_TIMEOUT = 30000; // 30 seconds timeout

// Prompt injection patterns to detect
const PROMPT_INJECTION_PATTERNS = [
  /ignore\s+(previous|all|above)\s+instructions?/i,
  /forget\s+(previous|all|above)\s+instructions?/i,
  /disregard\s+(previous|all|above)\s+instructions?/i,
  /you\s+are\s+now/i,
  /act\s+as\s+if/i,
  /pretend\s+to\s+be/i,
  /roleplay\s+as/i,
  /system\s*:/i,
  /assistant\s*:/i,
  /user\s*:/i,
  /\[system\]/i,
  /\[assistant\]/i,
  /\[user\]/i,
  /<\|system\|>/i,
  /<\|assistant\|>/i,
  /<\|user\|>/i,
  /override\s+instructions?/i,
  /new\s+instructions?/i,
  /follow\s+these\s+instructions?/i,
  /execute\s+this\s+prompt/i,
  /jailbreak/i,
  /bypass/i,
  /hack/i,
];

// Get client IP address
function getClientIP(req) {
  return (
    req.headers['x-forwarded-for']?.split(',')[0] ||
    req.headers['x-real-ip'] ||
    req.connection?.remoteAddress ||
    req.socket?.remoteAddress ||
    'unknown'
  );
}

// Rate limiting check
function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  if (!record) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }

  // Reset if window expired
  if (now > record.resetTime) {
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW,
    });
    return { allowed: true, remaining: RATE_LIMIT_MAX_REQUESTS - 1 };
  }

  // Check if limit exceeded
  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    const retryAfter = Math.ceil((record.resetTime - now) / 1000);
    return {
      allowed: false,
      remaining: 0,
      retryAfter,
    };
  }

  // Increment count
  record.count++;
  rateLimitMap.set(ip, record);
  return {
    allowed: true,
    remaining: RATE_LIMIT_MAX_REQUESTS - record.count,
  };
}

// Check for prompt injection attempts
function detectPromptInjection(message) {
  const lowerMessage = message.toLowerCase();
  
  for (const pattern of PROMPT_INJECTION_PATTERNS) {
    if (pattern.test(message)) {
      return true;
    }
  }
  
  // Check for suspicious character patterns
  if (message.includes('```') && (message.includes('system') || message.includes('assistant'))) {
    return true;
  }
  
  return false;
}

// Timeout wrapper for async functions
function withTimeout(promise, timeoutMs) {
  return Promise.race([
    promise,
    new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Request timeout')), timeoutMs)
    ),
  ]);
}

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Get client IP for rate limiting
  const clientIP = getClientIP(req);

  // Rate limiting check
  const rateLimit = checkRateLimit(clientIP);
  if (!rateLimit.allowed) {
    res.setHeader('Retry-After', rateLimit.retryAfter);
    return res.status(429).json({
      error: 'Rate limit exceeded',
      details: `Too many requests. Please try again in ${rateLimit.retryAfter} seconds.`,
      retryAfter: rateLimit.retryAfter,
    });
  }

  // Set rate limit headers
  res.setHeader('X-RateLimit-Limit', RATE_LIMIT_MAX_REQUESTS);
  res.setHeader('X-RateLimit-Remaining', rateLimit.remaining);

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

  // Log API key status (first few chars only for security)
  const apiKeyPreview = process.env.GROQ_API_KEY.substring(0, 7) + '...';
  console.log('Groq client initialized with API key:', apiKeyPreview);

  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Validate message length
    const trimmedMessage = message.trim();
    if (trimmedMessage.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        error: 'Message too long',
        details: `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters. Please shorten your message.`,
        maxLength: MAX_MESSAGE_LENGTH,
        receivedLength: trimmedMessage.length,
      });
    }

    // Check for prompt injection attempts
    if (detectPromptInjection(trimmedMessage)) {
      console.warn(`Potential prompt injection detected from IP: ${clientIP}`);
      return res.status(400).json({
        error: 'Invalid message format',
        details: 'Your message contains patterns that are not allowed. Please rephrase your question.',
      });
    }

    // Validate conversation history length
    if (Array.isArray(conversationHistory) && conversationHistory.length > MAX_CONVERSATION_HISTORY_LENGTH) {
      return res.status(400).json({
        error: 'Conversation history too long',
        details: `Maximum ${MAX_CONVERSATION_HISTORY_LENGTH} messages allowed in conversation history.`,
      });
    }

    // Validate conversation history items for prompt injection
    if (Array.isArray(conversationHistory)) {
      for (const item of conversationHistory) {
        if (item && item.content && detectPromptInjection(item.content)) {
          console.warn(`Potential prompt injection detected in conversation history from IP: ${clientIP}`);
          return res.status(400).json({
            error: 'Invalid conversation history',
            details: 'Your conversation history contains patterns that are not allowed.',
          });
        }
      }
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

    // Call Groq API with timeout
    const completion = await withTimeout(
      groq.chat.completions.create({
        messages,
        model: 'llama-3.3-70b-versatile',
        temperature: 0.8, // Higher for more creative/witty responses
        max_tokens: 1024,
        top_p: 1,
        stream: false,
      }),
      REQUEST_TIMEOUT
    );

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

    // Handle timeout errors
    if (error.message === 'Request timeout' || error.message?.includes('timeout')) {
      return res.status(504).json({
        error: 'Request timeout',
        details: 'The request took too long to process. Please try again with a shorter message.',
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
    const isDevelopment = process.env.VERCEL_ENV === 'development' || process.env.NODE_ENV === 'development';
    
    return res.status(500).json({ 
      error: 'Failed to get response from AI. Please try again.',
      details: isDevelopment ? errorMessage : 'Check Vercel function logs for details. Error type: ' + (error.constructor?.name || 'Unknown')
    });
  }
}
