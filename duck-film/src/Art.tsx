import React from 'react';

// All of the artwork is drawn here: no illustration or character assets are used.
export const C = {
  ink: '#283539', cream: '#f8efda', paper: '#eadbc0', pale: '#e8d3b4',
  teal: '#527d79', darkTeal: '#365b5b', coral: '#cb806a', ochre: '#d4a85c',
  blue: '#94afad', brown: '#725849', plum: '#69575e', white: '#fff8e8',
  green: '#9baa85', floor: '#b89579', shadow: '#2d3738', orange: '#db9855',
};

type PersonProps = {
  x: number; y: number; scale?: number; kind?: 'colin' | 'cleaner' | 'doctor';
  mood?: 'sad' | 'startled' | 'happy' | 'neutral'; walk?: number; arm?: number;
  tilt?: number; cast?: boolean; bandage?: boolean; opacity?: number; hideLeftArm?: boolean;
};

export const Person: React.FC<PersonProps> = ({
  x, y, scale = 1, kind = 'colin', mood = 'neutral', walk = 0, arm = 0,
  tilt = 0, cast = false, bandage = false, opacity = 1, hideLeftArm = false,
}) => {
  const cleaner = kind === 'cleaner';
  const doctor = kind === 'doctor';
  const skin = cleaner ? '#a86c54' : doctor ? '#c59a7a' : '#e8b99a';
  const coat = cleaner ? '#659a90' : doctor ? '#e8e5d7' : '#d9d5c5';
  const trousers = cleaner ? '#426660' : '#3b4e52';
  const bodyWidth = cleaner ? 1.18 : 1;
  const eyelid = mood === 'sad' ? 0.75 : 1;
  const mouth = mood === 'happy' ? 'M -10 9 Q 0 21 11 8' : mood === 'sad' ? 'M -10 15 Q 0 7 11 15' : 'M -8 13 Q 1 15 9 12';
  return <g opacity={opacity} transform={`translate(${x} ${y}) scale(${scale}) rotate(${tilt})`} stroke={C.ink} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
    {/* Separate limbs swing around their shoulder and hip joints. */}
    <g transform={`translate(-19 -91) rotate(${walk})`}>
      <path d="M-17 0 L 12 0 L 8 79 L -13 79 Z" fill={trousers}/>
      <path d="M-13 72 L 8 72 L 14 86 Q 7 92 -21 90 Q-26 86 -13 72" fill={C.ink}/>
    </g>
    <g transform={`translate(19 -91) rotate(${-walk})`}>
      <path d="M-12 0 L 17 0 L 14 79 L -8 79 Z" fill={trousers}/>
      <path d="M-8 72 L 14 72 L 21 86 Q 12 92 -15 90 Q-18 85 -8 72" fill={C.ink}/>
    </g>
    <g transform={`scale(${bodyWidth} 1)`}>
      <path d="M-39 -189 Q-52 -174 -49 -121 L-52 -80 Q-2 -68 52 -80 L49 -121 Q52 -174 39 -189 Q0 -201 -39 -189" fill={coat}/>
      <path d="M-20 -188 L0 -159 L20 -188" fill={C.cream}/>
      {!cleaner && !doctor && <><path d="M0 -175 L-8 -145 L0 -127 L8 -145 Z" fill={C.darkTeal}/><path d="M-43 -185 L-19 -169 L-32 -149 L-11 -120 M43 -185 L19 -169 L32 -149 L11 -120" fill="none"/></>}
      {cleaner && <><path d="M-28 -179 Q0 -157 28 -179" fill="none" stroke={C.cream} strokeWidth="6"/><rect x="-23" y="-127" width="46" height="30" rx="4" fill="#7bad9e"/></>}
      {doctor && <><path d="M0 -159 L0 -83 M-32 -135 L-10 -135" fill="none"/><circle cx="27" cy="-145" r="7" fill={C.coral}/></>}
    </g>
    {!hideLeftArm && <g transform={`translate(-43 -176) rotate(${-arm * .22})`}>
      <path d="M-3 -10 Q-21 -10 -22 8 L-22 56 Q-20 70 -5 70 L5 61 L7 5 Z" fill={coat}/>
      <circle cx="-10" cy="68" r="11" fill={skin}/>
    </g>}
    <g transform={`translate(43 -176) rotate(${arm})`}>
      <path d="M3 -10 Q21 -10 22 8 L22 56 Q20 70 5 70 L-5 61 L-7 5 Z" fill={cast ? C.cream : coat}/>
      <circle cx="10" cy="68" r="11" fill={skin}/>
      {cast && <path d="M-3 5 L18 15 M-4 22 L20 32 M-5 43 L19 52" fill="none" stroke="#b9b8a8" strokeWidth="2"/>}
    </g>
    <path d="M-13 -204 L-13 -184 Q0 -174 13 -184 L13 -204" fill={skin}/>
    {/* Face is a single cut-paper shape; brows and mouth carry expression. */}
    <g transform="translate(0 -238)">
      {cleaner ? <path d="M-39 -19 Q-49 -65 0 -67 Q49 -65 40 -19 L45 15 Q35 30 28 25 L-28 25 Q-38 30 -45 15 Z" fill="#393735"/> :
        <path d="M-38 -25 Q-37 -61 0 -60 Q37 -60 38 -25 L34 -10 L-34 -10 Z" fill={doctor ? '#6c5b50' : '#514b45'}/>}
      <path d="M-35 -24 Q-35 -52 0 -52 Q35 -52 35 -24 L34 2 Q31 30 0 34 Q-31 30 -34 2 Z" fill={skin}/>
      <path d="M-35 -24 Q-35 -54 -7 -54 Q-22 -38 -35 -34 M35 -24 Q35 -54 8 -54 Q24 -42 35 -34" fill={cleaner ? '#393735' : doctor ? '#6c5b50' : '#514b45'}/>
      {!cleaner && !doctor && <path d="M-36 -35 Q-38 -55 -25 -58 Q-17 -69 -7 -59 Q3 -69 12 -59 Q26 -65 32 -51 Q40 -43 34 -31 Q25 -34 20 -43 Q12 -34 5 -44 Q-2 -34 -10 -45 Q-18 -35 -26 -44 Z" fill="#514b45"/>}
      <ellipse cx="-15" cy="-12" rx="7" ry={5 * eyelid} fill={C.white}/>
      <ellipse cx="15" cy="-12" rx="7" ry={5 * eyelid} fill={C.white}/>
      <circle cx="-14" cy="-11" r="2.3" fill={C.ink}/><circle cx="16" cy="-11" r="2.3" fill={C.ink}/>
      <path d={mood === 'sad' ? 'M-22 -20 L-9 -24 M9 -24 L22 -20' : mood === 'startled' ? 'M-23 -26 Q-16 -31 -9 -26 M9 -26 Q16 -31 23 -26' : 'M-22 -23 L-9 -24 M9 -24 L22 -23'} fill="none"/>
      <path d="M1 -9 L-2 3 L4 4" fill="none" strokeWidth="2"/>
      <path d={mouth} fill="none"/>
      {bandage && <><path d="M-36 -34 L34 -40 L36 -18 L-34 -12 Z" fill={C.cream}/><path d="M-14 -35 L-11 -15 M1 -37 L4 -17 M16 -38 L19 -19" stroke="#c1c2ae" strokeWidth="2"/></>}
    </g>
  </g>;
};

