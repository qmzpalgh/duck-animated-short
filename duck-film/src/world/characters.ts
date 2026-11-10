import * as THREE from 'three';
import {C, at, ball, box, bump, cap, cone, cyl, ease, group, mat, mesh, mix, pivot, textLabel} from './kit';

export type Mood = 'sad' | 'startled' | 'happy' | 'neutral';
export type Kind = 'colin' | 'cleaner' | 'doctor';

const SKIN = {colin: C.skin, cleaner: '#a86c54', doctor: '#c59a7a'};
const HAIR = {colin: C.hair, cleaner: '#393735', doctor: '#6c5b50'};

/** Toy-like head: a sphere with dot eyes, brows and a mouth that carry all the acting. */
export const makeHead = (kind: Kind) => {
  const root = new THREE.Group();
  const skin = SKIN[kind], hair = HAIR[kind];
  root.add(ball(0.3, skin));
  const hairCap = mesh(new THREE.SphereGeometry(0.315, 28, 16, 0, Math.PI * 2, 0, Math.PI * 0.46), hair);
  root.add(at(hairCap, 0, 0.01, -0.02, -0.28, 0, 0));
  if (kind === 'colin') {
    [[-0.17, 0.26, 0.1], [-0.02, 0.31, 0.12], [0.13, 0.28, 0.09], [0.05, 0.31, -0.06], [-0.12, 0.3, -0.05]].forEach(([x, y, z]) => root.add(at(ball(0.085, hair), x, y, z)));
  } else if (kind === 'cleaner') {
    root.add(at(ball(0.33, hair, 1, 0.95, 0.9), 0, 0.03, -0.07));
    root.add(at(ball(0.13, hair), 0, 0.3, -0.16));
  } else {
    root.add(at(ball(0.31, hair, 1, 0.9, 0.9), 0, 0.06, -0.06));
  }
  root.add(at(ball(0.045, skin), 0, -0.03, 0.3));
  root.add(at(ball(0.06, skin), -0.3, -0.02, 0), at(ball(0.06, skin), 0.3, -0.02, 0));
  const eyes = [-1, 1].map((s) => at(ball(0.036, mat(C.ink, {rough: 0.4})), s * 0.115, 0.04, 0.272));
  const brows = [-1, 1].map((s) => at(box(0.11, 0.024, 0.03, hair, 0.01), s * 0.115, 0.13, 0.275));
  const arc = mesh(new THREE.TorusGeometry(0.07, 0.013, 8, 18, Math.PI), C.ink);
  const flat = box(0.11, 0.022, 0.02, C.ink, 0.01);
  const oh = ball(0.045, C.plum, 1, 1.2, 0.5);
  [arc, flat, oh].forEach((m) => { m.castShadow = false; });
  at(flat, 0, -0.15, 0.262);
  at(oh, 0, -0.16, 0.262);
  root.add(...eyes, ...brows, arc, flat, oh);
  const bandage = group(at(cyl(0.312, 0.312, 0.13, C.cream), 0, 0.13, 0, 0.1, 0, 0.08));
  bandage.visible = false;
  root.add(bandage);
  const mood = (m: Mood) => {
    arc.visible = m === 'sad' || m === 'happy';
    flat.visible = m === 'neutral';
    oh.visible = m === 'startled';
    // The half-torus is an arch; flipped, it is a smile.
    at(arc, 0, m === 'happy' ? -0.11 : -0.2, 0.262, 0, 0, m === 'happy' ? Math.PI : 0);
    const eyeY = m === 'sad' ? 0.7 : m === 'startled' ? 1.35 : 1;
    eyes.forEach((e) => e.scale.set(1, eyeY, 1));
    brows.forEach((b, i) => {
      const s = i ? 1 : -1;
      b.position.y = m === 'startled' ? 0.17 : 0.13;
      b.rotation.z = m === 'sad' ? -s * 0.38 : m === 'happy' ? s * 0.1 : 0;
    });
  };
  mood('neutral');
  return {root, mood, bandage, eyes};
};

