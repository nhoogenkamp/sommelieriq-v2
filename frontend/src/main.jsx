import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import "./styles/style.css";
import "./styles/navbar.css";
import "./styles/footer.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
