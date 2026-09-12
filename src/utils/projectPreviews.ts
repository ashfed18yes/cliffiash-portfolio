import * as THREE from 'three';
import type { ProjectItem } from '../data/projects';

// High-fidelity offscreen canvas texture generator for website preview cards inside 3D bubbles
export function createProjectPreviewTexture(project: ProjectItem): THREE.CanvasTexture {
  const canvas = document.createElement('canvas');
  const width = 512;
  const height = 384;
  canvas.width = width;
  canvas.height = height;

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    return new THREE.CanvasTexture(canvas);
  }

  // Draw smooth card background scaled from virtual 1200x900 coordinate space
  ctx.save();
  ctx.scale(512 / 1200, 384 / 900);
  drawPreviewCard(ctx, project, 1200, 900);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.generateMipmaps = false;
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.needsUpdate = true;

  return texture;
}

function drawPreviewCard(
  ctx: CanvasRenderingContext2D,
  project: ProjectItem,
  w: number,
  h: number
) {
  const pad = 30;
  const cardW = w - pad * 2;
  const cardH = h - pad * 2;
  const radius = 32;

  // Outer ambient shadow
  ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
  ctx.shadowBlur = 36;
  ctx.shadowOffsetX = 0;
  ctx.shadowOffsetY = 18;

  // Base card shape
  ctx.beginPath();
  roundRect(ctx, pad, pad, cardW, cardH, radius);

  // Background gradient based on project theme
  switch (project.previewType) {
    case 'balaji':
      drawBalajiTilesCard(ctx, project, pad, pad, cardW, cardH);
      break;
    case 'pooja':
      drawPoojaClinicCard(ctx, project, pad, pad, cardW, cardH);
      break;
    case 'truetalk':
      drawTruetalkCard(ctx, project, pad, pad, cardW, cardH);
      break;
    case 'jic':
      drawJicCard(ctx, project, pad, pad, cardW, cardH);
      break;
    case 'rkk':
      drawRkkCard(ctx, project, pad, pad, cardW, cardH);
      break;
    case 'jecrc':
      drawJecrcCard(ctx, project, pad, pad, cardW, cardH);
      break;
    case 'prozify':
      drawProzifyCard(ctx, project, pad, pad, cardW, cardH);
      break;
    case 'aryan':
    default:
      drawAryanCard(ctx, project, pad, pad, cardW, cardH);
      break;
  }
}

function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
) {
  ctx.moveTo(x + r, y);
  ctx.arcTo(x + w, y, x + w, y + h, r);
  ctx.arcTo(x + w, y + h, x, y + h, r);
  ctx.arcTo(x, y + h, x, y, r);
  ctx.arcTo(x, y, x + w, y, r);
  ctx.closePath();
}

