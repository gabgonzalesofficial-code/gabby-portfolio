import { useEffect, useRef } from 'react'
import TechIcon from './TechIcon'

// Broader groupings than techStack's own categories, purely for how this
// section is laid out — one scrolling row per group.
const ROW_GROUPS = [
  { label: 'Web Development', keys: ['frontend', 'backend', 'database', 'design', 'gameDev'] },
  { label: 'Dev Tools & Automation', keys: ['tools', 'automation'] },
  { label: 'CRM & Cloud Platforms', keys: ['crmCms', 'productivity', 'cloud'] },
  { label: 'AI Tools', keys: ['aiTools'] }
]

const AUTO_SCROLL_SPEED = 36 // px/sec

// A native horizontally-scrollable row (free touch swipe + trackpad/scrollbar
// scroll) that also auto-scrolls when idle and supports mouse click-drag.
// Content is duplicated so wrapping scrollLeft around gives an infinite loop
// regardless of whether the scroll came from auto-play, a swipe, or a drag.
function LogoRow({ items, direction }) {
  const scrollerRef = useRef(null)
  const pausedRef = useRef(false)
  const draggingRef = useRef(false)
  const loop = [...items, ...items]

  useEffect(() => {
    const el = scrollerRef.current
    if (!el) return

    const singleWidth = () => el.scrollWidth / 2
    el.scrollLeft = direction === 'right' ? singleWidth() : 0

    const wrap = () => {
      const w = singleWidth()
      if (!w) return
      if (el.scrollLeft >= w) el.scrollLeft -= w
      else if (el.scrollLeft <= 0) el.scrollLeft += w
    }
    el.addEventListener('scroll', wrap, { passive: true })

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let rafId
    let lastTime = performance.now()
    const step = (time) => {
      const dt = (time - lastTime) / 1000
      lastTime = time
      if (!pausedRef.current && !draggingRef.current) {
        el.scrollLeft += (direction === 'right' ? -1 : 1) * AUTO_SCROLL_SPEED * dt
      }
      rafId = requestAnimationFrame(step)
    }
    if (!prefersReducedMotion) rafId = requestAnimationFrame(step)

    // Click-and-drag scrolling for mouse users — touch already gets native
    // swipe scrolling for free via overflow-x + touch-action.
    let startX = 0
    let startScroll = 0
    const onPointerDown = (e) => {
      if (e.pointerType !== 'mouse') return
      draggingRef.current = true
      startX = e.clientX
      startScroll = el.scrollLeft
      el.setPointerCapture(e.pointerId)
      el.style.cursor = 'grabbing'
    }
    const onPointerMove = (e) => {
      if (!draggingRef.current || e.pointerType !== 'mouse') return
      el.scrollLeft = startScroll - (e.clientX - startX)
    }
    const endDrag = (e) => {
      if (e.pointerType !== 'mouse') return
      draggingRef.current = false
      el.style.cursor = 'grab'
    }
    el.addEventListener('pointerdown', onPointerDown)
    el.addEventListener('pointermove', onPointerMove)
    el.addEventListener('pointerup', endDrag)
    el.addEventListener('pointercancel', endDrag)
    el.addEventListener('pointerleave', endDrag)

    let resumeTimer
    const onTouchStart = () => {
      pausedRef.current = true
      clearTimeout(resumeTimer)
    }
    const onTouchEnd = () => {
      resumeTimer = setTimeout(() => { pausedRef.current = false }, 500)
    }
    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend', onTouchEnd, { passive: true })

    return () => {
      cancelAnimationFrame(rafId)
      clearTimeout(resumeTimer)
      el.removeEventListener('scroll', wrap)
      el.removeEventListener('pointerdown', onPointerDown)
      el.removeEventListener('pointermove', onPointerMove)
      el.removeEventListener('pointerup', endDrag)
      el.removeEventListener('pointercancel', endDrag)
      el.removeEventListener('pointerleave', endDrag)
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend', onTouchEnd)
    }
  }, [direction])

  return (
    <div
      ref={scrollerRef}
      className="relative overflow-x-auto no-scrollbar cursor-grab"
      style={{
        WebkitMaskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
        maskImage: 'linear-gradient(to right, transparent, black 6%, black 94%, transparent)',
        touchAction: 'pan-x'
      }}
      onMouseEnter={() => { pausedRef.current = true }}
      onMouseLeave={() => { pausedRef.current = false }}
    >
      <div className="flex w-max gap-3">
        {loop.map((tech, i) => (
          <div
            key={`${tech.icon}-${i}`}
            title={tech.name}
            className="flex items-center gap-2 shrink-0 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-md text-sm transition cursor-default"
          >
            <TechIcon name={tech.icon} className="w-4 h-4" />
            <span>{tech.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function TechMarquee({ techStack }) {
  const rows = ROW_GROUPS
    .map((group) => ({
      label: group.label,
      items: group.keys.flatMap((key) => techStack[key] || [])
    }))
    .filter((row) => row.items.length > 0)

  return (
    <div className="space-y-4">
      {rows.map((row, i) => (
        <div key={row.label}>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5">
            {row.label}
          </p>
          <LogoRow items={row.items} direction={i % 2 === 0 ? 'left' : 'right'} />
        </div>
      ))}
    </div>
  )
}
