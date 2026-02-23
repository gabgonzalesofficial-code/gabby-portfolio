import { useEffect, useRef, useState } from "react";

// ─── PrismaticBurst — exact React Bits fragment shader ────────────────────────
const VERT = `#version 300 es
in vec2 position;
in vec2 uv;
out vec2 vUv;
void main() { vUv = uv; gl_Position = vec4(position, 0.0, 1.0); }
`;

const FRAG = `#version 300 es
precision highp float;
precision highp int;
out vec4 fragColor;

uniform vec2  uResolution;
uniform float uTime;
uniform float uIntensity;
uniform float uSpeed;
uniform int   uAnimType;
uniform vec2  uMouse;
uniform int   uColorCount;
uniform float uDistort;
uniform vec2  uOffset;
uniform sampler2D uGradient;
uniform float uNoiseAmount;
uniform int   uRayCount;

float hash21(vec2 p){
  p=floor(p);
  float f=52.9829189*fract(dot(p,vec2(0.065,0.005)));
  return fract(f);
}
mat2 rot30(){ return mat2(0.8,-0.5,0.5,0.8); }
float layeredNoise(vec2 fragPx){
  vec2 p=mod(fragPx+vec2(uTime*30.0,-uTime*21.0),1024.0);
  vec2 q=rot30()*p;
  float n=0.0;
  n+=0.40*hash21(q);
  n+=0.25*hash21(q*2.0+17.0);
  n+=0.20*hash21(q*4.0+47.0);
  n+=0.10*hash21(q*8.0+113.0);
  n+=0.05*hash21(q*16.0+191.0);
  return n;
}
vec3 rayDir(vec2 frag,vec2 res,vec2 offset,float dist){
  float focal=res.y*max(dist,1e-3);
  return normalize(vec3(2.0*(frag-offset)-res,focal));
}
float edgeFade(vec2 frag,vec2 res,vec2 offset){
  vec2 toC=frag-0.5*res-offset;
  float r=length(toC)/(0.5*min(res.x,res.y));
  float x=clamp(r,0.0,1.0);
  float q=x*x*x*(x*(x*6.0-15.0)+10.0);
  float s=q*0.5; s=pow(s,1.5);
  float tail=1.0-pow(1.0-s,2.0); s=mix(s,tail,0.2);
  float dn=(layeredNoise(frag*0.15)-0.5)*0.0015*s;
  return clamp(s+dn,0.0,1.0);
}
mat3 rotX(float a){ float c=cos(a),s=sin(a); return mat3(1,0,0, 0,c,-s, 0,s,c); }
mat3 rotY(float a){ float c=cos(a),s=sin(a); return mat3(c,0,s, 0,1,0, -s,0,c); }
mat3 rotZ(float a){ float c=cos(a),s=sin(a); return mat3(c,-s,0, s,c,0, 0,0,1); }
vec3 sampleGradient(float t){ return texture(uGradient,vec2(clamp(t,0.0,1.0),0.5)).rgb; }
vec2 rot2(vec2 v,float a){ float s=sin(a),c=cos(a); return mat2(c,-s,s,c)*v; }
float bendAngle(vec3 q,float t){
  return 0.8*sin(q.x*0.55+t*0.6)+0.7*sin(q.y*0.50-t*0.5)+0.6*sin(q.z*0.60+t*0.7);
}
void main(){
  vec2 frag=gl_FragCoord.xy;
  float t=uTime*uSpeed;
  float jitterAmp=0.1*clamp(uNoiseAmount,0.0,1.0);
  vec3 dir=rayDir(frag,uResolution,uOffset,1.0);
  float marchT=0.0; vec3 col=vec3(0.0);
  float n=layeredNoise(frag);
  vec4 c=cos(t*0.2+vec4(0,33,11,0));
  mat2 M2=mat2(c.x,c.y,c.z,c.w);
  float amp=clamp(uDistort,0.0,50.0)*0.15;
  mat3 rot3dMat=mat3(1.0);
  if(uAnimType==1){ vec3 ang=vec3(t*0.31,t*0.21,t*0.17); rot3dMat=rotZ(ang.z)*rotY(ang.y)*rotX(ang.x); }
  mat3 hoverMat=mat3(1.0);
  if(uAnimType==2){ vec2 m=uMouse*2.0-1.0; hoverMat=rotY(m.x*0.6)*rotX(m.y*0.6); }
  for(int i=0;i<44;++i){
    vec3 P=marchT*dir; P.z-=2.0;
    float rad=length(P);
    vec3 Pl=P*(10.0/max(rad,1e-6));
    if(uAnimType==0){ Pl.xz*=M2; }
    else if(uAnimType==1){ Pl=rot3dMat*Pl; }
    else { Pl=hoverMat*Pl; }
    float stepLen=min(rad-0.3,n*jitterAmp)+0.1;
    float grow=smoothstep(0.35,3.0,marchT);
    float a1=amp*grow*bendAngle(Pl*0.6,t);
    float a2=0.5*amp*grow*bendAngle(Pl.zyx*0.5+3.1,t*0.9);
    vec3 Pb=Pl; Pb.xz=rot2(Pb.xz,a1); Pb.xy=rot2(Pb.xy,a2);
    float rayPattern=smoothstep(0.5,0.7,
      sin(Pb.x+cos(Pb.y)*cos(Pb.z))*sin(Pb.z+sin(Pb.y)*cos(Pb.x+t)));
    if(uRayCount>0){
      float ang=atan(Pb.y,Pb.x);
      float comb=0.5+0.5*cos(float(uRayCount)*ang);
      comb=pow(comb,3.0);
      rayPattern*=smoothstep(0.15,0.95,comb);
    }
    vec3 spectralDefault=1.0+vec3(cos(marchT*3.0),cos(marchT*3.0+1.0),cos(marchT*3.0+2.0));
    float saw=fract(marchT*0.25);
    float tRay=saw*saw*(3.0-2.0*saw);
    vec3 userGradient=2.0*sampleGradient(tRay);
    vec3 spectral=(uColorCount>0)?userGradient:spectralDefault;
    vec3 base=(0.08/(0.4+stepLen))*smoothstep(5.0,0.0,rad)*spectral;
    col+=base*rayPattern;
    marchT+=stepLen;
  }
  col*=edgeFade(frag,uResolution,uOffset);
  col*=uIntensity;
  fragColor=vec4(clamp(col,0.0,1.0),1.0);
}
`;

