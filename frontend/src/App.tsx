import './index.css'
import { AppProvider } from '@/providers'
import { AppContainer } from './containers/appContainer'
import { SearchPage } from './app/features/pages/search'
import { AnimatedBg } from './containers/animationBg'
import { SearchHistory } from './app/features/pages/components/history'
import { Finder } from './app/features/pages/components/findex'


function App() {
  return (
    <AppProvider>
      <AnimatedBg />
      <AppContainer 
        headerContent={<Finder />}
        sidebarContent={< SearchHistory />}>
        <SearchPage />
      </AppContainer>
    </AppProvider>
  )
}

export default App
