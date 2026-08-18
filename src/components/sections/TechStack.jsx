import DomeGallery from '../DomeGallery'
import TechIcon from '../TechIcon'
import { useSectionTransition } from '../../hooks'

function renderTechTile(item) {
  if (!item) return null
  return (
    <div className="w-full h-full flex flex-col items-center justify-center gap-1.5 bg-gradient-to-br from-cream/10 to-cream/[0.02] border border-cream/10 shadow-[inset_0_1px_1px_rgba(248,238,223,0.15),inset_0_-3px_6px_rgba(0,0,0,0.45)]">
      <TechIcon name={item.icon} className="w-6 h-6 sm:w-7 sm:h-7" />
      <span className="text-[9px] sm:text-[10px] text-cream/80 text-center px-1 leading-tight">{item.name}</span>
    </div>
  )
}

export default function TechStack({ techStack, services, onOpenAll }) {
  const items = Object.values(techStack).flat()
  const sectionRef = useSectionTransition()

  return (
    <section
      id="tech-stack"
      ref={sectionRef}
      className="min-h-screen flex items-center bg-black text-cream px-6 sm:px-10 md:px-12 lg:px-16 xl:px-20 py-10 sm:py-14 lg:py-16"
    >
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 xl:gap-24 w-full">
        {/* Expertise */}
        <div>
          <h3 className="font-medium uppercase tracking-widest text-xs text-tan/50 mb-5">Expertise</h3>
          <div className="space-y-4">
            {services.map((service) => (
              <div key={service.id} className="border-t border-cream/15 pt-3">
                <div className="flex items-baseline gap-3">
                  <span className="text-xs font-black text-tan tracking-widest flex-shrink-0">
                    {String(service.id).padStart(2, '0')}
                  </span>
                  <h4 className="font-medium uppercase text-base sm:text-lg leading-snug">{service.name}</h4>
                </div>
                <p className="text-tan/70 text-sm leading-normal mt-1">{service.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Tech stack */}
        <div className="flex flex-col">
          <div className="flex items-center justify-between mb-2 flex-shrink-0">
            <h3 className="font-medium uppercase tracking-widest text-xs text-tan/50">Tech Stack</h3>
            <button
              onClick={onOpenAll}
              className="text-sm uppercase tracking-widest text-tan border-b border-cream/30 hover:border-cream pb-1 transition-all duration-300 ease-out cursor-pointer"
            >
              View All
            </button>
          </div>
          <div className="flex-1 h-[400px] sm:h-[460px] lg:h-[520px]">
            <DomeGallery
              images={items}
              renderTile={renderTechTile}
              dedupeKey={(item) => item?.icon}
              enableEnlarge={false}
              grayscale={false}
              overlayBlurColor="#000000"
              minRadius={200}
              maxRadius={400}
              fit={0.55}
              padFactor={0.1}
              maxVerticalRotationDeg={15}
              dragSensitivity={16}
              segments={18}
              imageBorderRadius="24px"
            />
          </div>
        </div>
      </div>
    </section>
  )
}
