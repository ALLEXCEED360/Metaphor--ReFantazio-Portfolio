/**
 * The creative archive: everything lives under public/creative/.
 * Videos are short muted preview loops cut from the originals; the `link`
 * on each piece goes to the full version on Behance or ArtStation.
 */

export type Collection = 'cinematic' | 'motion' | 'illustration'

export interface Piece {
  id: string
  title: string
  collection: Collection
  year: string
  tools: string[]
  /** video preview loop (mp4) or still image, under /creative/ */
  video?: string
  image: string
  link: string
  linkLabel: 'Behance' | 'ArtStation'
  note: string
  /** how the still should sit in a 16:9 thumbnail */
  fit?: 'cover' | 'contain'
}

export const collections: { id: Collection; title: string; short: string; paint: string }[] = [
  { id: 'cinematic', title: 'Cinematic', short: 'Cinematic', paint: '#0c8e5e' },
  { id: 'motion', title: 'Motion Graphics', short: 'Motion', paint: '#f14352' },
  { id: 'illustration', title: 'Illustration', short: 'Illustration', paint: '#b94abb' },
]

const BE = 'https://www.behance.net/gallery/'

export const archive: Piece[] = [
  /* ── cinematic ─────────────────────────────────────────────────────── */
  {
    id: 'isle-cinematic',
    title: 'Isle of Echoes',
    collection: 'cinematic',
    year: '2026',
    tools: ['Unreal Engine 5', 'Premiere Pro', 'After Effects'],
    video: 'isle-cinematic-1.mp4',
    image: 'isle-cinematic-1.jpg',
    link: 'https://www.artstation.com/artwork/WdKn1J',
    linkLabel: 'ArtStation',
    note: 'An island environment built in Unreal Engine 5 around an open ocean: world building, lighting and cinematic camera work, cut as a short film.',
  },
  {
    id: 'dragon-ball',
    title: 'Dragon Ball in the Wilderness',
    collection: 'cinematic',
    year: '2026',
    tools: ['Unreal Engine 5', 'Sequencer', 'Premiere Pro'],
    video: 'dragon-ball.mp4',
    image: 'dragon-ball.jpg',
    link: 'https://www.artstation.com/artwork/zzPqJZ',
    linkLabel: 'ArtStation',
    note: 'A quiet, expansive wilderness with a dragon moving through the far landscape. Built in Unreal Engine 5 with Sequencer, studying composition, atmosphere and scale.',
  },

  /* ── motion ────────────────────────────────────────────────────────── */
  {
    id: 'panel-2025',
    title: 'Executive Board 2025',
    collection: 'motion',
    year: '2024',
    tools: ['After Effects', 'Premiere Pro'],
    video: 'panel-2025.mp4',
    image: 'panel-2025.jpg',
    link: BE + '215801875/BUCC-Panel-Video-Executive-Board-2025',
    linkLabel: 'Behance',
    note: 'Five-minute panel reveal for the BRAC University Computer Club, introducing the new executive board with holographic name plates.',
  },
  {
    id: 'achievement-24',
    title: 'Achievements, Panel 24',
    collection: 'motion',
    year: '2024',
    tools: ['After Effects', 'Premiere Pro'],
    video: 'achievement-24.mp4',
    image: 'achievement-24.jpg',
    link: BE + '215801521/Achievement-Video-Panel-24',
    linkLabel: 'Behance',
    note: 'A year in review for the outgoing board: photo collage, ink textures and kinetic type over four minutes.',
  },
  {
    id: 'orientation-spring-24',
    title: 'Orientation, Spring 24',
    collection: 'motion',
    year: '2024',
    tools: ['After Effects', 'Premiere Pro'],
    video: 'orientation-spring-24.mp4',
    image: 'orientation-spring-24.jpg',
    link: BE + '193166523/BUCC-Orientation-Video-SPRING-24',
    linkLabel: 'Behance',
    note: 'Matrix-themed orientation film: terminal boot, digital rain and glowing type inviting freshers to upgrade themselves.',
  },
  {
    id: 'teaser-spring-24',
    title: 'Orientation Teaser, Spring 24',
    collection: 'motion',
    year: '2024',
    tools: ['After Effects'],
    video: 'teaser-spring-24.mp4',
    image: 'teaser-spring-24.jpg',
    link: BE + '193165395/BUCC-Orientation-Teaser-Spring-24',
    linkLabel: 'Behance',
    note: 'Twenty-second teaser: a loading bar, dripping paint and a glitching club mark.',
  },
  {
    id: 'orientation-fall-23',
    title: 'Orientation, Fall 23',
    collection: 'motion',
    year: '2023',
    tools: ['After Effects', 'Premiere Pro'],
    video: 'orientation-fall-23.mp4',
    image: 'orientation-fall-23.jpg',
    link: BE + '193164211/BUCC-Orientation-Video-FALL-23',
    linkLabel: 'Behance',
    note: 'Anime-styled skyline and bold condensed type, announcing the six departments and the freshers orientation.',
  },
  {
    id: 'space-week',
    title: 'World Space Week',
    collection: 'motion',
    year: '2023',
    tools: ['After Effects', 'Premiere Pro'],
    video: 'space-week.mp4',
    image: 'space-week.jpg',
    link: BE + '192832323/World-Space-Week-Video-(IYT)',
    linkLabel: 'Behance',
    note: 'Explainer for IT Today: astronomy, satellites, rockets, orbits and galaxies, each defined in a single spaced-out title card.',
  },
  {
    id: 'bufl-intro',
    title: 'Match Intro, BUFL',
    collection: 'motion',
    year: '2023',
    tools: ['After Effects'],
    video: 'bufl-intro.mp4',
    image: 'bufl-intro.jpg',
    link: BE + '178157183/BUCC-Bruteforce-VS-BUNSC-Warriors-Match-Intro-(BUFL)',
    linkLabel: 'Behance',
    note: 'Comic-book versus card and matchday lower thirds for BUCC Bruteforce against BUNSC Warriors.',
  },
  {
    id: 'orientation-2023',
    title: 'Orientation, Summer 23',
    collection: 'motion',
    year: '2023',
    tools: ['After Effects', 'Premiere Pro'],
    video: 'orientation-2023.mp4',
    image: 'orientation-2023.jpg',
    link: BE + '178155901/BUCC-ORIENTATION-VIDEO-2023',
    linkLabel: 'Behance',
    note: 'Smoke, fire and neon: the first orientation film, from a typewriter opening to a burning Summer 23 reveal.',
  },

  /* ── illustration ──────────────────────────────────────────────────── */
  { id: 'sora', title: 'Sora', collection: 'illustration', year: '2023', tools: ['Illustrator'], image: 'sora.jpg', link: BE + '178155641/Sora-(Kingdom-Hearts)-Illustration', linkLabel: 'Behance', note: 'Kingdom Hearts. Flat vector, sea light and a long shadow.', fit: 'contain' },
  { id: 'madara', title: 'Madara Uchiha', collection: 'illustration', year: '2023', tools: ['Illustrator'], image: 'madara.jpg', link: BE + '178154397/Madara-Uchiha-Illustration', linkLabel: 'Behance', note: 'Naruto Shippuden. Vector portrait against a painted dusk.' },
  { id: 'noctis', title: 'Noctis Lucis Caelum', collection: 'illustration', year: '2023', tools: ['Illustrator'], image: 'noctis.jpg', link: BE + '178154115/Noctis-Lucis-Caelum-Illustration', linkLabel: 'Behance', note: 'Final Fantasy XV. Engine blade and a quiet lean.' },
  { id: 'zoro', title: 'Roronoa Zoro', collection: 'illustration', year: '2023', tools: ['Illustrator'], image: 'zoro.jpg', link: BE + '178152991/Roronoa-Zoro-(One-Piece)-Illustration', linkLabel: 'Behance', note: 'One Piece. Three swords, one in the teeth.' },
  { id: 'alucard', title: 'Alucard', collection: 'illustration', year: '2023', tools: ['Illustrator'], image: 'alucard.jpg', link: BE + '178152747/Alucard-(Castlevania)-Illustration', linkLabel: 'Behance', note: 'Castlevania. Fire, gold trim and a drawn blade.', fit: 'contain' },
  { id: 'aerith', title: 'Aerith Gainsborough', collection: 'illustration', year: '2023', tools: ['Illustrator'], image: 'aerith.jpg', link: BE + '178152457/Aerith-Gainsborough-(Final-Fantasy-VII)-illustration', linkLabel: 'Behance', note: 'Final Fantasy VII. A profile in pink and braid.', fit: 'contain' },
  { id: 'riku', title: 'Riku', collection: 'illustration', year: '2023', tools: ['Illustrator'], image: 'riku.jpg', link: BE + '178152201/Riku-(Kingdom-Hearts-2)-Illustration', linkLabel: 'Behance', note: 'Kingdom Hearts II. Silver hair, blindfold lowered.', fit: 'contain' },
  { id: 'vincent', title: 'Vincent Valentine', collection: 'illustration', year: '2023', tools: ['Illustrator'], image: 'vincent.jpg', link: BE + '178148907/Vincent-Valentine-Illustration', linkLabel: 'Behance', note: 'Final Fantasy VII. Red cloak and a brass claw.' },
  { id: 'gojo', title: 'Satoru Gojo', collection: 'illustration', year: '2023', tools: ['Illustrator'], image: 'gojo.jpg', link: BE + '178148369/Satoru-Gojo-illustration', linkLabel: 'Behance', note: 'Jujutsu Kaisen. The blindfold comes off.' },
]

export const collectionOf = (id: Collection) => collections.find((c) => c.id === id)!
export const pieceUrl = (file: string) => `/creative/${file}`
