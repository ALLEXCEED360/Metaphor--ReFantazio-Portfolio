import { useEffect, useRef } from 'react'
import { useSettings } from './settings'
import { useNav } from './router'
import './music.css'

/**
 * Background music, streamed from YouTube through the IFrame Player API so
 * no music files are hosted here. The player is kept out of sight; a small
 * credit chip names the track and links to the video. Playback can only
 * begin after a user gesture, which the title screen's "press any key" is.
 */

export const TRACK = {
  id: 'jF1YTiVsZ3A',
  title: 'Main Menu Theme',
  by: 'Metaphor: ReFantazio · Shoji Meguro',
  url: 'https://www.youtube.com/watch?v=jF1YTiVsZ3A',
}
const VOLUME = 32

type YTPlayer = {
  playVideo(): void
  pauseVideo(): void
  setVolume(v: number): void
  getVolume(): number
  getPlayerState(): number
  destroy(): void
}
declare global {
  interface Window {
    YT?: { Player: new (el: HTMLElement, opts: unknown) => YTPlayer; PlayerState: { PLAYING: number } }
    onYouTubeIframeAPIReady?: () => void
  }
}

let player: YTPlayer | null = null
let ready = false
let wanted = false // the user has made a gesture and music is switched on
let allowed = true // the music setting

function apply() {
  if (!player || !ready) return
  if (wanted && allowed) {
    player.setVolume(VOLUME)
    player.playVideo()
  } else {
    player.pauseVideo()
  }
}

/** called from the first gesture (the title screen) */
export function startMusic() {
  wanted = true
  apply()
}
export function setMusicAllowed(on: boolean) {
  allowed = on
  apply()
}

function loadApi(): Promise<void> {
  return new Promise((resolve) => {
    if (window.YT?.Player) return resolve()
    const prev = window.onYouTubeIframeAPIReady
    window.onYouTubeIframeAPIReady = () => {
      prev?.()
      resolve()
    }
    if (!document.querySelector('script[src*="youtube.com/iframe_api"]')) {
      const s = document.createElement('script')
      s.src = 'https://www.youtube.com/iframe_api'
      s.async = true
      document.head.appendChild(s)
    }
  })
}

export function Music() {
  const { settings } = useSettings()
  const { route } = useNav()
  const host = useRef<HTMLDivElement>(null)

  useEffect(() => {
    allowed = settings.music === 'on'
    apply()
  }, [settings.music])

  useEffect(() => {
    let cancelled = false
    loadApi().then(() => {
      if (cancelled || !host.current || player) return
      player = new window.YT!.Player(host.current, {
        videoId: TRACK.id,
        playerVars: { autoplay: 0, controls: 0, disablekb: 1, fs: 0, loop: 1, playlist: TRACK.id, modestbranding: 1, rel: 0, playsinline: 1, origin: window.location.origin },
        events: {
          onReady: () => {
            ready = true
            apply()
            // dev aid: window.__musicState() → 1 while playing
            ;(window as unknown as { __musicState?: () => number }).__musicState = () => player?.getPlayerState() ?? -9
          },
          onStateChange: (e: { data: number }) => {
            // 0 = ended; the loop param usually handles it, this is the belt to its braces
            if (e.data === 0 && wanted && allowed) player?.playVideo()
          },
        },
      })
    })
    return () => {
      cancelled = true
    }
  }, [])

  const showChip = route.screen !== 'boot' && settings.music === 'on'
  return (
    <>
      <div className="music" aria-hidden="true">
        <div ref={host} />
      </div>
      {showChip && (
        <a className="music__chip t-mono" href={TRACK.url} target="_blank" rel="noreferrer" title={`${TRACK.title} · ${TRACK.by} · via YouTube`}>
          <span className="music__note" aria-hidden="true">
            ♪
          </span>
          {TRACK.title}
        </a>
      )}
    </>
  )
}