type DuckProps = {x: number; y: number; scale?: number; flap?: number; tilt?: number; face?: 1 | -1; blink?: boolean};
export const Duck: React.FC<DuckProps> = ({x, y, scale = 1, flap = 0, tilt = 0, face = 1, blink = false}) =>
  <g transform={`translate(${x} ${y}) scale(${scale * face} ${scale}) rotate(${tilt})`} stroke={C.ink} strokeWidth="3" strokeLinejoin="round" strokeLinecap="round">
    <path d="M-22 -8 L-25 7 L-39 12 L-18 12 L-11 7 M17 -8 L14 8 L2 12 L23 12 L29 7" fill={C.orange}/>
    <ellipse cx="0" cy="-33" rx="58" ry="37" fill={C.white}/>
    <path d="M27 -44 Q22 -69 28 -91 Q33 -111 50 -111 Q67 -110 66 -91 L65 -49 Q61 -28 43 -24" fill={C.white}/>
    <path d="M64 -96 Q89 -93 102 -84 Q87 -76 64 -79 Z" fill={C.orange}/>
    <path d="M-54 -46 L-68 -61 Q-70 -41 -55 -29" fill={C.white}/>
    <g transform={`translate(-3 -42) rotate(${flap})`}><path d="M-36 0 Q-8 -23 21 -3 Q2 22 -25 17 Z" fill="#e7dbc7"/><path d="M-22 7 Q-6 12 8 5" fill="none" stroke="#b7ad9d" strokeWidth="2"/></g>
    {blink ? <path d="M48 -95 L57 -95" fill="none"/> : <><circle cx="53" cy="-95" r="5" fill={C.white}/><circle cx="54" cy="-95" r="2" fill={C.ink}/></>}
    <path d="M47 -105 L57 -106" fill="none" strokeWidth="2"/>
  </g>;

export const Wall: React.FC<{color?: string; floor?: string; stripes?: boolean}> = ({color = '#d7c6ae', floor = C.floor, stripes = true}) =>
  <g>
    <rect width="1280" height="720" fill={color}/>
    {stripes && Array.from({length: 20}, (_, i) => <rect key={i} x={i * 72} y="0" width="3" height="558" fill="#fff8e8" opacity=".09"/>)}
    <rect x="0" y="550" width="1280" height="13" fill={C.cream} opacity=".65"/>
    <rect x="0" y="563" width="1280" height="157" fill={floor}/>
    <path d="M0 635 H1280 M0 698 H1280" stroke={C.ink} opacity=".1" strokeWidth="3"/>
  </g>;

