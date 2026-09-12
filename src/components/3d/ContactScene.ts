import * as THREE from 'three';

function createQuoteTexture(): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');
  if (!ctx) return new THREE.CanvasTexture(canvas);

  ctx.clearRect(0, 0, 1024, 1024);

  // Handwritten stylistic typography matching reference:
  // "Good \n Ideas \n Build \n Better \n Futures."
  ctx.save();
  ctx.translate(512, 512);
  ctx.rotate(-0.06); // Subtle authentic handwriting slant

  ctx.fillStyle = '#ffffff';
  ctx.shadowColor = 'rgba(255, 255, 255, 0.45)';
  ctx.shadowBlur = 16;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  // Use elegant italic cursive styling
  const lines = ['Good', 'Ideas', 'Build', 'Better', 'Futures.'];
  const fontSize = 110;
  const lineSpacing = 148;
  const startY = -((lines.length - 1) * lineSpacing) / 2;

  ctx.font = `italic 600 ${fontSize}px "Caveat", "Segoe Script", "Brush Script MT", "Playfair Display", Georgia, serif`;

  lines.forEach((line, i) => {
    const y = startY + i * lineSpacing;
    // Slight humanized positional jitter
    const xOffset = i % 2 === 0 ? -12 : 12;
    ctx.fillText(line, xOffset, y);
  });

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

