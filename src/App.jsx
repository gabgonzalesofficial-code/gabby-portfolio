import { useState, lazy, Suspense, useEffect } from 'react'
import './App.css'
import Modal from './components/Modal'
import Navbar from './components/sections/Navbar'
import Hero from './components/sections/Hero'
import { onFirstInteraction } from './lib/motion'
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

const ProjectPage = lazy(() => import('./components/ProjectPage'))
const AnimatedBackground = lazy(() =>
  import('./components/AnimatedBackground').then((m) => ({ default: m.AnimatedBackground }))
)
const TechStack = lazy(() => import('./components/sections/TechStack'))
const Projects = lazy(() => import('./components/sections/Projects'))
const ExperienceAwards = lazy(() => import('./components/sections/ExperienceAwards'))
const GalleryReviews = lazy(() => import('./components/sections/GalleryReviews'))
const Contact = lazy(() => import('./components/sections/Contact'))
const Footer = lazy(() => import('./components/sections/Footer'))
const EveRobot = lazy(() => import('./components/ThreeEveRobot'))
const ChatBot = lazy(() => import('./components/ChatBot'))

function SectionFallback({ id }) {
  return <section id={id} className="min-h-screen bg-black" aria-hidden />
}

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState({ title: '', content: null, size: 'lg', bodyScroll: true })
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [currentProject, setCurrentProject] = useState(null)
  const [robotReady, setRobotReady] = useState(false)
  const [bgReady, setBgReady] = useState(false)

  // Particle canvas can wait until the browser is idle so it doesn't contend with LCP.
  useEffect(() => {
    const start = () => setBgReady(true)
    if ('requestIdleCallback' in window) {
      const id = requestIdleCallback(start, { timeout: 2500 })
      return () => cancelIdleCallback(id)
    }
    const t = setTimeout(start, 1200)
    return () => clearTimeout(t)
  }, [])

  // Three.js + GLB: wait for first input, with an 8s fallback for non-interactive visits.
  useEffect(() => onFirstInteraction(() => setRobotReady(true), 8000), [])

  const goToProject = (project) => {
    setCurrentProject(project)
    window.history.pushState({}, '', '/project/' + project.id)
    document.body.style.overflow = 'hidden'
  }

  const goBack = () => {
    setCurrentProject(null)
    window.history.pushState({}, '', '/')
    document.body.style.overflow = ''
    setTimeout(() => {
      document.getElementById('projects')?.scrollIntoView({ behavior: 'smooth' })
    }, 100)
  }

  useEffect(() => {
    const handlePop = () => {
      const match = window.location.pathname.match(/\/project\/(\d+)/)
      if (match) {
        const projectId = parseInt(match[1])
        const project = projects.find((p) => p.id === projectId)
        if (project) {
          setCurrentProject(project)
          document.body.style.overflow = 'hidden'
        }
      } else {
        setCurrentProject(null)
        document.body.style.overflow = ''
      }
    }
    window.addEventListener('popstate', handlePop)
    return () => window.removeEventListener('popstate', handlePop)
  }, [])

  const openModal = (title, content, options = {}) => {
    setModalContent({ title, content, size: options.size ?? 'lg', bodyScroll: options.bodyScroll ?? true })
    setIsModalOpen(true)
  }

  useEffect(() => {
    let cancelled = false
    const refresh = () => {
      import('gsap/ScrollTrigger').then(({ ScrollTrigger }) => {
        if (!cancelled) ScrollTrigger.refresh()
      })
    }
    if (document.readyState === 'complete') {
      const id = requestAnimationFrame(refresh)
      return () => {
        cancelled = true
        cancelAnimationFrame(id)
      }
    }
    window.addEventListener('load', refresh)
    return () => {
      cancelled = true
      window.removeEventListener('load', refresh)
    }
  }, [])

  if (currentProject) {
    return (
      <Suspense fallback={<div className="min-h-screen bg-black" />}>
        <ProjectPage project={currentProject} onBack={goBack} />
      </Suspense>
    )
  }

  return (
    <div className="min-h-screen bg-black" style={{ overflowX: 'clip' }}>
      {bgReady && (
        <Suspense fallback={null}>
          <AnimatedBackground />
        </Suspense>
      )}

      <Navbar profileInfo={profileInfo} />

      <Hero
        profileInfo={profileInfo}
        onOpenDonation={() => {
          import('./components/modals/DonationModalContent').then(({ default: DonationModalContent }) => {
            openModal('Support My Work', <DonationModalContent profileInfo={profileInfo} />)
          })
        }}
      />

      <Suspense fallback={<SectionFallback id="tech-stack" />}>
        <TechStack
          techStack={techStack}
          services={services}
          onOpenAll={() => {
            import('./components/modals/TechStackModalContent').then(({ default: TechStackModalContent }) => {
              openModal('Tech Stack', <TechStackModalContent techStack={techStack} />, { size: 'xl' })
            })
          }}
        />
      </Suspense>

      <Suspense fallback={<SectionFallback id="projects" />}>
        <Projects
          projects={projects}
          onOpenProject={goToProject}
        />
      </Suspense>

      <Suspense fallback={<SectionFallback id="experience" />}>
        <ExperienceAwards
          experience={experience}
          certifications={certifications}
          onOpenAllCertifications={() => {
            import('./components/modals/AllCertificationsModalContent').then(({ default: AllCertificationsModalContent }) => {
              openModal('All Certifications', <AllCertificationsModalContent certifications={certifications} />, {
                size: 'xl',
                bodyScroll: false,
              })
            })
          }}
        />
      </Suspense>

      <Suspense fallback={<SectionFallback id="gallery" />}>
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
      </Suspense>

      <Suspense fallback={<SectionFallback id="contact" />}>
        <Contact />
      </Suspense>

      <Suspense fallback={null}>
        <Footer footer={footer} />
      </Suspense>

      {robotReady && (
        <Suspense fallback={
          <div
            className="fixed bottom-4 right-4 w-[110px] h-[110px] rounded-full bg-tan/10 animate-pulse"
            style={{ zIndex: 9999 }}
            aria-hidden
          />
        }>
          <EveRobot
            onClick={() => setIsChatOpen((prev) => !prev)}
            aria-label={isChatOpen ? 'Close chat' : 'Open chat with Gabriel'}
            chatOpen={isChatOpen}
          />
        </Suspense>
      )}

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
