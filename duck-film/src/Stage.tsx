import React from 'react';
import {AbsoluteFill, useCurrentFrame, useVideoConfig} from 'remotion';
import {FilmGrain} from './Art';

export const Stage: React.FC<{children: React.ReactNode; zoom?: number}> = ({children, zoom = 1}) => <AbsoluteFill style={{background: '#283539'}}>
  <svg width="100%" height="100%" viewBox="0 0 1280 720" xmlns="http://www.w3.org/2000/svg" style={{display:'block'}}>
    <g transform={`translate(640 430) scale(${zoom}) translate(-640 -430)`}>{children}</g><FilmGrain/>
  </svg>
</AbsoluteFill>;

export const useSeconds = () => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  return frame / fps;
};

export const between = (t: number, a: number, b: number) => Math.min(1, Math.max(0, (t - a) / (b - a)));
export const ease = (t: number, a: number, b: number) => {
  const n = between(t, a, b);
  return n * n * (3 - 2 * n);
};
