import { useEffect, useRef, useState } from 'react'
import { FaEnvelope, FaPhone } from 'react-icons/fa'
import { crossFadeScrollTo } from '../../lib/smoothScroll'

import GlassNav from '../GlassNav'

const LINKS = [
  { label: 'Home', href: '#hero' },
  { label: 'Tech', href: '#tech-stack' },
  { label: 'Work', href: '#projects' },
  { label: 'Experience', href: '#experience' },
  { label: 'Gallery', href: '#gallery' },
  { label: 'Contact', href: '#contact' },
]

const FADE_MS = 250

export default function Navbar({ profileInfo }) {
  const [activeIndex, setActiveIndex] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const isNavigatingRef = useRef(false)
  const navTimeoutRef = useRef(null)
  const overlayRef = useRef(null)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

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

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (e) => { if (e.key === 'Escape') setMenuOpen(false) }
    window.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => { window.removeEventListener('keydown', onKey); document.body.style.overflow = '' }
  }, [menuOpen])

  useEffect(() => () => window.clearTimeout(navTimeoutRef.current), [])

  const handleChange = (index) => {
    setActiveIndex(index)
    isNavigatingRef.current = true
    crossFadeScrollTo(document.querySelector(LINKS[index].href), overlayRef.current, FADE_MS)
    window.clearTimeout(navTimeoutRef.current)
    navTimeoutRef.current = window.setTimeout(() => { isNavigatingRef.current = false }, FADE_MS * 2 + 400)
  }

  const handleMenuNavigate = (index) => {
    setMenuOpen(false)
    window.setTimeout(() => handleChange(index), 30)
  }

  const contact = profileInfo?.contact

  return (
    <>
      <div ref={overlayRef} className="fixed inset-0 z-[100] bg-black opacity-0 pointer-events-none" style={{ transition: 'opacity ' + FADE_MS + 'ms ease' }} aria-hidden />

      {/* 3D Glass Nav — desktop */}
      <GlassNav
          items={LINKS}
          activeIndex={activeIndex}
          onNavigate={handleChange}
        />

      {/* Mobile hamburger */}
      <button
        type="button"
        onClick={() => setMenuOpen((v) => !v)}
        aria-label={menuOpen ? 'Close menu' : 'Open menu'}
        aria-expanded={menuOpen}
        aria-controls="mobile-menu"
        className="lg:hidden fixed top-4 right-4 z-[10001] w-11 h-11 rounded-full bg-black/70 backdrop-blur border border-tan/30 flex items-center justify-center cursor-pointer transition-colors duration-300 hover:border-cream/50"
      >
        <span className="relative block w-5 h-4" aria-hidden>
          <span className={'absolute left-0 top-0 h-0.5 w-full rounded bg-tan transition-all duration-300 ease-out' + (menuOpen ? ' top-1/2 -translate-y-1/2 rotate-45 bg-cream' : '')} />
          <span className={'absolute left-0 top-1/2 -translate-y-1/2 h-0.5 w-full rounded bg-tan transition-all duration-300 ease-out' + (menuOpen ? ' opacity-0' : '')} />
          <span className={'absolute left-0 bottom-0 h-0.5 w-full rounded bg-tan transition-all duration-300 ease-out' + (menuOpen ? ' bottom-1/2 translate-y-1/2 -rotate-45 bg-cream' : '')} />
        </span>
      </button>

      {/* Mobile menu */}
      <div
        id="mobile-menu"
        className={'lg:hidden fixed inset-0 z-[10000] bg-black/95 backdrop-blur-md transition-opacity duration-300 ease-out' + (menuOpen ? ' opacity-100' : ' opacity-0 pointer-events-none')}
        aria-hidden={!menuOpen}
      >
        <nav className="h-full flex flex-col justify-center px-8 sm:px-14" aria-label="Mobile navigation">
          <div className="space-y-1">
            {LINKS.map((link, i) => {
              const active = i === activeIndex
              return (
                <button
                  key={link.href}
                  onClick={() => handleMenuNavigate(i)}
                  className={'group w-full flex items-baseline gap-4 py-2 text-left transition-all duration-300 ease-out cursor-pointer' + (active ? ' text-cream' : ' text-tan/40 hover:text-tan/80')}
                >
                  <span className={'text-xs font-black tracking-widest flex-shrink-0 transition-colors duration-300' + (active ? ' text-accent' : ' text-tan/30')}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <span className={'uppercase tracking-wide transition-all duration-300 ease-out' + (active ? ' text-2xl sm:text-3xl font-semibold' : ' text-xl sm:text-2xl font-medium')}>
                    {link.label}
                  </span>
                </button>
              )
            })}
          </div>
          {contact && (
            <div className="mt-10 pt-6 border-t border-cream/10 space-y-3 text-sm text-tan/60">
              <a href={'mailto:' + contact.email} className="flex items-center gap-2.5 hover:text-cream transition-colors duration-300 cursor-pointer">
                <FaEnvelope className="w-4 h-4 text-tan/40 flex-shrink-0" aria-hidden />
                <span className="break-all">{contact.email}</span>
              </a>
              <a href={'tel:' + contact.mobile.replace(/\s/g, '')} className="flex items-center gap-2.5 hover:text-cream transition-colors duration-300 cursor-pointer">
                <FaPhone className="w-4 h-4 text-tan/40 flex-shrink-0" aria-hidden />
                {contact.mobile}
              </a>
            </div>
          )}
        </nav>
      </div>
    </>
  )
}
