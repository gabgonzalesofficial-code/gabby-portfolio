/**
 * ChatBot.jsx — AI Chat Panel
 *
 * Same organism as ThreeEveRobot: #151e2e midnight navy,
 * soft blue-white accent. Feels like one of your portfolio's
 * dark cards woke up — not a sci-fi terminal.
 *
 * Props:
 *   isOpen        — boolean
 *   onClose       — fn
 *   onStateChange — fn('idle'|'listening'|'thinking'|'speaking')
 */
import { useState, useRef, useEffect, useCallback } from 'react';

// ── Design tokens ─────────────────────────────────────────────────────────────
const T = {
  // Surfaces — all #151e2e family
  panel:        'rgba(19, 27, 42, 0.98)',
  header:       'rgba(23, 33, 50, 0.99)',
  inputArea:    'rgba(14, 20, 34, 0.60)',
  userBubble:   'rgba(30, 48, 85, 0.55)',
  aiBubble:     'rgba(255,255,255,0.03)',
  inputBg:      'rgba(255,255,255,0.04)',

  // Borders
  borderSub:    'rgba(255,255,255,0.06)',
  borderAccent: 'rgba(95,162,255,0.18)',
  borderActive: 'rgba(95,162,255,0.30)',

  // Accent — blue-white, matching the sphere's glow peak
  accent:       'rgba(95,162,255,1)',
  accentGlow:   'rgba(95,162,255,0.35)',
  accentDim:    'rgba(95,162,255,0.40)',
  accentFaint:  'rgba(95,162,255,0.10)',

  // Text
  textPrimary:  'rgba(220,232,252,0.92)',
  textMuted:    'rgba(148,172,210,0.60)',
  textAI:       'rgba(180,208,255,0.82)',

  // Shadows
  shadow:       '0 12px 48px rgba(0,0,0,0.60), 0 0 0 1px rgba(95,162,255,0.06)',
};

// ── Breathing dots — mirrors the sphere's organic breathing ───────────────────
function BreathLoader() {
  return (
    <div style={{ display:'flex', gap:7, alignItems:'center', height:20 }}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          width:6, height:6, borderRadius:'50%',
          background: T.accent,
          boxShadow: `0 0 8px ${T.accentGlow}`,
          animationName: 'breatheDot',
          animationDuration: '1.6s',
          animationTimingFunction: 'ease-in-out',
          animationDelay: `${i * 0.28}s`,
          animationIterationCount: 'infinite',
        }}/>
      ))}
    </div>
  );
}

// ── Status indicator ──────────────────────────────────────────────────────────
const STATUS = {
  idle:      { label:'Available',  color:'rgba(95,162,255,0.40)',  pulse:false },
  listening: { label:'Listening',  color:'rgba(80,210,160,0.85)',  pulse:true  },
  thinking:  { label:'Thinking',   color:'rgba(95,162,255,0.95)',  pulse:true  },
  speaking:  { label:'Responding', color:'rgba(130,195,255,0.90)', pulse:true  },
};

function StatusPill({ state }) {
  const s = STATUS[state] || STATUS.idle;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:5 }}>
      <div style={{
        width:5, height:5, borderRadius:'50%',
        background: s.color,
        boxShadow: s.pulse ? `0 0 6px ${s.color}` : 'none',
        transition: 'background 0.4s, box-shadow 0.4s',
        animationName: s.pulse ? 'statusPulse' : 'none',
        animationDuration: '1.4s',
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite',
      }}/>
      <span style={{
        fontSize: 10.5,
        color: s.color,
        fontFamily: "-apple-system,'Helvetica Neue',sans-serif",
        letterSpacing: '0.03em',
        fontWeight: 500,
        transition: 'color 0.4s',
      }}>
        {s.label}
      </span>
    </div>
  );
}

