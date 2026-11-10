import * as THREE from 'three';
import {C, at, ball, between, box, bump, cap, clamp, cyl, ease, group, heart, makePuffs, makeRoom, makeStars, mat, mix, star, textLabel} from './kit';
import {makeBroom, makeCar, makeDuck, makeHead, makeMop, makePerson, makeTrolley, stroll} from './characters';
import {makeBed, makeCabinet, makeCup, makeDoor, makeFrame, makeLamp, makeShelves, makeSofa, makeWetSign} from './props';
import {SceneDef} from './stage';

const ledge = (x: number) => at(box(2.1, 0.07, 0.5, C.cream), x, 1.2, -3.42);

/** The hospital, twice: each accident leaves Colin more bandaged, and the cleaner notices. */
export const hospitalScene = (visit: 1 | 2): SceneDef => {
  const room = makeRoom({wall: '#d4dfd0', floor: '#bbb7a5', windows: [{x: -2.7, sky: '#b4d1c5'}]});
  const root = room.root;
  root.add(at(box(9, 0.05, 0.03, C.cream), 0, 2.75, -2.98), at(makeBed(), 0.4, 0, -1.9), at(makeCabinet(), 2.5, 0, -2.4), ledge(-2.7), at(makeDoor('#b9c9bd'), -4.44, 1.15, 1.7));
  root.add(at(makeFrame(0.9, 0.6, '#c3d1c5'), 1.4, 2.2, -2.97), at(cyl(0.03, 0.03, 2, '#9aaca4', 8), -1.5, 1, -2.6), at(box(0.25, 0.34, 0.08, '#e9eee2', 0.03), -1.5, 1.95, -2.6));
  const colin = makePerson('colin'), doctor = makePerson('doctor'), cleaner = makePerson('cleaner');
  const trolley = makeTrolley();
  const duck = makeDuck();
  const light = at(group(cyl(0.02, 0.02, 0.2, C.ink, 8), at(ball(0.035, mat(C.ochre, {emissive: '#f2c66d', emissiveIntensity: 2})), 0, 0.12, 0)), 0, -0.6, 0.08, Math.PI / 2);
  const board = at(box(0.3, 0.4, 0.03, '#b08d6d', 0.01), 0, -0.55, 0.14, -1.1);
  doctor.armR.add(light);
  doctor.armL.add(board);
  root.add(colin.root, doctor.root, cleaner.root, trolley, duck.root);
  const pause: [number, number] = visit === 1 ? [3, 4.7] : [2.6, 6];
  const dur = visit === 1 ? 8 : 9;
  return {
    id: `hospital-${visit}`, title: visit === 1 ? 'At the hospital' : 'At the hospital, again', lead: 2, dur,
    sky: ['#9fb8ac', '#5d7a70'],
    sun: {color: '#f2f3e4', intensity: 1.35, pos: [5, 8, 6]}, amb: {sky: '#e8efe2', ground: '#7f8a7c', intensity: 1.1},
    shots: [
      {from: 0, p: [6.8, 4.4, 10.2], l: [0.2, 1.25, -0.4], p2: [6.4, 4.2, 10], fov: 26},
      {from: pause[0] - 0.2, p: [4.6, 2.7, 8], l: [-1, 1.25, 0.1], p2: [4.2, 2.5, 7.4], fov: 23},
      {from: pause[1] + 0.9, p: [6.4, 4.2, 10], l: [0.2, 1.25, -0.4], p2: [6.8, 4.4, 10.2], fov: 26},
    ],
    root,
    update(t, clock) {
      colin.reset();
      colin.mood('sad');
      colin.bandage(true);
      colin.cast(visit === 2);
      at(colin.root, 0.1, 0, -1.2);
      colin.sit(1, 0.74);
      colin.upper.rotation.x = 0.18;
      colin.arms(0.35, visit === 2 ? 1.2 : 0.35, 0.05, visit === 2 ? -0.45 : 0.05);
      const noticed = visit === 2 ? bump(t, 4.2, 5.6) : 0;
      colin.look(-0.7 * noticed, 0.5 - 0.35 * noticed);

      doctor.reset();
      at(doctor.root, -1.45, 0, -0.7, 0, 1.2);
      light.visible = visit === 1;
      if (visit === 1) {
        const shine = 1 - ease(t, 3.2, 4);
        doctor.arms(0.95, 1.35 * shine + Math.sin(clock * 2.2) * 0.07 * shine, 0.1, 0.25);
        doctor.look(Math.sin(clock * 3) * 0.3 * bump(t, 4, 6), 0.1 + 0.35 * ease(t, 6, 6.6));
      } else {
        doctor.arms(1.0, 0.2 + bump(t, 2, 3.4) * 0.5, 0.1, bump(t, 2, 3.4) * 0.7);
        doctor.look(Math.sin(clock * 2.6) * 0.32 * bump(t, 0.6, 3.6), 0.2);
      }
      doctor.mood('neutral');

      // The cleaner slows as she passes; on the second visit she stops and waves.
      const before = between(t, 0, pause[0]), after = between(t, pause[1], dur);
      const x = -4.1 + 1.6 * (1 - (1 - before) * (1 - before)) + 6.6 * after * after;
      cleaner.reset();
      at(cleaner.root, x, 0, 1.7, 0, Math.PI / 2);
      const rolling = t < pause[0] - 0.2 || t > pause[1] + 0.1;
      cleaner.walk(x * 5, rolling ? 1 : 0);
      const wave = visit === 2 ? ease(t, 3.5, 4.1) * (1 - ease(t, 5.3, 5.9)) : 0;
      cleaner.arms(0.95, 0.95 * (1 - wave) + wave * 2.6 + Math.sin(clock * 9) * 0.2 * wave, 0.05, 0.05 + wave * 0.3);
      const glance = ease(t, pause[0] - 0.5, pause[0] + 0.3) * (1 - ease(t, pause[1] - 0.1, pause[1] + 0.6));
      cleaner.look(0.95 * glance, 0.05);
      cleaner.mood(glance > 0.5 ? 'sad' : 'neutral');
      at(trolley, x + 0.85, 0, 1.7);

      at(duck.root, -2.7, 1.235, -3.42);
      duck.flap(0);
      duck.look(0.55 + Math.sin(clock * 0.7) * 0.1, 0.1);
      duck.blink(clock % 3.3 < 0.13);
    },
  };
};

