import * as THREE from 'three';
import {C, at, ball, box, cone, cyl, group, hash, label, mat, mesh, pivot, textLabel} from './kit';

export const makeReeds = (n: number, spread: number, seed = 0) => {
  const g = new THREE.Group();
  const greens = ['#79967b', '#587863', '#8aa585', '#4f6f5c'];
  for (let i = 0; i < n; i++) {
    const h = 0.7 + hash(i + seed) * 0.9;
    const blade = cone(0.022 + hash(i + seed + 3) * 0.022, h, greens[i % 4], 5);
    at(blade, (hash(i * 3 + seed) - 0.5) * spread, h / 2, (hash(i * 7 + seed) - 0.5) * spread * 0.6, (hash(i + 5) - 0.5) * 0.3, 0, (hash(i + 8) - 0.5) * 0.4);
    g.add(blade);
    if (i % 4 === 0) g.add(at(cyl(0.035, 0.035, 0.2, C.brown, 8), blade.position.x, h * 0.9, blade.position.z));
  }
  return g;
};

export const makeTree = (h: number, color = '#5d7f6b') => group(
  at(cyl(0.09, 0.12, h * 0.4, C.brown, 8), 0, h * 0.2, 0),
  at(cone(h * 0.3, h * 0.55, color, 9), 0, h * 0.55, 0),
  at(cone(h * 0.22, h * 0.45, color, 9), 0, h * 0.82, 0));

export const makeTable = (w = 2.4, d = 1.2, h = 0.95) => group(
  at(box(w, 0.09, d, '#9a7058', 0.03), 0, h, 0),
  ...[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z]) => at(box(0.09, h, 0.09, C.brown, 0.02), x * (w / 2 - 0.12), h / 2, z * (d / 2 - 0.12))));

/** A dining chair facing +z, seat at 0.55. */
export const makeChair = (color = '#8e7060') => group(
  at(box(0.55, 0.07, 0.55, color, 0.02), 0, 0.55, 0),
  at(box(0.55, 0.7, 0.07, color, 0.02), 0, 0.93, -0.25),
  ...[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z]) => at(box(0.06, 0.55, 0.06, C.brown, 0.015), x * 0.23, 0.27, z * 0.23)));

/** Vase of three flowers; its origin is the base so it can tip over. */
export const makeVase = () => {
  const profile = [[0.001, 0], [0.11, 0], [0.15, 0.1], [0.11, 0.25], [0.07, 0.33], [0.09, 0.38]].map(([x, y]) => new THREE.Vector2(x, y));
  const pot = mesh(new THREE.LatheGeometry(profile, 24), mat(C.teal, {rough: 0.5, side: THREE.DoubleSide}));
  const stems = [[-0.1, 0.72, C.coral], [0.03, 0.82, C.ochre], [0.13, 0.68, '#e2a396']].map(([x, h, color], i) => {
    const hh = h as number;
    return group(at(cyl(0.01, 0.01, hh - 0.3, '#657f61', 6), (x as number) / 2, 0.3 + (hh - 0.3) / 2, 0, 0, 0, -(x as number) * 0.7),
      at(ball(0.075, color as string), x as number, hh, (i - 1) * 0.03), at(ball(0.03, C.ochre), x as number, hh, (i - 1) * 0.03 + 0.06));
  });
  return group(pot, ...stems);
};

export const makeKey = () => group(
  at(mesh(new THREE.TorusGeometry(0.055, 0.016, 8, 18), mat('#c9a45a', {rough: 0.35})), 0, 0, 0, Math.PI / 2),
  at(box(0.035, 0.02, 0.17, mat('#c9a45a', {rough: 0.35}), 0.008), 0, 0, 0.13),
  at(box(0.06, 0.02, 0.03, mat('#c9a45a', {rough: 0.35}), 0.006), 0.03, 0, 0.19));

export const makePlate = () => group(at(cyl(0.3, 0.2, 0.04, C.cream), 0, 0.02, 0), at(cyl(0.2, 0.2, 0.012, '#e3d7bd'), 0, 0.042, 0));

/** The letter Lily left. The private text is never drawn: only the look of handwriting. */
export const makeLetter = (w = 0.5, h = 0.66) => label(w, h, (ctx, W, H) => {
  ctx.fillStyle = C.cream;
  ctx.fillRect(0, 0, W, H);
  ctx.strokeStyle = '#8d7d6d';
  ctx.lineCap = 'round';
  ctx.lineWidth = H * 0.012;
  const lines = [0.42, 0.86, 0.9, 0.7, 0.84, 0.5];
  lines.forEach((len, i) => {
    const y = H * (0.16 + i * 0.105);
    ctx.beginPath();
    for (let x = 0; x <= 1; x += 0.02) {
      const px = W * (0.1 + x * len * 0.82), py = y + Math.sin(x * 40 + i * 2.1) * H * 0.008 + Math.sin(x * 13 + i) * H * 0.006;
      if (x === 0) ctx.moveTo(px, py); else ctx.lineTo(px, py);
    }
    ctx.stroke();
  });
  ctx.beginPath();
  for (let x = 0; x <= 1; x += 0.04) ctx.lineTo(W * (0.62 + x * 0.24), H * 0.84 + Math.sin(x * 16) * H * 0.014);
  ctx.stroke();
  // A small heart beside the signature.
  ctx.fillStyle = C.coral;
  ctx.globalAlpha = 0.75;
  const cx = W * 0.5, cy = H * 0.845, r = W * 0.035;
  ctx.beginPath();
  ctx.moveTo(cx, cy + r);
  ctx.bezierCurveTo(cx - r * 2, cy - r * 0.2, cx - r, cy - r * 1.4, cx, cy - r * 0.4);
  ctx.bezierCurveTo(cx + r, cy - r * 1.4, cx + r * 2, cy - r * 0.2, cx, cy + r);
  ctx.fill();
}, 700);

