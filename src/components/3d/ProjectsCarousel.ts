import * as THREE from 'three';
import { PROJECT_ITEMS } from '../../data/projects';
import type { ProjectItem } from '../../data/projects';
import { createProjectPreviewTexture } from '../../utils/projectPreviews';

/**
 * Orbital curve identical to SkillsOrbit — same mathematical shape
 */
class OrbitCurve extends THREE.Curve<THREE.Vector3> {
  rx: number;
  rz: number;
  cy: number;
  tilt: number;
  zOffset: number;

  constructor(rx: number, rz: number, cy: number, tilt: number, zOffset: number) {
    super();
    this.rx = rx;
    this.rz = rz;
    this.cy = cy;
    this.tilt = tilt;
    this.zOffset = zOffset;
  }

  getPoint(t: number): THREE.Vector3 {
    const theta = t * Math.PI * 2;
    const x = this.rx * Math.sin(theta);
    const z = this.rz * Math.cos(theta) - this.zOffset;
    const y = this.cy - Math.abs(x) * 0.08 + z * Math.tan(this.tilt);
    return new THREE.Vector3(x, y, z);
  }
}

export class ProjectsCarousel {
  private scene: THREE.Scene;
  private group: THREE.Group;
  private orbitRingMesh!: THREE.Mesh;
  private pearlsGroup: THREE.Group;

  private bubbles: {
    item: ProjectItem;
    mesh: THREE.Mesh;            // Outer glass sphere (MeshPhysicalMaterial)
    innerMesh: THREE.Mesh;       // Inner frosted core
    previewMesh: THREE.Mesh;     // Website preview card plane
    labelMesh: THREE.Mesh;       // Floating project name label below bubble
    baseScale: number;
    targetScale: number;
    currentScale: number;
  }[] = [];

  private atmosphericSpheres: THREE.Mesh[] = [];
  private darkPearlMesh: THREE.Mesh | null = null;

  // Orbital geometry parameters — slightly wider than Skills to fill the wider viewport
  private radiusX = 5.2;
  private radiusZ = 2.6;
  private zOffset = 1.15;
  private centerY = 0.28;
  private tiltX = 0.06;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.pearlsGroup = new THREE.Group();
    this.group.add(this.pearlsGroup);
    this.scene.add(this.group);

