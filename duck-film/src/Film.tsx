import React from 'react';
import {Audio} from '@remotion/media';
import {Series, staticFile, useVideoConfig} from 'remotion';
import {Opening, Road} from './Opening';
import {Letter} from './Letter';
import {Cleaning} from './Cleaning';
import {Kitchen} from './Kitchen';
import {Hospital, LastHospital, EndCard} from './Hospital';
import {Garage} from './Garage';
import {Search} from './Search';
import {Staircase} from './Staircase';

export const FPS = 24;
export const TOTAL_SECONDS = 144;
export type FilmProps = {includePrivate: boolean; voiceover: boolean; assetBase: string};

export const Film: React.FC<FilmProps> = ({includePrivate, voiceover, assetBase}) => {
  const {fps} = useVideoConfig();
  const score = assetBase ? `${assetBase}score.mp3` : staticFile('score.mp3');
  const publicVoiceover = !includePrivate && voiceover;
  const cue = (file: string) => staticFile(`private-cues/normalized/${file}.wav`);
  return <>
    <Series>
      <Series.Sequence name="Opening" durationInFrames={6*fps} premountFor={fps}><Opening/></Series.Sequence>
      <Series.Sequence name="The road" durationInFrames={12*fps} premountFor={fps}><Road/></Series.Sequence>
      <Series.Sequence name="The letter" durationInFrames={24*fps} premountFor={fps}><Letter includePrivate={includePrivate}/></Series.Sequence>
      <Series.Sequence name="Putting things in order" durationInFrames={14*fps} premountFor={fps}><Cleaning/></Series.Sequence>
      <Series.Sequence name="Kitchen" durationInFrames={12*fps} premountFor={fps}><Kitchen/></Series.Sequence>
      <Series.Sequence name="Hospital, first visit" durationInFrames={7*fps} premountFor={fps}><Hospital visit={1}/></Series.Sequence>
      <Series.Sequence name="Garage" durationInFrames={12*fps} premountFor={fps}><Garage/></Series.Sequence>
      <Series.Sequence name="Hospital, second visit" durationInFrames={6*fps} premountFor={fps}><Hospital visit={2}/></Series.Sequence>
      <Series.Sequence name="The search" durationInFrames={11*fps} premountFor={fps}><Search/></Series.Sequence>
      <Series.Sequence name="Staircase" durationInFrames={11*fps} premountFor={fps}><Staircase/></Series.Sequence>
      <Series.Sequence name="A little kindness" durationInFrames={24*fps} premountFor={fps}><LastHospital/></Series.Sequence>
      <Series.Sequence name="End" durationInFrames={5*fps} premountFor={fps}><EndCard/></Series.Sequence>
    </Series>
    {publicVoiceover ?
      <Audio name="Voiced soundtrack" src={`${assetBase}voiceover.m4a`} premountFor={fps}/> :
      <Audio name="Original score" src={score} volume={(f) => voiceover && f>=21*fps && f<42*fps ? .20 : .42} premountFor={fps}/>}
    {includePrivate && voiceover && <>
      <Audio name="Colin, road" src={cue('01_colin-road')} from={Math.round(10.5*fps)} volume={.65} premountFor={fps}/>
      <Audio name="Colin, letter" src={cue('02_colin-letter')} from={Math.round(41.4*fps)} volume={.65} premountFor={fps}/>
      <Audio name="Colin, kitchen" src={cue('03_colin-kitchen')} from={Math.round(62.2*fps)} volume={.65} premountFor={fps}/>
      <Audio name="Colin, garage" src={cue('04_colin-garage')} from={Math.round(84.6*fps)} volume={.65} premountFor={fps}/>
      <Audio name="Colin, stairs" src={cue('05_colin-stairs')} from={Math.round(110.1*fps)} volume={.65} premountFor={fps}/>
      <Audio name="Duck, road" src={cue('06_duck-road')} from={Math.round(14.4*fps)} volume={.65} premountFor={fps}/>
      <Audio name="Duck, kitchen" src={cue('07_duck-kitchen')} from={Math.round(60.1*fps)} volume={.65} premountFor={fps}/>
      <Audio name="Duck, garage" src={cue('08_duck-garage')} from={Math.round(81.3*fps)} volume={.65} premountFor={fps}/>
      <Audio name="Duck, stairs" src={cue('09_duck-stairs')} from={Math.round(108.0*fps)} volume={.65} premountFor={fps}/>
      <Audio name="Cleaner" src={cue('10_cleaner-hospital')} from={Math.round(115.3*fps)} volume={.48} premountFor={fps}/>
      <Audio name="Doctor, first visit" src={cue('11_doctor-hospital')} from={68*fps} durationInFrames={Math.round(6.75*fps)} volume={.55} premountFor={fps}/>
      <Audio name="Doctor, second visit" src={cue('11_doctor-hospital')} from={87*fps} trimBefore={Math.round(6.75*fps)} volume={.55} premountFor={fps}/>
      <Audio name="Fox" src={cue('12_fox-road')} from={Math.round(11.4*fps)} volume={.60} premountFor={fps}/>
      <Audio name="Cat" src={cue('13_cat-optional')} from={Math.round(39.0*fps)} volume={.60} premountFor={fps}/>
      <Audio name="Lily, part 1" src={cue('14_lily-letter-1')} from={Math.round(21.5*fps)} volume={.80} premountFor={fps}/>
      <Audio name="Lily, part 2" src={cue('15_lily-letter-2')} from={Math.round(26.4*fps)} volume={.80} premountFor={fps}/>
      <Audio name="Lily, part 3" src={cue('16_lily-letter-3')} from={33*fps} volume={.80} premountFor={fps}/>
      <Audio name="Lily, part 4" src={cue('17_lily-letter-4')} from={37*fps} volume={.80} premountFor={fps}/>
    </>}
  </>;
};
