import { prefersReducedMotion } from './motion'

// Scrolls to `target` over a guaranteed `duration` ms, regardless of
// distance — unlike native scrollIntoView({ behavior: 'smooth' }), which
// can finish almost instantly for short distances.
export function smoothScrollTo(target, duration = 700) {
  if (!target) return

  if (prefersReducedMotion()) {
    target.scrollIntoView({ block: 'start' })
    return
  }

  const startY = window.scrollY
  const targetY = target.getBoundingClientRect().top + window.scrollY
  const distance = targetY - startY
  const startTime = performance.now()

  function step(now) {
    const elapsed = now - startTime
    const t = Math.min(elapsed / duration, 1)
    const eased = 1 - Math.pow(1 - t, 3)
    window.scrollTo(0, startY + distance * eased)
    if (t < 1) requestAnimationFrame(step)
  }

  requestAnimationFrame(step)
}

// Fades a full-screen overlay to opaque, jumps the scroll position while
// hidden behind it, then fades the overlay back out — a cross-fade between
// sections instead of a visible scroll.
export function crossFadeScrollTo(target, overlayEl, fadeMs = 250) {
  if (!target) return

  if (!overlayEl || prefersReducedMotion()) {
    target.scrollIntoView({ block: 'start' })
    return
  }

  overlayEl.style.pointerEvents = 'auto'
  overlayEl.style.opacity = '1'

  window.setTimeout(() => {
    window.scrollTo(0, target.getBoundingClientRect().top + window.scrollY)
    window.setTimeout(() => {
      overlayEl.style.opacity = '0'
      // The section we just jumped to may already have "entered" the
      // viewport (per ScrollTrigger) while it was hidden behind the
      // blacked-out overlay, which would silently consume its one-shot
      // entrance transition before anyone could see it. Tell it to play
      // (or replay) its reveal now, timed to the overlay fading away, so
      // arriving via nav always shows a transition.
      if (target.id) {
        window.dispatchEvent(new CustomEvent('section-transition:play', { detail: { id: target.id } }))
      }
      window.setTimeout(() => {
        overlayEl.style.pointerEvents = 'none'
      }, fadeMs)
    }, 30)
  }, fadeMs)
}
