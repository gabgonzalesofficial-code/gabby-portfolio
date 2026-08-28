import { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import TechIcon from '../TechIcon'
import ProjectStatStrip from '../ProjectStatStrip'
import ProjectNDAVisual from '../ProjectNDAVisual'
import ProjectRail from '../ProjectRail'
import CardSwap, { Card } from '../CardSwap'
import OptimizedImage from '../OptimizedImage'
import { useSectionTransition } from '../../hooks'
import { prefersReducedMotion } from '../../lib/motion'

function ProjectDetails({ project, index, onOpenProject }) {
  const number = String(index + 1).padStart(2, '0')
  const categories = project.categories || []
  return (
    <div>
      <div className="flex items-start justify-between gap-3 mb-2">
        <span style={{ fontFamily: "var(--font-display)", fontSize: 'clamp(2rem, 4vw, 3rem)', fontWeight: 700, letterSpacing: '-0.02em' }} className="text-tan/70 leading-none">
          {number}
        </span>
        <div className="flex flex-col items-end gap-1.5 mt-1">
          <span style={{ fontFamily: "var(--font-body)", fontSize: '12px', fontWeight: 500, letterSpacing: '0.04em' }} className="uppercase text-tan/60 border border-tan/15 px-2 py-0.5 rounded">
            {project.category}
          </span>
          {project.nda && (
            <span style={{ fontFamily: "var(--font-body)", fontSize: '11px', fontWeight: 500, letterSpacing: '0.04em' }} className="uppercase text-accent/70 border border-accent/20 px-2 py-0.5 rounded flex items-center gap-1">
              <span className="w-1 h-1 rounded-full bg-accent" />
              NDA
            </span>
          )}
        </div>
      </div>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: 'clamp(1.5rem, 2.5vw, 2.25rem)', fontWeight: 600, lineHeight: 1.1, letterSpacing: '-0.02em' }} className="text-cream mb-2">
        {project.name}
      </h3>
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-3">
          {categories.map((cat) => (
            <span key={cat} style={{ fontFamily: "var(--font-body)", fontSize: '11px', fontWeight: 500, letterSpacing: '0.04em' }} className="uppercase text-tan/40 border border-tan/10 px-1.5 py-0.5 rounded">
              {cat}
            </span>
          ))}
        </div>
      )}
      <p style={{ fontFamily: "var(--font-body)", fontSize: 'clamp(0.9rem, 1.1vw, 1rem)', fontWeight: 400, lineHeight: 1.6 }} className="text-cream/75 mb-3 max-w-lg">{project.tagline || project.summary}</p>
      {project.metrics?.length > 0 && <ProjectStatStrip metrics={project.metrics} large dark />}
      {project.stack?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mt-3">
          {project.stack.slice(0, 8).map((key) => (
            <span key={key} title={key} className="flex items-center justify-center w-8 h-8 rounded-md bg-cream/5 border border-cream/10">
              <TechIcon name={key} className="w-4 h-4" />
            </span>
          ))}
        </div>
      )}
      <div className="flex flex-wrap items-center gap-3 mt-4">
        {project.url && (
          <a href={project.url.startsWith('http') ? project.url : 'https://' + project.url} target="_blank" rel="noopener noreferrer"
            style={{ fontFamily: "var(--font-body)", fontSize: '13px', fontWeight: 600 }}
            className="px-5 py-2.5 rounded-full border-2 border-tan text-tan uppercase tracking-wider hover:bg-cream/10 transition-all duration-300 cursor-pointer">
            Live Project
          </a>
        )}
        <button onClick={() => onOpenProject?.(project)}
          style={{ fontFamily: "var(--font-body)", fontSize: '13px', fontWeight: 500 }}
          className="px-5 py-2.5 rounded-full border border-cream/20 text-cream/70 uppercase tracking-wider hover:border-cream/40 hover:text-cream transition-all duration-300 cursor-pointer">
          Case Study
        </button>
      </div>
    </div>
  )
}

