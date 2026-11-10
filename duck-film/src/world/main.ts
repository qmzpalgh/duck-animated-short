import * as THREE from 'three';
import './world.css';
import {clamp, ease, hash} from './kit';
import {makeScore} from './score';
import {Env, cameraFor} from './stage';
import {buildStory} from './story';

const $ = <T extends HTMLElement>(id: string) => document.getElementById(id) as T;
const world = $('world'), canvas = $<HTMLCanvasElement>('view');
const curtain = $('curtain'), card = $('card'), title = $('title'), end = $('end'), list = $('list');
const hint = $<HTMLButtonElement>('hint'), tip = $('tip'), bar = $('bar'), track = $('track'), chapter = $('chapter');
const playButton = $<HTMLButtonElement>('play'), soundButton = $<HTMLButtonElement>('sound'), autoButton = $<HTMLButtonElement>('auto'), fullButton = $<HTMLButtonElement>('full');

const renderer = new THREE.WebGLRenderer({canvas, antialias: true, alpha: true});
renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.NeutralToneMapping;
renderer.toneMappingExposure = 1.05;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(26, 16 / 9, 0.1, 120);
const hemi = new THREE.HemisphereLight('#ffffff', '#444444', 1);
const sun = new THREE.DirectionalLight('#ffffff', 2);
sun.castShadow = true;
sun.shadow.mapSize.set(2048, 2048);
sun.shadow.bias = -0.0004;
sun.shadow.normalBias = 0.06;
sun.shadow.radius = 5;
scene.add(hemi, sun, sun.target);

// Rain is shared by every scene that asks for it.
const DROPS = 900;
const rain = new THREE.InstancedMesh(new THREE.BoxGeometry(0.008, 0.36, 0.008), new THREE.MeshBasicMaterial({color: '#e6f1e8', transparent: true, opacity: 0.3, depthWrite: false}), DROPS);
rain.frustumCulled = false;
scene.add(rain);
const dummy = new THREE.Object3D();
const setRain = (amount: number, clock: number, cx: number, cz: number) => {
  rain.visible = amount > 0;
  if (!rain.visible) return;
  rain.count = Math.round(DROPS * Math.min(1, amount));
  for (let i = 0; i < rain.count; i++) {
    const y = 11 - ((clock * (9 + hash(i) * 4) + hash(i + 0.5) * 11) % 11);
    dummy.position.set(cx + (hash(i * 1.7) - 0.5) * 34 - y * 0.16, y, cz + (hash(i * 2.3) - 0.5) * 20);
    dummy.rotation.set(0, 0, -0.16);
    dummy.updateMatrix();
    rain.setMatrixAt(i, dummy.matrix);
  }
  rain.instanceMatrix.needsUpdate = true;
};

const story = buildStory();
story.forEach((def) => { def.root.visible = false; scene.add(def.root); });
const first = 1, last = story.length - 1;

const env: Env = {
  sun, hemi,
  setSky(top, bottom) {
    world.style.setProperty('--sky-a', top);
    world.style.setProperty('--sky-b', bottom);
  },
};

// Playback state. `time` runs over the intertitle lead and then the scene itself.
let index = 0, time = 0, playing = true, released = false, holding = false, holdFor = 0, auto = false, soundOn = false;
let clock = 0, lastFrame = performance.now(), idleFor = 0, speed = 1;
const score = makeScore(() => !!story[index].major);

const icon = (d: string) => `<svg viewBox="0 0 16 16" aria-hidden="true"><path d="${d}"/></svg>`;
const ICONS = {
  play: icon('M4.5 2.8v10.4L13 8z'), pause: icon('M5 3v10M11 3v10'),
  sound: icon('M2.5 6.2v3.6h2.4L8.4 13V3L4.9 6.2zM11 5.8q1.6 2.2 0 4.4M12.9 4q3 4 0 8'),
  mute: icon('M2.5 6.2v3.6h2.4L8.4 13V3L4.9 6.2zM11 6l3.4 4M14.4 6L11 10'),
  full: icon('M2.5 6V2.5H6M10 2.5h3.5V6M13.5 10v3.5H10M6 13.5H2.5V10'),
};
fullButton.innerHTML = ICONS.full;

const segments = story.slice(first, last).map((def, i) => {
  const b = document.createElement('button');
  b.type = 'button';
  b.style.flex = String(def.lead + def.dur);
  b.title = def.title;
  b.setAttribute('aria-label', `${def.numeral ? def.numeral + '. ' : ''}${def.title}`);
  b.addEventListener('click', () => { goTo(first + i); setPlaying(true); });
  track.appendChild(b);
  return b;
});

