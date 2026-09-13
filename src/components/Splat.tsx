import type { CSSProperties } from 'react'
import './Splat.css'

/**
 * A ragged paint-stroke — the band Metaphor puts behind the selected menu item.
 * Pure SVG: a blobby path pushed through a turbulence displacement so every
 * instance has torn, painterly edges.
 */
export function Splat({
  color = 'var(--red)',
  seed = 3,
  className = '',
  style,
}: {
  color?: string
  seed?: number
  className?: string
  style?: CSSProperties
}) {
  const id = `splat-${seed}`
  return (
    <svg
      className={`splat ${className}`}
      viewBox="0 0 600 100"
      preserveAspectRatio="none"
      aria-hidden="true"
      style={{ color, ...style }}
    >
      <defs>
        <filter id={id} x="-10%" y="-40%" width="120%" height="180%">
          <feTurbulence type="fractalNoise" baseFrequency="0.018 0.09" numOctaves="3" seed={seed} result="t" />
          <feDisplacementMap in="SourceGraphic" in2="t" scale="22" xChannelSelector="R" yChannelSelector="G" />
        </filter>
      </defs>
      <g filter={`url(#${id})`} fill="currentColor">
        <path d="M14 48 C 60 18, 150 10, 300 16 S 540 22, 588 46 C 560 78, 380 90, 200 84 S 40 80, 14 48 Z" />
        <ellipse cx="560" cy="30" rx="18" ry="7" />
        <ellipse cx="596" cy="62" rx="10" ry="5" />
        <ellipse cx="26" cy="82" rx="12" ry="5" />
      </g>
    </svg>
  )
}

/** A small brush "flick" used as a decorative accent */
export function Flick({ color = 'var(--red)', className = '' }: { color?: string; className?: string }) {
  return (
    <svg className={`flick ${className}`} viewBox="0 0 200 40" aria-hidden="true" style={{ color }}>
      <path
        d="M2 30 C 40 6, 90 2, 140 10 S 190 22, 198 18 C 170 34, 110 40, 60 36 S 12 36, 2 30 Z"
        fill="currentColor"
      />
    </svg>
  )
}
