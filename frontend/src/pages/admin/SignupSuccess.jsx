import { useEffect } from "react";
import { useNavigate, NavLink } from "react-router-dom";

function SignupSuccess() {

  // Used to redirect the customer to login after signup.
  // https://rupard.hashnode.dev/how-to-automatically-redirect-to-the-next-page-after-n-seconds-in-reactjs
  const navigate = useNavigate();

  // Redirects the customer to login after 5 seconds.
  useEffect(() => {
    const timer = setTimeout(() => {
      navigate("/login");
    }, 5000);

    // Clears the timer if the component is removed.
    // https://react.dev/reference/react/useEffect
    return () => clearTimeout(timer);

  }, [navigate]);

return (
    <div className="dashboard-grid">
    <article className="dashboard-card">
      <div>
        <h2>Subscription Successful</h2>

        <p>
          Thank you for subscribing to SommelierIQ.
          Your restaurant account has been created successfully.
        </p>

        <p>
          You will be redirected to the login page in a few seconds.
        </p>
    
        <p>
          If you are not redirected,{" "}
          <NavLink to="/login">
            click here to login
          </NavLink>.
        </p>
      </div>
    
        </article>
    </div>
  );
}

export default SignupSuccess;