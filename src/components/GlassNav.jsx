import { useState, useEffect, useRef } from 'react'

export default function GlassNav({ items, activeIndex, onNavigate }) {
  const [hovered, setHovered] = useState(null)
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 })
  const [scrollY, setScrollY] = useState(0)
  const navRef = useRef(null)

  useEffect(() => {
    const onMouse = (e) => {
      setMousePos({ x: e.clientX / window.innerWidth, y: e.clientY / window.innerHeight })
    }
    const onScroll = () => setScrollY(window.scrollY)
    window.addEventListener('mousemove', onMouse, { passive: true })
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('mousemove', onMouse)
      window.removeEventListener('scroll', onScroll)
    }
  }, [])

  const scrolled = scrollY > 50
  // Subtle parallax offset based on mouse
  const px = (mousePos.x - 0.5) * 4
  const py = (mousePos.y - 0.5) * 2

  return (
    <div
      ref={navRef}
      className="hidden lg:flex fixed top-4 left-1/2 -translate-x-1/2 z-[9999] items-center gap-1 px-2 py-1.5 rounded-full"
      style={{
        // Liquid glass base
        background: scrolled
          ? 'linear-gradient(135deg, rgba(0,0,0,0.55) 0%, rgba(0,0,0,0.35) 40%, rgba(0,0,0,0.5) 100%)'
          : 'linear-gradient(135deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0.25) 100%)',
        backdropFilter: 'blur(24px) saturate(1.6) brightness(1.1)',
        WebkitBackdropFilter: 'blur(24px) saturate(1.6) brightness(1.1)',
        border: '1px solid rgba(232,201,153,0.1)',
        boxShadow: scrolled
          ? '0 8px 32px rgba(0,0,0,0.6), 0 2px 8px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -1px 0 rgba(0,0,0,0.2)'
          : '0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.15)',
        transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
      }}
      aria-label="Main navigation"
    >
      {/* Glass refraction highlight — follows mouse */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none overflow-hidden"
        style={{ opacity: 0.4 }}
      >
        <div
          className="absolute rounded-full"
          style={{
            width: 120,
            height: 120,
            left: `${mousePos.x * 100}%`,
            top: '-40px',
            transform: `translate(-50%, 0) translateX(${px}px) translateY(${py}px)`,
            background: 'radial-gradient(circle, rgba(232,201,153,0.12) 0%, transparent 70%)',
            transition: 'left 0.3s ease-out, top 0.3s ease-out',
            filter: 'blur(8px)',
          }}
        />
      </div>

      {/* Inner glass edge — chromatic aberration hint */}
      <div
        className="absolute inset-0 rounded-full pointer-events-none"
        style={{
          background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%, rgba(142,22,22,0.03) 100%)',
          border: '1px solid rgba(255,255,255,0.03)',
          borderRadius: 'inherit',
        }}
      />

      {items.map((item, i) => {
        const active = activeIndex === i
        const isHovered = hovered === i
        return (
          <button
            key={item.label}
            onClick={() => onNavigate(i)}
            onMouseEnter={() => setHovered(i)}
            onMouseLeave={() => setHovered(null)}
            className="relative px-4 py-1.5 rounded-full transition-all duration-300 cursor-pointer"
            style={{
              fontFamily: "var(--font-display)",
              fontSize: '11px',
              fontWeight: active ? 600 : 400,
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              color: active ? '#F8EEDF' : isHovered ? '#E8C999' : 'rgba(161,161,170,0.7)',
            }}
          >
            {/* Active pill — glass inner glow */}
            {active && (
              <span
                className="absolute inset-0 rounded-full"
                style={{
                  background: 'rgba(142,22,22,1)',
                  border: 'none',
                  boxShadow: '0 2px 12px rgba(142,22,22,0.5)',
                }}
              />
            )}
            {/* Hover glow */}
            {isHovered && !active && (
              <span
                className="absolute inset-0 rounded-full transition-opacity duration-200"
                style={{
                  background: 'rgba(232,201,153,0.06)',
                  border: '1px solid rgba(232,201,153,0.1)',
                }}
              />
            )}
            <span className="relative z-10">{item.label}</span>
          </button>
        )
      })}
    </div>
  )
}
