export interface MenuEntry {
  id: string
  label: string
  /** giant word shown during the transition wipe */
  word: string
  path: string
  hint: string
}

export const mainMenu: MenuEntry[] = [
  { id: 'journey', label: 'Journey', word: 'Journey', path: '/journey', hint: 'Education & path' },
  { id: 'quests', label: 'Projects', word: 'Quests', path: '/quests', hint: 'Quest log' },
  { id: 'abilities', label: 'Abilities', word: 'Abilities', path: '/abilities', hint: 'Skills & archetypes' },
  { id: 'chronicle', label: 'Experience', word: 'Chronicle', path: '/chronicle', hint: 'Work history' },
  { id: 'research', label: 'Research', word: 'Research', path: '/research', hint: 'Thesis & papers' },
  { id: 'archive', label: 'Creative', word: 'Archive', path: '/archive', hint: 'Motion, cinematics & art' },
  { id: 'profile', label: 'About', word: 'Profile', path: '/profile', hint: 'Character profile' },
  { id: 'contact', label: 'Contact', word: 'Contact', path: '/contact', hint: 'The next journey' },
  { id: 'settings', label: 'Settings', word: 'Settings', path: '/settings', hint: 'Motion, cursor, sound' },
]
