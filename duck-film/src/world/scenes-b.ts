import * as THREE from 'three';
import {C, at, between, box, bump, cyl, ease, group, makePuffs, makeRoom, makeStars, mat, mix} from './kit';
import {makeBroom, makeDuck, makePerson, stroll} from './characters';
import {makeChair, makeClock, makeCounter, makeDoor, makeEnvelope, makeFrame, makeKey, makeLamp, makeLetter, makeNewspapers, makeOven, makePlate, makeSofa, makeTable, makeVase} from './props';
import {SceneDef} from './stage';

const WIDE = {p: [7.2, 4.6, 10.2] as [number, number, number], l: [0, 1.25, -0.3] as [number, number, number]};
const ledge = (x: number) => at(box(2.1, 0.07, 0.5, C.cream), x, 1.2, -3.42);
const warmLight = (x: number, y: number, z: number, strength = 9) => {
  const l = new THREE.PointLight('#ffc98a', strength, 9, 1.6);
  l.position.set(x, y, z);
  return l;
};

/** II. The letter: an envelope on the table and a key on a plate. */
export const letterScene = (): SceneDef => {
  const room = makeRoom({wall: '#d6bea3', floor: '#b28c71', windows: [{x: 2.4, sky: '#9db5af'}]});
  const root = room.root;
  root.add(at(box(4.2, 0.03, 2.8, '#8b9283', 0.01), 0.6, 0.015, -0.3), at(makeTable(), 0.6, 0, -0.4));
  const chair = at(makeChair(), -1.15, 0, -0.4, 0, Math.PI / 2);
  root.add(chair, at(makeChair(), 2.35, 0, -0.4, 0, -Math.PI / 2));
  root.add(at(makePlate(), 0.15, 1.0, -0.25), at(makeKey(), 0.15, 1.06, -0.3, 0, 0.7), at(makeVase(), 1.15, 1.0, -0.55));
  const envelope = makeEnvelope();
  const letter = group(at(makeLetter(), 0, 0, 0, 0, Math.PI, 0));
  root.add(envelope, letter);
  root.add(at(makeDoor(), -4.44, 1.15, 0.9), at(makeLamp(), 3.7, 0, -2.3), warmLight(3.7, 1.7, -2.1));
  root.add(at(makeFrame(0.7, 0.9, '#9fb3a6'), -1.5, 2.3, -2.97), at(box(0.62, 0.8, 0.012, '#e2cdb4', 0.005), -0.5, 2.3, -2.995));
  root.add(at(box(1.5, 0.08, 0.06, C.brown), -3.2, 2.0, -2.95), ...[-0.5, 0, 0.5].map((x) => at(cyl(0.025, 0.025, 0.14, C.brown, 8), -3.2 + x, 2.0, -2.88, Math.PI / 2)));
  root.add(at(box(0.5, 0.75, 0.16, '#59706d', 0.07), -3.7, 1.6, -2.82));
  root.add(ledge(2.4));
  const carton = group(box(0.7, 0.42, 0.5, '#c8a878', 0.03), at(box(0.74, 0.05, 0.54, '#b89464', 0.02), 0, 0.2, 0));
  root.add(carton);
  const colin = makePerson('colin');
  const duck = makeDuck();
  root.add(colin.root, duck.root);
  const forward = new THREE.Vector3();
  return {
    id: 'letter', title: 'The letter', numeral: 'II', lead: 2.4, dur: 21,
    sky: ['#8d9f97', '#4f6660'],
    sun: {color: '#f1e3cb', intensity: 1.25, pos: [4, 8, 7]}, amb: {sky: '#e6d8c2', ground: '#7a6a5b', intensity: 1.05},
    hold: {at: 6.6, hint: 'Open the letter', target: () => envelope.localToWorld(new THREE.Vector3(0, 0, 0))},
    shots: [
      {from: 0, p: [2.0, 1.9, 1.7], l: [0.6, 1.12, -0.4], p2: [1.7, 1.8, 1.5], fov: 24},
      {from: 2.4, p: WIDE.p, l: WIDE.l, p2: [6.6, 4.3, 10.4], fov: 26},
      {from: 10, p: [0.7, 1.9, 0.92], l: [0.87, 1.26, 1.24], p2: [0.74, 1.8, 0.98], fov: 50},
      {from: 16, p: [6.6, 4.3, 10.4], l: WIDE.l, p2: [6, 3.9, 10], l2: [0.2, 1.2, -0.6], fov: 25},
    ],
    root,
    update(t, clock) {
      colin.reset();
      colin.mood('sad');
      const moving = stroll(colin, t, [[2, -4.1, 0.9], [5, -1.9, 0.9], [6.6, -1.9, 0.9], [8.2, 0.6, 0.75], [17.4, 0.6, 0.75], [18.9, -1.15, 0.25], [19, -1.15, -0.3]]);
      const carrying = t < 5;
      const setDown = ease(t, 5, 5.8), up = ease(t, 5.8, 6.3);
      if (!moving) {
        colin.root.rotation.y = t < 6.6 ? mix(Math.PI / 2, 1.0, ease(t, 5.8, 6.4)) : t < 17.4 ? mix(Math.PI, 0.5, ease(t, 9, 9.8)) : Math.PI / 2;
      }
      colin.upper.rotation.x = (setDown - up) * 0.7;
      if (carrying || setDown < 1) colin.arms(1.1 + setDown * 0.3 - up, 1.1 + setDown * 0.3 - up, 0.12, 0.12);
      forward.set(Math.sin(colin.root.rotation.y), 0, Math.cos(colin.root.rotation.y));
      carton.position.set(colin.root.position.x + forward.x * 0.5, mix(1.02, 0.21, setDown) + (moving ? Math.abs(Math.sin(clock * 9)) * 0.02 : 0), colin.root.position.z + forward.z * 0.5);
      if (t >= 5.8) carton.position.set(-1.4, 0.21, 0.9);
      carton.rotation.y = t < 5.8 ? colin.root.rotation.y : Math.PI / 2;
      colin.look(t > 6.1 && t < 6.6 ? 0.2 : 0, t > 9.8 && t < 16.4 ? 0.45 : t > 16.4 ? 0.55 : 0.3);

      // He takes the envelope, turns to the light and reads.
      const reach = bump(t, 8.2, 9.2), reading = ease(t, 9, 9.8) * (1 - ease(t, 16.2, 17));
      if (t > 8.2 && t < 17.4) colin.arms(Math.max(reach * 1.3, reading * 1.05), reading * 1.05, 0.02 - reading * 0.2, 0.02 - reading * 0.2);
      const taken = t > 8.7;
      envelope.visible = t < 9.4;
      if (taken) { envelope.position.copy(colin.hand('L')); envelope.rotation.set(0, colin.root.rotation.y, 0); } else at(envelope, 0.98, 1.15, -0.36, -0.3, 0.15, 0);
      letter.visible = t >= 9.4;
      const fall = ease(t, 16.2, 17.6);
      const tremble = Math.sin(clock * 21) * 0.004 * (1 - fall);
      letter.position.set(mix(0.6 + forward.x * 0.56, 1.25, fall) + Math.sin(fall * 9) * 0.18 * (1 - fall), mix(1.24 + tremble, 0.03, fall), mix(0.75 + forward.z * 0.56, 1.45, fall));
      letter.rotation.set(mix(0.6, Math.PI / 2, fall), 0.5, Math.sin(fall * 9) * 0.3 * (1 - fall));
      letter.rotation.order = 'YXZ';

      // The close shot is seen through his eyes, so his own head is taken out of the way.
      colin.neck.visible = t < 10 || t >= 16;
      const sit = ease(t, 19, 19.8);
      colin.sit(sit, 0.6);
      colin.upper.rotation.x += sit * 0.3 + ease(t, 16.4, 17.4) * 0.12;
      if (sit > 0) colin.arms(0.5 * sit, 0.5 * sit);

      // Outside, someone has followed him home.
      const peek = ease(t, 16.6, 17.6);
      at(duck.root, 2.4, mix(-0.2, 1.235, peek), -3.42);
      duck.flap(bump(t, 16.6, 17.6) * Math.abs(Math.sin(clock * 15)));
      duck.look(-0.5 * peek + Math.sin(clock * 0.8) * 0.1, 0.15 * peek);
      duck.blink(clock % 3.7 < 0.13);
    },
  };
};

