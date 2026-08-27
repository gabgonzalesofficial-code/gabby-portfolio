import { useEffect, useState } from 'react'
import TechIcon from './TechIcon'
import ProjectStatStrip from './ProjectStatStrip'
import ProjectNDAVisual from './ProjectNDAVisual'
import Masonry from './Masonry'
import Lightbox from './Lightbox'

export default function ProjectPage({ project, onBack }) {
  useEffect(() => { window.scrollTo(0, 0) }, [])
  const [lightbox, setLightbox] = useState(null)
  if (!project) return null

  const number = String(project.id).padStart(2, '0')
  const capabilities = project.capabilities || []
  const highlights = project.highlights || []
  const integrations = project.integrations || []
  const impact = project.impact
  const categories = project.categories || []

  return (
    <div className="min-h-screen bg-black">
      <div className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-tan/10">
        <div className="max-w-6xl mx-auto px-6 py-4 flex items-center gap-4">
          <button onClick={onBack} className="flex items-center gap-2 text-cream/60 hover:text-cream transition-colors group">
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
            <span className="text-sm uppercase tracking-wider">Back</span>
          </button>
          <div className="h-4 w-px bg-tan/20" />
          <span className="text-cream/40 text-sm uppercase tracking-wider">{project.name}</span>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-6 pt-12 pb-8">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <span className="font-black text-tan/60 leading-none" style={{ fontSize: 'clamp(2rem, 5vw, 4rem)' }}>{number}</span>
            <h1 className="font-medium uppercase text-cream mt-2" style={{ fontSize: 'clamp(1.5rem, 3vw, 2.5rem)' }}>{project.name}</h1>
            <div className="flex flex-wrap gap-2 mt-3">
              <span className="text-[10px] uppercase tracking-widest text-tan/50 border border-tan/15 px-2 py-1 rounded">{project.category}</span>
              {categories.map((cat) => (<span key={cat} className="text-[10px] uppercase tracking-widest text-tan/40 border border-tan/10 px-2 py-1 rounded">{cat}</span>))}
              {project.nda && (<span className="text-[10px] uppercase tracking-widest text-accent/70 border border-accent/20 px-2 py-1 rounded flex items-center gap-1"><span className="w-1 h-1 rounded-full bg-accent" />NDA</span>)}
            </div>
          </div>
          {project.url && (<a href={project.url.startsWith('http') ? project.url : 'https://' + project.url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 px-4 py-2 rounded-full border border-tan/30 text-tan text-xs uppercase tracking-wider hover:bg-cream/10 transition-all mt-2">Live Project <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg></a>)}
        </div>
        {project.nda ? (<div className="rounded-xl overflow-hidden border border-tan/10" style={{ height: 'clamp(300px, 50vw, 500px)' }}><ProjectNDAVisual type={project.name.includes('Social') ? 'ai' : 'dashboard'} /></div>) : project.image ? (<div className="rounded-xl overflow-hidden border border-tan/10 cursor-zoom-in hover:opacity-90 transition-opacity"><img src={project.image} alt={project.name + ' screenshot'} className="w-full aspect-video object-cover object-top" loading="lazy" onClick={() => setLightbox({ src: project.image, alt: project.name + ' screenshot' })} /></div>) : null}
      </div>
      <div className="max-w-6xl mx-auto px-6 pb-16">
        <p className="text-cream/80 text-lg leading-relaxed mb-10 max-w-3xl">{project.tagline}</p>
        {project.metrics && project.metrics.length > 0 && (<div className="mb-10"><ProjectStatStrip metrics={project.metrics} large dark /></div>)}
        {project.overview && (<div className="mb-10"><h3 className="text-tan text-xs uppercase tracking-widest mb-3">Overview</h3><p className="text-cream/75 text-base leading-relaxed max-w-3xl">{project.overview}</p></div>)}
        {(project.challenge || project.solution) && (<div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">{project.challenge && (<div className="bg-accent/5 border border-accent/10 rounded-xl p-6"><h3 className="text-accent text-xs uppercase tracking-widest mb-3">The Challenge</h3><p className="text-cream/70 text-sm leading-relaxed">{project.challenge}</p></div>)}{project.solution && (<div className="bg-cream/5 border border-cream/10 rounded-xl p-6"><h3 className="text-cream text-xs uppercase tracking-widest mb-3">The Solution</h3><p className="text-cream/70 text-sm leading-relaxed">{project.solution}</p></div>)}</div>)}
        {capabilities.length > 0 && (<div className="mb-10"><h3 className="text-tan text-xs uppercase tracking-widest mb-3">Key Capabilities</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-2">{capabilities.map((cap, i) => (<div key={i} className="flex items-start gap-2 text-cream/70 text-sm"><span className="text-accent mt-1 text-[10px]">&#x25b8;</span>{cap}</div>))}</div></div>)}
        {highlights.length > 0 && (<div className="mb-10"><h3 className="text-tan text-xs uppercase tracking-widest mb-3">Technical Highlights</h3><div className="grid grid-cols-1 sm:grid-cols-2 gap-4">{highlights.map((h, i) => (<div key={i} className="border-l-2 border-tan/20 pl-4"><h4 className="text-cream text-sm font-medium mb-1">{h.title}</h4><p className="text-cream/60 text-xs leading-relaxed">{h.description}</p></div>))}</div></div>)}
        {integrations.length > 0 && (<div className="mb-10"><h3 className="text-tan text-xs uppercase tracking-widest mb-3">Integrations</h3><div className="flex flex-wrap gap-2">{integrations.map((intg, i) => (<span key={i} className="text-[11px] uppercase tracking-wider text-cream/60 border border-tan/15 px-3 py-1.5 rounded-full">{intg}</span>))}</div></div>)}
        {impact && (<div className="mb-10"><h3 className="text-tan text-xs uppercase tracking-widest mb-3">Impact</h3>{Array.isArray(impact) ? (<div className="space-y-2">{impact.map((item, i) => (<div key={i} className="flex items-start gap-2 text-cream/70 text-sm"><span className="text-accent mt-1 text-[10px]">&#x25b8;</span>{item}</div>))}</div>) : (<p className="text-cream/70 text-sm leading-relaxed border-l-4 border-accent/60 pl-4 italic">{impact}</p>)}</div>)}
        {project.screenshots && project.screenshots.length > 1 && (<div className="mb-10"><h3 className="text-tan text-xs uppercase tracking-widest mb-4">Screenshots</h3><div style={{ height: 500 }}><Masonry onClick={(item) => setLightbox({ src: item.img, alt: project.name + ' screenshot' })} items={project.screenshots.map((src, i) => ({ id: String(i), img: src, url: '#', height: 350 }))} ease="power3.out" duration={0.5} stagger={0.04} animateFrom="bottom" scaleOnHover={true} hoverScale={0.97} blurToFocus={true} colorShiftOnHover={false} /></div></div>)}
        {project.stack && project.stack.length > 0 && (<div className="mb-10"><h3 className="text-tan text-xs uppercase tracking-widest mb-3">Technology</h3><div className="flex flex-wrap gap-3">{project.stack.map((key) => (<span key={key} title={key} className="flex items-center justify-center w-11 h-11 rounded-lg bg-cream/5 border border-cream/10 hover:bg-cream/10 transition-colors"><TechIcon name={key} className="w-6 h-6" /></span>))}</div></div>)}
        {project.role && (<div className="text-sm text-cream/40 pt-6 border-t border-tan/10"><span className="uppercase tracking-wider">Role:</span> {project.role}{project.company && <span className="ml-1">&#xb7; {project.company}</span>}</div>)}
      </div>
      {lightbox && <Lightbox src={lightbox.src} alt={lightbox.alt} onClose={() => setLightbox(null)} />}
    </div>
  )
}
