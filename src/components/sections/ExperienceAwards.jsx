import { useStaggerReveal, useSectionTransition } from '../../hooks'

export default function ExperienceAwards({ experience, certifications, onOpenAllCertifications }) {
  const recentCerts = certifications.slice(0, 5)
  const experienceRef = useStaggerReveal({ y: 16, stagger: 0.08 })
  const certsRef = useStaggerReveal({ y: 12, stagger: 0.07 })
  const sectionRef = useSectionTransition()

  return (
    <section id="experience" ref={sectionRef} className="min-h-screen bg-black text-cream px-6 sm:px-12 md:px-16 lg:px-24 py-20 sm:py-24">
      <h2 className="font-medium uppercase tracking-widest text-sm text-tan/50 mb-12 sm:mb-16 max-w-6xl mx-auto">
        Experience &amp; Awards
      </h2>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-12">
        <div>
          <h3 className="font-medium uppercase tracking-widest text-xs text-tan/50 mb-8">Experience</h3>
          <div className="relative">
            <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-cream/15" />
            <div ref={experienceRef} className="space-y-8">
              {experience.map((exp, i) => (
                <div key={exp.id} className="relative pl-12">
                  <div
                    className={`absolute left-3 top-1.5 w-3 h-3 rounded-full border-2 border-black ${i === 0 ? 'bg-accent' : 'bg-cream'
                      }`}
                  />
                  <div className="flex items-start gap-4">
                    {exp.logo && (
                      <img
                        src={exp.logo}
                        alt={`${exp.company} logo`}
                        className="w-10 h-10 rounded-md object-contain bg-cream border border-cream/10 flex-shrink-0 mt-0.5"
                      />
                    )}
                    <div>
                      <h4 className="font-medium uppercase text-lg">{exp.role}</h4>
                      <p className="text-tan/70">{exp.company}</p>
                      <p className="text-tan/40 text-sm mt-1">{exp.year}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between mb-8 pr-16 lg:pr-0">
            <h3 className="font-medium uppercase tracking-widest text-xs text-tan/50">Certifications &amp; Awards</h3>
            <button
              onClick={onOpenAllCertifications}
              className="text-sm uppercase tracking-widest text-cream border-b border-cream/30 hover:border-cream pb-1 transition-all duration-300 ease-out cursor-pointer"
            >
              View All
            </button>
          </div>

          <div ref={certsRef} className="flex flex-col">
            {recentCerts.map((cert, i) => (
              <div
                key={cert.id}
                className="flex items-baseline gap-6 py-5"
                style={{ borderTop: i === 0 ? 'none' : '1px solid rgba(248, 238, 223, 0.12)' }}
              >
                <span className="font-black text-2xl sm:text-3xl text-tan/25 flex-shrink-0 w-10">
                  {String(i + 1).padStart(2, '0')}
                </span>
                <div>
                  <h4 className="font-medium">{cert.name}</h4>
                  <p className="text-sm text-tan/70">{cert.issuer} · {cert.year}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
