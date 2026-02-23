import { useEffect, useRef, useState } from "react";

// ─── Shaders (WebGL1 safe — no float loop index) ──────────────────────────────
var VERT_SRC = [
  "precision highp float;",
  "attribute vec3 aPosition;",
  "attribute vec3 aNormal;",
  "attribute vec2 aUV;",
  "uniform mat4 uProjection;",
  "uniform mat4 uView;",
  "uniform mat4 uModel;",
  "uniform mat3 uNormalMatrix;",
  "varying vec3 vNormal;",
  "varying vec2 vUv;",
  "void main() {",
  "  vNormal = normalize(uNormalMatrix * aNormal);",
  "  vUv = aUV;",
  "  gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);",
  "}",
].join("\n");

var FRAG_SRC = [
  "precision highp float;",
  "uniform float uTime;",
  "uniform vec2 uMouse;",
  "uniform float uAmplitude;",
  "uniform float uSpeed;",
  "uniform vec3 uColor;",
  "varying vec3 vNormal;",
  "varying vec2 vUv;",
  "void main() {",
  "  vec2 uv = vUv * 2.0 - 1.0;",
  "  uv += (uMouse - vec2(0.5)) * uAmplitude;",
  "  float d = -uTime * 0.5 * uSpeed;",
  "  float a = 0.0;",
  "  a += cos(0.0 - d - a * uv.x); d += sin(uv.y * 0.0 + a);",
  "  a += cos(1.0 - d - a * uv.x); d += sin(uv.y * 1.0 + a);",
  "  a += cos(2.0 - d - a * uv.x); d += sin(uv.y * 2.0 + a);",
  "  a += cos(3.0 - d - a * uv.x); d += sin(uv.y * 3.0 + a);",
  "  a += cos(4.0 - d - a * uv.x); d += sin(uv.y * 4.0 + a);",
  "  a += cos(5.0 - d - a * uv.x); d += sin(uv.y * 5.0 + a);",
  "  a += cos(6.0 - d - a * uv.x); d += sin(uv.y * 6.0 + a);",
  "  a += cos(7.0 - d - a * uv.x); d += sin(uv.y * 7.0 + a);",
  "  d += uTime * 0.5 * uSpeed;",
  "  vec3 col = vec3(cos(uv * vec2(d, a)) * 0.6 + 0.4, cos(a + d) * 0.5 + 0.5);",
  "  col = cos(col * cos(vec3(d, a, 2.5)) * 0.5 + 0.5) * uColor;",
  "  col = pow(col, vec3(1.1));",
  "  vec3 lightDir = normalize(vec3(1.0, 1.5, 2.0));",
  "  float diff = clamp(dot(vNormal, lightDir), 0.0, 1.0);",
  "  float light = 0.72 + diff * 0.45;",
  "  col *= light;",
  "  gl_FragColor = vec4(col, 1.0);",
  "}",
].join("\n");

// ─── Matrix math ──────────────────────────────────────────────────────────────
function mat4Id() { return new Float32Array([1,0,0,0, 0,1,0,0, 0,0,1,0, 0,0,0,1]); }

function mat4Persp(out, fovy, aspect, near, far) {
  var f = 1.0 / Math.tan(fovy / 2), nf = 1 / (near - far);
  out[0]=f/aspect; out[1]=0;  out[2]=0;              out[3]=0;
  out[4]=0;        out[5]=f;  out[6]=0;              out[7]=0;
  out[8]=0;        out[9]=0;  out[10]=(far+near)*nf; out[11]=-1;
  out[12]=0;       out[13]=0; out[14]=2*far*near*nf; out[15]=0;
}

