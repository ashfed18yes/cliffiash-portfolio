import { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface HeroCanvasProps {
  mouseX: number;
  mouseY: number;
  scrollProgress: number;
}

export const HeroCanvas = ({ mouseX, mouseY, scrollProgress }: HeroCanvasProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mouseRef = useRef({ x: 0, y: 0 });
  const scrollRef = useRef(0);

  useEffect(() => {
    mouseRef.current.x = mouseX;
    mouseRef.current.y = mouseY;
  }, [mouseX, mouseY]);

  useEffect(() => {
    scrollRef.current = scrollProgress;
  }, [scrollProgress]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // --- Scene, Camera, Renderer ---
    const scene = new THREE.Scene();

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
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    // --- Studio Three-Point Lighting ---
    const ambientLight = new THREE.AmbientLight(0x70767f, 1.4);
    scene.add(ambientLight);

    // Key light: top-left angled studio light
    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(-6, 9, 7);
    scene.add(keyLight);

    // Top rim light: creates specular halo along upper edges of spheres
    const rimLight = new THREE.DirectionalLight(0xffffff, 2.2);
    rimLight.position.set(0, 11, -3);
    scene.add(rimLight);

    // Soft fill light: right side
    const fillLight = new THREE.DirectionalLight(0xdbe0e8, 1.6);
    fillLight.position.set(7, 3, 5);
    scene.add(fillLight);

    // Subtle bottom bounce light
    const bounceLight = new THREE.DirectionalLight(0x40454c, 1.0);
    bounceLight.position.set(0, -6, 4);
    scene.add(bounceLight);

    // --- Physically Based Silicone Clay Material ---
    const bubbleMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0xa2a8af),
      roughness: 0.32,
      metalness: 0.02,
      clearcoat: 0.5,
      clearcoatRoughness: 0.16,
      reflectivity: 0.5,
      transmission: 0.08,
      ior: 1.45,
    });

    const foregroundMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x767c83),
      roughness: 0.36,
      metalness: 0.02,
      clearcoat: 0.42,
      clearcoatRoughness: 0.2,
      reflectivity: 0.4,
    });

    // --- Background Floating Bubbles Group ---
    const bubblesGroup = new THREE.Group();
    scene.add(bubblesGroup);

    interface BubbleData {
      mesh: THREE.Mesh;
      basePos: THREE.Vector3;
      baseScale: THREE.Vector3;
      driftSpeed: number;
      driftOffset: number;
    }

    const bubbleConfigs = [
      // 1. Dominant Giant Sphere (Behind subject head & upper center)
      { pos: [0.65, 0.75, -3.2], radius: 2.9, scale: [1.0, 0.98, 1.0], speed: 0.35, offset: 0 },
      // 2. High top-center sphere peeking from upper viewport
      { pos: [0.25, 3.45, -2.5], radius: 0.96, scale: [1.0, 1.0, 1.0], speed: 0.5, offset: 1.2 },
      // 3. Upper-right sphere behind statement
      { pos: [2.8, 2.6, -3.8], radius: 1.3, scale: [1.0, 1.0, 1.0], speed: 0.45, offset: 4.5 },
      // 4. Left midground floating egg/sphere (right next to 'S' and location badge!)
      { pos: [-2.6, 0.1, -1.8], radius: 0.74, scale: [0.95, 1.08, 0.95], speed: 0.7, offset: 2.5 },
      // 5. Far-left large sphere
      { pos: [-4.5, -0.2, -2.6], radius: 2.0, scale: [1.02, 0.98, 1.0], speed: 0.45, offset: 3.8 },
      // 6. Top-left small bubble
      { pos: [-3.8, 3.0, -4.2], radius: 0.42, scale: [1.0, 1.0, 1.0], speed: 0.9, offset: 5.2 },
      // 7. Subtle background depth spheres
      { pos: [-1.4, 2.6, -5.2], radius: 0.55, scale: [1.0, 1.0, 1.0], speed: 0.6, offset: 0.9 },
      { pos: [2.5, -1.0, -4.8], radius: 0.9, scale: [1.0, 1.0, 1.0], speed: 0.55, offset: 3.1 },
    ];

    const bubbles: BubbleData[] = bubbleConfigs.map((cfg) => {
      const geom = new THREE.SphereGeometry(cfg.radius, 64, 64);
      const mesh = new THREE.Mesh(geom, bubbleMaterial);
      mesh.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
      mesh.scale.set(cfg.scale[0], cfg.scale[1], cfg.scale[2]);
      bubblesGroup.add(mesh);
      return {
        mesh,
        basePos: mesh.position.clone(),
        baseScale: mesh.scale.clone(),
        driftSpeed: cfg.speed,
        driftOffset: cfg.offset,
      };
    });

    // --- Foreground Organic Undulating Wave Structure ---
    const foregroundGroup = new THREE.Group();
    scene.add(foregroundGroup);

    interface WaveMound {
      mesh: THREE.Mesh;
      basePos: THREE.Vector3;
      baseScale: THREE.Vector3;
      swayOffset: number;
    }

    const waveMoundsConfig = [
      // Left high organic mound (rising up on the left)
      { pos: [-3.6, -2.4, 1.8], radius: 2.4, scale: [1.45, 1.0, 0.9], offset: 0 },
      // Mid-left connecting dip
      { pos: [-1.8, -2.8, 1.9], radius: 1.8, scale: [1.3, 0.88, 0.8], offset: 1.4 },
      // Center crest (overlapping the subject's chest)
      { pos: [-0.15, -2.5, 2.2], radius: 1.95, scale: [1.45, 0.92, 0.9], offset: 2.8 },
      // Mid-right connecting dip
      { pos: [1.7, -2.8, 1.9], radius: 1.65, scale: [1.25, 0.85, 0.8], offset: 4.2 },
      // Right organic mound
      { pos: [3.6, -2.4, 1.8], radius: 2.3, scale: [1.4, 0.95, 0.9], offset: 5.6 },
    ];

    const waveMounds: WaveMound[] = waveMoundsConfig.map((cfg) => {
      const geom = new THREE.SphereGeometry(cfg.radius, 64, 64);
      const mesh = new THREE.Mesh(geom, foregroundMaterial);
      mesh.position.set(cfg.pos[0], cfg.pos[1], cfg.pos[2]);
      mesh.scale.set(cfg.scale[0], cfg.scale[1], cfg.scale[2]);
      foregroundGroup.add(mesh);
      return {
        mesh,
        basePos: mesh.position.clone(),
        baseScale: mesh.scale.clone(),
        swayOffset: cfg.offset,
      };
    });

    // Deep base fill sphere to ensure a solid, continuous horizon at the bottom
    const baseBackdrop = new THREE.Mesh(
      new THREE.SphereGeometry(6.5, 32, 32),
      foregroundMaterial
    );
    baseBackdrop.position.set(0, -6.8, 1.5);
    baseBackdrop.scale.set(1.5, 0.7, 0.8);
    foregroundGroup.add(baseBackdrop);

    // --- Resize Handler ---
    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    };

    window.addEventListener('resize', handleResize);

    // --- Animation Loop ---
    let animId: number;
    let clock = new THREE.Clock();

    const animate = () => {
      animId = requestAnimationFrame(animate);

      const elapsedTime = clock.getElapsedTime();
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const scroll = scrollRef.current;

      // 1. Subtle camera parallax & scroll reaction
      const targetCamX = mx * 0.35;
      const targetCamY = my * 0.22 - scroll * 1.5;
      const targetCamZ = 8.5 - scroll * 1.2;

      camera.position.x += (targetCamX - camera.position.x) * 0.05;
      camera.position.y += (targetCamY - camera.position.y) * 0.05;
      camera.position.z += (targetCamZ - camera.position.z) * 0.05;
      camera.lookAt(0, -scroll * 0.5, 0);

      // 2. Organic buoyancy on bubbles
      bubbles.forEach((b) => {
        const floatY = Math.sin(elapsedTime * b.driftSpeed + b.driftOffset) * 0.08;
        const floatX = Math.cos(elapsedTime * b.driftSpeed * 0.7 + b.driftOffset) * 0.04;
        b.mesh.position.y = b.basePos.y + floatY + my * 0.12;
        b.mesh.position.x = b.basePos.x + floatX + mx * 0.15;
      });

      // 3. Subtle breathing and scroll progress on the foreground wave
      waveMounds.forEach((w) => {
        const waveSway = Math.sin(elapsedTime * 0.5 + w.swayOffset) * 0.025;
        const scrollRise = scroll * 1.4;
        w.mesh.position.y = w.basePos.y + waveSway + scrollRise - my * 0.06;
        w.mesh.position.x = w.basePos.x + mx * 0.08;
      });

      renderer.render(scene, camera);
    };

    animate();

    // --- Cleanup ---
    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      renderer.dispose();
      scene.clear();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="hero-canvas-bg" aria-hidden="true" />;
};
