import { COLORS } from './observerScene.js'

// A small, fixed-palette illustration of a room. The scene is a picture,
// so it keeps the same colours in light and dark mode.
export default function ObserverScene({ s }) {
  const shelfX = s.shelfSide === 'left' ? 22 : 258
  const clockX = s.shelfSide === 'left' ? 330 : 70
  const posterX = s.shelfSide === 'left' ? 296 : 36
  const lampX = s.lampSide === 'left' ? 130 : 262
  const mugX = s.lampSide === 'left' ? 236 : 150
  const cupX = s.lampSide === 'left' ? 204 : 186
  const plantX = s.shelfSide === 'left' ? 64 : 334
  const cols = s.panes === 4 ? 2 : 3
  const rows = s.panes === 9 ? 3 : 2
  let bx = shelfX + 8
  const hourA = ((s.hour % 12) + s.minute / 60) * 30
  const minA = s.minute * 6
  const hand = (a, len) => ({ x2: clockX + len * Math.sin((a * Math.PI) / 180), y2: 62 - len * Math.cos((a * Math.PI) / 180) })
  const h1 = hand(hourA, 11)
  const m1 = hand(minA, 16)
  return (
    <svg viewBox="0 0 400 280" className="w-full h-auto rounded-xl" role="img" aria-label="A room scene to study">
      <rect width="400" height="280" fill="#efe5d3" />
      <rect y="222" width="400" height="58" fill="#c9b08c" />
      <line x1="0" y1="222" x2="400" y2="222" stroke="#a88d68" strokeWidth="2" />
      {/* window */}
      <rect x="152" y="24" width="96" height="88" fill="#cfe3ef" stroke="#7d6a52" strokeWidth="4" />
      {Array.from({ length: cols - 1 }, (_, i) => <line key={'c' + i} x1={152 + (96 / cols) * (i + 1)} y1="24" x2={152 + (96 / cols) * (i + 1)} y2="112" stroke="#7d6a52" strokeWidth="3" />)}
      {Array.from({ length: rows - 1 }, (_, i) => <line key={'r' + i} x1="152" y1={24 + (88 / rows) * (i + 1)} x2="248" y2={24 + (88 / rows) * (i + 1)} stroke="#7d6a52" strokeWidth="3" />)}
      {/* sticky notes */}
      {Array.from({ length: s.notes }, (_, i) => <rect key={'n' + i} x={256 + (i % 2) * 15} y={30 + Math.floor(i / 2) * 15} width="12" height="12" fill="#f3dc6b" transform={`rotate(${i % 2 ? 4 : -5} ${262 + (i % 2) * 15} ${36 + Math.floor(i / 2) * 15})`} />)}
      {/* shelf + books */}
      <rect x={shelfX} y="112" width="120" height="6" fill="#7d5a3c" />
      {s.books.map((b, i) => {
        const x = bx; bx += b.w + 2
        return <rect key={i} x={x} y={112 - b.h} width={b.w} height={b.h} rx="1.5" fill={COLORS[b.color]} />
      })}
      <rect x={shelfX + 4} y="118" width="5" height="10" fill="#7d5a3c" /><rect x={shelfX + 111} y="118" width="5" height="10" fill="#7d5a3c" />
      {/* clock */}
      <circle cx={clockX} cy="62" r="22" fill="#fbf7ee" stroke={COLORS[s.clockFrame]} strokeWidth="4" />
      {[0, 90, 180, 270].map((a) => <line key={a} x1={clockX + 17 * Math.sin((a * Math.PI) / 180)} y1={62 - 17 * Math.cos((a * Math.PI) / 180)} x2={clockX + 20 * Math.sin((a * Math.PI) / 180)} y2={62 - 20 * Math.cos((a * Math.PI) / 180)} stroke="#333" strokeWidth="1.5" />)}
      <line x1={clockX} y1="62" x2={h1.x2} y2={h1.y2} stroke="#222" strokeWidth="2.5" strokeLinecap="round" />
      <line x1={clockX} y1="62" x2={m1.x2} y2={m1.y2} stroke="#222" strokeWidth="1.5" strokeLinecap="round" />
      {/* poster */}
      <rect x={posterX} y="104" width="68" height="46" fill="#fbf7ee" stroke={COLORS[s.posterBorder]} strokeWidth="3" />
      <text x={posterX + 34} y="131" textAnchor="middle" fontSize="9" fontFamily="Inter, sans-serif" fontWeight="600" letterSpacing="1.5" fill="#333">{s.word}</text>
      {/* desk */}
      <rect x="112" y="176" width="176" height="8" rx="2" fill="#8a6542" />
      <rect x="120" y="184" width="6" height="40" fill="#76553a" /><rect x="274" y="184" width="6" height="40" fill="#76553a" />
      {/* chair */}
      <rect x="182" y="196" width="40" height="6" rx="2" fill={COLORS[s.chair]} />
      <rect x="186" y="202" width="4" height="22" fill="#555" /><rect x="214" y="202" width="4" height="22" fill="#555" />
      {/* lamp */}
      <rect x={lampX - 2} y="146" width="4" height="30" fill="#555" />
      <rect x={lampX - 10} y="174" width="20" height="3" fill="#555" />
      <path d={`M${lampX - 14} 150 L${lampX + 14} 150 L${lampX + 8} 134 L${lampX - 8} 134 Z`} fill={COLORS[s.lamp]} />
      {/* pencil cup */}
      {Array.from({ length: s.pencils }, (_, i) => <rect key={'p' + i} x={cupX - 6 + i * 3} y={150 + (i % 2) * 3} width="2" height="16" fill={['#e2b93b', '#4f8a5b', '#3e6ea8', '#d9813a', '#7a5a9e'][i]} transform={`rotate(${(i - s.pencils / 2) * 5} ${cupX} 168)`} />)}
      <rect x={cupX - 8} y="160" width="16" height="16" rx="2" fill="#5b5b5b" />
      {/* mug */}
      <rect x={mugX - 8} y="162" width="16" height="14" rx="2" fill={COLORS[s.mug]} />
      <path d={`M${mugX + 8} 165 q7 0 7 5 q0 5 -7 5`} fill="none" stroke={COLORS[s.mug]} strokeWidth="2.5" />
      {/* plant */}
      {Array.from({ length: s.leaves }, (_, i) => {
        const a = -70 + (140 / Math.max(1, s.leaves - 1)) * i
        return <ellipse key={'l' + i} cx={plantX} cy="196" rx="4" ry="13" fill="#4f8a5b" transform={`rotate(${a} ${plantX} 208)`} />
      })}
      <path d={`M${plantX - 13} 206 L${plantX + 13} 206 L${plantX + 9} 226 L${plantX - 9} 226 Z`} fill={COLORS[s.pot]} />
    </svg>
  )
}
