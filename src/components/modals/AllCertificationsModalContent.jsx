import { useState } from 'react'
import { FaAward } from 'react-icons/fa'

export default function AllCertificationsModalContent({ certifications }) {
  const [selected, setSelected] = useState(null)

  return (
    <div className="flex gap-6 flex-1 min-h-0" style={{ minHeight: '400px' }}>
      <div className={`${selected ? 'w-1/2' : 'w-full'} min-h-0 overflow-y-auto pr-2 flex-shrink-0`}>
        <div className="space-y-3 pb-4">
          {certifications.map((cert) => (
            <div
              key={cert.id}
              onClick={() => setSelected(cert)}
              className={`flex items-start gap-3 p-4 rounded transition cursor-pointer ${selected?.id === cert.id ? 'ring-2 ring-accent bg-accent/5' : 'hover:bg-cream/5'
                }`}
            >
              <FaAward className="w-6 h-6 text-tan/50 flex-shrink-0 mt-0.5" aria-hidden />
              <div className="flex-1">
                <h3 className="font-semibold text-cream">{cert.name}</h3>
                <p className="text-cream/70 text-sm">{cert.issuer}</p>
                <p className="text-tan/50 text-xs mt-1">{cert.year}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {selected && (
        <div className="w-1/2 border-l border-tan/15 pl-6 pr-6 flex flex-col flex-shrink-0 min-h-0">
          <div className="flex flex-col min-h-0 flex-1">
            <div className="flex-shrink-0 mb-4">
              <h3 className="text-xl font-bold text-cream mb-2">{selected.name}</h3>
              <p className="text-cream/70 text-sm mb-1">{selected.issuer}</p>
              <p className="text-tan/50 text-xs mb-4">{selected.year}</p>
            </div>
            {selected.image ? (
              <div className="flex-1 overflow-y-auto pr-2">
                <img
                  src={selected.image}
                  alt={selected.name}
                  className="w-full h-auto rounded-lg shadow-lg border border-tan/20"
                  style={{ maxWidth: '100%', objectFit: 'contain' }}
                  loading="lazy"
                />
              </div>
            ) : (
              <div className="mt-4 p-8 border border-tan/15 rounded-lg bg-cream/5 text-center">
                <p className="text-tan/50">Certificate preview not available</p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
