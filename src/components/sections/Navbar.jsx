import { useEffect, useRef, useState } from 'react'
import OptionWheel from '../OptionWheel'
import { crossFadeScrollTo } from '../../lib/smoothScroll'

const LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'Tech', href: '#tech-stack' },
  { label: 'Work', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
]

const FADE_MS = 250

export default function Navbar() {
  const [activeIndex, setActiveIndex] = useState(0)
  const isNavigatingRef = useRef(false)
  const navTimeoutRef = useRef(null)
  const overlayRef = useRef(null)

  // Keep the wheel in sync with whichever section is actually on screen
  // during ordinary page scrolling.
  useEffect(() => {
    const sections = LINKS.map((link) => document.querySelector(link.href)).filter(Boolean)
    if (!sections.length) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (isNavigatingRef.current) return
        const visible = entries.filter((entry) => entry.isIntersecting)
        if (!visible.length) return
        const closest = visible.reduce((best, entry) =>
          Math.abs(entry.boundingClientRect.top) < Math.abs(best.boundingClientRect.top) ? entry : best
        )
        const index = sections.indexOf(closest.target)
        if (index !== -1) setActiveIndex(index)
      },
      { rootMargin: '-40% 0px -40% 0px', threshold: 0 }
    )

    sections.forEach((section) => observer.observe(section))
    return () => observer.disconnect()
  }, [])

  useEffect(() => () => window.clearTimeout(navTimeoutRef.current), [])

  const handleChange = (index) => {
    // Ignore scroll-position updates while we're driving the scroll
    // ourselves, so the wheel doesn't jump through intermediate sections.
    isNavigatingRef.current = true
    crossFadeScrollTo(document.querySelector(LINKS[index].href), overlayRef.current, FADE_MS)
    window.clearTimeout(navTimeoutRef.current)
    navTimeoutRef.current = window.setTimeout(() => {
      isNavigatingRef.current = false
    }, FADE_MS * 2 + 400)
  }

  return (
    <>
      <div
        ref={overlayRef}
        className="fixed inset-0 z-[100] bg-black opacity-0 pointer-events-none"
        style={{ transition: `opacity ${FADE_MS}ms ease` }}
        aria-hidden
      />

      <div className="hidden lg:block fixed inset-y-0 right-0 z-50 w-64 pointer-events-none">
        <OptionWheel
          items={LINKS.map((link) => link.label)}
          defaultSelected={0}
          activeIndex={activeIndex}
          onChange={handleChange}
          textColor="rgba(232, 201, 153, 0.5)"
          activeColor="#F8EEDF"
          side="right"
          fontSize={1.6}
          spacing={2.6}
          curve={1}
          tilt={10}
          blur={1.5}
          fade={0.3}
          inset={32}
          loop={false}
          draggable
        />
      </div>
    </>
  )
}
