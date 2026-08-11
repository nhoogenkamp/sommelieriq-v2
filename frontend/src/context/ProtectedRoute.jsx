import { useContext } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { AuthContext } from "./AuthContext";
 // https://dev.to/olumidesamuel_/implementing-protected-routes-and-authentication-in-react-2026-edition-4k6e
 // creating protective routes with roles 

function ProtectedRoute({ allowedRoles }) {

  const { currentUser, isLoading } = useContext(AuthContext);

  // Gets the current route location.
  // This allows React Router to remember where the user tried to go.
  const location = useLocation();

  // Wait until AuthContext has finished checking the existing Flask session.
  if (isLoading) {
    return <p>Loading...</p>;
  }

  // If there is no logged-in user, redirect to the login page.
  // state stores the page the user originally tried to visit.
  // https://reactrouter.com/api/components/Navigate
  if (!currentUser) {
    return (<Navigate to="/login" state={{ from: location }} replace/>
    );
  }

  // Checks whether the logged-in user's role appears in the list of roles allowed to access this route.
  const roleIsAllowed = allowedRoles.includes(currentUser.role);

  // If the user's role is not allowed, the protected page is not displayed.
  if (!roleIsAllowed) {
    return <p>You do not have permission to access this page.</p>;
  }

  return <Outlet />;
}
export default ProtectedRoute;