function mat4LookAt(out, eye, center, up) {
  var fx=center[0]-eye[0], fy=center[1]-eye[1], fz=center[2]-eye[2];
  var l=Math.sqrt(fx*fx+fy*fy+fz*fz); fx/=l; fy/=l; fz/=l;
  var sx=fy*up[2]-fz*up[1], sy=fz*up[0]-fx*up[2], sz=fx*up[1]-fy*up[0];
  l=Math.sqrt(sx*sx+sy*sy+sz*sz); sx/=l; sy/=l; sz/=l;
  var ux=sy*fz-sz*fy, uy=sz*fx-sx*fz, uz=sx*fy-sy*fx;
  out[0]=sx;  out[1]=ux;  out[2]=-fx; out[3]=0;
  out[4]=sy;  out[5]=uy;  out[6]=-fy; out[7]=0;
  out[8]=sz;  out[9]=uz;  out[10]=-fz;out[11]=0;
  out[12]=-(sx*eye[0]+sy*eye[1]+sz*eye[2]);
  out[13]=-(ux*eye[0]+uy*eye[1]+uz*eye[2]);
  out[14]= (fx*eye[0]+fy*eye[1]+fz*eye[2]);
  out[15]=1;
}

function mat4Mul(out, a, b) {
  for (var i=0;i<4;i++) for (var j=0;j<4;j++)
    out[j*4+i] = a[i]*b[j*4] + a[4+i]*b[j*4+1] + a[8+i]*b[j*4+2] + a[12+i]*b[j*4+3];
}

function mat4RX(out, a) {
  var c=Math.cos(a), s=Math.sin(a);
  out[0]=1; out[1]=0;  out[2]=0;  out[3]=0;
  out[4]=0; out[5]=c;  out[6]=s;  out[7]=0;
  out[8]=0; out[9]=-s; out[10]=c; out[11]=0;
  out[12]=0;out[13]=0; out[14]=0; out[15]=1;
}

function mat4RY(out, a) {
  var c=Math.cos(a), s=Math.sin(a);
  out[0]=c;  out[1]=0; out[2]=-s; out[3]=0;
  out[4]=0;  out[5]=1; out[6]=0;  out[7]=0;
  out[8]=s;  out[9]=0; out[10]=c; out[11]=0;
  out[12]=0; out[13]=0;out[14]=0; out[15]=1;
}

function mat3FromMat4(out, m) {
  out[0]=m[0]; out[1]=m[1]; out[2]=m[2];
  out[3]=m[4]; out[4]=m[5]; out[5]=m[6];
  out[6]=m[8]; out[7]=m[9]; out[8]=m[10];
}

// ─── Icosphere geometry ───────────────────────────────────────────────────────
function buildIcosphere(subdivisions) {
  var phi = (1 + Math.sqrt(5)) / 2;
  var raw = [
    [-1,phi,0],[1,phi,0],[-1,-phi,0],[1,-phi,0],
    [0,-1,phi],[0,1,phi],[0,-1,-phi],[0,1,-phi],
    [phi,0,-1],[phi,0,1],[-phi,0,-1],[-phi,0,1],
  ];
  var verts = raw.map(function(v) {
    var l = Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]);
    return [v[0]/l, v[1]/l, v[2]/l];
  });
  var faces = [
    [0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],
    [1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],
    [3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],
    [4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1],
  ].map(function(f){ return [f[0],f[1],f[2]]; });

  var cache = {};
  function mid(a, b) {
    var k = a < b ? a+"_"+b : b+"_"+a;
    if (cache[k] !== undefined) return cache[k];
    var va=verts[a], vb=verts[b];
    var x=(va[0]+vb[0])/2, y=(va[1]+vb[1])/2, z=(va[2]+vb[2])/2;
    var l=Math.sqrt(x*x+y*y+z*z);
    var idx=verts.length;
    verts.push([x/l,y/l,z/l]);
    cache[k]=idx; return idx;
  }

  for (var s=0; s<subdivisions; s++) {
    var next=[];
    for (var fi=0; fi<faces.length; fi++) {
      var f=faces[fi];
      var ab=mid(f[0],f[1]), bc=mid(f[1],f[2]), ca=mid(f[2],f[0]);
      next.push([f[0],ab,ca],[f[1],bc,ab],[f[2],ca,bc],[ab,bc,ca]);
    }
    faces=next;
  }

  var seed=99991;
  function rand() {
    seed=(seed*1664525+1013904223)&0x7fffffff;
    return seed/0x7fffffff;
  }

  var pos=[], nrm=[], uvs=[];
  for (var i=0; i<faces.length; i++) {
    var fa=faces[i];
    var va=verts[fa[0]], vb=verts[fa[1]], vc=verts[fa[2]];
    var e1x=vb[0]-va[0], e1y=vb[1]-va[1], e1z=vb[2]-va[2];
    var e2x=vc[0]-va[0], e2y=vc[1]-va[1], e2z=vc[2]-va[2];
    var nx=e1y*e2z-e1z*e2y, ny=e1z*e2x-e1x*e2z, nz=e1x*e2y-e1y*e2x;
    var nl=Math.sqrt(nx*nx+ny*ny+nz*nz);
    nx/=nl; ny/=nl; nz/=nl;

    var uo=rand(), vo=rand(), rot=rand()*6.2832;
    var co=Math.cos(rot), si=Math.sin(rot);
    var triUV=[[0,0],[1,0],[0.5,0.866]].map(function(uv) {
      var u=uv[0]-0.5, v=uv[1]-0.333;
      return [(co*u-si*v)*0.28+uo*0.72+0.14, (si*u+co*v)*0.28+vo*0.72+0.14];
    });

    var pts=[va,vb,vc];
    for (var vi=0; vi<3; vi++) {
      pos.push(pts[vi][0],pts[vi][1],pts[vi][2]);
      nrm.push(nx,ny,nz);
      uvs.push(triUV[vi][0],triUV[vi][1]);
    }
  }

  return {
    positions: new Float32Array(pos),
    normals:   new Float32Array(nrm),
    uvs:       new Float32Array(uvs),
    count:     faces.length*3,
  };
}

