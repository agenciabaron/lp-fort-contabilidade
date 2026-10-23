import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";

// Fluted classical column (the Fort logo icon) with orbiting gold rings and particles.
export function initHero3D(canvas) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch {
    return;
  }
  const isMobile = window.matchMedia("(max-width: 760px)").matches;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(32, 1, 0.1, 100);
  camera.position.set(0, 0.4, 14);

  const stone = new THREE.MeshPhysicalMaterial({ color: 0xc4c4c6, metalness: 0.25, roughness: 0.32, clearcoat: 0.6, clearcoatRoughness: 0.25 });
  const gold = new THREE.MeshPhysicalMaterial({ color: 0xd9b25e, metalness: 1, roughness: 0.22 });

  const column = new THREE.Group();

  // plinth
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(2.3, 0.32, 2.3), stone);
  plinth.position.y = -2.75;
  column.add(plinth);

  // base mouldings (lathe)
  const baseProfile = [
    [0, 0], [1.0, 0], [1.0, 0.08], [0.95, 0.16], [1.0, 0.26], [0.88, 0.34], [0.84, 0.42], [0.8, 0.46], [0, 0.46],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const base = new THREE.Mesh(new THREE.LatheGeometry(baseProfile, 64), stone);
  base.position.y = -2.59;
  column.add(base);

  // fluted shaft
  const shaftGeo = new THREE.CylinderGeometry(0.66, 0.74, 4.1, 160, 24, true);
  const pos = shaftGeo.attributes.position;
  const v = new THREE.Vector3();
  const flutes = 20;
  for (let i = 0; i < pos.count; i++) {
    v.fromBufferAttribute(pos, i);
    const theta = Math.atan2(v.z, v.x);
    const r = Math.hypot(v.x, v.z);
    const groove = Math.pow(Math.max(0, Math.cos(theta * flutes)), 2) * 0.06;
    const nr = r - groove;
    pos.setXYZ(i, Math.cos(theta) * nr, v.y, Math.sin(theta) * nr);
  }
  shaftGeo.computeVertexNormals();
  const shaft = new THREE.Mesh(shaftGeo, stone);
  shaft.position.y = -0.08;
  column.add(shaft);

  // gold neck ring
  const neck = new THREE.Mesh(new THREE.TorusGeometry(0.7, 0.045, 16, 96), gold);
  neck.rotation.x = Math.PI / 2;
  neck.position.y = 1.92;
  column.add(neck);

  // capital (echinus)
  const capProfile = [
    [0, 0], [0.7, 0], [0.78, 0.06], [0.95, 0.18], [1.1, 0.3], [1.15, 0.36], [0, 0.36],
  ].map(([x, y]) => new THREE.Vector2(x, y));
  const cap = new THREE.Mesh(new THREE.LatheGeometry(capProfile, 64), stone);
  cap.position.y = 1.98;
  column.add(cap);

  // abacus + volutes
  const abacus = new THREE.Mesh(new THREE.BoxGeometry(2.5, 0.3, 2.5), stone);
  abacus.position.y = 2.5;
  column.add(abacus);
  [-1.25, 1.25].forEach((x) => {
    const vol = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.07, 16, 48), gold);
    vol.position.set(x, 2.22, 1.0);
    column.add(vol);
    const vol2 = vol.clone();
    vol2.position.z = -1.0;
    column.add(vol2);
  });

  column.scale.setScalar(0.92);
  const rig = new THREE.Group();
  rig.add(column);

  // orbiting rings
  const rings = [];
  [[2.4, 0.012, 1.1, 0.2], [2.9, 0.008, 1.35, -0.35], [3.4, 0.006, 1.6, 0.5]].forEach(([r, t, tiltX, tiltZ], i) => {
    const ring = new THREE.Mesh(new THREE.TorusGeometry(r, t, 8, 200), gold);
    ring.rotation.set(tiltX, 0, tiltZ);
    ring.userData.speed = 0.15 + i * 0.07;
    rings.push(ring);
    rig.add(ring);
  });

  // small gold cubes orbiting
  const cubes = [];
  const cubeGeo = new THREE.BoxGeometry(0.16, 0.16, 0.16);
  for (let i = 0; i < 7; i++) {
    const c = new THREE.Mesh(cubeGeo, gold);
    c.userData = { a: (i / 7) * Math.PI * 2, r: 2.6 + (i % 3) * 0.4, y: -1.8 + (i * 0.6), s: 0.25 + (i % 3) * 0.08 };
    cubes.push(c);
    rig.add(c);
  }
  scene.add(rig);

  // particles
  const count = isMobile ? 260 : 600;
  const pGeo = new THREE.BufferGeometry();
  const arr = new Float32Array(count * 3);
  for (let i = 0; i < count; i++) {
    arr[i * 3] = (Math.random() - 0.5) * 26;
    arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
  }
  pGeo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
  const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0xe2c27a, size: 0.035, transparent: true, opacity: 0.7, depthWrite: false }));
  scene.add(particles);

  // lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.25));
  const key = new THREE.DirectionalLight(0xffffff, 1.6);
  key.position.set(4, 6, 6);
  scene.add(key);
  const rim = new THREE.PointLight(0xe2c27a, 30, 20);
  rim.position.set(-4, 2, -3);
  scene.add(rim);

  function layout() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (w < 960) {
      rig.position.set(0, 0.2, -4);
      rig.scale.setScalar(0.9);
      canvas.style.opacity = "0.35";
    } else {
      rig.position.set(w < 1280 ? 3.0 : 3.6, 0, 0);
      rig.scale.setScalar(1);
      canvas.style.opacity = "1";
    }
  }
  layout();
  window.addEventListener("resize", layout);

  const mouse = { x: 0, y: 0 };
  window.addEventListener("pointermove", (e) => {
    mouse.x = (e.clientX / window.innerWidth - 0.5) * 2;
    mouse.y = (e.clientY / window.innerHeight - 0.5) * 2;
  });

  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let visible = true;
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }).observe(canvas);

  const clock = new THREE.Clock();
  function tick() {
    requestAnimationFrame(tick);
    if (!visible) return;
    const t = clock.getElapsedTime();
    const speed = reduce ? 0 : 1;
    column.position.y = -6 * Math.pow(1 - Math.min(t / 1.6, 1), 3);
    column.rotation.y = t * 0.25 * speed;
    rig.rotation.x += ((mouse.y * 0.15) - rig.rotation.x) * 0.05;
    rig.rotation.z += ((-mouse.x * 0.08) - rig.rotation.z) * 0.05;
    rings.forEach((r) => { r.rotation.y = t * r.userData.speed * speed; });
    cubes.forEach((c) => {
      const a = c.userData.a + t * c.userData.s * speed;
      c.position.set(Math.cos(a) * c.userData.r, c.userData.y + Math.sin(t + c.userData.a) * 0.2, Math.sin(a) * c.userData.r);
      c.rotation.x = c.rotation.y = t * speed;
    });
    particles.rotation.y = t * 0.02 * speed;
    renderer.render(scene, camera);
  }
  tick();
}
