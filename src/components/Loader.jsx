import './Loader.css'

const STEP_LABELS = {
  initializing: 'Initializing',
  requesting: 'Requesting Access',
  granted: 'Access Granted',
  exiting: 'Access Granted',
}

export default function Loader({ step = 'initializing' }) {
  const text = STEP_LABELS[step] ?? 'Initializing'
  const showDots = step !== 'exiting'

  return (
    <div
      className={`loader-wrapper ${step === 'exiting' ? 'loader-exiting' : ''}`}
      role="status"
      aria-label="Loading"
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
      </div>
    </div>
  )
}