// 1. BALAJI TILES (Approved Reference Centerpiece)
function drawBalajiTilesCard(
  ctx: CanvasRenderingContext2D,
  _project: ProjectItem,
  x: number,
  y: number,
  w: number,
  h: number
) {
  // Clean architectural off-white / light greige surface
  const grad = ctx.createLinearGradient(x, y, x + w, y + h);
  grad.addColorStop(0, '#f9f9f9');
  grad.addColorStop(1, '#ebe8e3');
  ctx.fillStyle = grad;
  ctx.fill();

  // Subtle border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Reset shadow for inner contents
  ctx.shadowColor = 'transparent';

  // --- Website Navbar ---
  const navY = y + 54;
  // Brand logo mark
  ctx.fillStyle = '#1c1b19';
  ctx.font = '700 24px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
  ctx.fillText('BALAJI TILES', x + 50, navY);

  // Logo geometric icon next to brand
  ctx.strokeStyle = '#1c1b19';
  ctx.lineWidth = 2.5;
  ctx.strokeRect(x + 220, navY - 18, 16, 16);
  ctx.strokeRect(x + 226, navY - 12, 16, 16);

  // Nav menu links
  ctx.font = '500 17px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = '#555451';
  ctx.fillText('Home', x + 380, navY);
  ctx.fillText('Products', x + 460, navY);
  ctx.fillText('About', x + 570, navY);
  ctx.fillText('Contact', x + 655, navY);

  // Hamburger icon on far right
  ctx.strokeStyle = '#1c1b19';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(x + w - 75, navY - 12);
  ctx.lineTo(x + w - 50, navY - 12);
  ctx.moveTo(x + w - 75, navY - 5);
  ctx.lineTo(x + w - 50, navY - 5);
  ctx.moveTo(x + w - 75, navY + 2);
  ctx.lineTo(x + w - 50, navY + 2);
  ctx.stroke();

  // Subtle divider
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.06)';
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(x + 40, y + 80);
  ctx.lineTo(x + w - 40, y + 80);
  ctx.stroke();

  // --- Hero Section Layout ---
  // Left: Typography
  const textX = x + 60;
  const heroY = y + 270;

  ctx.fillStyle = '#181715';
  ctx.font = '700 78px -apple-system, "Times New Roman", Georgia, serif';
  ctx.fillText('Elegance', textX, heroY);
  ctx.fillText('in Every Tile', textX, heroY + 84);

  ctx.font = '400 24px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillStyle = '#6e6b66';
  ctx.fillText('Premium Tiles for Modern Spaces', textX, heroY + 152);

  // CTA Button: "EXPLORE COLLECTION →"
  const btnY = heroY + 215;
  ctx.fillStyle = '#ffffff';
  ctx.beginPath();
  roundRect(ctx, textX, btnY, 260, 60, 30);
  ctx.fill();
  ctx.strokeStyle = 'rgba(0, 0, 0, 0.2)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#1c1b19';
  ctx.font = '700 15px -apple-system, BlinkMacSystemFont, sans-serif';
  ctx.fillText('EXPLORE COLLECTION  →', textX + 32, btnY + 36);

  // Right: Architectural Tiles & Interior Visualization
  const imgX = x + 580;
  const imgY = y + 120;
  const imgW = w - 640;
  const imgH = h - 180;

  // Marble slab wall background
  ctx.save();
  ctx.beginPath();
  roundRect(ctx, imgX, imgY, imgW, imgH, 20);
  ctx.clip();

  // Marble texture simulation with rich contrast
  const marbleGrad = ctx.createLinearGradient(imgX, imgY, imgX + imgW, imgY + imgH);
  marbleGrad.addColorStop(0, '#4a443e');
  marbleGrad.addColorStop(0.35, '#2c2926');
  marbleGrad.addColorStop(0.7, '#181715');
  marbleGrad.addColorStop(1, '#36322e');
  ctx.fillStyle = marbleGrad;
  ctx.fill();

  // Natural marble veining
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.26)';
  ctx.lineWidth = 2.5;
  ctx.beginPath();
  ctx.moveTo(imgX + 80, imgY);
  ctx.bezierCurveTo(imgX + 150, imgY + 200, imgX + 100, imgY + 400, imgX + 220, imgY + imgH);
  ctx.moveTo(imgX + 240, imgY);
  ctx.bezierCurveTo(imgX + 320, imgY + 280, imgX + 280, imgY + 450, imgX + 380, imgY + imgH);
  ctx.stroke();

  // Reflective floor tile plane
  const floorY = imgY + imgH * 0.62;
  const floorGrad = ctx.createLinearGradient(imgX, floorY, imgX, imgY + imgH);
  floorGrad.addColorStop(0, '#686057');
  floorGrad.addColorStop(0.5, '#3e3934');
  floorGrad.addColorStop(1, '#1e1c1a');
  ctx.fillStyle = floorGrad;
  ctx.fillRect(imgX, floorY, imgW, imgH - (floorY - imgY));

  // Tile grout grid lines on floor
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.18)';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const lx = imgX + 60 + i * 90;
    ctx.moveTo(lx, floorY);
    ctx.lineTo(lx - 40, imgY + imgH);
  }
  ctx.stroke();

  // Modern Designer Armchair Silhouette
  const chairX = imgX + imgW * 0.42;
  const chairY = floorY - 55;
  // Chair shadow
  ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
  ctx.beginPath();
  ctx.ellipse(chairX + 50, floorY + 14, 68, 14, 0, 0, Math.PI * 2);
  ctx.fill();

  // Chair body
  ctx.fillStyle = '#141311';
  ctx.beginPath();
  roundRect(ctx, chairX, chairY - 80, 100, 90, 16);
  ctx.fill();
  // Cushion
  ctx.fillStyle = '#262421';
  ctx.beginPath();
  roundRect(ctx, chairX + 8, chairY - 40, 84, 45, 10);
  ctx.fill();
  // Sleek metal legs
  ctx.strokeStyle = '#d5cebe';
  ctx.lineWidth = 3.2;
  ctx.beginPath();
  ctx.moveTo(chairX + 15, chairY + 5);
  ctx.lineTo(chairX + 5, floorY + 14);
  ctx.moveTo(chairX + 85, chairY + 5);
  ctx.lineTo(chairX + 95, floorY + 14);
  ctx.stroke();

  // Ambient lighting glow from top right
  const glow = ctx.createRadialGradient(imgX + imgW * 0.8, imgY + 40, 10, imgX + imgW * 0.8, imgY + 40, 240);
  glow.addColorStop(0, 'rgba(255, 242, 220, 0.5)');
  glow.addColorStop(1, 'rgba(255, 242, 220, 0)');
  ctx.fillStyle = glow;
  ctx.fillRect(imgX, imgY, imgW, imgH);

  ctx.restore();
}

