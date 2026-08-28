import { useEffect, useState } from 'react'
import OptimizedImage from './OptimizedImage'

export default function Lightbox({ src, alt, onClose }) {
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const handleKey = (e) => {
      if (e.key === 'Escape') onClose()
      if (e.key === '+' || e.key === '=') setScale(s => Math.min(s + 0.25, 3))
      if (e.key === '-') setScale(s => Math.max(s - 0.25, 0.5))
      if (e.key === '0') setScale(1)
    }
    document.addEventListener('keydown', handleKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKey)
      document.body.style.overflow = ''
    }
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-[10030] bg-black/90 backdrop-blur-sm flex items-center justify-center cursor-zoom-out"
      onClick={onClose}
    >
      <button
        onClick={onClose}
        className="absolute top-5 right-5 z-[10040] w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm border border-tan/20 text-cream/70 hover:text-cream flex items-center justify-center transition-colors"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-[10040] flex items-center gap-3 bg-black/60 backdrop-blur-sm border border-tan/20 rounded-full px-4 py-2">
        <button onClick={(e) => { e.stopPropagation(); setScale(s => Math.max(s - 0.25, 0.5)) }} className="text-cream/70 hover:text-cream transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" /></svg>
        </button>
        <span className="text-cream/50 text-xs min-w-[3rem] text-center">{Math.round(scale * 100)}%</span>
        <button onClick={(e) => { e.stopPropagation(); setScale(s => Math.min(s + 0.25, 3)) }} className="text-cream/70 hover:text-cream transition-colors">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
        </button>
        <div className="w-px h-4 bg-tan/20" />
        <button onClick={(e) => { e.stopPropagation(); setScale(1) }} className="text-cream/50 hover:text-cream text-xs transition-colors">Reset</button>
      </div>

      <OptimizedImage
        src={src}
        alt={alt}
        className="max-w-[90vw] max-h-[85vh] object-contain rounded-lg transition-transform duration-300"
        style={{ transform: `scale(${scale})` }}
        onClick={(e) => e.stopPropagation()}
        loading="eager"
        fetchPriority="high"
        draggable={false}
      />
    </div>
  )
}
