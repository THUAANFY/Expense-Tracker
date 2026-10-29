import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import StartupBoundary from './components/StartupBoundary'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <StartupBoundary>
      <App />
    </StartupBoundary>
  </StrictMode>,
)