/** III. Putting things in order: a list, worked through to its last line. */
export const orderScene = (): SceneDef => {
  const room = makeRoom({wall: '#d4c7ac', floor: '#b9a489', windows: [{x: 0.2, w: 1.9, sky: '#a3bab3'}]});
  const root = room.root;
  root.add(at(box(2.6, 0.03, 2.2, '#8b7f96', 0.01), -2.6, 0.015, 0.5), at(makeSofa('#bb8371'), -2.7, 0, -1.9));
  root.add(at(makeCounter(3.2), 0.2, 0, -2.62), at(box(0.9, 0.04, 0.5, '#aebdb6', 0.02), 0.2, 0.975, -2.6), at(cyl(0.02, 0.02, 0.3, '#9aaca4', 8), 0.2, 1.12, -2.85), at(cyl(0.02, 0.02, 0.2, '#9aaca4', 8), 0.2, 1.26, -2.76, Math.PI / 2));
  const plates = [0, 1, 2, 3, 4].map((i) => at(cyl(0.2, 0.14, 0.035, C.cream), 1.25, 0.99 + i * 0.04, -2.6));
  root.add(...plates, at(makeFrame(1.5, 0.5, C.cream), -2.7, 2.45, -2.97), ledge(0.2), at(makeNewspapers(), 0.85, 1.235, -3.42));
  const clocks = [0, 1, 2, 3].map((i) => {
    const c = makeClock(0.27);
    at(c.root, 2.05 + i * 0.62, 2.3, -2.94);
    root.add(c.root);
    return c;
  });
  root.add(at(box(2.7, 0.07, 0.2, C.brown), 3.0, 1.93, -2.9), at(makeLamp(), -4.0, 0, 1.6), warmLight(-4.0, 1.7, 1.8, 6));
  const broom = makeBroom();
  const dust = makePuffs(7, '#efe6d2', 0.07), bubbles = makePuffs(8, '#fbf6ea', 0.06);
  at(bubbles.root, 0.2, 1.05, -2.5);
  const colin = makePerson('colin');
  const note = at(box(0.2, 0.28, 0.01, C.cream, 0.004), 0, -0.56, 0.1, -0.9);
  colin.armL.add(note);
  const duck = makeDuck();
  root.add(broom, dust.root, bubbles.root, colin.root, duck.root);
  return {
    id: 'order', title: 'Putting things in order', numeral: 'III', lead: 2.4, dur: 16.4, overlay: 'list', ticks: [4.4, 9.2, 11.9],
    sky: ['#93a69b', '#55695f'],
    sun: {color: '#f4e8d0', intensity: 1.35, pos: [5, 8, 6]}, amb: {sky: '#ece0c8', ground: '#80705f', intensity: 1.05},
    hold: {at: 10.7, hint: 'Set the last clock', target: () => clocks[3].root.localToWorld(new THREE.Vector3(0, 0, 0))},
    shots: [
      {from: 0, p: [6.2, 4.4, 10.6], l: [-0.8, 1.25, -0.3], p2: [6.8, 4.5, 10.4], l2: [-0.4, 1.25, -0.3], fov: 26},
      {from: 4.6, p: [5.4, 3.6, 8.4], l: [0.5, 1.35, -1.4], p2: [5, 3.3, 7.6], fov: 24},
      {from: 9.4, p: [7.4, 3.4, 6.6], l: [2.9, 1.6, -2], p2: [7, 3.2, 6], fov: 22},
      {from: 12.2, p: [7.2, 3.6, 8.6], l: [2.6, 1.45, -1.2], p2: [6.4, 2.8, 6.4], l2: [3, 1.5, -1.6], fov: 22},
    ],
    root,
    update(t, clock) {
      colin.reset();
      colin.mood('sad');
      const moving = stroll(colin, t, [[0, -2.5, 0.9], [4.5, -2.5, 0.9], [5.5, 0.2, -1.75], [9.3, 0.2, -1.75], [10.2, 3.58, -2.1], [16, 3.58, -2.1]]);
      const sweep = Math.sin(clock * 5);
      const sweeping = t < 4.5, washing = t >= 5.5 && t < 9.3;
      if (sweeping) {
        colin.root.position.x += sweep * 0.12;
        colin.root.rotation.y = 0.5;
        colin.upper.rotation.x = 0.2;
        colin.arms(0.7 + sweep * 0.25, 0.9 + sweep * 0.25, 0.25, -0.25);
        colin.look(0, 0.3);
      }
      broom.visible = t < 4.7;
      at(broom, -2.5 + sweep * 0.45 + 0.35, 0, 1.75, -0.35 - sweep * 0.12, 0.5, 0);
      dust.root.position.set(-2.1 + sweep * 0.5, 0.05, 1.9);
      dust.set(sweeping ? 0.8 : 0, clock, 0.5, 0.6, 0.7);
      if (washing) {
        colin.root.rotation.y = Math.PI;
        colin.upper.rotation.x = 0.16;
        colin.arms(1.0 + Math.sin(clock * 7) * 0.2, 1.0 - Math.sin(clock * 7) * 0.2, -0.15, -0.15);
        colin.look(0, 0.25);
      }
      bubbles.set(washing ? 1 : 0, clock, 0.9, 0.5, 0.5);
      plates.forEach((p, i) => { p.visible = t > 6 + i * 0.7; });
      // The last of four clocks is wrong until he, or you, puts it right.
      const set = ease(t, 10.7, 11.7);
      clocks.forEach((c, i) => c.set(-1.05, i < 3 ? 0.9 : mix(4.2, 0.9 + Math.PI * 2, set)));
      const atClocks = t >= 10.2 && t < 12.2;
      if (atClocks) {
        colin.root.rotation.y = Math.PI;
        colin.arms(2.75 + Math.sin(clock * 9) * 0.06 * (set > 0 && set < 1 ? 1 : 0), 0, 0.02, 0.06);
        colin.look(0, -0.35);
      }
      // All done but one: he takes out the list.
      const turn = ease(t, 12.2, 13.2);
      note.visible = t > 12.6;
      if (t >= 12.2 && !moving) {
        colin.root.rotation.y = mix(Math.PI, 0.55, turn);
        colin.arms(ease(t, 12.6, 13.4) * 1.15, 0, -0.25, 0.06);
        colin.look(-0.25 * turn, ease(t, 13.2, 14) * 0.5);
        colin.upper.rotation.x = ease(t, 14, 15.5) * 0.1;
      }
      const peek = ease(t, 5.6, 6.6);
      at(duck.root, -0.2, mix(-0.2, 1.235, peek), -3.42);
      duck.flap(bump(t, 5.6, 6.6) * Math.abs(Math.sin(clock * 15)));
      duck.look(t > 10 ? 0.7 * ease(t, 9.6, 10.6) : Math.sin(clock * 0.9) * 0.2, 0.1);
      duck.blink(clock % 3.1 < 0.13);
    },
  };
};

