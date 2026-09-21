import { useState, useContext } from "react";
import { useNavigate, NavLink } from "react-router-dom";
import { loginAdmin } from "../../api/adminApi";
import { AuthContext } from "../../context/AuthContext";
import { Icon } from "react-icons-kit";
import { eyeOff } from "react-icons-kit/feather/eyeOff";
import { eye } from "react-icons-kit/feather/eye";

function Login() {
  // Stores the username and password entered in the form.
  // https://react.dev/reference/react/useState
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // https://dev.to/annaqharder/hideshow-password-in-react-513a
  // password icon for reading 
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(eyeOff);

  // Stores login errors without hiding the form.
  const [validationError, setValidationError] = useState("");

  // Reads the login function in AuthContext.
  // useContext allows a child component to access values
  // https://react.dev/reference/react/useContext
  const { login } = useContext(AuthContext);

  // Used to move to another React route after login.
  // https://reactrouter.com/api/hooks/useNavigate
  const navigate = useNavigate();

  const handleToggle = () => {
    if (type === "password") {
      setIcon(eye);
      setType("text");
    } else {
      setIcon(eyeOff);
      setType("password");
    }
  };

  async function submitLogin(event) {
    // Stops the form from refreshing the page.
    // https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
    event.preventDefault();

    try {
      setValidationError("");

      const admin = await loginAdmin(username, password);

      // Stores the successfully logged-in user's information
      // inside Admin AuthContext so other components can access it.
      login(admin);

      // Clears the form after a successful login.
      setUsername("");
      setPassword("");

      navigate(`/admin/restaurants/${admin.restaurant_slug}/dashboard`);
    } catch (error) {
      setValidationError(error.message);

      // Clears the password after a failed login.
      setPassword("");
    }
  }

  return (
    <section>
      <form className="login-form" onSubmit={submitLogin}>
        <h1>Admin Login</h1>
        <p>Please fill in your username and password.</p>

        <label htmlFor="username">Username</label>
        <input
          id="username"
          type="text"
          placeholder="Enter Username"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          required
        />

        <label htmlFor="password">Password</label>
        <div className="password-input-container">
        <input
          id="password"
          type={type}
          placeholder="Enter Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <span
          className="password-toggle"
          onClick={handleToggle}
          role="button"
          tabIndex={0}
          aria-label={type === "password" ? "Show password" : "Hide password"}
        >
          <Icon
            icon={icon}
            size={25}
          />
        </span>
        </div>

        <button type="submit">Login</button>

        <p>
          <NavLink
            className="forgot-password-button"
            to="/forgot-password"
          >
            Forgot Password?
          </NavLink>
        </p>

        <p>
          <NavLink
            className="forgot-password-button"
            to="/signup?plan=professional"
          >
            Create an account
          </NavLink>
        </p>

        {/* Shows the login error but keeps the form visible. */}
        {validationError && <p>{validationError}</p>}
      </form>
    </section>
  );
}

export default Login;