const setPlaying = (value: boolean) => {
  playing = value;
  playButton.innerHTML = playing ? ICONS.pause : ICONS.play;
  playButton.setAttribute('aria-label', playing ? 'Pause' : 'Play');
  score.setPlaying(playing);
};
const setSound = (value: boolean) => {
  soundOn = value;
  score.setOn(value);
  soundButton.innerHTML = value ? ICONS.sound : ICONS.mute;
  [soundButton, $('opt-sound')].forEach((b) => b.setAttribute('aria-pressed', String(value)));
};
const setAuto = (value: boolean) => {
  auto = value;
  [autoButton, $('opt-auto')].forEach((b) => b.setAttribute('aria-pressed', String(value)));
};

function goTo(i: number, at = 0) {
  story[index].root.visible = false;
  index = clamp(i, 0, last);
  const def = story[index];
  def.root.visible = true;
  time = at;
  released = false;
  holding = false;
  holdFor = 0;
  env.setSky(def.sky[0], def.sky[1]);
  scene.fog = def.fog ? new THREE.Fog(def.fog[0], def.fog[1], def.fog[2]) : null;
  const size = def.shadow || 9;
  const sc = sun.shadow.camera;
  sc.left = -size; sc.right = size; sc.top = size; sc.bottom = -size; sc.near = 0.5; sc.far = 60;
  sc.updateProjectionMatrix();
  card.querySelector('.numeral')!.textContent = def.numeral ? `Part ${def.numeral}` : 'Meanwhile';
  card.querySelector('.name')!.textContent = def.title;
  (card.querySelector('.clip') as HTMLElement).hidden = def.card !== 'paper';
  title.classList.toggle('fade', def.overlay !== 'title');
  end.hidden = def.overlay !== 'end';
  list.hidden = def.overlay !== 'list';
  bar.hidden = index === 0;
  chapter.textContent = def.numeral ? `${def.numeral} · ${def.title}` : def.title;
  yaw = pitch = 0;
}

const release = () => {
  if (!holding) return;
  released = true;
  holding = false;
  hint.hidden = true;
  setPlaying(true);
};

// Dragging turns the set a little; it settles back when left alone.
let yaw = 0, pitch = 0, dragging = false, dragX = 0, dragY = 0, restFor = 9;
canvas.addEventListener('pointerdown', (e) => { dragging = true; dragX = e.clientX; dragY = e.clientY; canvas.setPointerCapture(e.pointerId); });
canvas.addEventListener('pointermove', (e) => {
  if (!dragging) return;
  yaw = clamp(yaw - (e.clientX - dragX) * 0.005, -0.6, 0.6);
  pitch = clamp(pitch + (e.clientY - dragY) * 0.004, -0.22, 0.3);
  dragX = e.clientX; dragY = e.clientY; restFor = 0;
});
const endDrag = () => { dragging = false; };
canvas.addEventListener('pointerup', endDrag);
canvas.addEventListener('pointercancel', endDrag);
world.addEventListener('pointermove', () => { idleFor = 0; });

$('begin').addEventListener('click', () => { goTo(first); setPlaying(true); tip.hidden = false; });
$('replay').addEventListener('click', () => { goTo(first); setPlaying(true); });
$('opt-sound').addEventListener('click', () => setSound(!soundOn));
$('opt-auto').addEventListener('click', () => setAuto(!auto));
soundButton.addEventListener('click', () => setSound(!soundOn));
autoButton.addEventListener('click', () => setAuto(!auto));
playButton.addEventListener('click', () => setPlaying(!playing));
hint.addEventListener('click', release);
fullButton.addEventListener('click', () => {
  if (document.fullscreenElement) document.exitFullscreen().catch(() => undefined);
  else if (world.requestFullscreen) world.requestFullscreen().catch(() => undefined);
});
window.addEventListener('keydown', (e) => {
  if (e.target instanceof HTMLButtonElement && (e.key === ' ' || e.key === 'Enter')) return;
  if (index === 0) return;
  if (e.key === ' ' || e.key === 'Enter') { e.preventDefault(); if (holding) release(); else setPlaying(!playing); }
  if (e.key === 'ArrowRight' && index < last) { goTo(index + 1); setPlaying(true); }
  if (e.key === 'ArrowLeft') { goTo(Math.max(first, time > 4 ? index : index - 1)); setPlaying(true); }
});

