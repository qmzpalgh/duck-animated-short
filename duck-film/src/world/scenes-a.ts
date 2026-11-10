import * as THREE from 'three';
import {C, at, ball, box, bump, cyl, ease, between, group, hash, mat, mix} from './kit';
import {makeCar, makeDuck, makeFox} from './characters';
import {makeCloud, makeReeds, makeTree} from './props';
import {SceneDef} from './stage';

/** Title: the duck alone on its pond before the story begins. */
export const titleScene = (): SceneDef => {
  const root = new THREE.Group();
  root.add(at(cyl(5.2, 5.5, 0.6, '#3f6660', 48), 0, -0.3, 0));
  root.add(at(cyl(2.5, 2.5, 0.04, mat('#6f9d98', {rough: 0.25}), 48), -1.2, 0.012, 0.9));
  root.add(at(makeReeds(26, 2.6, 1), 2.4, 0, -1.5), at(makeReeds(16, 1.8, 40), -3.3, 0, -1.6), at(makeReeds(10, 1.4, 80), 3.4, 0, 1.9));
  root.add(at(makeTree(3.2, '#4a6f62'), -2.2, 0, -3.2), at(makeTree(2.3, '#557a69'), 0.2, 0, -3.9));
  [[1.2, 2.6], [-0.4, -2.3], [3.2, 0.2]].forEach(([x, z], i) => root.add(at(ball(0.3 + i * 0.07, '#5c7f75', 1.3, 0.6, 1), x, 0.08, z)));
  const moon = new THREE.Mesh(new THREE.CircleGeometry(2.6, 48), new THREE.MeshBasicMaterial({color: '#6c9690', transparent: true, opacity: 0.35}));
  root.add(at(moon, 1.5, 3.6, -9));
  const duck = makeDuck();
  root.add(duck.root);
  return {
    id: 'title', title: 'Duck', lead: 0, dur: 60, loop: true, overlay: 'title',
    sky: ['#2f5553', '#1b3231'], fog: ['#264644', 12, 30],
    sun: {color: '#cfe5d8', intensity: 1.5, pos: [-4, 7, 5]}, amb: {sky: '#7fa9a3', ground: '#2a4443', intensity: 1.0},
    shots: [{from: 0, p: [3.4, 2.1, 10.5], l: [-2.2, 1.5, 0], p2: [5, 2.3, 9.8], l2: [-2.2, 1.5, 0], fov: 30}],
    portraitShots: [{from: 0, p: [0.6, 3.4, 12.5], l: [0.3, -1.4, 0], p2: [1.6, 3.6, 12.2], l2: [0.3, -1.4, 0], fov: 30}],
    root,
    update(_t, clock) {
      // The duck paces a slow figure on the bank and now and then looks up.
      const a = clock * 0.32;
      const x = 0.8 + Math.cos(a) * 1.3, z = 0.9 + Math.sin(a * 2) * 0.55;
      const dx = -Math.sin(a) * 1.3, dz = Math.cos(a * 2) * 1.1;
      duck.root.position.set(x, 0, z);
      duck.root.rotation.y = Math.atan2(dx, dz);
      duck.waddle(clock * 7);
      duck.look(Math.sin(clock * 0.7) * 0.5, 0);
      duck.blink(clock % 3.4 < 0.14);
      duck.flap(0);
    },
  };
};