/** IV. The kitchen: the last thing on the list, and an open window. */
export const kitchenScene = (): SceneDef => {
  const room = makeRoom({wall: '#c7d2bb', floor: '#b9a489', windows: [{x: 2.6, w: 1.8, sky: '#a9c2bb', open: true}]});
  const root = room.root;
  const oven = makeOven();
  root.add(at(makeCounter(2.3), -3.25, 0, -2.62), at(oven.root, -1.6, 0, -2.62), at(makeCounter(1.3), -0.45, 0, -2.62));
  root.add(at(box(2.3, 0.8, 0.4, '#d9d3be', 0.02), -3.25, 2.5, -2.78), at(box(1.3, 0.8, 0.4, '#d9d3be', 0.02), -0.45, 2.5, -2.78));
  root.add(at(cyl(0.16, 0.13, 0.26, C.coral), -3.6, 1.1, -2.6), at(cyl(0.11, 0.11, 0.34, C.ochre), -3.2, 1.14, -2.7), at(box(0.3, 0.2, 0.3, '#9aaca4', 0.05), -0.4, 1.07, -2.6));
  root.add(at(makeTable(2, 1.1), 2.4, 0, 0.1), at(makeChair(), 2.4, 0, -0.75), at(makeChair(), 3.7, 0, 0.1, 0, -Math.PI / 2), ledge(2.6));
  for (let i = 0; i < 5; i++) for (let j = 0; j < 3; j++) if ((i + j) % 2) root.add(at(box(1.8, 0.012, 2, '#ad9a80', 0.004), -3.6 + i * 1.8, 0.004, -2 + j * 2));
  const vase = makeVase();
  const puddle = at(cyl(0.75, 0.75, 0.012, mat('#a8c4bb', {rough: 0.2}), 36), 0.35, 0.012, 0.85);
  const stars = makeStars(), bonk = makeStars();
  const colin = makePerson('colin');
  const duck = makeDuck();
  root.add(vase, puddle, stars.root, bonk.root, colin.root, duck.root);
  return {
    id: 'kitchen', title: 'The kitchen', numeral: 'IV', lead: 2.4, dur: 13.6,
    sky: ['#8fa59c', '#53695f'],
    sun: {color: '#eef0dc', intensity: 1.3, pos: [5, 8, 6]}, amb: {sky: '#e2e6d2', ground: '#7d735f', intensity: 1.05},
    hold: {at: 6.2, hint: 'Tap the duck', target: () => duck.root.localToWorld(new THREE.Vector3(0, 0.5, 0))},
    shots: [
      {from: 0, p: [6.6, 4.4, 10.2], l: [0.2, 1.25, -0.5], p2: [5.6, 3.6, 8.6], l2: [0.2, 1.15, -0.9], fov: 26},
      {from: 6.2, p: [6.6, 4.4, 10.2], l: [0.4, 1.25, -0.5], p2: [6.9, 4.2, 10.4], fov: 26},
    ],
    root,
    update(t, clock) {
      colin.reset();
      const startled = t > 7.75;
      colin.mood(startled ? 'startled' : 'sad');
      const moving = stroll(colin, t, [[0, 3.6, 2.2], [2.6, -1.6, -1.45], [8.9, -1.6, -1.45], [10.1, 0.0, 0.75], [11, 0.3, 0.85]]);
      const kneel = ease(t, 2.7, 3.7) * (1 - ease(t, 8.1, 8.8));
      const lean = ease(t, 4.8, 5.9) * (1 - ease(t, 7.75, 7.95));
      oven.open(ease(t, 3.8, 4.7));
      if (!moving && t < 8.9) colin.root.rotation.y = mix(Math.PI, Math.PI / 2, ease(t, 8.3, 8.9));
      colin.kneel(kneel);
      colin.upper.rotation.x = lean * 0.95;
      if (t > 3.7 && t < 8.9) colin.arms(0.9 * kneel + lean * 0.3 + bump(t, 3.8, 4.7) * 0.4, 0.9 * kneel + lean * 0.3, 0.1, 0.1);
      if (t > 4.7 && t < 7.75) colin.look(0, 0.2);
      // Slipping in the spilled water: feet up, flat on his back.
      const slip = ease(t, 10.1, 10.75);
      colin.root.rotation.x = -slip * Math.PI / 2;
      colin.root.position.y += bump(t, 10.1, 10.75) * 0.5 + slip * 0.2;
      if (slip > 0) { colin.arms(2.4 * slip, 2.6 * slip, 0.5, 0.5); colin.legL.rotation.x = -bump(t, 10.1, 10.9) * 0.9; }
      bonk.root.position.set(-1.6, 1.25, -1.9);
      bonk.set(bump(t, 7.9, 8.7) * 0.7, clock);
      stars.root.position.set(-0.3, 0.75, -0.2);
      stars.set(ease(t, 10.75, 11.1), clock);

      // The duck comes in through the window and takes the vase with it.
      const arrive = ease(t, 3.6, 4.6), fly = ease(t, 6.2, 7.9);
      duck.root.position.set(mix(2.6, 2.85, fly), mix(mix(-0.2, 1.235, arrive), 1.0, fly) + Math.sin(fly * Math.PI) * 0.75, mix(-3.42, 0.25, fly));
      duck.root.rotation.set(-Math.sin(fly * Math.PI) * 0.25, mix(-0.75, -1.9, ease(t, 8, 9)), 0);
      const flying = fly > 0 && fly < 1;
      duck.flying(flying);
      duck.flap(flying ? 1.25 + Math.sin(clock * 22) * 0.55 : bump(t, 3.6, 4.6) * Math.abs(Math.sin(clock * 15)));
      duck.look(t < 6.2 ? -0.3 + Math.sin(clock * 1.1) * 0.15 : 0, t > 10.8 ? 0.5 : 0.1);
      duck.blink(clock % 2.9 < 0.13);
      const tip = ease(t, 7.55, 8.0), drop = between(t, 8.0, 8.45);
      vase.position.set(mix(2.0, 1.25, tip) - drop * 0.8, 1.0 - drop * drop * 0.86 + tip * 0.12 * (1 - drop), 0.15 + tip * 0.3 + drop * 0.4);
      vase.rotation.set(0, 0, tip * 1.5 + drop * 1.2);
      puddle.scale.setScalar(Math.max(0.001, ease(t, 8.45, 9.4)));
      puddle.scale.y = 1;
    },
  };
};
