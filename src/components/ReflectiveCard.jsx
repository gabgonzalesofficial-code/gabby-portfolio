import { useEffect, useState } from 'react'
import './ReflectiveCard.css'
import { FaFingerprint, FaWaveSquare, FaLock } from 'react-icons/fa'
import { prefersReducedMotion } from '../lib/motion'

// Adapted from the React Bits ReflectiveCard — swaps the live webcam feed
// for a static photo (no camera permission needed) run through the same
// metallic/glass sheen and noise layers.
//
// On load it plays a short ID-card verification sequence: a scan line sweeps
// the card, the status LED goes red → green, and the badge flips from
// "VERIFYING…" to "VERIFIED". The moments are broadcast as window events
// ('eve-card-scan' / 'eve-card-verified') so the chat robot can turn and react.
const ReflectiveCard = ({
  photo,
  name,
  badge = 'VERIFIED',
  metaLabel = 'BASED IN',
  metaValue = '',
  blurStrength = 6,
  color = 'white',
  metalness = 1,
  roughness = 0.4,
  overlayColor = 'rgba(0, 0, 0, 0.35)',
  grayscale = 0.3,
  scanOnLoad = true,
  startDelay = 1500,
  scanDuration = 3000,
  className = '',
  style = {},
}) => {
  const saturation = 1 - Math.max(0, Math.min(1, grayscale))
  // 'pending' | 'scanning' | 'verified' — skips straight to verified for
  // reduced-motion users or when the scan is disabled.
  const [phase, setPhase] = useState(() => (scanOnLoad && !prefersReducedMotion() ? 'pending' : 'verified'))

  // Pending → scanning → verified, driven by timers so the CSS scan line and
  // LED pulses line up with the state changes.
  useEffect(() => {
    if (!scanOnLoad || prefersReducedMotion()) return
    const t1 = setTimeout(() => setPhase('scanning'), startDelay)
    const t2 = setTimeout(() => setPhase('verified'), startDelay + scanDuration)
    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
    }
  }, [scanOnLoad, startDelay, scanDuration])

  // Broadcast the sequence moments so the robot avatar can turn and react.
  useEffect(() => {
    if (phase === 'scanning') window.dispatchEvent(new CustomEvent('eve-card-scan'))
    if (phase === 'verified') window.dispatchEvent(new CustomEvent('eve-card-verified'))
  }, [phase])

  const verified = phase === 'verified'
  const scanning = phase === 'scanning'

  const cssVariables = {
    '--blur-strength': `${blurStrength}px`,
    '--metalness': metalness,
    '--roughness': roughness,
    '--overlay-color': overlayColor,
    '--text-color': color,
    '--saturation': saturation,
  }

  return (
    <div className={`reflective-card-container ${className}`} style={{ ...style, ...cssVariables }}>
      <img src={photo} alt={name} className="reflective-video" draggable={false} fetchPriority="high" width="320" height="500" />

      <div className="reflective-noise" />
      <div className="reflective-sheen" />

      {/* ID scan sequence */}
      <div className={`card-scan-line${scanning ? ' card-scan-line--active' : ''}`} />
      <div className={`card-verified-flash${verified ? ' card-verified-flash--active' : ''}`} />

      <div className="reflective-border" />

      <div className="reflective-content">
        <div className="card-header">
          <div className="security-badge">
            <FaLock size={12} className="security-icon" />
            <span>{verified ? badge : 'VERIFYING…'}</span>
          </div>
          <FaWaveSquare
            className={`status-icon ${
              verified ? 'status-icon--active' : scanning ? 'status-icon--scanning' : 'status-icon--unverified'
            }`}
            size={18}
          />
        </div>

        <div className="card-footer">
          <div className="id-section">
            <span className="label">{metaLabel}</span>
            <span className="value">{metaValue}</span>
          </div>
          <div className="fingerprint-section">
            <FaFingerprint size={28} className="fingerprint-icon" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ReflectiveCard
