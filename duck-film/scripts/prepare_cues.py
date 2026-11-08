"""Normalize local WAV cues for the mix without modifying the supplied files."""
from array import array
from pathlib import Path
import sys
import wave

source = Path('public/private-cues')
destination = source / 'normalized'
destination.mkdir(parents=True, exist_ok=True)
files = sorted(source.glob('*.wav'))
if len(files) != 17:
    raise SystemExit(f'Expected 17 WAV cues in {source}, found {len(files)}')

for path in files:
    with wave.open(str(path), 'rb') as reader:
        params = reader.getparams()
        if params.sampwidth != 2 or params.comptype != 'NONE':
            raise SystemExit(f'Expected uncompressed 16-bit WAV: {path}')
        samples = array('h', reader.readframes(reader.getnframes()))
    if sys.byteorder != 'little':
        samples.byteswap()
    peak = max(abs(value) for value in samples) or 1
    gain = 0.7 * 32767 / peak
    normalized = array('h', (round(value * gain) for value in samples))
    if sys.byteorder != 'little':
        normalized.byteswap()
    with wave.open(str(destination / path.name), 'wb') as writer:
        writer.setparams(params)
        writer.writeframes(normalized.tobytes())
    print(path.name)