export const makeEnvelope = () => group(
  box(0.5, 0.32, 0.02, C.cream, 0.008),
  at(textLabel(0.46, 0.28, 'Colin', {italic: true, size: 0.5}), 0, 0, 0.012));

export const makeClock = (r = 0.3) => {
  const hour = pivot(0, 0, 0.05, at(box(0.03, r * 0.5, 0.015, C.ink, 0.006), 0, r * 0.25, 0));
  const minute = pivot(0, 0, 0.06, at(box(0.022, r * 0.72, 0.015, C.ink, 0.006), 0, r * 0.36, 0));
  const root = group(at(cyl(r, r, 0.07, C.brown, 32), 0, 0, 0, Math.PI / 2), at(cyl(r * 0.87, r * 0.87, 0.075, C.cream, 32), 0, 0, 0.005, Math.PI / 2), hour, minute, at(ball(0.025, C.ink), 0, 0, 0.06));
  return {root, set(h: number, m: number) { hour.rotation.z = -h; minute.rotation.z = -m; }};
};

export const makeSofa = (color = '#728d84') => group(
  at(box(2.6, 0.45, 1.05, color, 0.12), 0, 0.42, 0),
  at(box(2.6, 0.7, 0.3, color, 0.12), 0, 0.85, -0.42),
  at(box(0.3, 0.55, 1.05, color, 0.12), -1.25, 0.65, 0), at(box(0.3, 0.55, 1.05, color, 0.12), 1.25, 0.65, 0),
  at(box(0.55, 0.42, 0.16, C.coral, 0.07), -0.65, 0.82, -0.2, -0.25, 0, 0.1),
  ...[[-1.1, -0.4], [1.1, -0.4], [-1.1, 0.4], [1.1, 0.4]].map(([x, z]) => at(cyl(0.05, 0.04, 0.2, C.brown, 8), x, 0.1, z)));

/** A kitchen base unit with a worktop; `w` wide, against the back wall. */
export const makeCounter = (w: number, color = '#d9d3be') => {
  const g = group(at(box(w, 0.9, 0.7, color, 0.02), 0, 0.45, 0), at(box(w + 0.06, 0.07, 0.76, '#8e7060', 0.02), 0, 0.93, 0));
  const doors = Math.max(1, Math.round(w / 0.8));
  for (let i = 0; i < doors; i++) {
    const x = (i + 0.5) / doors * w - w / 2;
    g.add(at(box(w / doors - 0.08, 0.7, 0.03, '#cfc8b1', 0.02), x, 0.45, 0.355), at(ball(0.03, C.brown), x + w / doors * 0.3, 0.6, 0.38));
  }
  return g;
};

export const makeOven = () => {
  const door = pivot(0, 0.12, 0.37, at(box(0.82, 0.62, 0.05, '#8c9b94', 0.02), 0, 0.31, 0), at(box(0.6, 0.36, 0.06, '#3d4b48', 0.02), 0, 0.33, 0), at(box(0.62, 0.035, 0.07, C.cream, 0.015), 0, 0.57, 0.03));
  const root = group(
    at(box(0.95, 0.95, 0.72, '#8c9b94', 0.03), 0, 0.475, 0), at(box(0.8, 0.6, 0.6, '#2c3836', 0.01), 0, 0.42, 0.08),
    at(box(0.95, 0.16, 0.06, '#7c8b85', 0.02), 0, 0.86, 0.35),
    ...[0, 1, 2, 3].map((i) => at(cyl(0.04, 0.04, 0.05, C.cream, 12), -0.3 + i * 0.2, 0.86, 0.39, Math.PI / 2)),
    ...[[-0.22, -0.14], [0.22, -0.14], [-0.22, 0.14], [0.22, 0.14]].map(([x, z]) => at(cyl(0.13, 0.13, 0.02, C.ink, 20), x, 0.96, z)),
    door);
  return {root, open(n: number) { door.rotation.x = n * 1.5; }};
};