const spherical = new THREE.Spherical(), offset = new THREE.Vector3(), projected = new THREE.Vector3();
const frame = (now: number) => {
  const dt = Math.min(0.05, (now - lastFrame) / 1000);
  lastFrame = now;
  clock += dt;
  const def = story[index];
  if (playing) time += dt * speed;
  const holdAt = def.hold ? def.lead + def.hold.at : Infinity;
  if (def.hold && !released && time >= holdAt) {
    time = holdAt;
    holding = true;
    holdFor += dt;
    if (auto && holdFor > 2.2) release();
  }
  if (!def.loop && time >= def.lead + def.dur) { goTo(index + 1); requestAnimationFrame(frame); return; }
  const t = Math.max(0, time - def.lead);

  sun.color.set(def.sun.color);
  sun.intensity = def.sun.intensity * 1.9;
  hemi.color.set(def.amb.sky);
  hemi.groundColor.set(def.amb.ground);
  hemi.intensity = def.amb.intensity * 2;
  def.update(t, clock, env);

  const w = world.clientWidth, h = world.clientHeight;
  if (canvas.width !== Math.round(w * renderer.getPixelRatio()) || canvas.height !== Math.round(h * renderer.getPixelRatio())) renderer.setSize(w, h, false);
  const aspect = w / Math.max(1, h);
  const cam = cameraFor(def, t, aspect < 0.9);
  // Shots are framed for 16:9; narrower screens widen the lens to keep the same width in view.
  const widen = Math.min(2.3, Math.max(1, (16 / 9) / aspect));
  camera.fov = THREE.MathUtils.radToDeg(2 * Math.atan(Math.tan(THREE.MathUtils.degToRad(cam.fov) / 2) * (def.portraitShots && aspect < 0.9 ? 1.5 : widen)));
  camera.aspect = aspect;
  restFor += dt;
  if (!dragging && restFor > 1.6) { yaw *= Math.exp(-dt * 1.4); pitch *= Math.exp(-dt * 1.4); }
  offset.copy(cam.pos).sub(cam.look);
  spherical.setFromVector3(offset);
  spherical.theta += yaw + Math.sin(clock * 0.23) * 0.012;
  spherical.phi = clamp(spherical.phi - pitch, 0.25, 1.52);
  camera.position.setFromSpherical(spherical).add(cam.look);
  camera.lookAt(cam.look);
  camera.updateProjectionMatrix();

  sun.target.position.set(cam.look.x, 0, cam.look.z);
  sun.position.set(cam.look.x + def.sun.pos[0], def.sun.pos[1], cam.look.z + def.sun.pos[2]);
  setRain(def.rain || 0, clock, cam.look.x, cam.look.z);

  // Intertitle card and the fades between chapters.
  let dark = def.lead > 0 ? 1 - ease(time, def.lead - 0.5, def.lead + 0.5) : 1 - ease(time, 0, 0.9);
  if (!def.loop) dark = Math.max(dark, ease(time, def.lead + def.dur - 0.7, def.lead + def.dur));
  curtain.style.opacity = dark.toFixed(3);
  card.style.opacity = def.lead > 0 ? (ease(time, 0.1, 0.6) * (1 - ease(time, def.lead - 0.9, def.lead - 0.4))).toFixed(3) : '0';
  if (def.overlay === 'list' && def.ticks) {
    list.style.opacity = dark > 0.5 ? '0' : '1';
    const items = list.querySelectorAll('li');
    def.ticks.forEach((at, i) => items[i].classList.toggle('done', t >= at));
    items[3].classList.toggle('last', t >= def.ticks[2] + 1);
  }

  if (holding && def.hold) {
    projected.copy(def.hold.target()).project(camera);
    hint.hidden = false;
    hint.querySelector('.what')!.textContent = def.hold.hint;
    hint.style.transform = `translate(${clamp((projected.x + 1) / 2 * w, 50, w - 50)}px, ${clamp((1 - projected.y) / 2 * h, 50, h - 110)}px)`;
  } else hint.hidden = true;

  idleFor += dt;
  bar.classList.toggle('idle', idleFor > 3 && playing && !holding);
  segments.forEach((b, i) => {
    const d = story[first + i];
    const fill = index > first + i ? 1 : index === first + i ? clamp(time / (d.lead + d.dur)) : 0;
    b.style.setProperty('--fill', `${(fill * 100).toFixed(1)}%`);
  });
  renderer.render(scene, camera);
  requestAnimationFrame(frame);
};

// ?s=3&t=5 opens a chapter at a time, paused, and ?speed=4 plays faster: used when checking shots.
const query = new URLSearchParams(window.location.search);
speed = Number(query.get('speed') || 1);
setSound(false);
setAuto(query.has('auto'));
setPlaying(true);
goTo(Number(query.get('s') || 0));
if (query.has('t')) { time = story[index].lead + Number(query.get('t')); released = query.has('r'); playing = false; }
requestAnimationFrame(frame);
