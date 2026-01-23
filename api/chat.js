import Groq from 'groq-sdk';

export default async function handler(req, res) {
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

  // Log API key status (first few chars only for security)
  const apiKeyPreview = process.env.GROQ_API_KEY.substring(0, 7) + '...';
  console.log('Groq client initialized with API key:', apiKeyPreview);

  try {
    const { message, conversationHistory = [] } = req.body;

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Build conversation messages
    const messages = [
      {
        role: 'system',
        content: `You are a helpful AI assistant for Gabriel Gonzales's portfolio website. 
        You help visitors learn about Gabriel's skills, experience, projects, and answer questions about his work.
        Be friendly, professional, and concise. If asked about specific details not in your knowledge, 
        politely direct them to use the contact form or check the portfolio sections.`
      },
      ...conversationHistory,
      {
        role: 'user',
        content: message
      }
    ];

    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages: messages,
      model: 'llama-3.3-70b-versatile', // You can change this to other Groq models
      temperature: 0.7,
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
    const isDevelopment = process.env.VERCEL_ENV === 'development' || process.env.NODE_ENV === 'development';
    
    return res.status(500).json({ 
      error: 'Failed to get response from AI. Please try again.',
      details: isDevelopment ? errorMessage : 'Check Vercel function logs for details. Error type: ' + (error.constructor?.name || 'Unknown')
    });
  }
}
