import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { SkillsOrbit } from '../../3d/SkillsOrbit';
import { ProjectsCarousel } from '../../3d/ProjectsCarousel';
import { ContactScene } from '../../3d/ContactScene';

interface CanvasProps {
  mouseX: number;
  mouseY: number;
  scrollProgress: number;
  carouselOffset?: number;
  projectsCarouselOffset?: number;
  onBubbleClick?: (index: number) => void;
  onProjectBubbleClick?: (index: number) => void;
}

export const HeroCanvasBg = ({
  mouseX,
  mouseY,
  scrollProgress,
  carouselOffset = 4,
  projectsCarouselOffset = 0,
  onBubbleClick,
  onProjectBubbleClick,
}: CanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);
  const carouselOffsetRef = useRef(carouselOffset);
  const projectsCarouselOffsetRef = useRef(projectsCarouselOffset);
  const onBubbleClickRef = useRef(onBubbleClick);
  const onProjectBubbleClickRef = useRef(onProjectBubbleClick);

  useEffect(() => {
    mouseRef.current.x = mouseX;
    mouseRef.current.y = mouseY;
  }, [mouseX, mouseY]);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    carouselOffsetRef.current = carouselOffset;
  }, [carouselOffset]);

  useEffect(() => {
    projectsCarouselOffsetRef.current = projectsCarouselOffset;
  }, [projectsCarouselOffset]);

  useEffect(() => {
    onBubbleClickRef.current = onBubbleClick;
  }, [onBubbleClick]);

  useEffect(() => {
    onProjectBubbleClickRef.current = onProjectBubbleClick;
  }, [onProjectBubbleClick]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x4a4e54, 0.032);

    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 8.5);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      powerPreference: 'high-performance',
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    container.appendChild(renderer.domElement);

    // Studio Lighting
    const ambientLight = new THREE.AmbientLight(0x757c85, 1.45);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.8);
    keyLight.position.set(-6, 9, 7);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 2.5);
    rimLight.position.set(0, 11, -3);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xdde3eb, 1.65);
    fillLight.position.set(7, 3, 5);
    scene.add(fillLight);

    const bounceLight = new THREE.DirectionalLight(0x454b53, 1.15);
    bounceLight.position.set(0, -6, 4);
    scene.add(bounceLight);

    // Dynamic Cursor Proximity Point Light (specular gleam following pointer)
    const cursorLight = new THREE.PointLight(0xffffff, 1.2, 10);
    cursorLight.position.set(0, 0, 4);
    scene.add(cursorLight);

    // Living Organic Material: Custom deformation uniforms
    const deformationUniforms = {
      uTime: { value: 0 },
      uIntensity: { value: 0.038 },
    };

    // Physically based soft silicone clay material with procedural vertex displacement
    const bubbleMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xa6acb3),
      roughness: 0.28,
      metalness: 0.02,
      clearcoat: 0.6,
      clearcoatRoughness: 0.14,
      reflectivity: 0.58,
      transparent: true,
      opacity: 1.0,
    });

    bubbleMaterial.onBeforeCompile = (shader) => {
      shader.uniforms.uTime = deformationUniforms.uTime;
      shader.uniforms.uIntensity = deformationUniforms.uIntensity;
      shader.vertexShader = `
        uniform float uTime;
        uniform float uIntensity;
        ${shader.vertexShader}
      `.replace(
        '#include <begin_vertex>',
        `
        #include <begin_vertex>
        float wave1 = sin(position.x * 2.1 + uTime * 1.2) * cos(position.y * 1.9 + uTime * 1.0);
        float wave2 = cos(position.z * 2.3 + uTime * 0.8) * sin(position.y * 1.5 + uTime * 1.1);
        transformed += normal * (wave1 + wave2) * uIntensity;
        `
      );
    };

    const heroBubblesGroup = new THREE.Group();
    scene.add(heroBubblesGroup);

    interface BubbleData {
      mesh: THREE.Mesh;
      basePos: THREE.Vector3;
      baseScale: THREE.Vector3;
      driftSpeed: number;
      driftOffset: number;
      depthLayer: 'bg' | 'mid' | 'fg';
    }

    const bubbleConfigs = [
      { pos: [0.6, 0.8, -3.2], radius: 2.95, scale: [1.0, 0.98, 1.0], speed: 0.35, offset: 0, layer: 'mid' as const },
      { pos: [0.25, 3.45, -2.5], radius: 0.96, scale: [1.0, 1.0, 1.0], speed: 0.5, offset: 1.2, layer: 'mid' as const },
      { pos: [2.85, 2.65, -3.8], radius: 1.35, scale: [1.0, 1.0, 1.0], speed: 0.45, offset: 4.5, layer: 'bg' as const },
      { pos: [-2.65, 0.05, -1.8], radius: 0.74, scale: [0.95, 1.08, 0.95], speed: 0.7, offset: 2.5, layer: 'fg' as const },
      { pos: [-4.6, -0.2, -2.6], radius: 2.05, scale: [1.02, 0.98, 1.0], speed: 0.45, offset: 3.8, layer: 'mid' as const },
      { pos: [-3.8, 3.0, -4.2], radius: 0.42, scale: [1.0, 1.0, 1.0], speed: 0.9, offset: 5.2, layer: 'bg' as const },
      { pos: [-1.4, 2.6, -5.2], radius: 0.55, scale: [1.0, 1.0, 1.0], speed: 0.6, offset: 0.9, layer: 'bg' as const },
      { pos: [2.5, -1.0, -4.8], radius: 0.9, scale: [1.0, 1.0, 1.0], speed: 0.55, offset: 3.1, layer: 'bg' as const },
    ];

    const bubbles: BubbleData[] = bubbleConfigs.map((cfg) => {
      const geom = new THREE.SphereGeometry(cfg.radius, 64, 64);
      const mesh = new THREE.Mesh(geom, bubbleMaterial.clone());
      mesh.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
      mesh.scale.set(cfg.scale[0], cfg.scale[1], cfg.scale[2]);
      heroBubblesGroup.add(mesh);
      return {
        mesh,
        basePos: mesh.position.clone(),
        baseScale: mesh.scale.clone(),
        driftSpeed: cfg.speed,
        driftOffset: cfg.offset,
        depthLayer: cfg.layer,
      };
    });

    // Initialize 3D Skills Orbit Carousel
    const skillsOrbit = new SkillsOrbit(scene);

    // Initialize 3D Projects Carousel
    const projectsCarousel = new ProjectsCarousel(scene);

    // Initialize 3D Contact Scene
    const contactScene = new ContactScene(scene);

    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
    };

    window.addEventListener('resize', handleResize);

    let animId: number;
    let clock = {
      startTime: performance.now(),
      getElapsedTime: () => (performance.now() - clock.startTime) / 1000,
    };

    const animate = () => {
      animId = requestAnimationFrame(animate);
      const elapsedTime = clock.getElapsedTime();
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const scroll = scrollRef.current;
      const carOffset = carouselOffsetRef.current;
      const projOffset = projectsCarouselOffsetRef.current;

      // Update deformation uniform
      deformationUniforms.uTime.value = elapsedTime;

      // Cursor proximity dynamic lighting
      cursorLight.position.x = mx * 4.5;
      cursorLight.position.y = my * 3.2;

      // Cinematic Continuous Camera Choreography across 3 sections
      let baseCamY = 0;
      let baseCamZ = 8.5;
      let baseLookY = 0;

      if (scroll <= 0.85) {
        // Hero (0) -> Skills (0.85)
        const t = Math.min(1, Math.max(0, scroll / 0.85));
        const s = t * t * (3 - 2 * t);
        baseCamY = -s * 1.8;
        baseCamZ = 8.5 - s * 1.1;
        baseLookY = -s * 0.6;
      } else if (scroll <= 2.65) {
        // Dedicated Skills Orbit Window (Camera steady while bubbles revolve)
        baseCamY = -1.8;
        baseCamZ = 7.4;
        baseLookY = -0.6;
      } else if (scroll <= 4.15) {
        // Skills -> Projects (2.65 to 4.15)
        const t = Math.min(1, Math.max(0, (scroll - 2.65) / 0.8));
        const s = t * t * (3 - 2 * t);
        baseCamY = -1.8 + s * 2.0; // from -1.8 up to +0.2
        baseCamZ = 7.4 + s * 0.75; // from 7.4 to 8.15
        baseLookY = -0.6 + s * 0.7; // from -0.6 to +0.1
      } else {
        // Projects -> Contact (4.15+)
        const t = Math.min(1, Math.max(0, (scroll - 4.15) / 0.7));
        const s = t * t * (3 - 2 * t);
        baseCamY = 0.2 + s * 0.15; // from +0.2 up to +0.35
        baseCamZ = 8.15 - s * 0.35; // from 8.15 to 7.8
        baseLookY = 0.1 - s * 0.05; // from +0.1 to +0.05
      }

      const targetCamX = mx * 0.32;
      const targetCamY = my * 0.2 + baseCamY;
      const targetCamZ = baseCamZ;

      camera.position.x += (targetCamX - camera.position.x) * 0.06;
      camera.position.y += (targetCamY - camera.position.y) * 0.06;
      camera.position.z += (targetCamZ - camera.position.z) * 0.06;
      camera.lookAt(0, baseLookY, 0);

      // Hero Bubbles: Parallax & Scroll Transition
      const heroOpacity = Math.max(0, Math.min(1, 1 - (scroll - 0.1) * 2.2));
      heroBubblesGroup.visible = heroOpacity > 0.001;

      if (heroBubblesGroup.visible) {
        bubbles.forEach((b) => {
          let depthMultiplierX = 0.12;
          let depthMultiplierY = 0.09;
          if (b.depthLayer === 'mid') {
            depthMultiplierX = 0.22;
            depthMultiplierY = 0.16;
          } else if (b.depthLayer === 'fg') {
            depthMultiplierX = 0.35;
            depthMultiplierY = 0.25;
          }

          const floatY = Math.sin(elapsedTime * b.driftSpeed + b.driftOffset) * 0.08;
          const floatX = Math.cos(elapsedTime * b.driftSpeed * 0.7 + b.driftOffset) * 0.04;

          const scrollSpreadX = (b.basePos.x > 0 ? 1 : -1) * scroll * 2.2;
          const scrollSpreadZ = -scroll * 3.5;

          b.mesh.position.y = b.basePos.y + floatY + my * depthMultiplierY - scroll * 1.2;
          b.mesh.position.x = b.basePos.x + floatX + mx * depthMultiplierX + scrollSpreadX;
          b.mesh.position.z = b.basePos.z + scrollSpreadZ;

          const mat = b.mesh.material as THREE.MeshPhysicalMaterial;
          if (mat) {
            mat.opacity = heroOpacity;
          }
        });
      }

      // Update 3D Skills Orbit Carousel
      skillsOrbit.update(carOffset, scroll, elapsedTime, mx, my);

      // Update 3D Projects Carousel
      projectsCarousel.update(projOffset, scroll, elapsedTime, mx, my);

      // Update 3D Contact Scene
      contactScene.update(scroll, elapsedTime, mx, my);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      skillsOrbit.dispose();
      projectsCarousel.dispose();
      contactScene.dispose();
      renderer.dispose();
      scene.clear();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="hero-canvas-bg" aria-hidden="true" />;
};
