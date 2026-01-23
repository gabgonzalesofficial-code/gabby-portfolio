import { useState, useRef, useEffect, useCallback } from 'react'

function ChatBot({ isOpen, onClose }) {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "Hey there! 👋 I'm Gabriel, and I'm here to chat! Ask me about my work, my tech stack, my love for cooking (and poetry, if you're into that sort of thing 😄), or anything else you're curious about. I'm pretty adaptable, so fire away!"
    }
  ])
  const [input, setInput] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  
  const MAX_MESSAGE_LENGTH = 2000

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen && inputRef.current) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  const handleSend = useCallback(async (e) => {
    e.preventDefault()
    
    if (!input.trim() || isLoading) return

    const userMessage = input.trim()
    
    // Client-side validation
    if (userMessage.length > MAX_MESSAGE_LENGTH) {
      setError(`Message is too long. Maximum ${MAX_MESSAGE_LENGTH} characters allowed.`)
      return
    }
    
    setInput('')
    setError('')
    
    // Add user message to chat
    const newMessages = [...messages, { role: 'user', content: userMessage }]
    setMessages(newMessages)
    setIsLoading(true)

    try {
      // Prepare conversation history (excluding system message)
      const conversationHistory = messages
        .filter(msg => msg.role !== 'system')
        .map(msg => ({
          role: msg.role,
          content: msg.content
        }))

      // Call API
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage,
          conversationHistory: conversationHistory
        }),
      })

      // Read response text once (can only read body once)
      const responseText = await response.text()
      
      // Check if response is ok
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`
        
        // Try to parse as JSON for error details
        try {
          if (responseText) {
            const errorData = JSON.parse(responseText)
            errorMessage = errorData.error || errorMessage
          }
        } catch (e) {
          // If response is not JSON, provide helpful error based on status
          if (response.status === 404) {
            errorMessage = 'API route not found. Make sure you are using "vercel dev" for local development or deploy to Vercel.'
          } else if (response.status === 500) {
            errorMessage = 'Server error. Please check your API key in your .env file and try again.'
          } else if (response.status === 401) {
            errorMessage = 'Invalid API key. Please check your GROQ_API_KEY in the .env file.'
          }
        }
        throw new Error(errorMessage)
      }

      // Check if response has content
      if (!responseText) {
        throw new Error('Empty response from server')
      }

      // Parse JSON response
      let data
      try {
        data = JSON.parse(responseText)
      } catch (parseError) {
        console.error('JSON parse error:', parseError, 'Response text:', responseText.substring(0, 100))
        throw new Error('Failed to parse server response. The API route may not be configured correctly. Make sure you are using "vercel dev" for local development.')
      }

      if (!data.response) {
        // Include details if available
        const errorMsg = data.error || 'No response from AI'
        const details = data.details ? `\n\n${data.details}` : ''
        throw new Error(errorMsg + details)
      }

      // Add assistant response
      setMessages([...newMessages, { role: 'assistant', content: data.response }])
    } catch (error) {
      console.error('Chat error:', error)
      // Show error message with details if available
      const errorMessage = error.message || 'An unknown error occurred'
      
      // Handle rate limit errors
      if (errorMessage.includes('Rate limit') || errorMessage.includes('429')) {
        setError('Too many requests. Please wait a moment before trying again.')
        setMessages([...newMessages])
      } else {
        setMessages([
          ...newMessages,
          {
            role: 'assistant',
            content: `Sorry, I encountered an error: ${errorMessage}\n\nPlease try again or use the contact form if the issue persists.`
          }
        ])
      }
    } finally {
      setIsLoading(false)
      // Refocus input after sending
      setTimeout(() => inputRef.current?.focus(), 100)
    }
  }, [messages, isLoading])

  const handleKeyPress = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend(e)
    }
  }, [handleSend])

  const handleInputChange = useCallback((e) => {
    setInput(e.target.value)
    // Clear error when user starts typing
    if (error) {
      setError('')
    }
  }, [error])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-end pointer-events-none">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 dark:bg-black/70 transition-opacity pointer-events-auto"
        onClick={onClose}
      />

      {/* Chat Window */}
      <div className="relative w-full max-w-md h-[600px] bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-t-lg shadow-2xl flex flex-col pointer-events-auto mr-4 mb-4">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 rounded-t-lg">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
              </svg>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-white">AI Assistant</h3>
              <p className="text-xs text-gray-500 dark:text-gray-400">Ask me anything!</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-200 dark:hover:bg-gray-700 rounded-lg transition cursor-pointer"
            aria-label="Close chat"
          >
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {messages.map((message, idx) => (
            <div
              key={idx}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-[80%] rounded-lg px-4 py-2 ${
                  message.role === 'user'
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-gray-100'
                }`}
              >
                <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-4 py-2">
                <div className="flex gap-1">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              </div>
            </div>
          )}
          
          <div ref={messagesEndRef} />
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          {error && (
            <div className="mb-2 p-2 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <p className="text-xs text-red-600 dark:text-red-400">{error}</p>
            </div>
          )}
          <form onSubmit={handleSend} className="flex gap-2">
            <div className="flex-1 relative">
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleInputChange}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                disabled={isLoading}
                maxLength={MAX_MESSAGE_LENGTH}
                className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition disabled:opacity-50 disabled:cursor-not-allowed"
              />
              {input.length > MAX_MESSAGE_LENGTH * 0.8 && (
                <div className="absolute bottom-full mb-1 right-0 text-xs text-gray-500 dark:text-gray-400">
                  {input.length}/{MAX_MESSAGE_LENGTH}
                </div>
              )}
            </div>
            <button
              type="submit"
              disabled={!input.trim() || isLoading}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white rounded-lg transition cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </form>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
            Powered by Groq AI
          </p>
        </div>
      </div>
    </div>
  )
}

export default ChatBot
