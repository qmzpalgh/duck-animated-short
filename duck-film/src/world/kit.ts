import * as THREE from 'three';
import {RoundedBoxGeometry} from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';

// The palette is the 2D film's cut-paper palette, so both versions read as one production.
export const C = {
  ink: '#283539', cream: '#f8efda', paper: '#eadbc0', pale: '#e8d3b4',
  teal: '#527d79', darkTeal: '#365b5b', coral: '#cb806a', ochre: '#d4a85c',
  blue: '#94afad', brown: '#725849', plum: '#69575e', white: '#fff8e8',
  green: '#9baa85', floor: '#b89579', orange: '#db9855', skin: '#e8b99a',
  hair: '#514b45', slate: '#3b4e52', shirt: '#dedac9',
};

export const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
export const between = (t: number, a: number, b: number) => clamp((t - a) / (b - a));
export const ease = (t: number, a: number, b: number) => {
  const n = between(t, a, b);
  return n * n * (3 - 2 * n);
};
export const mix = (a: number, b: number, n: number) => a + (b - a) * n;
/** 0 → 1 → 0 across [a, b]. */
export const bump = (t: number, a: number, b: number) => Math.sin(between(t, a, b) * Math.PI);
/** Deterministic pseudo-random number in [0, 1). */
export const hash = (i: number) => {
  const x = Math.sin(i * 127.1 + 311.7) * 43758.5453;
  return x - Math.floor(x);
};

type MatOptions = {rough?: number; opacity?: number; emissive?: string; emissiveIntensity?: number; side?: THREE.Side; flat?: boolean};
const cache = new Map<string, THREE.MeshStandardMaterial>();
export const mat = (color: string, o: MatOptions = {}) => {
  const key = color + JSON.stringify(o);
  let m = cache.get(key);
  if (!m) {
    m = new THREE.MeshStandardMaterial({
      color, roughness: o.rough === undefined ? 0.92 : o.rough, metalness: 0,
      transparent: o.opacity !== undefined, opacity: o.opacity === undefined ? 1 : o.opacity,
      emissive: o.emissive || '#000000', emissiveIntensity: o.emissiveIntensity === undefined ? 1 : o.emissiveIntensity,
      side: o.side === undefined ? THREE.FrontSide : o.side, flatShading: !!o.flat,
    });
    if (o.opacity !== undefined) m.depthWrite = false;
    cache.set(key, m);
  }
  return m;
};

type Paint = string | THREE.Material;
const paint = (p: Paint) => typeof p === 'string' ? mat(p) : p;
export const mesh = (geo: THREE.BufferGeometry, p: Paint) => {
  const m = new THREE.Mesh(geo, paint(p));
  const see = (m.material as THREE.Material).transparent;
  m.castShadow = !see;
  m.receiveShadow = !see;
  return m;
};

export const box = (w: number, h: number, d: number, p: Paint, r = 0.03) =>
  mesh(new RoundedBoxGeometry(w, h, d, 3, Math.min(r, w / 2.01, h / 2.01, d / 2.01)), p);
export const cyl = (rTop: number, rBottom: number, h: number, p: Paint, seg = 28) =>
  mesh(new THREE.CylinderGeometry(rTop, rBottom, h, seg), p);
export const ball = (r: number, p: Paint, sx = 1, sy = 1, sz = 1) => {
  const m = mesh(new THREE.SphereGeometry(r, 28, 20), p);
  m.scale.set(sx, sy, sz);
  return m;
};
export const cap = (r: number, len: number, p: Paint) => mesh(new THREE.CapsuleGeometry(r, len, 6, 20), p);
export const cone = (r: number, h: number, p: Paint, seg = 20) => mesh(new THREE.ConeGeometry(r, h, seg), p);

export const at = <T extends THREE.Object3D>(o: T, x: number, y: number, z: number, rx = 0, ry = 0, rz = 0) => {
  o.position.set(x, y, z);
  o.rotation.set(rx, ry, rz);
  return o;
};
export const group = (...children: THREE.Object3D[]) => {
  const g = new THREE.Group();
  children.forEach((c) => g.add(c));
  return g;
};
/** A pivot group holding `child`, so the child can swing around a joint. */
export const pivot = (x: number, y: number, z: number, ...children: THREE.Object3D[]) => at(group(...children), x, y, z);

