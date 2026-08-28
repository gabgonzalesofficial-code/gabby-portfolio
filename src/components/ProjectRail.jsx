import { useRef, useEffect, useState, useCallback } from 'react'
import TechIcon from './TechIcon'
import ProjectNDAVisual from './ProjectNDAVisual'
import OptimizedImage from './OptimizedImage'

/**
 * Horizontally-scrollable project index rail — shows every project as a
 * compact thumbnail so visitors immediately see the full range of work.
 * Clicking a rail item jumps the parent carousel to that project.
 * Scroll arrows appear when content overflows the viewport.
 */
export default function ProjectRail({ projects, activeIndex, onSelect }) {
  const railRef = useRef(null)
  const itemRefs = useRef([])
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const checkOverflow = useCallback(() => {
    const rail = railRef.current
    if (!rail) return
    setCanScrollLeft(rail.scrollLeft > 4)
    setCanScrollRight(rail.scrollLeft + rail.clientWidth < rail.scrollWidth - 4)
  }, [])

  useEffect(() => {
    const rail = railRef.current
    if (!rail) return
    checkOverflow()
    rail.addEventListener('scroll', checkOverflow, { passive: true })
    const ro = new ResizeObserver(checkOverflow)
    ro.observe(rail)
    return () => { rail.removeEventListener('scroll', checkOverflow); ro.disconnect() }
  }, [checkOverflow])

  // Auto-scroll the active item into view within the rail
  useEffect(() => {
    const el = itemRefs.current[activeIndex]
    if (!el || !railRef.current) return
    const rail = railRef.current
    const left = el.offsetLeft - rail.offsetLeft - (rail.clientWidth - el.clientWidth) / 2
    rail.scrollTo({ left: Math.max(0, left), behavior: 'smooth' })
  }, [activeIndex])

  const scrollBy = (dir) => {
    const rail = railRef.current
    if (!rail) return
    rail.scrollBy({ left: dir * 200, behavior: 'smooth' })
  }

  return (
    <div className="mt-10 sm:mt-14">
      {/* Section label */}
      <div className="flex items-center gap-3 mb-4 px-1">
        <span className="text-[11px] uppercase tracking-widest text-tan/40 font-medium">
          All Projects
        </span>
        <div className="flex-1 h-px bg-cream/10" />
        <span className="text-[11px] text-tan/30 tabular-nums">
          {activeIndex + 1}/{projects.length}
        </span>
      </div>

      {/* Scrollable rail with arrows */}
      <div className="relative group/rail">
        {/* Left arrow */}
        {canScrollLeft && (
          <button
            onClick={() => scrollBy(-1)}
            className="absolute left-0 top-0 bottom-3 z-10 w-8 flex items-center justify-center
              bg-gradient-to-r from-black/90 to-transparent opacity-0 group-hover/rail:opacity-100
              transition-opacity duration-300 cursor-pointer"
            aria-label="Scroll projects left"
          >
            <svg className="w-4 h-4 text-tan/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {/* Right arrow */}
        {canScrollRight && (
          <button
            onClick={() => scrollBy(1)}
            className="absolute right-0 top-0 bottom-3 z-10 w-8 flex items-center justify-center
              bg-gradient-to-l from-black/90 to-transparent opacity-0 group-hover/rail:opacity-100
              transition-opacity duration-300 cursor-pointer"
            aria-label="Scroll projects right"
          >
            <svg className="w-4 h-4 text-tan/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        <div
          ref={railRef}
          className="flex gap-3 overflow-x-auto pb-3 scroll-smooth snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none', WebkitOverflowScrolling: 'touch' }}
        >
        <style>{`.project-rail::-webkit-scrollbar { display: none; }`}</style>
        {projects.map((project, i) => {
          const isActive = i === activeIndex
          const num = String(i + 1).padStart(2, '0')

          return (
            <button
              key={project.id}
              ref={(el) => { itemRefs.current[i] = el }}
              onClick={() => onSelect(i)}
              className={`
                group flex-shrink-0 snap-start cursor-pointer
                w-[130px] sm:w-[145px] md:w-[155px]
                rounded-lg overflow-hidden border transition-all duration-300 ease-out
                ${isActive
                  ? 'border-tan/60 shadow-[0_0_12px_rgba(232,201,153,0.15)] scale-[1.02]'
                  : 'border-cream/10 hover:border-cream/25 hover:scale-[1.01]'
                }
              `}
              aria-label={`View ${project.name}`}
              aria-current={isActive ? 'true' : undefined}
            >
              {/* Thumbnail */}
              <div className="w-full aspect-[16/10] relative overflow-hidden bg-black">
                {project.nda ? (
                  <ProjectNDAVisual type={project.name.includes('Social') ? 'ai' : 'dashboard'} />
                ) : project.image ? (
                  <OptimizedImage
                    src={project.image}
                    alt={`${project.name} screenshot`}
                    className={`w-full h-full object-cover object-top transition-all duration-500 ${
                      isActive ? 'brightness-110 saturate-110' : 'brightness-75 saturate-90 group-hover:brightness-90'
                    }`}
                    loading="lazy"
                    draggable={false}
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-cream/5 to-cream/[0.02]">
                    <TechIcon name={project.stack?.[0] || 'html'} className="w-6 h-6 opacity-30" />
                  </div>
                )}

                {/* Active indicator bar */}
                <div
                  className={`absolute bottom-0 left-0 right-0 h-[2px] transition-all duration-300 ${
                    isActive ? 'bg-accent' : 'bg-transparent group-hover:bg-tan/30'
                  }`}
                />
              </div>

              {/* Label */}
              <div className="px-2.5 py-2">
                <div className="flex items-center gap-1.5">
                  <span className={`text-[9px] font-black tracking-wider transition-colors duration-300 ${
                    isActive ? 'text-accent' : 'text-tan/30 group-hover:text-tan/50'
                  }`}>
                    {num}
                  </span>
                  <span className={`text-[10px] sm:text-[11px] uppercase font-medium leading-tight truncate transition-colors duration-300 ${
                    isActive ? 'text-cream' : 'text-cream/60 group-hover:text-cream/80'
                  }`}>
                    {project.name}
                  </span>
                </div>
                <span className="text-[9px] text-tan/40 leading-tight block mt-0.5 truncate">
                  {project.category}
                </span>
              </div>
            </button>
          )
        })}
        </div>
      </div>
    </div>
  )
}
