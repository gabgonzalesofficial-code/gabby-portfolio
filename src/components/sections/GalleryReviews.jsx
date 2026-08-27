import { useState } from 'react'
import { useRecommendationCarousel, useSectionTransition } from '../../hooks'

export default function GalleryReviews({ galleryImages, recommendations, onOpenFull }) {
  const [index, setIndex] = useState(0)
  const [recIndex, setRecIndex] = useRecommendationCarousel(recommendations)
  const sectionRef = useSectionTransition()

  return (
    <section id="gallery" ref={sectionRef} className="min-h-screen bg-black text-cream px-6 sm:px-12 md:px-16 lg:px-24 py-20 sm:py-24">
      <div className="max-w-6xl mx-auto">
        <h2 className="font-medium uppercase tracking-widest text-sm text-tan/60 mb-10 sm:mb-12">
          Gallery &amp; Reviews
        </h2>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-16 items-center">
          {/* Gallery */}
          <div>
            <div className="relative">
              <div className="flex overflow-hidden rounded-2xl">
                {galleryImages.map((img, idx) => (
                  <div key={img.id} className={`flex-shrink-0 w-full ${idx === index ? 'block' : 'hidden'}`}>
                    <img
                      src={img.src}
                      alt={img.alt}
                      className="w-full h-64 sm:h-80 lg:h-[440px] object-cover"
                      loading={idx === index ? 'eager' : 'lazy'}
                    />
                  </div>
                ))}
              </div>

              {galleryImages.length > 1 && (
                <>
                  <button
                    onClick={() => setIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1))}
                    className="absolute left-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-cream p-2 rounded-full shadow-lg cursor-pointer"
                    aria-label="Previous image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => setIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0))}
                    className="absolute right-3 top-1/2 -translate-y-1/2 bg-black/60 hover:bg-black/80 text-cream p-2 rounded-full shadow-lg cursor-pointer"
                    aria-label="Next image"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </>
              )}
            </div>

            <div className="flex justify-center gap-2 mt-4">
              {galleryImages.map((img, idx) => (
                <button
                  key={img.id}
                  onClick={() => setIndex(idx)}
                  className={`w-2 h-2 rounded-full cursor-pointer ${idx === index ? 'bg-cream' : 'bg-tan/30'}`}
                  aria-label={`Go to image ${idx + 1}`}
                />
              ))}
            </div>
          </div>

          {/* Reviews */}
          <div>
            <div className="relative min-h-[200px]">
              {recommendations.map((rec, idx) => {
                const isActive = idx === recIndex
                const shouldTruncate = rec.quote.length > 300
                const truncated = shouldTruncate ? `${rec.quote.substring(0, 300)}...` : rec.quote

                return (
                  <div
                    key={rec.id}
                    className={`transition-opacity duration-500 ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none absolute inset-0'
                      }`}
                  >
                    <blockquote
                      className="text-cream/80 italic leading-relaxed"
                      style={{ fontSize: 'clamp(0.95rem, 1.6vw, 1.15rem)' }}
                    >
                      &ldquo;{truncated}&rdquo;
                    </blockquote>
                    <p className="text-tan/60 text-sm mt-4">
                      — <span className="font-medium text-cream/85">{rec.author}</span>, {rec.position}
                    </p>
                    {shouldTruncate && (
                      <button
                        onClick={() => onOpenFull(rec)}
                        className="mt-3 text-sm text-tan hover:underline cursor-pointer"
                      >
                        Read full recommendation
                      </button>
                    )}
                  </div>
                )
              })}
            </div>

            {recommendations.length > 1 && (
              <div className="flex gap-1.5 justify-center mt-8">
                {recommendations.map((rec, idx) => (
                  <button
                    key={rec.id}
                    onClick={() => setRecIndex(idx)}
                    className={`w-2 h-2 rounded-full cursor-pointer transition ${idx === recIndex ? 'bg-cream' : 'bg-tan/30'}`}
                    aria-label={`Go to recommendation ${idx + 1}`}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
