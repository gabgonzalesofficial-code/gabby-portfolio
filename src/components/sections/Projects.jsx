import { useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { FaLock } from 'react-icons/fa'
import TechIcon from '../TechIcon'
import ProjectStatStrip from '../ProjectStatStrip'
import CardSwap, { Card } from '../CardSwap'
import { useSectionTransition } from '../../hooks'
import { prefersReducedMotion } from '../../lib/motion'

function ProjectDetails({ project, index }) {
  const number = String(index + 1).padStart(2, '0')

  return (
    <div>
      <div className="flex items-start justify-between gap-3 mb-3">
        <span className="font-black text-tan/70 leading-none" style={{ fontSize: 'clamp(2.5rem, 5vw, 3.5rem)' }}>
          {number}
        </span>
        <span className="text-xs uppercase tracking-widest text-tan/70 mt-2">
          {project.private ? 'Private' : 'Client'}
        </span>
      </div>

      <h3 className="font-medium uppercase text-cream mb-3" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.25rem)' }}>
        {project.name}
      </h3>
      <p className="text-cream/80 mb-5 max-w-lg">{project.tagline || project.description}</p>

      <ProjectStatStrip metrics={project.metrics} large dark />

      {project.stack?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-4">
          {project.stack.slice(0, 8).map((key) => (
            <span
              key={key}
              title={key}
              className="flex items-center justify-center w-9 h-9 rounded-md bg-cream/5 border border-cream/10"
            >
              <TechIcon name={key} className="w-4 h-4" />
            </span>
          ))}
        </div>
      )}

      {project.url && (
        <a
          href={project.url.startsWith('http') ? project.url : `https://${project.url}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-block mt-5 px-6 py-2.5 rounded-full border-2 border-tan text-tan uppercase tracking-widest text-xs hover:bg-cream/10 transition-all duration-300 ease-out cursor-pointer"
        >
          Live Project
        </a>
      )}
    </div>
  )
}

export default function Projects({ projects, onOpenAll }) {
  const featured = projects.slice(0, 3)
  const [displayedIndex, setDisplayedIndex] = useState(0)
  const detailsRef = useRef(null)
  const sectionRef = useSectionTransition()

  // Crossfades the details panel to match whichever card is now front: fade
  // out the old copy, swap the index once it's hidden, then fade the new
  // copy in — rather than the text just snapping to the new project.
  const handleSwap = (newIndex) => {
    const el = detailsRef.current
    if (!el || prefersReducedMotion()) {
      setDisplayedIndex(newIndex)
      return
    }
    gsap.to(el, {
      opacity: 0,
      y: -10,
      duration: 0.2,
      ease: 'power2.in',
      onComplete: () => setDisplayedIndex(newIndex),
    })
  }

  useEffect(() => {
    const el = detailsRef.current
    if (!el) return
    if (prefersReducedMotion()) {
      gsap.set(el, { opacity: 1, y: 0 })
      return
    }
    gsap.fromTo(el, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.35, ease: 'power2.out' })
  }, [displayedIndex])

  return (
    <section id="projects" ref={sectionRef} className="min-h-screen bg-black text-cream pt-16 sm:pt-20 md:pt-24 pb-16">
      <div className="px-6 sm:px-12 md:px-16 lg:px-24 pr-16 lg:pr-24 flex items-end justify-between gap-4 mb-12 sm:mb-16">
        <h2 className="gradient-text font-black uppercase leading-none tracking-tight" style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}>
          Project
        </h2>
        <button
          onClick={onOpenAll}
          className="text-sm uppercase tracking-widest text-tan border-b border-cream/30 hover:border-cream pb-1 transition-all duration-300 ease-out cursor-pointer mb-2 flex-shrink-0"
        >
          View All
        </button>
      </div>

      <div className="px-6 sm:px-12 md:px-16 lg:px-24 grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
        <div className="order-2 lg:order-1">
          <div ref={detailsRef}>
            <ProjectDetails project={featured[displayedIndex]} index={displayedIndex} />
          </div>
        </div>

        <div className="order-1 lg:order-2">
          <div className="relative" style={{ height: 480 }}>
            <CardSwap
              containerClassName="card-swap-centered"
              width={480}
              height={380}
              cardDistance={45}
              verticalDistance={40}
              manual
              onSwap={handleSwap}
            >
              {featured.map((project, i) => {
                const number = String(i + 1).padStart(2, '0')
                return (
                  <Card
                    key={project.id}
                    className="!bg-black !border-tan/25 flex flex-col overflow-hidden cursor-pointer"
                  >
                    <div className="flex-1 min-h-0">
                      {project.image ? (
                        <img
                          src={project.image}
                          alt={`${project.name} screenshot`}
                          className="w-full h-full object-cover object-top"
                          loading="lazy"
                          draggable={false}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-accent/20 to-accent/5">
                          <FaLock className="w-10 h-10 text-accent/40" aria-hidden />
                        </div>
                      )}
                    </div>
                    <div className="p-4 flex items-center justify-between gap-3">
                      <h4 className="font-medium uppercase text-cream text-sm">{project.name}</h4>
                      <span className="text-[10px] font-black text-tan/50">{number}</span>
                    </div>
                  </Card>
                )
              })}
            </CardSwap>
          </div>
          <p className="text-center text-xs text-tan/50 mt-3">Click the card to view the next project</p>
        </div>
      </div>
    </section>
  )
}
