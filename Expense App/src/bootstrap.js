import { showStartupFailure, startStartupScreen } from './startup'

startStartupScreen()
// Entry failures release the splash and retain the existing reload/recovery flow.
import('./main.jsx').catch(showStartupFailure)
