import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App'
import { AuthProvider } from "./context/AuthContext.jsx";
import "./styles/style.css";
import "./styles/navbar.css";
import "./styles/footer.css";
import "./styles/wines.css";
import "./styles/admin.css";
import "./styles/dashboard.css";

// AuthProvider wraps the application so all child components can access AuthContext using useContext.
// https://react.dev/reference/react/createContext
// https://react.dev/learn/passing-data-deeply-with-context

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>,
)
// https://react.dev/reference/react/StrictMode should I delete strictmode after development?