export default function Projects({ projects, onOpenProject }) {
  const [displayedIndex, setDisplayedIndex] = useState(0)
  const detailsRef = useRef(null)
  const sectionRef = useSectionTransition()
  const carouselJumpRef = useRef(null)

  const handleSwap = useCallback((newIndex) => { setDisplayedIndex(newIndex) }, [])

  const handleRailSelect = useCallback((index) => {
    if (index === displayedIndex) return
    // Set index immediately — jumpTo's onSwap already handles the carousel,
    // and the useEffect on displayedIndex handles the fade-in animation.
    // Using gsap onComplete here causes a race condition when clicking the
    // card before the 150ms timer fires, overwriting the new displayedIndex.
    setDisplayedIndex(index)
    if (carouselJumpRef.current) carouselJumpRef.current(index)
  }, [displayedIndex])

  useEffect(() => {
    const el = detailsRef.current
    if (!el) return
    if (prefersReducedMotion()) { gsap.set(el, { opacity: 1, y: 0 }); return }
    gsap.fromTo(el, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.25, ease: 'power2.out' })
  }, [displayedIndex])

  return (
    <section id="projects" ref={sectionRef} className="bg-black text-cream py-12 sm:py-16 md:py-20 lg:min-h-screen lg:flex lg:flex-col lg:justify-center">
      <div className="px-6 sm:px-12 md:px-16 lg:px-24 pr-16 lg:pr-24 mb-8 sm:mb-10">
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: 'clamp(2.5rem, 4vw, 4rem)', fontWeight: 600, lineHeight: 1, letterSpacing: '-0.025em' }} className="gradient-text leading-none">
          Projects
        </h2>
      </div>

      <div className="px-6 sm:px-12 md:px-16 lg:px-24 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 items-start">
        <div className="order-2 lg:order-1">
          <div ref={detailsRef}>
            <ProjectDetails project={projects[displayedIndex]} index={displayedIndex} onOpenProject={onOpenProject} />
          </div>
        </div>
        <div className="order-1 lg:order-2">
          <div className="relative mx-auto" style={{ height: 380, maxWidth: 440 }}>
            <CardSwap
              containerClassName="card-swap-centered"
              width={440} height={340}
              cardDistance={40} verticalDistance={35}
              manual onSwap={handleSwap} jumpToRef={carouselJumpRef}
            >
              {projects.map((project) => (
                <Card key={project.id} className="!bg-black !border-tan/25 flex flex-col overflow-hidden cursor-pointer">
                  <div className="flex-1 min-h-0">
                    {project.nda ? (
                      <ProjectNDAVisual type={project.name.includes('Social') ? 'ai' : 'dashboard'} />
                    ) : project.image ? (
                      <OptimizedImage src={project.image} alt={project.name + ' screenshot'} className="w-full h-full object-cover object-top" loading="lazy" draggable={false} />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-accent/5">
                        <TechIcon name={project.stack?.[0] || 'html'} className="w-10 h-10 opacity-30" />
                      </div>
                    )}
                  </div>
                  <div className="p-3 flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <h4 style={{ fontFamily: "var(--font-display)", fontWeight: 600 }} className="text-cream text-xs truncate uppercase">{project.name}</h4>
                      <span style={{ fontFamily: "var(--font-body)", fontSize: '10px' }} className="text-tan/40">{project.category}</span>
                    </div>
                    <span style={{ fontFamily: "var(--font-display)", fontWeight: 700 }} className="text-[10px] text-tan/60 flex-shrink-0">{String(projects.indexOf(project) + 1).padStart(2, '0')}</span>
                  </div>
                </Card>
              ))}
            </CardSwap>
          </div>
          <p style={{ fontFamily: "var(--font-body)", fontSize: '11px' }} className="text-center text-tan/60 mt-1">Click the card to browse projects</p>
        </div>
      </div>

      <div className="px-6 sm:px-12 md:px-16 lg:px-24 pr-16 lg:pr-24 mt-6">
        <ProjectRail projects={projects} activeIndex={displayedIndex} onSelect={handleRailSelect} />
      </div>
    </section>
  )
}
