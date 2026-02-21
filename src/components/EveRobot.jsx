import { useState, useRef, useEffect } from 'react'
import './EveRobot.css'

const BUBBLE_MESSAGES = [
  "Hello! I'm EVE.\nYour portfolio assistant. ✦",
  "Click me to chat\nwith Gabriel! 👋",
  "Scanning systems...\nAll clear. Ready!",
  "What would you\nlike to explore?",
  "I'm always here\nto help you out!",
  "Let's connect.\nI'd love to chat!",
]

export default function EveRobot({ onClick, 'aria-label': ariaLabel = 'Open chat' }) {
  const [bubbleText, setBubbleText] = useState(BUBBLE_MESSAGES[0])
  const [wiggle, setWiggle] = useState(false)
  const msgIndex = useRef(0)
  const wrapRef = useRef(null)

  const say = (text) => {
    setBubbleText(text)
  }

  const handleClick = () => {
    msgIndex.current = (msgIndex.current + 1) % BUBBLE_MESSAGES.length
    say(BUBBLE_MESSAGES[msgIndex.current])
    setWiggle(true)
    const t = setTimeout(() => setWiggle(false), 600)
    onClick?.()
    return () => clearTimeout(t)
  }

  useEffect(() => {
    const id = setInterval(() => {
      if (document.hidden) return
      msgIndex.current = (msgIndex.current + 1) % BUBBLE_MESSAGES.length
      setBubbleText(BUBBLE_MESSAGES[msgIndex.current])
    }, 5500)
    return () => clearInterval(id)
  }, [])

  return (
    <button
      type="button"
      className={`eve-chat-trigger ${wiggle ? 'eve-wiggle' : ''}`}
      onClick={handleClick}
      aria-label={ariaLabel}
    >
      <div className="eve-scene">
        <div className="eve-wrap" ref={wrapRef}>
          <div className="eve-aura" aria-hidden />
          <div className="orbit-track" aria-hidden />

          <div className="head">
            <div className="face-panel">
              <div className="eyes">
                <div className="eye">
                  <div className="scan-lines"><i /><i /><i /><i /></div>
                  <div className="eye-shine" />
                  <div className="eye-lid" />
                </div>
                <div className="eye">
                  <div className="scan-lines"><i /><i /><i /><i /></div>
                  <div className="eye-shine" />
                  <div className="eye-lid" />
                </div>
              </div>
            </div>
          </div>

          <div className="body-group">
            <div className="arm arm-l" />
            <div className="body">
              <div className="chest">
                <div className="dot dg" />
                <div className="dot dy" />
                <div className="dot dr" />
              </div>
            </div>
            <div className="arm arm-r" />
          </div>

          <div className="shadow" />
          <div className="eve-bubble" aria-hidden>{bubbleText}</div>
        </div>
      </div>
    </button>
  )
}
