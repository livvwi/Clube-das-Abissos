import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { AuthProvider } from './contexts/AuthContext.tsx'
import { PreferencesProvider } from './contexts/PreferencesContext.tsx'
import { NotificationsProvider } from './contexts/NotificationsContext.tsx'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AuthProvider>
      <PreferencesProvider>
        <NotificationsProvider>
          <App />
        </NotificationsProvider>
      </PreferencesProvider>
    </AuthProvider>
  </StrictMode>,
)
