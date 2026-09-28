import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import 'lenis/dist/lenis.css'
import './styles.css'
import './site.css'
import { applyDesignScale } from './hooks/useDesignScale'

// escala antes do primeiro render — ver applyDesignScale
applyDesignScale()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
