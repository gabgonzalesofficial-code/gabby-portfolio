import express from 'express'
import { createServer as createViteServer } from 'vite'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import dotenv from 'dotenv'
import Groq from 'groq-sdk'

// Load environment variables
dotenv.config()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

const app = express()
const PORT = process.env.PORT || 5173

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

// Middleware
app.use(express.json())

// API Route for Chat
app.post('/api/chat', async (req, res) => {
  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

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

async function createServer() {
  // Create Vite server
  const vite = await createViteServer({
    server: { middlewareMode: true },
    appType: 'spa',
  })

  // Use Vite's connect instance as middleware
  app.use(vite.ssrLoadModule)

  // Serve static files and handle SPA routing
  app.use('*', async (req, res, next) => {
    try {
      // Handle API routes
      if (req.originalUrl.startsWith('/api/')) {
        return next()
      }

      // Serve Vite dev server for all other routes
      const url = req.originalUrl
      const template = await vite.transformIndexHtml(url, `
        <!doctype html>
        <html lang="en">
          <head>
            <meta charset="UTF-8" />
            <link rel="icon" type="image/svg+xml" href="/src/assets/PP.png" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <title>Gabby Gonzales's Portfolio</title>
          </head>
          <body>
            <div id="root"></div>
            <script type="module" src="/src/main.jsx"></script>
          </body>
        </html>
      `)
      res.status(200).set({ 'Content-Type': 'text/html' }).end(template)
    } catch (e) {
      vite.ssrFixStacktrace(e)
      next(e)
    }
  })

  app.listen(PORT, () => {
    console.log(`🚀 Server running at http://localhost:${PORT}`)
    console.log(`📝 API routes available at http://localhost:${PORT}/api/chat`)
    if (!process.env.GROQ_API_KEY) {
      console.warn('⚠️  Warning: GROQ_API_KEY not found in .env file')
    }
  })
}

createServer().catch(console.error)
