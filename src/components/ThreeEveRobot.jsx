/**
 * ThreeEveRobot.jsx — Chat Widget Avatar (GLB model)
 *
 * Renders src/assets/blender/gabby.glb as the floating chat-trigger
 * avatar, replacing the old procedural shader sphere. Framing/lighting
 * auto-normalizes to whatever scale the model was exported at from Blender.
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
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import gsap from 'gsap';
import gabbyModelUrl from '../assets/blender/roboto.glb?url';

// ─── State config — rim-light color/intensity per state ──────────────────────
// No continuous auto-rotation: the character's own gesture animations
// (see CLIP_MAP below) provide the motion now, spinning a gesturing
// humanoid would just look broken.
const STATE_CFG = {
  idle:      { lMin:0.35, lMax:0.75, lDur:5.5, rim:0x5fa2ff },
  listening: { lMin:0.55, lMax:1.05, lDur:3.5, rim:0x50d2a0 },
  thinking:  { lMin:0.60, lMax:1.60, lDur:1.6, rim:0x5fa2ff },
  speaking:  { lMin:0.55, lMax:1.30, lDur:2.4, rim:0x82c3ff },
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

  const inactivityRef = useRef(0);
  const lastActiveRef = useRef(Date.now());
  const lastEmitRef   = useRef(-1);
  const onInactRef    = useRef(onInactivityChange);
  const cursorXRef    = useRef(null); // null = cursor not near, no turn

  const [wiggle,     setWiggle]     = useState(false);
  const [inactivity, setInactivity] = useState(0);
  const [modelReady, setModelReady] = useState(false);
  const [showBubble, setShowBubble] = useState(true);

  // Speech bubble hints at clickability until the user either clicks or
  // ignores it for a while — it shouldn't linger forever.
  useEffect(() => {
    const t = setTimeout(() => setShowBubble(false), 9000);
    return () => clearTimeout(t);
  }, []);

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
    let disposed = false;
    const SIZE = 300;
    const DPR  = Math.min(window.devicePixelRatio || 1, 2);

    const canvas   = mountRef.current;
    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, premultipliedAlpha: false });
    renderer.setSize(SIZE * DPR, SIZE * DPR, false);
    renderer.setPixelRatio(DPR);
    renderer.setClearColor(0x000000, 0);
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;

    const scene  = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(32, 1.0, 0.1, 1000);
    camera.position.set(0, 0, 4.2);
    const clock  = new THREE.Clock();

    // Model group — the loaded GLB is normalized/recentered into this
    const modelGroup = new THREE.Group();
    scene.add(modelGroup);

    // Lighting
    const hemi = new THREE.HemisphereLight(0xbbccff, 0x0d1420, 1.15);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xffffff, 1.0);
    key.position.set(1.5, 2.4, 3);
    scene.add(key);
    const fill = new THREE.DirectionalLight(0xaecbff, 0.35);
    fill.position.set(-2, -0.5, 1.5);
    scene.add(fill);
    const rim = new THREE.PointLight(0x5fa2ff, 0.5, 12);
    rim.position.set(-1.4, 0.6, 1.6);
    scene.add(rim);

    threeRef.current = { renderer, scene, camera, clock, modelGroup, rim };
    startStateAnim('idle');

    // Load the GLB avatar
    const loader = new GLTFLoader();
    loader.load(
      gabbyModelUrl,
      (gltf) => {
        if (disposed) return;
        const model = gltf.scene;

        // No skeleton on this asset — rigid parts (hands, ears, eyes, mouth,
        // pulse rings) animate directly via keyframed node transforms, so a
        // plain bounding box is trustworthy here. Still empirically tuned
        // rather than auto-fit, since the "Robot Origin" node's own animated
        // translation (the idle bob, tracked below) shifts the box anyway.
        const BASE_Y = -0.08;
        model.scale.setScalar(1.25);
        model.position.set(0, BASE_Y, 0);

        modelGroup.add(model);
        threeRef.current.model = model;

        // Single idle clip — plays continuously (loops) regardless of chat
        // state; rim-light color/intensity (startStateAnim) carries the
        // state feedback.
        if (gltf.animations[0]) {
          const mixer = new THREE.AnimationMixer(model);
          const action = mixer.clipAction(gltf.animations[0]);
          action.setLoop(THREE.LoopRepeat, Infinity);
          action.play();
          threeRef.current.mixer = mixer;
        }

        // The clip animates "Robot Origin" up/down (the idle bob) which would
        // otherwise carry the character in and out of frame — track it each
        // frame and cancel the vertical travel so the character stays centered.
        const rootBone = model.getObjectByName('Robot Origin_4');
        if (rootBone) {
          threeRef.current.rootBone  = rootBone;
          threeRef.current.rootBaseY = rootBone.getWorldPosition(new THREE.Vector3()).y;
          threeRef.current.baseModelY = BASE_Y;
        }

        setModelReady(true);
      },
      undefined,
      (err) => console.error('Failed to load avatar model:', err)
    );

    // Render loop
    const tmpVec3 = new THREE.Vector3();
    function loop() {
      rafRef.current = requestAnimationFrame(loop);
      const delta = clock.getDelta();
      const t     = clock.elapsedTime;
      const now   = performance.now();
      const state = chatRef.current;

      threeRef.current.mixer?.update(delta);

      const { rootBone, model } = threeRef.current;
      if (rootBone) {
        const curY = rootBone.getWorldPosition(tmpVec3).y;
        model.position.y = threeRef.current.baseModelY - (curY - threeRef.current.rootBaseY);
      }

      // Breathing — two non-syncing sines, never mechanical
      const breathe = 1.0
        + Math.sin(t * 1.07) * 0.013
        + Math.sin(t * 1.73) * 0.009
        + (state === 'thinking' ? Math.sin(t * 3.1) * 0.007 : 0);
      modelGroup.scale.setScalar(breathe);

      // Turn left/right toward the cursor when it's near; ease back to
      // facing forward otherwise. Horizontal only — no up/down tilt.
      const cx = cursorXRef.current;
      const turnTarget = cx === null ? 0 : Math.max(-0.5, Math.min(0.5, cx / 260));
      modelGroup.rotation.y += (turnTarget - modelGroup.rotation.y) * 0.045;

      // Inactivity drift — dims lights after 20s, like the creature dozing off
      const idleSec  = (Date.now() - lastActiveRef.current) / 1000;
      const tgtInact = Math.min(Math.max((idleSec - 20) / 15, 0), 1);
      inactivityRef.current += (tgtInact - inactivityRef.current) * 0.008;
      const dim = 1 - inactivityRef.current * 0.75;
      hemi.intensity = 1.15 * dim;
      key.intensity  = 1.0  * dim;
      fill.intensity = 0.35 * dim;

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
      disposed = true;
      cancelAnimationFrame(rafRef.current);
      tlRef.current?.kill();
      renderer.dispose();
      modelGroup.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material];
          mats.forEach((m) => {
            Object.values(m).forEach((v) => v?.isTexture && v.dispose());
            m.dispose();
          });
        }
      });
    };
  }, []);

  // ── State → GSAP rim-light breathing animation ────────────────────────────
  function startStateAnim(state) {
    if (!threeRef.current) return;
    const { rim } = threeRef.current;
    const cfg = STATE_CFG[state] || STATE_CFG.idle;
    tlRef.current?.kill();
    rim.color.setHex(cfg.rim);
    tlRef.current = gsap.timeline({ repeat: -1, yoyo: true })
      .to(rim, { intensity: cfg.lMax, duration: cfg.lDur, ease: 'power3.inOut' })
      .to(rim, { intensity: cfg.lMin, duration: cfg.lDur, ease: 'power3.inOut' });
  }

  useEffect(() => { startStateAnim(chatState); }, [chatState]);

  // ── Wakes the widget when the cursor is near, and tracks how far left/right
  //    of center it is so the robot can turn toward it (render loop below) ──
  useEffect(() => {
    function mv(e) {
      const el = mountRef.current;
      if (el) {
        const r  = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width/2);
        const dy = e.clientY - (r.top  + r.height/2);
        const near = Math.sqrt(dx*dx + dy*dy) < 200;
        if (near) lastActiveRef.current = Date.now();
        cursorXRef.current = near ? dx : null;
      }
    }
    window.addEventListener('mousemove', mv, { passive: true });
    return () => window.removeEventListener('mousemove', mv);
  }, []);

  function handleClick(e) {
    setWiggle(true);
    setShowBubble(false);
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

  return (
    <button
      type="button"
      className="eve-orb-btn"
      onClick={handleClick}
      aria-label={ariaLabel}
      style={{
        position:'fixed',
        right:'max(0.25rem, env(safe-area-inset-right))',
        bottom:'max(0.75rem, env(safe-area-inset-bottom))',
        zIndex:9999,
        padding:0, margin:0, background:'none', border:'none',
        cursor:'pointer', display:'flex', flexDirection:'column',
        alignItems:'center', overflow:'visible',
        WebkitTapHighlightColor:'transparent',
        minWidth:44, minHeight:44,
      }}
    >
      {/* Speech bubble — hints this is clickable, fades after a while or on first click */}
      <div
        role="presentation"
        style={{
          position:'absolute',
          bottom:'calc(100% + 6px)',
          right:'50%',
          transform: showBubble ? 'translateX(50%) translateY(0)' : 'translateX(50%) translateY(6px)',
          opacity: showBubble && !chatOpen ? 1 : 0,
          pointerEvents:'none',
          transition:'opacity 0.4s ease, transform 0.4s ease',
          animation: showBubble ? 'eveBubbleFloat 2.6s ease-in-out infinite' : 'none',
        }}
      >
        <div style={{
          background:'rgba(19,27,42,0.96)',
          border:'1px solid rgba(95,162,255,0.28)',
          borderRadius:12,
          padding:'8px 13px',
          whiteSpace:'nowrap',
          fontSize:13,
          fontWeight:500,
          color:'rgba(220,232,252,0.94)',
          fontFamily:"-apple-system,'Helvetica Neue',sans-serif",
          boxShadow:'0 8px 24px rgba(0,0,0,0.28), 0 0 0 1px rgba(95,162,255,0.05)',
        }}>
          Ask me anything! 👋
        </div>
        {/* Tail */}
        <div style={{
          position:'absolute', left:'50%', top:'100%',
          transform:'translateX(-50%)',
          width:0, height:0,
          borderLeft:'6px solid transparent',
          borderRight:'6px solid transparent',
          borderTop:'6px solid rgba(19,27,42,0.96)',
        }}/>
      </div>

      <div style={{
        display:'flex', flexDirection:'column', alignItems:'center',
        animation: wiggle ? 'eveWiggle 0.7s ease' : 'none',
        filter: glow[chatState] || glow.idle,
        transition: 'filter 1.4s ease',
        pointerEvents: 'none',
        position: 'relative',
        width: 150, height: 150,
      }}>
        {/* Placeholder — visible until the GLB finishes loading */}
        <div style={{
          position:'absolute', inset:0, borderRadius:'50%',
          background:'radial-gradient(circle at 38% 36%, rgba(95,162,255,0.20) 0%, rgba(28,50,95,0.55) 45%, rgba(19,27,42,0.92) 100%)',
          opacity: modelReady ? 0 : 1,
          transition: 'opacity 0.5s ease',
          animationName: modelReady ? 'none' : 'evePlaceholderPulse',
          animationDuration: '1.8s',
          animationTimingFunction: 'ease-in-out',
          animationIterationCount: 'infinite',
        }}/>
        <canvas
          ref={mountRef}
          style={{
            display:'block', width:'300px', height:'300px',
            background:'transparent', pointerEvents:'none',
            opacity: modelReady ? 1 : 0,
            transition: 'opacity 0.5s ease',
          }}
        />
      </div>

      {/* Ground shadow */}
      <div style={{
        width:54, height:9, borderRadius:'50%',
        background: `rgba(95,162,255,${shadowAlpha})`,
        filter: 'blur(9px)',
        marginTop: -8,
        opacity: 0.30,
        transition: 'background 1.4s ease',
        pointerEvents: 'none',
      }}/>

      <style>{`
        @keyframes evePlaceholderPulse { 0%,100%{opacity:.75} 50%{opacity:1} }
        @keyframes eveBubbleFloat {
          0%,100% { transform:translateX(50%) translateY(0); }
          50%     { transform:translateX(50%) translateY(-4px); }
        }
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