/** A flat panel with text or drawing on it, painted on a canvas. */
export const label = (w: number, h: number, draw: (ctx: CanvasRenderingContext2D, W: number, H: number) => void, res = 256) => {
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(w * res);
  canvas.height = Math.round(h * res);
  const ctx = canvas.getContext('2d')!;
  draw(ctx, canvas.width, canvas.height);
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.anisotropy = 8;
  const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), new THREE.MeshStandardMaterial({map: texture, roughness: 0.95, side: THREE.DoubleSide}));
  m.castShadow = true;
  m.receiveShadow = true;
  return m;
};
export const textLabel = (w: number, h: number, text: string, o: {bg?: string; fg?: string; size?: number; italic?: boolean; bold?: boolean} = {}) =>
  label(w, h, (ctx, W, H) => {
    ctx.fillStyle = o.bg || C.cream;
    ctx.fillRect(0, 0, W, H);
    ctx.fillStyle = o.fg || C.ink;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    const lines = text.split('\n');
    const size = (o.size || 0.5) * H / lines.length;
    ctx.font = `${o.italic ? 'italic ' : ''}${o.bold ? 'bold ' : ''}${size}px Georgia, serif`;
    lines.forEach((line, i) => ctx.fillText(line, W / 2, H * (i + 0.5) / lines.length + size * 0.05));
  });

const extrude = (shape: THREE.Shape, depth: number, p: Paint) => {
  const geo = new THREE.ExtrudeGeometry(shape, {depth, bevelEnabled: true, bevelSize: depth * 0.4, bevelThickness: depth * 0.4, bevelSegments: 2});
  geo.center();
  return mesh(geo, p);
};
export const star = (r: number, p: Paint = C.ochre) => {
  const s = new THREE.Shape();
  for (let i = 0; i < 10; i++) {
    const a = i / 10 * Math.PI * 2 + Math.PI / 2;
    const rr = i % 2 ? r * 0.45 : r;
    if (i === 0) s.moveTo(Math.cos(a) * rr, Math.sin(a) * rr); else s.lineTo(Math.cos(a) * rr, Math.sin(a) * rr);
  }
  s.closePath();
  return extrude(s, r * 0.22, p);
};
export const heart = (r: number, p: Paint = C.coral) => {
  const s = new THREE.Shape();
  s.moveTo(0, -r);
  s.bezierCurveTo(-r * 1.6, -r * 0.1, -r * 1.1, r * 1.1, 0, r * 0.45);
  s.bezierCurveTo(r * 1.1, r * 1.1, r * 1.6, -r * 0.1, 0, -r);
  return extrude(s, r * 0.3, p);
};

/** Dizzy stars that circle a point after each of Colin's accidents. */
export const makeStars = () => {
  const g = new THREE.Group();
  const stars = [0, 1, 2, 3, 4].map((i) => {
    const s = star(0.13, i % 2 ? C.cream : C.ochre);
    g.add(s);
    return s;
  });
  return {
    root: g,
    /** `amount` 0..1 pops the stars in; `clock` keeps them turning. */
    set(amount: number, clock: number) {
      g.visible = amount > 0.01;
      stars.forEach((s, i) => {
        const a = clock * 2.6 + i / 5 * Math.PI * 2;
        s.position.set(Math.cos(a) * 0.48, Math.sin(a * 2) * 0.06, Math.sin(a) * 0.48);
        s.rotation.set(0, -a, clock * 2 + i);
        s.scale.setScalar(amount);
      });
    },
  };
};

