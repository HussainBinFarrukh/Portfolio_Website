// Hero background: a 3D mesh of routing nodes. Edges connect each node to its
// nearest neighbours; amber pulses hop from node to node along those edges,
// like transactions being routed through a network. Pauses when off screen.
import * as THREE from "three";

const canvas = document.querySelector(".hero-canvas");
const hero = document.querySelector(".hero");
const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

function supportsWebGL() {
  try {
    const c = document.createElement("canvas");
    return !!(window.WebGLRenderingContext && (c.getContext("webgl2") || c.getContext("webgl")));
  } catch (e) { return false; }
}

if (canvas && supportsWebGL()) init();

function dotTexture() {
  const c = document.createElement("canvas");
  c.width = c.height = 64;
  const g = c.getContext("2d");
  const grd = g.createRadialGradient(32, 32, 0, 32, 32, 32);
  grd.addColorStop(0, "rgba(255,255,255,1)");
  grd.addColorStop(0.25, "rgba(255,255,255,0.85)");
  grd.addColorStop(0.6, "rgba(255,255,255,0.15)");
  grd.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 64, 64);
  const t = new THREE.CanvasTexture(c);
  t.colorSpace = THREE.SRGBColorSpace;
  return t;
}

function init() {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
  renderer.setClearColor(0x000000, 0);

  const scene = new THREE.Scene();
  scene.fog = new THREE.FogExp2(0x0a1220, 0.055);
  const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
  camera.position.set(0, 0, 17);

  const group = new THREE.Group();
  scene.add(group);

  // Nodes on a noisy Fibonacci sphere
  const N = window.innerWidth < 700 ? 90 : 150;
  const R = 6.2;
  const pts = [];
  for (let i = 0; i < N; i++) {
    const y = 1 - (i / (N - 1)) * 2;
    const r = Math.sqrt(1 - y * y);
    const th = i * Math.PI * (3 - Math.sqrt(5));
    const jitter = 0.78 + Math.random() * 0.36;
    pts.push(new THREE.Vector3(Math.cos(th) * r * R * jitter, y * R * jitter, Math.sin(th) * r * R * jitter));
  }

  // Edges: k nearest neighbours, deduplicated
  const K = 3;
  const adj = pts.map(() => new Set());
  for (let i = 0; i < N; i++) {
    const d = [];
    for (let j = 0; j < N; j++) if (j !== i) d.push([pts[i].distanceToSquared(pts[j]), j]);
    d.sort((a, b) => a[0] - b[0]);
    for (let k = 0; k < K; k++) { adj[i].add(d[k][1]); adj[d[k][1]].add(i); }
  }
  const edgePos = [];
  for (let i = 0; i < N; i++) adj[i].forEach((j) => { if (j > i) edgePos.push(pts[i].x, pts[i].y, pts[i].z, pts[j].x, pts[j].y, pts[j].z); });
  const edgeGeo = new THREE.BufferGeometry();
  edgeGeo.setAttribute("position", new THREE.Float32BufferAttribute(edgePos, 3));
  const edges = new THREE.LineSegments(edgeGeo, new THREE.LineBasicMaterial({ color: 0x4fc2b2, transparent: true, opacity: 0.22, depthWrite: false }));
  group.add(edges);

  const tex = dotTexture();

  // Node points; a few "hubs" are brighter and larger
  const nodePos = new Float32Array(N * 3);
  const nodeCol = new Float32Array(N * 3);
  const teal = new THREE.Color(0x9fe3d8), blue = new THREE.Color(0x9cc0ff), white = new THREE.Color(0xf1f5fa);
  pts.forEach((p, i) => {
    nodePos.set([p.x, p.y, p.z], i * 3);
    const c = i % 17 === 0 ? white : i % 3 === 0 ? blue : teal;
    nodeCol.set([c.r, c.g, c.b], i * 3);
  });
  const nodeGeo = new THREE.BufferGeometry();
  nodeGeo.setAttribute("position", new THREE.BufferAttribute(nodePos, 3));
  nodeGeo.setAttribute("color", new THREE.BufferAttribute(nodeCol, 3));
  const nodes = new THREE.Points(nodeGeo, new THREE.PointsMaterial({ size: 0.34, map: tex, vertexColors: true, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  group.add(nodes);

  // Pulses hop along edges
  const P = window.innerWidth < 700 ? 22 : 40;
  const pulses = [];
  const pulsePos = new Float32Array(P * 3);
  for (let i = 0; i < P; i++) {
    const a = Math.floor(Math.random() * N);
    const nb = [...adj[a]];
    pulses.push({ a, b: nb[Math.floor(Math.random() * nb.length)], t: Math.random(), speed: 0.45 + Math.random() * 0.6 });
  }
  const pulseGeo = new THREE.BufferGeometry();
  pulseGeo.setAttribute("position", new THREE.BufferAttribute(pulsePos, 3));
  const pulseMat = new THREE.PointsMaterial({ size: 0.42, map: tex, color: 0xf2b33d, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
  const pulsePts = new THREE.Points(pulseGeo, pulseMat);
  group.add(pulsePts);

  // Faint outer dust for depth
  const dustN = 500, dust = new Float32Array(dustN * 3);
  for (let i = 0; i < dustN; i++) {
    const r = 9 + Math.random() * 14, th = Math.random() * Math.PI * 2, ph = Math.acos(2 * Math.random() - 1);
    dust.set([r * Math.sin(ph) * Math.cos(th), r * Math.sin(ph) * Math.sin(th), r * Math.cos(ph)], i * 3);
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(dust, 3));
  scene.add(new THREE.Points(dustGeo, new THREE.PointsMaterial({ size: 0.06, color: 0x8797ac, transparent: true, opacity: 0.5, depthWrite: false })));

  const tmp = new THREE.Vector3();
  function stepPulses(dt) {
    for (let i = 0; i < P; i++) {
      const p = pulses[i];
      p.t += dt * p.speed;
      if (p.t >= 1) {
        const nb = [...adj[p.b]].filter((n) => n !== p.a);
        p.a = p.b;
        p.b = nb.length ? nb[Math.floor(Math.random() * nb.length)] : p.a;
        p.t = 0;
      }
      tmp.copy(pts[p.a]).lerp(pts[p.b], p.t);
      pulsePos[i * 3] = tmp.x; pulsePos[i * 3 + 1] = tmp.y; pulsePos[i * 3 + 2] = tmp.z;
    }
    pulseGeo.attributes.position.needsUpdate = true;
  }

  // Layout: mesh sits right of the headline on wide screens
  function resize() {
    const w = hero.clientWidth, h = hero.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    const wide = w > 900;
    group.position.x = wide ? 6.2 : 0;
    group.position.y = wide ? 0 : 1.5;
    group.scale.setScalar(wide ? 1 : 0.82);
  }
  resize();
  window.addEventListener("resize", resize);

  // Pointer parallax and scroll recession
  let mx = 0, my = 0, tx = 0, ty = 0, scrollK = 0;
  window.addEventListener("pointermove", (e) => {
    mx = (e.clientX / window.innerWidth - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  }, { passive: true });
  window.addEventListener("scroll", () => {
    scrollK = Math.min(1, window.scrollY / Math.max(1, hero.clientHeight));
  }, { passive: true });

  let visible = true, running = false, last = performance.now(), rot = 0;
  function frame(now) {
    if (!visible || document.hidden) { running = false; return; }
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    rot += dt * 0.06;
    tx += (mx - tx) * 0.04; ty += (my - ty) * 0.04;
    group.rotation.y = rot + tx * 0.35;
    group.rotation.x = 0.25 + ty * 0.2;
    camera.position.z = 17 + scrollK * 6;
    edges.material.opacity = 0.22 * (1 - scrollK * 0.6);
    stepPulses(dt);
    renderer.render(scene, camera);
    requestAnimationFrame(frame);
  }
  function start() { if (!running) { running = true; last = performance.now(); requestAnimationFrame(frame); } }

  if (reduce) {
    group.rotation.set(0.25, 0.6, 0);
    stepPulses(0);
    renderer.render(scene, camera);
    window.addEventListener("resize", () => renderer.render(scene, camera));
    return;
  }

  new IntersectionObserver((entries) => {
    visible = entries[0].isIntersecting;
    if (visible) start();
  }).observe(hero);
  document.addEventListener("visibilitychange", () => { if (!document.hidden && visible) start(); });
  start();
}
