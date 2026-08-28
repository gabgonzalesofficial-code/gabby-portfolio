import { StrictMode, useEffect, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { onFirstInteraction } from './lib/motion'
import './index.css'
import App from './App.jsx'

function DeferredAnalytics() {
  const [Analytics, setAnalytics] = useState(null)

  useEffect(() => onFirstInteraction(() => {
    import('@vercel/analytics/react').then(({ Analytics: Component }) => {
      setAnalytics(() => Component)
    })
  }, 8000), [])

  if (!Analytics) return null
  return <Analytics />
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
    <DeferredAnalytics />
  </StrictMode>,
)
