import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { StrictMode } from 'react'
import { BrowserRouter } from 'react-router-dom';
import { GamerProvider } from './GamerContext.tsx';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <GamerProvider>
      <BrowserRouter>
        <App />
      </BrowserRouter>
    </GamerProvider>
  </StrictMode>,
)