// ── Message bubble ────────────────────────────────────────────────────────────
function Bubble({ role, text, streaming }) {
  const isUser = role === 'user';
  return (
    <div className="chat-bubble-row" style={{
      display: 'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 1,
    }}>
      <div className="chat-bubble" style={{
        maxWidth: '78%',
        padding: '10px 14px',
        borderRadius: isUser ? '14px 14px 3px 14px' : '3px 14px 14px 14px',
        background: isUser ? T.userBubble : T.aiBubble,
        border: `1px solid ${isUser ? 'rgba(80,130,240,0.22)' : T.borderSub}`,
        // AI messages: faint accent left edge — the only visual clue they're "alive"
        borderLeft: !isUser ? `2px solid ${T.borderAccent}` : undefined,
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
      }}>
        <p style={{
          margin: 0,
          fontSize: 13.5,
          lineHeight: 1.65,
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word',
          color: isUser ? T.textPrimary : T.textAI,
          fontFamily: isUser
            ? "-apple-system,'Helvetica Neue',sans-serif"
            : "'SF Mono','Fira Code','Fira Mono',monospace",
          letterSpacing: isUser ? 'normal' : '0.014em',
        }}>
          {text}
          {streaming && (
            <span style={{
              display: 'inline-block',
              width: '0.42em', height: '0.92em',
              background: T.accent,
              marginLeft: 2,
              verticalAlign: 'text-bottom',
              borderRadius: 1,
              boxShadow: `0 0 6px ${T.accentGlow}`,
              animationName: 'cursorBlink',
              animationDuration: '0.75s',
              animationTimingFunction: 'step-end',
              animationIterationCount: 'infinite',
            }}/>
          )}
        </p>
      </div>
    </div>
  );
}