// 2. POOJA SPEECH & HEARING CLINIC
function drawPoojaClinicCard(
  ctx: CanvasRenderingContext2D,
  _p: ProjectItem,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const grad = ctx.createLinearGradient(x, y, x + w, y + h);
  grad.addColorStop(0, '#f2f8f9');
  grad.addColorStop(1, '#deeaec');
  ctx.fillStyle = grad;
  ctx.fill();

  // Header
  ctx.fillStyle = '#1b3b44';
  ctx.font = '700 24px -apple-system, sans-serif';
  ctx.fillText('Pooja Speech &', x + 50, y + 60);
  ctx.fillText('Hearing Clinic', x + 50, y + 88);

  // Main copy
  ctx.fillStyle = '#0f5257';
  ctx.font = '700 58px -apple-system, sans-serif';
  ctx.fillText('Better Hearing', x + 50, y + 230);
  ctx.fillStyle = '#2b7a78';
  ctx.fillText('Brighter Futures', x + 50, y + 295);

  ctx.fillStyle = '#506e75';
  ctx.font = '400 22px -apple-system, sans-serif';
  ctx.fillText('Diagnostic audiology and speech therapy', x + 50, y + 360);
  ctx.fillText('crafted with patient-centered care.', x + 50, y + 395);

  // Button
  const btnY = y + 440;
  ctx.fillStyle = '#0b6e76';
  ctx.beginPath();
  roundRect(ctx, x + 50, btnY, 230, 54, 27);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 16px -apple-system, sans-serif';
  ctx.fillText('Book Appointment →', x + 76, btnY + 34);

  // Right illustration / medical visual
  const imgX = x + 540;
  const imgY = y + 100;
  const imgW = w - 580;
  const imgH = h - 160;

  ctx.save();
  ctx.beginPath();
  roundRect(ctx, imgX, imgY, imgW, imgH, 24);
  ctx.clip();

  const bgGrad = ctx.createLinearGradient(imgX, imgY, imgX + imgW, imgY + imgH);
  bgGrad.addColorStop(0, '#c7e3e7');
  bgGrad.addColorStop(1, '#98c8cf');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(imgX, imgY, imgW, imgH);

  // Soundwave and hearing motif
  ctx.strokeStyle = 'rgba(11, 110, 118, 0.4)';
  ctx.lineWidth = 4;
  for (let i = 0; i < 4; i++) {
    ctx.beginPath();
    ctx.arc(imgX + imgW * 0.45, imgY + imgH * 0.5, 45 + i * 32, -Math.PI * 0.4, Math.PI * 0.4);
    ctx.stroke();
  }

  // Doctor silhouette
  ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
  ctx.beginPath();
  ctx.arc(imgX + imgW * 0.72, imgY + imgH * 0.4, 48, 0, Math.PI * 2);
  ctx.fill();
  ctx.beginPath();
  roundRect(ctx, imgX + imgW * 0.58, imgY + imgH * 0.52, 140, 160, 24);
  ctx.fill();

  ctx.restore();
}

