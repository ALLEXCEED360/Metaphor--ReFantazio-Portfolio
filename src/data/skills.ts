export interface SkillCategory {
  id: string
  title: string
  /** short name for the collapsed banner */
  short: string
  paint: string
  /** character portrait (public/art/mobile/chara-N.jpg) */
  portrait: number
  skills: string[]
}

export const skillCategories: SkillCategory[] = [
  {
    id: 'languages',
    portrait: 1,
    title: 'Languages',
    short: 'Languages',
    paint: '#f14352',
    skills: ['Python', 'C++', 'C#', 'TypeScript', 'JavaScript', 'Java', 'Dart', 'SQL'],
  },
  {
    id: 'frontend',
    portrait: 3,
    title: 'Frontend & Mobile',
    short: 'Frontend',
    paint: '#ea6c1b',
    skills: ['React', 'Next.js', 'Tailwind CSS', 'Flutter'],
  },
  {
    id: 'backend',
    portrait: 2,
    title: 'Backend & Databases',
    short: 'Backend',
    paint: '#d4a900',
    skills: ['Node.js', 'Express', 'FastAPI', '.NET', 'PostgreSQL', 'MongoDB', 'Redis', 'Prisma'],
  },
  {
    id: 'ai',
    portrait: 7,
    title: 'AI · ML · Vision',
    short: 'AI / ML',
    paint: '#0c8e5e',
    skills: ['NumPy', 'Pandas', 'scikit-learn', 'PyTorch', 'OpenCV', 'YOLO', 'ONNX'],
  },
  {
    id: 'games',
    portrait: 4,
    title: 'Game Development',
    short: 'Games',
    paint: '#3a96aa',
    skills: ['Unity', 'Unreal Engine 5', 'Photon Fusion', 'Steamworks'],
  },
  {
    id: 'devops',
    portrait: 6,
    title: 'DevOps & Tools',
    short: 'DevOps',
    paint: '#b94abb',
    skills: ['Docker', 'Git', 'GitHub Actions', 'Git LFS', 'Bash', 'Linux', 'Postman'],
  },
  {
    id: 'design',
    portrait: 5,
    title: 'Creation & Design',
    short: 'Design',
    paint: '#d84291',
    skills: ['Photoshop', 'Illustrator', 'Premiere Pro', 'After Effects', 'Figma'],
  },
]
