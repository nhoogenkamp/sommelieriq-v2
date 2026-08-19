import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../../context/AuthContext";

function AdminNavbar() {

  const { restaurantId } = useParams();

  // Gets the current user and logout function from AuthContext.
  // https://react.dev/reference/react/useContext
  const { currentUser, logout } = useContext(AuthContext);

  // Used to navigate back to login after logout.
  // https://reactrouter.com/api/hooks/useNavigate
  const navigate = useNavigate();


  // Logs the user out and returns them to the login page.
  async function handleLogout() {

    try {
      await logout();

      navigate("/login");

    } catch (error) {
      console.log(error.message);
    }
  }


  return (
    <nav>

      {/* Shows Login only when there is no logged-in user. */}
      {!currentUser && (
        <NavLink to="/login">
          Login
        </NavLink>
      )}


      {/* These links are available to every admin role.
      ProtectedRoute still checks whether the user can access them. */}
      {currentUser && (
        <>
          <NavLink to={`/admin/restaurants/${restaurantId}/dashboard`}>
            Dashboard
          </NavLink>

          <NavLink to={`/admin/restaurants/${restaurantId}/wines/availability`}>
            Availability
          </NavLink>
        </>
      )}


      {/* Staff cannot see wine and food management links.
      Owner, Manager and Sommelier can access these pages. */}
      {currentUser && currentUser.role !== "staff" && (
        <>
          <NavLink to={`/admin/restaurants/${restaurantId}/wines/price`}>
            Update Price
          </NavLink>

          <NavLink to={`/admin/restaurants/${restaurantId}/wines/delete`}>
            Delete Wine
          </NavLink>

          <NavLink to={`/admin/restaurants/${restaurantId}/wines/upload`}>
            Upload Wines
          </NavLink>

          <NavLink to={`/admin/restaurants/${restaurantId}/food/foodupload`}>
            Upload Dish
          </NavLink>

          <NavLink to={`/admin/restaurants/${restaurantId}/food/dishdeletion`}>
            Delete Dish
          </NavLink>

          <NavLink to={`/admin/restaurants/${restaurantId}/food/update`}>
            Update Dish
          </NavLink>
        </>
      )}

      {/* Only Owner and Manager can access user management. */}
      {currentUser && ["owner", "manager"].includes(currentUser.role) && (
          <NavLink to={`/admin/restaurants/${restaurantId}/users/add`}>
            Add Users
          </NavLink>
      )}


      {/* Shows Logout only when a user is logged in. */}
      {currentUser && (
        <button className="admin-logout-button" type="button" onClick={handleLogout}>
            Logout
        </button>
      )}

    </nav>
  );
}

export default AdminNavbar;