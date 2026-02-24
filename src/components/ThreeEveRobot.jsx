/**
 * ThreeEveRobot.jsx — Sentient Chat Widget
 *
 * Color story: #151e2e (portfolio midnight navy) glowing with
 * soft blue-white bioluminescence from within. Same organism
 * as the chat panel.
 *
 * Requirements: npm install three gsap
 *
 * Props:
 *   onClick            — fn, opens chat panel
 *   chatState          — 'idle' | 'listening' | 'thinking' | 'speaking'
 *   onInactivityChange — fn(0..1)
 *   aria-label         — string
 */
import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import gsap from 'gsap';

// ─── Sphere vertex shader ─────────────────────────────────────────────────────
// Simplex noise displacement + #151e2e → ocean blue → blue-white palette
const SPHERE_VERT = /* glsl */`
  varying vec3 v_color;
  varying vec3 v_normal;
  uniform float u_time;
  uniform float u_progress;

  vec4 permute(vec4 x){return mod(((x*34.0)+1.0)*x,289.0);}
  vec4 taylorInvSqrt(vec4 r){return 1.79284291400159-0.85373472095314*r;}
  float snoise(vec3 v){
    const vec2 C=vec2(1.0/6.0,1.0/3.0);
    const vec4 D=vec4(0.0,0.5,1.0,2.0);
    vec3 i=floor(v+dot(v,C.yyy));
    vec3 x0=v-i+dot(i,C.xxx);
    vec3 g=step(x0.yzx,x0.xyz);
    vec3 l=1.0-g;
    vec3 i1=min(g.xyz,l.zxy);
    vec3 i2=max(g.xyz,l.zxy);
    vec3 x1=x0-i1+C.xxx;
    vec3 x2=x0-i2+2.0*C.xxx;
    vec3 x3=x0-1.0+3.0*C.xxx;
    i=mod(i,289.0);
    vec4 p=permute(permute(permute(
      i.z+vec4(0.0,i1.z,i2.z,1.0))
      +i.y+vec4(0.0,i1.y,i2.y,1.0))
      +i.x+vec4(0.0,i1.x,i2.x,1.0));
    float n_=1.0/7.0;
    vec3 ns=n_*D.wyz-D.xzx;
    vec4 j=p-49.0*floor(p*ns.z*ns.z);
    vec4 x_=floor(j*ns.z);
    vec4 y_=floor(j-7.0*x_);
    vec4 x=x_*ns.x+ns.yyyy;
    vec4 y=y_*ns.x+ns.yyyy;
    vec4 h=1.0-abs(x)-abs(y);
    vec4 b0=vec4(x.xy,y.xy);
    vec4 b1=vec4(x.zw,y.zw);
    vec4 s0=floor(b0)*2.0+1.0;
    vec4 s1=floor(b1)*2.0+1.0;
    vec4 sh=-step(h,vec4(0.0));
    vec4 a0=b0.xzyw+s0.xzyw*sh.xxyy;
    vec4 a1=b1.xzyw+s1.xzyw*sh.zzww;
    vec3 p0=vec3(a0.xy,h.x);
    vec3 p1=vec3(a0.zw,h.y);
    vec3 p2=vec3(a1.xy,h.z);
    vec3 p3=vec3(a1.zw,h.w);
    vec4 norm=taylorInvSqrt(vec4(dot(p0,p0),dot(p1,p1),dot(p2,p2),dot(p3,p3)));
    p0*=norm.x; p1*=norm.y; p2*=norm.z; p3*=norm.w;
    vec4 m=max(0.6-vec4(dot(x0,x0),dot(x1,x1),dot(x2,x2),dot(x3,x3)),0.0);
    m=m*m;
    return 42.0*dot(m*m,vec4(dot(p0,x0),dot(p1,x1),dot(p2,x2),dot(p3,x3)));
  }

  void main() {
    float noise  = snoise(position * u_progress + u_time / 10.0);
    vec3  newPos = position * (noise + 0.7);

    // ── Three-stop palette: #151e2e navy → ocean blue → blue-white ──
    // noise ≈ -0.8..0.8 → remap to 0..1
    float n01 = clamp(noise * 0.62 + 0.5, 0.0, 1.0);
    vec3 navyDeep  = vec3(0.082, 0.118, 0.180); // #151e2e — portfolio navy
    vec3 oceanMid  = vec3(0.145, 0.290, 0.620); // deep-sea blue
    vec3 glowPeak  = vec3(0.650, 0.820, 1.000); // bioluminescent crest

    vec3 col = n01 < 0.5
      ? mix(navyDeep, oceanMid, n01 * 2.0)
      : mix(oceanMid, glowPeak, (n01 - 0.5) * 2.0);

    v_color  = col;
    v_normal = normal;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(newPos, 1.0);
  }
`;