/** V. The garage: the engine running, the door down, and a fly the duck wants. */
export const garageScene = (): SceneDef => {
  const room = makeRoom({wall: '#b7b7a8', floor: '#929187', trim: '#a5a596'});
  const root = room.root;
  root.add(at(box(0.02, 3.3, 3.7, new THREE.MeshBasicMaterial({color: '#e3ecdf'})), -4.47, 1.65, 0.2));
  const panels = [0, 1, 2, 3, 4, 5, 6].map((i) => at(box(0.07, 0.45, 3.7, '#c9c8b5', 0.02), -4.42, 3.3 - (i + 0.5) * 0.47, 0.2));
  root.add(...panels, at(box(0.14, 3.4, 0.14, '#8f9d91', 0.02), -4.4, 1.7, -1.72), at(box(0.14, 3.4, 0.14, '#8f9d91', 0.02), -4.4, 1.7, 2.12));
  const glow = new THREE.Mesh(new THREE.PlaneGeometry(3.4, 3.6), new THREE.MeshBasicMaterial({color: '#f0f2dc', transparent: true, opacity: 0.3, depthWrite: false}));
  root.add(at(glow, -2.75, 0.012, 0.2, -Math.PI / 2));
  root.add(at(makeShelves(4, 2.7, 3), -0.3, 0, -2.7));
  [[-1.8, 0.9, C.coral, 0.5], [-1.1, 0.9, C.teal, 0.36], [1.2, 0.9, '#c8a878', 0.6], [-1.6, 1.8, C.ochre, 0.44], [0.9, 1.8, C.teal, 0.5], [1.5, 1.8, '#c8a878', 0.36], [-1.9, 2.7, '#c8a878', 0.5]].forEach(([x, y, color, s]) =>
    root.add(at(box(s as number, (s as number) * 0.8, 0.4, color as string, 0.03), x as number, (y as number) + (s as number) * 0.4, -2.7)));
  // Three boxes that are only waiting for the crash.
  const loose = [[-0.9, 1.8, '#c8a878'], [-0.2, 0.9, C.coral], [0.4, 1.8, C.ochre]].map(([x, y, color]) => {
    const b = box(0.42, 0.36, 0.38, color as string, 0.03);
    root.add(b);
    return {b, x: x as number, y: (y as number) + 0.18};
  });
  root.add(at(box(1.2, 0.9, 0.6, '#8e7060', 0.03), 3.4, 0.45, -2.6), at(cyl(0.2, 0.2, 0.34, C.coral), 3.2, 1.07, -2.6), at(cyl(0.38, 0.38, 0.2, C.ink), 3.75, 0.1, -0.6), at(cyl(0.38, 0.38, 0.2, C.ink), 3.7, 0.3, -0.62));
  const can = group(cyl(0.07, 0.07, 0.26, C.coral, 16), at(cyl(0.03, 0.03, 0.06, C.cream, 10), 0, 0.16, 0), at(textLabel(0.12, 0.07, 'SPRAY', {size: 0.6}), 0, 0, 0.072));
  const broom = makeBroom();
  const car = makeCar();
  car.cargo.visible = false;
  car.beams.visible = false;
  const exhaust = makePuffs(9, '#d9d9cc', 0.13);
  const fly = group(ball(0.035, C.ink), at(ball(0.035, mat('#e9eee6', {opacity: 0.7}), 1, 0.2, 0.6), -0.03, 0.03, 0), at(ball(0.035, mat('#e9eee6', {opacity: 0.7}), 1, 0.2, 0.6), 0.03, 0.03, 0));
  const duck = makeDuck();
  const stars = makeStars();
  const bang = star(0.6, C.cream);
  root.add(can, broom, car.root, exhaust.root, fly, duck.root, stars.root, bang);
  return {
    id: 'garage', title: 'The garage', numeral: 'V', lead: 2.4, dur: 11.8,
    sky: ['#8c9a93', '#4d5c58'],
    sun: {color: '#eef0e2', intensity: 1.2, pos: [6, 8, 6]}, amb: {sky: '#dfe2d5', ground: '#74746b', intensity: 1.0},
    hold: {at: 5.6, hint: 'Tap the duck', target: () => duck.root.localToWorld(new THREE.Vector3(0, 0.5, 0))},
    shots: [
      {from: 0, p: [6.4, 4.6, 10.6], l: [-0.6, 1.3, -0.3], p2: [7, 4.8, 10.2], l2: [-0.3, 1.3, -0.4], fov: 26},
      {from: 3.4, p: [5, 4, 5.4], l: [-0.2, 2.1, -2.5], p2: [4.6, 3.8, 5], fov: 24},
      {from: 6.9, p: [7, 4.6, 10.2], l: [-0.2, 1.3, -0.6], p2: [6.6, 4.2, 9.8], fov: 25},
    ],
    root,
    update(t, clock, env) {
      const shut = ease(t, 0.2, 2.6);
      panels.forEach((p, i) => { p.visible = i < shut * 7.01; });
      glow.material.opacity = 0.3 * (1 - shut);
      env.sun.intensity *= 1 - shut * 0.22;
      const lurch = between(t, 7.9, 8.3), crash = ease(t, 8.25, 8.5);
      const running = ease(t, 2.6, 3.4) * (1 - ease(t, 8.3, 8.8));
      at(car.root, -0.3, 0, 0.25 - lurch * lurch * 0.72, 0, Math.PI, 0);
      car.body.position.y = Math.sin(clock * 34) * 0.008 * running;
      car.body.rotation.x = bump(t, 7.9, 8.6) * 0.05;
      car.crumple(crash);
      car.wipe(clock, false);
      car.roll(lurch * 0.72);
      exhaust.root.position.set(0.25, 0.35, 2.3 - lurch * 0.7);
      exhaust.set(running, clock, 1.9, 0.7, 0.4);
      const startled = t > 7.1 && t < 8.6;
      car.colin.mood(startled ? 'startled' : 'sad');
      car.colin.look(0, t > 8.6 ? 0.75 * ease(t, 8.6, 9.2) : startled ? -0.15 : 0.4 * ease(t, 2.6, 4));
      car.colin.arms(startled ? 2.2 : 1.2, startled ? 2.2 : 1.2, 0.3, 0.3);

      const fx = 0.3 + Math.cos(clock * 2.3) * 0.7, fy = 3.05 + Math.sin(clock * 3.1) * 0.22, fz = -2.3 + Math.sin(clock * 1.7) * 0.35;
      fly.position.set(fx, fy, fz);
      fly.visible = t < 9;
      // The lunge at the fly sends the can off the shelf and the duck onto the bonnet.
      const lunge = bump(t, 5.6, 6.2), down = ease(t, 6.2, 7.4), back = ease(t, 8.25, 9.3);
      const dx = mix(mix(-0.9, -0.55, down), -1.2, back), dy = mix(mix(2.7, 1.0, down), 2.7, back), dz = mix(mix(-2.65, -1.15, down), -2.65, back);
      duck.root.position.set(dx + lunge * 0.9, dy + lunge * 0.25 + Math.sin(down * Math.PI) * 0.4 + Math.sin(back * Math.PI) * 0.6, dz);
      duck.root.rotation.set(0, lunge * 1.2, 0);
      const airborne = (down > 0 && down < 1) || (back > 0 && back < 1);
      duck.flying(airborne);
      duck.flap(airborne || lunge > 0.1 ? 1.25 + Math.sin(clock * 22) * 0.55 : 0);
      duck.look(t < 5.6 ? clamp(Math.atan2(fx - dx, fz - dz), -1.2, 1.2) : 0, t < 5.6 ? -0.35 : t > 9.3 ? 0.45 : 0);
      duck.blink(clock % 3 < 0.13);
      const fall = between(t, 5.95, 6.75), bounce = between(t, 6.75, 7.4);
      can.position.set(mix(0.5, 0.25, fall) + bounce * 1.1, mix(2.83, 1.1, fall * fall) + Math.sin(bounce * Math.PI) * 0.5 - bounce * 1.02, mix(-2.6, -1.0, fall) + bounce * 0.3);
      can.rotation.set(fall * 5 + bounce * 4, 0, bounce * 1.57);
      at(broom, 2.0, 0, -2.5, 0, 0, -0.14 - ease(t, 6.6, 7.5) * 1.37);
      loose.forEach((l, i) => {
        const drop = between(t, 8.3 + i * 0.1, 9 + i * 0.1);
        const rest = [1.12, 0.98, 1.15][i];
        l.b.position.set(l.x + drop * (i - 1) * 0.3, mix(l.y, rest, drop * drop), -2.7 + drop * 1.15);
        l.b.rotation.set(drop * 2.2, 0, drop * (i - 1) * 0.6);
      });
      at(bang, -0.3, 1.35, -2.05);
      bang.scale.setScalar(Math.max(0.001, bump(t, 8.25, 8.8)));
      bang.rotation.z = clock * 2;
      stars.root.position.set(0.05, 2.25, -0.35);
      stars.set(ease(t, 8.8, 9.3), clock);
    },
  };
};