export type Person = ReturnType<typeof makePerson>;
/** A jointed figure standing on its origin and facing +z. */
export const makePerson = (kind: Kind) => {
  const coat = kind === 'cleaner' ? '#659a90' : kind === 'doctor' ? '#ece9db' : C.shirt;
  const trousers = kind === 'cleaner' ? '#426660' : C.slate;
  const wide = kind === 'cleaner' ? 1.16 : 1;
  const leg = (s: number) => pivot(s * 0.13, 0.62, 0,
    at(cap(0.1, 0.36, trousers), 0, -0.28, 0),
    at(box(0.19, 0.11, 0.33, C.ink, 0.05), 0, -0.565, 0.06));
  const legL = leg(-1), legR = leg(1);
  const torso = at(cap(0.27, 0.3, coat), 0, 0.4, 0);
  torso.scale.set(wide, 1, kind === 'cleaner' ? 1.05 : 0.9);
  const upper = pivot(0, 0.62, 0, torso);
  if (kind === 'colin') {
    upper.add(at(box(0.07, 0.34, 0.03, C.darkTeal, 0.012), 0, 0.5, 0.245, -0.1));
    upper.add(at(box(0.3, 0.07, 0.05, C.cream, 0.02), 0, 0.75, 0.2, 0.5));
  } else if (kind === 'cleaner') {
    upper.add(at(box(0.3, 0.2, 0.04, '#7bad9e', 0.02), 0, 0.26, 0.285));
  } else {
    upper.add(at(box(0.025, 0.6, 0.02, '#c9c6b8', 0.005), 0, 0.36, 0.25));
    upper.add(at(ball(0.04, C.coral), 0.14, 0.58, 0.225));
  }
  const cast = at(cap(0.105, 0.34, C.cream), 0, -0.26, 0);
  cast.visible = false;
  const arm = (s: number) => pivot(s * 0.33 * wide, 0.7, 0,
    at(cap(0.085, 0.34, coat), 0, -0.24, 0),
    at(ball(0.095, SKIN[kind]), 0, -0.52, 0));
  const armL = arm(-1), armR = arm(1);
  armR.add(cast);
  const head = makeHead(kind);
  const neck = pivot(0, 1.1, 0, head.root);
  upper.add(armL, armR, neck);
  const root = group(legL, legR, upper);
  // Heading first, then pitch and roll in the figure's own frame, so falls work at any heading.
  root.rotation.order = 'YXZ';
  const hand = (side: 'L' | 'R') => (side === 'L' ? armL : armR).localToWorld(new THREE.Vector3(0, -0.56, 0.04));
  return {
    root, upper, neck, armL, armR, legL, legR, mood: head.mood, hand, kind,
    bandage(on: boolean) { head.bandage.visible = on; },
    cast(on: boolean) { cast.visible = on; },
    /** Arm swing: `forward` raises the arm ahead of the body, `out` lifts it sideways. */
    arms(leftForward: number, rightForward: number, leftOut = 0.06, rightOut = 0.06) {
      armL.rotation.set(-leftForward, 0, -leftOut);
      armR.rotation.set(-rightForward, 0, rightOut);
    },
    /** A walk cycle; `amount` scales the stride so starts and stops can ease. */
    walk(phase: number, amount = 1) {
      const s = Math.sin(phase) * 0.55 * amount;
      legL.rotation.x = s;
      legR.rotation.x = -s;
      armL.rotation.set(-s * 0.7, 0, -0.06);
      armR.rotation.set(s * 0.7, 0, 0.06);
      upper.position.y = 0.62 + Math.abs(Math.cos(phase)) * 0.03 * amount;
    },
    look(yaw: number, pitch = 0) { neck.rotation.set(pitch, yaw, 0); },
    /** Standing 0, kneeling 1: the legs fold back and the body drops. */
    kneel(n: number) {
      legL.rotation.x = legR.rotation.x = n * 1.5;
      root.position.y = -0.46 * n;
    },
    /** Standing 0, seated 1: the legs swing forward. */
    sit(n: number, seat = 0.5) {
      legL.rotation.x = legR.rotation.x = -n * 1.5;
      root.position.y = (seat - 0.56) * n;
    },
    reset() {
      root.rotation.set(0, 0, 0);
      root.position.y = 0;
      upper.rotation.set(0, 0, 0);
      upper.position.y = 0.62;
      legL.rotation.set(0, 0, 0);
      legR.rotation.set(0, 0, 0);
      armL.rotation.set(0, 0, -0.06);
      armR.rotation.set(0, 0, 0.06);
      neck.rotation.set(0, 0, 0);
    },
  };
};

