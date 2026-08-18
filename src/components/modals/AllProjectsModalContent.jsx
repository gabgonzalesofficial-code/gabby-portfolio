import TechIcon from '../TechIcon'
import ProjectStatStrip from '../ProjectStatStrip'

export default function AllProjectsModalContent({ projects }) {
  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div key={project.id} className="border border-tan/15 rounded-lg overflow-hidden hover:border-tan/40 transition">
          {project.image && (
            <img
              src={project.image}
              alt={`${project.name} screenshot`}
              className="w-full aspect-video object-cover object-top"
              loading="lazy"
            />
          )}

          <div className="p-4">
            <h3 className="font-semibold text-cream mb-1">{project.name}</h3>
            {project.description ? (
              <div className="space-y-2 mb-3">
                {String(project.description).split(/\n\n+/).map((para, i) => (
                  <p key={i} className="text-cream/70 text-sm leading-relaxed">{para}</p>
                ))}
              </div>
            ) : (
              <p className="text-cream/70 text-sm mb-2">{project.tagline || project.description}</p>
            )}

            <ProjectStatStrip metrics={project.metrics} />

            {(project.problem || project.solution || project.impact) && (
              <div className="space-y-2 mb-3 text-sm">
                {project.problem && (
                  <p className="text-cream/70">
                    <span className="font-semibold text-cream">Problem: </span>
                    {project.problem}
                  </p>
                )}
                {project.solution && (
                  <p className="text-cream/70">
                    <span className="font-semibold text-cream">Solution: </span>
                    {project.solution}
                  </p>
                )}
                {project.impact && (
                  <p className="border-l-4 border-accent/60 pl-3 text-tan/90 italic">
                    {project.impact}
                  </p>
                )}
              </div>
            )}

            {project.stack?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {project.stack.map((key) => (
                  <span
                    key={key}
                    title={key}
                    className="flex items-center justify-center w-7 h-7 rounded-md bg-cream/10 cursor-default"
                  >
                    <TechIcon name={key} className="w-4 h-4" />
                  </span>
                ))}
              </div>
            )}

            {project.url ? (
              <a
                href={project.url.startsWith('http') ? project.url : `https://${project.url}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-tan hover:text-cream text-sm hover:underline flex items-center gap-1 cursor-pointer"
              >
                {project.url}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ) : project.private ? (
              <span className="text-tan/50 text-xs italic">NDA · Private project</span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
