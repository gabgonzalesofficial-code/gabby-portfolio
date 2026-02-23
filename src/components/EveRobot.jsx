/**
 * EveRobot.jsx — Sentient AI Orb Chat Widget
 *
 * Props:
 *   onClick       — called when orb is clicked (wire to setOpen(true))
 *   chatState     — 'idle' | 'listening' | 'thinking' | 'speaking'
 *   aria-label    — accessibility label
 *
 * Parent wiring example:
 *   const [open, setOpen] = useState(false);
 *   const [chatState, setChatState] = useState('idle');
 *   <EveRobot onClick={() => setOpen(true)} chatState={chatState} />
 *   <ChatBot isOpen={open} onClose={() => { setOpen(false); setChatState('idle'); }} onStateChange={setChatState} />
 */
import { useEffect, useRef, useState } from "react";

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
  "varying vec3 vPosition;",
  "varying vec2 vUv;",
  "void main() {",
  "  vNormal   = normalize(uNormalMatrix * aNormal);",
  "  vPosition = aPosition;",
  "  vUv       = aUV;",
  "  gl_Position = uProjection * uView * uModel * vec4(aPosition, 1.0);",
  "}",
].join("\n");

var FRAG_SRC = [
  "precision highp float;",
  "uniform float uTime;",
  "uniform vec2  uMouse;",
  "uniform float uAmplitude;",
  "uniform float uSpeed;",
  "uniform vec3  uColor;",
  "uniform float uState;",
  "uniform float uInactivity;",
  "uniform vec3  uViewDir;",
  "varying vec3 vNormal;",
  "varying vec3 vPosition;",
  "varying vec2 vUv;",

  // ── Helpers ──────────────────────────────────────────────────────────
  "float hash(vec2 p){p=fract(p*vec2(127.1,311.7));p+=dot(p,p+19.19);return fract(p.x*p.y);}",

  // 2-D value noise (bilinear smooth)
  "float noise2(vec2 p){",
  "  vec2 i=floor(p); vec2 f=fract(p);",
  "  vec2 u=f*f*(3.0-2.0*f);",
  "  return mix(mix(hash(i),hash(i+vec2(1,0)),u.x),",
  "             mix(hash(i+vec2(0,1)),hash(i+vec2(1,1)),u.x),u.y);",
  "}",

  // Hex grid → (edge dist, cell id)
  "vec2 hexGrid(vec2 uv,float scale){uv*=scale;vec2 s=vec2(1.0,1.732);vec2 a=mod(uv,s)-s*0.5;vec2 b=mod(uv-s*0.5,s)-s*0.5;vec2 gv=dot(a,a)<dot(b,b)?a:b;float edge=0.5-max(abs(gv.x)*1.155,abs(gv.y));float id=hash(uv-gv);return vec2(edge,id);}",

  // Cosine palette: aurora colors
  // warmth 0 = cool (cyan/teal/violet)   warmth 1 = warm (amber/gold/orange)
  "vec3 auroraPalette(float t, float warmth){",
  "  vec3 dc=vec3(0.0,0.33,0.67); vec3 dw=vec3(0.0,0.12,0.22);",
  "  vec3 cool=0.5+0.5*cos(6.2832*(vec3(1.0,1.0,1.0)*t+dc));",
  "  vec3 warm=0.5+0.5*cos(6.2832*(vec3(1.0,1.0,1.0)*t+dw));",
  "  return mix(cool,warm,warmth);",
  "}",

  // ── Main ─────────────────────────────────────────────────────────────
  "void main(){",
  "  vec3 eyeDir=normalize(uViewDir);",
  "  float fresnel=pow(1.0-max(dot(vNormal,eyeDir),0.0),2.6);",

  // State masks
  "  float sListening=step(0.5,uState)*(1.0-step(1.5,uState));",
  "  float sThinking =step(1.5,uState)*(1.0-step(2.5,uState));",
  "  float sSpeaking =step(2.5,uState);",
  "  float sActive   =step(0.5,uState);",

  "  vec3 energyCol=mix(uColor,vec3(0.88,0.44,0.08),uInactivity);",
  "  vec2 suv=vUv+(uMouse-vec2(0.5))*uAmplitude*0.35;",
  "  float t=uTime*uSpeed;",

  // ── LIQUID ETHER — domain warp ────────────────────────────────────────
  // First warp layer: large-scale slow rolling distortion
  "  vec2 w1=vec2(",
  "    sin(suv.y*4.2+t*0.55)*cos(suv.x*3.1+t*0.38),",
  "    cos(suv.x*3.8+t*0.47)*sin(suv.y*4.5+t*0.62)",
  "  );",
  // Second warp layer: feeds off first — creates turbulent depth
  "  vec2 w2=vec2(",
  "    sin(suv.x*5.1+w1.y*2.1+t*0.31),",
  "    cos(suv.y*4.7+w1.x*2.1+t*0.44)",
  "  );",
  // Active states = slightly more turbulent ether
  "  float wStr=0.052+sActive*0.022;",
  "  vec2 wuv=suv+(w1*0.62+w2*0.38)*wStr;",

  // Subsurface ether glow — two noise octaves in warped space
  // Creates a glowing-from-within sense of viscous fluid
  "  float ethA=noise2(wuv*6.0+vec2(t*0.28,t*0.19));",
  "  float ethB=noise2(wuv*12.0-vec2(t*0.17,t*0.33));",
  "  float ether=(ethA*0.65+ethB*0.35);",
  // Boost ether in the core (not the rim — rim is for aurora)
  "  ether*=0.55+(1.0-fresnel)*0.45;",

  // ── AURORA RIBBONS ────────────────────────────────────────────────────
  // Four narrow flowing bands at different angles/speeds in warped UV
  // pow() sharpens the sine into a tight ribbon with soft shoulders
  "  float b1=pow(sin(wuv.x*6.0+wuv.y*2.5+t*0.45       )*0.5+0.5, 3.5);",
  "  float b2=pow(sin(wuv.x*4.0-wuv.y*3.2+t*0.33+1.40  )*0.5+0.5, 4.0);",
  "  float b3=pow(sin(wuv.y*5.5+wuv.x*1.8+t*0.61+2.90  )*0.5+0.5, 3.0);",
  "  float b4=pow(sin(wuv.x*3.0+wuv.y*4.8-t*0.27+4.20  )*0.5+0.5, 4.5);",

  // Each band gets its own palette phase — slow color drift over time
  "  float ph=t*0.07;",
  "  vec3 ac1=auroraPalette(ph+0.00,uInactivity)*b1;",
  "  vec3 ac2=auroraPalette(ph+0.25,uInactivity)*b2;",
  "  vec3 ac3=auroraPalette(ph+0.50,uInactivity)*b3;",
  "  vec3 ac4=auroraPalette(ph+0.75,uInactivity)*b4;",
  "  vec3 aurora=(ac1+ac2+ac3+ac4)*0.38;",

  // Aurora concentrates on the rim (like a planet's atmosphere) + state boost
  "  float aStr=(0.45+fresnel*0.55)*(0.75+sActive*0.3);",

  // ── HEX GRID ──────────────────────────────────────────────────────────
  "  vec2 hex1=hexGrid(suv+vec2(t*0.04,0.0),9.0);",
  "  vec2 hex2=hexGrid(suv+vec2(-t*0.025,t*0.02),14.0);",
  "  float grid=(1.0-smoothstep(0.04,0.12,hex1.x))*0.9+(1.0-smoothstep(0.02,0.08,hex2.x))*0.4;",

  // ── STATE EFFECTS ─────────────────────────────────────────────────────
  "  float beat=1.8+sListening*1.4+sThinking*0.6+sSpeaking*2.0;",
  "  float cellGlow=(sin(t*beat+hex1.y*47.3)*0.5+0.5)*(sin(t*beat*0.6+hex2.y*31.7)*0.5+0.5)*(1.0-hex1.x)*(0.5+sActive*0.35);",
  "  float scanY=fract(vPosition.y*0.5+t*(0.15+sListening*0.18+sThinking*0.12+sSpeaking*0.25));",
  "  float scan=smoothstep(0.94,1.0,scanY)*(0.45+sActive*0.35);",
  "  float ripple=pow(sin((length(vUv-uMouse)*18.0-t*3.5))*0.5+0.5,3.0)*uAmplitude*0.5;",
  "  float tRings=pow(sin(length(vPosition.xy)*14.0-uTime*uSpeed*5.5+atan(vPosition.y,vPosition.x)*2.0)*0.5+0.5,2.0)*(1.0-length(vPosition.xy)*0.75)*sThinking;",
  "  float sWave=pow(sin(length(vPosition.xy)*9.0-uTime*uSpeed*7.5)*0.5+0.5,2.5)*(1.0-length(vPosition.xy)*0.6)*sSpeaking;",

  // ── COMPOSE — back to front ───────────────────────────────────────────
  // 1. Deep space core
  "  vec3 base=mix(vec3(0.01,0.04,0.14),energyCol,fresnel*0.65);",
  // 2. Subsurface ether (deep, interior glow)
  "  base+=energyCol*ether*0.20;",
  // 3. Aurora ribbons (layer over ether, bias toward rim)
  "  base+=aurora*aStr*0.52;",
  // 4. Hex grid lines (structural skeleton floats on top)
  "  base=mix(base,energyCol*1.7+vec3(0.0,0.15,0.08),grid*0.42);",
  // 5. Cell glow + scan + state waves
  "  base+=mix(energyCol,vec3(0.3,1.0,0.85),0.35)*cellGlow*0.42;",
  "  base+=energyCol*(scan+ripple+tRings*0.65+sWave*0.6+fresnel*sListening*0.5);",
  // 6. Fresnel rim corona
  "  base+=energyCol*pow(fresnel,1.5)*(1.1+sActive*0.4);",
  // 7. Specular highlight
  "  vec3 ld=normalize(vec3(1.0,1.5,2.0));",
  "  base+=vec3(0.35,0.9,1.0)*pow(max(dot(reflect(-ld,vNormal),eyeDir),0.0),38.0)*0.65;",
  // 8. Diffuse shading + state brightness
  "  base*=(0.7+clamp(dot(vNormal,ld),0.0,1.0)*0.55)*(0.82+sListening*0.1+sThinking*0.18+sSpeaking*0.12);",
  "  gl_FragColor=vec4(base,1.0);",
  "}",
].join("\n");

