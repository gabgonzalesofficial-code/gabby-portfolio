import { useState, useEffect } from 'react'

/**
 * Loader sequence: initializing -> requesting -> granted -> exiting -> done
 */
export function useLoaderSequence() {
  const [loaderPhase, setLoaderPhase] = useState('done')

  useEffect(() => {
    if (loaderPhase === 'initializing') {
      const t = setTimeout(() => setLoaderPhase('requesting'), 1200)
      return () => clearTimeout(t)
    }
    if (loaderPhase === 'requesting') {
      const t = setTimeout(() => setLoaderPhase('granted'), 1200)
      return () => clearTimeout(t)
    }
    if (loaderPhase === 'granted') {
      const t = setTimeout(() => setLoaderPhase('exiting'), 1200)
      return () => clearTimeout(t)
    }
    if (loaderPhase === 'exiting') {
      const t = setTimeout(() => setLoaderPhase('done'), 800)
      return () => clearTimeout(t)
    }
  }, [loaderPhase])

  return [loaderPhase, setLoaderPhase]
}
