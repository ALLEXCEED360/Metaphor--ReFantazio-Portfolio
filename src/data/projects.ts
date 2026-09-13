export type ProjectStatus = 'complete' | 'in-progress' | 'under-review' | 'released' | 'testing'

export interface ProjectLink {
  label: string
  href: string
  kind: 'github' | 'steam' | 'artstation' | 'web'
}

export interface Project {
  id: string
  title: string
  tagline: string
  /** main quests are the flagship pieces; side quests are smaller tools & experiments */
  tier: 'main' | 'side'
  category: string
  platform: string
  role: string
  year: string
  description: string
  technologies: string[]
  features: string[]
  architecture: string[]
  links: ProjectLink[]
  status: ProjectStatus
  /** splat colour for this quest */
  paint: string
  /** project images under public/projects/… (first one is the hero) */
  images?: string[]
  /** phone screenshots are shown as a row of frames instead of one wide hero */
  portrait?: boolean
  /** official art fallback for the backdrop (public/art/desktop/wallpaper-N.jpg) */
  art: number
}

export const projects: Project[] = [
  /* ── main quests ─────────────────────────────────────────────────────── */
  {
    id: 'dragon-drop',
    title: 'Dragon Drop',
    tagline: 'Drop the dragons and don’t get dropped: a frantic party game for up to four players',
    tier: 'main',
    category: 'Steam release',
    platform: 'Steam · Unity',
    role: 'Game Developer, Cloudy Games LLC',
    year: '2026',
    description:
      'A four-player party game on a checkerboard arena: breathe fire to wipe away lines of cubes and drop your rivals off the map. Published by Cloudy Games LLC on Steam (Early Access since June 2022). I work on the game across Steam and mobile: input with Rewired, networking with Photon Fusion, UI systems, touch controls, testing and builds.',
    technologies: ['Unity', 'C#', 'Steam', 'Rewired', 'Photon Fusion', 'Mobile'],
    features: [
      'Up to four players or bots across dozens of stages',
      'Pico Dragon customisation with hats and colours',
      'Achievement boards that unlock stages, songs and rewards',
      'Touch controls and a mobile build alongside Steam',
      'Steam builds and release pipeline',
    ],
    architecture: ['Input (Rewired)', 'Game loop', 'Photon Fusion', 'UI systems', 'Steam / mobile builds'],
    links: [{ label: 'Steam', href: 'https://store.steampowered.com/app/1581500/Dragon_Drop/', kind: 'steam' }],
    status: 'released',
    paint: '#ea6c1b',
    images: ['/projects/dragon-drop/shot-1.jpg', '/projects/dragon-drop/shot-2.jpg', '/projects/dragon-drop/shot-3.jpg', '/projects/dragon-drop/shot-4.jpg'],
    art: 10,
  },
  {
    id: 'omniplay',
    title: 'OmniPlay',
    tagline: 'One identity. Every game. Your entire gaming history.',
    tier: 'main',
    category: 'Web platform',
    platform: 'Web · TypeScript monorepo',
    role: 'Solo developer',
    year: '2026',
    description:
      'A personal gaming identity platform that unifies what you own, have owned, played and finished across Steam, Xbox and PlayStation into a single canonical record, with every fact traceable to its source. Provider ingestion feeds a normalisation and game-resolution layer into a canonical database that powers library, timeline, stats, achievements and profile.',
    technologies: ['TypeScript', 'Node 22', 'pnpm workspaces', 'PostgreSQL', 'Redis', 'Docker', 'IGDB'],
    features: [
      'Steam and Xbox via credentials, PlayStation via export files',
      'Normalisation and game resolution into one canonical library',
      'Timeline, stats, achievements and profile views',
      'Demo pipeline that seeds a fixture library through the real ingestion path',
      'Encrypted provider credentials, sessions, Google sign-in',
    ],
    architecture: ['Providers', 'Normalisation', 'Game resolution', 'Canonical DB', 'Library · Timeline · Stats'],
    links: [{ label: 'GitHub', href: 'https://github.com/ALLEXCEED360/OmniPlay', kind: 'github' }],
    status: 'in-progress',
    paint: '#d4a900',
    art: 9,
  },
  {
    id: 'before-you-post',
    title: 'Before You Post',
    tagline: 'Find faces, personal details and QR codes in a photo, then hide them before you share it',
    tier: 'main',
    category: 'Android application',
    platform: 'Android · Flutter',
    role: 'Solo developer',
    year: '2026',
    description:
      'A privacy-first Android app. Three ML Kit detectors (faces, text, barcodes) run on the device, recognised text is checked against hand-written rules for card numbers, security codes, API keys, phone numbers, addresses, number plates, emails and links, and the user decides what to blur or black out. No backend, no account, no uploads. In closed testing on Google Play.',
    technologies: ['Flutter', 'Dart', 'Google ML Kit', 'Android'],
    features: [
      'Face, text and barcode detection running concurrently',
      'Luhn-validated card numbers, labelled security codes, issued-prefix API keys',
      'Every finding is a potential risk; nothing is hidden without a choice',
      'Drag-to-draw redaction for anything the scan missed',
      'Redaction works on decoded pixels, so any format the phone can open is supported',
      'Findings are numbered on the image and in the list, and linked both ways',
    ],
    architecture: ['Image', 'Faces · OCR · QR', 'Sensitive-text rules', 'Privacy engine', 'Review', 'Redaction', 'Protected image'],
    links: [{ label: 'GitHub', href: 'https://github.com/ALLEXCEED360/Before-You-Post', kind: 'github' }],
    status: 'testing',
    paint: '#f14352',
    images: ['/projects/before-you-post/home-light.png', '/projects/before-you-post/editor-text.png', '/projects/before-you-post/result.png'],
    portrait: true,
    art: 12,
  },
  {
    id: 'echo-lens',
    title: 'Echo Lens',
    tagline: 'Turn hours of raw video into a searchable, evidence-backed knowledge base',
    tier: 'main',
    category: 'Multimodal video intelligence',
    platform: 'Python · GPU',
    role: 'Solo developer',
    year: '2026',
    description:
      'Video goes through multimodal perception, a structured representation, retrieval and reasoning, and comes out as answers linked to the exact moment they came from, not video → LLM → answer. Transcription on the GPU with faster-whisper, on-screen text with RapidOCR, chapters from embedding-based TextTiling, hybrid retrieval over pgvector and full-text search, and a benchmark that found real bugs before the pitch did.',
    technologies: ['Python', 'faster-whisper', 'RapidOCR', 'pgvector', 'PostgreSQL', 'FFmpeg'],
    features: [
      'Chunked upload to 16 GB with range streaming and seek',
      'Per-video voice-activity and hotword controls for transcription',
      'Keyframe-only decode with perceptual dedup, ~1000× realtime',
      'Hybrid retrieval at ~60 ms, answers with clickable timestamps',
      'Collections, export, and an evaluation that measured the whole thing',
    ],
    architecture: ['Video', 'Perception', 'Structure', 'Retrieval', 'Reasoning', 'Evidence'],
    links: [{ label: 'GitHub', href: 'https://github.com/ALLEXCEED360/Echolens', kind: 'github' }],
    status: 'complete',
    paint: '#0c8e5e',
    art: 4,
  },
  {
    id: 'isle-of-echoes',
    title: 'Isle of Echoes',
    tagline: 'An island environment and cinematic built in Unreal Engine 5',
    tier: 'main',
    category: 'Environment art · Cinematic',
    platform: 'Unreal Engine 5',
    role: 'Environment artist',
    year: '2026',
    description:
      'An intricately designed island surrounded by open ocean, built with a focus on atmosphere, composition and cinematic presentation. The project explores environmental storytelling through world building, composed landscapes, lighting and camera work, so the location reads as a believable place rather than a collection of assets.',
    technologies: ['Unreal Engine 5', 'Lumen', 'Cinematics', 'Premiere Pro', 'After Effects'],
    features: ['Landscape and ocean composition', 'Lighting and atmosphere', 'Cinematic camera sequences', 'Edited and graded in Premiere and After Effects'],
    architecture: ['Blockout', 'Landscape', 'Set dressing', 'Lighting', 'Sequencer', 'Edit'],
    links: [{ label: 'ArtStation', href: 'https://www.artstation.com/artwork/WdKn1J', kind: 'artstation' }],
    status: 'complete',
    paint: '#3a96aa',
    images: ['/projects/isle-of-echoes/cover.jpg', '/projects/isle-of-echoes/clip-1.jpg', '/projects/isle-of-echoes/clip-2.jpg'],
    art: 15,
  },
  {
    id: 'cat-cot',
    title: 'CAT-CoT',
    tagline: 'Instruction-tuning LLMs with cognitive-appraisal chain-of-thought for emotional expressivity',
    tier: 'main',
    category: 'Research · Thesis',
    platform: 'NLP · Large language models',
    role: 'Author',
    year: '2025',
    description:
      'Undergraduate thesis: a chain-of-thought scheme inspired by Cognitive Appraisal Theory that has a language model read the emotional context of a conversation, reason about it explicitly, and only then respond. Trained on a curated subset of EmpatheticDialogues (24,850 → 16,789 samples). Graded A (4.00); under review at ARR 2025.',
    technologies: ['Python', 'PyTorch', 'Transformers', 'EmpatheticDialogues'],
    features: ['Appraisal-driven reasoning stage before generation', 'Instruction-tuning pipeline', 'Curated dataset with quality filtering', 'Empathy and relevance evaluation'],
    architecture: ['Input', 'Context', 'Appraisal', 'Reasoning', 'Response'],
    links: [],
    status: 'under-review',
    paint: '#b94abb',
    art: 3,
  },

  /* ── side quests ─────────────────────────────────────────────────────── */

  /* ── side quests ─────────────────────────────────────────────────────── */
  {
    id: 'oracle-lens',
    title: 'Oracle Lens',
    tagline: 'Real-time object detection in the browser with YOLOv8',
    tier: 'side',
    category: 'Computer vision',
    platform: 'Python · Web',
    role: 'Solo developer',
    year: '2025',
    description:
      'A web app that turns a webcam into a detection stream: YOLOv8n over 80 classes with a live FPS counter, a dual-quality path for streaming versus high-quality captures, and timestamped downloads.',
    technologies: ['Python', 'YOLOv8', 'OpenCV', 'Node.js'],
    features: ['Live detection stream', 'High-quality manual captures', 'Detection metrics and FPS', 'Glassmorphism UI'],
    architecture: ['Webcam', 'YOLOv8', 'Stream', 'Browser'],
    links: [{ label: 'GitHub', href: 'https://github.com/ALLEXCEED360/Real-time-object-detection-with-YOLOv8', kind: 'github' }],
    status: 'complete',
    paint: '#a8a800',
    art: 11,
  },
  {
    id: 'gesture-painting',
    title: 'Gesture Painting Suite',
    tagline: 'Draw, hover, erase and change colours with hand gestures',
    tier: 'side',
    category: 'Computer vision',
    platform: 'Python',
    role: 'Solo developer',
    year: '2025',
    description:
      'An interactive drawing app driven entirely by hand gestures from a webcam: index finger draws, two fingers hover, an open hand erases, a thumb cycles the palette. Smooth interpolated strokes on a persistent canvas over the live feed.',
    technologies: ['Python', 'OpenCV', 'MediaPipe'],
    features: ['Four gesture modes', 'Ten-colour palette', 'Persistent canvas with save', 'Left and right hand detection'],
    architecture: ['Webcam', 'Hand landmarks', 'Gesture state', 'Canvas'],
    links: [{ label: 'GitHub', href: 'https://github.com/ALLEXCEED360/Gesture-Powered-Digital-Painting-Suite', kind: 'github' }],
    status: 'complete',
    paint: '#3a96aa',
    art: 5,
  },
  {
    id: 'daily-report-automation',
    title: 'Daily Report Automation',
    tagline: 'Report images in, filled Excel template out',
    tier: 'side',
    category: 'Automation',
    platform: 'Next.js · Gemini',
    role: 'Solo developer',
    year: '2025',
    description:
      'A Next.js tool that reads eight kinds of daily report images (batch, day, shift, handwritten, lottery) with Google Gemini and writes the numbers into an Excel template while preserving formulas, tables and formatting.',
    technologies: ['Next.js', 'TypeScript', 'Gemini API', 'Tailwind', 'Radix UI'],
    features: ['Eight report processors', 'Template upload and download', 'Formula-preserving Excel writes', 'Responsive UI'],
    architecture: ['Image', 'Gemini extraction', 'Validation', 'Excel template'],
    links: [{ label: 'GitHub', href: 'https://github.com/ALLEXCEED360/Daily-Report-Automation', kind: 'github' }],
    status: 'complete',
    paint: '#d4a900',
    art: 13,
  },
]

export const statusLabel: Record<ProjectStatus, string> = {
  complete: 'Complete',
  'in-progress': 'In progress',
  'under-review': 'Under review',
  released: 'Released on Steam',
  testing: 'Closed testing',
}
