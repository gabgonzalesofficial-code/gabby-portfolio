import { PiDownloadLight } from 'react-icons/pi'
import { FaHeart, FaEnvelope, FaPhone, FaLinkedin } from 'react-icons/fa'

import ReflectiveCard from '../ReflectiveCard'
import { useStaggerReveal } from '../../hooks'
import resumePDF from '../../assets/resume/Gabriel_Gonzales_Resume.pdf'

export default function Hero({ profileInfo, onOpenDonation }) {
  const contentRef = useStaggerReveal({ y: 24 })

  return (
    <section id="hero" className="min-h-screen flex flex-col bg-black text-cream overflow-hidden">
      <div
        ref={contentRef}
        className="flex-1 flex flex-col lg:flex-row items-center gap-12 lg:gap-16 pl-6 sm:pl-12 md:pl-16 lg:pl-24 pr-6 sm:pr-12 md:pr-16 lg:pr-24 xl:pr-40 pt-16 sm:pt-20 pb-12"
      >
        <div className="flex-1 flex flex-col gap-8 min-w-0">
          <div>
            <p
              className="uppercase mb-4"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: '14px',
                fontWeight: 500,
                letterSpacing: '0.08em',
                color: '#A1A1AA',
              }}
            >
              {profileInfo.title}
            </p>
            <h1
              className="uppercase"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 'clamp(3.5rem, 7vw, 5rem)',
                fontWeight: 800,
                lineHeight: 0.98,
                color: '#F8FAFC',
                letterSpacing: '-0.03em',
              }}
            >
              {profileInfo.name}
            </h1>
          </div>

          <p
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 'clamp(1rem, 1.2vw, 1.125rem)',
              fontWeight: 400,
              lineHeight: 1.6,
              color: '#9CA3AF',
              maxWidth: '32rem',
            }}
          >
            Building digital solutions that cut manual work and boost efficiency — specializing in custom WordPress websites and robust in-house tools.
          </p>

          <div className="flex flex-wrap gap-3">
            <a
              href="#projects"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: '14px',
                fontWeight: 600,
              }}
              className="px-6 py-3 rounded-full uppercase tracking-widest bg-accent text-cream shadow-lg shadow-accent/25 hover:shadow-xl hover:shadow-accent/40 hover:-translate-y-0.5 transition-all duration-300 ease-out cursor-pointer"
            >
              View Work
            </a>
            <a
              href="#contact"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: '14px',
                fontWeight: 500,
              }}
              className="px-6 py-3 rounded-full uppercase tracking-widest border border-cream/30 text-cream hover:border-cream/60 hover:bg-cream/10 hover:-translate-y-0.5 transition-all duration-300 ease-out cursor-pointer"
            >
              Get In Touch
            </a>
            <a
              href={resumePDF}
              download="Gabriel_Gonzales_Resume.pdf"
              style={{
                fontFamily: "var(--font-body)",
                fontSize: '14px',
                fontWeight: 500,
              }}
              className="inline-flex items-center gap-1.5 px-6 py-3 rounded-full uppercase tracking-widest border border-cream/30 text-cream hover:border-cream/60 hover:bg-cream/10 hover:-translate-y-0.5 transition-all duration-300 ease-out cursor-pointer"
            >
              <PiDownloadLight className="w-4 h-4" />
              Resume
            </a>
          </div>

          <div
            className="flex flex-wrap items-center gap-x-8 gap-y-3"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: '14px',
              fontWeight: 500,
              color: '#A1A1AA',
            }}
          >
            <a
              href={`mailto:${profileInfo.contact.email}`}
              className="flex items-center gap-2 hover:text-cream transition-colors duration-300 cursor-pointer"
            >
              <FaEnvelope className="w-4 h-4 opacity-50" aria-hidden />
              {profileInfo.contact.email}
            </a>
            <a
              href={`tel:${profileInfo.contact.mobile.replace(/\s/g, '')}`}
              className="flex items-center gap-2 hover:text-cream transition-colors duration-300 cursor-pointer"
            >
              <FaPhone className="w-3.5 h-3.5 opacity-50" aria-hidden />
              {profileInfo.contact.mobile}
            </a>
            <a
              href={profileInfo.contact.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-cream transition-colors duration-300 cursor-pointer"
            >
              <FaLinkedin className="w-4 h-4 opacity-50" aria-hidden />
              LinkedIn Profile
            </a>
            <button onClick={onOpenDonation} className="flex items-center gap-2 hover:text-cream transition-colors duration-300 cursor-pointer">
              <FaHeart className="w-3.5 h-3.5 text-red-400" aria-hidden />
              Support My Work
            </button>
          </div>
        </div>

        <div className="flex-shrink-0">
          <ReflectiveCard
              photo={profileInfo.profileImage}
              name={profileInfo.name}
              metaValue={profileInfo.location}
              blurStrength={0}
              roughness={0.08}
              className="w-[190px] sm:w-[215px] md:w-[240px]"
              style={{ height: 'auto', aspectRatio: '320 / 500' }}
          />
        </div>
      </div>
    </section>
  )
}