function mat4Id(){return new Float32Array([1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]);}
function mat4Persp(o,f,a,n,fr){var t=1/Math.tan(f/2),nf=1/(n-fr);o[0]=t/a;o[1]=0;o[2]=0;o[3]=0;o[4]=0;o[5]=t;o[6]=0;o[7]=0;o[8]=0;o[9]=0;o[10]=(fr+n)*nf;o[11]=-1;o[12]=0;o[13]=0;o[14]=2*fr*n*nf;o[15]=0;}
function mat4LookAt(o,e,c,u){var fx=c[0]-e[0],fy=c[1]-e[1],fz=c[2]-e[2],l=Math.sqrt(fx*fx+fy*fy+fz*fz);fx/=l;fy/=l;fz/=l;var sx=fy*u[2]-fz*u[1],sy=fz*u[0]-fx*u[2],sz=fx*u[1]-fy*u[0];l=Math.sqrt(sx*sx+sy*sy+sz*sz);sx/=l;sy/=l;sz/=l;var ux=sy*fz-sz*fy,uy=sz*fx-sx*fz,uz=sx*fy-sy*fx;o[0]=sx;o[1]=ux;o[2]=-fx;o[3]=0;o[4]=sy;o[5]=uy;o[6]=-fy;o[7]=0;o[8]=sz;o[9]=uz;o[10]=-fz;o[11]=0;o[12]=-(sx*e[0]+sy*e[1]+sz*e[2]);o[13]=-(ux*e[0]+uy*e[1]+uz*e[2]);o[14]=fx*e[0]+fy*e[1]+fz*e[2];o[15]=1;}
function mat4Mul(o,a,b){for(var i=0;i<4;i++)for(var j=0;j<4;j++)o[j*4+i]=a[i]*b[j*4]+a[4+i]*b[j*4+1]+a[8+i]*b[j*4+2]+a[12+i]*b[j*4+3];}
function mat4RX(o,a){var c=Math.cos(a),s=Math.sin(a);o[0]=1;o[1]=0;o[2]=0;o[3]=0;o[4]=0;o[5]=c;o[6]=s;o[7]=0;o[8]=0;o[9]=-s;o[10]=c;o[11]=0;o[12]=0;o[13]=0;o[14]=0;o[15]=1;}
function mat4RY(o,a){var c=Math.cos(a),s=Math.sin(a);o[0]=c;o[1]=0;o[2]=-s;o[3]=0;o[4]=0;o[5]=1;o[6]=0;o[7]=0;o[8]=s;o[9]=0;o[10]=c;o[11]=0;o[12]=0;o[13]=0;o[14]=0;o[15]=1;}
function mat3FromMat4(o,m){o[0]=m[0];o[1]=m[1];o[2]=m[2];o[3]=m[4];o[4]=m[5];o[5]=m[6];o[6]=m[8];o[7]=m[9];o[8]=m[10];}

