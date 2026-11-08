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
    <Audio name="Original score" src={score} volume={(f) => voiceover && f>=21*fps && f<42*fps ? .20 : .42} premountFor={fps}/>
    {includePrivate && voiceover && <>
      <Audio name="Lily, part 1" src={staticFile('private-cues/14_lily-letter-1.wav')} from={Math.round(21.5*fps)} volume={.95} premountFor={fps}/>
      <Audio name="Lily, part 2" src={staticFile('private-cues/15_lily-letter-2.wav')} from={Math.round(26.4*fps)} volume={.95} premountFor={fps}/>
      <Audio name="Lily, part 3" src={staticFile('private-cues/16_lily-letter-3.wav')} from={33*fps} volume={.95} premountFor={fps}/>
      <Audio name="Lily, part 4" src={staticFile('private-cues/17_lily-letter-4.wav')} from={37*fps} volume={.95} premountFor={fps}/>
    </>}
  </>;
};
