import { useState, useEffect } from 'react'

export function useRecommendationCarousel(recommendations) {
  const [recommendationIndex, setRecommendationIndex] = useState(0)

  useEffect(() => {
    if (recommendations.length <= 1) return

    const interval = setInterval(() => {
      setRecommendationIndex((prev) =>
        prev < recommendations.length - 1 ? prev + 1 : 0
      )
    }, 5000)

    return () => clearInterval(interval)
  }, [recommendations.length])

  return [recommendationIndex, setRecommendationIndex]
}