function buildIcosphere(sub){var phi=(1+Math.sqrt(5))/2;var raw=[[-1,phi,0],[1,phi,0],[-1,-phi,0],[1,-phi,0],[0,-1,phi],[0,1,phi],[0,-1,-phi],[0,1,-phi],[phi,0,-1],[phi,0,1],[-phi,0,-1],[-phi,0,1]];var verts=raw.map(function(v){var l=Math.sqrt(v[0]*v[0]+v[1]*v[1]+v[2]*v[2]);return[v[0]/l,v[1]/l,v[2]/l];});var faces=[[0,11,5],[0,5,1],[0,1,7],[0,7,10],[0,10,11],[1,5,9],[5,11,4],[11,10,2],[10,7,6],[7,1,8],[3,9,4],[3,4,2],[3,2,6],[3,6,8],[3,8,9],[4,9,5],[2,4,11],[6,2,10],[8,6,7],[9,8,1]].map(function(f){return[f[0],f[1],f[2]];});var cache={};function mid(a,b){var k=a<b?a+"_"+b:b+"_"+a;if(cache[k]!==undefined)return cache[k];var va=verts[a],vb=verts[b];var x=(va[0]+vb[0])/2,y=(va[1]+vb[1])/2,z=(va[2]+vb[2])/2;var l=Math.sqrt(x*x+y*y+z*z);var idx=verts.length;verts.push([x/l,y/l,z/l]);cache[k]=idx;return idx;}for(var s=0;s<sub;s++){var next=[];for(var fi=0;fi<faces.length;fi++){var f=faces[fi];var ab=mid(f[0],f[1]),bc=mid(f[1],f[2]),ca=mid(f[2],f[0]);next.push([f[0],ab,ca],[f[1],bc,ab],[f[2],ca,bc],[ab,bc,ca]);}faces=next;}var seed=99991;function rand(){seed=(seed*1664525+1013904223)&0x7fffffff;return seed/0x7fffffff;}var pos=[],nrm=[],uvs=[];for(var i=0;i<faces.length;i++){var fa=faces[i];var va=verts[fa[0]],vb=verts[fa[1]],vc=verts[fa[2]];var e1x=vb[0]-va[0],e1y=vb[1]-va[1],e1z=vb[2]-va[2],e2x=vc[0]-va[0],e2y=vc[1]-va[1],e2z=vc[2]-va[2];var nx=e1y*e2z-e1z*e2y,ny=e1z*e2x-e1x*e2z,nz=e1x*e2y-e1y*e2x;var nl=Math.sqrt(nx*nx+ny*ny+nz*nz);nx/=nl;ny/=nl;nz/=nl;var uo=rand(),vo=rand(),rot=rand()*6.2832;var co=Math.cos(rot),si=Math.sin(rot);var triUV=[[0,0],[1,0],[0.5,0.866]].map(function(uv){var u=uv[0]-0.5,v=uv[1]-0.333;return[(co*u-si*v)*0.28+uo*0.72+0.14,(si*u+co*v)*0.28+vo*0.72+0.14];});var pts=[va,vb,vc];for(var vi=0;vi<3;vi++){pos.push(pts[vi][0],pts[vi][1],pts[vi][2]);nrm.push(nx,ny,nz);uvs.push(triUV[vi][0],triUV[vi][1]);}}return{positions:new Float32Array(pos),normals:new Float32Array(nrm),uvs:new Float32Array(uvs),count:faces.length*3};}

