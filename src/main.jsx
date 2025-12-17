import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import '../src/styles/global.scss'

createRoot(document.getElementById('root')).render(
  // <StrictMode>
    <App />
  // </StrictMode>,
)