const STEP = {x0: -0.9, run: 0.5, rise: 0.3, n: 8, z: -2.3};
const stairY = (x: number) => clamp(Math.ceil((x - STEP.x0) / STEP.run), 0, STEP.n) * STEP.rise;

/** VI. The stairs: Colin goes after the duck, and the duck stands its ground. */
export const stairsScene = (): SceneDef => {
  const room = makeRoom({wall: '#cfc2ae', floor: '#ae8c75', windows: [{x: -2.6, sky: '#a9bdb4'}]});
  const root = room.root;
  for (let i = 0; i < STEP.n; i++) {
    const h = (i + 1) * STEP.rise;
    root.add(at(box(STEP.run, h, 1.4, i % 2 ? '#9f7963' : '#a8826b', 0.02), STEP.x0 + STEP.run * (i + 0.5), h / 2, STEP.z));
    root.add(at(box(STEP.run + 0.04, 0.05, 1.44, C.cream, 0.02), STEP.x0 + STEP.run * (i + 0.5), h, STEP.z));
    if (i % 2 === 0) root.add(at(box(0.06, 0.9, 0.06, C.cream, 0.02), STEP.x0 + STEP.run * (i + 0.5), h + 0.45, STEP.z + 0.66));
  }
  root.add(at(box(1.4, 2.4, 1.4, '#9f7963', 0.02), 3.8, 1.2, STEP.z), at(box(1.44, 0.05, 1.44, C.cream, 0.02), 3.8, 2.4, STEP.z));
  const rail = box(4.9, 0.08, 0.08, C.brown, 0.03);
  root.add(at(rail, 1.1, 2.17, STEP.z + 0.66, 0, 0, Math.atan2(STEP.rise, STEP.run)), at(box(1.4, 0.08, 0.08, C.brown, 0.03), 3.8, 3.35, STEP.z + 0.66), at(box(0.06, 0.95, 0.06, C.cream, 0.02), 4.44, 2.87, STEP.z + 0.66));
  root.add(at(makeDoor(), 3.9, 3.55, -2.96, 0, Math.PI / 2), at(makeSofa(), -2.9, 0, 1.3), at(box(3.6, 0.03, 2.4, '#8b9283', 0.01), -2.9, 0.015, 1.4), at(makeLamp(), -4, 0, -2.3), ledge(-2.6));
  const colin = makePerson('colin');
  const held = at(makeBroom(), 0, -0.5, 0.05, Math.PI / 2 + 0.3);
  colin.armL.add(held);
  const dropped = makeBroom();
  const duck = makeDuck();
  const stars = makeStars();
  root.add(colin.root, dropped, duck.root, stars.root);
  const loop = (a: number) => [-2.9 + Math.cos(a) * 2.05, 1.3 + Math.sin(a) * 1.3];
  return {
    id: 'stairs', title: 'The stairs', numeral: 'VI', lead: 2.4, dur: 16.6,
    sky: ['#96a399', '#56665d'],
    sun: {color: '#f3e9d4', intensity: 1.3, pos: [5, 8, 6]}, amb: {sky: '#e9dfca', ground: '#7d6c5c', intensity: 1.05},
    hold: {at: 11.9, hint: 'Tap the duck', target: () => duck.root.localToWorld(new THREE.Vector3(0, 0.5, 0))},
    shots: [
      {from: 0, p: [6.8, 5, 10.8], l: [-0.8, 1.2, -0.2], p2: [7.2, 5.2, 10.4], fov: 26},
      {from: 6.2, p: [7, 5, 10.6], l: [0.4, 1.5, -0.8], p2: [6.4, 4.8, 9.6], l2: [1.2, 1.8, -1.4], fov: 26},
      {from: 11.2, p: [5.4, 4.9, 3.8], l: [3.2, 3.0, -2.3], p2: [5.1, 4.7, 3.4], fov: 26},
      {from: 12.75, p: [6.6, 4.4, 10.2], l: [0.6, 1.4, -1], p2: [6, 3.9, 9.6], l2: [0, 1.1, -1.1], fov: 26},
    ],
    root,
    update(t, clock) {
      colin.reset();
      colin.bandage(true);
      colin.cast(true);
      // Round and round the sofa.
      const lap = (time: number) => 0.4 - Math.min(time, 5.6) * 1.35;
      const off = ease(t, 5.6, 6.6);
      const [lx, lz] = loop(lap(t));
      const hops = between(t, 6.6, 9.4);
      const sx = mix(STEP.x0 - 0.3, 3.85, hops);
      const onStairs = t > 6.6;
      const dX = onStairs ? sx : mix(lx, STEP.x0 - 0.3, off), dZ = onStairs ? STEP.z : mix(lz, STEP.z, off);
      const fright = ease(t, 11.9, 12.4);
      duck.root.position.set(dX - fright * 0.35, (onStairs ? stairY(sx) : 0) + (onStairs && hops < 1 ? Math.abs(Math.sin(hops * Math.PI * 9)) * 0.28 : 0) + bump(t, 11.9, 12.5) * 0.3, dZ);
      const [nx, nz] = loop(lap(t) - 0.1);
      duck.root.rotation.set(0, t < 5.6 ? Math.atan2(nx - lx, nz - lz) : t < 9.6 ? Math.PI / 2 : mix(Math.PI / 2, -Math.PI / 2, ease(t, 9.6, 10.2)), 0);
      duck.waddle(clock * 13, t < 6.6 ? 1 : 0);
      duck.flap(t > 11.9 && t < 13.4 ? 1 + Math.sin(clock * 24) * 0.9 : onStairs && hops < 1 ? 0.5 + Math.sin(clock * 20) * 0.4 : 0);
      duck.look(0, t > 13.6 ? 0.5 : 0);
      duck.blink(clock % 2.7 < 0.13);

      // Colin, half a lap behind with the broom, then up after it.
      const fallen = t >= 12.75;
      held.visible = !fallen;
      dropped.visible = fallen;
      if (t < 6.4) {
        const a = lap(t) + 1.25;
        const [cx, cz] = loop(a), [mx, mz] = loop(a - 0.1);
        at(colin.root, cx, 0, cz, 0, Math.atan2(mx - cx, mz - cz));
        colin.walk(clock * 11, 1);
        colin.arms(2.3 + Math.sin(clock * 6) * 0.2, 0.9, 0.2, -0.3);
        colin.mood('startled');
      } else if (t < 12.75) {
        const from = loop(lap(6.4) + 1.25);
        const moving = stroll(colin, t, [[6.4, from[0], from[1]], [8, STEP.x0 - 0.45, STEP.z], [11.5, 2.85, STEP.z], [12.6, 2.85, STEP.z]]);
        const cx = colin.root.position.x;
        colin.root.position.y = stairY(cx + 0.12);
        if (!moving) colin.root.rotation.y = Math.PI / 2;
        const puff = t > 11.5 ? Math.sin(clock * 6) * 0.04 : 0;
        colin.upper.rotation.x = (t > 11.5 ? 0.25 * (1 - fright) : 0.1) + puff - fright * 0.5;
        colin.arms(t > 11.5 ? mix(0.5, 2.5, fright) : 1.5, t > 11.5 ? mix(0.9, 2.4, fright) : 0.9, 0.2 + fright * 0.5, -0.3 + fright * 0.9);
        colin.mood(fright > 0.2 ? 'startled' : 'sad');
        colin.root.rotation.x = -ease(t, 12.3, 12.75) * 0.5;
      } else {
        // The tumble: all the way down, heels over head.
        const n = between(t, 12.75, 14.3);
        const x = mix(2.85, -1.4, n * n * 0.4 + n * 0.6);
        const landed = ease(t, 14.1, 14.4);
        at(colin.root, x, Math.max(stairY(x) * (1 - landed), 0) + Math.abs(Math.sin(n * Math.PI * 4)) * 0.35 * (1 - n) + 0.2, STEP.z + n * 1.4, 0, Math.PI / 2, 0);
        colin.root.rotation.x = mix(-0.5, -Math.PI * 3.5, n);
        colin.arms(2.4, 2.2, 0.7, 0.7);
        colin.legL.rotation.x = n < 1 ? Math.sin(clock * 14) * 0.6 : -0.3;
        colin.legR.rotation.x = n < 1 ? -Math.sin(clock * 14) * 0.6 : 0.2;
        colin.mood('startled');
        const b = between(t, 12.75, 14.6);
        at(dropped, mix(2.6, -0.4, b), Math.max(0.06, stairY(mix(2.6, -0.4, b)) * (1 - b) + Math.sin(b * Math.PI) * 1.2), STEP.z + 0.9 + b * 1.6, 0, b * 7, Math.PI / 2 + b * 9);
      }
      stars.root.position.set(0.45, 0.8, STEP.z + 1.4);
      stars.set(ease(t, 14.4, 14.8), clock);
    },
  };
};