function compileShader(gl,t,src){var s=gl.createShader(t);gl.shaderSource(s,src);gl.compileShader(s);if(!gl.getShaderParameter(s,gl.COMPILE_STATUS)){console.error(gl.getShaderInfoLog(s));return null;}return s;}

function createGLResources(canvas,size){var DPR=Math.min(window.devicePixelRatio||1,2),W=size*DPR,H=size*DPR;canvas.width=W;canvas.height=H;canvas.style.width=size+"px";canvas.style.height=size+"px";var gl=canvas.getContext("webgl",{antialias:true,alpha:true,premultipliedAlpha:false});if(!gl)return null;gl.enable(gl.DEPTH_TEST);gl.enable(gl.CULL_FACE);gl.cullFace(gl.BACK);gl.clearColor(0,0,0,0);gl.viewport(0,0,W,H);var vs=compileShader(gl,gl.VERTEX_SHADER,VERT_SRC),fs=compileShader(gl,gl.FRAGMENT_SHADER,FRAG_SRC);if(!vs||!fs)return null;var prog=gl.createProgram();gl.attachShader(prog,vs);gl.attachShader(prog,fs);gl.linkProgram(prog);if(!gl.getProgramParameter(prog,gl.LINK_STATUS)){console.error(gl.getProgramInfoLog(prog));return null;}var geo=buildIcosphere(3);function mkBuf(d){var b=gl.createBuffer();gl.bindBuffer(gl.ARRAY_BUFFER,b);gl.bufferData(gl.ARRAY_BUFFER,d,gl.STATIC_DRAW);return b;}return{gl,prog,posBuf:mkBuf(geo.positions),nrmBuf:mkBuf(geo.normals),uvBuf:mkBuf(geo.uvs),count:geo.count,uProj:gl.getUniformLocation(prog,"uProjection"),uView:gl.getUniformLocation(prog,"uView"),uMdl:gl.getUniformLocation(prog,"uModel"),uNrm:gl.getUniformLocation(prog,"uNormalMatrix"),uTime:gl.getUniformLocation(prog,"uTime"),uMouse:gl.getUniformLocation(prog,"uMouse"),uAmp:gl.getUniformLocation(prog,"uAmplitude"),uSpd:gl.getUniformLocation(prog,"uSpeed"),uCol:gl.getUniformLocation(prog,"uColor"),uState:gl.getUniformLocation(prog,"uState"),uInactivity:gl.getUniformLocation(prog,"uInactivity"),uVDir:gl.getUniformLocation(prog,"uViewDir")};}

