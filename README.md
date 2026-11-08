# Duck

A 2D animated short built with Remotion, using code-drawn puppets and backgrounds. The public preview uses a blank letter and a generated score. The supplied screenplay and voice recordings are not included in this repository.

[Watch the public preview](https://qmzpalgh.github.io/duck-animated-short/)

## Preview and edit

With Node.js 20.19+, 22.13+ or 24+:

```sh
cd duck-film
npm ci
npm run dev
```

In Remotion Studio, `Public-Preview` works without any private files. The full `Duck-Silent` and `Duck-Lily` compositions use local production materials in `duck-film/public/private-cues/`. Put the four Lily WAV files from the supplied cue archive there and add `letter.json`, an array of seven strings containing the letter lines. Those files, the source screenplay and rendered videos are ignored by Git.

```sh
npx remotion render Duck-Silent out/duck-silent.mp4
npx remotion render Duck-Lily out/duck-lily.mp4
```

The Lily cut adds the four local letter recordings; the silent cut has no spoken dialogue. Both have the original, synthesized score. Its generator is `duck-film/scripts/make_score.py` and requires Python, NumPy and FFmpeg only when regenerating the score.

`npm run preview:build` produces the public player. Its Vite configuration copies only the generated score, never the private asset directory. GitHub Pages is deployed by the workflow in `.github/workflows/pages.yml`.
