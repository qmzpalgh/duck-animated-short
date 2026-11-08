import React, {useEffect, useState} from 'react';
import {cancelRender, continueRender, delayRender, staticFile} from 'remotion';
import {C, Person, Table, Vase, Wall, Window} from './Art';
import {Stage, ease, useSeconds} from './Stage';

export const Letter: React.FC<{includePrivate?: boolean}> = ({includePrivate = false}) => {
  const t = useSeconds();
  const [lines, setLines] = useState<string[]>([]);
  const [handle] = useState(() => includePrivate ? delayRender('Loading the local letter') : null);
  useEffect(() => {
    if (handle === null) return;
    fetch(staticFile('private-cues/letter.json'))
      .then((response) => {
        if (!response.ok) throw new Error('The local letter is missing');
        return response.json() as Promise<string[]>;
      })
      .then((value) => { setLines(value); continueRender(handle); })
      .catch((error: unknown) => cancelRender(error));
  }, [handle]);

  const closeup = ease(t, 2.6, 3.2);
  return <Stage>
    <Wall color="#d6bea3" floor="#b28c71"/>
    <Window x={890} y={96} w={250} h={280} sky="#a1b5aa"/>
    <path d="M0 98 H1280 M0 105 H1280" stroke={C.cream} strokeWidth="2" opacity=".3"/>
    <path d="M340 455 L340 300 Q340 260 395 260 L447 260 Q496 260 496 300 L496 455" fill="#8d705f" stroke={C.ink} strokeWidth="5"/>
    <Person x={423} y={623} scale={1.14} mood={t>1.4 ? 'sad' : 'neutral'} arm={-45}/>
    <Table x={275} y={507} w={620}/>
    <Vase x={820} y={495}/>
    <g transform="translate(530 467) rotate(-5)" stroke={C.ink} strokeWidth="3"><rect width="160" height="78" fill={C.cream}/><path d="M0 0 L80 48 L160 0" fill="none"/></g>
    {closeup > 0 && <g opacity={closeup}>
      <rect width="1280" height="720" fill="#334b49" opacity=".78"/>
      <g transform={`translate(159 ${55 + 22 * (1-closeup)}) rotate(-1 480 300)`}>
        <rect x="12" y="16" width="962" height="598" rx="2" fill={C.ink} opacity=".2"/>
        <rect width="962" height="598" rx="2" fill={C.cream} stroke={C.ink} strokeWidth="4"/>
        <rect x="24" y="24" width="914" height="550" fill="none" stroke="#cbbb9d" strokeWidth="2"/>
        <text x="74" y="65" fontFamily="Georgia, serif" fontSize="18" letterSpacing="5" fill="#a38c77">A LETTER</text>
        {lines.length > 0 ? lines.map((line, i) => <text key={i} x={i===6 ? 615 : 76} y={130 + i*59} fontFamily="Georgia, serif" fontSize="30" fontStyle="italic" fill={C.ink}>{line}</text>) : <g stroke="#a18f7b" strokeWidth="5" strokeLinecap="round" opacity=".65">
          <path d="M76 135 h250 M76 194 h700 M76 253 h740 M76 312 h540 M76 371 h680 M76 430 h380 M615 500 h190"/>
        </g>}
        <path d="M0 0 q-25 -35 -51 0 q25 23 51 45 q26 -22 51 -45 q-26 -35 -51 0" transform="translate(855 525) scale(.55)" fill={C.coral} opacity=".65"/>
      </g>
    </g>}
  </Stage>;
};