/** VII. A little kindness: a cup he cannot reach, and someone who notices. */
export const kindnessScene = (): SceneDef => {
  const room = makeRoom({wall: '#d6dfd0', floor: '#b8b8a8', windows: [{x: -2.5, sky: '#a9c2bd'}]});
  const root = room.root;
  const skyCard = room.skies[0].material as THREE.MeshBasicMaterial;
  root.add(at(box(9, 0.05, 0.03, C.cream), 0, 2.75, -2.98), at(makeBed(), 0, 0, -1.6), at(makeCabinet(), -2.55, 0, -2.4), ledge(-2.5), at(makeFrame(0.9, 0.6, '#c3d1c5'), 1.3, 2.2, -2.97));
  // Colin, in plaster from the neck down, with one leg in traction.
  const head = makeHead('colin');
  head.bandage.visible = true;
  // He lies on his back: crown towards the headboard, face up and a little towards us.
  const face = new THREE.Vector3(0.22, 0.72, 0.66).normalize();
  const crown = new THREE.Vector3(-0.9, 0.42, 0);
  crown.addScaledVector(face, -crown.dot(face)).normalize();
  const headPivot = at(group(head.root), -0.98, 1.08, -1.6);
  headPivot.quaternion.setFromRotationMatrix(new THREE.Matrix4().makeBasis(new THREE.Vector3().crossVectors(crown, face), crown, face));
  const plaster = mat('#f4f1e6', {rough: 1});
  const patient = group(
    at(cap(0.3, 0.75, plaster), -0.3, 0.98, -1.6, 0, 0, Math.PI / 2),
    at(cap(0.12, 0.8, plaster), 0.75, 0.9, -1.85, 0, 0, Math.PI / 2),
    at(cap(0.12, 0.85, plaster), 0.72, 1.2, -1.35, 0, 0, Math.PI / 2 + 0.55),
    at(cap(0.1, 0.55, plaster), -0.25, 1.02, -1.14, 0.25, 0, Math.PI / 2), at(cap(0.1, 0.55, plaster), -0.25, 1.02, -2.06, -0.25, 0, Math.PI / 2),
    at(ball(0.1, C.skin), 0.12, 1.02, -1.08), at(ball(0.1, C.skin), 0.12, 1.02, -2.12),
    at(box(1.5, 0.12, 1.2, '#e9eee2', 0.05), 0.45, 0.76, -1.6), headPivot);
  root.add(patient, at(cyl(0.03, 0.03, 2.6, '#9aaca4', 8), 1.55, 1.3, -1.35), at(box(0.7, 0.05, 0.05, '#9aaca4', 0.02), 1.25, 2.58, -1.35), at(cyl(0.008, 0.008, 1.05, C.ink, 5), 1.0, 2.04, -1.35), at(ball(0.07, C.ink), 1.25, 0.06, -1.35));
  const cup = makeCup();
  const cleaner = makePerson('cleaner');
  const mop = at(group(at(makeMop(), 0, -1.2, 0)), 0, -0.52, 0.06);
  cleaner.armR.add(mop);
  const parked = at(makeMop(), 2.2, 0, -2.75, 0.22, 0, 0);
  const sign = at(makeWetSign(), 3.1, 0, 1.5, 0, 0.5);
  const shine = at(cyl(1.3, 1.3, 0.008, mat('#cfdcd4', {rough: 0.15, opacity: 0.55}), 36), 1.6, 0.008, 0.7);
  const love = heart(0.2);
  const duck = makeDuck();
  root.add(cup.root, cleaner.root, parked, sign, shine, love, duck.root);
  const top = new THREE.Color(), bottom = new THREE.Color(), warm = new THREE.Color();
  return {
    id: 'kindness', title: 'A little kindness', numeral: 'VII', lead: 2.6, dur: 26.8, major: true,
    sky: ['#9fb8ac', '#5d7a70'],
    sun: {color: '#f2f3e4', intensity: 1.3, pos: [5, 8, 6]}, amb: {sky: '#e8efe2', ground: '#7f8a7c', intensity: 1.1},
    hold: {at: 9.8, hint: 'Tap the cup', target: () => cup.root.localToWorld(new THREE.Vector3(0, 0.15, 0))},
    shots: [
      {from: 0, p: [5.6, 3.7, 8.6], l: [-0.5, 1.1, -1], p2: [5.2, 3.5, 8.2], fov: 25},
      {from: 1.4, p: [1.4, 2.5, 3.4], l: [-1.75, 1.05, -1.9], p2: [1.1, 2.3, 3], fov: 23},
      {from: 4.2, p: [5.2, 3.5, 8.2], l: [-0.3, 1.1, -0.8], p2: [5.8, 3.8, 8.6], fov: 25},
      {from: 14.3, p: [1.5, 2.5, 2.8], l: [-1.25, 1.25, -1.35], p2: [1.1, 2.2, 2.3], fov: 22},
      {from: 19.4, p: [5.6, 3.7, 8.6], l: [-0.5, 1.1, -1], p2: [5.2, 3.4, 8.2], fov: 25},
      {from: 21.2, p: [-3.5, 2.2, 0.9], l: [-2.5, 1.75, -3.3], p2: [-3.3, 2.2, 0.5], l2: [-2.6, 2.15, -3.3], fov: 24},
    ],
    root,
    update(t, clock, env) {
      const glance = bump(t, 1.2, 3.6) + bump(t, 8.4, 10.6);
      head.mood(t > 17.5 ? 'happy' : 'sad');
      const sip = t > 15.4 && t < 17.4 ? Math.sin(clock * 9) * 0.03 : 0;
      head.root.rotation.set(-0.55 * clamp(glance) + sip, 0, 0);

      cleaner.reset();
      const moving = stroll(cleaner, t, [[2.4, 5.4, 1.4], [5, 2.2, 0.9], [9.6, 0.9, 0.7], [10.5, 0.9, 0.7], [11.1, 2.1, -1.9], [11.5, 2.1, -1.9], [12.9, -2.35, -1.3], [13.7, -2.35, -1.3], [14.5, -1.75, -0.95], [27, -1.75, -0.95]]);
      const mopping = t > 5.3 && t < 9.8;
      const sway = Math.sin(clock * 3.2);
      mop.visible = t < 11.1;
      parked.visible = !mop.visible;
      sign.scale.setScalar(Math.max(0.001, ease(t, 5, 5.4)));
      shine.scale.set(Math.max(0.001, ease(t, 5.6, 9.6)), 1, Math.max(0.001, ease(t, 5.6, 9.6)));
      if (mopping) {
        cleaner.walk(clock * 3.2, 0.25);
        cleaner.root.rotation.y = -0.5 + sway * 0.15;
        cleaner.upper.rotation.x = 0.12;
        cleaner.arms(0.5, 0.7 + sway * 0.22, 0.1, -0.1);
      } else if (t < 11.1 && t > 2.4) cleaner.arms(moving ? 0.3 : 0.5, 0.7, 0.06, 0);
      const noticed = ease(t, 9.8, 10.4);
      if (t >= 9.8 && t < 10.5) { cleaner.root.rotation.y = -0.5; cleaner.look(-0.9 * noticed, 0); }
      // She fetches the cup and holds the straw where he can reach it.
      const pick = bump(t, 12.9, 13.7), offer = ease(t, 14.5, 15.3) * (1 - ease(t, 19.4, 20.2));
      if (t >= 12.9 && t < 13.7) { cleaner.root.rotation.y = Math.PI + 0.2; cleaner.upper.rotation.x = pick * 0.45; cleaner.arms(0, pick * 1.5, 0.06, 0); }
      if (t >= 14.5) {
        cleaner.root.rotation.y = Math.PI / 2;
        cleaner.upper.rotation.x = offer * 0.35;
        cleaner.arms(0.15 * offer, 0.4 + offer * 1.0, 0.06, 0);
        cleaner.look(0, 0.25 * offer);
      }
      cleaner.mood(t > 17.9 ? 'happy' : 'neutral');
      const inHand = t > 13.3 && t < 20;
      if (inHand) {
        cup.root.position.copy(cleaner.hand('R')).add(new THREE.Vector3(0.02, -0.06, 0));
        cup.root.rotation.set(0, 0, -0.3 * offer);
      } else if (t >= 20) at(cup.root, -0.6, 0.72, -1.08);
      else at(cup.root, -2.55, 0.85, -2.3);
      cup.drink(ease(t, 15.5, 17.4));
      const rise = between(t, 17.7, 20.4);
      love.position.set(-1.15, 1.95 + rise * 1.0, -1.3);
      love.scale.setScalar(Math.max(0.001, ease(t, 17.7, 18.2) * (1 - ease(t, 19.8, 20.4))));
      love.rotation.y = Math.sin(clock * 2) * 0.4;

      // The weather turns.
      const clear = ease(t, 17.5, 22);
      env.sun.color.lerp(warm.set('#ffdfa8'), clear);
      env.sun.intensity *= 1 + clear * 0.45;
      skyCard.color.set('#a9c2bd').lerp(warm.set('#f6dfae'), clear);
      env.setSky('#' + top.set('#9fb8ac').lerp(warm.set('#e7c59a'), clear).getHexString(), '#' + bottom.set('#5d7a70').lerp(warm.set('#7fa9a0'), clear).getHexString());

      // The duck has seen enough, and goes.
      const turn = ease(t, 23.3, 24), leave = between(t, 24, 26.6);
      duck.root.position.set(-2.5 - leave * leave * 0.5, 1.235 + leave * 1.25 + bump(t, 23.9, 24.5) * 0.2, -3.42 - leave * 0.55);
      duck.root.rotation.set(-leave * 0.4, mix(0.5, -2.7, turn), 0);
      // The sky behind the window is only a card, so distance is faked by shrinking.
      duck.root.scale.setScalar(1 - leave * 0.78);
      duck.flying(leave > 0.05);
      duck.flap(leave > 0 ? 1.25 + Math.sin(clock * 20) * 0.55 : bump(t, 22.9, 23.4) * 0.5);
      duck.look(0, t > 22 && t < 22.9 ? 0.4 * bump(t, 22, 22.9) : 0.08);
      duck.blink((t > 21.8 && t < 22) || clock % 3.5 < 0.13);
    },
  };
};
