import * as THREE from 'three';

/* ============================================================
   THREE.JS — Industrial Warehouse Background
   Dark space with slow metallic particles + faint blue grid
   WebGL fallback: canvas stays hidden, no error thrown
   ============================================================ */

let renderer: THREE.WebGLRenderer | null = null;
let scene: THREE.Scene | null = null;
let camera: THREE.PerspectiveCamera | null = null;
let animId: number | null = null;
let particles: THREE.Points | null = null;
let grid: THREE.LineSegments | null = null;

/* ---- WebGL support check ---- */
function supportsWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(
      window.WebGLRenderingContext &&
      (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    );
  } catch {
    return false;
  }
}

/* ---- Build particle geometry ---- */
function buildParticles(count: number): THREE.Points {
  const geo = new THREE.BufferGeometry();
  const positions = new Float32Array(count * 3);
  const sizes = new Float32Array(count);

  for (let i = 0; i < count; i++) {
    positions[i * 3]     = (Math.random() - 0.5) * 80;
    positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
    positions[i * 3 + 2] = (Math.random() - 0.5) * 60;
    sizes[i] = Math.random() * 1.5 + 0.3;
  }

  geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
  geo.setAttribute('size', new THREE.BufferAttribute(sizes, 1));

  const mat = new THREE.PointsMaterial({
    color: 0x3b82f6,
    size: 0.15,
    sizeAttenuation: true,
    transparent: true,
    opacity: 0.35,
    depthWrite: false,
  });

  return new THREE.Points(geo, mat);
}

/* ---- Build faint horizontal grid lines ---- */
function buildGrid(): THREE.LineSegments {
  const geo = new THREE.BufferGeometry();
  const verts: number[] = [];
  const spread = 60;
  const step = 8;
  const y = -12;

  for (let x = -spread; x <= spread; x += step) {
    verts.push(x, y, -spread, x, y, spread);
  }
  for (let z = -spread; z <= spread; z += step) {
    verts.push(-spread, y, z, spread, y, z);
  }

  geo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(verts), 3));

  const mat = new THREE.LineBasicMaterial({
    color: 0x1e3a5f,
    transparent: true,
    opacity: 0.18,
    depthWrite: false,
  });

  return new THREE.LineSegments(geo, mat);
}

/* ---- Init ---- */
export function initBackground(canvas: HTMLCanvasElement): () => void {
  if (!supportsWebGL()) {
    canvas.style.display = 'none';
    return () => {};
  }

  // Renderer
  renderer = new THREE.WebGLRenderer({ canvas, antialias: false, alpha: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor(0x000000, 0);

  // Scene
  scene = new THREE.Scene();

  // Camera
  camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 200);
  camera.position.set(0, 4, 28);

  // Ambient light (subtle blue)
  const ambient = new THREE.AmbientLight(0x0f2040, 2);
  scene.add(ambient);

  // Point light — industrial overhead
  const pointLight = new THREE.PointLight(0x3b82f6, 1.2, 80);
  pointLight.position.set(0, 20, 10);
  scene.add(pointLight);

  // Particles
  particles = buildParticles(320);
  scene.add(particles);

  // Grid
  grid = buildGrid();
  scene.add(grid);

  // Resize handler
  const onResize = () => {
    if (!renderer || !camera) return;
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
  };
  window.addEventListener('resize', onResize);

  // Subtle mouse parallax
  let mx = 0, my = 0;
  const onMouse = (e: MouseEvent) => {
    mx = (e.clientX / window.innerWidth - 0.5) * 2;
    my = (e.clientY / window.innerHeight - 0.5) * 2;
  };
  window.addEventListener('mousemove', onMouse, { passive: true });

  // Render loop
  let t = 0;
  const tick = () => {
    if (!renderer || !scene || !camera || !particles) return;
    t += 0.003;

    // Slow rotate particles
    particles.rotation.y = t * 0.06;
    particles.rotation.x = t * 0.02;

    // Camera subtle drift
    if (camera) {
      camera.position.x += (mx * 1.5 - camera.position.x) * 0.015;
      camera.position.y += (-my * 1.0 - camera.position.y + 4) * 0.015;
      camera.lookAt(0, 0, 0);
    }

    renderer.render(scene, camera);
    animId = requestAnimationFrame(tick);
  };

  tick();

  // Return cleanup
  return () => {
    window.removeEventListener('resize', onResize);
    window.removeEventListener('mousemove', onMouse);
    if (animId !== null) cancelAnimationFrame(animId);
    renderer?.dispose();
    scene?.clear();
    renderer = null;
    scene = null;
    camera = null;
    particles = null;
    grid = null;
    animId = null;
  };
}
