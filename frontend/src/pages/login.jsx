import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../api/adminApi";

function Login() {
  // Stores the username and password entered in the form.
  // https://react.dev/reference/react/useState
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");

  // Stores login errors without hiding the form.
  const [validationError, setValidationError] = useState("");

  // Used to move to another React route after login.
  // https://reactrouter.com/api/hooks/useNavigate
  const navigate = useNavigate();

  async function submitLogin(event) {
    // Stops the form from refreshing the page.
    // https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
    event.preventDefault();

    try {
      setValidationError("");

      await loginAdmin(username, password);

      // Clears the form after a successful login.
      setUsername("");
      setPassword("");

      navigate("/dashboard");
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
        <input
          id="password"
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          required
        />

        <button type="submit">Login</button>

        {/* Shows the login error but keeps the form visible. */}
        {validationError && <p>{validationError}</p>}
      </form>
    </section>
  );
}

export default Login;