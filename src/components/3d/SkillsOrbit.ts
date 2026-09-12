import * as THREE from 'three';
import { SKILL_ITEMS } from '../../data/skills';
import type { SkillItem } from '../../data/skills';
import {
  createSkillIconTexture,
  createSkillCenterTextTexture,
  createSkillLabelTexture,
} from '../../utils/skillIcons';

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

export class SkillsOrbit {
  private scene: THREE.Scene;
  private group: THREE.Group;
  private orbitRingMesh!: THREE.Mesh;
  private pearlsGroup: THREE.Group;
  private bubbles: {
    item: SkillItem;
    mesh: THREE.Mesh;
    innerMesh: THREE.Mesh;
    iconMesh: THREE.Mesh;
    centerTextMesh: THREE.Mesh;
    labelMesh: THREE.Mesh;
    baseScale: number;
    targetScale: number;
    currentScale: number;
  }[] = [];
  private ambientSpheres: THREE.Mesh[] = [];

  private radiusX = 4.7;
  private radiusZ = 2.5;
  private zOffset = 1.35;
  private centerY = -0.22;
  private tiltX = 0.07;

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.pearlsGroup = new THREE.Group();
    this.group.add(this.pearlsGroup);
    this.scene.add(this.group);

    this.initOrbitRing();
    this.initAmbientSpheres();
    this.initBubbles();
  }

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

    // Add glowing pearl nodes along the ring
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

  private initAmbientSpheres() {
    const ambientConfigs = [
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

    ambientConfigs.forEach((cfg) => {
      const geom = new THREE.SphereGeometry(cfg.r, 32, 32);
      const mesh = new THREE.Mesh(geom, mat);
      mesh.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
      this.ambientSpheres.push(mesh);
      this.group.add(mesh);
    });
  }

  private initBubbles() {
    const sphereGeom = new THREE.SphereGeometry(1.0, 64, 64);
    const innerGeom = new THREE.SphereGeometry(0.86, 32, 32);

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

    const innerMatTemplate = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x949aa3),
      roughness: 0.45,
      metalness: 0.05,
      clearcoat: 0.3,
      transparent: true,
      opacity: 0.6,
      depthWrite: false,
    });

    SKILL_ITEMS.forEach((item) => {
      const mesh = new THREE.Mesh(sphereGeom, outerMatTemplate.clone());
      mesh.castShadow = true;
      mesh.receiveShadow = true;

      // Inner frosted core for layered optical depth
      const innerMesh = new THREE.Mesh(innerGeom, innerMatTemplate.clone());
      mesh.add(innerMesh);

      // Icon plane floating on front of bubble
      const iconTexture = createSkillIconTexture(item);
      const iconGeom = new THREE.PlaneGeometry(1.2, 1.2);
      const iconMat = new THREE.MeshBasicMaterial({
        map: iconTexture,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const iconMesh = new THREE.Mesh(iconGeom, iconMat);
      iconMesh.position.set(0, 0.08, 1.04);
      mesh.add(iconMesh);

      // Center text plane (Title + BUILD · SOLVE · CREATE) for active central state
      const centerTextTexture = createSkillCenterTextTexture(item);
      const centerTextGeom = new THREE.PlaneGeometry(2.0, 1.0);
      const centerTextMat = new THREE.MeshBasicMaterial({
        map: centerTextTexture,
        transparent: true,
        depthWrite: false,
        side: THREE.DoubleSide,
      });
      const centerTextMesh = new THREE.Mesh(centerTextGeom, centerTextMat);
      centerTextMesh.position.set(0, -0.42, 1.05);
      mesh.add(centerTextMesh);

      // Floating concise label below bubble for side orbiting states
      const labelTexture = createSkillLabelTexture(item.name);
      const labelGeom = new THREE.PlaneGeometry(1.5, 0.38);
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
        iconMesh,
        centerTextMesh,
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
    // Skills enter/exit window in the overall choreography
    // Skills is active from 0.65 to 2.65
    const skillsEnter = Math.max(0, Math.min(1, (scrollProgress - 0.55) / 0.25));
    const skillsExit = Math.max(0, Math.min(1, 1 - (scrollProgress - 2.45) / 0.20));
    const skillsAlpha = skillsEnter * skillsExit;
    this.group.visible = skillsAlpha > 0.001;
    if (!this.group.visible) return;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isTablet = typeof window !== 'undefined' && window.innerWidth >= 768 && window.innerWidth < 1024;
    const responsiveMultiplier = isMobile ? 0.62 : isTablet ? 0.82 : 1.0;
    const currentRadiusX = isMobile ? 2.8 : isTablet ? 3.8 : this.radiusX;
    const currentCenterY = isMobile ? -0.32 : isTablet ? -0.24 : this.centerY;

    const groupY = currentCenterY + (1 - skillsEnter) * -3.5 + (1 - skillsExit) * 2.5 + mouseY * 0.12;
    const groupZ = (1 - skillsEnter) * -8.0 - (1 - skillsExit) * 6.5;
    this.group.position.set(mouseX * 0.18, groupY, groupZ);

    this.orbitRingMesh.rotation.z = Math.sin(elapsedTime * 0.3) * 0.015;

    this.ambientSpheres.forEach((s, idx) => {
      s.position.y += Math.sin(elapsedTime * 0.8 + idx) * 0.0015;
      s.position.x += Math.cos(elapsedTime * 0.6 + idx) * 0.001;
    });

    const angularSpacing = isMobile ? 0.58 : 0.48;

    this.bubbles.forEach((b, i) => {
      const relDelta = i - carouselOffset;
      const angle = relDelta * angularSpacing;

      const sinA = Math.sin(angle);
      const cosA = Math.cos(angle);

      // Physical travel along 3D elliptical orbit through depth
      const x = sinA * currentRadiusX;
      // Soft gentle vertical sag as bubbles curve toward sides
      const y = -Math.abs(sinA) * 0.34 - (1 - cosA) * 0.26;
      // Z depth: closest at angle=0 (center), receding into background on sides
      const z = cosA * this.radiusZ - this.zOffset;

      const distFromCenter = Math.abs(relDelta);

      // Scale factor: Center bubble reaches 1.30 * responsiveMultiplier
      // Approaching bubbles grow larger, receding bubbles shrink down to 0.40
      const centerFactor = Math.max(0, 1 - distFromCenter);
      const sideFactor = Math.max(0.3, Math.cos(Math.min(Math.PI * 0.48, angle * 1.1)));
      const targetScale = (0.64 * Math.pow(sideFactor, 1.2) + 0.66 * Math.pow(centerFactor, 1.4)) * responsiveMultiplier;

      b.currentScale += (targetScale - b.currentScale) * 0.14;
      b.mesh.scale.set(b.currentScale, b.currentScale, b.currentScale);

      const floatOffset = Math.sin(elapsedTime * 1.4 + i * 0.9) * 0.026;
      b.mesh.position.set(x, y + floatOffset, z);

      // Gentle inward rotation to face the viewer
      b.mesh.rotation.y = -angle * 0.28;
      b.mesh.rotation.x = this.tiltX;

      // Opacity and Material glossiness
      const outerMat = b.mesh.material as THREE.MeshPhysicalMaterial;
      const innerMat = b.innerMesh.material as THREE.MeshPhysicalMaterial;
      const isCenter = distFromCenter < 0.45;

      // Far bubbles beyond 3.5 units fade out smoothly
      const visibilityFalloff = Math.max(0, Math.min(1, 1 - (distFromCenter - 2.8) / 1.0));

      if (outerMat) {
        outerMat.opacity = skillsAlpha * visibilityFalloff * (0.5 + 0.5 * Math.min(1, 1 / (distFromCenter + 1)));
        outerMat.roughness = isCenter ? 0.16 : 0.26 + distFromCenter * 0.04;
        outerMat.clearcoat = isCenter ? 0.95 : 0.65;
      }
      if (innerMat) {
        innerMat.opacity = skillsAlpha * visibilityFalloff * (0.35 + 0.35 * Math.min(1, 1 / (distFromCenter + 1)));
      }

      // Icon plane opacity
      const iconMat = b.iconMesh.material as THREE.MeshBasicMaterial;
      if (iconMat) {
        iconMat.opacity = skillsAlpha * visibilityFalloff * Math.max(0.4, 1 - distFromCenter * 0.18);
      }

      // Center text plane: Visible ONLY when bubble is near center
      const centerTextMat = b.centerTextMesh.material as THREE.MeshBasicMaterial;
      if (centerTextMat) {
        const textAlpha = skillsAlpha * Math.max(0, 1 - distFromCenter * 1.8);
        centerTextMat.opacity = textAlpha;
        b.centerTextMesh.visible = textAlpha > 0.01;
      }

      // Floating label plane: Visible on side bubbles (distFromCenter between 0.35 and 2.5)
      const labelMat = b.labelMesh.material as THREE.MeshBasicMaterial;
      if (labelMat) {
        const labelAlpha =
          skillsAlpha *
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

  public dispose() {
    this.group.clear();
    this.scene.remove(this.group);
  }
}