/** I. The road: Colin drives home in the rain with what is left of his job on the roof. */
export const roadScene = (): SceneDef => {
  const root = new THREE.Group();
  root.add(at(box(60, 0.6, 22, '#6f8a7f', 0.1), 0, -0.3, -1));
  root.add(at(box(60, 0.05, 3.6, '#5d6c69', 0.01), 0, 0.01, 0));
  for (let i = -14; i <= 14; i++) root.add(at(box(0.9, 0.02, 0.12, C.cream, 0.005), i * 2.1, 0.04, 0));
  [[-9, -10, 7], [1, -11.5, 9], [12, -10, 6.5], [-20, -11, 8], [22, -11.5, 8]].forEach(([x, z, r], i) => root.add(at(ball(r, i % 2 ? '#7d9889' : '#6c8a7c', 1.5, 0.42, 1), x, -0.6, z)));
  for (let i = 0; i < 14; i++) root.add(at(makeTree(2 + hash(i) * 2.2, i % 2 ? '#5d7f6b' : '#52756a'), -20 + i * 3.1 + hash(i + 3) * 1.4, 0, -3.6 - hash(i + 6) * 3.2));
  for (let i = -12; i <= 12; i++) root.add(at(box(0.09, 0.7, 0.09, C.brown, 0.02), i * 1.9, 0.35, -2.4));
  root.add(at(box(48, 0.06, 0.05, C.brown, 0.02), 0, 0.55, -2.4));
  root.add(at(cyl(2.4, 2.4, 0.03, mat('#7fa5a0', {rough: 0.25}), 40), 6.2, 0.012, 5.4));
  root.add(at(makeReeds(34, 2.8, 5), 5.4, 0, 3.6), at(makeReeds(14, 1.6, 70), 2.2, 0, 4.4), at(makeReeds(18, 2, 30), 8.6, 0, 4.1), at(makeReeds(12, 1.6, 55), -6, 0, 3.4));
  for (let i = 0; i < 9; i++) root.add(at(ball(0.2 + hash(i) * 0.2, '#62807a', 1.3, 0.6, 1), -14 + i * 3.4, 0.05, 2.5 + hash(i + 2) * 2.5));
  const car = makeCar();
  car.root.rotation.y = Math.PI / 2;
  const fox = makeFox();
  const duck = makeDuck();
  root.add(car.root, fox.root, duck.root);
  return {
    id: 'road', title: 'The road', numeral: 'I', lead: 3.6, dur: 18.6, card: 'paper', rain: 1, shadow: 15,
    sky: ['#8aa5a1', '#5a7572'], fog: ['#7b9793', 16, 42],
    sun: {color: '#dfe9e0', intensity: 1.5, pos: [-5, 9, 6]}, amb: {sky: '#b9cfc9', ground: '#55706b', intensity: 1.25},
    hold: {at: 13.6, hint: 'Tap the duck', target: () => duck.root.localToWorld(new THREE.Vector3(0, 0.6, 0))},
    shots: [
      {from: 0, p: [-9, 3.2, 11.5], l: [-7.5, 1, 0], p2: [-0.5, 2.9, 11.5], l2: [0.2, 1, 0], fov: 27},
      {from: 5, p: [5.6, 1.5, 2.6], l: [-1.2, 1.5, -0.3], p2: [5, 1.45, 2.3], fov: 24},
      {from: 7.6, p: [2.6, 0.85, 0.2], l: [4.9, 0.62, 2.6], p2: [2.9, 0.8, 0.4], fov: 20},
      {from: 10.2, p: [1.5, 3.6, 13], l: [3, 1, 0.5], p2: [5.5, 3, 12.5], l2: [7, 0.8, 1], fov: 27},
    ],
    root,
    update(t, clock) {
      // Steady driving, a hard stop for the fox, then away again.
      const brake = between(t, 3.9, 4.6);
      const leave = between(t, 10.6, 13.4);
      const x = -13 + 2.7 * Math.min(t, 3.9) + 1.27 * (1 - (1 - brake) * (1 - brake)) + 22 * leave * leave;
      car.root.position.set(x, 0, -0.35);
      car.roll(x);
      car.wipe(clock);
      car.body.rotation.x = bump(t, 3.9, 5) * 0.07 - bump(t, 10.6, 11.6) * 0.03;
      car.body.position.y = Math.sin(clock * 30) * 0.006 * (t < 3.9 || t > 10.6 ? 1 : 0.3);
      car.balloon.rotation.x = -0.5 * (t < 3.9 ? 1 : 0) + bump(t, 3.9, 5.2) * 0.9 - leave * 0.6 + Math.sin(clock * 3) * 0.06;
      car.colin.mood(t > 4 && t < 5.6 ? 'startled' : 'sad');
      car.colin.look(0, t > 5.6 ? ease(t, 5.6, 7) * 0.25 : 0);
      // The fox crosses, stops in the headlights, and goes on its way.
      const cross = ease(t, 3, 4.3), off = ease(t, 6.2, 7.5);
      fox.root.position.set(1.4 + off * 0.8, 0, mix(-6, 0.3, cross) + off * 7);
      fox.root.rotation.y = 0;
      fox.run(clock * 16, t < 4.3 || t > 6.2 ? 1 : 0);
      fox.head.rotation.y = -1.3 * ease(t, 4.3, 4.8) * (1 - ease(t, 5.9, 6.3));
      fox.root.visible = t < 7.6;
      // The duck has seen all of it from the reeds.
      const rise = ease(t, 7.9, 8.7);
      const hop = between(t, 13.6, 15), go = between(t, 15, 18.4);
      const dx = mix(4.9, 6.2, hop) + go * 6.5, dz = mix(2.6, 0.7, hop);
      duck.root.position.set(dx, mix(-0.55, 0, Math.max(rise, 0)) + bump(t, 13.6, 14.3) * 0.5, dz);
      duck.root.rotation.y = t < 13.6 ? mix(-2.1, -0.2, ease(t, 10.8, 13.2)) : mix(2.6, Math.PI / 2, ease(t, 14.4, 15.4));
      duck.waddle(clock * 9, t > 14.3 ? 1 : 0);
      duck.flap(bump(t, 13.6, 14.4) * 1.3 * Math.abs(Math.sin(clock * 16)));
      duck.look(t < 10 ? Math.sin(clock * 0.9) * 0.25 : 0, 0);
      duck.blink((t > 9.3 && t < 9.5) || clock % 4 < 0.12);
    },
  };
};

