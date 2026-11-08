import React from 'react';
import {createRoot} from 'react-dom/client';
import {Player} from '@remotion/player';
import {Film, FPS, TOTAL_SECONDS} from './Film';
import './preview.css';

const base = new URL('.', window.location.href).pathname;

createRoot(document.getElementById('root')!).render(<React.StrictMode>
  <main>
    <header><span className="mark">D.</span><span>AN ANIMATED SHORT</span><span className="runtime">2 MIN 24 SEC</span></header>
    <div className="intro"><p className="eyebrow">A SMALL STORY ABOUT LOOKING OUT FOR SOMEONE</p><h1>Duck<span>.</span></h1><p>A quiet, darkly comic tale told with paper-cut puppets and a very determined duck.</p></div>
    <div className="screen"><Player component={Film} inputProps={{includePrivate:false, voiceover:false, assetBase:base}} durationInFrames={TOTAL_SECONDS*FPS} fps={FPS} compositionWidth={1280} compositionHeight={720} controls style={{width:'100%', aspectRatio:'16 / 9'}}/></div>
    <div className="caption"><span>THE PUBLIC PREVIEW</span><p>The preview uses a blank letter and the original generated score. The supplied screenplay and voice recordings are kept private.</p></div>
    <footer><span>Based on the screenplay by Damian Gason</span><span>Made with Remotion</span></footer>
  </main>
</React.StrictMode>);
