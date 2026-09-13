export type Level = 'Advanced' | 'Proficient' | 'Intermediate' | 'Familiar'

export interface SkillGroup {
  id: string
  title: string
  accent: 'red' | 'teal' | 'gold' | 'blue'
  skills: { name: string; level: Level }[]
}

export const skillGroups: SkillGroup[] = [
  {
    id: 'programming',
    title: 'Programming',
    accent: 'red',
    skills: [
      { name: 'Python', level: 'Advanced' },
      { name: 'C++', level: 'Proficient' },
      { name: 'JavaScript', level: 'Proficient' },
      { name: 'Dart', level: 'Proficient' },
    ],
  },
  {
    id: 'game',
    title: 'Game Development',
    accent: 'teal',
    skills: [
      { name: 'Unity', level: 'Proficient' },
      { name: 'Unreal', level: 'Intermediate' },
      { name: 'Godot', level: 'Familiar' },
    ],
  },
  {
    id: 'web',
    title: 'Web',
    accent: 'gold',
    skills: [
      { name: 'React', level: 'Proficient' },
      { name: 'Node.js', level: 'Proficient' },
      { name: 'PostgreSQL', level: 'Proficient' },
    ],
  },
  {
    id: 'creative',
    title: 'Creative Tools',
    accent: 'blue',
    skills: [
      { name: 'Photoshop', level: 'Proficient' },
      { name: 'Illustrator', level: 'Proficient' },
      { name: 'After Effects', level: 'Intermediate' },
      { name: 'Figma', level: 'Proficient' },
    ],
  },
]

export interface Archetype {
  id: string
  title: string
  lines: string[]
  tags: string[]
  /** official character art used as the backdrop (public/art/mobile/chara-N.jpg) */
  art: number
}

export const archetypes: Archetype[] = [
  {
    id: 'engineer',
    title: 'Engineer',
    lines: ['Software systems', 'Web applications', 'Development tools'],
    tags: ['Python', 'C++', 'React', 'Node', 'SQL'],
    art: 1,
  },
  {
    id: 'creator',
    title: 'Creator',
    lines: ['Game development', 'UI', 'Motion / visual work'],
    tags: ['Unity', 'Unreal', 'Figma', 'After Effects'],
    art: 3,
  },
  {
    id: 'researcher',
    title: 'Researcher',
    lines: ['AI', 'ML', 'NLP'],
    tags: ['PyTorch', 'Transformers', 'LLMs'],
    art: 2,
  },
  {
    id: 'builder',
    title: 'Builder',
    lines: ['Personal projects', 'Experiments', 'Tools'],
    tags: ['Flutter', 'Godot', 'CLI'],
    art: 7,
  },
]
