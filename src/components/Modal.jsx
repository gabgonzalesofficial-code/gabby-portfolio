import { useEffect } from 'react'

function Modal({ isOpen, onClose, title, children, size = 'md', bodyScroll = true }) {
  const isFullscreen = size === 'fullscreen'

  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) onClose()
    }
    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleEscape)
      document.body.style.overflow = 'unset'
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  const sizeClasses = {
    sm: 'max-w-md',
    md: 'max-w-2xl',
    lg: 'max-w-4xl',
    xl: 'max-w-6xl',
    full: 'max-w-full mx-4',
    fullscreen: 'max-w-full w-full h-full mx-0 my-0 rounded-none'
  }

  return (
    <div
      className={`fixed inset-0 z-[10010] flex items-center justify-center cursor-pointer ${isFullscreen ? 'p-0' : 'p-4'}`}
      onClick={onClose}
    >
      <div className={`absolute inset-0 ${isFullscreen ? 'bg-black/80' : 'bg-black/50 backdrop-blur-sm'}`}></div>

      {isFullscreen && (
        <button
          onClick={onClose}
          className="fixed top-5 right-5 z-[10020] w-10 h-10 flex items-center justify-center rounded-full bg-black/60 hover:bg-black/80 backdrop-blur-sm border border-tan/20 text-tan/70 hover:text-cream transition-colors cursor-pointer"
          aria-label="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      )}

      <div
        className={`modal-panel relative bg-[#0A0A0A] border border-tan/20 rounded-lg shadow-xl w-full ${sizeClasses[size]} ${isFullscreen ? '' : 'max-h-[90vh]'} overflow-hidden flex flex-col`}
        onClick={(e) => e.stopPropagation()}
      >
        {!isFullscreen && title && (
          <div className="flex items-center justify-between p-6 border-b border-tan/15">
            <h2 className="text-2xl font-bold text-cream">{title}</h2>
            <button onClick={onClose} className="text-tan/50 hover:text-cream transition p-1 rounded-lg hover:bg-cream/10 cursor-pointer" aria-label="Close modal">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}
        <div className={`flex-1 min-h-0 flex flex-col ${isFullscreen ? 'p-6' : ''} ${bodyScroll !== false ? 'overflow-y-auto' : 'overflow-hidden'}`}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Modal