// ─── WebGL setup (runs once, stored in a module-level ref) ────────────────────
function compileShader(gl, type, src) {
  var s = gl.createShader(type);
  gl.shaderSource(s, src);
  gl.compileShader(s);
  if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) {
    console.error("Shader error:", gl.getShaderInfoLog(s), "\n", src);
    return null;
  }
  return s;
}

function createGLResources(canvas, size) {
  var DPR = Math.min(window.devicePixelRatio || 1, 2);
  var W = size * DPR, H = size * DPR;
  canvas.width = W; canvas.height = H;
  canvas.style.width = size + "px"; canvas.style.height = size + "px";

  var gl = canvas.getContext("webgl", { antialias: true, alpha: true, premultipliedAlpha: false });
  if (!gl) { console.error("WebGL unavailable"); return null; }

  gl.enable(gl.DEPTH_TEST);
  gl.enable(gl.CULL_FACE);
  gl.cullFace(gl.BACK);
  gl.clearColor(0,0,0,0);
  gl.viewport(0,0,W,H);

  var vs = compileShader(gl, gl.VERTEX_SHADER, VERT_SRC);
  var fs = compileShader(gl, gl.FRAGMENT_SHADER, FRAG_SRC);
  if (!vs || !fs) return null;

  var prog = gl.createProgram();
  gl.attachShader(prog, vs); gl.attachShader(prog, fs);
  gl.linkProgram(prog);
  if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
    console.error("Link error:", gl.getProgramInfoLog(prog)); return null;
  }

  var geo = buildIcosphere(2);

  function mkBuf(data) {
    var b = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, b);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);
    return b;
  }

  return {
    gl, prog,
    posBuf: mkBuf(geo.positions),
    nrmBuf: mkBuf(geo.normals),
    uvBuf:  mkBuf(geo.uvs),
    count:  geo.count,
    uProj:  gl.getUniformLocation(prog, "uProjection"),
    uView:  gl.getUniformLocation(prog, "uView"),
    uMdl:   gl.getUniformLocation(prog, "uModel"),
    uNrm:   gl.getUniformLocation(prog, "uNormalMatrix"),
    uTime:  gl.getUniformLocation(prog, "uTime"),
    uMouse: gl.getUniformLocation(prog, "uMouse"),
    uAmp:   gl.getUniformLocation(prog, "uAmplitude"),
    uSpd:   gl.getUniformLocation(prog, "uSpeed"),
    uCol:   gl.getUniformLocation(prog, "uColor"),
  };
}

