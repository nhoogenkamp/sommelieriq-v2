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

        <h1>Admin is logged in</h1>
       
    </section>
  );
}

export default Login;