// 3. TRUETALK
function drawTruetalkCard(
  ctx: CanvasRenderingContext2D,
  _p: ProjectItem,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const grad = ctx.createLinearGradient(x, y, x + w, y + h);
  grad.addColorStop(0, '#10111a');
  grad.addColorStop(1, '#07080e');
  ctx.fillStyle = grad;
  ctx.fill();

  // Header
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 26px -apple-system, sans-serif';
  ctx.fillText('Truetalk', x + 50, y + 65);

  // Live indicator
  ctx.fillStyle = '#8a5cf6';
  ctx.beginPath();
  ctx.arc(x + 175, y + 57, 6, 0, Math.PI * 2);
  ctx.fill();

  // Headlines
  ctx.fillStyle = '#ffffff';
  ctx.font = '700 58px -apple-system, sans-serif';
  ctx.fillText('Speak Freely', x + 50, y + 230);
  const textGrad = ctx.createLinearGradient(x + 50, y, x + 400, y);
  textGrad.addColorStop(0, '#a78bfa');
  textGrad.addColorStop(1, '#60a5fa');
  ctx.fillStyle = textGrad;
  ctx.fillText('Connect Deeply', x + 50, y + 295);

  ctx.fillStyle = '#8b8d9e';
  ctx.font = '400 22px -apple-system, sans-serif';
  ctx.fillText('Real-time audio rooms for authentic', x + 50, y + 360);
  ctx.fillText('conversations and shared experiences.', x + 50, y + 395);

  // Button
  const btnY = y + 440;
  ctx.fillStyle = '#6366f1';
  ctx.beginPath();
  roundRect(ctx, x + 50, btnY, 210, 52, 26);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 16px -apple-system, sans-serif';
  ctx.fillText('Explore Features →', x + 72, btnY + 33);

  // Right: Mobile app mock preview
  const phoneX = x + 580;
  const phoneY = y + 70;
  const phoneW = 280;
  const phoneH = 500;

  ctx.save();
  ctx.shadowColor = 'rgba(99, 102, 241, 0.25)';
  ctx.shadowBlur = 30;
  ctx.fillStyle = '#181a29';
  ctx.beginPath();
  roundRect(ctx, phoneX, phoneY, phoneW, phoneH, 36);
  ctx.fill();
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
  ctx.lineWidth = 2;
  ctx.stroke();

  // App active speaker cards inside phone
  ctx.shadowColor = 'transparent';
  for (let i = 0; i < 3; i++) {
    const cardTop = phoneY + 50 + i * 110;
    ctx.fillStyle = '#22253b';
    ctx.beginPath();
    roundRect(ctx, phoneX + 20, cardTop, phoneW - 40, 90, 18);
    ctx.fill();

    // Avatar
    ctx.fillStyle = i === 0 ? '#8b5cf6' : '#3b82f6';
    ctx.beginPath();
    ctx.arc(phoneX + 55, cardTop + 45, 22, 0, Math.PI * 2);
    ctx.fill();

    // Speaker waves
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.6)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(phoneX + 55, cardTop + 45, 30, -0.4, 0.4);
    ctx.stroke();
  }
  ctx.restore();
}

