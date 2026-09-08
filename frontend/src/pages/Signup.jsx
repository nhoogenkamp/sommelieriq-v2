import { useState } from "react";
import { useSearchParams } from "react-router-dom";

function Signup() {
  // Stores the company and restaurant information entered in the form.
  // https://react.dev/reference/react/useState
  const [companyName, setCompanyName] = useState("");
  const [restaurantName, setRestaurantName] = useState("");
  const [outletName, setOutletName] = useState("");
  const [city, setCity] = useState("");
  const [email, setEmail] = useState("");

  // Stores the owner's login information.
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  // Stores signup errors without hiding the form.
  const [validationError, setValidationError] = useState("");

  // Reads the selected subscription plan from the URL.
  // For example: /signup?plan=essential
  // https://reactrouter.com/api/hooks/useSearchParams
  const [searchParams] = useSearchParams();
  const selectedPlan = searchParams.get("plan");

  async function submitSignup(event) {
    // Stops the form from refreshing the page.
    // https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
    event.preventDefault();

    try {
      setValidationError("");

      if (password !== confirmPassword) {
        setValidationError("Passwords do not match");
        return;
      }

      const signup = await signupRestaurant(companyName, restaurantName,outletName,city,email, username, password,selectedPlan);

      // Clears the form after a successful signup.
      setCompanyName("");
      setRestaurantName("");
      setOutletName("");
      setCity("");
      setEmail("");
      setUsername("");
      setPassword("");
      setConfirmPassword("");

      // Redirects the customer to the Stripe hosted Checkout page.
      window.location.href = signup.checkout_url;

    } catch (error) {
      setValidationError(error.message);
    }
  }

  return (
    <section>
      <form className="login-form" onSubmit={submitSignup}>
        <h1>Restaurant Signup</h1>
        <p>Please fill in your restaurant and account details.</p>

        <h2>{selectedPlan === "essential"
            ? "Essential Plan"
            : "Professional Plan"}
        </h2>

        <label htmlFor="companyName">Company Name</label>
        <input
          id="companyName"
          type="text"
          placeholder="Enter Company Name"
          value={companyName}
          onChange={(event) => setCompanyName(event.target.value)}
          required
        />

        <label htmlFor="restaurantName">Restaurant Name</label>
        <input
          id="restaurantName"
          type="text"
          placeholder="Enter Restaurant Name"
          value={restaurantName}
          onChange={(event) => setRestaurantName(event.target.value)}
          required
        />

        <label htmlFor="outletName">Outlet Name</label>
        <input
          id="outletName"
          type="text"
          placeholder="Enter Outlet Name"
          value={outletName}
          onChange={(event) => setOutletName(event.target.value)}
          required
        />

        <label htmlFor="city">City</label>
        <input
          id="city"
          type="text"
          placeholder="Enter City"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          required
        />

        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          placeholder="Enter Email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          required
        />

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

        <label htmlFor="confirmPassword">Confirm Password</label>
        <input
          id="confirmPassword"
          type="password"
          placeholder="Confirm Password"
          value={confirmPassword}
          onChange={(event) => setConfirmPassword(event.target.value)}
          required
        />

        <button type="submit">Continue to Payment</button>

        {/* Shows the signup error but keeps the form visible. */}
        {validationError && <p>{validationError}</p>}
      </form>
    </section>
  );
}

export default Signup;