    this.initOrbitRing();
    this.initAtmosphericSpheres();
    this.initProjectBubbles();
  }

  // ═══ ORBIT RING (identical system to SkillsOrbit) ═══
  private initOrbitRing() {
    const curve = new OrbitCurve(
      this.radiusX * 1.02,
      this.radiusZ * 1.15,
      this.centerY - 0.05,
      this.tiltX,
      this.zOffset * 0.85
    );
    const ringGeom = new THREE.TubeGeometry(curve, 128, 0.007, 12, true);

    const ringMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xdde3eb),
      roughness: 0.2,
      metalness: 0.1,
      clearcoat: 0.9,
      transparent: true,
      opacity: 0.85,
    });

    this.orbitRingMesh = new THREE.Mesh(ringGeom, ringMat);
    this.group.add(this.orbitRingMesh);

    // Glowing pearl nodes along the ring (same as Skills)
    const pearlGeom = new THREE.SphereGeometry(0.045, 24, 24);
    const pearlMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xffffff),
      roughness: 0.15,
      clearcoat: 0.8,
      emissive: new THREE.Color(0xd0d8e2),
      emissiveIntensity: 0.35,
    });

    const numPearls = 18;
    for (let i = 0; i < numPearls; i++) {
      const t = i / numPearls;
      const pt = curve.getPoint(t);
      const pearl = new THREE.Mesh(pearlGeom, pearlMat);
      pearl.position.copy(pt);
      this.pearlsGroup.add(pearl);
    }
  }

  // ═══ ATMOSPHERIC DECORATIONS (matches Skills style) ═══
  private initAtmosphericSpheres() {
    // Prominent metallic dark pearl (signature accent, same as original Projects)
    const darkPearlGeom = new THREE.SphereGeometry(0.36, 36, 36);
    const darkPearlMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x282b30),
      roughness: 0.16,
      metalness: 0.42,
      clearcoat: 0.9,
      clearcoatRoughness: 0.08,
      reflectivity: 0.75,
    });
    this.darkPearlMesh = new THREE.Mesh(darkPearlGeom, darkPearlMat);
    this.darkPearlMesh.position.set(1.15, 2.45, -0.6);
    this.group.add(this.darkPearlMesh);

    // Ambient depth pearls (same material spec as SkillsOrbit.ambientSpheres)
    const configs = [
      { pos: [1.8, 1.4, -1.2], r: 0.16 },
      { pos: [-2.2, 1.2, -1.5], r: 0.13 },
      { pos: [-1.4, -1.1, -0.6], r: 0.11 },
      { pos: [0.8, -1.2, -0.8], r: 0.08 },
      { pos: [3.8, 0.6, -2.2], r: 0.18 },
      { pos: [-4.2, 0.7, -2.5], r: 0.18 },
    ];

    const mat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x9ca3ab),
      roughness: 0.32,
      clearcoat: 0.5,
      metalness: 0.04,
    });

    configs.forEach((cfg) => {
      const geom = new THREE.SphereGeometry(cfg.r, 32, 32);
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
      this.atmosphericSpheres.push(mesh);
      this.group.add(mesh);
    });
  }

  // ═══ PROJECT BUBBLES — identical material system to SkillsOrbit ═══
  private initProjectBubbles() {
    const sphereGeom = new THREE.SphereGeometry(1.0, 64, 64);
    const innerGeom = new THREE.SphereGeometry(0.86, 32, 32);

    // Outer MeshPhysicalMaterial (identical spec to SkillsOrbit)
    const outerMatTemplate = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xbcc3cc),
      roughness: 0.22,
      metalness: 0.03,
      clearcoat: 0.85,
      clearcoatRoughness: 0.1,
      reflectivity: 0.7,
      transparent: true,
      opacity: 0.95,
      depthWrite: false,
    });

    // Inner frosted core (identical spec to SkillsOrbit)
    const innerMatTemplate = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x949aa3),
      roughness: 0.45,
      metalness: 0.05,
      clearcoat: 0.3,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });

    // Card dimensions for the website preview plane inside the bubble
    // The card sits at z=1.04 (same offset as iconMesh in Skills)
    const cardW = 1.25;
    const cardH = 0.94;
    const cardGeom = new THREE.PlaneGeometry(cardW, cardH);

    // Label geometry for the floating name below each bubble
    const labelGeom = new THREE.PlaneGeometry(1.7, 0.38);

    PROJECT_ITEMS.forEach((item) => {
      const mesh = new THREE.Mesh(sphereGeom, outerMatTemplate.clone());
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Inner frosted core
      const innerMesh = new THREE.Mesh(innerGeom, innerMatTemplate.clone());
      mesh.add(innerMesh);

      // Website preview card plane (floats at front of bubble like icon in Skills)
      const texture = createProjectPreviewTexture(item);
      const previewMat = new THREE.MeshBasicMaterial({
        map: texture,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const previewMesh = new THREE.Mesh(cardGeom, previewMat);
      previewMesh.position.set(0, 0.06, 1.04);
      mesh.add(previewMesh);

      // Floating label below bubble — same spec as SkillsOrbit.labelMesh
      const labelTexture = createProjectLabelTexture(item.name);
      const labelMat = new THREE.MeshBasicMaterial({
        map: labelTexture,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const labelMesh = new THREE.Mesh(labelGeom, labelMat);
      labelMesh.position.set(0, -1.28, 0.35);
      mesh.add(labelMesh);

      const baseRadius = 0.85;
      this.bubbles.push({
        item,
        mesh,
        innerMesh,
        previewMesh,
        labelMesh,
        baseScale: baseRadius,
        targetScale: baseRadius,
        currentScale: baseRadius,
      });

      this.group.add(mesh);
    });
  }

  public update(
    carouselOffset: number,
    scrollProgress: number,
    elapsedTime: number,
    mouseX: number,
    mouseY: number
  ) {
    // Projects emerges between scrollProgress 2.50 and 4.15
    const projectsEnter = Math.max(0, Math.min(1, (scrollProgress - 2.50) / 0.20));
    const projectsExit = Math.max(0, Math.min(1, 1 - (scrollProgress - 4.15) / 0.25));
    const projectsAlpha = projectsEnter * projectsExit;
    this.group.visible = projectsAlpha > 0.001;
    if (!this.group.visible) return;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isTablet = typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024;
    const responsiveMultiplier = isMobile ? 0.62 : isTablet ? 0.82 : 1.0;
    const currentRadiusX = isMobile ? 2.8 : isTablet ? 3.8 : this.radiusX;
    const currentCenterY = isMobile ? 0.32 : isTablet ? 0.28 : this.centerY;

    // Cinematic entrance (same as SkillsOrbit groupY/groupZ logic)
    const groupY = currentCenterY + (1 - projectsEnter) * -3.5 + (1 - projectsExit) * 2.5 + mouseY * 0.12;
    const groupZ = (1 - projectsEnter) * -8.0 - (1 - projectsExit) * 6.5;
    this.group.position.set(mouseX * 0.18, groupY, groupZ);

    this.orbitRingMesh.rotation.z = Math.sin(elapsedTime * 0.3) * 0.015;

    // Floating dark pearl
    if (this.darkPearlMesh) {
      this.darkPearlMesh.position.y = 2.45 + Math.sin(elapsedTime * 0.9) * 0.04;
      this.darkPearlMesh.position.x = 1.15 + Math.cos(elapsedTime * 0.7) * 0.03;
    }

    this.atmosphericSpheres.forEach((s, idx) => {
      s.position.y += Math.sin(elapsedTime * 0.8 + idx) * 0.0015;
      s.position.x += Math.cos(elapsedTime * 0.6 + idx) * 0.001;
    });

    // Angular spacing identical to SkillsOrbit
    const angularSpacing = isMobile ? 0.58 : 0.48;

    this.bubbles.forEach((b, i) => {
      const relDelta = i - carouselOffset;
      const angle = relDelta * angularSpacing;

      const sinA = Math.sin(angle);
      const cosA = Math.cos(angle);

      // Same orbital math as SkillsOrbit
      const x = sinA * currentRadiusX;
      const y = -Math.abs(sinA) * 0.34 - (1 - cosA) * 0.26;
      const z = cosA * this.radiusZ - this.zOffset;

      const distFromCenter = Math.abs(relDelta);

      // Same scale hierarchy as SkillsOrbit
      const centerFactor = Math.max(0, 1 - distFromCenter);
      const sideFactor = Math.max(0.3, Math.cos(Math.min(Math.PI * 0.48, angle * 1.1)));
      // Center bubble is larger (1.45x) to accommodate the website preview
      const targetScale =
        distFromCenter < 0.45
          ? (1.0 * responsiveMultiplier)
          : (0.64 * Math.pow(sideFactor, 1.2) + 0.66 * Math.pow(centerFactor, 1.4)) * responsiveMultiplier;

      b.currentScale += (targetScale - b.currentScale) * 0.14;
      b.mesh.scale.set(b.currentScale, b.currentScale, b.currentScale);

      const floatOffset = Math.sin(elapsedTime * 1.4 + i * 0.9) * 0.026;
      b.mesh.position.set(x, y + floatOffset, z);

      // Gentle inward rotation — same as SkillsOrbit
      b.mesh.rotation.y = -angle * 0.28;
      b.mesh.rotation.x = this.tiltX;

      // Opacity and material glossiness — identical to SkillsOrbit
      const outerMat = b.mesh.material as THREE.MeshPhysicalMaterial;
      const innerMat = b.innerMesh.material as THREE.MeshPhysicalMaterial;
      const isCenter = distFromCenter < 0.45;

      const visibilityFalloff = Math.max(0, Math.min(1, 1 - (distFromCenter - 2.8) / 1.0));

      if (outerMat) {
        outerMat.opacity = projectsAlpha * visibilityFalloff * (0.5 + 0.5 * Math.min(1, 1 / (distFromCenter + 1)));
        outerMat.roughness = isCenter ? 0.16 : 0.26 + distFromCenter * 0.04;
        outerMat.clearcoat = isCenter ? 0.95 : 0.65;
      }
      if (innerMat) {
        innerMat.opacity = projectsAlpha * visibilityFalloff * (0.35 + 0.35 * Math.min(1, 1 / (distFromCenter + 1)));
      }

      // Preview card opacity — visible across all bubbles (like Skills icon plane)
      const previewMat = b.previewMesh.material as THREE.MeshBasicMaterial;
      if (previewMat) {
        previewMat.opacity = projectsAlpha * visibilityFalloff * Math.max(0.4, 1 - distFromCenter * 0.18);
      }

      // Floating label — visible on side bubbles (identical to SkillsOrbit label logic)
      const labelMat = b.labelMesh.material as THREE.MeshBasicMaterial;
      if (labelMat) {
        const labelAlpha =
          projectsAlpha *
          visibilityFalloff *
          Math.min(1, Math.max(0, (distFromCenter - 0.35) * 3.0)) *
          Math.max(0, 1 - (distFromCenter - 1.8) * 1.2);
        labelMat.opacity = labelAlpha;
        b.labelMesh.visible = labelAlpha > 0.01;
      }
    });
  }

  public getBubbleAt(raycaster: THREE.Raycaster): number | null {
    if (!this.group.visible) return null;
    const meshes = this.bubbles.map((b) => b.mesh);
    const intersects = raycaster.intersectObjects(meshes, false);
    if (intersects.length > 0) {
      const hitMesh = intersects[0].object;
      const idx = this.bubbles.findIndex((b) => b.mesh === hitMesh);
      return idx !== -1 ? idx : null;
    }
    return null;
  }

  public getActiveProjectItem(carouselOffset: number): ProjectItem {
    const total = PROJECT_ITEMS.length;
    const roundIdx = Math.round(carouselOffset);
    const normalized = ((roundIdx % total) + total) % total;
    return PROJECT_ITEMS[normalized];
  }

  public dispose() {
    this.group.clear();
    this.scene.remove(this.group);
  }
}

/**
 * Draws a concise floating label below orbiting project bubbles
 * — identical spec to createSkillLabelTexture in skillIcons.ts
 */
function createProjectLabelTexture(text: string): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  ctx.clearRect(0, 0, 512, 128);
  ctx.fillStyle = '#ffffff';

  const textLen = text.length;
  let fontSize = 32;
  if (textLen > 20) {
    fontSize = 22;
  } else if (textLen > 14) {
    fontSize = 26;
  } else if (textLen > 10) {
    fontSize = 29;
  }

  ctx.font = `800 ${fontSize}px 'Plus Jakarta Sans', -apple-system, sans-serif`;
  ctx.letterSpacing = textLen > 14 ? '0.10em' : '0.16em';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 256, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}
