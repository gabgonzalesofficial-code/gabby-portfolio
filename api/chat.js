import Groq from 'groq-sdk';
import { portfolioData } from './portfolioData.js';

// Rate limiting storage (in-memory, resets on cold start)
// In production, consider using Redis or Vercel KV for persistent rate limiting
const rateLimitStore = new Map();

// Rate limit configuration
const RATE_LIMIT_CONFIG = {
  maxRequests: 10,        // Maximum requests per window
  windowMs: 60000,        // Time window in milliseconds (1 minute)
  cleanupInterval: 300000  // Cleanup old entries every 5 minutes
};

// Character limit configuration
const MAX_MESSAGE_LENGTH = 1000;  // Maximum characters per message

// Cleanup old rate limit entries periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, data] of rateLimitStore.entries()) {
    if (now - data.firstRequest > RATE_LIMIT_CONFIG.windowMs * 2) {
      rateLimitStore.delete(ip);
    }
  }
}, RATE_LIMIT_CONFIG.cleanupInterval);

// Helper function to get client IP
function getClientIP(req) {
  // Check various headers for the real IP (Vercel uses x-forwarded-for)
  const forwarded = req.headers['x-forwarded-for'];
  const realIP = req.headers['x-real-ip'];
  
  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, take the first one
    return forwarded.split(',')[0].trim();
  }
  
  return realIP || req.connection?.remoteAddress || 'unknown';
}

// Rate limiting middleware
function checkRateLimit(ip) {
  const now = Date.now();
  const record = rateLimitStore.get(ip);

  if (!record) {
    // First request from this IP
    rateLimitStore.set(ip, {
      count: 1,
      firstRequest: now,
      resetAt: now + RATE_LIMIT_CONFIG.windowMs
    });
    return { allowed: true, remaining: RATE_LIMIT_CONFIG.maxRequests - 1 };
  }

  // Check if window has expired
  if (now > record.resetAt) {
    // Reset the window
    rateLimitStore.set(ip, {
      count: 1,
      firstRequest: now,
      resetAt: now + RATE_LIMIT_CONFIG.windowMs
    });
    return { allowed: true, remaining: RATE_LIMIT_CONFIG.maxRequests - 1 };
  }

  // Check if limit exceeded
  if (record.count >= RATE_LIMIT_CONFIG.maxRequests) {
    const retryAfter = Math.ceil((record.resetAt - now) / 1000);
    return { 
      allowed: false, 
      remaining: 0,
      retryAfter 
    };
  }

  // Increment count
  record.count++;
  rateLimitStore.set(ip, record);
  
  return { 
    allowed: true, 
    remaining: RATE_LIMIT_CONFIG.maxRequests - record.count 
  };
}