// ─── Sphere fragment shader ───────────────────────────────────────────────────
// Fresnel rim corona + state modulation + inactivity sleep
const SPHERE_FRAG = /* glsl */`
  varying vec3 v_color;
  varying vec3 v_normal;
  uniform float u_time;
  uniform float u_state;
  uniform float u_inactivity;

  void main() {
    // Fresnel rim — atmosphere glow like a deep-sea creature
    vec3 viewDir = normalize(vec3(0.0, 0.0, 1.0));
    float rim    = pow(1.0 - abs(dot(normalize(v_normal), viewDir)), 2.2);
    vec3 rimCol  = vec3(0.52, 0.76, 1.0);

    vec3 col = v_color;
    col += rimCol * rim * 0.70;

    // State masks
    float sListen = step(0.5,u_state)*(1.0-step(1.5,u_state));
    float sThink  = step(1.5,u_state)*(1.0-step(2.5,u_state));
    float sSpeak  = step(2.5,u_state);

    // Listening: gentle brightness lift + enhanced rim
    col += sListen * vec3(0.03, 0.06, 0.14);
    col += sListen * rimCol * rim * 0.50;

    // Thinking: fast electrical shimmer across surface
    float sh1 = sin(u_time * 11.0) * 0.5 + 0.5;
    float sh2 = sin(u_time * 7.0 + 1.6) * 0.5 + 0.5;
    col += sThink * (vec3(0.04, 0.10, 0.28) + vec3(0.05, 0.12, 0.26) * sh1 * sh2);
    col += sThink * rimCol * rim * 0.95;

    // Speaking: rhythmic luminance pulse — organism transmitting
    float pulse = sin(u_time * 5.0) * 0.5 + 0.5;
    col += sSpeak * col * pulse * 0.32;
    col += sSpeak * rimCol * rim * pulse * 0.52;

    // Inactivity: dims toward dormant deep navy — the creature sleeping
    vec3 dormant = vec3(0.046, 0.065, 0.102);
    col = mix(col, dormant, u_inactivity * 0.80);

    gl_FragColor = vec4(clamp(col, 0.0, 1.5), 1.0);
  }
`;

// ─── Particle vertex ──────────────────────────────────────────────────────────
// Particles hug the sphere surface and breathe with it
const PARTICLE_VERT = /* glsl */`
  uniform float u_time;
  uniform float u_state;

  float h3(vec3 p){
    p=fract(p*vec3(127.1,311.7,74.7));
    p+=dot(p,p.yxz+19.19);
    return fract(p.x*p.y*p.z);
  }

  void main() {
    vec3 p = position;

    // Organic surface displacement — follows sphere noise loosely
    float n1 = h3(p * 2.1 + u_time * 0.09) * 2.0 - 1.0;
    float n2 = h3(p * 4.3 - u_time * 0.06) * 2.0 - 1.0;
    p += normalize(p) * (n1 * 0.10 + n2 * 0.06);

    // State-driven agitation
    float speed = 1.0 + u_state * 0.55;
    p.y += 0.06 * sin(p.y * 5.5 + u_time * speed);
    p.x += 0.03 * cos(p.z * 4.2 + u_time * speed * 0.7);

    // Thinking: chaotic orbital agitation
    float sThink = step(1.5,u_state)*(1.0-step(2.5,u_state));
    p += normalize(p) * sin(u_time*4.6 + length(p)*3.5)*0.07*sThink;

    // Speaking: outward rhythmic pulse
    float sSpeak = step(2.5,u_state);
    float pulse  = sin(u_time*5.0)*0.5+0.5;
    p += normalize(p) * pulse * 0.055 * sSpeak;

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = 5.0 * (1.0 / -mv.z);
    gl_Position  = projectionMatrix * mv;
  }
`;

