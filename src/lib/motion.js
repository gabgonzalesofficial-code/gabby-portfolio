export const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

/** Load a third-party script after first input, or after `timeoutMs` if none. */
export function onFirstInteraction(callback, timeoutMs = 8000) {
  if (typeof window === 'undefined') return () => {}
  let done = false
  const run = () => {
    if (done) return
    done = true
    cleanup()
    callback()
  }
  const events = ['scroll', 'click', 'keydown', 'touchstart', 'pointerdown']
  const cleanup = () => {
    events.forEach((e) => window.removeEventListener(e, run))
    clearTimeout(timer)
  }
  events.forEach((e) => window.addEventListener(e, run, { once: true, passive: true }))
  const timer = setTimeout(run, timeoutMs)
  return cleanup
}
