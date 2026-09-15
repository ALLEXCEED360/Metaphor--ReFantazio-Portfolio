import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { useIsMobile } from '../hooks/useMedia'
import { useSettings } from '../app/settings'
import './Background.css'

export interface BackgroundProps {
  /** desktop wallpaper index — public/art/desktop/wallpaper-N.jpg */
  art?: number
  /** mobile portrait index — public/art/mobile/chara-N.jpg */
  mobileArt?: number
  /** which side the readable content sits on; the gradient darkens that side */
  focus?: 'left' | 'right' | 'center' | 'none'
  /** overall darkness of the art 0–1 */
  dim?: number
  /** object-position for the art */
  position?: string
  /** optional muted video loop layered over the art (public/video/*.mp4) */
  video?: string
  poster?: string
  /** ms to hold the still art before the video starts and fades in */
  videoDelay?: number
}

function artUrl(n: number) {
  return `/art/desktop/wallpaper-${n}.jpg`
}
export function charaUrl(n: number) {
  return `/art/mobile/chara-${n}.jpg`
}

export function Background({
  art,
  mobileArt,
  focus = 'left',
  dim = 0.55,
  position = 'center',
  video,
  poster,
  videoDelay = 0,
}: BackgroundProps) {
  const isMobile = useIsMobile()
  const { reducedMotion } = useSettings()
  const [videoReady, setVideoReady] = useState(false)
  const showVideo = !!video && !reducedMotion
  const videoRef = useRef<HTMLVideoElement>(null)

  // hold on the still art, then start the loop from frame 0 and fade it in
  useEffect(() => {
    if (!showVideo) return
    const t = window.setTimeout(() => {
      const v = videoRef.current
      if (!v) return
      const start = () => {
        v.currentTime = 0
        v.play()
          .then(() => setVideoReady(true))
          .catch(() => {
            /* autoplay blocked — the still art simply stays */
          })
      }
      if (v.readyState >= 2) start()
      else v.addEventListener('loadeddata', start, { once: true })
    }, videoDelay)
    return () => clearTimeout(t)
  }, [showVideo, videoDelay])

  const src = isMobile && mobileArt ? charaUrl(mobileArt) : art ? artUrl(art) : null

  return (
    <div className={`bg bg--${focus}`} aria-hidden="true">
      <AnimatePresence initial={false}>
        {src && (
          <motion.div
            key={src}
            className="bg__art"
            style={{ backgroundImage: `url(${src})`, backgroundPosition: position }}
            initial={{ opacity: 0, scale: reducedMotion ? 1 : 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: reducedMotion ? 0 : 0.9, ease: [0.16, 1, 0.3, 1] }}
          />
        )}
      </AnimatePresence>
      {showVideo && (
        <video
          ref={videoRef}
          className={`bg__video ${videoReady ? 'is-ready' : ''}`}
          src={video}
          poster={poster}
          muted
          loop
          playsInline
          preload="auto"
          style={{ objectPosition: position }}
        />
      )}
      <div className="bg__dim" style={{ opacity: dim }} />
      <div className="bg__focus" />
      <svg className="bg__lines" viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice">
        <circle cx="1420" cy="520" r="520" />
        <circle cx="1420" cy="520" r="700" />
        <line x1="-100" y1="900" x2="2020" y2="120" />
        <line x1="300" y1="-50" x2="1250" y2="1130" />
        <line x1="0" y1="1000" x2="1920" y2="1000" />
      </svg>
      <div className="bg__grain" />
      <div className="bg__vignette" />
    </div>
  )
}
