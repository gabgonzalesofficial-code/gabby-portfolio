import { useState, useEffect } from 'react'

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(false)

  // Initialize from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('darkMode')
    const shouldBeDark = saved === 'true'
    setIsDarkMode(shouldBeDark)
    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  // Sync to DOM and localStorage when state changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', isDarkMode.toString())
  }, [isDarkMode])

  const toggleDarkMode = () => setIsDarkMode((prev) => !prev)

  return [isDarkMode, toggleDarkMode]
}
