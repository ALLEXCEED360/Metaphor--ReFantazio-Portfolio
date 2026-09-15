import { useEffect, useState } from 'react'

export function useMedia(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window !== 'undefined' ? window.matchMedia(query).matches : false,
  )
  useEffect(() => {
    const mq = window.matchMedia(query)
    const onChange = () => setMatches(mq.matches)
    mq.addEventListener('change', onChange)
    onChange()
    return () => mq.removeEventListener('change', onChange)
  }, [query])
  return matches
}

/** phones: portrait, or a short landscape viewport (a phone turned sideways) */
export const useIsMobile = () => useMedia('(max-width: 760px), (max-height: 500px) and (orientation: landscape)')
export const useFinePointer = () => useMedia('(pointer: fine)')