// ─── Particle fragment ────────────────────────────────────────────────────────
const PARTICLE_FRAG = /* glsl */`
  uniform float u_progress;
  uniform float u_state;
  uniform float u_time;
  uniform float u_inactivity;

  void main() {
    vec2  uv   = gl_PointCoord - 0.5;
    float dist = length(uv);
    if (dist > 0.5) discard;
    float soft = 1.0 - smoothstep(0.22, 0.5, dist);

    vec3 col = vec3(0.60, 0.78, 1.0); // blue-white base

    float sThink  = step(1.5,u_state)*(1.0-step(2.5,u_state));
    float sSpeak  = step(2.5,u_state);
    float sListen = step(0.5,u_state)*(1.0-step(1.5,u_state));

    col = mix(col, vec3(0.78, 0.90, 1.0), sThink * 0.65);
    float pulse = sin(u_time*5.0)*0.5+0.5;
    col = mix(col, vec3(0.70, 0.86, 1.0), sSpeak * pulse * 0.50);
    col = mix(col, vec3(0.52, 0.74, 1.0), sListen * 0.30);

    float opacity = u_progress * soft * (1.0 - u_inactivity * 0.88);
    gl_FragColor = vec4(col, opacity);
  }
`;

// ─── State config ─────────────────────────────────────────────────────────────
const STATE_CFG = {
  idle:      { pMin:0.3, pMax:1.8, pDur:5.5, partOpacity:0.10, rotSpeed:0.0022 },
  listening: { pMin:0.8, pMax:2.8, pDur:3.5, partOpacity:0.22, rotSpeed:0.0042 },
  thinking:  { pMin:2.2, pMax:5.2, pDur:1.6, partOpacity:0.48, rotSpeed:0.0125 },
  speaking:  { pMin:0.9, pMax:3.5, pDur:2.4, partOpacity:0.30, rotSpeed:0.0062 },
};

