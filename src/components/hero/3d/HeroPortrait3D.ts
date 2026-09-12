import * as THREE from 'three';
import heroPortraitUrl from '../../../assets/hero-portrait-3d.png';

const VERTEX_SHADER = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vViewPosition;

uniform float uCurvature;

void main() {
  vUv = uv;
  vec3 pos = position;

  // 1. Anatomical Volume Curvature (shoulders curve slightly back)
  float curveX = (pos.x * pos.x) * uCurvature;
  pos.z -= curveX;

  // 2. Chest depth contour (gentle forward bow in mid-torso)
  float depthMod = sin(uv.y * 3.14159) * 0.05;
  pos.z += depthMod;

  vec4 worldPos = modelMatrix * vec4(pos, 1.0);
  vWorldPosition = worldPos.xyz;

  vec4 mvPosition = viewMatrix * worldPos;
  vViewPosition = -mvPosition.xyz;

  // Compute curved surface normal
  vec3 norm = normal;
  norm.x += pos.x * (uCurvature * 2.2);
  norm = normalize(norm);
  vNormal = normalize(normalMatrix * norm);

  gl_Position = projectionMatrix * mvPosition;
}
`;

const FRAGMENT_SHADER = `
varying vec2 vUv;
varying vec3 vNormal;
varying vec3 vWorldPosition;
varying vec3 vViewPosition;

uniform sampler2D uTexture;
uniform vec3 uKeyLightPos;
uniform vec3 uRimLightPos;
uniform vec3 uFillLightPos;
uniform vec3 uKeyLightColor;
uniform vec3 uRimLightColor;
uniform vec3 uFillLightColor;
uniform vec3 uAmbientColor;
uniform float uRimIntensity;
uniform float uOpacity;

