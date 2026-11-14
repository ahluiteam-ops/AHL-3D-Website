import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import './styles/global.css'
import './styles/smp.css'
import './styles/hair-transplant.css'
import './styles/consult-founder.css'
import './styles/about.css'
import './styles/team.css'
import './styles/story-reels.css'
import './styles/founder-booking.css'
import './styles/consultation-booked.css'
import './styles/book-consultation.css'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