export type Duck = ReturnType<typeof makeDuck>;
/** The duck stands on its origin and faces +z. */
export const makeDuck = () => {
  const white = C.white, orange = mat(C.orange, {rough: 0.7});
  const body = at(ball(0.27, white, 0.82, 0.78, 1.2), 0, 0.32, 0);
  const tail = at(cone(0.11, 0.3, white), 0, 0.42, -0.33, -1.0);
  const chest = at(ball(0.2, white, 0.85, 0.9, 0.9), 0, 0.36, 0.17);
  const wing = (s: number) => pivot(s * 0.2, 0.42, -0.02, at(ball(0.2, '#e9dfcc', 0.16, 0.5, 0.9), s * 0.01, -0.07, -0.04));
  const wingL = wing(-1), wingR = wing(1);
  const eyes = [-1, 1].map((s) => at(ball(0.024, mat(C.ink, {rough: 0.3})), s * 0.1, 0.31, 0.11));
  const lids = [-1, 1].map((s) => at(ball(0.028, '#d9cfbd'), s * 0.1, 0.31, 0.11));
  lids.forEach((l) => { l.visible = false; });
  const neck = pivot(0, 0.42, 0.2,
    at(cap(0.08, 0.16, white), 0, 0.12, 0.02, 0.2),
    at(ball(0.13, white), 0, 0.28, 0.04),
    at(box(0.12, 0.045, 0.2, orange, 0.02), 0, 0.25, 0.2),
    at(box(0.1, 0.03, 0.16, orange, 0.014), 0, 0.215, 0.17),
    ...eyes, ...lids);
  const foot = (s: number) => group(at(cyl(0.018, 0.018, 0.14, orange, 8), s * 0.09, 0.07, 0), at(box(0.12, 0.03, 0.17, orange, 0.012), s * 0.09, 0.015, 0.05));
  const feet = group(foot(-1), foot(1));
  const inner = group(body, tail, chest, wingL, wingR, neck, feet);
  inner.scale.setScalar(1.25);
  const root = group(inner);
  root.rotation.order = 'YXZ';
  return {
    root, neck, inner,
    flap(a: number) { wingL.rotation.z = -a; wingR.rotation.z = a; },
    blink(shut: boolean) { eyes.forEach((e) => { e.visible = !shut; }); lids.forEach((l) => { l.visible = shut; }); },
    /** Side-to-side waddle for walking. */
    waddle(phase: number, amount = 1) {
      inner.rotation.z = Math.sin(phase) * 0.16 * amount;
      inner.position.y = Math.abs(Math.sin(phase)) * 0.04 * amount;
    },
    look(yaw: number, pitch = 0) { neck.rotation.set(pitch, yaw, 0); },
    /** Tuck the feet away while flying. */
    flying(on: boolean) {
      feet.visible = !on;
      [wingL, wingR].forEach((w) => w.scale.set(1, on ? 1.7 : 1, on ? 1.15 : 1));
    },
  };
};

export const makeFox = () => {
  const rust = '#b76f4f';
  const tail = pivot(0, 0.5, -0.5, at(ball(0.2, rust, 0.75, 0.75, 1.9), 0, 0.05, -0.36), at(ball(0.13, C.cream, 0.8, 0.8, 1.2), 0, 0.07, -0.68));
  const head = pivot(0, 0.62, 0.5,
    ball(0.21, rust, 1, 0.9, 1),
    at(cone(0.12, 0.3, rust), 0, -0.04, 0.24, Math.PI / 2),
    at(ball(0.035, C.ink), 0, -0.04, 0.39),
    at(cone(0.08, 0.2, rust, 4), -0.12, 0.22, -0.02), at(cone(0.08, 0.2, rust, 4), 0.12, 0.22, -0.02),
    at(ball(0.026, C.ink), -0.09, 0.05, 0.17), at(ball(0.026, C.ink), 0.09, 0.05, 0.17),
    at(ball(0.13, C.cream, 1, 0.6, 0.9), 0, -0.12, 0.1));
  const legs = [[-0.12, 0.34], [0.12, 0.34], [-0.12, -0.34], [0.12, -0.34]].map(([x, z]) => pivot(x, 0.42, z, at(cap(0.045, 0.3, '#5a4038'), 0, -0.2, 0)));
  const root = group(at(ball(0.26, rust, 0.8, 0.8, 1.9), 0, 0.5, 0), tail, head, ...legs);
  return {
    root, head, tail,
    run(phase: number, amount = 1) {
      legs.forEach((l, i) => { l.rotation.x = Math.sin(phase + (i % 2 ? Math.PI : 0) + (i > 1 ? 1 : 0)) * 0.7 * amount; });
      tail.rotation.x = Math.sin(phase * 0.5) * 0.15;
    },
  };
};