/** The end: the duck flies off into a clearing sky. */
export const endScene = (): SceneDef => {
  const root = new THREE.Group();
  const clouds = Array.from({length: 9}, (_, i) => {
    const c = makeCloud(i * 11);
    c.scale.setScalar(0.8 + hash(i) * 1.1);
    root.add(c);
    return c;
  });
  const sun = new THREE.Mesh(new THREE.CircleGeometry(2.2, 48), new THREE.MeshBasicMaterial({color: '#f6dba3', transparent: true, opacity: 0.55}));
  root.add(at(sun, 3.5, 4.4, -12));
  const duck = makeDuck();
  root.add(group(duck.root));
  return {
    id: 'end', title: 'The end', lead: 0, dur: 60, loop: true, overlay: 'end', major: true,
    sky: ['#e7c59a', '#7fa9a0'], fog: ['#c9c2a2', 14, 34],
    sun: {color: '#ffe6bd', intensity: 2.2, pos: [5, 8, 4]}, amb: {sky: '#f7e2c0', ground: '#7fa39a', intensity: 1.3},
    shots: [{from: 0, p: [-1.5, 3.2, 9], l: [0, 2.3, 0], p2: [1.5, 3.4, 9], l2: [0, 2.3, 0], fov: 30}],
    root,
    update(_t, clock) {
      clouds.forEach((c, i) => {
        const span = 30, speed = 0.7 + hash(i + 2) * 0.6;
        c.position.set(span / 2 - ((clock * speed + hash(i) * span) % span), -1.6 + hash(i + 5) * 2.6 - (i % 3) * 0.5, -6 + hash(i + 7) * 5 + (i % 4 === 0 ? 4.5 : 0));
      });
      duck.root.position.set(Math.sin(clock * 0.31) * 0.9, 0.55 + Math.sin(clock * 1.3) * 0.22, 0);
      duck.root.rotation.set(-0.12 + Math.cos(clock * 1.3) * 0.08, Math.PI / 2 - 0.35, 0);
      duck.inner.rotation.z = 0;
      duck.flying(true);
      duck.flap(1.25 + Math.sin(clock * 11) * 0.55);
      duck.look(0, -0.5);
      duck.blink(clock % 5 < 0.12);
    },
  };
};
