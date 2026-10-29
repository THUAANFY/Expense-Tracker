import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './shared/styles/index.css'
import App from './app/App.jsx'
import StartupBoundary from './app/startup/StartupBoundary'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StartupBoundary>
      <App />
    </StartupBoundary>
  </StrictMode>,
)
