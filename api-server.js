import express from 'express'
import dotenv from 'dotenv'
import Groq from 'groq-sdk'
import cors from 'cors'

// Load environment variables
dotenv.config()

const app = express()
const PORT = process.env.API_PORT || 3001

// Middleware
app.use(cors())
app.use(express.json())

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

// API Route for Chat
app.post('/api/chat', async (req, res) => {
  try {
    const { message, conversationHistory = [] } = req.body

    if (!message || !message.trim()) {
      return res.status(400).json({ error: 'Message is required' })
    }

    if (!process.env.GROQ_API_KEY) {
      return res.status(500).json({ error: 'GROQ_API_KEY is not configured. Please check your .env file.' })
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
    ]

    // Call Groq API
    const completion = await groq.chat.completions.create({
      messages: messages,
      model: 'llama-3.1-70b-versatile',
      temperature: 0.7,
      max_tokens: 1024,
      top_p: 1,
      stream: false,
    })

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.'

    return res.status(200).json({ 
      response,
      usage: completion.usage 
    })

  } catch (error) {
    console.error('Groq API Error:', error)
    
    // Handle specific error cases
    if (error.status === 401) {
      return res.status(401).json({ error: 'Invalid API key. Please check your GROQ_API_KEY in the .env file.' })
    }
    
    if (error.status === 429) {
      return res.status(429).json({ error: 'Rate limit exceeded. Please try again later.' })
    }

    return res.status(500).json({ 
      error: 'Failed to get response from AI. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    })
  }
})

app.listen(PORT, () => {
  console.log(`🚀 API Server running at http://localhost:${PORT}`)
  console.log(`📝 Chat API available at http://localhost:${PORT}/api/chat`)
  if (!process.env.GROQ_API_KEY) {
    console.warn('⚠️  Warning: GROQ_API_KEY not found in .env file')
  } else {
    console.log('✅ GROQ_API_KEY loaded successfully')
  }
})