// 4. JIC FOUNDATION
function drawJicCard(
  ctx: CanvasRenderingContext2D,
  _p: ProjectItem,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const grad = ctx.createLinearGradient(x, y, x + w, y + h);
  grad.addColorStop(0, '#f8fafc');
  grad.addColorStop(1, '#e2e8f0');
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.font = '700 24px -apple-system, sans-serif';
  ctx.fillText('JIC Foundation', x + 50, y + 65);

  ctx.font = '700 64px -apple-system, sans-serif';
  ctx.fillText('Ideas', x + 50, y + 220);
  ctx.fillText('Create', x + 50, y + 290);
  ctx.fillText('Change', x + 50, y + 360);

  // Button
  const btnY = y + 430;
  ctx.fillStyle = '#0f172a';
  ctx.beginPath();
  roundRect(ctx, x + 50, btnY, 170, 52, 26);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 16px -apple-system, sans-serif';
  ctx.fillText('Learn More →', x + 72, btnY + 33);

  // Architectural building visual on right
  const imgX = x + 480;
  const imgY = y + 90;
  const imgW = w - 520;
  const imgH = h - 150;

  ctx.save();
  ctx.beginPath();
  roundRect(ctx, imgX, imgY, imgW, imgH, 20);
  ctx.clip();

  const bldgGrad = ctx.createLinearGradient(imgX, imgY, imgX + imgW, imgY + imgH);
  bldgGrad.addColorStop(0, '#64748b');
  bldgGrad.addColorStop(1, '#334155');
  ctx.fillStyle = bldgGrad;
  ctx.fillRect(imgX, imgY, imgW, imgH);

  // Building perspective grid lines
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
  ctx.lineWidth = 1.5;
  for (let row = 0; row < 7; row++) {
    const gy = imgY + 40 + row * 45;
    ctx.beginPath();
    ctx.moveTo(imgX + 40, gy);
    ctx.lineTo(imgX + imgW - 20, gy - 15);
    ctx.stroke();
  }
  for (let col = 0; col < 8; col++) {
    const gx = imgX + 50 + col * 35;
    ctx.beginPath();
    ctx.moveTo(gx, imgY + 30);
    ctx.lineTo(gx - 20, imgY + imgH);
    ctx.stroke();
  }
  ctx.restore();
}

// 5. RKK CONSTRUCTIONS
function drawRkkCard(
  ctx: CanvasRenderingContext2D,
  _p: ProjectItem,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const grad = ctx.createLinearGradient(x, y, x + w, y + h);
  grad.addColorStop(0, '#f5f4f0');
  grad.addColorStop(1, '#dfdcd5');
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.fillStyle = '#292524';
  ctx.font = '700 24px -apple-system, sans-serif';
  ctx.fillText('RKK Constructions', x + 50, y + 65);

  ctx.font = '700 58px -apple-system, sans-serif';
  ctx.fillText('Building', x + 50, y + 230);
  ctx.fillText('Stronger', x + 50, y + 295);
  ctx.fillText('Tomorrows', x + 50, y + 360);

  const btnY = y + 430;
  ctx.fillStyle = '#78350f';
  ctx.beginPath();
  roundRect(ctx, x + 50, btnY, 190, 52, 26);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 16px -apple-system, sans-serif';
  ctx.fillText('View Portfolio →', x + 70, btnY + 33);

  // Modern architecture tower on right
  const imgX = x + 500;
  const imgY = y + 90;
  const imgW = w - 540;
  const imgH = h - 150;

  ctx.save();
  ctx.beginPath();
  roundRect(ctx, imgX, imgY, imgW, imgH, 20);
  ctx.clip();

  const towGrad = ctx.createLinearGradient(imgX, imgY, imgX + imgW, imgY + imgH);
  towGrad.addColorStop(0, '#78716c');
  towGrad.addColorStop(1, '#44403c');
  ctx.fillStyle = towGrad;
  ctx.fillRect(imgX, imgY, imgW, imgH);

  ctx.strokeStyle = 'rgba(255, 237, 213, 0.3)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(imgX + 80, imgY + imgH);
  ctx.lineTo(imgX + 160, imgY + 40);
  ctx.lineTo(imgX + 240, imgY + imgH);
  ctx.stroke();

  ctx.restore();
}

