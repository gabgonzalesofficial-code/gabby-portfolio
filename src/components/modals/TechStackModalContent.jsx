import TechIcon from '../TechIcon'

const CATEGORY_LABELS = {
  frontend: 'Frontend',
  backend: 'Backend',
  database: 'Database',
  crmCms: 'CRM/CMS',
  automation: 'Automation & Testing',
  design: 'Design',
  tools: 'Tools & Version Control',
  aiTools: 'AI Tools',
  gameDev: 'Game Development',
}

export default function TechStackModalContent({ techStack }) {
  return (
    <div className="space-y-4">
      {Object.entries(techStack).map(([category, techs]) => (
        <div key={category}>
          <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 text-lg">
            {CATEGORY_LABELS[category] || category}
          </h3>
          <div className="flex flex-wrap gap-2">
            {techs.map((tech, idx) => (
              <span
                key={idx}
                className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-md text-sm transition cursor-default"
                title={tech.description ? `${tech.name} - ${tech.description}` : tech.name}
              >
                <TechIcon name={tech.icon} className="w-4 h-4" />
                <span>{tech.name}</span>
                {tech.description && (
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({tech.description})</span>
                )}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
