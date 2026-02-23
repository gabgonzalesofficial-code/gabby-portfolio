/**
 * ChatBot.jsx — AI Chat Panel (same organism as EveRobot)
 *
 * Props:
 *   isOpen        — boolean
 *   onClose       — fn
 *   onStateChange — fn('idle' | 'listening' | 'thinking' | 'speaking')
 */
import { useState, useRef, useEffect, useCallback } from 'react'

// ─── Hex Thinking Loader ──────────────────────────────────────────────────────
function HexLoader() {
  return (
    <div style={{ display:'flex', gap:5, alignItems:'center', height:18 }}>
      {[0,1,2].map(i => (
        <div key={i} style={{
          width:9, height:9,
          clipPath:'polygon(50% 0%,100% 25%,100% 75%,50% 100%,0% 75%,0% 25%)',
          background:'rgba(0,200,255,0.8)',
          animationName:'hexPulse',
          animationDuration:'1.1s',
          animationTimingFunction:'ease-in-out',
          animationDelay:`${i*0.22}s`,
          animationIterationCount:'infinite',
        }}/>
      ))}
    </div>
  );
}

// ─── Status dot ───────────────────────────────────────────────────────────────
var STATUS = {
  idle:      { label:'Standby',      color:'rgba(0,200,255,0.45)' },
  listening: { label:'Listening',    color:'rgba(0,230,160,0.9)'  },
  thinking:  { label:'Thinking…',    color:'rgba(0,190,255,1.0)'  },
  speaking:  { label:'Responding',   color:'rgba(0,255,190,0.9)'  },
};

