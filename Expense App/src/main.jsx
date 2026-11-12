import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './shared/styles/index.css'
import App from './app/App.jsx'
import StartupBoundary from './app/startup/StartupBoundary'
import './app/theme/dark.css'
import './app/theme/ThemeTransition.css'
import './shared/components/DialogFields.css'
import './shared/components/DialogChoice.css'
import './shared/components/DialogScrollbars.css'
import './shared/components/DialogDestructive.css'
import './shared/components/FilterTabs.css'
import './app/layout/PageHeading.css'
import './app/layout/Topbar.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StartupBoundary>
      <App />
    </StartupBoundary>
  </StrictMode>,
)
