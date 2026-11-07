import { showStartupFailure, startStartupScreen } from './app/startup/startup'
import { initializeAppearance } from './app/theme/appearance'

initializeAppearance()
startStartupScreen()
// Entry failures release the splash and retain the existing reload/recovery flow.
import('./main.jsx').catch(showStartupFailure)
