import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
// Consolidated root styles (imports variables, base, tailwind, and components)
import './index.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
