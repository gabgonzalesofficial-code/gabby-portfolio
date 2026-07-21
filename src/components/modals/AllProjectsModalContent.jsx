import TechIcon from '../TechIcon'

export default function AllProjectsModalContent({ projects }) {
  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div key={project.id} className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:border-gray-300 dark:hover:border-gray-600 transition">
          {project.image && (
            <img
              src={project.image}
              alt={`${project.name} screenshot`}
              className="w-full aspect-video object-cover object-top"
              loading="lazy"
            />
          )}

          <div className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{project.name}</h3>
            <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{project.description}</p>

            {project.stack?.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-2">
                {project.stack.map((key) => (
                  <span
                    key={key}
                    title={key}
                    className="flex items-center justify-center w-7 h-7 rounded-md bg-gray-100 dark:bg-gray-700 cursor-default"
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
                className="text-blue-600 dark:text-blue-400 text-sm hover:underline flex items-center gap-1 cursor-pointer"
              >
                {project.url}
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            ) : project.private ? (
              <span className="text-gray-400 dark:text-gray-500 text-xs italic">NDA · Private project</span>
            ) : null}
          </div>
        </div>
      ))}
    </div>
  );
}
