import TechIcon from './TechIcon'

// Broader groupings than techStack's own categories, purely for how this
// section is laid out — one row per group.
const ROW_GROUPS = [
  { label: 'Web Development', keys: ['frontend', 'backend', 'database', 'design', 'gameDev'] },
  { label: 'Dev Tools & Automation', keys: ['tools', 'automation'] },
  { label: 'CRM & Cloud Platforms', keys: ['crmCms', 'productivity', 'cloud'] },
  { label: 'AI Tools', keys: ['aiTools'] }
]

// A preview, not the full list — "View all" opens the complete tech stack.
// Static and wrapping (no scroll/drag/animation): that machinery kept
// producing subtle visual glitches for comparatively little benefit here.
const MAX_VISIBLE = 8

function LogoRow({ items }) {
  const visible = items.slice(0, MAX_VISIBLE)
  return (
    <div className="flex flex-wrap gap-3">
      {visible.map((tech) => (
        <div
          key={tech.name}
          title={tech.name}
          className="flex items-center gap-2 shrink-0 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-md text-sm transition cursor-default"
        >
          <TechIcon name={tech.icon} className="w-4 h-4" />
          <span>{tech.name}</span>
        </div>
      ))}
    </div>
  )
}

export default function TechMarquee({ techStack }) {
  const rows = ROW_GROUPS
    .map((group) => ({
      label: group.label,
      items: group.keys.flatMap((key) => techStack[key] || [])
    }))
    .filter((row) => row.items.length > 0)

  return (
    <div className="space-y-4">
      {rows.map((row) => (
        <div key={row.label}>
          <p className="text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400 mb-1.5">
            {row.label}
          </p>
          <LogoRow items={row.items} />
        </div>
      ))}
    </div>
  )
}