var STATE_PARAMS={idle:{val:0,speed:0.52,amp:0.10},listening:{val:1,speed:0.72,amp:0.13},thinking:{val:2,speed:1.10,amp:0.11},speaking:{val:3,speed:0.88,amp:0.14}};

function IridescentIcosphere({ size, chatState, onInactivityChange }) {
  size = size || 110;
  chatState = chatState || 'idle';
  var cvRef=useRef(null),glRes=useRef(null);
  var rotRef=useRef({x:0.4,y:0.0}),tgtRot=useRef({x:0.4,y:0.0});
  var dragRef=useRef(null),hovered=useRef(false);
  var inProx=useRef(false),inNearProx=useRef(false);
  var mouseRef=useRef({x:0.5,y:0.5}),cursorRef=useRef({x:0,y:0});
  var t0=useRef(null),chatStateRef=useRef(chatState);
  var inactivityRef=useRef(0),lastActiveRef=useRef(Date.now());
  var twitchRef=useRef({vx:0,vy:0}),lastTwitchRef=useRef(Date.now()),nextTwitchRef=useRef(10000+Math.random()*5000);
  var onInactivityRef=useRef(onInactivityChange);
  var lastEmittedInactivity=useRef(-1);
  useEffect(function(){ onInactivityRef.current=onInactivityChange; },[onInactivityChange]);

  useEffect(function(){ chatStateRef.current=chatState; },[chatState]);
  useEffect(function(){ if(chatState!=='idle') lastActiveRef.current=Date.now(); },[chatState]);

  useEffect(function(){
    var PROX=200,NEAR=75;
    function mv(e){
      cursorRef.current={x:e.clientX,y:e.clientY};
      var d=dragRef.current;
      if(d){rotRef.current.y=d.ry+(e.clientX-d.x)*0.015;rotRef.current.x=d.rx+(e.clientY-d.y)*0.015;tgtRot.current.x=rotRef.current.x;tgtRot.current.y=rotRef.current.y;lastActiveRef.current=Date.now();return;}
      var el=cvRef.current;if(!el)return;
      var r=el.getBoundingClientRect(),dx=e.clientX-(r.left+r.width/2),dy=e.clientY-(r.top+r.height/2),dist=Math.sqrt(dx*dx+dy*dy);
      inNearProx.current=dist<NEAR;
      if(dist<PROX){inProx.current=true;lastActiveRef.current=Date.now();var str=1-(dist/PROX)*0.4;tgtRot.current.y=(dx/PROX)*1.1*str;tgtRot.current.x=0.4+(dy/PROX)*0.8*str;mouseRef.current={x:0.5+(dx/PROX)*0.4,y:0.5+(dy/PROX)*0.4};}
      else{inProx.current=false;inNearProx.current=false;mouseRef.current={x:0.5,y:0.5};}
    }
    function mu(){dragRef.current=null;}
    window.addEventListener("mousemove",mv,{passive:true});
    window.addEventListener("mouseup",mu);
    return function(){window.removeEventListener("mousemove",mv);window.removeEventListener("mouseup",mu);};
  },[]);

  useEffect(function(){
    var canvas=cvRef.current;if(!canvas)return;
    if(!glRes.current)glRes.current=createGLResources(canvas,size);
    var R=glRes.current;if(!R)return;
    var gl=R.gl,proj=mat4Id(),view=mat4Id(),rx=mat4Id(),ry=mat4Id(),model=mat4Id(),bModel=mat4Id(),nm=new Float32Array(9);
    mat4Persp(proj,Math.PI/4,1.0,0.1,100.0);mat4LookAt(view,[0,0,3.4],[0,0,0],[0,1,0]);
    if(!t0.current)t0.current=performance.now();
    var raf;
    function frame(){
      var now=performance.now(),t=(now-t0.current)*0.001;
      if(!dragRef.current){
        if(inProx.current){rotRef.current.y+=(tgtRot.current.y-rotRef.current.y)*0.09;rotRef.current.x+=(tgtRot.current.x-rotRef.current.x)*0.09;}
        else if(!hovered.current){rotRef.current.y+=0.003;rotRef.current.x+=0.0008;}
      }
      if(chatStateRef.current==='idle'&&now-lastTwitchRef.current>nextTwitchRef.current){twitchRef.current.vx=(Math.random()-0.5)*0.18;twitchRef.current.vy=(Math.random()-0.5)*0.32;lastTwitchRef.current=now;nextTwitchRef.current=(8+Math.random()*7)*1000;}
      if(Math.abs(twitchRef.current.vx)>0.0001||Math.abs(twitchRef.current.vy)>0.0001){rotRef.current.x+=twitchRef.current.vx;rotRef.current.y+=twitchRef.current.vy;twitchRef.current.vx*=0.82;twitchRef.current.vy*=0.82;}
      var idleSec=(Date.now()-lastActiveRef.current)/1000;
      inactivityRef.current+=(Math.min(Math.max((idleSec-20)/15,0),1)-inactivityRef.current)*0.01;
      var rounded=Math.round(inactivityRef.current*100)/100;
      if(Math.abs(rounded-lastEmittedInactivity.current)>=0.01){lastEmittedInactivity.current=rounded;onInactivityRef.current&&onInactivityRef.current(rounded);}
      var breathe=1.0+Math.sin(t*1.07)*0.013+Math.sin(t*1.73)*0.009+(chatStateRef.current==='thinking'?Math.sin(t*3.1)*0.006:0);
      mat4RX(rx,rotRef.current.x);mat4RY(ry,rotRef.current.y);mat4Mul(model,ry,rx);
      for(var i=0;i<12;i++)bModel[i]=model[i]*breathe;
      bModel[12]=model[12];bModel[13]=model[13];bModel[14]=model[14];bModel[15]=model[15];
      mat3FromMat4(nm,bModel);
      gl.clear(gl.COLOR_BUFFER_BIT|gl.DEPTH_BUFFER_BIT);gl.useProgram(R.prog);
      function attr(n,buf,sz){var loc=gl.getAttribLocation(R.prog,n);if(loc<0)return;gl.bindBuffer(gl.ARRAY_BUFFER,buf);gl.enableVertexAttribArray(loc);gl.vertexAttribPointer(loc,sz,gl.FLOAT,false,0,0);}
      attr("aPosition",R.posBuf,3);attr("aNormal",R.nrmBuf,3);attr("aUV",R.uvBuf,2);
      var sp=STATE_PARAMS[chatStateRef.current]||STATE_PARAMS.idle,nb=inNearProx.current?1.3:1.0;
      var el=cvRef.current,eyeX=0,eyeY=0;
      if(el){var r=el.getBoundingClientRect();eyeX=(cursorRef.current.x-(r.left+r.width/2))/(r.width*1.5);eyeY=-(cursorRef.current.y-(r.top+r.height/2))/(r.height*1.5);}
      var eyeL=Math.sqrt(eyeX*eyeX+eyeY*eyeY+1.0);
      gl.uniformMatrix4fv(R.uProj,false,proj);gl.uniformMatrix4fv(R.uView,false,view);gl.uniformMatrix4fv(R.uMdl,false,bModel);gl.uniformMatrix3fv(R.uNrm,false,nm);
      gl.uniform1f(R.uTime,t);gl.uniform2f(R.uMouse,mouseRef.current.x,mouseRef.current.y);
      gl.uniform1f(R.uAmp,sp.amp*nb);gl.uniform1f(R.uSpd,sp.speed*nb);
      gl.uniform3f(R.uCol,0.05,0.72,0.95);
      gl.uniform1f(R.uState,sp.val);gl.uniform1f(R.uInactivity,inactivityRef.current);
      gl.uniform3f(R.uVDir,eyeX/eyeL,eyeY/eyeL,1.0/eyeL);
      gl.drawArrays(gl.TRIANGLES,0,R.count);
      raf=requestAnimationFrame(frame);
    }
    frame();
    return function(){cancelAnimationFrame(raf);};
  },[size]);

  return (
    <canvas
      ref={cvRef}
      style={{
        display:"block",background:"transparent",
        pointerEvents:"none",
        // filter is passed down from EveRobot so it can include inactivity color
        filter:"inherit",
      }}
      onMouseDown={function(e){
        dragRef.current={x:e.clientX,y:e.clientY,rx:rotRef.current.x,ry:rotRef.current.y};
        lastActiveRef.current=Date.now();
      }}
      onMouseEnter={function(){hovered.current=true;lastActiveRef.current=Date.now();}}
      onMouseLeave={function(){hovered.current=false;dragRef.current=null;}}
    />
  );
}