function createContactGlassMaterial(): THREE.ShaderMaterial {
  return new THREE.ShaderMaterial({
    uniforms: {
      uOpacity: { value: 1.0 },
      uFresnelPower: { value: 2.4 },
      uRimIntensity: { value: 0.72 },
    },
    vertexShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec2 vUv;

      void main() {
        vUv = uv;
        vNormal = normalize(normalMatrix * normal);
        vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
        vViewPosition = -mvPosition.xyz;
        gl_Position = projectionMatrix * mvPosition;
      }
    `,
    fragmentShader: `
      varying vec3 vNormal;
      varying vec3 vViewPosition;
      varying vec2 vUv;
      uniform float uOpacity;
      uniform float uFresnelPower;
      uniform float uRimIntensity;

      void main() {
        vec3 normal = normalize(vNormal);
        vec3 viewDir = normalize(vViewPosition);

        // 1. Fresnel Rim (glossy spherical edge definition)
        float NdotV = max(0.0, dot(normal, viewDir));
        float fresnel = pow(1.0 - NdotV, uFresnelPower) * uRimIntensity;

        // 2. Primary Top-Left Curved Specular Highlight (tightened to prevent blowout)
        vec3 lightDir1 = normalize(vec3(-0.35, 0.92, 0.5));
        vec3 halfVec1 = normalize(lightDir1 + viewDir);
        float spec1 = pow(max(0.0, dot(normal, halfVec1)), 72.0) * 0.65;

        // Secondary Soft Highlight
        vec3 lightDir2 = normalize(vec3(0.28, 0.85, 0.4));
        vec3 halfVec2 = normalize(lightDir2 + viewDir);
        float spec2 = pow(max(0.0, dot(normal, halfVec2)), 36.0) * 0.32;

        // 3. Lower Rim Bounce Reflection
        vec3 bounceDir = normalize(vec3(0.45, -0.65, 0.45));
        vec3 halfBounce = normalize(bounceDir + viewDir);
        float bounce = pow(max(0.0, dot(normal, halfBounce)), 22.0) * 0.22;

        // Luminous glass tint
        vec3 tint = mix(vec3(1.0), vec3(0.92, 0.95, 0.99), fresnel);

        // Alpha driven by rim + highlights only — capped well below 1.0 so the sphere stays translucent
        float alpha = (fresnel + spec1 + spec2 + bounce + 0.03) * uOpacity;
        alpha = clamp(alpha, 0.0, 0.88);

        gl_FragColor = vec4(tint, alpha);
      }
    `,
    transparent: true,
    depthWrite: false,
    side: THREE.FrontSide,
  });
}

export class ContactScene {
  private scene: THREE.Scene;
  private group: THREE.Group;
  private largeBubbleGroup: THREE.Group;
  private glassMat: THREE.ShaderMaterial;
  private quotePlaneMesh: THREE.Mesh;
  private atmosphericSpheres: THREE.Mesh[] = [];

  constructor(scene: THREE.Scene) {
    this.scene = scene;
    this.group = new THREE.Group();
    this.scene.add(this.group);

    this.largeBubbleGroup = new THREE.Group();
    this.group.add(this.largeBubbleGroup);

    this.glassMat = createContactGlassMaterial();

    // 1. Large Right-Side Bubble (radius: 2.35)
    const bubbleGeom = new THREE.SphereGeometry(2.35, 64, 64);
    const bubbleMesh = new THREE.Mesh(bubbleGeom, this.glassMat);
    bubbleMesh.renderOrder = 3;
    this.largeBubbleGroup.add(bubbleMesh);

    // 2. Internal Handwritten Quote Plane
    const quoteTex = createQuoteTexture();
    const planeGeom = new THREE.PlaneGeometry(2.8, 2.8);
    const planeMat = new THREE.MeshBasicMaterial({
      map: quoteTex,
      transparent: true,
      depthWrite: false,
      side: THREE.FrontSide,
    });
    this.quotePlaneMesh = new THREE.Mesh(planeGeom, planeMat);
    this.quotePlaneMesh.position.set(-0.15, 0.1, 0.08);
    this.quotePlaneMesh.rotation.y = -0.12;
    this.quotePlaneMesh.rotation.z = 0.04;
    this.quotePlaneMesh.renderOrder = 2;
    this.largeBubbleGroup.add(this.quotePlaneMesh);

    // Initial positioning in upper-right
    this.largeBubbleGroup.position.set(2.45, 0.85, 0.45);

    // 3. Atmospheric Spheres matching reference
    this.initAtmosphericSpheres();
  }

  private initAtmosphericSpheres() {
    // Dark metallic pearl material
    const darkMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x24272c),
      roughness: 0.18,
      metalness: 0.45,
      clearcoat: 0.88,
      clearcoatRoughness: 0.08,
      reflectivity: 0.8,
    });

    // Soft silver pearl material
    const silverMat = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xb6bec6),
      roughness: 0.22,
      metalness: 0.05,
      clearcoat: 0.75,
      clearcoatRoughness: 0.12,
      transparent: true,
      opacity: 0.94,
      depthWrite: false,
    });

    const configs = [
      // Prominent upper-left metallic sphere (positioned clear of header AS monogram)
      { pos: [-2.2, 2.25, -1.8], r: 0.36, dark: true },
      // Smaller floating dark sphere near center-left
      { pos: [-0.22, 0.52, -0.6], r: 0.16, dark: true },
      // Soft pearl near left title
      { pos: [-2.85, 0.05, -0.4], r: 0.12, dark: false },
      // Soft pearl bottom right
      { pos: [3.35, -1.65, 0.6], r: 0.18, dark: false },
      // Distant upper background sphere
      { pos: [3.6, 2.1, -3.2], r: 0.26, dark: true },
      // Bottom left ambient pearl
      { pos: [-1.8, -1.5, 0.5], r: 0.11, dark: false },
    ];

    configs.forEach((cfg) => {
      const geom = new THREE.SphereGeometry(cfg.r, 28, 28);
      const mesh = new THREE.Mesh(geom, cfg.dark ? darkMat : silverMat);
      mesh.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
      this.atmosphericSpheres.push(mesh);
      this.group.add(mesh);
    });
  }

  public update(
    scrollProgress: number,
    elapsedTime: number,
    mouseX: number,
    mouseY: number
  ) {
    // Emerges between scroll 4.15 and 5.0+
    const contactAlpha = Math.max(0, Math.min(1, (scrollProgress - 4.15) / 0.45));
    this.group.visible = contactAlpha > 0.001;
    if (!this.group.visible) return;

    this.glassMat.uniforms.uOpacity.value = contactAlpha;
    const quoteMat = this.quotePlaneMesh.material as THREE.MeshBasicMaterial;

    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    const isTablet =
      typeof window !== 'undefined' &&
      window.innerWidth >= 768 &&
      window.innerWidth < 1024;

    if (quoteMat) {
      quoteMat.opacity = contactAlpha * (isMobile ? 0.65 : 0.94);
    }

    const responsiveMultiplier = isMobile ? 0.52 : isTablet ? 0.82 : 1.0;
    const targetBubbleX = isMobile ? 1.35 : isTablet ? 1.8 : 2.45;
    const targetBubbleY = isMobile ? 1.6 : isTablet ? 1.1 : 0.85;
    const targetBubbleZ = isMobile ? -0.2 : 0.45;

    // Cinematic entrance trajectory from below
    const groupY = (1 - contactAlpha) * -5.0 + mouseY * 0.12;
    const groupZ = (1 - contactAlpha) * -8.0;
    this.group.position.set(mouseX * 0.15, groupY, groupZ);

    // Gentle buoyant floating for large quote bubble
    const bubbleFloat = Math.sin(elapsedTime * 0.95) * 0.035;
    this.largeBubbleGroup.position.set(
      targetBubbleX + mouseX * 0.12,
      targetBubbleY + bubbleFloat + mouseY * 0.08,
      targetBubbleZ
    );

    this.largeBubbleGroup.scale.set(
      responsiveMultiplier,
      responsiveMultiplier,
      responsiveMultiplier
    );

    // Subtle drift for atmospheric spheres
    this.atmosphericSpheres.forEach((s, idx) => {
      s.position.y += Math.sin(elapsedTime * 0.7 + idx * 1.2) * 0.0018;
      s.position.x += Math.cos(elapsedTime * 0.5 + idx * 0.8) * 0.0012;
    });
  }

  public dispose() {
    this.glassMat.dispose();
    this.group.clear();
    this.scene.remove(this.group);
  }
}
