// The film's music-box waltz, played live so it can follow the viewer's pace.
// It is the same progression the 2D film's score was generated from.
const BEAT = 60 / 96;
const MINOR = [[50, 53, 57], [46, 50, 53], [48, 52, 55], [45, 49, 52]];
const MAJOR = [[53, 57, 60], [48, 52, 55], [50, 53, 57], [55, 59, 62]];
const MELODY = [[0, 2, 1], [2, 1, 0], [1, 2, 0], [2, 0, 1]];

export const makeScore = (isMajor: () => boolean) => {
  let ctx: AudioContext | null = null;
  let master: GainNode | null = null;
  let on = false, playing = false, bar = 0, nextBar = 0;

  const note = (start: number, midi: number, duration: number, volume: number) => {
    if (!ctx || !master) return;
    const frequency = 440 * Math.pow(2, (midi - 69) / 12);
    [[1, 1, 3.1], [2, 0.31, 5.1], [3, 0.12, 7.1]].forEach(([multiple, level, decay]) => {
      const osc = ctx!.createOscillator(), gain = ctx!.createGain();
      osc.frequency.value = frequency * multiple;
      gain.gain.setValueAtTime(0, start);
      gain.gain.linearRampToValueAtTime(volume * level, start + 0.018);
      gain.gain.setTargetAtTime(0, start + 0.018, 1 / decay);
      osc.connect(gain).connect(master!);
      osc.start(start);
      osc.stop(start + duration + 1.2);
    });
  };

  const schedule = () => {
    if (!ctx || !on || !playing) return;
    while (nextBar < ctx.currentTime + 0.5) {
      const start = Math.max(nextBar, ctx.currentTime + 0.05);
      const chord = (isMajor() ? MAJOR : MINOR)[bar % 4];
      note(start, chord[0] - 12, 1.3, 0.3);
      [1, 2].forEach((beat) => chord.forEach((pitch) => note(start + beat * BEAT, pitch, 0.75, 0.08)));
      if (bar % 4 !== 3) MELODY[bar % 4].forEach((index, beat) => {
        if ((bar + beat) % 5 !== 0) note(start + beat * BEAT + 0.12, chord[index] + 12, 0.7, 0.12);
      });
      bar++;
      nextBar = start + BEAT * 3;
    }
  };
  window.setInterval(schedule, 120);

  const level = () => {
    if (!ctx || !master) return;
    master.gain.setTargetAtTime(on && playing ? 0.5 : 0, ctx.currentTime, 0.25);
  };
  return {
    /** Must be called from a click: browsers only start audio on a gesture. */
    setOn(value: boolean) {
      on = value;
      if (on && !ctx) {
        const AC = window.AudioContext || (window as unknown as {webkitAudioContext: typeof AudioContext}).webkitAudioContext;
        if (!AC) return;
        ctx = new AC();
        master = ctx.createGain();
        master.gain.value = 0;
        // A short echo gives the dry tones some room.
        const delay = ctx.createDelay(), feedback = ctx.createGain();
        delay.delayTime.value = 0.31;
        feedback.gain.value = 0.22;
        master.connect(ctx.destination);
        master.connect(delay).connect(feedback).connect(delay);
        feedback.connect(ctx.destination);
      }
      if (ctx && on) ctx.resume().catch(() => undefined);
      level();
    },
    setPlaying(value: boolean) { playing = value; level(); },
  };
};
