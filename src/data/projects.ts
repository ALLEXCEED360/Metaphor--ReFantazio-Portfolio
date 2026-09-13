export type ProjectStatus = 'complete' | 'in-progress' | 'under-review' | 'archived'

export interface Project {
  id: string
  index: string
  title: string
  tagline: string
  category: string
  platform: string
  type: string
  description: string
  technologies: string[]
  features: string[]
  architecture: string[]
  github?: string
  liveDemo?: string
  caseStudy?: string
  status: ProjectStatus
  /** Which official art to use as the detail backdrop (public/art/desktop/wallpaper-N.jpg) */
  art: number
}

export const projects: Project[] = [
  {
    id: 'before-you-post',
    index: '01',
    title: 'Before You Post',
    tagline: 'Privacy-first image processing',
    category: 'Android Application',
    platform: 'Android',
    type: 'Privacy / Computer Vision',
    description:
      'A privacy-first Android application that detects sensitive information in images and automatically obscures it before anything leaves the device.',
    technologies: ['Flutter', 'Dart', 'Google ML Kit', 'Android'],
    features: [
      'Face detection',
      'OCR',
      'Sensitive text detection',
      'QR / barcode detection',
      'Blur / pixelation',
      'Manual redaction',
      'Gallery integration',
      'Share workflow',
    ],
    architecture: [
      'Camera / Gallery',
      'Image Processing',
      'ML Kit Detection',
      'Sensitive Region Mapping',
      'Redaction',
      'Export / Share',
    ],
    github: 'https://github.com/aryanalam/before-you-post', // TODO: confirm
    status: 'complete',
    art: 12,
  },
  {
    id: 'omniplay',
    index: '02',
    title: 'Omniplay',
    tagline: 'One place to play', // TODO: real tagline
    category: 'Software',
    platform: 'Web',
    type: 'Application',
    description:
      'Omniplay — description pending. Replace this text in src/data/projects.ts with the real summary of what the project does and why it matters.', // TODO
    technologies: ['React', 'Node.js', 'PostgreSQL'], // TODO: confirm
    features: ['Feature one', 'Feature two', 'Feature three'], // TODO
    architecture: ['Client', 'API', 'Database'], // TODO
    status: 'in-progress',
    art: 9,
  },
  {
    id: 'echo-lens',
    index: '03',
    title: 'Echo Lens',
    tagline: 'See what you hear', // TODO
    category: 'Software',
    platform: 'Mobile',
    type: 'Application',
    description: 'Echo Lens — description pending. Replace this text in src/data/projects.ts.', // TODO
    technologies: ['Flutter', 'Dart'], // TODO
    features: ['Feature one', 'Feature two', 'Feature three'], // TODO
    architecture: ['Input', 'Processing', 'Output'], // TODO
    status: 'complete',
    art: 4,
  },
  {
    id: 'dragon-drop',
    index: '04',
    title: 'Dragon Drop',
    tagline: 'A game about letting go', // TODO
    category: 'Game',
    platform: 'PC',
    type: 'Game',
    description: 'Dragon Drop — description pending. Replace this text in src/data/projects.ts.', // TODO
    technologies: ['Unity', 'C#'], // TODO
    features: ['Feature one', 'Feature two', 'Feature three'], // TODO
    architecture: ['Input', 'Game Loop', 'Rendering'], // TODO
    status: 'complete',
    art: 2,
  },
  {
    id: 'cat-cot',
    index: '05',
    title: 'CAT-CoT',
    tagline: 'Context-aware thought chain for empathetic dialogue',
    category: 'Research',
    platform: 'NLP',
    type: 'Large Language Models',
    description:
      'A context-aware chain-of-thought framework that lets language models reason about emotional context before responding, producing measurably more empathetic dialogue.',
    technologies: ['Python', 'PyTorch', 'Transformers', 'EmpatheticDialogues'],
    features: [
      'Context extraction stage',
      'Structured reasoning chain',
      'Empathy-conditioned generation',
      'Dataset curation: 24,850 → 16,789 samples',
    ],
    architecture: ['Input', 'Context', 'Reasoning', 'Empathy', 'Response'],
    status: 'under-review',
    art: 3,
  },
  {
    id: 'roll-a-ball',
    index: '06',
    title: 'Roll-a-Ball',
    tagline: 'Where the journey started',
    category: 'Game',
    platform: 'PC',
    type: '3D Game',
    description:
      'A complete take on the classic Unity starter — physics-driven movement, collectibles, camera follow and a win state. Small on purpose, and the first thing I ever shipped in an engine.',
    technologies: ['Unity', 'C#'],
    features: ['Rigidbody movement', 'Collectible system', 'Camera follow', 'Win / reset loop'],
    architecture: ['Input', 'Physics', 'Collectibles', 'UI'],
    status: 'archived',
    art: 11,
  },
]

export const statusLabel: Record<ProjectStatus, string> = {
  complete: 'Complete',
  'in-progress': 'In Progress',
  'under-review': 'Under Review',
  archived: 'Archived',
}

export const statusFill: Record<ProjectStatus, number> = {
  complete: 1,
  'in-progress': 0.6,
  'under-review': 0.85,
  archived: 1,
}
