import TechIcon from '../TechIcon'
import ProjectStatStrip from '../ProjectStatStrip'
import ProjectNDAVisual from '../ProjectNDAVisual'
import Masonry from '../Masonry'

export default function AllProjectsModalContent({ projects }) {
  const project = projects[0]
  if (!project) return null

  const number = String(projects.indexOf(project) + 1).padStart(2, '0')
  const capabilities = project.capabilities || []
  const highlights = project.highlights || []
  const integrations = project.integrations || []
  const impact = project.impact
  const categories = project.categories || []

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <div className="flex items-start justify-between gap-3 mb-2">
          <span className="font-black text-tan/70 leading-none" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>
            {number}
          </span>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] uppercase tracking-widest text-tan/50 border border-tan/15 px-2 py-0.5 rounded">
              {project.category}
            </span>
            {project.nda && (
              <span className="text-[10px] uppercase tracking-widest text-accent/70 border border-accent/20 px-2 py-0.5 rounded flex items-center gap-1">
                <span className="w-1 h-1 rounded-full bg-accent" />
                NDA
              </span>
            )}
          </div>
        </div>
        <h2 className="font-medium uppercase text-cream mb-1" style={{ fontSize: 'clamp(1.1rem, 2vw, 1.6rem)' }}>
          {project.name}
        </h2>
        {categories.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-2">
            {categories.map((cat) => (
              <span key={cat} className="text-[9px] uppercase tracking-wider text-tan/40 border border-tan/10 px-1.5 py-0.5 rounded">
                {cat}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Visual */}
      {project.nda ? (
        <div className="rounded-lg overflow-hidden border border-tan/10" style={{ height: 240 }}>
          <ProjectNDAVisual type={project.name.includes('Social') ? 'ai' : 'dashboard'} />
        </div>
      ) : project.image ? (
        <div className="rounded-lg overflow-hidden border border-tan/10">
          <img src={project.image} alt={project.name + ' screenshot'} className="w-full aspect-video object-cover object-top" loading="lazy" />
        </div>
      ) : null}

      {/* Screenshots Gallery */}
      {project.screenshots?.length > 1 && (
        <div>
          <h4 className="text-tan text-xs uppercase tracking-widest mb-3">Screenshots</h4>
          <div style={{ height: 400 }}>
            <Masonry
              items={project.screenshots.map((src, i) => ({
                id: String(i),
                img: src,
                url: '#',
                height: 300
              }))}
              ease="power3.out"
              duration={0.5}
              stagger={0.04}
              animateFrom="bottom"
              scaleOnHover={true}
              hoverScale={0.97}
              blurToFocus={true}
              colorShiftOnHover={false}
            />
          </div>
        </div>
      )}

      {/* Metrics */}
      {project.metrics?.length > 0 && <ProjectStatStrip metrics={project.metrics} large dark />}

      {/* Overview */}
      {project.overview && (
        <div>
          <h4 className="text-tan text-xs uppercase tracking-widest mb-2">Overview</h4>
          <p className="text-cream/75 text-sm leading-relaxed">{project.overview}</p>
        </div>
      )}

      {/* Challenge & Solution */}
      {(project.challenge || project.solution) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {project.challenge && (
            <div className="bg-accent/5 border border-accent/10 rounded-lg p-4">
              <h4 className="text-accent text-xs uppercase tracking-widest mb-2">The Challenge</h4>
              <p className="text-cream/70 text-sm leading-relaxed">{project.challenge}</p>
            </div>
          )}
          {project.solution && (
            <div className="bg-cream/5 border border-cream/10 rounded-lg p-4">
              <h4 className="text-cream text-xs uppercase tracking-widest mb-2">The Solution</h4>
              <p className="text-cream/70 text-sm leading-relaxed">{project.solution}</p>
            </div>
          )}
        </div>
      )}

      {/* Capabilities (for PPL, Social Media) */}
      {capabilities.length > 0 && (
        <div>
          <h4 className="text-tan text-xs uppercase tracking-widest mb-2">Key Capabilities</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
            {capabilities.map((cap, i) => (
              <div key={i} className="flex items-start gap-2 text-cream/70 text-sm">
                <span className="text-accent mt-1 text-[10px]">▸</span>
                {cap}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Technical Highlights (for Smart POS, Budgjet, etc.) */}
      {highlights.length > 0 && (
        <div>
          <h4 className="text-tan text-xs uppercase tracking-widest mb-2">Technical Highlights</h4>
          <div className="space-y-3">
            {highlights.map((h, i) => (
              <div key={i} className="border-l-2 border-tan/20 pl-3">
                <h5 className="text-cream text-sm font-medium mb-0.5">{h.title}</h5>
                <p className="text-cream/60 text-xs leading-relaxed">{h.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Integrations (for PPL) */}
      {integrations.length > 0 && (
        <div>
          <h4 className="text-tan text-xs uppercase tracking-widest mb-2">Integrations</h4>
          <div className="flex flex-wrap gap-2">
            {integrations.map((intg, i) => (
              <span key={i} className="text-[11px] uppercase tracking-wider text-cream/60 border border-tan/15 px-2.5 py-1 rounded">
                {intg}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Impact */}
      {impact && (
        <div>
          <h4 className="text-tan text-xs uppercase tracking-widest mb-2">Impact</h4>
          {Array.isArray(impact) ? (
            <div className="space-y-1.5">
              {impact.map((item, i) => (
                <div key={i} className="flex items-start gap-2 text-cream/70 text-sm">
                  <span className="text-accent mt-1 text-[10px]">▸</span>
                  {item}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-cream/70 text-sm leading-relaxed border-l-4 border-accent/60 pl-3 italic">{impact}</p>
          )}
        </div>
      )}

      {/* Tech Stack */}
      {project.stack?.length > 0 && (
        <div>
          <h4 className="text-tan text-xs uppercase tracking-widest mb-2">Technology</h4>
          <div className="flex flex-wrap gap-2">
            {project.stack.map((key) => (
              <span key={key} title={key} className="flex items-center justify-center w-9 h-9 rounded-md bg-cream/5 border border-cream/10">
                <TechIcon name={key} className="w-5 h-5" />
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Role */}
      {project.role && (
        <div className="text-xs text-cream/40">
          <span className="uppercase tracking-wider">Role:</span> {project.role}
          {project.company && <span className="ml-1">· {project.company}</span>}
        </div>
      )}

      {/* Link */}
      {project.url && (
        <a
          href={project.url.startsWith('http') ? project.url : 'https://' + project.url}
          target="_blank" rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border-2 border-tan text-tan uppercase tracking-widest text-xs hover:bg-cream/10 transition-all"
        >
          Live Project
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      )}
    </div>
  )
}
