import StatCounter from './StatCounter'

export default function ProjectStatStrip({ metrics, large = false, dark = false }) {
  if (!metrics?.length) return null

  const borderClass = dark ? 'border-cream/15' : 'border-tan/20'
  const labelClass = dark ? 'text-tan/70' : 'text-tan/60'
  const detailClass = dark ? 'text-tan/50' : 'text-tan/50'

  return (
    <div className={`flex flex-wrap justify-center gap-x-6 gap-y-2 border-y ${borderClass} ${large ? 'mb-4 py-3' : 'mb-3 py-2'}`}>
      {metrics.slice(0, 3).map((stat) => (
        <div key={stat.label} className="text-center">
          <div className={`font-bold text-tan leading-tight ${large ? 'text-2xl' : 'text-lg'}`}>
            <StatCounter value={stat.value} />
          </div>
          <div className={`${labelClass} leading-tight ${large ? 'text-xs' : 'text-[11px]'}`}>{stat.label}</div>
          {stat.detail && (
            <div className={`${detailClass} leading-tight ${large ? 'text-[11px]' : 'text-[10px]'}`}>{stat.detail}</div>
          )}
        </div>
      ))}
    </div>
  )
}
