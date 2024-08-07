import './index.css'
import { AppProvider } from '@/providers'
import { AppContainer } from './containers/appContainer'
import { SearchPage } from './app/features/pages/search'
import { AnimatedBg } from './containers/animationBg'
import { SearchHistory } from './app/features/pages/components/history'


function App() {
  return (
    <AppProvider>
      <AnimatedBg />
      <AppContainer sidebarContent={< SearchHistory />}>
        <SearchPage />
      </AppContainer>
    </AppProvider>
  )
}

export default App
