import React from 'react';
import {C, Duck, Person, Wall} from './Art';
import {DuckClose} from './StoryArt';
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
    {t<3.7 && <g>
      <rect width="1280" height="720" fill="#d2c4b0"/><path d="M100 720 L470 220 L825 220 L1260 720Z" fill="#b6987d" stroke={C.ink} strokeWidth="5"/>
      {[0,1,2,3,4,5,6].map(i=>{const y=260+i*62;return <path key={i} d={`M${440-i*46} ${y} H${857+i*50}`} stroke={C.cream} strokeWidth="8"/>;})}
      <path d="M110 700 L470 220 M80 650 L440 170" fill="none" stroke={C.brown} strokeWidth="18"/>
      <Person x={640} y={276} scale={.55} mood="sad" arm={-30} bandage cast/>
      <g transform="translate(920 630)" fill={C.white} stroke={C.ink} strokeWidth="5"><path d="M-76 0 Q-100 -93 -49 -135 Q-20 -160 -24 -232 Q-23 -266 0 -267 Q22 -266 23 -232 Q20 -160 51 -135 Q100 -93 76 0 Q0 31 -76 0Z"/><path d="M-57 -65 q-24 -5 -30 24 M57 -65 q24 -5 30 24" fill="none"/><path d="M-40 7 l-14 25 h25 M40 7 l14 25 h-25" fill={C.orange}/></g>
    </g>}
    {t>=3.7 && t<5.9 && <g><rect width="1280" height="720" fill="#c1cab5"/><DuckClose x={680} y={300} scale={2.6} blink={t>5.2&&t<5.4}/></g>}
    <rect width="1280" height="720" fill={C.ink} opacity={ease(t,9.4,10.9)}/>
  </Stage>;
};
