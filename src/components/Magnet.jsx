import { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { prefersReducedMotion } from '../lib/motion'

// Wraps children in a mouse-following magnetic hover effect: the wrapped
// element eases toward the cursor while it's within `padding` px of the
// element's bounds, and eases back to rest on mouse leave.
export default function Magnet({ children, padding = 100, strength = 3, className = '' }) {
  const wrapperRef = useRef(null)
  const innerRef = useRef(null)

  useEffect(() => {
    if (prefersReducedMotion()) return

    const wrapper = wrapperRef.current
    const inner = innerRef.current
    if (!wrapper || !inner) return

    const setX = gsap.quickTo(inner, 'x', { duration: 0.4, ease: 'power3.out' })
    const setY = gsap.quickTo(inner, 'y', { duration: 0.4, ease: 'power3.out' })

    const handleMouseMove = (e) => {
      const rect = wrapper.getBoundingClientRect()
      const withinX = e.clientX >= rect.left - padding && e.clientX <= rect.right + padding
      const withinY = e.clientY >= rect.top - padding && e.clientY <= rect.bottom + padding

      if (!withinX || !withinY) return

      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2
      setX((e.clientX - centerX) / strength)
      setY((e.clientY - centerY) / strength)
    }

    const handleMouseLeave = () => {
      gsap.to(inner, { x: 0, y: 0, duration: 0.6, ease: 'power3.inOut' })
    }

    window.addEventListener('mousemove', handleMouseMove)
    wrapper.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      wrapper.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [padding, strength])

  return (
    <div ref={wrapperRef} className={className}>
      <div ref={innerRef} style={{ willChange: 'transform' }}>
        {children}
      </div>
    </div>
  )
}