/** Hospital bed along x with the pillow at -x; the mattress top is at 0.72. */
export const makeBed = (len = 2.7) => group(
  at(box(len, 0.28, 1.25, '#e4e9db', 0.08), 0, 0.58, 0),
  at(box(len + 0.1, 0.08, 1.3, '#9aaca4', 0.02), 0, 0.4, 0),
  at(box(0.08, 1.15, 1.3, '#9aaca4', 0.03), -len / 2 - 0.05, 0.6, 0), at(box(0.08, 0.8, 1.3, '#9aaca4', 0.03), len / 2 + 0.05, 0.42, 0),
  at(box(0.6, 0.16, 0.95, C.white, 0.07), -len / 2 + 0.42, 0.78, 0),
  ...[[-1, -1], [1, -1], [-1, 1], [1, 1]].map(([x, z]) => at(cyl(0.035, 0.035, 0.4, C.ink, 8), x * (len / 2 - 0.1), 0.2, z * 0.55)));

export const makeCabinet = () => group(
  at(box(0.75, 0.85, 0.6, '#a98268', 0.03), 0, 0.425, 0),
  at(box(0.62, 0.26, 0.03, '#d1b399', 0.02), 0, 0.62, 0.305), at(ball(0.03, C.ink), 0, 0.62, 0.33),
  at(box(0.62, 0.32, 0.03, '#d1b399', 0.02), 0, 0.27, 0.305), at(ball(0.03, C.ink), 0, 0.27, 0.33));

/** A paper cup with a bendy straw; `drink` lowers the juice. */
export const makeCup = () => {
  const juice = at(cyl(0.075, 0.062, 0.14, mat(C.ochre, {rough: 0.4})), 0, 0.1, 0);
  const root = group(
    mesh(new THREE.LatheGeometry([[0.001, 0], [0.065, 0], [0.09, 0.24]].map(([x, y]) => new THREE.Vector2(x, y)), 20), mat(C.white, {side: THREE.DoubleSide})),
    juice,
    at(cyl(0.012, 0.012, 0.34, C.coral, 8), 0.02, 0.2, 0, 0, 0, -0.12), at(cyl(0.012, 0.012, 0.12, C.coral, 8), -0.03, 0.385, 0, 0, 0, 1.1));
  return {root, drink(n: number) { juice.scale.y = 1 - n * 0.8; juice.position.y = 0.1 - n * 0.055; }};
};

export const makeWetSign = () => {
  const side = (s: number) => at(group(box(0.5, 0.8, 0.03, C.ochre, 0.02), at(textLabel(0.36, 0.3, '!', {bg: C.ochre, size: 0.9, bold: true}), 0, 0.02, s * 0.017, 0, s < 0 ? Math.PI : 0)), 0, 0.39, s * 0.14, -s * 0.36);
  return group(side(1), side(-1));
};

export const makeDoor = (color = '#a98268') => group(
  box(0.07, 2.3, 1.1, color, 0.02), at(box(0.09, 0.9, 0.8, '#b8947a', 0.02), 0, 0.5, 0), at(box(0.09, 0.9, 0.8, '#b8947a', 0.02), 0, -0.55, 0),
  at(ball(0.05, C.ochre), 0.06, -0.05, 0.42));

export const makeFrame = (w: number, h: number, inner: string) => group(box(w, h, 0.05, C.brown, 0.015), at(box(w - 0.12, h - 0.12, 0.06, inner, 0.01), 0, 0, 0.005));

export const makeShelves = (w: number, h: number, levels: number) => {
  const g = group(at(box(0.07, h, 0.5, C.ink, 0.015), -w / 2, h / 2, 0), at(box(0.07, h, 0.5, C.ink, 0.015), w / 2, h / 2, 0));
  for (let i = 1; i <= levels; i++) g.add(at(box(w, 0.06, 0.52, '#8e7060', 0.015), 0, h * i / levels - 0.03, 0));
  return g;
};

export const makeCloud = (seed: number) => {
  const g = new THREE.Group();
  for (let i = 0; i < 5; i++) g.add(at(ball(0.45 + hash(seed + i) * 0.35, mat('#fbf1dc', {rough: 1}), 1, 0.7, 0.8), (i - 2) * 0.55, hash(seed + i * 2) * 0.2, hash(seed + i * 5) * 0.3));
  g.traverse((o) => { o.castShadow = false; o.receiveShadow = false; });
  return g;
};

export const makeNewspapers = () => group(...[0, 1, 2, 3, 4].map((i) => at(box(0.62, 0.05, 0.44, i % 2 ? C.cream : '#efe4cc', 0.012), hash(i) * 0.04, 0.03 + i * 0.052, hash(i + 4) * 0.04, 0, (hash(i + 2) - 0.5) * 0.2)),
  at(textLabel(0.56, 0.14, 'THE DAILY PAPER', {size: 0.55}), 0, 0.268, 0.1, -Math.PI / 2));

export const makeLamp = () => group(at(cyl(0.16, 0.2, 0.04, C.brown), 0, 0.02, 0), at(cyl(0.02, 0.02, 1.5, C.brown, 8), 0, 0.75, 0),
  at(mesh(new THREE.CylinderGeometry(0.16, 0.3, 0.36, 24, 1, true), mat(C.pale, {emissive: '#e9c98c', emissiveIntensity: 0.55, side: THREE.DoubleSide})), 0, 1.58, 0));
