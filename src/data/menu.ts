export interface MenuEntry {
  id: string
  label: string
  path: string
  hint: string
}

export const mainMenu: MenuEntry[] = [
  { id: 'journey', label: 'Journey', path: '/journey', hint: 'Education & path' },
  { id: 'quests', label: 'Projects', path: '/quests', hint: 'Quest log' },
  { id: 'abilities', label: 'Abilities', path: '/abilities', hint: 'Skills & tools' },
  { id: 'chronicle', label: 'Experience', path: '/chronicle', hint: 'Work history' },
  { id: 'research', label: 'Research', path: '/research', hint: 'Thesis & papers' },
  { id: 'archive', label: 'Creative', path: '/archive', hint: 'Motion, cinematics & art' },
  { id: 'profile', label: 'About', path: '/profile', hint: 'Character profile' },
  { id: 'contact', label: 'Contact', path: '/contact', hint: 'The next journey' },
  { id: 'settings', label: 'Settings', path: '/settings', hint: 'Cursor, music, sound' },
]
