export type ArchiveKind = 'Motion' | 'Graphics' | 'Illustration' | 'UI' | 'Video'

export interface ArchiveItem {
  id: string
  title: string
  kind: ArchiveKind
  tool: string
  /** path under /public — drop your own pieces into public/archive/ and reference them here */
  src?: string
  /** fallback official art index (public/art/desktop/wallpaper-N.jpg) while real pieces are pending */
  art?: number
}

export const archiveCategories: ArchiveKind[] = ['Motion', 'Graphics', 'Illustration', 'UI', 'Video']

// TODO: replace the `art` fallbacks with your own pieces in public/archive/
export const archive: ArchiveItem[] = [
  { id: 'a1', title: 'BUCC Event Motion Reel', kind: 'Motion', tool: 'After Effects', art: 12 },
  { id: 'a2', title: 'Poster Series', kind: 'Graphics', tool: 'Photoshop', art: 2 },
  { id: 'a3', title: 'Character Study', kind: 'Illustration', tool: 'Illustrator', art: 6 },
  { id: 'a4', title: 'Dashboard Concept', kind: 'UI', tool: 'Figma', art: 3 },
  { id: 'a5', title: 'Trailer Cut', kind: 'Video', tool: 'Premiere Pro', art: 10 },
  { id: 'a6', title: 'Brand Marks', kind: 'Graphics', tool: 'Illustrator', art: 1 },
]
