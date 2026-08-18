import { useState, lazy, Suspense, useEffect } from 'react'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import './App.css'
import Modal from './components/Modal'
import Loader from './components/Loader'
import { AnimatedBackground } from './components/AnimatedBackground'
import { DonationModalContent, TechStackModalContent, AllProjectsModalContent, AllCertificationsModalContent } from './components/modals'
import {
  Navbar,
  Hero,
  TechStack,
  Projects,
  ExperienceAwards,
  GalleryReviews,
  Contact,
  Footer,
} from './components/sections'
import {
  profileInfo,
  techStack,
  services,
  certifications,
  galleryImages,
  experience,
  recommendations,
  footer,
} from './data/profileData'
import { projects } from './data/projects'
import { useLoaderSequence } from './hooks'

// Lazy load heavy components (Three.js, GSAP, AI chat)
const EveRobot = lazy(() => import('./components/ThreeEveRobot'))
const ChatBot = lazy(() => import('./components/ChatBot'))

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState({ title: '', content: null, size: 'lg', bodyScroll: true })
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [loaderPhase, setLoaderPhase] = useLoaderSequence()

  const openModal = (title, content, options = {}) => {
    setModalContent({ title, content, size: options.size ?? 'lg', bodyScroll: options.bodyScroll ?? true })
    setIsModalOpen(true)
  }

  // Every section computes its ScrollTrigger positions as soon as it mounts,
  // but async content below the fold (the hero's video, DomeGallery's
  // ResizeObserver-driven sizing, images) can still shift page layout after
  // that. Recalculate once everything has actually finished loading so
  // trigger points match the real, final layout instead of a stale one.
  useEffect(() => {
    if (loaderPhase !== 'done') return

    const refresh = () => ScrollTrigger.refresh()

    if (document.readyState === 'complete') {
      const id = requestAnimationFrame(refresh)
      return () => cancelAnimationFrame(id)
    }

    window.addEventListener('load', refresh)
    return () => window.removeEventListener('load', refresh)
  }, [loaderPhase])

  if (loaderPhase !== 'done') {
    return (
      <Loader
        step={loaderPhase}
        onRequestAccess={() => setLoaderPhase('initializing')}
      />
    )
  }

  return (
    <div className="min-h-screen bg-black portfolio-enter" style={{ overflowX: 'clip' }}>
      <AnimatedBackground />

      <Navbar />

      <Hero
        profileInfo={profileInfo}
        onOpenDonation={() => openModal('Support My Work', <DonationModalContent profileInfo={profileInfo} />)}
      />

      <TechStack
        techStack={techStack}
        services={services}
        onOpenAll={() => openModal('Tech Stack', <TechStackModalContent techStack={techStack} />, { size: 'xl' })}
      />

      <Projects
        projects={projects}
        onOpenAll={() => openModal('All Projects', <AllProjectsModalContent projects={projects} />, { size: 'xl' })}
      />

      <ExperienceAwards
        experience={experience}
        certifications={certifications}
        onOpenAllCertifications={() =>
          openModal('All Certifications', <AllCertificationsModalContent certifications={certifications} />, {
            size: 'xl',
            bodyScroll: false,
          })
        }
      />

      <GalleryReviews
        galleryImages={galleryImages}
        recommendations={recommendations}
        onOpenFull={(rec) =>
          openModal(
            'Recommendation',
            <div className="space-y-4">
              <blockquote className="text-cream/80 italic border-l-4 border-tan/30 pl-4 text-lg">
                &ldquo;{rec.quote}&rdquo;
              </blockquote>
              <p className="text-tan/70">
                — <span className="font-semibold text-cream/90">{rec.author}</span>, {rec.position}
              </p>
            </div>
          )
        }
      />

      <Contact />

      <Footer footer={footer} />

      {/* EVE Robot — Chat trigger (hidden when chat open to avoid overlap) */}
      <Suspense fallback={
        <div
          className="fixed bottom-4 right-4 w-[110px] h-[110px] rounded-full bg-tan/10 animate-pulse"
          style={{ zIndex: 9999 }}
          aria-hidden
        />
      }>
        <EveRobot
          onClick={() => setIsChatOpen((prev) => !prev)}
          aria-label={isChatOpen ? "Close chat" : "Open chat with Gabriel"}
          chatOpen={isChatOpen}
        />
      </Suspense>

      {/* ChatBot Component — lazy loaded when chat opens */}
      {isChatOpen && (
        <Suspense fallback={
          <div
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm flex items-center justify-center"
            onClick={() => setIsChatOpen(false)}
            role="button"
            tabIndex={0}
            aria-label="Loading chat"
          />
        }>
          <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />
        </Suspense>
      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={modalContent.title}
        size={modalContent.size}
        bodyScroll={modalContent.bodyScroll}
      >
        {modalContent.content}
      </Modal>
    </div>
  )
}

export default App
