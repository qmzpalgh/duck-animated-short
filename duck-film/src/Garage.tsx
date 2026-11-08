import React from 'react';
import {C, Car, Duck, Wall} from './Art';
import {Stage, ease, useSeconds} from './Stage';

export const Garage: React.FC = () => {
  const t = useSeconds();
  const leap = ease(t, 4.7, 6.3);
  const crash = ease(t, 9.6, 10.4);
  return <Stage zoom={1.08}>
    <Wall color="#b7b7a8" floor="#929187" stripes={false}/>
    <path d="M85 85 H710 V534 H85 Z M85 164 H710 M85 243 H710 M85 322 H710 M85 401 H710 M85 480 H710" fill="#c9c8b5" stroke="#8f9d91" strokeWidth="5"/>
    <path d="M816 145 V535 M1166 145 V535 M790 253 H1190 M790 398 H1190" stroke={C.ink} strokeWidth="9"/>
    <rect x="865" y="208" width="45" height="44" rx="3" fill={C.coral} stroke={C.ink} strokeWidth="4"/>
    <rect x="967" y="184" width="54" height="69" rx="4" fill={C.ochre} stroke={C.ink} strokeWidth="4"/>
    <rect x="1100" y="210" width="32" height="42" fill={C.teal} stroke={C.ink} strokeWidth="4"/>
    <path d={`M1110 520 L${1060 - 90*ease(t,5.4,7)} 288`} stroke={C.brown} strokeWidth="12" strokeLinecap="round"/><path d="M1078 513 L1136 513 L1120 551 L1090 551 Z" fill={C.pale} stroke={C.ink} strokeWidth="4"/>
    <Car x={500+crash*72} y={617} scale={1.2} crashed={crash>.3}/>
    {t>4.2 && <g transform={`translate(${890-110*ease(t,4.2,6)} ${225+260*ease(t,4.2,6)}) rotate(${ease(t,4.2,6)*140})`}><rect width="34" height="70" rx="4" fill={C.coral} stroke={C.ink} strokeWidth="4"/><path d="M5 17 H29" stroke={C.cream} strokeWidth="5"/></g>}
    <Duck x={1045 - 365*leap} y={245 + 100*leap - Math.sin(leap*Math.PI)*125} scale={.72+leap*.1} face={-1} flap={t>4.6&&t<6.4?Math.sin(t*17)*25:0} tilt={leap*5}/>
    {t > 8 && <g transform="translate(720 345)" stroke={C.cream} strokeWidth="5"><path d="M0 0 l28 -21 M8 17 l38 -1 M-7 -10 l8 -35"/></g>}
    {t > 9.8 && <g transform="translate(755 477)" fill={C.cream} stroke={C.ink} strokeWidth="5"><path d="M0 -80 L18 -26 L64 -58 L38 -10 L92 0 L39 19 L62 67 L14 38 L-1 89 L-18 37 L-70 65 L-43 18 L-96 3 L-40 -12 L-62 -62 L-16 -29 Z"/></g>}
    <rect width="1280" height="720" fill={C.ink} opacity={ease(t,10.5,11.9)}/>
  </Stage>;
};
