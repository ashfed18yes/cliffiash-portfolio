import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { HeroPortrait3D } from './HeroPortrait3D';

interface CanvasProps {
  mouseX: number;
  mouseY: number;
  scrollProgress: number;
}

export const HeroCanvasFg = ({ mouseX, mouseY, scrollProgress }: CanvasProps) => {
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
    renderer.setPixelRatio(1);
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    container.appendChild(renderer.domElement);

    // Matching studio lighting
    const ambientLight = new THREE.AmbientLight(0x70767f, 1.35);
    scene.add(ambientLight);

    const keyLight = new THREE.DirectionalLight(0xffffff, 2.6);
    keyLight.position.set(-6, 9, 7);
    scene.add(keyLight);

    const rimLight = new THREE.DirectionalLight(0xffffff, 2.3);
    rimLight.position.set(0, 11, -3);
    scene.add(rimLight);

    const fillLight = new THREE.DirectionalLight(0xdde3eb, 1.55);
    fillLight.position.set(7, 3, 5);
    scene.add(fillLight);

    const bounceLight = new THREE.DirectionalLight(0x3e434a, 1.05);
    bounceLight.position.set(0, -6, 4);
    scene.add(bounceLight);

    // Foreground soft charcoal silicone clay material
    const foregroundMaterial = new THREE.MeshPhysicalMaterial({
      color: new THREE.Color(0x60656d),
      roughness: 0.38,
      metalness: 0.02,
      clearcoat: 0.45,
      clearcoatRoughness: 0.18,
      reflectivity: 0.42,
    });

    const foregroundGroup = new THREE.Group();
    scene.add(foregroundGroup);

    // 3D Hero Portrait Character (Authentic photographic 3D object)
    const heroPortrait = new HeroPortrait3D();
    scene.add(heroPortrait.group);

    interface WaveMound {
      mesh: THREE.Mesh;
      basePos: THREE.Vector3;
      baseScale: THREE.Vector3;
      swayOffset: number;
    }

    const waveMoundsConfig = [
      // Left high organic mound
      { pos: [-3.7, -2.4, 1.8], radius: 2.45, scale: [1.45, 1.02, 0.9], offset: 0 },
      // Mid-left connecting dip (keeps bottom of 'S' and 'H' visible)
      { pos: [-1.9, -3.15, 1.9], radius: 1.75, scale: [1.3, 0.86, 0.8], offset: 1.4 },
      // Center crest (overlaps lower chest of subject while keeping collar and chest clear)
      { pos: [-0.15, -2.85, 2.1], radius: 1.85, scale: [1.45, 0.9, 0.88], offset: 2.8 },
      // Mid-right connecting dip
      { pos: [1.8, -3.15, 1.9], radius: 1.65, scale: [1.25, 0.84, 0.8], offset: 4.2 },
      // Right organic mound
      { pos: [3.7, -2.45, 1.8], radius: 2.35, scale: [1.42, 0.96, 0.9], offset: 5.6 },
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

    // Deep horizon fill sphere
    const baseBackdrop = new THREE.Mesh(
      new THREE.SphereGeometry(7.0, 32, 32),
      foregroundMaterial
    );
    baseBackdrop.position.set(0, -7.5, 1.5);
    baseBackdrop.scale.set(1.6, 0.7, 0.8);
    foregroundGroup.add(baseBackdrop);

    const handleResize = () => {
      if (!container) return;
      const width = container.clientWidth;
      const height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
      renderer.setPixelRatio(1);
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

      // Perfectly synchronized camera with Background Canvas across 3 sections
      let baseCamY = 0;
      let baseCamZ = 8.5;
      let baseLookY = 0;

      if (scroll <= 1.0) {
        // Hero (0) -> Skills (1)
        const t = scroll;
        baseCamY = -t * 1.8;
        baseCamZ = 8.5 - t * 1.1;
        baseLookY = -t * 0.6;
      } else if (scroll <= 2.0) {
        // Skills (1) -> Projects (2)
        const t = Math.min(1, scroll - 1.0);
        const s = t * t * (3 - 2 * t);
        baseCamY = -1.8 + s * 2.0; // from -1.8 up to +0.2
        baseCamZ = 7.4 + s * 0.75; // from 7.4 to 8.15
        baseLookY = -0.6 + s * 0.7; // from -0.6 to +0.1
      } else {
        // Projects (2) -> Contact (3)
        const t = Math.min(1, scroll - 2.0);
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

      // Organic Wave Dynamic Choreography:
      // Hero (scroll = 0): Resting wave at bottom.
      // Mid-Transition (scroll = 0.15 to 0.6): Wave swells upward.
      // Skills (scroll ~ 1.0): Framing mounds at bottom of Skills.
      // Projects (scroll ~ 2.0): Smoothly frames lower corners of the Projects carousel.
      const swell = Math.sin(Math.min(Math.PI, scroll * Math.PI)) * 0.85;
      const projectsFraming = Math.max(0, Math.min(1, (scroll - 1.25) / 0.55));
      const framingAdjustmentY = projectsFraming * -0.55;

      waveMounds.forEach((w, idx) => {
        // Procedural breathing and subtle sway
        const waveSway = Math.sin(elapsedTime * 0.5 + w.swayOffset) * 0.025;
        const waveBreathe = Math.cos(elapsedTime * 0.4 + w.swayOffset) * 0.015;

        // In Projects, center dips down to give clear visibility to timeline & pills, while outer mounds frame the corners
        let moundFramingY = framingAdjustmentY;
        let moundFramingX = 0;
        if (idx === 0) {
          // Left high mound
          moundFramingX = -0.65 * projectsFraming;
          moundFramingY = -0.4 * projectsFraming;
        } else if (idx === 4) {
          // Right high mound
          moundFramingX = 0.65 * projectsFraming;
          moundFramingY = -0.4 * projectsFraming;
        } else {
          // Center crest & intermediate dips
          moundFramingY = -1.15 * projectsFraming;
        }

        const finalY =
          w.basePos.y + waveSway + swell - Math.min(1.0, scroll) * 0.95 + moundFramingY - my * 0.06;
        const finalX = w.basePos.x + waveBreathe + mx * 0.1 + moundFramingX;

        w.mesh.position.y = finalY;
        w.mesh.position.x = finalX;

        // Slight scale swelling during transition & framing in Projects
        const scaleBoost = 1 + swell * 0.12 + projectsFraming * 0.14;
        w.mesh.scale.set(
          w.baseScale.x * scaleBoost,
          w.baseScale.y * scaleBoost,
          w.baseScale.z * scaleBoost
        );
      });

      baseBackdrop.position.y = -7.5 + swell * 0.5 - Math.min(1.0, scroll) * 0.95 + framingAdjustmentY;

      // Update 3D Hero Portrait Character
      heroPortrait.update(scroll, elapsedTime, mx, my, container.clientWidth);

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animId);
      heroPortrait.dispose();
      renderer.dispose();
      scene.clear();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={containerRef} className="hero-canvas-fg" aria-hidden="true" />;
};
