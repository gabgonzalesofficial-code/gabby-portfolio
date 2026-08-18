import { useState } from 'react'
import { useSectionTransition } from '../../hooks'

export default function Contact() {
  const [formStatus, setFormStatus] = useState({ type: '', message: '' })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const sectionRef = useSectionTransition()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setFormStatus({ type: '', message: '' })

    const formData = new FormData(e.target)

    try {
      const response = await fetch('https://formspree.io/f/mreenkwq', {
        method: 'POST',
        body: formData,
        headers: { Accept: 'application/json' },
      })

      if (response.ok) {
        setFormStatus({ type: 'success', message: 'Thank you! Your message has been sent successfully.' })
        e.target.reset()
      } else {
        const data = await response.json()
        throw new Error(data.error || 'Something went wrong')
      }
    } catch (error) {
      setFormStatus({ type: 'error', message: error.message || 'Failed to send message. Please try again.' })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <section id="contact" ref={sectionRef} className="min-h-screen bg-black text-cream px-6 sm:px-12 md:px-16 lg:px-24 py-20 sm:py-24">
      <div className="max-w-xl mx-auto">
        <h2
          className="gradient-text font-black uppercase leading-none tracking-tight text-center mb-10"
          style={{ fontSize: 'clamp(2rem, 4.5vw, 3.5rem)' }}
        >
          Let&apos;s Talk
        </h2>

        <form action="https://formspree.io/f/mreenkwq" method="POST" onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-cream/80 mb-1">
              Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="name"
              name="name"
              required
              className="w-full px-4 py-2.5 border border-tan/20 rounded-lg bg-cream/5 text-cream placeholder-tan/40 focus:outline-none focus:ring-2 focus:ring-tan focus:border-transparent transition-all duration-300 ease-out"
              placeholder="Your name"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm font-medium text-cream/80 mb-1">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              name="email"
              required
              className="w-full px-4 py-2.5 border border-tan/20 rounded-lg bg-cream/5 text-cream placeholder-tan/40 focus:outline-none focus:ring-2 focus:ring-tan focus:border-transparent transition-all duration-300 ease-out"
              placeholder="your.email@example.com"
            />
          </div>

          <div>
            <label htmlFor="subject" className="block text-sm font-medium text-cream/80 mb-1">
              Subject <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="subject"
              name="subject"
              required
              className="w-full px-4 py-2.5 border border-tan/20 rounded-lg bg-cream/5 text-cream placeholder-tan/40 focus:outline-none focus:ring-2 focus:ring-tan focus:border-transparent transition-all duration-300 ease-out"
              placeholder="What's this about?"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm font-medium text-cream/80 mb-1">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              id="message"
              name="message"
              rows={5}
              required
              className="w-full px-4 py-2.5 border border-tan/20 rounded-lg bg-cream/5 text-cream placeholder-tan/40 focus:outline-none focus:ring-2 focus:ring-tan focus:border-transparent transition-all duration-300 ease-out resize-none"
              placeholder="Your message here..."
            />
          </div>

          {formStatus.message && (
            <div
              className={`p-3 rounded-lg border ${formStatus.type === 'success'
                  ? 'bg-green-900/20 text-green-300 border-green-800'
                  : 'bg-red-900/20 text-red-300 border-red-800'
                }`}
            >
              <p className="text-sm">{formStatus.message}</p>
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3.5 px-4 rounded-full font-medium uppercase tracking-widest text-sm transition-all duration-300 ease-out cursor-pointer ${isSubmitting ? 'bg-tan/10 text-tan/40 cursor-not-allowed' : 'bg-accent text-cream hover:opacity-90'
              }`}
          >
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </section>
  )
}
