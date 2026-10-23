import * as THREE from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { SVGLoader } from "three/examples/jsm/loaders/SVGLoader.js";
import logoSymbol from "./logo-symbol.html?raw";

// The Fort logo column, extruded in 3D with the logo's own proportions:
// pearl faces, gold edges, floating gold dust and a light sweep. Scroll turns and lifts it.
export function initHero3D(canvas) {
  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true, powerPreference: "high-performance" });
  } catch {
    return;
  }
  const isMobile = window.matchMedia("(max-width: 1024px)").matches;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, isMobile ? 1.5 : 2));
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.0;

  const scene = new THREE.Scene();
  const pmrem = new THREE.PMREMGenerator(renderer);
  scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  camera.position.set(0, 0, 15);

  // Extrude the traced logo column
  const columnPath = logoSymbol.match(/<path fill="var\(--lg-c[^"]*" d="([^"]+)"/)[1];
  const data = new SVGLoader().parse(`<svg xmlns="http://www.w3.org/2000/svg"><path d="${columnPath}"/></svg>`);
  const shapes = data.paths.flatMap((p) => SVGLoader.createShapes(p));
  const geo = new THREE.ExtrudeGeometry(shapes, {
    depth: 120, bevelEnabled: true, bevelThickness: 10, bevelSize: 6, bevelSegments: 4, curveSegments: 24,
  });
  geo.computeBoundingBox();
  const bb = geo.boundingBox;
  const size = new THREE.Vector3();
  bb.getSize(size);
  geo.translate(-(bb.min.x + size.x / 2), -(bb.min.y + size.y / 2), -(bb.min.z + size.z / 2));
  const scale = 4.7 / size.y;
  geo.scale(scale, -scale, scale); // SVG y points down
  geo.computeVertexNormals();

  const pearl = new THREE.MeshPhysicalMaterial({ color: 0xeceae4, roughness: 0.28, metalness: 0.05, clearcoat: 1, clearcoatRoughness: 0.18, sheen: 0.4, sheenColor: new THREE.Color(0xfff1cf), side: THREE.DoubleSide });
  const gold = new THREE.MeshPhysicalMaterial({ color: 0xd6ad57, metalness: 1, roughness: 0.2, clearcoat: 0.6 });
  const column = new THREE.Mesh(geo, [pearl, gold]);

  const rig = new THREE.Group();
  rig.add(column);

  // soft gold glow under the column
  const glowTex = (() => {
    const c = document.createElement("canvas");
    c.width = c.height = 128;
    const g = c.getContext("2d");
    const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
    grd.addColorStop(0, "rgba(230,199,127,0.55)");
    grd.addColorStop(1, "rgba(230,199,127,0)");
    g.fillStyle = grd;
    g.fillRect(0, 0, 128, 128);
    return new THREE.CanvasTexture(c);
  })();
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(7, 7), new THREE.MeshBasicMaterial({ map: glowTex, transparent: true, depthWrite: false, blending: THREE.AdditiveBlending }));
  glow.rotation.x = -Math.PI / 2;
  glow.position.y = -2.5;
  rig.add(glow);
  scene.add(rig);

  // gold dust
  const count = isMobile ? 220 : 520;
  const arr = new Float32Array(count * 3);
  const speeds = new Float32Array(count);
  for (let i = 0; i < count; i++) {
    arr[i * 3] = (Math.random() - 0.5) * 24;
    arr[i * 3 + 1] = (Math.random() - 0.5) * 14;
    arr[i * 3 + 2] = (Math.random() - 0.5) * 10 - 2;
    speeds[i] = 0.1 + Math.random() * 0.3;
  }
  const dustGeo = new THREE.BufferGeometry();
  dustGeo.setAttribute("position", new THREE.BufferAttribute(arr, 3));
  const dust = new THREE.Points(dustGeo, new THREE.PointsMaterial({ color: 0xe6c77f, size: 0.04, transparent: true, opacity: 0.75, depthWrite: false, blending: THREE.AdditiveBlending }));
  scene.add(dust);

  // lights
  scene.add(new THREE.AmbientLight(0xffffff, 0.2));
  const key = new THREE.DirectionalLight(0xffffff, 1.8);
  key.position.set(5, 6, 8);
  scene.add(key);
  const rim = new THREE.PointLight(0xe6c77f, 60, 30);
  rim.position.set(-5, 3, -4);
  scene.add(rim);
  const sweep = new THREE.SpotLight(0xfff3d6, 80, 30, Math.PI / 9, 0.6);
  sweep.position.set(0, 8, 6);
  sweep.target = column;
  scene.add(sweep);

  let baseX = 0;
  function layout() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    if (w <= 1024) {
      baseX = 0;
      rig.scale.setScalar(0.95);
      canvas.style.opacity = "0.28";
    } else {
      baseX = w < 1300 ? 3.2 : 3.7;
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

  let visible = true;
  new IntersectionObserver(([entry]) => { visible = entry.isIntersecting; }).observe(canvas);

  const clock = new THREE.Clock();
  const pos = dustGeo.attributes.position;
  function tick() {
    requestAnimationFrame(tick);
    if (!visible) return;
    const t = clock.getElapsedTime();
    const m = reduce ? 0 : 1;
    const scroll = Math.min(1, window.scrollY / window.innerHeight);
    const intro = 1 - Math.pow(1 - Math.min(t / 1.8, 1), 3);

    rig.position.x = baseX;
    rig.position.y = (-5 * (1 - intro)) + scroll * 2.2;
    rig.position.z = -scroll * 3;
    column.rotation.y = (Math.sin(t * 0.35) * 0.55 + scroll * Math.PI * 0.9) * m - 0.35 + (1 - intro) * -1.2;
    rig.rotation.x += ((mouse.y * 0.12) - rig.rotation.x) * 0.05;
    rig.rotation.z += ((-mouse.x * 0.06) - rig.rotation.z) * 0.05;
    sweep.position.x = Math.sin(t * 0.6) * 6 * m;
    glow.material.opacity = 0.7 + Math.sin(t * 1.5) * 0.15 * m;

    for (let i = 0; i < count; i++) {
      let y = pos.getY(i) + speeds[i] * 0.01 * m;
      if (y > 7) y = -7;
      pos.setY(i, y);
    }
    pos.needsUpdate = true;
    dust.rotation.y = t * 0.015 * m;

    renderer.render(scene, camera);
  }
  tick();
}
