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
    {t<3.8 && <g>
      <rect width="1280" height="720" fill="#b3afa0"/><path d="M0 435 Q580 370 1280 430 V720 H0Z" fill="#7c8982"/>
      <g transform="translate(465 420)" stroke={C.ink} strokeWidth="4" fill={C.ink}><ellipse rx="23" ry="15"/><circle cx="-19" cy="-2" r="8"/><path d="M-10 -10 l-13 -21 M0 -12 l-2 -25 M10 -9 l15 -24 M-10 10 l-15 21 M0 12 l-2 25 M10 10 l15 24" fill="none"/><ellipse cx="-10" cy="-18" rx="23" ry="9" fill="#d6dfd6" opacity=".8"/><ellipse cx="12" cy="-18" rx="23" ry="9" fill="#d6dfd6" opacity=".8"/></g>
      {t>1.55 && <g transform={`translate(${1120-380*ease(t,1.55,3.2)} 345)`}><path d="M0 0 L-190 45 L-190 130 L0 158 Z" fill={C.teal} stroke={C.ink} strokeWidth="6"/><rect x="-190" y="53" width="35" height="68" fill={C.ink}/><path d="M-127 55 H-20 M-127 80 H-20 M-127 105 H-20" stroke={C.cream} opacity=".35" strokeWidth="5"/></g>}
    </g>}
    {t>=5.8 && t<7.1 && <g>
      <rect width="1280" height="720" fill="#b7b7a8"/><path d="M0 557 H1280 V720 H0Z" fill="#929187"/>
      <g transform={`translate(${720-150*ease(t,5.8,6.9)} ${210+180*ease(t,5.8,6.9)}) rotate(${95*ease(t,5.8,6.9)})`}><rect width="74" height="140" rx="7" fill={C.coral} stroke={C.ink} strokeWidth="5"/><rect x="11" y="40" width="52" height="45" fill={C.cream}/><text x="37" y="69" textAnchor="middle" fontFamily="Arial, sans-serif" fontSize="15" fill={C.ink}>SPRAY</text></g>
      <path d={`M610 185 L${720+170*ease(t,6.3,7.1)} 590`} stroke={C.brown} strokeWidth="19" strokeLinecap="round"/><g transform={`translate(610 185) rotate(${30*ease(t,6.3,7.1)})`}><path d="M-92 25 Q-98 -86 0 -95 Q98 -86 92 25 L63 37 Q20 2 -24 36 L-56 45Z" fill="#d7d4c6" stroke={C.ink} strokeWidth="6"/><path d="M-60 12 Q-15 -25 60 13" fill="none" stroke="#aeb8aa" strokeWidth="5"/></g>
    </g>}
    <rect width="1280" height="720" fill={C.ink} opacity={ease(t,10.5,11.9)}/>
  </Stage>;
};
