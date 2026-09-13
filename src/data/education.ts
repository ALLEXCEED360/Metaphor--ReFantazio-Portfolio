export interface Section {
  label: string
  /** bullet / tag list */
  items?: string[]
  /** ordered progression, rendered with arrows */
  steps?: string[]
  /** free text (used for "The Chapter" reflections) */
  text?: string
}

export interface Milestone {
  id: string
  year: string
  /** short chapter name shown next to the year */
  chapter: string
  title: string
  subtitle: string
  /** major chapters are set larger; minor ones are visually subordinate */
  weight: 'major' | 'minor'
  /** id of the chapter this entry belongs under (rendered nested) */
  parent?: string
  /** official art for the record panel (public/art/desktop/wallpaper-N.jpg) */
  art: number
  /** splat colour for this chapter */
  paint: string
  tags: string[]
  summary: string
  meta?: { label: string; value: string }[]
  sections?: Section[]
}

export const journey: Milestone[] = [
  {
    id: 'sunnydale',
    art: 9,
    paint: '#3a96aa',
    year: '2018–2020',
    chapter: 'Prologue',
    title: 'Sunnydale',
    subtitle: 'O Levels 2018 · A Levels 2020 · Science',
    weight: 'minor',
    tags: ['education'],
    summary: 'Secondary school in the science stream, where mathematics and physics turned into an interest in computing.',
    meta: [
      { label: 'O Levels', value: '2018' },
      { label: 'A Levels', value: '2020' },
    ],
  },
  {
    id: 'brac',
    art: 11,
    paint: '#d4a900',
    year: '2021',
    chapter: 'The Beginning',
    title: 'BRAC University',
    subtitle: 'B.Sc. Computer Science & Engineering',
    weight: 'major',
    tags: ['education'],
    summary: 'Where it started: four years of computer science, mathematics and building things on the side.',
    meta: [{ label: 'CGPA', value: '3.78' }],
    sections: [{ label: 'Focus', items: ['Computer Science', 'Software Development', 'Mathematics'] }],
  },
  {
    id: 'bucc',
    parent: 'brac',
    art: 2,
    paint: '#d84291',
    year: '2022–2024',
    chapter: 'Creative Leadership',
    title: 'BRAC University Computer Club',
    subtitle: 'BUCC · Creative Department · General Member to Assistant Director',
    weight: 'minor',
    tags: ['leadership', 'creative'],
    summary:
      'Three years in the BRAC University Computer Club (BUCC), from general member to assistant director, leading motion design, graphics and video for events and the motion team behind Nocturne.',
    sections: [
      { label: 'Progression', steps: ['General Member', 'Executive', 'Senior Executive', 'Assistant Director'] },
      { label: 'Departments', items: ['Creative Department', 'Royal Department', 'Motion team'] },
      { label: 'Craft', items: ['Motion design', 'Graphic design', 'Video', 'Creative direction'] },
    ],
  },
  {
    id: 'hult',
    parent: 'brac',
    art: 5,
    paint: '#b94abb',
    year: '2023',
    chapter: 'Content & Events',
    title: 'Hult Prize',
    subtitle: 'Hult Prize at BRACU · Executive of Content Planning',
    weight: 'minor',
    tags: ['leadership', 'creative'],
    summary:
      'Planned and produced content for the campus round of the Hult Prize, including the website for the event, working with a team across design, video and communications.',
    sections: [{ label: 'Delivered', items: ['Content planning', 'Event website', 'Graphics & video', 'Team coordination'] }],
  },
  {
    id: 'teaching',
    parent: 'brac',
    art: 3,
    paint: '#a8a800',
    year: '2023–2025',
    chapter: 'Teaching',
    title: 'Undergraduate Teaching Assistant',
    subtitle: 'BRAC University · Department of CSE',
    weight: 'minor',
    tags: ['education', 'teaching'],
    summary: 'Assisted undergraduate courses, helping students get comfortable with programming and discrete mathematics.',
    sections: [{ label: 'Taught', items: ['Programming', 'Discrete Mathematics', 'Computer Science fundamentals'] }],
  },
  {
    id: 'craft',
    art: 7,
    paint: '#3a96aa',
    year: '2022–2024',
    chapter: 'Finding My Craft',
    title: 'Exploration & Development',
    subtitle: 'Software · Games · AI · Creative Technology',
    weight: 'minor',
    tags: ['education', 'development'],
    summary:
      'Explored software engineering, game development, creative technology, AI/ML and interactive experiences while building projects beyond the classroom.',
    sections: [
      {
        label: 'Highlights',
        items: [
          'Full-stack web development',
          'Unity game development',
          'Unreal Engine 5',
          'Computer vision',
          'AI / Machine Learning',
          'Creative design & motion',
        ],
      },
    ],
  },
  {
    id: 'nrbc',
    art: 1,
    paint: '#f14352',
    year: '2025',
    chapter: 'Industry',
    title: 'NRBC Bank',
    subtitle: 'ICT Intern',
    weight: 'major',
    tags: ['work'],
    summary: 'Worked within the ICT division on internal software and dashboard development.',
    sections: [
      {
        label: 'Built with',
        items: ['ASP.NET Core MVC', '.NET Framework', 'Entity Framework Core', 'Internal dashboards', 'Web applications'],
      },
      { label: 'The Chapter', text: 'My first professional experience working within an enterprise technology environment.' },
    ],
  },
  {
    id: 'catcot',
    art: 4,
    paint: '#0c8e5e',
    year: '2025',
    chapter: 'Research',
    title: 'CAT-CoT',
    subtitle: 'Undergraduate Thesis · Research',
    weight: 'major',
    tags: ['research'],
    summary:
      'Instruction-tuning LLMs via Cognitive Appraisal Theory-inspired chain-of-thought reasoning to enhance emotional expressivity. Context-aware reasoning for empathetic conversational AI.',
    meta: [
      { label: 'Grade', value: 'A · 4.00' },
      { label: 'Status', value: 'ARR 2025, under review' },
    ],
    sections: [
      {
        label: 'Research',
        items: [
          'Natural Language Processing',
          'Large Language Models',
          'Empathetic Dialogue',
          'Dataset analysis',
          'Reasoning / response generation',
        ],
      },
    ],
  },
  {
    id: 'building',
    art: 12,
    paint: '#eb523d',
    year: '2025–2026',
    chapter: 'Building',
    title: 'Software & Game Development',
    subtitle: 'Building · Learning · Shipping',
    weight: 'major',
    tags: ['development'],
    summary: 'From coursework to shipping software, games, experiments and interactive experiences.',
    sections: [
      {
        label: 'Built & explored',
        items: ['Unity', 'Unreal Engine 5', 'React', 'Node.js', 'Python', 'C++', 'AI / ML', 'Mobile development', 'Full-stack applications'],
      },
      {
        label: 'The Chapter',
        text: 'Building projects, learning from them, breaking things, rebuilding them, and gradually figuring out what kind of developer I want to become.',
      },
    ],
  },
  {
    id: 'cloudy',
    art: 10,
    paint: '#ea6c1b',
    year: '2026',
    chapter: 'Game Development',
    title: 'Cloudy Games LLC',
    subtitle: 'Game Developer',
    weight: 'major',
    tags: ['work'],
    summary: 'Working on games and interactive applications across Steam and mobile platforms.',
    sections: [
      {
        label: 'Worked with',
        items: ['Unity', 'Steam', 'Mobile', 'Rewired', 'Photon Fusion', 'UI systems', 'Touch controls', 'Testing & builds'],
      },
      {
        label: 'The Chapter',
        text: 'Moving from building games as personal projects to contributing to games intended for real players.',
      },
    ],
  },
  {
    id: 'independent',
    art: 6,
    paint: '#b94abb',
    year: '2026',
    chapter: 'Something of My Own',
    title: 'Independent Projects',
    subtitle: 'Building Things of My Own',
    weight: 'minor',
    tags: ['projects'],
    summary: 'Building practical software that combines engineering, design and experimentation.',
    sections: [
      {
        label: 'Selected projects',
        items: ['Before You Post', 'OmniPlay', 'Echo Lens', 'Game development experiments', 'Developer tools and prototypes'],
      },
      {
        label: 'The Chapter',
        text: 'Less about following tutorials. More about identifying a problem, designing a solution, and actually shipping it.',
      },
    ],
  },
  {
    id: 'gatech',
    art: 13,
    paint: '#d4a900',
    year: '2027',
    chapter: 'The Next Chapter',
    title: 'Georgia Tech',
    subtitle: 'M.S. Computer Science, OMSCS',
    weight: 'major',
    tags: ['education'],
    summary: 'Beginning graduate study at Georgia Tech in January 2027 while continuing to build software and games.',
    meta: [{ label: 'Begins', value: 'January 2027' }],
    sections: [
      { label: 'Focus', items: ['Computer Science', 'Advanced Computing', 'Software Engineering', 'Artificial Intelligence'] },
    ],
  },
]