// ── ChatBot ───────────────────────────────────────────────────────────────────
export default function ChatBot({ isOpen, onClose, onStateChange }) {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: "Hey there! 👋 I'm Gabriel. Ask me about my work, my tech stack, my love for cooking (and poetry, if you're into that 😄) — or anything else. Fire away!",
  }]);
  const [input,       setInput]       = useState('');
  const [isLoading,   setIsLoading]   = useState(false);
  const [streamText,  setStreamText]  = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [panelState,  setPanelState]  = useState('idle');
  const [error,       setError]       = useState('');

  const messagesEndRef = useRef(null);
  const inputRef       = useRef(null);
  const isSubmitting   = useRef(false);
  const streamTimer    = useRef(null);
  const MAX = 1000;

  function emit(s) { setPanelState(s); onStateChange?.(s); }

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamText]);

  useEffect(() => {
    if (isOpen) {
      const t = setTimeout(() => inputRef.current?.focus(), 150);
      emit('listening');
      return () => clearTimeout(t);
    } else {
      emit('idle');
    }
  }, [isOpen]);

  useEffect(() => () => { if (streamTimer.current) clearTimeout(streamTimer.current); }, []);

  // Variable-speed character streaming — punctuation pauses feel deliberate
  const runStream = useCallback((fullText, onDone) => {
    if (streamTimer.current) clearTimeout(streamTimer.current);
    const chars = [...fullText]; let i = 0;
    function tick() {
      if (i >= chars.length) { onDone?.(); return; }
      const c = chars[i++];
      setStreamText(p => p + c);
      let delay = 14 + Math.random() * 10;
      if ('.!?'.includes(c))    delay = 90 + Math.random() * 60;
      else if (',;:'.includes(c)) delay = 45 + Math.random() * 20;
      else if (c === ' ')       delay = 6;
      else if (c === '\n')      delay = 52;
      streamTimer.current = setTimeout(tick, delay);
    }
    tick();
  }, []);

  const handleSend = useCallback(async (e) => {
    e.preventDefault(); e.stopPropagation();
    if (!input.trim() || isLoading || isSubmitting.current) return;
    const msg = input.trim();
    if (msg.length > MAX) { setError(`Message too long (max ${MAX} chars).`); return; }
    isSubmitting.current = true;
    setInput(''); setError(''); setIsLoading(true); emit('thinking');
    const next = [...messages, { role:'user', content:msg }];
    setMessages(next);
    const history = messages.filter(m => m.role !== 'system').map(m => ({ role:m.role, content:m.content }));
    try {
      const res = await fetch('/api/chat', {
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body: JSON.stringify({ message:msg, conversationHistory:history }),
      });
      const txt = await res.text();
      if (!res.ok) {
        let em = `Error ${res.status}`;
        try { const ed = JSON.parse(txt); em = ed.error || em; } catch {
          if (res.status === 404) em = 'API not found — use "vercel dev" locally.';
          else if (res.status === 500) em = 'Server error — check GROQ_API_KEY.';
        }
        throw new Error(em);
      }
      let data; try { data = JSON.parse(txt); } catch { throw new Error('Bad server response.'); }
      if (!data.response) throw new Error(data.error || 'No response.');
      setIsLoading(false); setIsStreaming(true); setStreamText(''); emit('speaking');
      runStream(data.response, () => {
        setMessages(prev => [...prev, { role:'assistant', content:data.response }]);
        setStreamText(''); setIsStreaming(false);
        isSubmitting.current = false; emit('listening');
        setTimeout(() => inputRef.current?.focus(), 100);
      });
    } catch (err) {
      setMessages(prev => [...prev, { role:'assistant', content:`⚠ ${err.message || 'Something went wrong.'}\n\nPlease try again.` }]);
      setIsLoading(false); setIsStreaming(false);
      isSubmitting.current = false; emit('listening');
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  }, [messages, input, isLoading, runStream]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(e); }
  }, [handleSend]);

  const handleChange = useCallback((e) => {
    setInput(e.target.value);
    if (error) setError('');
  }, [error]);

  if (!isOpen) return null;

  const fraction  = input.length / MAX;
  const charColor = fraction >= 1 ? '#ff5566' : fraction > 0.9 ? '#ffaa44' : T.accentDim;
  const canSend   = input.trim() && !isLoading && !isStreaming && input.length <= MAX;

  // Panel border brightens when active
  const panelBorderColor = (panelState === 'thinking' || panelState === 'speaking')
    ? T.borderActive : T.borderAccent;

  return (
    <>
      <style>{`
        @keyframes chatSlideUp {
          from { opacity:0; transform:translateY(14px) scale(0.97); }
          to   { opacity:1; transform:translateY(0)    scale(1);    }
        }
        @keyframes breatheDot {
          0%,100% { transform:scale(0.6);  opacity:0.28; }
          50%     { transform:scale(1.22); opacity:1.0;  }
        }
        @keyframes cursorBlink { 0%,100%{opacity:1} 50%{opacity:0} }
        @keyframes statusPulse { 0%,100%{opacity:1} 50%{opacity:0.30} }
      `}</style>

      {/* Backdrop */}
      <div
        onClick={onClose}
        style={{
          position:'fixed', inset:0, zIndex:50,
          background:'rgba(6,10,20,0.58)',
          backdropFilter:'blur(3px)',
          WebkitBackdropFilter:'blur(3px)',
        }}
      />

      {/* Panel */}
      <div
        className="chat-panel"
        style={{
        position:'fixed',
        right:'calc(1.5rem + 125px)',
        bottom:'1.5rem',
        zIndex:51,
        width:'min(90vw, 388px)',
        height:'min(82vh, 565px)',
        display:'flex',
        flexDirection:'column',
        background: T.panel,
        border:`1px solid ${panelBorderColor}`,
        borderRadius:16,
        boxShadow: T.shadow,
        overflow:'hidden',
        animationName:'chatSlideUp',
        animationDuration:'0.28s',
        animationTimingFunction:'cubic-bezier(0.22,1,0.36,1)',
        animationFillMode:'both',
        transition:'border-color 0.5s ease',
      }}>

        {/* Header */}
        <div className="chat-header" style={{
          padding:'14px 16px 13px',
          background: T.header,
          borderBottom:`1px solid ${T.borderSub}`,
          display:'flex', alignItems:'center', justifyContent:'space-between',
          flexShrink:0,
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:11 }}>

            {/* Avatar — miniature sphere: navy with blue-white inner glow */}
            <div style={{
              width:36, height:36, borderRadius:'50%',
              background:'radial-gradient(circle at 38% 36%, rgba(95,162,255,0.20) 0%, rgba(28,50,95,0.55) 45%, rgba(19,27,42,0.92) 100%)',
              border:`1px solid rgba(95,162,255,0.26)`,
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 0 14px rgba(70,140,255,0.16)',
              flexShrink:0,
            }}>
              <div style={{
                width:9, height:9, borderRadius:'50%',
                background:'rgba(130,195,255,0.92)',
                boxShadow:'0 0 10px rgba(95,162,255,0.80), 0 0 22px rgba(70,140,255,0.38)',
              }}/>
            </div>

            <div>
              <div style={{
                fontSize:13.5, fontWeight:600,
                color: T.textPrimary,
                letterSpacing:'0.018em',
                fontFamily:"-apple-system,'Helvetica Neue',sans-serif",
                lineHeight:1.2, marginBottom:4,
              }}>
                Gabriel
              </div>
              <StatusPill state={panelState}/>
            </div>
          </div>

          {/* Close */}
          <button
            onClick={onClose}
            aria-label="Close chat"
            style={{
              width:30, height:30, borderRadius:8,
              background:'rgba(255,255,255,0.04)',
              border:`1px solid ${T.borderSub}`,
              cursor:'pointer', color:T.textMuted,
              display:'flex', alignItems:'center', justifyContent:'center',
              transition:'all 0.15s', flexShrink:0,
            }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(255,255,255,0.08)'; e.currentTarget.style.color=T.textPrimary; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(255,255,255,0.04)'; e.currentTarget.style.color=T.textMuted; }}
          >
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* Messages */}
        <div className="chat-messages" style={{
          flex:1, overflowY:'auto',
          padding:'16px 14px 10px',
          display:'flex', flexDirection:'column', gap:9,
          scrollbarWidth:'thin',
          scrollbarColor:'rgba(95,162,255,0.12) transparent',
        }}>
          {messages.map((m, i) => {
            const isLastAI = m.role === 'assistant' && i === messages.length - 1 && isStreaming;
            return (
              <Bubble key={i} role={m.role}
                text={isLastAI ? streamText : m.content}
                streaming={isLastAI}
              />
            );
          })}

          {isStreaming && messages[messages.length-1]?.role === 'user' && (
            <Bubble role="assistant" text={streamText} streaming={true}/>
          )}

          {isLoading && !isStreaming && (
            <div style={{ display:'flex', justifyContent:'flex-start', paddingLeft:2 }}>
              <div style={{
                padding:'11px 16px',
                borderRadius:'3px 14px 14px 14px',
                background: T.aiBubble,
                border:`1px solid ${T.borderSub}`,
                borderLeft:`2px solid ${T.borderAccent}`,
              }}>
                <BreathLoader/>
              </div>
            </div>
          )}

          <div ref={messagesEndRef}/>
        </div>

        {/* Input area */}
        <div className="chat-input-area" style={{
          padding:'10px 12px 13px',
          borderTop:`1px solid ${T.borderSub}`,
          background: T.inputArea,
          flexShrink:0,
        }}>
          {error && (
            <div style={{
              marginBottom:8, padding:'7px 11px',
              background:'rgba(255,50,75,0.07)',
              border:'1px solid rgba(255,50,75,0.20)',
              borderRadius:8, fontSize:11,
              color:'rgba(255,130,140,0.90)',
              fontFamily:"-apple-system,'Helvetica Neue',sans-serif",
            }}>
              {error}
            </div>
          )}

          <div style={{ display:'flex', gap:8, alignItems:'center' }}>
            <div style={{ flex:1, position:'relative' }}>
              <input
                ref={inputRef}
                type="text"
                value={input}
                onChange={handleChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask me anything…"
                disabled={isLoading || isStreaming}
                maxLength={MAX}
                style={{
                  width:'100%',
                  padding:'10px 34px 10px 14px',
                  background: T.inputBg,
                  border:`1px solid ${T.borderSub}`,
                  borderRadius:10,
                  color: T.textPrimary,
                  fontSize:13.5,
                  fontFamily:"-apple-system,'Helvetica Neue',sans-serif",
                  outline:'none',
                  boxSizing:'border-box',
                  transition:'border-color 0.2s, box-shadow 0.2s',
                  caretColor: T.accent,
                  opacity:(isLoading||isStreaming) ? 0.5 : 1,
                }}
                onFocus={e => {
                  e.target.style.borderColor = T.borderAccent;
                  e.target.style.boxShadow   = `0 0 0 2px ${T.accentFaint}`;
                }}
                onBlur={e => {
                  e.target.style.borderColor = T.borderSub;
                  e.target.style.boxShadow   = 'none';
                }}
              />
              {/* Char arc */}
              <div style={{ position:'absolute', right:9, top:'50%', transform:'translateY(-50%)', width:15, height:15, pointerEvents:'none' }}>
                <svg viewBox="0 0 15 15" style={{transform:'rotate(-90deg)'}}>
                  <circle cx="7.5" cy="7.5" r="5.5" fill="none" stroke="rgba(95,162,255,0.09)" strokeWidth="1.5"/>
                  <circle cx="7.5" cy="7.5" r="5.5" fill="none" stroke={charColor}
                    strokeWidth="1.5"
                    strokeDasharray={`${Math.min(fraction,1)*34.6} 34.6`}
                    style={{transition:'stroke-dasharray 0.2s, stroke 0.3s'}}
                  />
                </svg>
              </div>
            </div>

            {/* Send button */}
            <button
              onClick={handleSend}
              disabled={!canSend}
              aria-label="Send"
              style={{
                width:38, height:38, borderRadius:'50%', border:'none',
                background: canSend ? T.accent : 'rgba(40,65,120,0.28)',
                cursor: canSend ? 'pointer' : 'not-allowed',
                display:'flex', alignItems:'center', justifyContent:'center',
                color: canSend ? 'rgba(8,16,36,0.95)' : 'rgba(70,120,200,0.35)',
                transition:'all 0.18s', flexShrink:0,
                boxShadow: canSend ? `0 0 18px ${T.accentGlow}` : 'none',
              }}
              onMouseEnter={e => {
                if (canSend) {
                  e.currentTarget.style.background = 'rgba(140,200,255,1)';
                  e.currentTarget.style.boxShadow  = '0 0 24px rgba(95,162,255,0.55)';
                }
              }}
              onMouseLeave={e => {
                if (canSend) {
                  e.currentTarget.style.background = T.accent;
                  e.currentTarget.style.boxShadow  = `0 0 18px ${T.accentGlow}`;
                }
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
            </button>
          </div>

          {/* Footer */}
          <div style={{ marginTop:8, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{
              fontSize:10, color:'rgba(95,162,255,0.18)',
              fontFamily:"-apple-system,'Helvetica Neue',sans-serif",
              letterSpacing:'0.05em',
            }}>
              Powered by Groq
            </span>
            {fraction > 0.85 && (
              <span style={{ fontSize:10, color:charColor, fontFamily:"'SF Mono','Fira Code',monospace", transition:'color 0.3s' }}>
                {MAX - input.length} left
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile */}
      <style>{`
        @media(max-width:640px){
          .chat-panel{
            right:50%!important;
            left:50%!important;
            bottom:max(1rem,env(safe-area-inset-bottom))!important;
            transform:translateX(-50%)!important;
            width:min(94vw,400px)!important;
            max-width:94vw!important;
            height:min(82vh,560px)!important;
            border-radius:16px!important;
            padding-bottom:12px;
          }
        }
        @media(max-width:380px){
          .chat-panel .chat-header{padding:12px 12px 10px!important}
          .chat-panel .chat-messages{padding:12px 10px 8px!important}
          .chat-panel .chat-input-area{padding:8px 10px 12px!important}
        }
        @media(max-width:640px){
          .chat-bubble{max-width:92%!important}
          .chat-panel button[aria-label="Close chat"]{
            min-width:44px!important;min-height:44px!important;
            padding:7px!important;
          }
          .chat-panel button[aria-label="Send"]{
            min-width:44px!important;min-height:44px!important;
          }
        }
        ::-webkit-scrollbar{width:3px}
        ::-webkit-scrollbar-track{background:transparent}
        ::-webkit-scrollbar-thumb{background:rgba(95,162,255,0.12);border-radius:2px}
        ::-webkit-scrollbar-thumb:hover{background:rgba(95,162,255,0.24)}
        input::placeholder{color:rgba(110,148,200,0.36)!important}
      `}</style>
    </>
  );
}