function StatusRow({ state }) {
  var s = STATUS[state] || STATUS.idle;
  return (
    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
      <div style={{
        width:6, height:6, borderRadius:'50%',
        background: s.color,
        boxShadow: `0 0 5px ${s.color}`,
        transition: 'background 0.4s, box-shadow 0.4s',
        animationName: state !== 'idle' ? 'statusBlink' : 'none',
        animationDuration: '1.2s',
        animationTimingFunction: 'ease-in-out',
        animationIterationCount: 'infinite',
      }}/>
      <span style={{
        fontSize:11,
        color: s.color,
        fontFamily:"'SF Mono','Fira Code','Fira Mono','Roboto Mono',monospace",
        letterSpacing:'0.06em',
        transition:'color 0.4s',
      }}>
        {s.label}
      </span>
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────
function Bubble({ role, text, streaming }) {
  var isUser = role === 'user';
  return (
    <div style={{
      display:'flex',
      justifyContent: isUser ? 'flex-end' : 'flex-start',
      marginBottom: 2,
    }}>
      <div style={{
        maxWidth:'80%',
        padding:'9px 13px',
        borderRadius: isUser ? '14px 14px 3px 14px' : '3px 14px 14px 14px',
        background: isUser
          ? 'rgba(0,100,180,0.35)'
          : 'rgba(255,255,255,0.04)',
        border: isUser
          ? '1px solid rgba(0,160,240,0.3)'
          : '1px solid rgba(255,255,255,0.08)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
      }}>
        <p style={{
          margin:0,
          fontSize:13.5,
          lineHeight:1.6,
          whiteSpace:'pre-wrap',
          wordBreak:'break-word',
          color: isUser ? 'rgba(200,230,255,0.92)' : 'rgba(210,235,255,0.85)',
          fontFamily: isUser
            ? "-apple-system,'Helvetica Neue',sans-serif"
            : "'SF Mono','Fira Code','Fira Mono','Roboto Mono',monospace",
          fontSize: isUser ? 13.5 : 13,
          letterSpacing: isUser ? 0 : '0.015em',
        }}>
          {text}
          {streaming && (
            <span style={{
              display:'inline-block',
              width:'0.5em', height:'1em',
              background:'rgba(0,200,255,0.75)',
              marginLeft:2,
              verticalAlign:'text-bottom',
              animationName:'cursorBlink',
              animationDuration:'0.75s',
              animationTimingFunction:'step-end',
              animationIterationCount:'infinite',
            }}/>
          )}
        </p>
      </div>
    </div>
  );
}

// ─── ChatBot ──────────────────────────────────────────────────────────────────
export default function ChatBot({ isOpen, onClose, onStateChange }) {
  var [messages, setMessages] = useState([{
    role:'assistant',
    content:"Hey there! 👋 I'm Gabriel, and I'm here to chat! Ask me about my work, my tech stack, my love for cooking (and poetry, if you're into that sort of thing 😄), or anything else you're curious about. Fire away!",
  }]);
  var [input,         setInput]        = useState('');
  var [isLoading,     setIsLoading]    = useState(false);
  var [streamText,    setStreamText]   = useState('');
  var [isStreaming,   setIsStreaming]  = useState(false);
  var [panelState,    setPanelState]   = useState('idle');
  var [error,         setError]        = useState('');
  var messagesEndRef  = useRef(null);
  var inputRef        = useRef(null);
  var isSubmitting    = useRef(false);
  var streamTimer     = useRef(null);
  var MAX = 1000;

  function emit(s) { setPanelState(s); onStateChange && onStateChange(s); }

  useEffect(function(){
    messagesEndRef.current?.scrollIntoView({ behavior:'smooth' });
  }, [messages, streamText]);

  useEffect(function(){
    if(isOpen) {
      var t = setTimeout(function(){ inputRef.current?.focus(); }, 150);
      emit('listening');
      return function(){ clearTimeout(t); };
    } else {
      emit('idle');
    }
  }, [isOpen]);

  useEffect(function(){
    return function(){ if(streamTimer.current) clearTimeout(streamTimer.current); };
  }, []);

  // Variable-speed character streaming
  var runStream = useCallback(function(fullText, onDone) {
    if(streamTimer.current) clearTimeout(streamTimer.current);
    var chars = [...fullText], i = 0;
    function tick() {
      if(i >= chars.length){ onDone && onDone(); return; }
      var c = chars[i++];
      setStreamText(function(p){ return p + c; });
      var delay = 13 + Math.random()*11;
      if('.!?'.includes(c))   delay = 85 + Math.random()*65;
      else if(',;:'.includes(c)) delay = 42 + Math.random()*22;
      else if(c === ' ')      delay = 6;
      else if(c === '\n')     delay = 50;
      streamTimer.current = setTimeout(tick, delay);
    }
    tick();
  }, []);

  var handleSend = useCallback(async function(e) {
    e.preventDefault(); e.stopPropagation();
    if(!input.trim() || isLoading || isSubmitting.current) return;
    var msg = input.trim();
    if(msg.length > MAX){ setError('Message too long (max '+MAX+' chars).'); return; }
    isSubmitting.current = true;
    setInput(''); setError(''); setIsLoading(true); emit('thinking');
    var next = [...messages, { role:'user', content:msg }];
    setMessages(next);
    var history = messages.filter(m=>m.role!=='system').map(m=>({role:m.role,content:m.content}));
    try {
      var res = await fetch('/api/chat',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({message:msg,conversationHistory:history})});
      var txt = await res.text();
      if(!res.ok){
        var em='Error '+res.status;
        try{ var ed=JSON.parse(txt); em=ed.error||em; }catch(e){
          if(res.status===404) em='API not found. Use "vercel dev" locally.';
          else if(res.status===500) em='Server error — check GROQ_API_KEY.';
          else if(res.status===401) em='Unauthorized — check your API key.';
        }
        throw new Error(em);
      }
      var data; try{ data=JSON.parse(txt); }catch(e){ throw new Error('Bad server response.'); }
      if(!data.response) throw new Error(data.error||'No response.');
      // Stream the reply
      setIsLoading(false); setIsStreaming(true); setStreamText(''); emit('speaking');
      runStream(data.response, function(){
        setMessages(function(prev){ return [...prev,{role:'assistant',content:data.response}]; });
        setStreamText(''); setIsStreaming(false);
        isSubmitting.current=false; emit('listening');
        setTimeout(function(){ inputRef.current?.focus(); }, 100);
      });
    } catch(err) {
      setMessages(function(prev){ return [...prev,{role:'assistant',content:'⚠ '+(err.message||'Something went wrong.')+'  \nPlease try again.'}]; });
      setIsLoading(false); setIsStreaming(false);
      isSubmitting.current=false; emit('listening');
      setTimeout(function(){ inputRef.current?.focus(); }, 100);
    }
  }, [messages, input, isLoading, runStream]);

  var handleKeyDown = useCallback(function(e){
    if(e.key==='Enter'&&!e.shiftKey){ e.preventDefault(); handleSend(e); }
  }, [handleSend]);

  var handleChange = useCallback(function(e){
    setInput(e.target.value);
    if(error) setError('');
  }, [error]);

  if(!isOpen) return null;

  var fraction = input.length / MAX;
  var charColor = fraction >= 1 ? '#ff4466' : fraction > 0.9 ? '#ffaa00' : 'rgba(0,200,255,0.35)';

  return (
    <>
      {/* ── Global keyframes ── */}
      <style>{`
        @keyframes chatSlideUp {
          from { opacity:0; transform:translateY(16px) scale(0.98); }
          to   { opacity:1; transform:translateY(0)    scale(1);    }
        }
        @keyframes hexPulse {
          0%,100% { opacity:0.3;  transform:scale(0.8);  }
          50%     { opacity:1.0;  transform:scale(1.15); }
        }
        @keyframes cursorBlink {
          0%,100% { opacity:1; }
          50%     { opacity:0; }
        }
        @keyframes statusBlink {
          0%,100% { opacity:1;    }
          50%     { opacity:0.35; }
        }
        @keyframes scanLine {
          from { top: -2px; }
          to   { top: 100%; }
        }
      `}</style>

      {/* ── Backdrop ── */}
      <div
        onClick={onClose}
        style={{
          position:'fixed', inset:0, zIndex:50,
          background:'rgba(0,4,14,0.65)',
          backdropFilter:'blur(4px)',
          WebkitBackdropFilter:'blur(4px)',
        }}
      />

      {/* ── Panel ── */}
      <div style={{
        position:'fixed',
        right:'calc(1.5rem + 120px)',   // clears the orb
        bottom:'1.5rem',
        zIndex:51,
        width:'min(90vw, 400px)',
        height:'min(82vh, 580px)',
        display:'flex',
        flexDirection:'column',
        background:'rgba(3, 8, 22, 0.96)',
        border:'1px solid rgba(0,200,255,0.16)',
        borderRadius:16,
        boxShadow:[
          '0 0 0 1px rgba(0,200,255,0.05)',
          '0 8px 32px rgba(0,0,0,0.55)',
          '0 0 60px rgba(0,120,255,0.1)',
        ].join(', '),
        overflow:'hidden',
        animationName:'chatSlideUp',
        animationDuration:'0.26s',
        animationTimingFunction:'cubic-bezier(0.22,1,0.36,1)',
        animationFillMode:'both',
      }}>

        {/* Subtle top scan line */}
        <div style={{
          position:'absolute', left:0, right:0, height:1,
          background:'linear-gradient(90deg,transparent,rgba(0,200,255,0.18),transparent)',
          animationName:'scanLine',
          animationDuration:'6s',
          animationTimingFunction:'linear',
          animationIterationCount:'infinite',
          pointerEvents:'none',
          zIndex:1,
        }}/>

        {/* ── Header ── */}
        <div style={{
          padding:'14px 16px 12px',
          borderBottom:'1px solid rgba(255,255,255,0.06)',
          display:'flex',
          alignItems:'center',
          justifyContent:'space-between',
          flexShrink:0,
          background:'rgba(0,200,255,0.03)',
        }}>
          <div style={{ display:'flex', alignItems:'center', gap:11 }}>
            {/* Clean circle avatar with inner orb glow */}
            <div style={{
              width:36, height:36, borderRadius:'50%',
              background:'radial-gradient(circle at 38% 38%, rgba(0,200,255,0.25), rgba(0,40,100,0.6))',
              border:'1px solid rgba(0,200,255,0.35)',
              display:'flex', alignItems:'center', justifyContent:'center',
              boxShadow:'0 0 12px rgba(0,200,255,0.25)',
              flexShrink:0,
            }}>
              <div style={{
                width:10, height:10, borderRadius:'50%',
                background:'rgba(0,220,255,0.85)',
                boxShadow:'0 0 8px rgba(0,220,255,0.7)',
              }}/>
            </div>

            <div>
              <div style={{
                fontSize:13,
                fontWeight:600,
                color:'rgba(210,240,255,0.95)',
                letterSpacing:'0.04em',
                fontFamily:"-apple-system,'Helvetica Neue',sans-serif",
                lineHeight:1.2,
                marginBottom:3,
              }}>
                Gabriel
              </div>
              <StatusRow state={panelState}/>
            </div>
          </div>

          <button
            onClick={onClose}
            aria-label="Close chat"
            style={{
              width:30, height:30,
              borderRadius:8,
              background:'rgba(255,255,255,0.05)',
              border:'1px solid rgba(255,255,255,0.09)',
              cursor:'pointer',
              color:'rgba(160,200,230,0.6)',
              display:'flex', alignItems:'center', justifyContent:'center',
              transition:'all 0.15s',
              flexShrink:0,
            }}
            onMouseEnter={function(e){e.currentTarget.style.background='rgba(255,255,255,0.1)';e.currentTarget.style.color='rgba(200,230,255,0.9)';}}
            onMouseLeave={function(e){e.currentTarget.style.background='rgba(255,255,255,0.05)';e.currentTarget.style.color='rgba(160,200,230,0.6)';}}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <path d="M18 6L6 18M6 6l12 12"/>
            </svg>
          </button>
        </div>

        {/* ── Messages ── */}
        <div style={{
          flex:1,
          overflowY:'auto',
          padding:'16px 14px 8px',
          display:'flex',
          flexDirection:'column',
          gap:8,
          scrollbarWidth:'thin',
          scrollbarColor:'rgba(0,200,255,0.15) transparent',
        }}>
          {messages.map(function(m, i) {
            var isLastAI = m.role==='assistant' && i===messages.length-1 && isStreaming;
            return (
              <Bubble
                key={i}
                role={m.role}
                text={isLastAI ? streamText : m.content}
                streaming={isLastAI}
              />
            );
          })}

          {/* Streaming bubble after user message */}
          {isStreaming && messages[messages.length-1]?.role==='user' && (
            <Bubble role="assistant" text={streamText} streaming={true}/>
          )}

          {/* Hex thinking indicator */}
          {isLoading && !isStreaming && (
            <div style={{ display:'flex', justifyContent:'flex-start', paddingLeft:2 }}>
              <div style={{
                padding:'10px 14px',
                borderRadius:'3px 14px 14px 14px',
                background:'rgba(255,255,255,0.04)',
                border:'1px solid rgba(255,255,255,0.08)',
              }}>
                <HexLoader/>
              </div>
            </div>
          )}

          <div ref={messagesEndRef}/>
        </div>

        {/* ── Input ── */}
        <div style={{
          padding:'10px 12px 12px',
          borderTop:'1px solid rgba(255,255,255,0.06)',
          background:'rgba(0,0,0,0.25)',
          flexShrink:0,
        }}>
          {error && (
            <div style={{
              marginBottom:8,
              padding:'6px 10px',
              background:'rgba(255,50,80,0.08)',
              border:'1px solid rgba(255,50,80,0.25)',
              borderRadius:7,
              fontSize:11,
              color:'rgba(255,130,140,0.9)',
              fontFamily:"'SF Mono','Fira Code',monospace",
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
                  padding:'10px 36px 10px 14px',
                  background:'rgba(255,255,255,0.05)',
                  border:'1px solid rgba(255,255,255,0.1)',
                  borderRadius:10,
                  color:'rgba(210,235,255,0.9)',
                  fontSize:13.5,
                  fontFamily:"-apple-system,'Helvetica Neue',sans-serif",
                  outline:'none',
                  boxSizing:'border-box',
                  transition:'border-color 0.2s, box-shadow 0.2s',
                  caretColor:'rgba(0,200,255,0.9)',
                  opacity:(isLoading||isStreaming)?0.5:1,
                  '::placeholder':{ color:'rgba(120,160,200,0.4)' },
                }}
                onFocus={function(e){e.target.style.borderColor='rgba(0,200,255,0.4)';e.target.style.boxShadow='0 0 0 2px rgba(0,200,255,0.08), 0 0 12px rgba(0,150,255,0.1)';}}
                onBlur={function(e){e.target.style.borderColor='rgba(255,255,255,0.1)';e.target.style.boxShadow='none';}}
              />
              {/* Char arc */}
              <div style={{position:'absolute',right:9,top:'50%',transform:'translateY(-50%)',width:16,height:16,pointerEvents:'none'}}>
                <svg viewBox="0 0 16 16" style={{transform:'rotate(-90deg)'}}>
                  <circle cx="8" cy="8" r="6" fill="none" stroke="rgba(0,200,255,0.1)" strokeWidth="1.8"/>
                  <circle cx="8" cy="8" r="6" fill="none" stroke={charColor}
                    strokeWidth="1.8"
                    strokeDasharray={`${Math.min(fraction,1)*37.7} 37.7`}
                    style={{transition:'stroke-dasharray 0.2s, stroke 0.3s'}}
                  />
                </svg>
              </div>
            </div>

            {/* Send button — clean circle */}
            <button
              onClick={handleSend}
              disabled={!input.trim()||isLoading||isStreaming||input.length>MAX}
              aria-label="Send"
              style={{
                width:38, height:38, borderRadius:'50%',
                background: (!input.trim()||isLoading||isStreaming)
                  ? 'rgba(0,100,160,0.25)'
                  : 'rgba(0,200,255,0.85)',
                border:'none',
                cursor:(!input.trim()||isLoading||isStreaming)?'not-allowed':'pointer',
                display:'flex', alignItems:'center', justifyContent:'center',
                color:(!input.trim()||isLoading||isStreaming)?'rgba(0,150,200,0.35)':'rgba(0,10,30,0.95)',
                transition:'all 0.18s',
                flexShrink:0,
              }}
              onMouseEnter={function(e){if(!e.currentTarget.disabled)e.currentTarget.style.background='rgba(0,225,255,1)';}}
              onMouseLeave={function(e){if(!e.currentTarget.disabled)e.currentTarget.style.background='rgba(0,200,255,0.85)';}}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"/>
              </svg>
            </button>
          </div>

          <div style={{marginTop:7,display:'flex',justifyContent:'space-between',alignItems:'center'}}>
            <span style={{fontSize:10,color:'rgba(0,200,255,0.2)',fontFamily:"'SF Mono','Fira Code',monospace",letterSpacing:'0.12em'}}>
              GROQ AI
            </span>
            {fraction > 0.85 && (
              <span style={{fontSize:10,color:charColor,fontFamily:"'SF Mono','Fira Code',monospace",transition:'color 0.3s'}}>
                {MAX-input.length} left
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Mobile: panel goes full-width at bottom */}
      <style>{`
        @media (max-width: 640px) {
          /* target the panel by its bottom position */
          div[style*="chatSlideUp"] {
            right: 0 !important;
            bottom: 0 !important;
            width: 100vw !important;
            border-radius: 16px 16px 0 0 !important;
          }
        }
        /* Custom scrollbar */
        ::-webkit-scrollbar { width: 3px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(0,200,255,0.15); border-radius:2px; }
        ::-webkit-scrollbar-thumb:hover { background: rgba(0,200,255,0.3); }
      `}</style>
    </>
  );
}