// ─── WebGL helpers ────────────────────────────────────────────────────────────
function mkShader(gl, type, src) {
  const s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS))
    console.warn(gl.getShaderInfoLog(s));
  return s;
}
function mkProg(gl, vs, fs) {
  const p = gl.createProgram();
  gl.attachShader(p, mkShader(gl, gl.VERTEX_SHADER, vs));
  gl.attachShader(p, mkShader(gl, gl.FRAGMENT_SHADER, fs));
  gl.linkProgram(p);
  if (!gl.getProgramParameter(p, gl.LINK_STATUS))
    console.warn(gl.getProgramInfoLog(p));
  return p;
}
function hexToRgb(hex) {
  let h = hex.trim().replace("#", "");
  if (h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
  const n = parseInt(h, 16);
  return [((n>>16)&255)/255, ((n>>8)&255)/255, (n&255)/255];
}

// ─── Offscreen PrismaticBurst renderer ───────────────────────────────────────
function useBurstTexture(texSize = 256) {
  const s = useRef(null);

  // Lazy init — one canvas, one WebGL2 context, lives for component lifetime
  if (!s.current) {
    const cv = document.createElement("canvas");
    cv.width = cv.height = texSize;
    const gl = cv.getContext("webgl2", { alpha: false, antialias: false });
    if (gl) {
      const prog = mkProg(gl, VERT, FRAG);
      gl.useProgram(prog);

      // Full-screen triangle
      const mkBuf = (data) => {
        const b = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, b);
        gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(data), gl.STATIC_DRAW);
        return b;
      };
      const bindAttr = (prog, name, buf, size) => {
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        const loc = gl.getAttribLocation(prog, name);
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, size, gl.FLOAT, false, 0, 0);
      };
      const posBuf = mkBuf([-1,-1, 3,-1, -1,3]);
      const uvBuf  = mkBuf([0,0, 2,0, 0,2]);
      bindAttr(prog, "position", posBuf, 2);
      bindAttr(prog, "uv", uvBuf, 2);

      // Gradient texture — vibrant prismatic spectrum
      const COLORS = ["#8b5cf6","#a78bfa","#c084fc","#f472b6","#fb923c","#38bdf8","#60a5fa","#c084fc"];
      const gradData = new Uint8Array(COLORS.length * 4);
      COLORS.forEach((hex, i) => {
        const [r,g,b] = hexToRgb(hex);
        gradData[i*4]=r*255; gradData[i*4+1]=g*255; gradData[i*4+2]=b*255; gradData[i*4+3]=255;
      });
      const gradTex = gl.createTexture();
      gl.bindTexture(gl.TEXTURE_2D, gradTex);
      gl.texImage2D(gl.TEXTURE_2D,0,gl.RGBA,COLORS.length,1,0,gl.RGBA,gl.UNSIGNED_BYTE,gradData);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MIN_FILTER,gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_MAG_FILTER,gl.LINEAR);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_S,gl.CLAMP_TO_EDGE);
      gl.texParameteri(gl.TEXTURE_2D,gl.TEXTURE_WRAP_T,gl.CLAMP_TO_EDGE);

      const u = n => gl.getUniformLocation(prog, n);
      // Static uniforms
      gl.uniform2f(u("uResolution"), texSize, texSize);
      gl.uniform1f(u("uIntensity"), 4.2);
      gl.uniform1f(u("uSpeed"), 0.55);
      gl.uniform1i(u("uAnimType"), 1);        // rotate3d
      gl.uniform2f(u("uMouse"), 0.5, 0.5);
      gl.uniform1i(u("uColorCount"), COLORS.length);
      gl.uniform1f(u("uDistort"), 5.5);
      gl.uniform2f(u("uOffset"), 0, 0);
      gl.uniform1f(u("uNoiseAmount"), 0.8);
      gl.uniform1i(u("uRayCount"), 8);        // 8 prismatic rays
      gl.uniform1i(u("uGradient"), 0);
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, gradTex);
      gl.clearColor(0,0,0,1);

      s.current = { cv, gl, u, t: 0 };
    }
  }

  const tick = () => {
    const st = s.current;
    if (!st) return null;
    st.t += 0.016;
    const { gl, u } = st;
    gl.viewport(0, 0, texSize, texSize);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.uniform1f(u("uTime"), st.t);
    gl.drawArrays(gl.TRIANGLES, 0, 3);
    return st.cv;
  };

  return tick;
}

