import * as THREE from 'three';
import type { SkillItem } from '../data/skills';

/**
 * Draws the crisp vector icon for each skill
 */
export function createSkillIconTexture(item: SkillItem): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  const size = 512;
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  ctx.clearRect(0, 0, size, size);

  const cx = size / 2;
  const cy = size * 0.42; // centered slightly above midpoint to allow room for title when centered

  ctx.save();

  switch (item.iconType) {
    case 'web': {
      // Large Minimal Code Brackets </>
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = size * 0.054;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const s = size * 0.22;
      // Left bracket <
      ctx.beginPath();
      ctx.moveTo(cx - s * 0.8, cy - s * 0.65);
      ctx.lineTo(cx - s * 1.55, cy);
      ctx.lineTo(cx - s * 0.8, cy + s * 0.65);
      ctx.stroke();

      // Right bracket >
      ctx.beginPath();
      ctx.moveTo(cx + s * 0.8, cy - s * 0.65);
      ctx.lineTo(cx + s * 1.55, cy);
      ctx.lineTo(cx + s * 0.8, cy + s * 0.65);
      ctx.stroke();

      // Center slash /
      ctx.beginPath();
      ctx.moveTo(cx + s * 0.45, cy - s * 0.85);
      ctx.lineTo(cx - s * 0.45, cy + s * 0.85);
      ctx.stroke();
      break;
    }

    case 'android': {
      // Android Bot Head + Antennas + Eyes
      const r = size * 0.18;
      ctx.fillStyle = '#3DDC84';
      ctx.strokeStyle = '#3DDC84';
      ctx.lineWidth = size * 0.024;
      ctx.lineCap = 'round';

      // Antennas
      const antLen = r * 0.6;
      ctx.beginPath();
      ctx.moveTo(cx - r * 0.55, cy - r * 0.75);
      ctx.lineTo(cx - r * 0.55 - antLen * 0.6, cy - r * 0.75 - antLen);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(cx + r * 0.55, cy - r * 0.75);
      ctx.lineTo(cx + r * 0.55 + antLen * 0.6, cy - r * 0.75 - antLen);
      ctx.stroke();

      // Dome
      ctx.beginPath();
      ctx.arc(cx, cy + r * 0.15, r, Math.PI, 0, false);
      ctx.closePath();
      ctx.fill();

      // Eyes (cutouts)
      ctx.fillStyle = '#1c1f24';
      ctx.beginPath();
      ctx.arc(cx - r * 0.42, cy - r * 0.35, r * 0.14, 0, Math.PI * 2);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(cx + r * 0.42, cy - r * 0.35, r * 0.14, 0, Math.PI * 2);
      ctx.fill();
      break;
    }

    case 'java': {
      // Java Cup & Steam
      const s = size * 0.16;

      // Steam lines
      ctx.strokeStyle = '#EA2D2E';
      ctx.lineWidth = size * 0.024;
      ctx.lineCap = 'round';

      // Steam 1
      ctx.beginPath();
      ctx.moveTo(cx - s * 0.4, cy - s * 0.35);
      ctx.bezierCurveTo(cx - s * 0.1, cy - s * 0.65, cx - s * 0.6, cy - s * 0.95, cx - s * 0.2, cy - s * 1.3);
      ctx.stroke();

      // Steam 2
      ctx.beginPath();
      ctx.moveTo(cx + s * 0.1, cy - s * 0.3);
      ctx.bezierCurveTo(cx + s * 0.4, cy - s * 0.6, cx - s * 0.1, cy - s * 0.9, cx + s * 0.2, cy - s * 1.2);
      ctx.stroke();

      // Cup body
      ctx.fillStyle = '#007396';
      ctx.beginPath();
      ctx.moveTo(cx - s * 0.85, cy);
      ctx.lineTo(cx - s * 0.65, cy + s * 1.1);
      ctx.quadraticCurveTo(cx, cy + s * 1.35, cx + s * 0.65, cy + s * 1.1);
      ctx.lineTo(cx + s * 0.85, cy);
      ctx.closePath();
      ctx.fill();

      // Cup handle
      ctx.strokeStyle = '#007396';
      ctx.lineWidth = size * 0.026;
      ctx.beginPath();
      ctx.arc(cx + s * 0.82, cy + s * 0.5, s * 0.38, -Math.PI * 0.45, Math.PI * 0.45);
      ctx.stroke();
      break;
    }

    case 'dsa': {
      // Binary Tree & Algorithm Graph Nodes
      const s = size * 0.2;
      ctx.strokeStyle = '#8B5CF6';
      ctx.fillStyle = '#8B5CF6';
      ctx.lineWidth = size * 0.022;
      ctx.lineCap = 'round';

      const root = { x: cx, y: cy - s * 0.8 };
      const left = { x: cx - s * 0.9, y: cy + s * 0.2 };
      const right = { x: cx + s * 0.9, y: cy + s * 0.2 };
      const leftChild = { x: cx - s * 1.2, y: cy + s * 1.1 };
      const leftRightChild = { x: cx - s * 0.4, y: cy + s * 1.1 };
      const rightRightChild = { x: cx + s * 1.1, y: cy + s * 1.1 };

      // Edges
      ctx.beginPath();
      ctx.moveTo(root.x, root.y);
      ctx.lineTo(left.x, left.y);
      ctx.moveTo(root.x, root.y);
      ctx.lineTo(right.x, right.y);
      ctx.moveTo(left.x, left.y);
      ctx.lineTo(leftChild.x, leftChild.y);
      ctx.moveTo(left.x, left.y);
      ctx.lineTo(leftRightChild.x, leftRightChild.y);
      ctx.moveTo(right.x, right.y);
      ctx.lineTo(rightRightChild.x, rightRightChild.y);
      ctx.stroke();

      // Nodes
      const nodeR = size * 0.042;
      [root, left, right, leftChild, leftRightChild, rightRightChild].forEach((pt) => {
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, nodeR, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = '#8B5CF6';
        ctx.stroke();
      });
      break;
    }

    case 'graphic': {
      // Vector Pen Tool & Bezier Curve
      const s = size * 0.2;
      ctx.strokeStyle = '#FF6B6B';
      ctx.fillStyle = '#FF6B6B';
      ctx.lineWidth = size * 0.024;
      ctx.lineCap = 'round';

      // Curved stroke
      ctx.beginPath();
      ctx.moveTo(cx - s * 1.1, cy + s * 0.9);
      ctx.bezierCurveTo(cx - s * 0.8, cy - s * 0.8, cx + s * 0.8, cy - s * 0.8, cx + s * 1.1, cy + s * 0.9);
      ctx.stroke();

      // Pen Nib
      ctx.save();
      ctx.translate(cx, cy - s * 0.2);
      ctx.rotate(-Math.PI * 0.25);
      ctx.fillStyle = '#ffffff';
      ctx.strokeStyle = '#FF6B6B';
      ctx.beginPath();
      ctx.moveTo(0, -s * 0.85);
      ctx.lineTo(s * 0.35, -s * 0.3);
      ctx.lineTo(s * 0.35, s * 0.5);
      ctx.lineTo(-s * 0.35, s * 0.5);
      ctx.lineTo(-s * 0.35, -s * 0.3);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(0, -s * 0.85);
      ctx.lineTo(0, 0);
      ctx.arc(0, s * 0.12, s * 0.08, 0, Math.PI * 2);
      ctx.fillStyle = '#FF6B6B';
      ctx.fill();
      ctx.restore();
      break;
    }

    case 'video': {
      // Film Reel Frame with Play Arrow
      const w = size * 0.38;
      const h = size * 0.28;
      ctx.fillStyle = '#1c1f24';
      ctx.strokeStyle = '#F59E0B';
      ctx.lineWidth = size * 0.024;

      ctx.beginPath();
      ctx.roundRect(cx - w / 2, cy - h / 2, w, h, size * 0.035);
      ctx.fill();
      ctx.stroke();

      ctx.fillStyle = '#F59E0B';
      const numHoles = 4;
      const holeW = w * 0.1;
      const holeH = h * 0.16;
      for (let i = 0; i < numHoles; i++) {
        const hx = cx - w / 2 + (i + 0.5) * (w / numHoles) - holeW / 2;
        ctx.fillRect(hx, cy - h / 2 + holeH * 0.35, holeW, holeH);
        ctx.fillRect(hx, cy + h / 2 - holeH * 1.35, holeW, holeH);
      }

      ctx.fillStyle = '#ffffff';
      const pw = size * 0.09;
      ctx.beginPath();
      ctx.moveTo(cx - pw * 0.5, cy - pw * 0.65);
      ctx.lineTo(cx + pw * 0.75, cy);
      ctx.lineTo(cx - pw * 0.5, cy + pw * 0.65);
      ctx.closePath();
      ctx.fill();
      break;
    }

    case 'social': {
      // Social Network Share Nodes
      const s = size * 0.18;
      ctx.strokeStyle = '#EC4899';
      ctx.fillStyle = '#EC4899';
      ctx.lineWidth = size * 0.026;
      ctx.lineCap = 'round';

      const n1 = { x: cx - s * 0.8, y: cy };
      const n2 = { x: cx + s * 0.8, y: cy - s * 0.7 };
      const n3 = { x: cx + s * 0.8, y: cy + s * 0.7 };

      ctx.beginPath();
      ctx.moveTo(n1.x, n1.y);
      ctx.lineTo(n2.x, n2.y);
      ctx.moveTo(n1.x, n1.y);
      ctx.lineTo(n3.x, n3.y);
      ctx.stroke();

      [n1, n2, n3].forEach((pt, idx) => {
        const r = idx === 0 ? size * 0.065 : size * 0.052;
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, r, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.fill();
        ctx.strokeStyle = '#EC4899';
        ctx.stroke();
      });
      break;
    }

    case 'automation': {
      // Interlocking Workflow Gears
      const r = size * 0.14;
      ctx.fillStyle = '#10B981';
      ctx.strokeStyle = '#10B981';

      ctx.save();
      ctx.translate(cx - r * 0.5, cy - r * 0.3);
      for (let i = 0; i < 6; i++) {
        ctx.rotate((Math.PI * 2) / 6);
        ctx.fillRect(-r * 0.18, -r * 1.15, r * 0.36, r * 0.4);
      }
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.85, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1c1f24';
      ctx.beginPath();
      ctx.arc(0, 0, r * 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      ctx.save();
      ctx.translate(cx + r * 0.65, cy + r * 0.55);
      ctx.fillStyle = '#ffffff';
      const r2 = r * 0.75;
      for (let i = 0; i < 6; i++) {
        ctx.rotate((Math.PI * 2) / 6);
        ctx.fillRect(-r2 * 0.18, -r2 * 1.15, r2 * 0.36, r2 * 0.4);
      }
      ctx.beginPath();
      ctx.arc(0, 0, r2 * 0.85, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#1c1f24';
      ctx.beginPath();
      ctx.arc(0, 0, r2 * 0.35, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
      break;
    }

    case 'threejs': {
      // 3D Isometric Wireframe Cube
      const s = size * 0.18;
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = size * 0.026;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      const topV = { x: cx, y: cy - s * 1.1 };
      const centerV = { x: cx, y: cy };
      const leftV = { x: cx - s * 0.95, y: cy - s * 0.55 };
      const rightV = { x: cx + s * 0.95, y: cy - s * 0.55 };
      const bLeftV = { x: cx - s * 0.95, y: cy + s * 0.55 };
      const bRightV = { x: cx + s * 0.95, y: cy + s * 0.55 };
      const bBottomV = { x: cx, y: cy + s * 1.1 };

      ctx.beginPath();
      ctx.moveTo(topV.x, topV.y);
      ctx.lineTo(rightV.x, rightV.y);
      ctx.lineTo(bRightV.x, bRightV.y);
      ctx.lineTo(bBottomV.x, bBottomV.y);
      ctx.lineTo(bLeftV.x, bLeftV.y);
      ctx.lineTo(leftV.x, leftV.y);
      ctx.closePath();
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(centerV.x, centerV.y);
      ctx.lineTo(topV.x, topV.y);
      ctx.moveTo(centerV.x, centerV.y);
      ctx.lineTo(bLeftV.x, bLeftV.y);
      ctx.moveTo(centerV.x, centerV.y);
      ctx.lineTo(bRightV.x, bRightV.y);
      ctx.stroke();
      break;
    }
  }

  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Draws the central typography overlay (Category Name + BUILD · SOLVE · CREATE)
 */
export function createSkillCenterTextTexture(item: SkillItem): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  const size = 1024;
  canvas.width = size;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  ctx.clearRect(0, 0, size, 512);

  const cx = size / 2;

  ctx.save();
  // Category Title - auto scale font size for long category names
  ctx.fillStyle = '#ffffff';
  const titleLen = item.category.length;
  let fontSize = 50;
  if (titleLen > 26) {
    fontSize = 32;
  } else if (titleLen > 18) {
    fontSize = 38;
  } else if (titleLen > 12) {
    fontSize = 44;
  }

  ctx.font = `800 ${fontSize}px 'Plus Jakarta Sans', -apple-system, sans-serif`;
  ctx.letterSpacing = titleLen > 20 ? '0.12em' : '0.18em';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(item.category, cx, 180);

  // Tagline (BUILD · SOLVE · CREATE)
  ctx.fillStyle = '#a6acb4';
  ctx.font = "600 26px 'Plus Jakarta Sans', -apple-system, sans-serif";
  ctx.letterSpacing = '0.22em';
  ctx.fillText(item.tagline, cx, 265);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = true;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

/**
 * Draws the concise floating label below orbiting side bubbles
 */
export function createSkillLabelTexture(text: string): THREE.CanvasTexture {
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
  let fontSize = 36;
  if (textLen > 15) {
    fontSize = 26;
  } else if (textLen > 10) {
    fontSize = 30;
  }

  ctx.font = `800 ${fontSize}px 'Plus Jakarta Sans', -apple-system, sans-serif`;
  ctx.letterSpacing = textLen > 12 ? '0.12em' : '0.18em';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(text, 256, 64);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;
  return texture;
}

