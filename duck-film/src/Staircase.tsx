import React from 'react';
import {C, Duck, Person, Wall} from './Art';
import {Stage, ease, useSeconds} from './Stage';

export const Staircase: React.FC = () => {
  const t = useSeconds();
  const duckIn = ease(t, 3.7, 4.6);
  const slip = ease(t, 6.0, 8.5);
  return <Stage zoom={1.08}>
    <Wall color="#cfc2ae" floor="#ae8c75"/>
    <path d="M0 600 H300 V555 H385 V510 H470 V465 H555 V420 H640 V375 H725 V330 H810 V285 H895 V240 H1280 V720 H0 Z" fill="#9f7963" stroke={C.ink} strokeWidth="5"/>
    <path d="M300 555 L895 240 H1280 M300 543 L895 228 H1280" fill="none" stroke={C.cream} strokeWidth="13"/>
    {[0,1,2,3,4,5,6].map(i => <path key={i} d={`M${355+i*85} ${520-i*45} v-127`} stroke={C.cream} strokeWidth="10"/>)}
    <path d="M300 402 L895 87 H1280" fill="none" stroke={C.brown} strokeWidth="15" strokeLinecap="round"/>
    <Person x={760 - 340*slip} y={364 + 235*slip} scale={.95} mood={t>4?'startled':'sad'} bandage cast arm={t>4 ? 108 : -42} tilt={slip*105}/>
    {t>3.5 && <Duck x={1040-95*duckIn} y={236} scale={.62} face={-1} flap={Math.sin(t*12)*5}/>}
    {t>7 && t<9.2 && <g transform="translate(440 570)" fill={C.cream}><path d="M0 -38 L8 -11 L35 -19 L16 0 L39 15 L11 15 L2 43 L-8 16 L-35 24 L-17 2 L-36 -14 L-10 -10 Z"/></g>}
    <rect width="1280" height="720" fill={C.ink} opacity={ease(t,9.4,10.9)}/>
  </Stage>;
};
