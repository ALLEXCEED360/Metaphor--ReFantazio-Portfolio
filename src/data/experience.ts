export interface Experience {
  id: string
  year: string
  company: string
  role: string
  tags: string[]
  details: string[]
}

export const experience: Experience[] = [
  {
    id: 'cloudy-games',
    year: '2026',
    company: 'Cloudy Games LLC',
    role: 'Game Developer',
    tags: ['Unity', 'Steam', 'Mobile', 'UI / UX', 'Build & Deployment'],
    details: [
      'Game development across Steam and mobile targets',
      'Mobile controls and input handling',
      'Steam builds and release pipeline',
      'UI implementation',
      'Playtesting and iteration',
      'Gameplay systems',
    ],
  },
  {
    id: 'nrbc-bank',
    year: '2025',
    company: 'NRBC Bank',
    role: 'ICT Intern',
    tags: ['ASP.NET Core', '.NET Framework', 'EF Core', 'Internal Dashboard'],
    details: [
      'Built internal dashboard tooling on ASP.NET Core',
      'Data access with Entity Framework Core',
      'Worked inside an established .NET Framework codebase',
    ],
  },
]
