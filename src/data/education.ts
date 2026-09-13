export interface Milestone {
  id: string
  year: string
  title: string
  subtitle: string
  kind: 'education' | 'work'
  meta?: { label: string; value: string }[]
  courses?: string[]
  note?: string
}

export const journey: Milestone[] = [
  {
    id: 'brac',
    year: '2021',
    title: 'BRAC University',
    subtitle: 'B.Sc. Computer Science & Engineering',
    kind: 'education',
    meta: [{ label: 'CGPA', value: '3.78' }],
    courses: ['Linear Algebra', 'Differential Equations', 'Complex Variables', 'Data Science'],
  },
  {
    id: 'dev',
    year: '2025',
    title: 'Software & Game Development',
    subtitle: 'Building projects, learning, growing',
    kind: 'work',
    note: 'Shipped mobile and Steam builds, internal tooling, and a research paper.',
  },
  {
    id: 'gatech',
    year: '2027',
    title: 'Georgia Tech',
    subtitle: 'M.S. Computer Science',
    kind: 'education',
    note: 'The next chapter.',
  },
]
