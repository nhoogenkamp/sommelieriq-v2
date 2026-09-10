import { useState } from "react";
import { getCustomerPortal } from "../../api/adminApi";

function Account() {
  // Stores errors without hiding the account page.
  // https://react.dev/reference/react/useState
  const [validationError, setValidationError] = useState("");

  async function manageSubscription() {
    try {
      setValidationError("");

      const portal = await getCustomerPortal();
      // Redirects the user to the Stripe Customer Portal.
      window.location.href = portal.portal_url;
    } catch (error) {
      setValidationError(error.message);
    }
  }

  return (
    <>
    <div className="dashboard-grid"> 

        <article className="dashboard-card">
            <h1>Account</h1>

            <h2>Subscription</h2>

            <p>
                Manage or cancel your SommelierIQ subscription.
            </p>

            {validationError && (
                <p>{validationError}</p>
            )}

            <button type="button" className="wine-update-button" onClick={manageSubscription}>
                Manage Subscription
            </button>
       </article>
    </div>
    </>
  );
}

export default Account;