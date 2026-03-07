import { useEffect, useRef } from 'react';
import * as THREE from 'three';

/**
 * IsometricRoom — A developer's cozy room rendered in Three.js isometric view.
 * Features: desk, monitor, keyboard, mouse, coffee, chair, bookshelf, plant,
 * desk lamp, headphones, phone, sticky note, wall poster, ceiling light.
 * Animated: coffee steam, subtle screen pulse, gentle scene sway.
 */
const IsometricRoom = ({ isDarkMode }) => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const W = container.clientWidth;
    const H = 460;
    const DK = isDarkMode;

    // ── Renderer ──────────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(W, H);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    // ── Scene ─────────────────────────────────────────────────────────────────
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(DK ? '#0f172a' : '#f0ece6');

    // ── Isometric (Orthographic) Camera ───────────────────────────────────────
    const aspect = W / H;
    const frustum = 6;
    const camera = new THREE.OrthographicCamera(
      -frustum * aspect, frustum * aspect,
      frustum, -frustum,
      0.1, 200
    );
    camera.position.set(15, 13, 15);
    camera.lookAt(0, 1.8, 0);

    // ── Lighting ──────────────────────────────────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, DK ? 0.45 : 0.75));

    const sun = new THREE.DirectionalLight(DK ? 0x6688cc : 0xfff5e0, DK ? 0.7 : 1.0);
    sun.position.set(12, 20, 12);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    sun.shadow.camera.left = -15;
    sun.shadow.camera.right = 15;
    sun.shadow.camera.top = 15;
    sun.shadow.camera.bottom = -15;
    sun.shadow.camera.near = 0.5;
    sun.shadow.camera.far = 120;
    scene.add(sun);

    // Monitor blue glow
    const monGlow = new THREE.PointLight(0x4488ff, DK ? 2.5 : 0.9, 5);
    monGlow.position.set(-0.3, 2.8, -2.0);
    scene.add(monGlow);

    // Desk lamp warm glow
    const lampGlow = new THREE.PointLight(0xffdd88, DK ? 2.0 : 1.1, 4.5);
    lampGlow.position.set(-1.8, 2.2, -2.1);
    scene.add(lampGlow);

    // ── Geometry helpers ──────────────────────────────────────────────────────
    const mkBox = (w, h, d, color) => {
      const m = new THREE.Mesh(
        new THREE.BoxGeometry(w, h, d),
        new THREE.MeshLambertMaterial({ color })
      );
      m.castShadow = true;
      m.receiveShadow = true;
      return m;
    };

    const addBox = (w, h, d, color, x, y, z, ry = 0) => {
      const m = mkBox(w, h, d, color);
      m.position.set(x, y, z);
      if (ry) m.rotation.y = ry;
      scene.add(m);
      return m;
    };

    // ── Color palette ─────────────────────────────────────────────────────────
    const P = {
      fl1:   DK ? 0x3d2b1f : 0xc8a06a,
      fl2:   DK ? 0x2e2018 : 0xb8905a,
      wall:  DK ? 0x1a2535 : 0xf0ead8,
      wallS: DK ? 0x1d2b3a : 0xe8dfc8,
      base:  DK ? 0x0d1520 : 0xcfc3ad,
      desk:  DK ? 0x2a1f0f : 0x5c3a1e,
      dLeg:  DK ? 0x1a1209 : 0x3d2510,
      dMat:  DK ? 0x0d1117 : 0x1a1a2e,
      shelf: DK ? 0x2a1f0f : 0x4e3216,
      chair: DK ? 0x1a1a2e : 0x2d3748,
      metal: 0x888888,
      mon:   0x161616,
      kb:    DK ? 0x0d0d1a : 0x1e1e2e,
      keys:  DK ? 0x1a1a2e : 0x2a2a3e,
      mug:   DK ? 0x334155 : 0xfafafa,
      coffee: 0x3d1c02,
      lamp:  DK ? 0xffd700 : 0x777777,
      book: [0xe53e3e, 0x3182ce, 0x38a169, 0xd69e2e, 0x805ad5,
             0xed8936, 0xfc8181, 0x63b3ed, 0xf6ad55, 0x68d391],
    };

    // ── Floor (parquet checkerboard) ──────────────────────────────────────────
    for (let xi = -3; xi <= 3; xi++)
      for (let zi = -3; zi <= 3; zi++)
        addBox(0.97, 0.1, 0.97, (xi + zi) % 2 === 0 ? P.fl1 : P.fl2, xi, -0.05, zi);

    // ── Walls ─────────────────────────────────────────────────────────────────
    addBox(7.1,  5.5, 0.12, P.wall,  0,     2.6, -3.56);  // back wall (z-)
    addBox(0.12, 5.5, 7.1,  P.wallS, -3.56, 2.6,  0);     // left wall (x-)
    addBox(7.1,  0.15, 0.07, P.base, 0,     0.08, -3.53); // baseboard back
    addBox(0.07, 0.15, 7.1,  P.base, -3.53, 0.08,  0);    // baseboard left

    // ── Desk ──────────────────────────────────────────────────────────────────
    const DX = -0.3, DZ = -1.8;                             // desk center XZ
    addBox(3.6,  0.09, 1.6,  P.desk, DX,     1.35, DZ);    // tabletop
    addBox(2.5,  0.015, 1.3, P.dMat, DX - 0.1, 1.405, DZ);// desk mat
    [[-1.65, -2.55], [-1.65, -1.05], [1.05, -2.55], [1.05, -1.05]]
      .forEach(([lx, lz]) => addBox(0.09, 1.38, 0.09, P.dLeg, lx, 0.69, lz));

    // ── Monitor ───────────────────────────────────────────────────────────────
    const MX = -0.3, MZ = -2.35;
    addBox(0.5,  0.04, 0.28, P.mon, MX, 1.4,  MZ + 0.05); // stand base
    addBox(0.06, 0.5,  0.06, P.mon, MX, 1.66, MZ + 0.04); // stand neck
    addBox(1.85, 1.12, 0.075, P.mon, MX, 2.43, MZ);       // bezel frame

    const screenMesh = new THREE.Mesh(
      new THREE.BoxGeometry(1.7, 0.97, 0.02),
      new THREE.MeshLambertMaterial({
        color: DK ? 0x040e1c : 0x040e1c,
        emissive: DK ? 0x0a2848 : 0x051020,
        emissiveIntensity: DK ? 1.6 : 0.9,
      })
    );
    screenMesh.position.set(MX, 2.43, MZ + 0.05);
    scene.add(screenMesh);

    // Code lines on screen
    const CODE_COLORS = [0x00ff88, 0x4499ff, 0xff6b9d, 0xffd700, 0x88ccff, 0xff9944];
    for (let i = 0; i < 10; i++) {
      const lw = 0.2 + Math.random() * 0.9;
      const indent = (i % 4) * 0.14;
      const cl = mkBox(lw, 0.033, 0.005, CODE_COLORS[i % CODE_COLORS.length]);
      cl.position.set(MX - 0.66 + indent + lw / 2, 2.7 - i * 0.093, MZ + 0.065);
      scene.add(cl);
    }

    // ── Keyboard ──────────────────────────────────────────────────────────────
    const KX = -0.2, KZ = -1.52;
    addBox(1.3, 0.04, 0.44, P.kb, KX, 1.4, KZ);             // body
    for (let r = 0; r < 3; r++)
      for (let c = 0; c < 12; c++)
        addBox(0.077, 0.04, 0.077, P.keys,
          KX - 0.54 + c * 0.097, 1.435, KZ - 0.14 + r * 0.1);

    // ── Mouse ─────────────────────────────────────────────────────────────────
    addBox(0.17,  0.06, 0.27, 0x1a1a1a, 0.88, 1.41, -1.52);
    addBox(0.04,  0.04, 0.1,  0x333333, 0.88, 1.46, -1.46); // scroll wheel

    // ── Coffee Mug ────────────────────────────────────────────────────────────
    const mugGroup = new THREE.Group();

    const mugBody = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.085, 0.22, 14),
      new THREE.MeshLambertMaterial({ color: P.mug })
    );
    mugBody.castShadow = true;
    mugGroup.add(mugBody);

    const coffeeTop = new THREE.Mesh(
      new THREE.CylinderGeometry(0.085, 0.085, 0.01, 14),
      new THREE.MeshLambertMaterial({ color: P.coffee })
    );
    coffeeTop.position.set(0, 0.1, 0);
    mugGroup.add(coffeeTop);

    const mugHandle = mkBox(0.04, 0.12, 0.04, P.mug);
    mugHandle.position.set(0.12, 0, 0);
    mugGroup.add(mugHandle);

    mugGroup.position.set(0.9, 1.46, -2.35);
    scene.add(mugGroup);

    // ── Steam Particles ───────────────────────────────────────────────────────
    const STEAM_N = 16;
    const steamPos = new Float32Array(STEAM_N * 3);
    const steamGeo = new THREE.BufferGeometry();
    steamGeo.setAttribute('position', new THREE.BufferAttribute(steamPos, 3));
    const steamMat = new THREE.PointsMaterial({
      color: DK ? 0x88aabb : 0xaaaaaa,
      size: 0.07,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });
    scene.add(new THREE.Points(steamGeo, steamMat));

    const steamData = Array.from({ length: STEAM_N }, () => ({
      life:  Math.random(),
      speed: 0.15 + Math.random() * 0.2,
      ox:    (Math.random() - 0.5) * 0.07,
      oz:    (Math.random() - 0.5) * 0.07,
      phase: Math.random() * Math.PI * 2,
    }));

    // ── Headphones ────────────────────────────────────────────────────────────
    const hpGroup = new THREE.Group();
    const hpMat = new THREE.MeshLambertMaterial({ color: 0x111111 });

    const hpBand = new THREE.Mesh(
      new THREE.TorusGeometry(0.17, 0.022, 8, 22, Math.PI),
      hpMat
    );
    hpBand.rotation.z = -Math.PI / 2;
    hpBand.rotation.x = Math.PI / 6;
    hpGroup.add(hpBand);

    [-1, 1].forEach(s => {
      const cup = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.06, 0.045, 12),
        hpMat
      );
      cup.rotation.z = Math.PI / 2;
      cup.position.set(0, s * 0.17, 0.04);
      hpGroup.add(cup);
    });

    hpGroup.position.set(0.9, 1.41, -2.3);
    hpGroup.scale.setScalar(0.85);
    scene.add(hpGroup);

    // ── Desk Lamp ─────────────────────────────────────────────────────────────
    const lampGroup = new THREE.Group();
    const lampMat = new THREE.MeshLambertMaterial({ color: P.lamp });

    const lampBase = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.1, 0.03, 12),
      lampMat
    );
    lampGroup.add(lampBase);

    const lArm1 = mkBox(0.03, 0.38, 0.03, P.lamp);
    lArm1.position.set(0, 0.2, 0);
    lampGroup.add(lArm1);

    const lArm2 = mkBox(0.03, 0.32, 0.03, P.lamp);
    lArm2.position.set(0.1, 0.52, 0);
    lArm2.rotation.z = -0.65;
    lampGroup.add(lArm2);

    const lampHead = new THREE.Mesh(
      new THREE.ConeGeometry(0.11, 0.2, 12, 1, true),
      new THREE.MeshLambertMaterial({ color: P.lamp, side: THREE.DoubleSide })
    );
    lampHead.position.set(0.22, 0.68, 0);
    lampHead.rotation.z = Math.PI / 2;
    lampGroup.add(lampHead);

    lampGroup.position.set(-1.8, 1.38, -2.35);
    scene.add(lampGroup);

    // ── Potted Plant ──────────────────────────────────────────────────────────
    const plantGroup = new THREE.Group();

    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.08, 0.16, 12),
      new THREE.MeshLambertMaterial({ color: 0x8b4513 })
    );
    pot.castShadow = true;
    plantGroup.add(pot);

    const soil = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.09, 0.01, 12),
      new THREE.MeshLambertMaterial({ color: 0x2d1b0e })
    );
    soil.position.set(0, 0.075, 0);
    plantGroup.add(soil);

    const leafMat = new THREE.MeshLambertMaterial({ color: 0x2d6a4f });
    [[0, 0.22, 0], [0.07, 0.16, 0.05], [-0.07, 0.14, 0.04],
     [0.03, 0.13, -0.08], [-0.04, 0.19, -0.06]].forEach(([lx, ly, lz]) => {
      const leaf = new THREE.Mesh(
        new THREE.SphereGeometry(0.058 + Math.random() * 0.02, 7, 7),
        leafMat
      );
      leaf.position.set(lx, ly, lz);
      leaf.castShadow = true;
      plantGroup.add(leaf);
    });

    plantGroup.position.set(1.1, 1.43, -2.38);
    scene.add(plantGroup);

    // ── Office Chair ──────────────────────────────────────────────────────────
    const CX = -0.2, CZ = -0.5;
    addBox(0.98, 0.1,  0.98, P.chair, CX, 0.82, CZ);        // seat cushion
    addBox(0.96, 1.05, 0.1,  P.chair, CX, 1.4,  CZ + 0.49); // back
    addBox(0.7,  0.3,  0.08, P.chair, CX, 2.02, CZ + 0.51); // headrest
    addBox(0.09, 0.06, 0.65, P.chair, CX - 0.53, 1.0, CZ);  // armrest L
    addBox(0.09, 0.06, 0.65, P.chair, CX + 0.53, 1.0, CZ);  // armrest R

    const chairPost = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.055, 0.78, 8),
      new THREE.MeshLambertMaterial({ color: P.metal })
    );
    chairPost.position.set(CX, 0.39, CZ);
    chairPost.castShadow = true;
    scene.add(chairPost);

    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2;
      const starArm = mkBox(0.07, 0.05, 0.45, P.metal);
      starArm.position.set(CX + Math.sin(a) * 0.2, 0.05, CZ + Math.cos(a) * 0.2);
      starArm.rotation.y = -a;
      scene.add(starArm);
    }

    // ── Bookshelf ─────────────────────────────────────────────────────────────
    const BSX = -3.3, BSZ = -1.5, BSW = 1.4;
    addBox(0.06,  2.3, BSW,  P.shelf, BSX - 0.02, 1.15, BSZ); // back panel
    addBox(0.26,  0.06, BSW, P.shelf, BSX + 0.11, 2.27, BSZ); // top panel
    addBox(0.26,  0.06, BSW, P.shelf, BSX + 0.11, 0.06, BSZ); // bottom panel
    [0.68, 1.28, 1.9].forEach(sy =>
      addBox(0.26, 0.045, BSW, P.shelf, BSX + 0.11, sy, BSZ)  // shelf boards
    );

    [0.3, 0.94, 1.58].forEach(shelfY => {
      let bz = BSZ - BSW / 2 + 0.07;
      for (let b = 0; b < 10 && bz < BSZ + BSW / 2 - 0.06; b++) {
        const bw = 0.08 + Math.random() * 0.07;
        const bh = 0.22 + Math.random() * 0.22;
        const book = mkBox(0.18, bh, bw, P.book[Math.floor(Math.random() * P.book.length)]);
        book.position.set(BSX + 0.14, shelfY + bh / 2, bz + bw / 2);
        book.rotation.y = (Math.random() - 0.5) * 0.08;
        scene.add(book);
        bz += bw + 0.006;
      }
    });

    // ── Wall Poster (on left wall) ─────────────────────────────────────────────
    addBox(0.025, 1.0, 1.3, DK ? 0x2d3748 : 0x8b7355, -3.56, 3.3, 1.5);  // frame
    addBox(0.018, 0.88, 1.18, DK ? 0x0d1b2a : 0x1a1a2e, -3.55, 3.3, 1.5); // bg

    [0x06b6d4, 0x6366f1, 0x10b981, 0x8b5cf6, 0xf59e0b].forEach((col, i) => {
      const al = mkBox(0.005, 0.068, 0.55 + Math.random() * 0.45, col);
      al.position.set(-3.54, 3.5 - i * 0.16, 1.5 + (Math.random() - 0.5) * 0.25);
      scene.add(al);
    });

    // ── Ceiling Light ─────────────────────────────────────────────────────────
    addBox(0.85, 0.06, 0.22, DK ? 0x334155 : 0xeeeeee, 0, 4.8, -1.5);
    const ceilGlow = new THREE.PointLight(0xfffce8, DK ? 0.7 : 0.35, 12);
    ceilGlow.position.set(0, 4.7, -1.5);
    scene.add(ceilGlow);

    // ── Sticky Note (on monitor side) ─────────────────────────────────────────
    addBox(0.005, 0.28, 0.28, 0xfff176, -1.29, 2.25, -2.33);
    [0, 1, 2].forEach(i =>
      addBox(0.005, 0.02, 0.18 - i * 0.04, 0x666644, -1.28, 2.36 - i * 0.08, -2.33)
    );

    // ── Phone on desk ─────────────────────────────────────────────────────────
    addBox(0.085, 0.015, 0.17, 0x1a1a1a, 0.5, 1.41, -1.3, 0.2);
    addBox(0.07,  0.012, 0.13, DK ? 0x06b6d4 : 0x3b82f6, 0.5, 1.425, -1.3, 0.2);

    // ── Second monitor (smaller, angled to the side) ───────────────────────────
    const M2X = 1.05, M2Z = -2.3, M2RY = -0.5;
    const m2Group = new THREE.Group();
    m2Group.rotation.y = M2RY;

    const m2Base = mkBox(0.35, 0.03, 0.2, P.mon);
    m2Base.position.set(0, 0, 0);
    m2Group.add(m2Base);

    const m2Neck = mkBox(0.05, 0.38, 0.05, P.mon);
    m2Neck.position.set(0, 0.2, 0);
    m2Group.add(m2Neck);

    const m2Frame = mkBox(1.3, 0.82, 0.06, P.mon);
    m2Frame.position.set(0, 0.8, 0);
    m2Group.add(m2Frame);

    const m2Screen = new THREE.Mesh(
      new THREE.BoxGeometry(1.18, 0.7, 0.015),
      new THREE.MeshLambertMaterial({
        color: DK ? 0x040e1c : 0x040e1c,
        emissive: DK ? 0x061a2a : 0x030a14,
        emissiveIntensity: DK ? 1.2 : 0.7,
      })
    );
    m2Screen.position.set(0, 0.8, 0.035);
    m2Group.add(m2Screen);

    m2Group.position.set(M2X, 1.4, M2Z);
    scene.add(m2Group);

    // ── Animation Loop ────────────────────────────────────────────────────────
    const clock = new THREE.Clock();
    let rafId;

    const animate = () => {
      rafId = requestAnimationFrame(animate);
      const t = clock.getElapsedTime();

      // Animate steam particles
      const pa = steamGeo.attributes.position.array;
      steamData.forEach((p, i) => {
        p.life += p.speed * 0.012;
        if (p.life > 1) {
          p.life = 0;
          p.ox = (Math.random() - 0.5) * 0.07;
          p.oz = (Math.random() - 0.5) * 0.07;
        }
        pa[i * 3]     = 0.9 + p.ox + Math.sin(t * 1.4 + p.phase) * 0.025;
        pa[i * 3 + 1] = 1.56 + p.life * 0.6;
        pa[i * 3 + 2] = -2.35 + p.oz + Math.cos(t + p.phase) * 0.018;
      });
      steamGeo.attributes.position.needsUpdate = true;
      steamMat.opacity = 0.28 + Math.sin(t * 0.7) * 0.12;

      // Screen pulse (simulates monitor activity)
      screenMesh.material.emissiveIntensity =
        (DK ? 1.6 : 0.9) + Math.sin(t * 0.5) * 0.08;

      // Very gentle scene sway (breathes life into the scene)
      scene.rotation.y = Math.sin(t * 0.12) * 0.025;

      renderer.render(scene, camera);
    };
    animate();

    // ── Resize handler ────────────────────────────────────────────────────────
    const onResize = () => {
      const nW = container.clientWidth;
      renderer.setSize(nW, H);
      camera.left  = -frustum * (nW / H);
      camera.right =  frustum * (nW / H);
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    // ── Cleanup ───────────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener('resize', onResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [isDarkMode]);

  return (
    <div
      ref={mountRef}
      className="w-full rounded-lg overflow-hidden"
      style={{ height: '460px' }}
    />
  );
};

export default IsometricRoom;
