#!/usr/bin/env bash
set -euo pipefail

mkdir -p out/earlier dist/downloads
git archive 2cb0979 src | tar -x -C out/earlier

# Both renders use the local letter, which is supplied only during the build.
npx remotion render out/earlier/src/index.ts Duck-Silent dist/downloads/01-original-silent.mp4 --codec=h264 --crf=20 --concurrency=2 --log=error
npx remotion render src/index.ts Duck-Silent dist/downloads/04-storyboard-silent.mp4 --codec=h264 --crf=20 --concurrency=2 --log=error

add_audio() {
  ffmpeg -v error -y -i "$1" -i "$2" -map 0:v:0 -map 1:a:0 -c copy -movflags +faststart -shortest "$3"
}
add_audio dist/downloads/01-original-silent.mp4 out/lily-only.m4a dist/downloads/02-original-lily-voiceover.mp4
add_audio dist/downloads/01-original-silent.mp4 dist/voiceover.m4a dist/downloads/03-original-all-cues.mp4
add_audio dist/downloads/04-storyboard-silent.mp4 dist/voiceover.m4a dist/downloads/05-storyboard-all-cues.mp4

python3 - <<'PY'
from pathlib import Path
from zipfile import ZipFile, ZIP_STORED
folder = Path('dist/downloads')
with ZipFile(folder / 'duck-all-versions.zip', 'w', ZIP_STORED) as bundle:
    for video in sorted(folder.glob('*.mp4')):
        bundle.write(video, video.name)
PY