// ─── 3D Prismatic Cube ───────────────────────────────────────────────────────
const PROXIMITY_RADIUS = 220;
const ROT_SENSITIVITY = 0.85;
const LERP_SPEED = 0.11;

function PrismaticCube({ size = 110, onClick }) {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const rafRef    = useRef(null);
  const rotRef    = useRef({ x: 0.52, y: 0.3 });
  const targetRot = useRef({ x: 0.52, y: 0.3 });
  const hovered   = useRef(false);
  const dragRef   = useRef(null);
  const inProximity = useRef(false);
  const burstTick = useBurstTexture(256);

  // Cursor-proximity rotation + drag (window-level for continuity)
  useEffect(() => {
    const onMouseMove = (e) => {
      const d = dragRef.current;
      if (d) {
        rotRef.current.y = d.ry + (e.clientX - d.x) * 0.013;
        rotRef.current.x = d.rx + (e.clientY - d.y) * 0.013;
        targetRot.current.y = rotRef.current.y;
        targetRot.current.x = rotRef.current.x;
        return;
      }
      const el = containerRef.current || canvasRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < PROXIMITY_RADIUS) {
        inProximity.current = true;
        const t = dist / PROXIMITY_RADIUS;
        const strength = 1 - t * 0.4;
        targetRot.current.y = (dx / PROXIMITY_RADIUS) * ROT_SENSITIVITY * strength;
        targetRot.current.x = 0.52 + (dy / PROXIMITY_RADIUS) * ROT_SENSITIVITY * strength;
      } else {
        inProximity.current = false;
      }
    };
    const onMouseUp = () => { dragRef.current = null; };
    window.addEventListener("mousemove", onMouseMove, { passive: true });
    window.addEventListener("mouseup", onMouseUp);
    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
    };
  }, []);

  useEffect(() => {
    const cv = canvasRef.current;
    if (!cv) return;
    const C = size * 2;
    cv.width = C; cv.height = C;
    cv.style.width  = size + "px";
    cv.style.height = size + "px";
    const ctx = cv.getContext("2d");
    const half = C / 2;

    const project = (x, y, z, rx, ry) => {
      const x1=  x*Math.cos(ry)+z*Math.sin(ry);
      const z1= -x*Math.sin(ry)+z*Math.cos(ry);
      const y2=  y*Math.cos(rx)-z1*Math.sin(rx);
      const z2=  y*Math.sin(rx)+z1*Math.cos(rx);
      const fov = C * 1.8;
      const sc  = fov / (fov + z2 + C * 0.5);
      return { sx: half + x1*sc, sy: half + y2*sc, z: z2 };
    };

    const draw = () => {
      const tex = burstTick();

      if (dragRef.current) {
        // Dragging: handled by onMouseMove
      } else if (inProximity.current) {
        rotRef.current.y += (targetRot.current.y - rotRef.current.y) * LERP_SPEED;
        rotRef.current.x += (targetRot.current.x - rotRef.current.x) * LERP_SPEED;
      } else if (!hovered.current) {
        rotRef.current.y += 0.007;
        rotRef.current.x += 0.002;
      }

      const { x: rx, y: ry } = rotRef.current;
      ctx.clearRect(0, 0, C, C);
      const s = C * 0.28;

      const rawVerts = [
        [-s,-s,-s],[s,-s,-s],[s,s,-s],[-s,s,-s],
        [-s,-s, s],[s,-s, s],[s,s, s],[-s,s, s],
      ];
      const verts = rawVerts.map(([x,y,z]) => project(x,y,z,rx,ry));

      const faces = [
        { idx:[4,5,6,7] }, { idx:[1,0,3,2] },
        { idx:[5,1,2,6] }, { idx:[0,4,7,3] },
        { idx:[0,1,5,4] }, { idx:[3,2,6,7] },
      ];
      faces.forEach(f => { f.avgZ = f.idx.reduce((a,i) => a + verts[i].z, 0) / 4; });
      faces.sort((a, b) => a.avgZ - b.avgZ);

      faces.forEach(({ idx }) => {
        const pts = idx.map(i => verts[i]);
        // Back-face cull
        const ax=pts[1].sx-pts[0].sx, ay=pts[1].sy-pts[0].sy;
        const bx=pts[3].sx-pts[0].sx, by=pts[3].sy-pts[0].sy;
        if (ax*by - ay*bx > 0) return;

        // ── Clip to face polygon ──────────────────────────────────
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(pts[0].sx, pts[0].sy);
        pts.slice(1).forEach(p => ctx.lineTo(p.sx, p.sy));
        ctx.closePath();
        ctx.clip();

        // ── Texture via affine transform p0→p1 (u-axis), p0→p3 (v-axis) ──
        if (tex) {
          const GS  = tex.width;
          const dx1 = pts[1].sx - pts[0].sx, dy1 = pts[1].sy - pts[0].sy;
          const dx2 = pts[3].sx - pts[0].sx, dy2 = pts[3].sy - pts[0].sy;
          ctx.setTransform(dx1/GS, dy1/GS, dx2/GS, dy2/GS, pts[0].sx, pts[0].sy);
          ctx.globalAlpha = 1.0;
          ctx.drawImage(tex, 0, 0);
        }
        ctx.restore();

        // ── Glowing edges (uniform across all faces for consistent shape) ──
        ctx.save();
        ctx.beginPath();
        ctx.moveTo(pts[0].sx, pts[0].sy);
        pts.slice(1).forEach(p => ctx.lineTo(p.sx, p.sy));
        ctx.closePath();
        const edgeAlpha = 0.85;
        ctx.strokeStyle = `rgba(255,220,255,${edgeAlpha})`;
        ctx.lineWidth   = 2;
        ctx.shadowColor = "rgba(180,100,255,1)";
        ctx.shadowBlur  = 20;
        ctx.stroke();
        ctx.restore();
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(rafRef.current);
  }, [size]);

  const onMouseDown = e => {
    e.preventDefault();
    dragRef.current = { x:e.clientX, y:e.clientY, rx:rotRef.current.x, ry:rotRef.current.y };
  };
  const onMouseMove = () => {}; // Handled by window mousemove
  const onMouseUp = () => { dragRef.current = null; };

  return (
    <div ref={containerRef} style={{ position: "relative", display: "inline-block" }}>
    <canvas ref={canvasRef}
      style={{
        display:"block", background:"transparent", cursor:"grab", position:"relative", zIndex:10,
        filter:"drop-shadow(0 0 28px rgba(168,100,255,0.9)) drop-shadow(0 0 64px rgba(139,92,246,0.55)) drop-shadow(0 0 12px rgba(96,165,250,0.4))",
      }}
      onClick={onClick}
      onMouseDown={onMouseDown}
      onMouseMove={onMouseMove}
      onMouseUp={onMouseUp}
      onMouseEnter={() => { hovered.current = true; }}
      onMouseLeave={() => { hovered.current = false; }}
    />
    </div>
  );
}

// ─── Chat trigger widget (drop-in replacement for Eve) ────────────────────────
export default function EveRobot({ onClick, "aria-label": ariaLabel = "Open chat" }) {
  const [wiggle, setWiggle] = useState(false);

  const handleClick = (e) => {
    setWiggle(true);
    const t = setTimeout(() => setWiggle(false), 600);
    onClick?.(e);
    return () => clearTimeout(t);
  };

  return (
    <button
      type="button"
      className="prism-chat-trigger"
      onClick={handleClick}
      aria-label={ariaLabel}
      style={{
        position: "fixed",
        right: "1.5rem",
        bottom: "1.5rem",
        zIndex: 50,
        padding: 0,
        margin: 0,
        background: "none",
        border: "none",
        cursor: "pointer",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        overflow: "visible",
        WebkitTapHighlightColor: "transparent",
      }}
    >
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          animation: wiggle ? "prism-wiggle 0.6s ease" : "prism-float 4s ease-in-out infinite",
        }}
      >
        <PrismaticCube size={110} />
      </div>
      <div
        style={{
          width: 56,
          height: 10,
          borderRadius: "50%",
          background: "rgba(140,50,240,0.38)",
          filter: "blur(8px)",
          marginTop: -6,
          animation: "prism-shadow 4s ease-in-out infinite",
        }}
      />
      <style>{`
        @keyframes prism-float { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-9px)} }
        @keyframes prism-shadow { 0%,100%{transform:scaleX(1);opacity:.55} 50%{transform:scaleX(.7);opacity:.28} }
        @keyframes prism-wiggle { 0%{transform:translateY(0) rotate(0)} 18%{transform:translateY(-5px) rotate(-8deg)} 36%{transform:translateY(-2px) rotate(7deg)} 54%{transform:translateY(-7px) rotate(-4deg)} 72%{transform:translateY(-2px) rotate(3deg)} 100%{transform:translateY(0) rotate(0)} }
        .prism-chat-trigger:focus { outline: none; }
        .prism-chat-trigger:focus-visible { outline: 2px solid rgba(168,100,255,0.6); outline-offset: 4px; }
        @media (max-width: 768px) {
          .prism-chat-trigger { right: 0.75rem; bottom: 0.75rem; }
          .prism-chat-trigger > div:first-of-type { transform: scale(0.85); transform-origin: bottom center; }
        }
      `}</style>
    </button>
  );
}
