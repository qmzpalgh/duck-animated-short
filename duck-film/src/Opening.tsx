import React from 'react';
import {C, Car, Duck, Person} from './Art';
import {Stage, ease, useSeconds} from './Stage';

export const Opening: React.FC = () => {
  const t = useSeconds();
  const duckX = 255 + 80 * ease(t, 0.6, 3.0);
  return <Stage>
    <rect width="1280" height="720" fill={C.darkTeal}/>
    <circle cx="640" cy="370" r="260" fill="#6c9690" opacity=".25"/>
    <path d="M0 560 Q250 510 460 555 T900 543 T1280 555 V720 H0Z" fill="#476d68"/>
    <path d="M130 595 Q360 574 570 592 M710 592 Q850 576 1030 593" fill="none" stroke={C.cream} opacity=".25" strokeWidth="3"/>
    <g opacity={ease(t, 0.2, 1.5)}>
      <text x="640" y="180" textAnchor="middle" fontFamily="Georgia, serif" fontSize="22" letterSpacing="7" fill={C.cream}>A SHORT ANIMATED FILM</text>
      <text x="660" y="386" textAnchor="middle" fontFamily="Georgia, serif" fontSize="178" fontWeight="bold" letterSpacing="14" fill={C.cream}>DUCK</text>
      <path d="M465 414 H854" stroke={C.ochre} strokeWidth="4"/>
      <text x="660" y="458" textAnchor="middle" fontFamily="Georgia, serif" fontSize="23" letterSpacing="2" fill={C.cream}>Based on the screenplay by Damian Gason</text>
    </g>
    <Duck x={duckX} y={568} scale={1.1} tilt={Math.sin(t * 7) * 2}/>
  </Stage>;
};

const Fox: React.FC = () => <g transform="translate(705 594)" stroke={C.ink} strokeWidth="4" strokeLinejoin="round">
  <path d="M-91 7 Q-157 -4 -156 -48 Q-118 -10 -80 -27 Q-39 -54 9 -41 Q45 -35 73 -10 L108 -3 Q76 19 31 13 L-30 12 Z" fill="#b76f4f"/>
  <path d="M-150 -47 Q-139 -26 -122 -23 L-135 -8 Q-153 -20 -150 -47" fill={C.cream}/>
  <path d="M55 -18 L65 -40 L77 -20 L91 -32 L94 -9" fill="#b76f4f"/>
  <path d="M71 -7 L82 -7" fill="none"/><circle cx="99" cy="-4" r="3" fill={C.ink}/>
</g>;

export const Road: React.FC = () => {
  const t = useSeconds();
  const rain = Array.from({length: 52}, (_, i) => {
    const x = (i * 93 + (i % 3) * 27) % 1350;
    const y = ((i * 83 + t * 280) % 810) - 90;
    return <path key={i} d={`M${x} ${y} l-15 38`} stroke="#d9e5d5" opacity=".43" strokeWidth="3"/>;
  });
  return <Stage>
    <rect width="1280" height="720" fill="#829e9b"/>
    <path d="M0 425 Q200 310 380 402 Q570 330 740 406 Q930 300 1280 390 V720 H0 Z" fill="#6c8880"/>
    <path d="M0 498 Q230 440 450 486 T900 472 T1280 480 V720 H0 Z" fill="#839780"/>
    <path d="M0 557 H1280 V720 H0 Z" fill="#626d6b"/><path d="M0 645 H1280" stroke={C.cream} strokeWidth="5" strokeDasharray="70 62" opacity=".6"/>
    {t < 5.1 ? <>
      <g transform={`translate(${-40 - t * 24} 0)`}>
        <path d="M815 474 V311 H1000 V474" fill="#a8b1a1" stroke={C.ink} strokeWidth="5"/>
        <path d="M800 315 L895 250 L1015 315" fill="#718783" stroke={C.ink} strokeWidth="5"/>
        <rect x="845" y="347" width="123" height="60" fill={C.cream} stroke={C.ink} strokeWidth="3"/>
        <text x="907" y="373" textAnchor="middle" fontSize="15" fontFamily="Georgia, serif" fill={C.ink} letterSpacing="2">BALLOON CO.</text>
        <text x="907" y="394" textAnchor="middle" fontWeight="bold" fontSize="18" fontFamily="Georgia, serif" fill={C.coral}>CLOSED</text>
      </g>
      <Car x={360 + 145 * ease(t, 0, 5)} y={596} scale={1.17} wiper={Math.sin(t*5)*28}/>
      {t > 4.25 && <g transform="translate(790 520)" fill={C.cream} stroke={C.ink} strokeWidth="5"><path d="M0 -55 L13 -17 L48 -37 L25 -4 L61 4 L26 15 L43 48 L9 28 L-2 61 L-12 24 L-46 45 L-28 12 L-61 2 L-27 -7 L-42 -40 L-10 -20 Z"/><text y="12" textAnchor="middle" fontSize="20" stroke="none" fill={C.ink}>!</text></g>}
    </> : <>
      <Fox/>
      <Person x={485} y={602} scale={.83} mood="sad" tilt={-5} arm={18}/>
      <path d="M910 601 q28 -74 48 0 q21 -89 46 0 q25 -63 43 0 q25 -77 47 0" fill="#718e70" stroke={C.ink} strokeWidth="3"/>
      <Duck x={1002} y={597} scale={.68} face={-1} tilt={t > 8 ? -3 : 0}/>
      {t > 8.3 && <Car x={250 - 210 * ease(t,8.3,11.8)} y={610} scale={.65} wiper={Math.sin(t*5)*28}/>}
    </>}
    <g>{rain}</g>
    {t > 4.75 && t < 5.1 && <rect width="1280" height="720" fill={C.cream} opacity={1-ease(t,4.75,5.1)}/>}
  </Stage>;
};
