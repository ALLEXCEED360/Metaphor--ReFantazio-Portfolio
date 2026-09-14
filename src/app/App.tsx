import { cloneElement } from 'react'
import { SettingsProvider } from './settings'
import { RouterProvider, useNav } from './router'
import { Wipe } from '../components/Wipe'
import { Cursor } from '../components/Cursor'
import { Music } from './music'
import { Boot } from '../screens/Boot'
import { MainMenu } from '../screens/MainMenu'
import { Profile } from '../screens/Profile'
import { Journey } from '../screens/Journey'
import { Quests } from '../screens/Quests'
import { Abilities } from '../screens/Abilities'
import { Chronicle } from '../screens/Chronicle'
import { Research } from '../screens/Research'
import { Archive } from '../screens/Archive'
import { Contact } from '../screens/Contact'
import { Settings } from '../screens/Settings'

function Screens() {
  const { route } = useNav()
  const key = route.screen === 'quest' ? 'quests' : route.screen

  let el: JSX.Element
  switch (route.screen) {
    case 'boot':
      el = <Boot />
      break
    case 'menu':
      el = <MainMenu />
      break
    case 'profile':
      el = <Profile />
      break
    case 'journey':
      el = <Journey />
      break
    case 'quests':
      el = <Quests />
      break
    case 'quest':
      el = <Quests initialId={route.id} />
      break
    case 'abilities':
      el = <Abilities />
      break
    case 'chronicle':
      el = <Chronicle />
      break
    case 'research':
      el = <Research />
      break
    case 'archive':
      el = <Archive />
      break
    case 'contact':
      el = <Contact />
      break
    case 'settings':
      el = <Settings />
      break
  }

  // no exit choreography here: the word wipe covers the swap, and waiting on
  // exit animations could leave the old screen stranded (a black screen)
  return cloneElement(el, { key })
}

export default function App() {
  return (
    <SettingsProvider>
      <RouterProvider>
        <Screens />
        <Wipe />
        <Cursor />
        <Music />
      </RouterProvider>
    </SettingsProvider>
  )
}