export const Window: React.FC<{x: number; y: number; w?: number; h?: number; sky?: string}> = ({x, y, w = 250, h = 255, sky = '#9bbab4'}) =>
  <g transform={`translate(${x} ${y})`} stroke={C.ink} strokeWidth="5">
    <rect width={w} height={h} rx="3" fill={C.cream}/><rect x="11" y="11" width={w - 22} height={h - 22} fill={sky}/>
    <path d={`M${w / 2} 12 V${h - 12} M12 ${h / 2} H${w - 12}`} fill="none"/>
    <rect x="-9" y={h - 4} width={w + 18} height="14" fill={C.cream}/>
  </g>;

export const Table: React.FC<{x: number; y: number; w?: number}> = ({x, y, w = 430}) =>
  <g transform={`translate(${x} ${y})`} stroke={C.ink} strokeWidth="4" strokeLinejoin="round">
    <path d={`M22 5 L40 185 H62 L70 5 M${w - 22} 5 L${w - 40} 185 H${w - 62} L${w - 70} 5`} fill={C.brown}/>
    <rect x="0" y="-9" width={w} height="23" rx="3" fill="#9a7058"/>
  </g>;

export const Vase: React.FC<{x: number; y: number; tilt?: number}> = ({x,y,tilt=0}) =>
  <g transform={`translate(${x} ${y}) rotate(${tilt})`} stroke={C.ink} strokeWidth="3" strokeLinecap="round">
    <path d="M-15 -46 Q-10 -28 -23 -7 Q0 5 23 -7 Q10 -28 15 -46 Z" fill={C.teal}/>
    <path d="M0 -47 L-10 -89 M0 -47 L7 -99 M0 -47 L22 -83" fill="none" stroke="#657f61"/>
    <circle cx="-10" cy="-91" r="11" fill={C.coral}/><circle cx="7" cy="-101" r="11" fill={C.ochre}/><circle cx="23" cy="-85" r="11" fill="#e2a396"/>
  </g>;

export const Clock: React.FC<{x:number; y:number; hand?:number; r?:number}> = ({x,y,hand=0,r=42}) =>
  <g transform={`translate(${x} ${y})`} stroke={C.ink} strokeWidth="3">
    <circle r={r} fill={C.cream}/><circle r={r-7} fill="none" opacity=".3"/>
    <path d={`M0 0 L0 ${-r*0.58} M0 0 L${Math.cos(hand)*r*0.5} ${Math.sin(hand)*r*0.5}`} strokeWidth="4"/>
    <circle r="3" fill={C.ink}/>
  </g>;

export const Car: React.FC<{x:number; y:number; scale?:number; wiper?:number; crashed?:boolean}> = ({x,y,scale=1,wiper=0,crashed=false}) =>
  <g transform={`translate(${x} ${y}) scale(${scale})`} stroke={C.ink} strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
    <ellipse cx="0" cy="7" rx="255" ry="21" fill={C.ink} opacity=".15" stroke="none"/>
    <path d="M-224 -106 Q-212 -147 -154 -151 L-114 -207 Q-97 -228 -52 -229 L77 -229 Q109 -226 145 -157 L205 -142 Q227 -137 228 -111 L226 -57 Q220 -39 201 -37 L-199 -37 Q-227 -40 -228 -62 Z" fill={crashed ? '#967368' : C.teal}/>
    <path d="M-100 -205 Q-91 -218 -58 -218 L-10 -218 L-10 -153 L-140 -153 Z M4 -218 L71 -218 Q95 -216 127 -153 L4 -153 Z" fill="#b5ccbf"/>
    <path d="M-9 -219 L-9 -45 M136 -149 L136 -47" fill="none" opacity=".5"/>
    <path d={`M7 -150 l${wiper} -40 M15 -150 l${-wiper} -40`} strokeWidth="4"/>
    <circle cx="-150" cy="-34" r="37" fill={C.ink}/><circle cx="-150" cy="-34" r="17" fill={C.cream}/>
    <circle cx="146" cy="-34" r="37" fill={C.ink}/><circle cx="146" cy="-34" r="17" fill={C.cream}/>
    <path d="M-228 -99 H-208 M210 -107 H227" stroke={C.ochre} strokeWidth="12"/>
    <path d="M-123 -177 q6 -28 30 -28 q27 0 29 28 v22 h-59 Z" fill="#596b70"/>
    <circle cx="-95" cy="-195" r="16" fill="#e8b99a"/><path d="M-110 -201 q7 -20 28 -10" fill="none"/>
    <rect x="25" y="-181" width="71" height="28" rx="2" fill={C.pale}/><path d="M26 -176 H96 M61 -181 V-153" fill="none" strokeWidth="2"/>
  </g>;

export const FilmGrain: React.FC = () => <g pointerEvents="none">
  <rect x="14" y="14" width="1252" height="692" rx="3" fill="none" stroke={C.cream} strokeWidth="2" opacity=".45"/>
  <rect x="0" y="0" width="1280" height="720" fill="none" stroke={C.ink} strokeWidth="22" opacity=".28"/>
  <path d="M34 28 h26 M34 28 v26 M1246 28 h-26 M1246 28 v26 M34 692 h26 M34 692 v-26 M1246 692 h-26 M1246 692 v-26" fill="none" stroke={C.cream} opacity=".5" strokeWidth="2"/>
</g>;
