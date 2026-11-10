import * as THREE from 'three';

type V3 = [number, number, number];
/** A camera set-up that starts at `from` seconds and drifts from p/l to p2/l2 until the next shot. */
export type Shot = {from: number; p: V3; l: V3; p2?: V3; l2?: V3; fov?: number};
export type Env = {sun: THREE.DirectionalLight; hemi: THREE.HemisphereLight; setSky(top: string, bottom: string): void};

export type SceneDef = {
  id: string;
  /** Chapter title for the intertitle card and the timeline. */
  title: string;
  numeral?: string;
  /** Seconds the intertitle card is held before the action starts. */
  lead: number;
  dur: number;
  sky: [string, string];
  sun: {color: string; intensity: number; pos: V3};
  amb: {sky: string; ground: string; intensity: number};
  rain?: number;
  shadow?: number;
  /** The story pauses here until the viewer taps the target. */
  hold?: {at: number; hint: string; target: () => THREE.Vector3};
  shots: Shot[];
  /** Alternative framing for tall screens. */
  portraitShots?: Shot[];
  fog?: [string, number, number];
  root: THREE.Group;
  /** Poses everything for scene time `t`. `clock` never pauses and drives idle motion. */
  update(t: number, clock: number, env: Env): void;
  loop?: boolean;
  major?: boolean;
  /** Which overlay accompanies the scene, if any. */
  overlay?: 'title' | 'end' | 'list';
  card?: 'paper';
  /** Scene times at which the to-do list items are ticked off. */
  ticks?: number[];
};

const a = new THREE.Vector3(), b = new THREE.Vector3();
export const cameraFor = (def: SceneDef, t: number, portrait = false) => {
  const shots = portrait && def.portraitShots ? def.portraitShots : def.shots;
  let i = 0;
  while (i + 1 < shots.length && shots[i + 1].from <= t) i++;
  const s = shots[i];
  const end = i + 1 < shots.length ? shots[i + 1].from : def.dur;
  const n = Math.min(1, Math.max(0, (t - s.from) / Math.max(0.001, end - s.from)));
  const k = n * n * (3 - 2 * n);
  a.fromArray(s.p);
  if (s.p2) a.lerp(b.fromArray(s.p2), k);
  const pos = a.clone();
  a.fromArray(s.l);
  if (s.l2) a.lerp(b.fromArray(s.l2), k);
  return {pos, look: a.clone(), fov: s.fov || 26, shot: i};
};