// Lerp a single channel 0-255
function lerpCh(a,b,t){ return Math.round(a+(b-a)*t); }

// Returns an rgba() string interpolated between cyan and amber
function inactivityColor(t, cyanAlpha, amberAlpha) {
  // cyan: 0,200,255   amber: 220,110,20
  var r=lerpCh(0,220,t), g=lerpCh(200,110,t), b=lerpCh(255,20,t);
  var a=cyanAlpha+(amberAlpha-cyanAlpha)*t;
  return "rgba("+r+","+g+","+b+","+a.toFixed(2)+")";
}

export default function EveRobot({ onClick, chatState, "aria-label": ariaLabel }) {
  ariaLabel=ariaLabel||"Open AI assistant";
  chatState=chatState||"idle";
  var [wiggle,setWiggle]=useState(false);
  var [inactivity,setInactivity]=useState(0);  // 0=cyan  1=amber
  var fd=chatState==='thinking'?'2.8s':chatState==='speaking'?'3.2s':'5s';

  // Reset inactivity immediately when chat becomes active
  useEffect(function(){
    if(chatState!=='idle') setInactivity(0);
  },[chatState]);

  function handleClick(e){
    setWiggle(true);
    setInactivity(0); // hover/click = active, snap back to cyan
    setTimeout(function(){setWiggle(false);},700);
    if(onClick) onClick(e);
  }

  // Glow: interpolate drop-shadow colors from cyan → amber
  var c1=inactivityColor(inactivity,0.80,0.75);
  var c2=inactivityColor(inactivity,0.45,0.38);
  var glowByState = {
    idle:     `drop-shadow(0 0 8px ${c1}) drop-shadow(0 0 22px ${c2})`,
    listening:`drop-shadow(0 0 12px ${c1}) drop-shadow(0 0 30px ${c2})`,
    thinking: `drop-shadow(0 0 14px ${c1}) drop-shadow(0 0 35px ${c2})`,
    speaking: `drop-shadow(0 0 16px ${c1}) drop-shadow(0 0 40px ${c2})`,
  };
  var shadowBg=inactivityColor(inactivity,0.18,0.20);

  return (
    <button
      type="button"
      className="prism-trigger"
      onClick={handleClick}
      aria-label={ariaLabel}
      style={{position:"fixed",right:"1.5rem",bottom:"1.5rem",zIndex:9999,padding:0,margin:0,background:"none",border:"none",cursor:"pointer",display:"flex",flexDirection:"column",alignItems:"center",overflow:"visible",WebkitTapHighlightColor:"transparent"}}
    >
      <div style={{display:"flex",flexDirection:"column",alignItems:"center",animation:wiggle?`prism-wiggle 0.7s ease`:`prism-float ${fd} ease-in-out infinite`,filter:glowByState[chatState]||glowByState.idle,transition:"filter 1s ease"}}>
        <IridescentIcosphere
          size={110}
          chatState={chatState}
          onInactivityChange={setInactivity}
        />
      </div>
      <div style={{width:58,height:11,borderRadius:"50%",background:shadowBg,filter:"blur(10px)",marginTop:-10,animation:`prism-shadow ${fd} ease-in-out infinite`,transition:"background 1s ease"}}/>
      <style>{`
        @keyframes prism-float{0%,100%{transform:translateY(0)}50%{transform:translateY(-10px)}}
        @keyframes prism-shadow{0%,100%{transform:scaleX(1);opacity:.36}50%{transform:scaleX(.58);opacity:.12}}
        @keyframes prism-wiggle{0%{transform:translateY(0) rotate(0deg)}18%{transform:translateY(-7px) rotate(-12deg)}38%{transform:translateY(-2px) rotate(9deg)}58%{transform:translateY(-9px) rotate(-6deg)}78%{transform:translateY(-1px) rotate(3deg)}100%{transform:translateY(0) rotate(0deg)}}
        .prism-trigger:focus{outline:none}
        .prism-trigger:focus-visible{outline:2px solid rgba(0,200,255,.65);outline-offset:6px;border-radius:50%}
        @media(max-width:768px){.prism-trigger{right:.75rem;bottom:.75rem}.prism-trigger>div:first-of-type{transform:scale(.85);transform-origin:bottom center}}
      `}</style>
    </button>
  );
}