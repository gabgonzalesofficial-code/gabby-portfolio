/**
 * Abstract dashboard/app visual for NDA projects — communicates the
 * *type* of product (dashboard, AI tool) without exposing real data.
 */
export default function ProjectNDAVisual({ type = 'dashboard' }) {
  if (type === 'ai') {
    return (
      <div className="w-full h-full bg-gradient-to-br from-[#0d0d0d] to-[#1a1412] relative overflow-hidden flex items-center justify-center">
        {/* Abstract AI circuit/brain motif */}
        <svg viewBox="0 0 400 280" className="w-full h-full" aria-hidden>
          {/* Grid lines */}
          {[60, 120, 180, 240, 300, 360].map((x) => (
            <line key={`v${x}`} x1={x} y1={0} x2={x} y2={280} stroke="rgba(232,201,153,0.06)" strokeWidth={1} />
          ))}
          {[40, 90, 140, 190, 240].map((y) => (
            <line key={`h${y}`} x1={0} y1={y} x2={400} y2={y} stroke="rgba(232,201,153,0.06)" strokeWidth={1} />
          ))}

          {/* Central brain/neuron node */}
          <circle cx={200} cy={140} r={28} fill="none" stroke="rgba(232,201,153,0.25)" strokeWidth={1.5} />
          <circle cx={200} cy={140} r={6} fill="rgba(142,22,22,0.6)" />
          <circle cx={200} cy={140} r={3} fill="rgba(232,201,153,0.8)" />

          {/* Radiating connection lines */}
          {[
            [200, 140, 120, 60],
            [200, 140, 300, 70],
            [200, 140, 100, 180],
            [200, 140, 320, 200],
            [200, 140, 150, 240],
            [200, 140, 280, 30],
            [200, 140, 80, 100],
            [200, 140, 340, 140],
          ].map(([x1, y1, x2, y2], i) => (
            <line key={`c${i}`} x1={x1} y1={y1} x2={x2} y2={y2} stroke="rgba(232,201,153,0.1)" strokeWidth={0.8} />
          ))}

          {/* Satellite nodes */}
          {[
            [120, 60, 8], [300, 70, 10], [100, 180, 7],
            [320, 200, 9], [150, 240, 6], [280, 30, 7],
            [80, 100, 5], [340, 140, 8],
          ].map(([cx, cy, r], i) => (
            <circle key={`n${i}`} cx={cx} cy={cy} r={r} fill="none" stroke="rgba(232,201,153,0.2)" strokeWidth={0.8} />
          ))}

          {/* Content blocks — abstracted text */}
          <rect x={30} y={30} width={80} height={8} rx={2} fill="rgba(232,201,153,0.08)" />
          <rect x={30} y={44} width={55} height={5} rx={2} fill="rgba(232,201,153,0.05)" />

          <rect x={310} y={220} width={65} height={8} rx={2} fill="rgba(232,201,153,0.08)" />
          <rect x={310} y={234} width={45} height={5} rx={2} fill="rgba(232,201,153,0.05)" />

          <rect x={40} y={230} width={70} height={6} rx={2} fill="rgba(232,201,153,0.06)" />
          <rect x={40} y={242} width={90} height={5} rx={2} fill="rgba(232,201,153,0.04)" />

          {/* "AI" label */}
          <text x={200} y={145} textAnchor="middle" fontSize={10} fontFamily="monospace" fontWeight={700} fill="rgba(232,201,153,0.35)">AI</text>
        </svg>

        {/* NDA badge */}
        <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/60 border border-tan/20">
          <span className="w-1.5 h-1.5 rounded-full bg-accent" />
          <span className="text-[10px] uppercase tracking-widest text-tan/60">Private / NDA</span>
        </div>
      </div>
    )
  }

  // Default: dashboard mockup
  return (
    <div className="w-full h-full bg-gradient-to-br from-[#0d0d0d] to-[#12100e] relative overflow-hidden">
      <svg viewBox="0 0 400 280" className="w-full h-full" aria-hidden>
        {/* Background grid */}
        {[50, 100, 150, 200, 250, 300, 350].map((x) => (
          <line key={`v${x}`} x1={x} y1={0} x2={x} y2={280} stroke="rgba(232,201,153,0.04)" strokeWidth={0.5} />
        ))}
        {[35, 70, 105, 140, 175, 210, 245].map((y) => (
          <line key={`h${y}`} x1={0} y1={y} x2={400} y2={y} stroke="rgba(232,201,153,0.04)" strokeWidth={0.5} />
        ))}

        {/* Sidebar */}
        <rect x={0} y={0} width={70} height={280} fill="rgba(232,201,153,0.03)" />
        <rect x={14} y={20} width={42} height={6} rx={2} fill="rgba(232,201,153,0.12)" />
        {[45, 70, 95, 120, 145].map((y, i) => (
          <rect key={`s${i}`} x={14} y={y} width={36 + (i % 2) * 8} height={4} rx={1.5} fill="rgba(232,201,153,0.06)" />
        ))}

        {/* Top bar */}
        <rect x={80} y={10} width={310} height={24} rx={4} fill="rgba(232,201,153,0.04)" />
        <rect x={90} y={16} width={60} height={8} rx={2} fill="rgba(232,201,153,0.08)" />

        {/* Stat cards row */}
        {[
          [85, 44, 88, 48],
          [185, 44, 88, 48],
          [285, 44, 88, 48],
        ].map(([x, y, w, h], i) => (
          <g key={`card${i}`}>
            <rect x={x} y={y} width={w} height={h} rx={4} fill="rgba(232,201,153,0.04)" stroke="rgba(232,201,153,0.08)" strokeWidth={0.5} />
            <rect x={x + 8} y={y + 8} width={30 + i * 5} height={7} rx={2} fill="rgba(142,22,22,0.3)" />
            <rect x={x + 8} y={y + 22} width={50} height={4} rx={1.5} fill="rgba(232,201,153,0.1)" />
            <rect x={x + 8} y={y + 30} width={35} height={3} rx={1} fill="rgba(232,201,153,0.05)" />
          </g>
        ))}

        {/* Chart area */}
        <rect x={85} y={100} width={195} height={110} rx={4} fill="rgba(232,201,153,0.03)" stroke="rgba(232,201,153,0.06)" strokeWidth={0.5} />
        {/* Bar chart */}
        {[100, 120, 140, 160, 180, 200, 220, 240].map((x, i) => {
          const h = [35, 55, 40, 70, 50, 80, 60, 45][i]
          return (
            <rect key={`bar${i}`} x={x} y={100 + 100 - h} width={12} height={h} rx={2} fill={i === 5 ? 'rgba(142,22,22,0.4)' : 'rgba(232,201,153,0.1)'} />
          )
        })}

        {/* Data table */}
        <rect x={290} y={100} width={100} height={110} rx={4} fill="rgba(232,201,153,0.03)" stroke="rgba(232,201,153,0.06)" strokeWidth={0.5} />
        {[112, 128, 144, 160, 176, 192].map((y, i) => (
          <g key={`row${i}`}>
            <rect x={298} y={y} width={20} height={4} rx={1} fill="rgba(232,201,153,0.08)" />
            <rect x={324} y={y} width={30 + (i % 3) * 8} height={4} rx={1} fill="rgba(232,201,153,0.05)" />
            <rect x={360} y={y} width={18} height={4} rx={1} fill={i % 2 === 0 ? 'rgba(142,22,22,0.2)' : 'rgba(232,201,153,0.04)'} />
          </g>
        ))}

        {/* Bottom section */}
        <rect x={85} y={220} width={140} height={44} rx={4} fill="rgba(232,201,153,0.03)" stroke="rgba(232,201,153,0.06)" strokeWidth={0.5} />
        <rect x={235} y={220} width={155} height={44} rx={4} fill="rgba(232,201,153,0.03)" stroke="rgba(232,201,153,0.06)" strokeWidth={0.5} />

        {/* List items in bottom-left card */}
        {[230, 242, 254].map((y, i) => (
          <g key={`li${i}`}>
            <circle cx={96} cy={y + 3} r={3} fill="rgba(142,22,22,0.25)" />
            <rect x={105} y={y} width={40 + i * 10} height={4} rx={1} fill="rgba(232,201,153,0.07)" />
          </g>
        ))}

        {/* Mini line chart in bottom-right card */}
        <polyline
          points="248,252 262,240 276,248 290,235 304,242 318,230 332,238 346,228 360,232 374,225"
          fill="none"
          stroke="rgba(142,22,22,0.35)"
          strokeWidth={1.5}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <polyline
          points="248,252 262,240 276,248 290,235 304,242 318,230 332,238 346,228 360,232 374,225"
          fill="none"
          stroke="rgba(232,201,153,0.15)"
          strokeWidth={0.5}
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="2 3"
        />
      </svg>

      {/* NDA badge */}
      <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/60 border border-tan/20">
        <span className="w-1.5 h-1.5 rounded-full bg-accent" />
        <span className="text-[10px] uppercase tracking-widest text-tan/60">Private / NDA</span>
      </div>
    </div>
  )
}