/** A pool of soft spheres that drift along a path: exhaust, soap bubbles, dust. */
export const makePuffs = (n: number, color: string, size: number) => {
  const g = new THREE.Group();
  const puffs = Array.from({length: n}, () => {
    const b = ball(size, mat(color, {rough: 1}));
    b.castShadow = false;
    g.add(b);
    return b;
  });
  return {
    root: g,
    set(strength: number, clock: number, rise = 1.4, spread = 0.5, rate = 0.45) {
      g.visible = strength > 0.01;
      puffs.forEach((p, i) => {
        const life = (clock * rate + i / n) % 1;
        const a = hash(i) * Math.PI * 2;
        p.position.set(Math.cos(a) * spread * life, life * rise, Math.sin(a) * spread * life * 0.7);
        p.scale.setScalar(strength * Math.sin(life * Math.PI) * (0.6 + hash(i + 9) * 0.8));
      });
    },
  };
};

/** Two walls and a floor on a plinth: the cut-away corner every interior is staged in. */
export const makeRoom = (o: {w?: number; d?: number; h?: number; wall: string; floor: string; trim?: string; windows?: {x: number; w?: number; h?: number; y?: number; sky?: string; open?: boolean}[]}) => {
  const w = o.w || 9, d = o.d || 6, h = o.h || 3.6, t = 0.18;
  const g = new THREE.Group();
  g.add(at(box(w + 0.5, 0.5, d + 0.5, '#33494a', 0.12), 0, -0.36, 0));
  g.add(at(box(w, 0.12, d, o.floor, 0.02), 0, -0.06, 0));
  const left = at(box(t, h, d, o.wall, 0.02), -w / 2 - t / 2, h / 2, 0);
  g.add(left);
  const backZ = -d / 2 - t / 2;
  const skies: THREE.Mesh[] = [];
  const wins = (o.windows || []).slice().sort((a, b) => a.x - b.x);
  // The back wall is assembled from panels so real openings can be left for windows.
  let cursor = -w / 2 - t;
  wins.forEach((win) => {
    const ww = win.w || 1.7, wh = win.h || 1.7, wy = win.y || 1.25;
    const x0 = win.x - ww / 2, x1 = win.x + ww / 2;
    g.add(at(box(x0 - cursor, h, t, o.wall, 0.02), (x0 + cursor) / 2, h / 2, backZ));
    g.add(at(box(ww, wy, t, o.wall, 0.02), win.x, wy / 2, backZ));
    g.add(at(box(ww, h - wy - wh, t, o.wall, 0.02), win.x, (h + wy + wh) / 2, backZ));
    const frame = o.trim || C.cream;
    g.add(at(box(ww + 0.16, 0.09, t + 0.1, frame), win.x, wy, backZ));
    g.add(at(box(ww + 0.16, 0.09, t + 0.1, frame), win.x, wy + wh, backZ));
    g.add(at(box(0.09, wh, t + 0.1, frame), x0, wy + wh / 2, backZ));
    g.add(at(box(0.09, wh, t + 0.1, frame), x1, wy + wh / 2, backZ));
    g.add(at(box(ww + 0.36, 0.07, 0.42, frame), win.x, wy - 0.02, backZ + 0.08));
    if (!win.open) {
      g.add(at(box(0.05, wh, 0.05, frame), win.x, wy + wh / 2, backZ));
      g.add(at(box(ww, 0.05, 0.05, frame), win.x, wy + wh / 2, backZ));
    } else {
      g.add(at(box(ww, 0.07, 0.07, frame), win.x, wy + wh * 0.82, backZ + 0.04));
    }
    // A glowing card behind the opening stands in for the sky.
    const sky = new THREE.Mesh(new THREE.PlaneGeometry(ww + 1.4, wh + 1), new THREE.MeshBasicMaterial({color: win.sky || '#a9c2bd'}));
    sky.position.set(win.x, wy + wh / 2 - 0.35, backZ - 1.1);
    g.add(sky);
    skies.push(sky);
    cursor = x1;
  });
  g.add(at(box(w / 2 - cursor, h, t, o.wall, 0.02), (w / 2 + cursor) / 2, h / 2, backZ));
  g.add(at(box(w, 0.16, 0.05, o.trim || C.cream), 0, 0.08, -d / 2 + 0.03));
  g.add(at(box(0.05, 0.16, d, o.trim || C.cream), -w / 2 + 0.03, 0.08, 0));
  return {root: g, w, d, h, skies};
};
