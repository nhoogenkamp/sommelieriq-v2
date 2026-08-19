import { useState } from "react";
import { requestPasswordReset } from "../../api/adminApi";


function ForgotPassword() {

  // Stores the email entered in the form.
  // https://react.dev/reference/react/useState
  const [email, setEmail] = useState("");

  // Stores errors or confirmation messages.
  const [message, setMessage] = useState("");

  async function submitResetRequest(event) {
    event.preventDefault();

    try {
      setMessage("");
      const result = await requestPasswordReset(email);
      setMessage(result.message);
      setEmail("");
    } catch (error) {
      setMessage(error.message);
    }
  }


  return (
    <section>
      <form className="login-form" onSubmit={submitResetRequest}>
        <h1>Forgot Password</h1>
        <p>
          Enter your email address to receive a password reset link.
        </p>

        <label htmlFor="email">
          Email
        </label>

        <input
          id="email"
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

        <button type="submit">
          Send Reset Link
        </button>

        {message && <p>{message}</p>}

      </form>
    </section>
  );
}


export default ForgotPassword;