export default async function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Log the request method for debugging
  console.log('API Request received:', {
    method: req.method,
    url: req.url,
    headers: req.headers
  });

  // Handle OPTIONS request (CORS preflight)
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    console.log('Method not allowed:', req.method);
    return res.status(405).json({ 
      error: 'Method not allowed',
      receivedMethod: req.method,
      allowedMethods: ['POST', 'OPTIONS']
    });
  }

  // Get client IP for rate limiting
  const clientIP = getClientIP(req);
  
  // Check rate limit
  const rateLimit = checkRateLimit(clientIP);
  if (!rateLimit.allowed) {
    res.setHeader('Retry-After', rateLimit.retryAfter);
    res.setHeader('X-RateLimit-Limit', RATE_LIMIT_CONFIG.maxRequests);
    res.setHeader('X-RateLimit-Remaining', rateLimit.remaining);
    res.setHeader('X-RateLimit-Reset', new Date(Date.now() + rateLimit.retryAfter * 1000).toISOString());
    
    return res.status(429).json({
      error: 'Rate limit exceeded',
      details: `Too many requests. Please try again in ${rateLimit.retryAfter} seconds.`,
      retryAfter: rateLimit.retryAfter,
      limit: RATE_LIMIT_CONFIG.maxRequests,
      window: '1 minute'
    });
  }

  // Add rate limit headers to successful requests
  res.setHeader('X-RateLimit-Limit', RATE_LIMIT_CONFIG.maxRequests);
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

    // Check character limit
    if (message.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({
        error: 'Message too long',
        details: `Message exceeds maximum length of ${MAX_MESSAGE_LENGTH} characters. Your message is ${message.length} characters.`,
        maxLength: MAX_MESSAGE_LENGTH,
        currentLength: message.length
      });
    }

    // Build conversation messages with actual portfolio data
    const data = portfolioData;
    
    // Format tech stack for easy reference
    const allTechStack = [
      ...data.techStack.frontend,
      ...data.techStack.backend,
      ...data.techStack.crmCms,
      ...data.techStack.automation,
      ...data.techStack.database,
      ...data.techStack.tools,
      ...data.techStack.gameDev,
      ...data.techStack.aiTools.map(t => t.name)
    ].join(', ');

    const messages = [
      {
        role: 'system',
        content: `You are Gabriel Gonzales, a witty and humorous Web/WordPress Developer based in Cebu City, Philippines. You're speaking as yourself through your portfolio's AI chatbot.

**CRITICAL: You MUST ONLY use the information provided below. Do NOT make up or invent any details. If asked about something not listed here, politely say you don't have that information and direct them to check your portfolio or use the contact form.**

**Your Personality & Tone:**
- Witty, humorous, but always polite and respectful
- Helpful, confident, and kind
- You have a great sense of humor and aren't afraid to show it
- You're approachable and make people feel comfortable
- You can be playful with your responses while staying professional

**Your Actual Profile Information:**
- Name: ${data.profileInfo.name}
- Location: ${data.profileInfo.location}
- Title: ${data.profileInfo.title}
- Email: ${data.profileInfo.contact.email}
- Mobile: ${data.profileInfo.contact.mobile}
- LinkedIn: ${data.profileInfo.contact.linkedin}

**About You (from your portfolio):**
${data.aboutContent.map(para => `- ${para}`).join('\n')}

**Your Tech Stack (EXACT LIST - only mention these):**
Frontend: ${data.techStack.frontend.join(', ')}
Backend: ${data.techStack.backend.join(', ')}
CRM/CMS: ${data.techStack.crmCms.join(', ')}
Automation: ${data.techStack.automation.join(', ')}
Database: ${data.techStack.database.join(', ')}
Tools: ${data.techStack.tools.join(', ')}
Game Development: ${data.techStack.gameDev.join(', ')}
AI Tools: ${data.techStack.aiTools.map(t => `${t.name} (${t.description})`).join(', ')}

**Your Experience (EXACT LIST):**
${data.experience.map(exp => `- ${exp.role} at ${exp.company} (${exp.year})`).join('\n')}

**Your Projects (EXACT LIST):**
${data.projects.map(proj => `- ${proj.name}: ${proj.description} - ${proj.url}`).join('\n')}

**Your Certifications (Recent):**
${data.certifications.slice(0, 4).map(cert => `- ${cert.name} from ${cert.issuer} (${cert.year})`).join('\n')}

**Beyond Coding:**
${data.beyondCoding.map(item => `- ${item}`).join('\n')}
- You're a bit of a hopeless romantic (love poems)
- You're currently exploring AI integration in your developments
- In the future, you'd like to delve into game development and develop one on your own

**Recommendations (if asked):**
${data.recommendations.filter(r => r.quote && !r.quote.includes('placeholder')).map(rec => `- "${rec.quote}" - ${rec.author}, ${rec.position}`).join('\n\n')}

**How to Respond:**
- STRICTLY use ONLY the information provided above - do NOT invent or assume details
- If asked about something not in the data above, say: "I don't have that specific information in my portfolio. Feel free to check my portfolio sections or use the contact form for more details!"
- Be conversational and engaging - use your wit and humor naturally
- Reference specific projects, technologies, or experiences from the data above
- Be authentic to Gabriel's personality - witty, helpful, confident, and kind
- Keep responses concise but personable
- Use emojis sparingly and naturally when appropriate
- When mentioning tech stack, be specific and use the exact names from the list above
- If someone asks about your cooking or poetry, feel free to be enthusiastic!`
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
      temperature: 0.7, // Balanced for accuracy while maintaining personality
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
