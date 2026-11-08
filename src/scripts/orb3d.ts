// @ts-nocheck: three ships no bundled types and this file is a self-contained WebGL effect.
/**
 * Hero "tide globe": ~7,000 points on a sphere. Slow waves roll across it like a tide, and the
 * area under the pointer ripples outward. Silver at rest, electric blue on crests, teal in ripples.
 * Loaded on demand from HeroVisual (large screens, WebGL, no reduced motion); the CSS orb is the fallback.
 */
import { Points, BufferGeometry, BufferAttribute, ShaderMaterial, PerspectiveCamera, Scene, WebGLRenderer, Vector2, Vector3, Color, AdditiveBlending } from 'three';

const COUNT = 7000;

const vert = /* glsl */ `
uniform float uTime; uniform float uPx; uniform vec2 uMouse; uniform vec2 uRot;
varying float vWave; varying float vRip; varying float vDepth;
mat3 rotY(float a){ float c=cos(a), s=sin(a); return mat3(c,0.,-s, 0.,1.,0., s,0.,c); }
mat3 rotX(float a){ float c=cos(a), s=sin(a); return mat3(1.,0.,0., 0.,c,s, 0.,-s,c); }
void main(){
  vec3 p = normalize(position);
  float w = 0.5*sin(p.y*5.0 + uTime*0.9) + 0.5*sin(p.x*4.0 - p.z*3.0 + uTime*0.7);
  mat3 R = rotX(uRot.y) * rotY(uRot.x + uTime*0.12);
  vec3 rp = R * p;
  vec3 m = normalize(vec3(uMouse.x*0.9, uMouse.y*0.9, 0.8));
  float d = distance(rp, m);
  float rip = sin(d*16.0 - uTime*3.2) * exp(-d*2.6);
  float r = 1.0 + 0.055*w + 0.13*rip;
  vec4 mv = modelViewMatrix * vec4(rp*r, 1.0);
  gl_Position = projectionMatrix * mv;
  gl_PointSize = (1.9 + 1.2*max(w,0.0) + 3.2*max(rip,0.0)) * uPx * (4.2 / -mv.z);
  vWave = w; vRip = rip; vDepth = clamp(0.35 + 0.65*(rp.z*0.5+0.5), 0.0, 1.0);
}`;

const frag = /* glsl */ `
precision highp float;
uniform vec3 uSilver; uniform vec3 uBlue; uniform vec3 uTeal;
varying float vWave; varying float vRip; varying float vDepth;
void main(){
  vec2 c = gl_PointCoord - 0.5;
  float d = length(c);
  if (d > 0.5) discard;
  float soft = smoothstep(0.5, 0.0, d);
  vec3 col = mix(uSilver, uBlue, smoothstep(-0.2, 0.9, vWave));
  col = mix(col, uTeal, smoothstep(0.1, 0.7, vRip));
  gl_FragColor = vec4(col, soft * vDepth * 0.95);
}`;

export function mountOrb(host) {
  const canvas = document.createElement('canvas');
  canvas.className = 'absolute inset-0 h-full w-full';
  const renderer = new WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: 'low-power' });
  const dpr = Math.min(devicePixelRatio || 1, 2);
  renderer.setPixelRatio(dpr);
  const scene = new Scene();
  const camera = new PerspectiveCamera(35, 1, 0.1, 20);
  camera.position.z = 4.4;

  // Fibonacci sphere: even point distribution
  const pos = new Float32Array(COUNT * 3);
  const golden = Math.PI * (3 - Math.sqrt(5));
  for (let i = 0; i < COUNT; i++) {
    const y = 1 - (i / (COUNT - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = golden * i;
    pos.set([Math.cos(th) * r, y, Math.sin(th) * r], i * 3);
  }
  const geo = new BufferGeometry();
  geo.setAttribute('position', new BufferAttribute(pos, 3));

  const uniforms = {
    uTime: { value: 0 }, uPx: { value: dpr }, uMouse: { value: new Vector2(0.4, 0.2) }, uRot: { value: new Vector2() },
    uSilver: { value: new Color('#c9d2dd') }, uBlue: { value: new Color('#3d8bff') }, uTeal: { value: new Color('#5fe3d6') },
  };
  const mat = new ShaderMaterial({ vertexShader: vert, fragmentShader: frag, uniforms, transparent: true, depthWrite: false, blending: AdditiveBlending });
  scene.add(new Points(geo, mat));
  host.appendChild(canvas);

  const resize = () => {
    const { clientWidth: w, clientHeight: h } = host;
    renderer.setSize(w, h, false);
    camera.aspect = w / h || 1;
    camera.updateProjectionMatrix();
  };
  resize();
  new ResizeObserver(resize).observe(host);

  const target = new Vector2(0.4, 0.2);
  addEventListener('pointermove', (e) => { target.set((e.clientX / innerWidth) * 2 - 1, -((e.clientY / innerHeight) * 2 - 1)); }, { passive: true });

  let raf = 0, visible = true, last = performance.now();
  const frame = (now) => {
    const dt = Math.min((now - last) / 1000, 0.05); last = now;
    uniforms.uTime.value += dt;
    uniforms.uMouse.value.lerp(target, 0.06);
    uniforms.uRot.value.set(uniforms.uMouse.value.x * 0.35, uniforms.uMouse.value.y * -0.25);
    renderer.render(scene, camera);
    raf = visible && !document.hidden ? requestAnimationFrame(frame) : 0;
  };
  const start = () => { if (!raf) { last = performance.now(); raf = requestAnimationFrame(frame); } };
  new IntersectionObserver(([e]) => { visible = e.isIntersecting; if (visible) start(); }).observe(host);
  document.addEventListener('visibilitychange', () => { if (!document.hidden) start(); });
  start();
  return canvas;
}