void main() {
  vec4 texColor = texture2D(uTexture, vUv);

  // Clean alpha cutoff to prevent depth write artifacts on transparent edges
  if (texColor.a < 0.015) {
    discard;
  }

  vec3 normal = normalize(vNormal);
  vec3 viewDir = normalize(vViewPosition);

  // 1. Studio Key Light (diffuse directional wrap)
  vec3 keyDir = normalize(uKeyLightPos - vWorldPosition);
  float NdotKey = max(dot(normal, keyDir), 0.0);
  vec3 diffuseKey = uKeyLightColor * (0.62 + 0.38 * NdotKey);

  // 2. Studio Fill Light (soft shadow fill)
  vec3 fillDir = normalize(uFillLightPos - vWorldPosition);
  float NdotFill = max(dot(normal, fillDir), 0.0);
  vec3 diffuseFill = uFillLightColor * (0.5 + 0.5 * NdotFill) * 0.35;

  // 3. 3D Studio Rim Light (Fresnel grazing edge glow matching surrounding silicone spheres)
  float fresnel = pow(1.0 - max(dot(viewDir, normal), 0.0), 2.5);
  vec3 rimLight = uRimLightColor * (fresnel * uRimIntensity);

  // 4. Contact Ambient Occlusion towards bottom of torso
  float bottomAO = smoothstep(0.0, 0.4, vUv.y);
  float aoFactor = 0.76 + 0.24 * bottomAO;

  // 5. Composite Studio Lighting with Photographic Albedo
  vec3 litColor = texColor.rgb * (uAmbientColor + diffuseKey * 0.72 + diffuseFill);
  litColor *= aoFactor;

  // Add edge rim light only where subject is solid
  if (texColor.a > 0.4) {
    litColor += rimLight * 0.75;
  }

  float alpha = texColor.a * uOpacity;

  gl_FragColor = vec4(litColor, alpha);
}
`;

export class HeroPortrait3D {
  public group: THREE.Group;
  private mesh: THREE.Mesh;
  private material: THREE.ShaderMaterial;
  private currentX = -0.05;
  private currentY = -0.42;
  private currentZ = 0.5;
  private currentRotX = 0;
  private currentRotY = 0;

  constructor() {
    this.group = new THREE.Group();

    // Portrait geometry: width: 3.65, height: 3.86 (matches aspect ratio 1040/1100 = 0.945)
    const geometry = new THREE.PlaneGeometry(3.65, 3.86, 64, 64);

    const textureLoader = new THREE.TextureLoader();
    const texture = textureLoader.load(heroPortraitUrl);
    texture.generateMipmaps = true;
    texture.minFilter = THREE.LinearMipmapLinearFilter;
    texture.magFilter = THREE.LinearFilter;

    this.material = new THREE.ShaderMaterial({
      vertexShader: VERTEX_SHADER,
      fragmentShader: FRAGMENT_SHADER,
      uniforms: {
        uTexture: { value: texture },
        uCurvature: { value: 0.075 }, // subtle 3D cylindrical wrap
        uKeyLightPos: { value: new THREE.Vector3(-6.0, 9.0, 7.0) },
        uRimLightPos: { value: new THREE.Vector3(0.0, 11.0, -3.0) },
        uFillLightPos: { value: new THREE.Vector3(7.0, 3.0, 5.0) },
        uKeyLightColor: { value: new THREE.Color(0xffffff) },
        uRimLightColor: { value: new THREE.Color(0xdbe4ed) },
        uFillLightColor: { value: new THREE.Color(0xb8c0ca) },
        uAmbientColor: { value: new THREE.Color(0x62666d) },
        uRimIntensity: { value: 0.9 },
        uOpacity: { value: 1.0 },
      },
      transparent: true,
      depthTest: true,
      depthWrite: true,
      side: THREE.FrontSide,
    });

    this.mesh = new THREE.Mesh(geometry, this.material);
    this.mesh.renderOrder = 1; // Renders before foreground wave mounds (renderOrder: 2)
    this.group.add(this.mesh);

    // Initial position in 3D scene (z = 0.5 sits in front of text and behind wave at z = 1.8-2.1)
    this.group.position.set(-0.05, -0.42, 0.5);
  }

  public update(
    scrollProgress: number,
    elapsedTime: number,
    mouseX: number,
    mouseY: number,
    viewportWidth: number
  ) {
    // 1. Responsive Baseline Coordinates & Scale
    const isMobile = viewportWidth < 768;
    const isTablet = viewportWidth >= 768 && viewportWidth < 1024;

    const baseScale = isMobile ? 0.68 : isTablet ? 0.86 : 1.0;
    const baseY = isMobile ? -0.42 : isTablet ? -0.32 : -0.42;
    const baseX = -0.05;
    const baseZ = 0.5;

    // 2. Mouse Parallax (Subtle 3D perspective shift, face remains perfectly stable)
    const targetParallaxX = mouseX * 0.15;
    const targetParallaxY = mouseY * 0.08;
    const targetRotY = mouseX * 0.04;
    const targetRotX = -mouseY * 0.02;

    // 3. Subtle Buoyant Breathing Motion
    const breath = Math.sin(elapsedTime * 0.8) * 0.012;

    // 4. Scroll Choreography (Hero -> Skills)
    // Portrait recedes deeper along Z and descends smoothly as 3D waves climb in front
    const scrollZ = -scrollProgress * 3.2;
    const scrollY = -scrollProgress * 2.2;
    const scrollScale = Math.max(0.7, 1.0 - scrollProgress * 0.2);

    const targetX = baseX + targetParallaxX;
    const targetY = baseY + targetParallaxY + breath + scrollY;
    const targetZ = baseZ + scrollZ;

    // Smooth lerp for physical weight
    this.currentX += (targetX - this.currentX) * 0.12;
    this.currentY += (targetY - this.currentY) * 0.12;
    this.currentZ += (targetZ - this.currentZ) * 0.12;
    this.currentRotX += (targetRotX - this.currentRotX) * 0.1;
    this.currentRotY += (targetRotY - this.currentRotY) * 0.1;

    this.group.position.set(this.currentX, this.currentY, this.currentZ);
    this.group.rotation.set(this.currentRotX, this.currentRotY, 0);

    const finalScale = baseScale * scrollScale;
    this.group.scale.set(finalScale, finalScale, finalScale);

    // Fade out as it gets completely swallowed behind the rising waves in Skills
    const opacityProgress = Math.max(
      0,
      Math.min(1, 1 - (scrollProgress - 0.55) / 0.3)
    );
    this.material.uniforms.uOpacity.value = opacityProgress;
    this.group.visible = opacityProgress > 0.001;
  }

  public dispose() {
    this.mesh.geometry.dispose();
    this.material.dispose();
    this.group.clear();
  }
}
