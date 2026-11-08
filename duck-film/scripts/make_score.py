"""Synthesize the original music-box waltz. Run with numpy and ffmpeg installed."""
import math
import os
import subprocess
import tempfile
import wave

import numpy as np

RATE = 24000
LENGTH = 144
BEAT = 60 / 96
samples = np.zeros(RATE * LENGTH, dtype=np.float32)


def note(start, midi, duration, volume):
    first = int(start * RATE)
    count = min(int(duration * RATE), len(samples) - first)
    if count <= 0:
        return
    x = np.arange(count, dtype=np.float32) / RATE
    frequency = 440 * 2 ** ((midi - 69) / 12)
    attack = np.minimum(1, x / .018)
    envelope = attack * np.exp(-x * 3.1) * np.minimum(1, (duration - x) * 8)
    tone = (np.sin(2 * math.pi * frequency * x)
            + .31 * np.sin(2 * math.pi * frequency * 2 * x) * np.exp(-x * 2)
            + .12 * np.sin(2 * math.pi * frequency * 3 * x) * np.exp(-x * 4))
    samples[first:first + count] += tone * envelope * volume


# The first half is tentative; the final section changes to a warmer key.
minor = [(50, 53, 57), (46, 50, 53), (48, 52, 55), (45, 49, 52)]
major = [(53, 57, 60), (48, 52, 55), (50, 53, 57), (55, 59, 62)]
melody = [(0, 2, 1), (2, 1, 0), (1, 2, 0), (2, 0, 1)]
for bar in range(math.ceil(LENGTH / (BEAT * 3))):
    start = bar * BEAT * 3
    chord = (major if start >= 115 else minor)[bar % 4]
    level = .72 if 56 <= start < 115 else 1
    note(start, chord[0] - 12, 1.3, .32 * level)
    for beat in (1, 2):
        for pitch in chord:
            note(start + beat * BEAT, pitch, .75, .082 * level)
    if bar % 4 != 3:
        for beat, index in enumerate(melody[bar % 4]):
            if (bar + beat) % 5 != 0:
                note(start + beat * BEAT + .12, chord[index] + 12, .7, .12 * level)

fade = np.minimum(np.arange(len(samples)) / (RATE * 2), 1)
fade *= np.minimum((len(samples) - np.arange(len(samples))) / (RATE * 3), 1)
samples *= fade.astype(np.float32)
samples *= .76 / max(.001, np.max(np.abs(samples)))
pcm = (samples * 32767).astype('<i2')
os.makedirs('out', exist_ok=True)
with tempfile.TemporaryDirectory(dir='out') as directory:
    wav = os.path.join(directory, 'score.wav')
    with wave.open(wav, 'wb') as output:
        output.setnchannels(1)
        output.setsampwidth(2)
        output.setframerate(RATE)
        output.writeframes(pcm.tobytes())
    subprocess.run(['ffmpeg', '-y', '-loglevel', 'error', '-i', wav, '-codec:a', 'libmp3lame', '-b:a', '112k', 'public/score.mp3'], check=True)
