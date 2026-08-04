import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import "./styles/style.css";
import "./styles/navbar.css";
import "./styles/footer.css";
import "./styles/wines.css";
import "./styles/admin.css";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
// https://react.dev/reference/react/StrictMode should I delete strictmode after development?