export type Car = ReturnType<typeof makeCar>;
/** Colin's small teal car. It faces +z; the driver is modelled as a bust inside. */
export const makeCar = () => {
  const paint = mat(C.teal, {rough: 0.55});
  const glass = mat('#cfe3da', {opacity: 0.3, rough: 0.2});
  const hood = at(box(1.62, 0.5, 1.25, paint, 0.16), 0, 0.72, 1.3);
  const rear = at(box(1.7, 0.56, 2.7, paint, 0.16), 0, 0.72, -0.6);
  const roof = at(box(1.5, 0.1, 1.75, paint, 0.05), 0, 1.72, -0.55);
  const pillars = [[-0.71, 0.28], [0.71, 0.28], [-0.71, -1.38], [0.71, -1.38]].map(([x, z]) => at(box(0.08, 0.76, 0.08, paint, 0.03), x, 1.34, z, z > 0 ? 0.18 : -0.1));
  const windows = [at(box(1.42, 0.7, 0.03, glass, 0.01), 0, 1.34, 0.3, 0.18), at(box(1.42, 0.7, 0.03, glass, 0.01), 0, 1.34, -1.4, -0.1), at(box(0.03, 0.66, 1.6, glass, 0.01), -0.73, 1.34, -0.55), at(box(0.03, 0.66, 1.6, glass, 0.01), 0.73, 1.34, -0.55)];
  const wheels = [[-0.84, 1.25], [0.84, 1.25], [-0.84, -1.2], [0.84, -1.2]].map(([x, z]) => {
    const w = group(at(cyl(0.38, 0.38, 0.26, C.ink), 0, 0, 0, 0, 0, Math.PI / 2), at(cyl(0.17, 0.17, 0.28, C.cream), 0, 0, 0, 0, 0, Math.PI / 2));
    return at(w, x, 0.38, z);
  });
  const lampMat = mat('#f6dc9a', {emissive: '#f2c66d', emissiveIntensity: 1.4});
  const lamps = [-1, 1].map((s) => at(ball(0.13, lampMat, 1, 1, 0.5), s * 0.56, 0.78, 1.93));
  const tails = [-1, 1].map((s) => at(box(0.26, 0.12, 0.05, mat(C.coral, {emissive: C.coral, emissiveIntensity: 0.5}), 0.02), s * 0.58, 0.8, -1.96));
  const beamMat = new THREE.MeshBasicMaterial({color: '#f6e3b0', transparent: true, opacity: 0.13, depthWrite: false, blending: THREE.AdditiveBlending});
  const beams = group(...[-1, 1].map((s) => {
    const b = new THREE.Mesh(new THREE.ConeGeometry(1.2, 6, 24, 1, true), beamMat);
    return at(b, s * 0.56, 0.6, 4.9, -Math.PI / 2 + 0.06, 0, 0);
  }));
  const wipers = [-1, 1].map((s) => pivot(s * 0.34 - 0.1, 1.02, 0.39, at(box(0.03, 0.5, 0.02, C.ink, 0.008), 0, 0.25, 0)));
  wipers.forEach((w) => { w.rotation.x = 0.18; });
  const bumper = at(box(1.7, 0.14, 0.12, '#cfd3c4', 0.05), 0, 0.5, 1.92);
  // The driver: only what shows through the glass is modelled.
  const colin = makePerson('colin');
  colin.legL.visible = colin.legR.visible = false;
  at(colin.root, -0.36, 0.16, -0.45);
  colin.root.scale.setScalar(0.72);
  colin.arms(1.2, 1.2, 0.1, 0.1);
  colin.mood('sad');
  const wheel = at(mesh(new THREE.TorusGeometry(0.17, 0.025, 8, 20), C.ink), -0.36, 1.12, 0.02, -0.5);
  // What is left of the job: a box of belongings on the roof and one balloon.
  const balloon = pivot(0, 0.3, 0, at(cyl(0.006, 0.006, 0.9, C.cream, 5), 0, 0.45, 0), at(ball(0.24, mat(C.coral, {rough: 0.35}), 1, 1.15, 1), 0, 1.1, 0));
  const text = at(textLabel(0.8, 0.26, 'BALLOON WORKS', {bg: '#c8a878', size: 0.42}), 0.461, 0.22, 0, 0, Math.PI / 2);
  const cargo = at(group(at(box(0.9, 0.5, 0.7, '#c8a878', 0.03), 0, 0.25, 0), at(box(0.94, 0.06, 0.74, '#b89464', 0.02), 0, 0.5, 0), text, balloon), 0, 1.77, -0.6);
  const body = group(hood, rear, roof, ...pillars, ...windows, ...lamps, ...tails, ...wipers, bumper, colin.root, wheel, cargo);
  const root = group(body, ...wheels, beams);
  return {
    root, body, colin, cargo, balloon, hood, beams,
    wipe(clock: number, on = true) { wipers.forEach((w) => { w.rotation.z = on ? Math.sin(clock * 5) * 0.75 - 0.3 : -1.1; }); },
    roll(distance: number) { wheels.forEach((w) => { w.rotation.x = distance / 0.38; }); },
    /** 0..1 folds the bonnet up after the garage crash. */
    crumple(n: number) {
      hood.scale.set(1, 1 + n * 0.25, 1 - n * 0.3);
      hood.position.set(0, 0.72 + n * 0.08, 1.3 - n * 0.18);
      hood.rotation.x = -n * 0.22;
    },
  };
};

