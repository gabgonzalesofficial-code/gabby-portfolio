export default function AllProjectsModalContent({ projects }) {
  return (
    <div className="space-y-4">
      {projects.map((project) => (
        <div key={project.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-600 transition">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{project.name}</h3>
          <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{project.description}</p>
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
        </div>
      ))}
    </div>
  );
}
