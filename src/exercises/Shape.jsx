import { MEM_COLORS } from './memoryGen.js'

export default function Shape({ shape, color }) {
  const fill = MEM_COLORS[color]
  const common = { fill }
  switch (shape) {
    case 'circle': return <circle cx="50" cy="50" r="30" {...common} />
    case 'square': return <rect x="22" y="22" width="56" height="56" rx="4" {...common} />
    case 'triangle': return <path d="M50 18 L82 78 L18 78 Z" {...common} />
    case 'diamond': return <path d="M50 16 L82 50 L50 84 L18 50 Z" {...common} />
    default: return <path d="M50 16 L59 39 L84 40 L64 55 L71 80 L50 66 L29 80 L36 55 L16 40 L41 39 Z" {...common} />
  }
}
