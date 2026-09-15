import { useEffect, useRef } from 'react'
import { useSettings } from './settings'

/**
 * Background music: one long track from public/music, looped, playing from
 * the moment the site opens. Browsers refuse to start sound before the
 * visitor has interacted with the page, so playback is attempted at once
 * and, if refused, retried on the first key press, click or touch. The
 * position is remembered for the session, so a refresh or a redirect
 * picks the music up where it was instead of starting over.
 */

const TRACK = {
  src: '/music/ode-to-heroes.mp3',
  title: 'Ode to Heroes',
  by: 'Metaphor: ReFantazio · Shoji Meguro',
}
const VOLUME = 0.45
const POS_KEY = 'aryan-portfolio:music-pos'

let audio: HTMLAudioElement | null = null
let allowed = true
let armed = false // gesture listeners in place

function ensure(): HTMLAudioElement {
  if (audio) return audio
  audio = new Audio(TRACK.src)
  audio.loop = true
  audio.preload = 'auto'
  audio.volume = VOLUME
  // resume where the session left off
  const saved = Number(sessionStorage.getItem(POS_KEY))
  if (Number.isFinite(saved) && saved > 0) {
    const seek = () => {
      audio!.currentTime = saved
      audio!.removeEventListener('loadedmetadata', seek)
    }
    if (audio.readyState >= 1) seek()
    else audio.addEventListener('loadedmetadata', seek)
  }
  // keep the position fresh
  window.setInterval(() => {
    if (audio && !audio.paused) sessionStorage.setItem(POS_KEY, String(audio.currentTime))
  }, 2000)
  return audio
}

/** try to play; if the browser refuses, wait for the first gesture */
function tryPlay() {
  if (!allowed) return
  const a = ensure()
  a.play().then(disarm).catch(arm)
}
function onGesture() {
  tryPlay()
}
function arm() {
  if (armed) return
  armed = true
  window.addEventListener('keydown', onGesture)
  window.addEventListener('pointerdown', onGesture)
  window.addEventListener('touchstart', onGesture)
}
function disarm() {
  if (!armed) return
  armed = false
  window.removeEventListener('keydown', onGesture)
  window.removeEventListener('pointerdown', onGesture)
  window.removeEventListener('touchstart', onGesture)
}

export function startMusic() {
  tryPlay()
}
function setMusicAllowed(on: boolean) {
  allowed = on
  if (!on) {
    audio?.pause()
    disarm()
  } else tryPlay()
}

export function Music() {
  const { settings } = useSettings()
  const started = useRef(false)

  useEffect(() => {
    setMusicAllowed(settings.music === 'on')
  }, [settings.music])

  useEffect(() => {
    if (started.current) return
    started.current = true
    tryPlay()
    // when the tab comes back, make sure we are still going
    const onVis = () => {
      if (document.visibilityState === 'visible' && allowed && audio?.paused) tryPlay()
    }
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  return null
}
