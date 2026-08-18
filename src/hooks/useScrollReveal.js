import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { prefersReducedMotion } from '../lib/motion'

gsap.registerPlugin(ScrollTrigger)

// Fades + rises a single element in once, when it scrolls into view.
export function useScrollReveal({ y = 24, duration = 0.5, start = 'top 85%' } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, y: 0 })
      return
    }

    gsap.set(el, { opacity: 0, y })

    const trigger = ScrollTrigger.create({
      trigger: el,
      start,
      once: true,
      onEnter: () => gsap.to(el, { opacity: 1, y: 0, duration, ease: 'power2.out' }),
    })

    return () => trigger.kill()
  }, [])

  return ref
}

// Fades + rises a list container's direct children in with a stagger, once, on scroll.
export function useStaggerReveal({ y = 20, duration = 0.5, stagger = 0.08, start = 'top 85%' } = {}) {
  const ref = useRef(null)

  useEffect(() => {
    const container = ref.current
    if (!container) return
    const items = Array.from(container.children)
    if (!items.length) return

    if (prefersReducedMotion()) {
      gsap.set(items, { opacity: 1, y: 0 })
      return
    }

    gsap.set(items, { opacity: 0, y })

    const trigger = ScrollTrigger.create({
      trigger: container,
      start,
      once: true,
      onEnter: () => gsap.to(items, { opacity: 1, y: 0, duration, stagger, ease: 'power2.out' }),
    })

    return () => trigger.kill()
  }, [])

  return ref
}