/** The hospital cleaner's trolley. */
export const makeTrolley = () => {
  const steel = '#9aaca4';
  const legs = [[-0.4, -0.25], [0.4, -0.25], [-0.4, 0.25], [0.4, 0.25]].map(([x, z]) => group(at(cyl(0.02, 0.02, 0.86, C.ink, 8), x, 0.5, z), at(ball(0.06, C.ink), x, 0.06, z)));
  return group(...legs,
    at(box(0.95, 0.05, 0.6, steel, 0.02), 0, 0.92, 0), at(box(0.95, 0.05, 0.6, steel, 0.02), 0, 0.42, 0),
    at(box(0.4, 0.34, 0.36, '#6f93a8', 0.06), -0.18, 1.1, 0), at(cyl(0.09, 0.07, 0.3, C.ochre), 0.28, 1.08, 0.08),
    at(cyl(0.06, 0.06, 0.24, C.coral), 0.3, 1.05, -0.14), at(box(0.5, 0.2, 0.4, C.cream, 0.05), 0, 0.56, 0),
    at(cyl(0.018, 0.018, 0.7, C.ink, 8), 0.5, 1.02, 0, Math.PI / 2));
};

/** A mop the cleaner carries; the pole rises along +y from the head. */
export const makeMop = () => group(at(cyl(0.022, 0.022, 1.6, C.brown, 8), 0, 0.85, 0), at(box(0.42, 0.1, 0.16, C.cream, 0.05), 0, 0.05, 0));
export const makeBroom = () => group(at(cyl(0.022, 0.022, 1.5, C.brown, 8), 0, 0.85, 0), at(box(0.4, 0.2, 0.09, C.pale, 0.03), 0, 0.1, 0));

/** Walks a figure through [time, x, z] keys, turning it to face the way it is going. Returns true while moving. */
export const stroll = (p: Person, t: number, keys: number[][]) => {
  let i = 0, walked = 0;
  while (i + 2 < keys.length && keys[i + 1][0] <= t) {
    walked += Math.hypot(keys[i + 1][1] - keys[i][1], keys[i + 1][2] - keys[i][2]);
    i++;
  }
  const a = keys[i], b = keys[i + 1];
  const n = ease(t, a[0], b[0]);
  const length = Math.hypot(b[1] - a[1], b[2] - a[2]);
  p.root.position.x = mix(a[1], b[1], n);
  p.root.position.z = mix(a[2], b[2], n);
  const moving = t > a[0] && t < b[0] && length > 0.01;
  if (moving) {
    p.root.rotation.y = Math.atan2(b[1] - a[1], b[2] - a[2]);
    p.walk((walked + length * n) * 5.2, Math.min(1, bump(t, a[0], b[0]) * 3));
  }
  return moving;
};
