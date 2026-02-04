import { useState, useEffect } from 'react'
import './App.css'
import Modal from './components/Modal'
import TechIcon from './components/TechIcon'
import ChatBot from './components/ChatBot'
import { PiDownloadLight } from 'react-icons/pi'
import resumePDF from './assets/resume/Gabriel_Gonzales_Resume.pdf'
import {
  profileInfo,
  aboutContent,
  techStack,
  beyondCoding,
  certifications,
  memberships,
  galleryImages,
  experience,
  projects,
  recommendations,
  socialLinks,
  speaking,
  contactInfo,
  footer
} from './data/profileData'

function App() {
  const [galleryIndex, setGalleryIndex] = useState(0)
  const [recommendationIndex, setRecommendationIndex] = useState(0)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalContent, setModalContent] = useState({ title: '', content: null })
  const [isDarkMode, setIsDarkMode] = useState(false)
  const [formStatus, setFormStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [selectedCertificate, setSelectedCertificate] = useState(null)

  // Get recent certifications (first 4)
  const recentCertifications = certifications.slice(0, 4)

  // Initialize and apply dark mode
  useEffect(() => {
    // Check localStorage
    const saved = localStorage.getItem('darkMode')
    const shouldBeDark = saved === 'true'

    setIsDarkMode(shouldBeDark)

    // Apply class to html element
    if (shouldBeDark) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [])

  // Update when state changes
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('darkMode', isDarkMode.toString())
  }, [isDarkMode])

  // Auto-transition recommendations
  useEffect(() => {
    if (recommendations.length <= 1) return

    const interval = setInterval(() => {
      setRecommendationIndex((prev) => (prev < recommendations.length - 1 ? prev + 1 : 0))
    }, 5000) // Change every 5 seconds

    return () => clearInterval(interval)
  }, [recommendations.length])

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode)
  }


  return (
    <div className="min-h-screen bg-white dark:bg-gray-900">
      {/* Header Section */}
      <header className="max-w-7xl mx-auto px-4 py-8">
        {/* Dark Mode Toggle - Top Right */}
        <div className="flex justify-end mb-4">
          <button
            onClick={toggleDarkMode}
            className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
            aria-label="Toggle dark mode"
            title={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
          >
            {isDarkMode ? (
              // Sun Icon (for light mode)
              <svg className="w-5 h-5 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
            ) : (
              // Moon Icon (for dark mode)
              <svg className="w-5 h-5 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
              </svg>
            )}
          </button>
        </div>

        <div className="flex flex-col lg:flex-row items-start gap-6">
          {/* Profile Picture */}
          <div className="flex-shrink-0">
            <img
              src={profileInfo.profileImage}
              alt="Profile"
              className="w-28 h-28 lg:w-32 lg:h-32 rounded-full object-cover border-2 border-gray-200 dark:border-gray-700"
            />
          </div>

          {/* Name and Title */}
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1.5">
              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white">{profileInfo.name}</h1>
              {profileInfo.verified && (
                <svg className="w-5 h-5 text-blue-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6.267 3.455a3.066 3.066 0 001.745-.723 3.066 3.066 0 013.976 0 3.066 3.066 0 001.745.723 3.066 3.066 0 012.812 2.812c.051.643.304 1.254.723 1.745a3.066 3.066 0 010 3.976 3.066 3.066 0 00-.723 1.745 3.066 3.066 0 01-2.812 2.812 3.066 3.066 0 00-1.745.723 3.066 3.066 0 01-3.976 0 3.066 3.066 0 00-1.745-.723 3.066 3.066 0 01-2.812-2.812 3.066 3.066 0 00-.723-1.745 3.066 3.066 0 010-3.976 3.066 3.066 0 00.723-1.745 3.066 3.066 0 012.812-2.812zm7.44 5.252a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              )}
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-1.5">{profileInfo.location}</p>
            <p className="text-lg text-gray-800 dark:text-gray-200 font-medium mb-3">{profileInfo.title}</p>
            <a
              href={resumePDF}
              download="Gabriel_Gonzales_Resume.pdf"
              className="inline-flex items-center gap-1.5 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors cursor-pointer"
            >
              <PiDownloadLight className="w-4 h-4" />
              <span>Download Resume</span>
            </a>
          </div>

          {/* Contact Details */}
          <div className="flex-shrink-0 lg:ml-auto">
            <div className="space-y-3">
              {/* Email */}
              <a
                href={`mailto:${profileInfo.contact.email}`}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition cursor-pointer"
              >
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <span className="text-sm">{profileInfo.contact.email}</span>
              </a>

              {/* Mobile */}
              <a
                href={`tel:${profileInfo.contact.mobile.replace(/\s/g, '')}`}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition cursor-pointer"
              >
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <span className="text-sm">{profileInfo.contact.mobile}</span>
              </a>

              {/* LinkedIn */}
              <a
                href={profileInfo.contact.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer"
              >
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                </svg>
                <span className="text-sm">LinkedIn Profile</span>
              </a>

              {/* Donation Button */}
              <button
                onClick={() => {
                  setModalContent({
                    title: 'Support My Work',
                    content: (
                      <div className="space-y-4">
                        <p className="text-gray-700 dark:text-gray-300 text-center">{profileInfo.donation.message}</p>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                          {/* GCash – left column */}
                          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-900/20 dark:to-green-900/20">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center shadow-sm">
                              <svg className="w-6 h-6 text-green-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
                              </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">GCash</h3>
                          </div>
                          <div className="space-y-2">
                            <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Mobile Number:</span>
                              <div className="flex items-center gap-2">
                                <span className="font-mono font-semibold text-gray-900 dark:text-white">{profileInfo.donation.gcash.number}</span>
                                <button
                                  onClick={() => {
                                    navigator.clipboard.writeText(profileInfo.donation.gcash.number)
                                    alert('GCash number copied to clipboard!')
                                  }}
                                  className="text-blue-600 hover:text-blue-700 cursor-pointer"
                                  title="Copy number"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                                  </svg>
                                </button>
                              </div>
                            </div>
                            <div className="flex items-center justify-between bg-white dark:bg-gray-800 rounded-lg p-3">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Account Name:</span>
                              <span className="font-semibold text-gray-900 dark:text-white">{profileInfo.donation.gcash.name}</span>
                            </div>
                            <a
                              href={`gcash://pay?number=${profileInfo.donation.gcash.number.replace(/\s/g, '')}`}
                              className="block w-full bg-green-600 hover:bg-green-700 text-white text-center py-2 px-4 rounded-lg transition cursor-pointer font-medium"
                            >
                              Open GCash App
                            </a>
                          </div>
                          </div>

                          {/* PayPal – right column */}
                          <div className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                          <div className="flex items-center gap-3 mb-3">
                            <div className="w-10 h-10 bg-white dark:bg-gray-700 rounded-lg flex items-center justify-center shadow-sm">
                              <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M7.076 21.337H2.47a.641.641 0 0 1-.633-.74L4.944.901C5.026.382 5.474 0 5.998 0h7.46c2.57 0 4.578.543 5.69 1.81 1.01 1.15 1.304 2.42 1.012 4.287-.023.143-.047.288-.077.437-.983 5.05-4.13 6.537-6.983 6.537h-2.87c-.748 0-1.127.363-1.305.838l-1.17 3.279a1.098 1.098 0 0 1-.104.24.327.327 0 0 1-.112.12c-.04.025-.092.041-.148.041H9.43a.582.582 0 0 1-.536-.352L7.077 21.337zm1.461-13.966c-.073.01-.145.026-.213.05-.07.023-.14.05-.2.08-.06.03-.11.064-.15.1-.04.038-.07.08-.09.13-.02.05-.03.1-.03.15v.12l.57 3.074.04.2c.01.05.03.09.06.13.03.04.07.07.11.09.05.02.1.03.15.03h2.85c.08 0 .15-.01.2-.04.05-.02.1-.05.13-.1l.06-.1.38-2.28.04-.2c0-.05-.01-.1-.03-.15-.02-.05-.05-.09-.09-.13-.04-.04-.09-.07-.15-.1a1.26 1.26 0 0 0-.2-.08 1.2 1.2 0 0 0-.21-.05h-2.73z" />
                              </svg>
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">PayPal</h3>
                          </div>
                          <div className="space-y-3">
                            <div className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-lg p-3">
                              <span className="text-sm text-gray-600 dark:text-gray-400">Email:</span>
                              <span className="font-semibold text-gray-900 dark:text-white">{profileInfo.donation.paypal.email}</span>
                            </div>
                            <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">Quick amounts:</p>
                            <div className="grid grid-cols-3 gap-2 mb-3">
                              {profileInfo.donation.paypal.defaultAmounts.map((amount) => (
                                <a
                                  key={amount}
                                  href={`${profileInfo.donation.paypal.link}/${amount}${profileInfo.donation.paypal.currency}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="px-3 py-2 rounded-lg border-2 border-gray-200 dark:border-gray-600 hover:border-blue-500 dark:hover:border-blue-400 text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 transition cursor-pointer font-medium text-center text-sm"
                                >
                                  ₱{amount.toLocaleString()}
                                </a>
                              ))}
                            </div>
                            <a
                              href={profileInfo.donation.paypal.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="block w-full bg-blue-600 hover:bg-blue-700 text-white text-center py-2 px-4 rounded-lg transition cursor-pointer font-medium"
                            >
                              Donate via PayPal (Custom Amount)
                            </a>
                            <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                              Accepts credit/debit cards and PayPal balance
                            </p>
                          </div>
                          </div>
                        </div>
                      </div>
                    )
                  })
                  setIsModalOpen(true)
                }}
                className="flex items-center gap-2 text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition cursor-pointer mt-4 pt-4 border-t border-gray-200 dark:border-gray-700"
              >
                <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-sm font-medium">Support My Work</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content - Two Column Layout */}
      <main className="max-w-7xl mx-auto px-4 pb-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Column */}
          <div className="space-y-8">
            {/* About Section */}
            <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">About</h2>
              </div>
              <div className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed text-justify">
                {aboutContent.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </section>

            {/* Tech Stack Section */}
            <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 12h14M5 12a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v4a2 2 0 01-2 2M5 12a2 2 0 00-2 2v4a2 2 0 002 2h14a2 2 0 002-2v-4a2 2 0 00-2-2m-2-4h.01M17 16h.01" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Tech Stack</h2>
              </div>
              <div className="space-y-4">
                {Object.entries(techStack).map(([category, techs]) => (
                  <div key={category}>
                    <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-3 capitalize text-lg">
                      {category === 'frontend' ? 'Frontend' :
                        category === 'backend' ? 'Backend' :
                          category === 'database' ? 'Database' :
                            category === 'crmCms' ? 'CRM/CMS' :
                              category === 'automation' ? 'Automation & Testing' :
                                category === 'tools' ? 'Tools & Version Control' :
                                  category === 'aiTools' ? 'AI Tools' :
                                    category === 'gameDev' ? 'Game Development' :
                                      category}
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {techs.map((tech, idx) => (
                        <span
                          key={idx}
                          className="flex items-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-800 dark:text-gray-200 px-3 py-2 rounded-md text-sm transition cursor-default"
                          title={tech.description ? `${tech.name} - ${tech.description}` : tech.name}
                        >
                          <TechIcon name={tech.icon} className="w-4 h-4" />
                          <span>{tech.name}</span>
                          {tech.description && (
                            <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">({tech.description})</span>
                          )}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Beyond Coding Section */}
            <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Beyond Coding</h2>
              </div>
              <div className="space-y-3 text-gray-700 dark:text-gray-300 leading-relaxed">
                {beyondCoding.map((paragraph, idx) => (
                  <p key={idx}>{paragraph}</p>
                ))}
              </div>
            </section>

            {/* Recent Certifications Section */}
            <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                  </svg>
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Certifications</h2>
                </div>
                <button
                  onClick={() => {
                    setSelectedCertificate(null)
                    setModalContent({
                      title: 'All Certifications',
                      content: null
                    })
                    setIsModalOpen(true)
                  }}
                  className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 text-sm font-medium transition cursor-pointer"
                >
                  View All
                </button>
              </div>
              <ul className="space-y-2">
                {recentCertifications.map((cert) => (
                  <li key={cert.id} className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                    <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    {cert.name}
                  </li>
                ))}
              </ul>
            </section>

            {/* A member of Section
            <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">A member of</h2>
              </div>
              <ul className="space-y-3">
                {memberships.map((org) => (
                  <li key={org.id} className="flex items-center justify-between text-gray-700 dark:text-gray-300">
                    <span>{org.name}</span>
                    <a href={org.url} target="_blank" rel="noopener noreferrer" className="cursor-pointer">
                      <svg className="w-5 h-5 text-gray-500 dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </li>
                ))}
              </ul>
            </section>
 */}
            {/* Gallery Section */}
            <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Gallery</h2>
              </div>
              <div className="relative">
                <div className="flex overflow-hidden rounded-lg">
                  {galleryImages.map((img, idx) => (
                    <div
                      key={img.id}
                      className={`flex-shrink-0 w-full transition-transform duration-300 ${idx === galleryIndex ? 'block' : 'hidden'
                        }`}
                    >
                      <img
                        src={img.src}
                        alt={img.alt}
                        className="w-full h-64 object-cover rounded-lg"
                      />
                    </div>
                  ))}
                </div>
                <button
                  onClick={() => setGalleryIndex((prev) => (prev > 0 ? prev - 1 : galleryImages.length - 1))}
                  className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/80 dark:bg-gray-800/80 hover:bg-white dark:hover:bg-gray-800 p-2 rounded-full shadow-lg cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={() => setGalleryIndex((prev) => (prev < galleryImages.length - 1 ? prev + 1 : 0))}
                  className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/80 hover:bg-white p-2 rounded-full shadow-lg cursor-pointer"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <div className="flex justify-center gap-2 mt-4">
                {galleryImages.map((img, idx) => (
                  <button
                    key={img.id}
                    onClick={() => setGalleryIndex(idx)}
                    className={`w-2 h-2 rounded-full cursor-pointer ${idx === galleryIndex ? 'bg-gray-900 dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'
                      }`}
                  />
                ))}
              </div>
            </section>
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            {/* Experience Section */}
            <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Experience</h2>
              </div>
              <div className="relative">
                {/* Vertical line */}
                <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>

                {/* Timeline items */}
                <div className="space-y-6">
                  {experience.map((exp) => (
                    <div key={exp.id} className="relative pl-10">
                      {/* Node (dot) */}
                      <div className={`absolute left-3 top-1 w-3 h-3 
                        ${exp === experience[0] ? 'bg-red-900' : 'bg-gray-900'} 
                        dark:${exp === experience[0] ? 'bg-red-100' : 'bg-white'}  rounded-full border-2 border-white dark:border-gray-800 shadow-sm`}></div>

                      {/* Content */}
                      <div className="pb-4 last:pb-0">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{exp.role}</h3>
                        <p className="text-gray-600 dark:text-gray-300 text-sm">{exp.company}</p>
                        <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{exp.year}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Recent Projects Section */}
            <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recent Projects</h2>
              </div>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:border-gray-300 dark:hover:border-gray-600 transition">
                    <h3 className="font-semibold text-gray-900 dark:text-white mb-1">{project.name}</h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-2">{project.description}</p>
                    <a href={`${project.url}`} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 text-sm hover:underline flex items-center gap-1 cursor-pointer">
                      {project.url}
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                    </a>
                  </div>
                ))}
              </div>
            </section>

            {/* Recommendations Section */}
            <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Recommendations</h2>
              </div>
              <div className="space-y-4">
                <div className="relative min-h-[180px] max-h-[180px]">
                  {recommendations.map((rec, idx) => {
                    const isActive = idx === recommendationIndex
                    const shouldTruncate = rec.quote.length > 300
                    const truncatedQuote = shouldTruncate ? rec.quote.substring(0, 300) + '...' : rec.quote

                    return (
                      <div
                        key={rec.id}
                        className={`transition-opacity duration-500 absolute inset-0 ${isActive ? 'opacity-100' : 'opacity-0 pointer-events-none'
                          }`}
                      >
                        <blockquote
                          className={`text-gray-700 dark:text-gray-300 italic border-l-4 border-gray-300 dark:border-gray-600 pl-4 ${shouldTruncate ? 'cursor-pointer hover:text-gray-900 dark:hover:text-gray-100' : ''
                            }`}
                          onClick={shouldTruncate ? () => {
                            setModalContent({
                              title: 'Recommendation',
                              content: (
                                <div className="space-y-4">
                                  <blockquote className="text-gray-700 dark:text-gray-300 italic border-l-4 border-gray-300 dark:border-gray-600 pl-4 text-lg">
                                    "{rec.quote}"
                                  </blockquote>
                                  <p className="text-gray-600 dark:text-gray-400">
                                    — <span className="font-semibold">{rec.author}</span>, {rec.position}
                                  </p>
                                </div>
                              )
                            })
                            setIsModalOpen(true)
                          } : undefined}
                          title={shouldTruncate ? 'Click to read full recommendation' : ''}
                        >
                          "{truncatedQuote}"
                        </blockquote>
                        <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
                          — <span className="font-semibold">{rec.author}</span>, {rec.position}
                        </p>
                      </div>
                    )
                  })}
                </div>

                {/* Indicator Dots */}
                {recommendations.length > 1 && (
                  <div className="flex gap-1 justify-center pt-2">
                    {recommendations.map((rec, idx) => (
                      <button
                        key={rec.id}
                        onClick={() => setRecommendationIndex(idx)}
                        className={`w-2 h-2 rounded-full cursor-pointer transition ${idx === recommendationIndex ? 'bg-gray-900 dark:bg-white' : 'bg-gray-300 dark:bg-gray-600'
                          }`}
                        aria-label={`Go to recommendation ${idx + 1}`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </section>

            {/* Contact Form Section */}
            <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6 shadow-sm hover:shadow-md transition-all duration-300">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Get In Touch</h2>
              </div>

              <form
                action="https://formspree.io/f/mreenkwq"
                method="POST"
                onSubmit={async (e) => {
                  e.preventDefault()
                  setIsSubmitting(true)
                  setFormStatus({ type: '', message: '' })

                  const formData = new FormData(e.target)

                  try {
                    const response = await fetch('https://formspree.io/f/mreenkwq', {
                      method: 'POST',
                      body: formData,
                      headers: {
                        'Accept': 'application/json'
                      }
                    })

                    if (response.ok) {
                      setFormStatus({
                        type: 'success',
                        message: 'Thank you! Your message has been sent successfully.'
                      })
                      e.target.reset()
                    } else {
                      const data = await response.json()
                      throw new Error(data.error || 'Something went wrong')
                    }
                  } catch (error) {
                    setFormStatus({
                      type: 'error',
                      message: error.message || 'Failed to send message. Please try again.'
                    })
                  } finally {
                    setIsSubmitting(false)
                  }
                }}
                className="space-y-4"
              >
                {/* Name Field */}
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="Your name"
                  />
                </div>

                {/* Email Field */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="your.email@example.com"
                  />
                </div>

                {/* Subject Field */}
                <div>
                  <label htmlFor="subject" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Subject <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    id="subject"
                    name="subject"
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition"
                    placeholder="What's this about?"
                  />
                </div>

                {/* Message Field */}
                <div>
                  <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Message <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    id="message"
                    name="message"
                    rows={5}
                    required
                    className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition resize-none"
                    placeholder="Your message here..."
                  ></textarea>
                </div>

                {/* Status Message */}
                {formStatus.message && (
                  <div className={`p-3 rounded-lg ${formStatus.type === 'success'
                    ? 'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-300 border border-green-200 dark:border-green-800'
                    : 'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-300 border border-red-200 dark:border-red-800'
                    }`}>
                    <p className="text-sm">{formStatus.message}</p>
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-3 px-4 rounded-lg font-medium transition cursor-pointer ${isSubmitting
                    ? 'bg-gray-400 dark:bg-blue-600 text-gray-200 cursor-not-allowed'
                    : 'bg-gray-900 dark:bg-blue-700 hover:bg-gray-800 dark:hover:bg-gray-600 text-white'
                    }`}
                >
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </section>

            {/* Social Links Section 
            <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900">Social Links</h2>
              </div>
              <div className="space-y-3">
                {socialLinks.map((social) => (
                  <a
                    key={social.id}
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 text-gray-700 hover:text-gray-900 transition p-2 rounded-lg hover:bg-gray-50"
                  >
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z" />
                    </svg>
                    <span className="font-medium">{social.name}</span>
                  </a>
                ))}
              </div>
            </section>
*/}
            {/* Speaking Section 
            <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <div className="flex items-center gap-3 mb-4">
                <svg className="w-6 h-6 text-gray-700 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                </svg>
                <h2 className="text-2xl font-bold text-gray-900">Speaking</h2>
              </div>
              <p className="text-gray-700 mb-4">
                {speaking.description}
              </p>
              <button className="flex items-center gap-2 text-gray-900 font-medium hover:text-gray-700 transition">
                {speaking.ctaText}
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
        </button>
            </section>*/}

            {/* Contact Section 
            <section className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Contact</h2>
              <div className="space-y-4">
                <div className="flex items-center gap-3 text-gray-700">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span>{contactInfo.email}</span>
                </div>
                <a href={contactInfo.scheduleCall} className="flex items-center gap-2 text-gray-900 font-medium hover:text-gray-700 transition w-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  Schedule a Call
                  <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
                <a href={contactInfo.joinDiscussion} className="flex items-center gap-2 text-gray-900 font-medium hover:text-gray-700 transition w-full">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  Join Discussion
                  <svg className="w-4 h-4 ml-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>
            </section>
            */}
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-6 border-t border-gray-200 dark:border-gray-700">
        <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
          {footer.copyright}
        </p>
      </footer>

      {/* Floating Chat Button */}
      {!isChatOpen && (
        <button
          onClick={() => setIsChatOpen(true)}
          className="fixed bottom-6 right-6 bg-gray-900 dark:bg-gray-800 text-white dark:text-gray-100 px-6 py-3 rounded-lg shadow-lg hover:bg-gray-800 dark:hover:bg-gray-700 transition flex items-center gap-2 z-50 cursor-pointer animate-bounce"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
          </svg>
          Chat with Me
        </button>
      )}

      {/* ChatBot Component */}
      <ChatBot isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} />

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false)
          setSelectedCertificate(null)
        }}
        title={modalContent.title}
        size={selectedCertificate ? "xl" : "lg"}
        bodyScroll={modalContent.title !== 'All Certifications'}
      >
        {modalContent.title === 'All Certifications' ? (
          <div className="flex gap-6 flex-1 min-h-0" style={{ minHeight: '400px' }}>
            {/* Left side - Certificate List */}
            <div className={`${selectedCertificate ? 'w-1/2' : 'w-full'} min-h-0 overflow-y-auto pr-2 flex-shrink-0`}>
              <div className="space-y-3 pb-4">
                {certifications.map((cert) => (
                  <div
                    key={cert.id}
                    onClick={() => setSelectedCertificate(cert)}
                    className={`flex items-start gap-3 p-4 border rounded-lg transition cursor-pointer ${selectedCertificate?.id === cert.id
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400'
                      : 'border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700'
                      }`}
                  >
                    <svg className="w-6 h-6 text-green-500 flex-shrink-0 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{cert.name}</h3>
                      <p className="text-gray-600 dark:text-gray-300 text-sm">{cert.issuer}</p>
                      <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">{cert.year}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right side - Certificate Preview */}
            {selectedCertificate && (
              <div className="w-1/2 border-l border-gray-200 dark:border-gray-700 pl-6 pr-6 flex flex-col flex-shrink-0 min-h-0">
                <div className="flex flex-col min-h-0 flex-1">
                  <div className="flex-shrink-0 mb-4">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      {selectedCertificate.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-1">
                      {selectedCertificate.issuer}
                    </p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mb-4">
                      {selectedCertificate.year}
                    </p>
                  </div>
                  {selectedCertificate.image ? (
                    <div className="flex-1 overflow-y-auto pr-2">
                      <img
                        src={selectedCertificate.image}
                        alt={selectedCertificate.name}
                        className="w-full h-auto rounded-lg shadow-lg border border-gray-200 dark:border-gray-700"
                        style={{ maxWidth: '100%', objectFit: 'contain' }}
                      />
                    </div>
                  ) : (
                    <div className="mt-4 p-8 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800 text-center">
                      <p className="text-gray-500 dark:text-gray-400">
                        Certificate preview not available
                      </p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        ) : (
          modalContent.content
        )}
      </Modal>
    </div>
  )
}

export default App
