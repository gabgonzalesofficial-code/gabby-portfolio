import './Loader.css'

const STEP_LABELS = {
  idle: 'Access portfolio',
  initializing: 'Initializing',
  requesting: 'Requesting Access',
  granted: 'Access Granted',
  exiting: 'Access Granted',
}

export default function Loader({ step = 'idle', onRequestAccess }) {
  const text = STEP_LABELS[step] ?? 'Access portfolio'
  const isIdle = step === 'idle'
  const showDots = step !== 'idle' && step !== 'exiting'

  return (
    <div
      className={`loader-wrapper ${step === 'exiting' ? 'loader-exiting' : ''}`}
      role={isIdle ? 'button' : 'status'}
      aria-label={isIdle ? 'Click to access portfolio' : 'Loading'}
      onClick={isIdle ? onRequestAccess : undefined}
      onKeyDown={isIdle ? (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onRequestAccess?.(); } } : undefined}
      tabIndex={isIdle ? 0 : -1}
    >
      <div className="ui-abstergo">
        <div className="abstergo-loader">
          <div />
          <div />
          <div />
        </div>
        <div className="ui-text">
          {text}
          {showDots && (
            <>
              <span className="ui-dot dot-1" />
              <span className="ui-dot dot-2" />
              <span className="ui-dot dot-3" />
            </>
          )}
        </div>
        {isIdle && (
          <p className="loader-hint">Click to continue</p>
        )}
      </div>
    </div>
  )
}
