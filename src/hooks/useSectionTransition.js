import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../lib/motion'

// Whole-section fade+rise entrance transition, once, when it scrolls into
// view. Uses IntersectionObserver rather than GSAP ScrollTrigger to detect
// arrival: ScrollTrigger caches pixel-based start/end positions at the
// moment `.create()` runs, and these sections mount well after the page's
// own `load` event (behind the loader's "click to enter" gate) while their
// own async content — hero video, DomeGallery's ResizeObserver-driven
// sizing, images — is still settling. A stale computed position can put
// the trigger's start point already "in the past" relative to scroll 0,
// firing its one-shot reveal immediately at creation instead of when the
// section is actually scrolled into view. IntersectionObserver has no such
// cache to go stale — the browser evaluates it live.
export function useSectionTransition({ duration = 0.8, rootMargin = '0px 0px -45% 0px' } = {}) {
  const sectionRef = useRef(null)

  useLayoutEffect(() => {
    const section = sectionRef.current
    if (!section) return

    if (prefersReducedMotion()) {
      gsap.set(section, { opacity: 1 })
      return
    }

    let played = false

    const play = () => {
      // clearProps drops the inline transform once settled at y:0 (visually
      // identical to leaving it) — GSAP's `y` writes a `transform` style
      // that never gets removed on its own, and ANY element with a
      // non-`none` transform creates its own stacking context. That
      // promotes the section into the same paint bucket as the fixed
      // AnimatedBackground canvas, and since the section comes later in
      // the DOM, it then paints over the canvas — hiding the particles
      // behind every animated section instead of just the ones still
      // mid-transition.
      gsap.fromTo(
        section,
        { opacity: 0, y: 32 },
        { opacity: 1, y: 0, duration, ease: 'power2.out', onComplete: () => gsap.set(section, { clearProps: 'transform' }) }
      )
    }

    gsap.set(section, { opacity: 0, y: 32 })

    const observer = new IntersectionObserver(
      (entries) => {
        if (played || !entries[0].isIntersecting) return
        played = true
        observer.disconnect()
        play()
      },
      { rootMargin, threshold: 0 }
    )
    observer.observe(section)

    // A section's entrance transition can silently finish while hidden
    // behind the nav's cross-fade overlay (its intersection already
    // satisfied by the instant scroll jump). When that happens, replay it
    // on arrival instead of leaving the reveal invisible.
    const onNavArrive = (event) => {
      if (!section.id || event.detail?.id !== section.id) return
      played = true
      observer.disconnect()
      play()
    }
    window.addEventListener('section-transition:play', onNavArrive)

    return () => {
      observer.disconnect()
      window.removeEventListener('section-transition:play', onNavArrive)
    }
  }, [duration, rootMargin])

  return sectionRef
}