// ─── Component ────────────────────────────────────────────────────────────────
function IridescentIcosphere({ size, onClick }) {
  size = size || 110;
  var cvRef    = useRef(null);
  var glRes    = useRef(null);   // WebGL resources — created once, never destroyed
  var rafRef   = useRef(null);
  var rotRef   = useRef({ x: 0.4, y: 0.0 });
  var tgtRot   = useRef({ x: 0.4, y: 0.0 });
  var dragRef  = useRef(null);
  var hovered  = useRef(false);
  var inProx   = useRef(false);
  var mouseRef = useRef({ x:0.5, y:0.5 });
  var t0       = useRef(null);
  var PROX     = 220;

  // Window-level pointer events
  useEffect(function() {
    function mv(e) {
      var d = dragRef.current;
      if (d) {
        rotRef.current.y = d.ry + (e.clientX - d.x) * 0.015;
        rotRef.current.x = d.rx + (e.clientY - d.y) * 0.015;
        tgtRot.current.x = rotRef.current.x;
        tgtRot.current.y = rotRef.current.y;
        return;
      }
      var el = cvRef.current; if (!el) return;
      var r = el.getBoundingClientRect();
      var dx = e.clientX - (r.left + r.width/2);
      var dy = e.clientY - (r.top  + r.height/2);
      var dist = Math.sqrt(dx*dx + dy*dy);
      if (dist < PROX) {
        inProx.current = true;
        var str = 1 - (dist/PROX)*0.4;
        tgtRot.current.y = (dx/PROX)*1.1*str;
        tgtRot.current.x = 0.4 + (dy/PROX)*0.8*str;
        mouseRef.current = { x: 0.5+(dx/PROX)*0.4, y: 0.5+(dy/PROX)*0.4 };
      } else {
        inProx.current = false;
        mouseRef.current = { x:0.5, y:0.5 };
      }
    }
    function mu() { dragRef.current = null; }
    window.addEventListener("mousemove", mv, { passive: true });
    window.addEventListener("mouseup", mu);
    return function() {
      window.removeEventListener("mousemove", mv);
      window.removeEventListener("mouseup", mu);
    };
  }, []);

  // WebGL render loop — initialises once, restarts loop on re-mount
  useEffect(function() {
    var canvas = cvRef.current;
    if (!canvas) return;

    // Create GL resources only once — reuse on subsequent mounts
    if (!glRes.current) {
      glRes.current = createGLResources(canvas, size);
    }
    var R = glRes.current;
    if (!R) return;

    var gl = R.gl;
    var proj = mat4Id(), view = mat4Id();
    var rx = mat4Id(), ry = mat4Id(), model = mat4Id();
    var nm = new Float32Array(9);

    mat4Persp(proj, Math.PI/4, 1.0, 0.1, 100.0);
    mat4LookAt(view, [0,0,3.4], [0,0,0], [0,1,0]);

    if (!t0.current) t0.current = performance.now();

    var raf;
    function frame() {
      var t = (performance.now() - t0.current) * 0.001;

      if (!dragRef.current) {
        var L = 0.1;
        if (inProx.current) {
          rotRef.current.y += (tgtRot.current.y - rotRef.current.y) * L;
          rotRef.current.x += (tgtRot.current.x - rotRef.current.x) * L;
        } else if (!hovered.current) {
          rotRef.current.y += 0.007;
          rotRef.current.x += 0.002;
        }
      }

      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

      mat4RX(rx, rotRef.current.x);
      mat4RY(ry, rotRef.current.y);
      mat4Mul(model, ry, rx);
      mat3FromMat4(nm, model);

      gl.useProgram(R.prog);

      function attr(name, buf, sz) {
        var loc = gl.getAttribLocation(R.prog, name);
        if (loc < 0) return;
        gl.bindBuffer(gl.ARRAY_BUFFER, buf);
        gl.enableVertexAttribArray(loc);
        gl.vertexAttribPointer(loc, sz, gl.FLOAT, false, 0, 0);
      }
      attr("aPosition", R.posBuf, 3);
      attr("aNormal",   R.nrmBuf, 3);
      attr("aUV",       R.uvBuf,  2);

      gl.uniformMatrix4fv(R.uProj,  false, proj);
      gl.uniformMatrix4fv(R.uView,  false, view);
      gl.uniformMatrix4fv(R.uMdl,   false, model);
      gl.uniformMatrix3fv(R.uNrm,   false, nm);
      gl.uniform1f(R.uTime,  t);
      gl.uniform2f(R.uMouse, mouseRef.current.x, mouseRef.current.y);
      gl.uniform1f(R.uAmp,   0.25);
      gl.uniform1f(R.uSpd,   0.85);
      gl.uniform3f(R.uCol,   0.75, 0.65, 0.95);

      gl.drawArrays(gl.TRIANGLES, 0, R.count);
      raf = requestAnimationFrame(frame);
    }

    frame();

    // On unmount: stop the loop ONLY — do NOT destroy GL context or buffers
    return function() {
      cancelAnimationFrame(raf);
    };
  }, [size]);

  return (
    <canvas
      ref={cvRef}
      style={{
        display: "block", background: "transparent", cursor: "grab",
        filter: "drop-shadow(0 0 18px rgba(180,130,255,0.6)) drop-shadow(0 0 45px rgba(140,160,255,0.28))",
      }}
      onClick={onClick}
      onMouseDown={function(e) {
        e.preventDefault();
        dragRef.current = { x:e.clientX, y:e.clientY, rx:rotRef.current.x, ry:rotRef.current.y };
      }}
      onMouseEnter={function() { hovered.current = true; }}
      onMouseLeave={function() { hovered.current = false; dragRef.current = null; }}
    />
  );
}