// ─── Glow helpers — stays in blue family, just dims on inactivity ─────────────
function glowColor(inactivity, alpha) {
  const r = Math.round(95  - 45 * inactivity);
  const g = Math.round(162 - 72 * inactivity);
  const b = Math.round(255 - 70 * inactivity);
  const a = (alpha * (1 - inactivity * 0.78)).toFixed(2);
  return `rgba(${r},${g},${b},${a})`;
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function ThreeEveRobot({
  onClick,
  chatState,
  onInactivityChange,
  chatOpen,
  'aria-label': ariaLabel,
}) {
  chatState = chatState || 'idle';
  ariaLabel = ariaLabel || 'Open AI assistant';

  const mountRef  = useRef(null);
  const threeRef  = useRef(null);
  const rafRef    = useRef(null);
  const tlRef     = useRef(null);
  const chatRef   = useRef(chatState);
  const rotRef    = useRef(STATE_CFG.idle.rotSpeed);

  const cursorRef     = useRef({ x: 0, y: 0 });
  const inactivityRef = useRef(0);
  const lastActiveRef = useRef(Date.now());
  const lastEmitRef   = useRef(-1);
  const twitchRef     = useRef({ vx: 0, vy: 0 });
  const lastTwitchRef = useRef(Date.now());
  const nextTwitchRef = useRef(10000 + Math.random() * 5000);
  const onInactRef    = useRef(onInactivityChange);

  const [wiggle,     setWiggle]     = useState(false);
  const [inactivity, setInactivity] = useState(0);

  useEffect(() => { chatRef.current     = chatState;          }, [chatState]);
  useEffect(() => { onInactRef.current  = onInactivityChange; }, [onInactivityChange]);
  useEffect(() => {
    if (chatState !== 'idle') {
      lastActiveRef.current = Date.now();
      setInactivity(0);
      inactivityRef.current = 0;
    }
  }, [chatState]);

  // ── Three.js setup — runs once ─────────────────────────────────────────────
  useEffect(() => {
    const SIZE = 110;
    const DPR  = Math.min(window.devicePixelRatio || 1, 2);

    const canvas   = mountRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, premultipliedAlpha: false });
    renderer.setSize(SIZE * DPR, SIZE * DPR, false);
    renderer.setPixelRatio(DPR);
    renderer.setClearColor(0x000000, 0);

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(38, 1.0, 0.1, 1000);
    camera.position.set(0, 0, 4.8);
    const clock  = new THREE.Clock();

    // Sphere
    const sphereGeo = new THREE.SphereGeometry(1, 128, 128);
    const sphereMat = new THREE.ShaderMaterial({
      vertexShader: SPHERE_VERT, fragmentShader: SPHERE_FRAG,
      uniforms: {
        u_time:       { value: 0 }, u_progress:   { value: 0 },
        u_state:      { value: 0 }, u_inactivity: { value: 0 },
      },
    });
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMat);
    scene.add(sphereMesh);

    // Particles — sit just outside sphere surface
    const N   = 5500;
    const pos = new Float32Array(N * 3);
    const inc = Math.PI * (3 - Math.sqrt(5));
    const off = 2 / N;
    for (let i = 0; i < N; i++) {
      const y   = i * off - 1 + off / 2;
      const r   = Math.sqrt(1 - y * y) * 1.06;
      const phi = i * inc;
      pos[i*3] = Math.cos(phi)*r; pos[i*3+1] = y*1.06; pos[i*3+2] = Math.sin(phi)*r;
    }
    const partGeo = new THREE.BufferGeometry();
    partGeo.setAttribute('position', new THREE.BufferAttribute(pos, 3));
    const partMat = new THREE.ShaderMaterial({
      vertexShader: PARTICLE_VERT, fragmentShader: PARTICLE_FRAG,
      transparent: true, depthWrite: false,
      uniforms: {
        u_time:       { value: 0 }, u_progress:   { value: 0 },
        u_state:      { value: 0 }, u_inactivity: { value: 0 },
      },
    });
    const particles = new THREE.Points(partGeo, partMat);
    scene.add(particles);

    threeRef.current = { renderer, scene, camera, clock, sphereMesh, sphereMat, particles, partMat };
    startStateAnim('idle');

    // Render loop
    function loop() {
      rafRef.current = requestAnimationFrame(loop);
      const t     = clock.getElapsedTime();
      const now   = performance.now();
      const state = chatRef.current;
      const sv    = { idle:0, listening:1, thinking:2, speaking:3 }[state] || 0;

      sphereMat.uniforms.u_time.value  = t;
      partMat.uniforms.u_time.value    = t;
      sphereMat.uniforms.u_state.value = sv;
      partMat.uniforms.u_state.value   = sv;

      // Breathing — two non-syncing sines, never mechanical
      const breathe = 1.0
        + Math.sin(t * 1.07) * 0.013
        + Math.sin(t * 1.73) * 0.009
        + (state === 'thinking' ? Math.sin(t * 3.1) * 0.007 : 0);
      sphereMesh.scale.setScalar(breathe);

      // Particle rotation
      particles.rotation.y += rotRef.current;
      if (state === 'thinking') particles.rotation.x += rotRef.current * 0.28;

      // Eye tracking — sphere tilts lazily toward cursor
      const r  = canvas.getBoundingClientRect();
      const tx =  (cursorRef.current.x - (r.left + r.width  / 2)) / (r.width  * 2.8);
      const ty = -(cursorRef.current.y - (r.top  + r.height / 2)) / (r.height * 2.8);
      sphereMesh.rotation.y += (tx * 0.7 - sphereMesh.rotation.y) * 0.035;
      sphereMesh.rotation.x += (ty * 0.5 - sphereMesh.rotation.x) * 0.035;

      // Micro-twitches in idle
      if (state === 'idle' && now - lastTwitchRef.current > nextTwitchRef.current) {
        twitchRef.current = { vx: (Math.random()-0.5)*0.20, vy: (Math.random()-0.5)*0.30 };
        lastTwitchRef.current = now;
        nextTwitchRef.current = (8 + Math.random()*7) * 1000;
      }
      if (Math.abs(twitchRef.current.vx) > 0.0001) {
        sphereMesh.rotation.x += twitchRef.current.vx;
        sphereMesh.rotation.y += twitchRef.current.vy;
        twitchRef.current.vx  *= 0.78;
        twitchRef.current.vy  *= 0.78;
      }

      // Inactivity drift — dims and sleeps after 20s
      const idleSec  = (Date.now() - lastActiveRef.current) / 1000;
      const tgtInact = Math.min(Math.max((idleSec - 20) / 15, 0), 1);
      inactivityRef.current += (tgtInact - inactivityRef.current) * 0.008;
      sphereMat.uniforms.u_inactivity.value = inactivityRef.current;
      partMat.uniforms.u_inactivity.value   = inactivityRef.current;

      const rounded = Math.round(inactivityRef.current * 100) / 100;
      if (Math.abs(rounded - lastEmitRef.current) >= 0.01) {
        lastEmitRef.current = rounded;
        onInactRef.current?.(rounded);
        setInactivity(rounded);
      }

      camera.lookAt(scene.position);
      renderer.render(scene, camera);
    }
    loop();

    return () => {
      cancelAnimationFrame(rafRef.current);
      tlRef.current?.kill();
      renderer.dispose();
      sphereGeo.dispose(); sphereMat.dispose();
      partGeo.dispose();   partMat.dispose();
    };
  }, []);

  // ── State → GSAP morph animation ──────────────────────────────────────────
  function startStateAnim(state) {
    if (!threeRef.current) return;
    const { sphereMat, partMat } = threeRef.current;
    const cfg = STATE_CFG[state] || STATE_CFG.idle;
    tlRef.current?.kill();
    rotRef.current = cfg.rotSpeed;
    gsap.to(partMat.uniforms.u_progress, { value: cfg.partOpacity, duration: 1.0, ease: 'power2.inOut' });
    tlRef.current = gsap.timeline({ repeat: -1, yoyo: true })
      .to(sphereMat.uniforms.u_progress, { value: cfg.pMax, duration: cfg.pDur, ease: 'power3.inOut' })
      .to(sphereMat.uniforms.u_progress, { value: cfg.pMin, duration: cfg.pDur, ease: 'power3.inOut' });
  }

  useEffect(() => { startStateAnim(chatState); }, [chatState]);

  // ── Cursor tracking ────────────────────────────────────────────────────────
  useEffect(() => {
    function mv(e) {
      cursorRef.current = { x: e.clientX, y: e.clientY };
      const el = mountRef.current;
      if (el) {
        const r  = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width/2);
        const dy = e.clientY - (r.top  + r.height/2);
        if (Math.sqrt(dx*dx + dy*dy) < 200) lastActiveRef.current = Date.now();
      }
    }
    window.addEventListener('mousemove', mv, { passive: true });
    return () => window.removeEventListener('mousemove', mv);
  }, []);

  function handleClick(e) {
    setWiggle(true);
    setInactivity(0);
    inactivityRef.current = 0;
    lastActiveRef.current = Date.now();
    setTimeout(() => setWiggle(false), 700);
    onClick?.(e);
  }

  // Glow stays in the blue family — just dims on inactivity
  const glow = {
    idle:      `drop-shadow(0 0 7px ${glowColor(inactivity,0.60)}) drop-shadow(0 0 20px ${glowColor(inactivity,0.25)})`,
    listening: `drop-shadow(0 0 10px ${glowColor(inactivity,0.80)}) drop-shadow(0 0 28px ${glowColor(inactivity,0.38)})`,
    thinking:  `drop-shadow(0 0 14px ${glowColor(inactivity,0.95)}) drop-shadow(0 0 38px ${glowColor(inactivity,0.50)})`,
    speaking:  `drop-shadow(0 0 11px ${glowColor(inactivity,0.85)}) drop-shadow(0 0 30px ${glowColor(inactivity,0.42)})`,
  };
  const shadowAlpha = (0.15 * (1 - inactivity * 0.80)).toFixed(2);
  const floatDur = chatState === 'thinking' ? '2.6s' : chatState === 'speaking' ? '3.2s' : '5.5s';

  return (
    <button
      type="button"
      className="eve-orb-btn"
      onClick={handleClick}
      aria-label={ariaLabel}
      style={{
        position:'fixed',
        right:'max(1.5rem, env(safe-area-inset-right))',
        bottom:'max(1.5rem, env(safe-area-inset-bottom))',
        zIndex:9999,
        padding:0, margin:0, background:'none', border:'none',
        cursor:'pointer', display:'flex', flexDirection:'column',
        alignItems:'center', overflow:'visible',
        WebkitTapHighlightColor:'transparent',
        minWidth:44, minHeight:44,
        visibility: chatOpen ? 'hidden' : 'visible',
        opacity: chatOpen ? 0 : 1,
        pointerEvents: chatOpen ? 'none' : 'auto',
        transition: 'opacity 0.25s ease, visibility 0.25s ease',
      }}
    >
      <div style={{
        display:'flex', flexDirection:'column', alignItems:'center',
        animation: wiggle ? 'eveWiggle 0.7s ease' : `eveFloat ${floatDur} ease-in-out infinite`,
        filter: glow[chatState] || glow.idle,
        transition: 'filter 1.4s ease',
        pointerEvents: 'none',
      }}>
        <canvas
          ref={mountRef}
          style={{ display:'block', width:'110px', height:'110px', background:'transparent', pointerEvents:'none' }}
        />
      </div>

      {/* Ground shadow */}
      <div style={{
        width:54, height:9, borderRadius:'50%',
        background: `rgba(95,162,255,${shadowAlpha})`,
        filter: 'blur(9px)',
        marginTop: -8,
        animation: `eveShadow ${floatDur} ease-in-out infinite`,
        transition: 'background 1.4s ease',
        pointerEvents: 'none',
      }}/>

      <style>{`
        @keyframes eveFloat  { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        @keyframes eveShadow { 0%,100%{transform:scaleX(1);opacity:.30} 50%{transform:scaleX(.54);opacity:.09} }
        @keyframes eveWiggle {
          0%  {transform:translateY(0) rotate(0deg)}
          18% {transform:translateY(-7px) rotate(-11deg)}
          38% {transform:translateY(-2px) rotate(8deg)}
          58% {transform:translateY(-8px) rotate(-5deg)}
          78% {transform:translateY(-1px) rotate(3deg)}
          100%{transform:translateY(0) rotate(0deg)}
        }
        .eve-orb-btn:focus{outline:none}
        .eve-orb-btn:focus-visible{outline:2px solid rgba(95,162,255,0.55);outline-offset:6px;border-radius:50%}
        @media(max-width:768px){
          .eve-orb-btn{
            right:max(.75rem,env(safe-area-inset-right))!important;
            bottom:max(.75rem,env(safe-area-inset-bottom))!important;
          }
          .eve-orb-btn>div:first-of-type{transform:scale(.85);transform-origin:bottom center}
        }
        @media(max-width:380px){
          .eve-orb-btn>div:first-of-type{transform:scale(.72);transform-origin:bottom center}
        }
      `}</style>
    </button>
  );
}