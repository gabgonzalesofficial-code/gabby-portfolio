import Groq from 'groq-sdk';

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export default async function handler(req, res) {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

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
      model: 'llama-3.1-70b-versatile', // You can change this to other Groq models
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
    console.error('Groq API Error:', error);
    
    // Handle specific error cases
    if (error.status === 401) {
      return res.status(401).json({ error: 'Invalid API key' });
    }
    
    if (error.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' });
    }

    return res.status(500).json({ 
      error: 'Failed to get response from AI. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
}