// ─── Chat Widget ──────────────────────────────────────────────────────────────
export default function EveRobot({ onClick, "aria-label": ariaLabel }) {
  ariaLabel = ariaLabel || "Open chat";
  var state = useState(false);
  var wiggle = state[0], setWiggle = state[1];

  function handleClick(e) {
    setWiggle(true);
    setTimeout(function() { setWiggle(false); }, 650);
    if (onClick) onClick(e);
  }

  return (
    <button
      type="button"
      className="prism-trigger"
      onClick={handleClick}
      aria-label={ariaLabel}
      style={{
        position:"fixed", right:"1.5rem", bottom:"1.5rem", zIndex:9999,
        padding:0, margin:0, background:"none", border:"none",
        cursor:"pointer", display:"flex", flexDirection:"column",
        alignItems:"center", overflow:"visible",
        WebkitTapHighlightColor:"transparent",
      }}
    >
      <div style={{
        display:"flex", flexDirection:"column", alignItems:"center",
        animation: wiggle ? "prism-wiggle .65s ease" : "prism-float 4s ease-in-out infinite",
      }}>
        <IridescentIcosphere size={110} />
      </div>
      <div style={{
        width:58, height:11, borderRadius:"50%",
        background:"rgba(120,60,255,0.28)",
        filter:"blur(10px)", marginTop:-10,
        animation:"prism-shadow 4s ease-in-out infinite",
      }} />
      <style>{[
        "@keyframes prism-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}",
        "@keyframes prism-shadow{0%,100%{transform:scaleX(1);opacity:.45}50%{transform:scaleX(.6);opacity:.18}}",
        "@keyframes prism-wiggle{",
          "0%{transform:translateY(0) rotate(0deg)}",
          "20%{transform:translateY(-6px) rotate(-10deg)}",
          "40%{transform:translateY(-2px) rotate(8deg)}",
          "60%{transform:translateY(-8px) rotate(-5deg)}",
          "80%{transform:translateY(-1px) rotate(3deg)}",
          "100%{transform:translateY(0) rotate(0deg)}}",
        ".prism-trigger:focus{outline:none}",
        ".prism-trigger:focus-visible{outline:2px solid rgba(160,90,255,.65);outline-offset:6px;border-radius:50%}",
        "@media(max-width:768px){",
          ".prism-trigger{right:.75rem;bottom:.75rem}",
          ".prism-trigger>div:first-of-type{transform:scale(.85);transform-origin:bottom center}}",
      ].join("")}</style>
    </button>
  );
}