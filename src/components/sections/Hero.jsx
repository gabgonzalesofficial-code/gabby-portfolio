import { useState, useEffect } from 'react'
import { PiDownloadLight } from 'react-icons/pi'
import { FaHeart, FaEnvelope, FaPhone, FaLinkedin } from 'react-icons/fa'

import { prefersReducedMotion } from '../../lib/motion'
import resumePDF from '../../assets/resume/Gabriel_Gonzales_Resume.pdf'

const HERO_SRC = '/hero.webp'
const HERO_COLOR_SRC = '/hero-color.webp'

export default function Hero({ profileInfo, onOpenDonation }) {
  // Scan sequence: pending → scanning → verified
  const [phase, setPhase] = useState(() =>
    prefersReducedMotion() ? 'verified' : 'pending'
  )
  // Hold the color portrait until the scan starts so it doesn't compete with LCP.
  const [loadColor, setLoadColor] = useState(() => prefersReducedMotion())

  useEffect(() => {
    if (prefersReducedMotion()) return
    const t1 = setTimeout(() => setPhase('scanning'), 1500)
    const t2 = setTimeout(() => setPhase('verified'), 4500)
    const tColor = setTimeout(() => setLoadColor(true), 800)
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(tColor) }
  }, [])

  // Dispatch events so the 3D robot reacts
  useEffect(() => {
    if (phase === 'scanning') window.dispatchEvent(new CustomEvent('eve-card-scan'))
    if (phase === 'verified') window.dispatchEvent(new CustomEvent('eve-card-verified'))
  }, [phase])

  const isVerified = phase === 'verified'
  const isScanning = phase === 'scanning'

  return (
    <section id="hero" className="relative h-dvh min-h-[640px] flex flex-col bg-black text-cream overflow-hidden">
      {/* Subtle radial glow behind portrait */}
      <div
        className="absolute top-[36%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[min(90vw,640px)] h-[min(90vw,640px)] rounded-full pointer-events-none"
        style={{
          background: 'radial-gradient(ellipse, rgba(142,22,22,0.22) 0%, rgba(142,22,22,0.08) 40%, transparent 72%)',
        }}
      />

      {/* Main hero content */}
      <div
        className="hero-stagger flex-1 flex flex-col items-center justify-start relative z-10 px-6 sm:px-12 lg:px-24 pt-12 sm:pt-14 pb-2 min-h-0"
      >
        {/* Name + portrait composition */}
        <div className="flex flex-col items-center w-full max-w-6xl">
          <h1 className="flex flex-col items-center w-full m-0">
            {/* First name — fully visible, never overlapped */}
            <span
              className="uppercase text-center leading-none select-none pointer-events-none"
              style={{
                fontFamily: "'Montserrat', sans-serif",
                fontSize: 'clamp(2.8rem, 9vw, 8rem)',
                fontWeight: 900,
                lineHeight: 0.92,
                color: '#F8FAFC',
                letterSpacing: '-0.03em',
              }}
            >
              Gabriel
            </span>

            {/* Last name + portrait — portrait overlaps only Gonzales */}
            <div className="relative flex justify-center w-full -mt-1 sm:-mt-2 pb-[24vh] lg:pb-[28vh]">
              <span
                className="uppercase text-center leading-none select-none pointer-events-none relative z-0"
                style={{
                  fontFamily: "'Montserrat', sans-serif",
                  fontSize: 'clamp(2.8rem, 9vw, 8rem)',
                  fontWeight: 900,
                  lineHeight: 0.92,
                  color: '#F8FAFC',
                  letterSpacing: '-0.03em',
                }}
              >
                Gonzales
              </span>

              <div className="absolute left-1/2 -translate-x-1/2 -top-[84px] z-10 w-[min(58vw,400px)] sm:w-[min(52vw,440px)] lg:w-[min(44vw,480px)]">
                {/* B&W portrait (LCP) — URL must match the <link rel="preload"> in index.html */}
                <img
                  src={HERO_SRC}
                  alt="Gabriel Gonzales"
                  width={768}
                  height={1376}
                  fetchPriority="high"
                  loading="eager"
                  decoding="async"
                  className="block w-full h-auto"
                  style={{
                    opacity: isVerified ? 0 : 1,
                    transition: 'opacity 0.7s ease-in-out',
                  }}
                />
                {/* Color portrait (after scan) — deferred so it doesn't contend with LCP */}
                {loadColor && (
                  <img
                    src={HERO_COLOR_SRC}
                    alt=""
                    aria-hidden
                    width={768}
                    height={1376}
                    loading="lazy"
                    fetchPriority="low"
                    decoding="async"
                    className="absolute top-0 left-0 block w-full h-auto"
                    style={{
                      opacity: isVerified ? 1 : 0,
                      transition: 'opacity 0.7s ease-in-out',
                    }}
                  />
                )}

                {/* Scan line overlay */}
                {isScanning && (
                  <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div
                      className="absolute left-0 w-full h-[2px]"
                      style={{
                        background: 'linear-gradient(90deg, transparent 0%, #8E1616 20%, #E8C999 50%, #8E1616 80%, transparent 100%)',
                        boxShadow: '0 0 15px rgba(142,22,22,0.5), 0 0 30px rgba(142,22,22,0.2)',
                        animation: 'heroScanLine 1.5s ease-in-out infinite',
                      }}
                    />
                  </div>
                )}
              </div>
            </div>
          </h1>

          {/* Intro text — overlaps only lower legs, not torso */}
          <p
            className="relative z-20 text-center max-w-xl mt-[calc(7vh*3.5)] px-2"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: 'clamp(0.8rem, 0.95vw, 0.95rem)',
              fontWeight: 400,
              lineHeight: 1.65,
              color: '#9CA3AF',
            }}
          >
            Building digital solutions that cut manual work and boost efficiency — specializing in custom WordPress websites and robust in-house tools.
          </p>
        </div>

        {/* CTA buttons — sit below portrait, no overlap */}
        <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mt-3 sm:mt-4 shrink-0">
          <a
            href="#projects"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.1em',
            }}
            className="px-6 py-2.5 sm:px-7 sm:py-3 rounded-full uppercase bg-accent text-cream shadow-[0_0_24px_rgba(142,22,22,0.45)] hover:shadow-[0_0_32px_rgba(142,22,22,0.6)] hover:-translate-y-0.5 transition-all duration-300 ease-out cursor-pointer"
          >
            View Work
          </a>
          <a
            href="#contact"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.1em',
            }}
            className="px-6 py-2.5 sm:px-7 sm:py-3 rounded-full uppercase border border-white/25 text-cream hover:border-white/50 hover:bg-white/5 hover:-translate-y-0.5 transition-all duration-300 ease-out cursor-pointer"
          >
            Get In Touch
          </a>
          <a
            href={resumePDF}
            download="Gabriel_Gonzales_Resume.pdf"
            style={{
              fontFamily: "var(--font-body)",
              fontSize: '12px',
              fontWeight: 500,
              letterSpacing: '0.1em',
            }}
            className="inline-flex items-center gap-1.5 px-6 py-2.5 sm:px-7 sm:py-3 rounded-full uppercase border border-white/25 text-cream hover:border-white/50 hover:bg-white/5 hover:-translate-y-0.5 transition-all duration-300 ease-out cursor-pointer"
          >
            <PiDownloadLight className="w-4 h-4" aria-hidden />
            Resume
          </a>
        </div>
      </div>

      {/* Bottom contact bar */}
      <div className="relative z-10 px-6 sm:px-12 lg:px-24 py-3 shrink-0">
        <div
          className="flex flex-wrap items-center justify-center gap-x-6 sm:gap-x-8 gap-y-2"
          style={{
            fontFamily: "var(--font-body)",
            fontSize: '12px',
            fontWeight: 500,
            color: '#A1A1AA',
          }}
        >
          <span className="flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            Available for Work
          </span>
          <a
            href={`mailto:${profileInfo.contact.email}`}
            className="flex items-center gap-2 hover:text-cream transition-colors duration-300 cursor-pointer"
          >
            <FaEnvelope className="w-3.5 h-3.5 opacity-50" aria-hidden />
            {profileInfo.contact.email}
          </a>
          <a
            href={`tel:${profileInfo.contact.mobile.replace(/\s/g, '')}`}
            className="flex items-center gap-2 hover:text-cream transition-colors duration-300 cursor-pointer"
          >
            <FaPhone className="w-3 h-3 opacity-50" aria-hidden />
            {profileInfo.contact.mobile}
          </a>
          <a
            href={profileInfo.contact.linkedin}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-2 hover:text-cream transition-colors duration-300 cursor-pointer"
          >
            <FaLinkedin className="w-3.5 h-3.5 opacity-50" aria-hidden />
            LinkedIn
          </a>
          <button onClick={onOpenDonation} className="flex items-center gap-2 hover:text-cream transition-colors duration-300 cursor-pointer">
            <FaHeart className="w-3 h-3 text-red-400" aria-hidden />
            Support
          </button>
        </div>
      </div>

      {/* Scan line + hero entrance (CSS so GSAP stays off the critical path) */}
      <style>{`
        @keyframes heroScanLine {
          0% { top: -2%; }
          100% { top: 102%; }
        }
        @media (prefers-reduced-motion: no-preference) {
          .hero-stagger > *:nth-child(2),
          .hero-stagger > *:nth-child(3) {
            animation: heroStaggerIn 0.5s ease-out both;
          }
          .hero-stagger > *:nth-child(2) { animation-delay: 0.08s; }
          .hero-stagger > *:nth-child(3) { animation-delay: 0.16s; }
        }
        @keyframes heroStaggerIn {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: none; }
        }
      `}</style>
    </section>
  )
}