// 6. JECRC ENTREPRENEUR CHALLENGE
function drawJecrcCard(
  ctx: CanvasRenderingContext2D,
  _p: ProjectItem,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const grad = ctx.createLinearGradient(x, y, x + w, y + h);
  grad.addColorStop(0, '#151722');
  grad.addColorStop(1, '#0c0d14');
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 24px -apple-system, sans-serif';
  ctx.fillText('JECRC Entrepreneur Challenge', x + 50, y + 65);

  ctx.font = '700 54px -apple-system, sans-serif';
  ctx.fillText('Ideas Today,', x + 50, y + 240);
  const gold = ctx.createLinearGradient(x + 50, y, x + 350, y);
  gold.addColorStop(0, '#fbbf24');
  gold.addColorStop(1, '#f59e0b');
  ctx.fillStyle = gold;
  ctx.fillText('Impact Tomorrow.', x + 50, y + 305);

  const btnY = y + 430;
  ctx.fillStyle = '#f59e0b';
  ctx.beginPath();
  roundRect(ctx, x + 50, btnY, 170, 52, 26);
  ctx.fill();
  ctx.fillStyle = '#111827';
  ctx.font = '700 16px -apple-system, sans-serif';
  ctx.fillText('Know More →', x + 72, btnY + 33);
}

// 7. PROZIFY
function drawProzifyCard(
  ctx: CanvasRenderingContext2D,
  _p: ProjectItem,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const grad = ctx.createLinearGradient(x, y, x + w, y + h);
  grad.addColorStop(0, '#f1f5f9');
  grad.addColorStop(1, '#e2e8f0');
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.fillStyle = '#0f172a';
  ctx.font = '700 26px -apple-system, sans-serif';
  ctx.fillText('Prozify', x + 50, y + 65);

  ctx.font = '700 58px -apple-system, sans-serif';
  ctx.fillText('Build Your', x + 50, y + 230);
  ctx.fillText('Productivity', x + 50, y + 295);

  const btnY = y + 430;
  ctx.fillStyle = '#2563eb';
  ctx.beginPath();
  roundRect(ctx, x + 50, btnY, 170, 52, 26);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 16px -apple-system, sans-serif';
  ctx.fillText('Learn More →', x + 72, btnY + 33);
}

// 8. ARYAN TECH
function drawAryanCard(
  ctx: CanvasRenderingContext2D,
  _p: ProjectItem,
  x: number,
  y: number,
  w: number,
  h: number
) {
  const grad = ctx.createLinearGradient(x, y, x + w, y + h);
  grad.addColorStop(0, '#0f172a');
  grad.addColorStop(1, '#020617');
  ctx.fillStyle = grad;
  ctx.fill();

  ctx.fillStyle = '#ffffff';
  ctx.font = '700 24px -apple-system, sans-serif';
  ctx.fillText('Aryan Tech', x + 50, y + 65);

  ctx.font = '700 56px -apple-system, sans-serif';
  ctx.fillText('Next-Gen IT &', x + 50, y + 230);
  const cyan = ctx.createLinearGradient(x + 50, y, x + 400, y);
  cyan.addColorStop(0, '#38bdf8');
  cyan.addColorStop(1, '#818cf8');
  ctx.fillStyle = cyan;
  ctx.fillText('Digital Solutions', x + 50, y + 295);

  const btnY = y + 430;
  ctx.fillStyle = '#0284c7';
  ctx.beginPath();
  roundRect(ctx, x + 50, btnY, 170, 52, 26);
  ctx.fill();
  ctx.fillStyle = '#ffffff';
  ctx.font = '600 16px -apple-system, sans-serif';
  ctx.fillText('Get Started →', x + 72, btnY + 33);
}
