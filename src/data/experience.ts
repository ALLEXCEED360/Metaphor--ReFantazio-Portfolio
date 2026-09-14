export interface Experience {
  id: string
  org: string
  role: string
  kind: 'work' | 'teaching' | 'leadership'
  /** decimal years, e.g. 2023.5 = mid 2023 (used for the duration stat) */
  start: number
  end: number
  /** still running: the end is "now" */
  ongoing?: boolean
  period: string
  location: string
  paint: string
  /** character art for the record's portrait (public/art/mobile/chara-N.jpg) */
  portrait: number
  summary: string
  duties: string[]
  tech: string[]
  /** official art for the backdrop (public/art/desktop/wallpaper-N.jpg) */
  art: number
}

export const experience: Experience[] = [
  {
    id: 'cloudy',
    org: 'Cloudy Games LLC',
    role: 'Game Developer',
    kind: 'work',
    start: 2026.0,
    end: 2026.75,
    ongoing: true,
    period: '2026 · present',
    location: 'Remote · Texas, USA',
    paint: '#ea6c1b',
    portrait: 1,
    summary:
      'Working on Dragon Drop and other games and interactive applications across Steam and mobile, from input and networking to UI, touch controls, testing and builds.',
    duties: [
      'Gameplay systems and input with Rewired',
      'Multiplayer with Photon Fusion',
      'UI systems and touch controls for the mobile build',
      'Steam builds and the release pipeline',
      'Playtesting, iteration and bug fixing',
    ],
    tech: ['Unity', 'C#', 'Steam', 'Rewired', 'Photon Fusion', 'Mobile'],
    art: 10,
  },
  {
    id: 'nrbc',
    org: 'NRBC Bank',
    role: 'ICT Intern',
    kind: 'work',
    start: 2025.0,
    end: 2025.6,
    period: '2025',
    location: 'Dhaka, Bangladesh',
    paint: '#f14352',
    portrait: 2,
    summary:
      'First professional role inside an enterprise technology environment: internal software and dashboards for the ICT division.',
    duties: [
      'Internal dashboards on ASP.NET Core MVC',
      'Data access with Entity Framework Core',
      'Work inside an established .NET Framework codebase',
      'Web applications for internal teams',
    ],
    tech: ['ASP.NET Core', '.NET Framework', 'EF Core', 'SQL'],
    art: 1,
  },
  {
    id: 'ta',
    org: 'BRAC University',
    role: 'Undergraduate Teaching Assistant',
    kind: 'teaching',
    start: 2023.0,
    end: 2025.5,
    period: '2023 · 2025',
    location: 'Dhaka, Bangladesh',
    paint: '#a8a800',
    portrait: 3,
    summary: 'Assisted undergraduate courses in the Department of CSE, helping students get comfortable with programming and discrete mathematics.',
    duties: ['Tutorials and problem sessions', 'Programming and Discrete Mathematics support', 'Grading and feedback', 'Office hours'],
    tech: ['Programming', 'Discrete Mathematics', 'CS fundamentals'],
    art: 3,
  },
  {
    id: 'bucc',
    org: 'BRAC University Computer Club',
    role: 'Assistant Director, Creative',
    kind: 'leadership',
    start: 2022.0,
    end: 2024.9,
    period: '2022 · 2024',
    location: 'Dhaka, Bangladesh',
    paint: '#d84291',
    portrait: 4,
    summary:
      'Three years in the club, from general member to assistant director, leading motion design, graphics and video for events and the motion team behind Nocturne.',
    duties: [
      'General Member → Executive → Senior Executive → Assistant Director',
      'Creative Department',
      'Motion team lead',
      'Event graphics, motion and video',
    ],
    tech: ['After Effects', 'Premiere Pro', 'Photoshop', 'Illustrator', 'Figma'],
    art: 2,
  },
  {
    id: 'hult',
    org: 'Hult Prize at BRACU',
    role: 'Executive of Content Planning',
    kind: 'leadership',
    start: 2023.1,
    end: 2023.9,
    period: '2023',
    location: 'Dhaka, Bangladesh',
    paint: '#b94abb',
    portrait: 5,
    summary: 'Planned and produced content for the campus round of the Hult Prize, including the website for the event.',
    duties: ['Content planning and scheduling', 'Event website', 'Graphics and video', 'Coordination across design and communications'],
    tech: ['Content', 'Web', 'Graphics', 'Video'],
    art: 5,
  },
]

export const kindLabel: Record<Experience['kind'], string> = {
  work: 'Work',
  teaching: 'Teaching',
  leadership: 'Leadership',
}
