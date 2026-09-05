import { NavLink, useNavigate, useParams } from "react-router-dom";
import { useContext, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import Hamburger from "hamburger-react";

function AdminNavbar() {

  const { restaurant_slug } = useParams();

  // Gets the current user and logout function from AuthContext.
  // https://react.dev/reference/react/useContext
  const { currentUser, logout } = useContext(AuthContext);

  // hamburger navbar in mobile: https://medium.com/@adebosinadewale_62859/creating-an-hamburger-menu-in-react-3670c811db8c
  const [hamburgerIsOpen, setHamburgerIsOpen] = useState(false);
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
    <nav className="admin-navbar">

  <div className="hamburger">
    <Hamburger
      toggled={hamburgerIsOpen}
      toggle={setHamburgerIsOpen}
      label="Toggle navigation menu"
    />
  </div>

  <div
    className={`admin-navbar-links ${
      hamburgerIsOpen ? "open" : ""
    }`}
  >

      {/* Shows Login only when there is no logged-in user. */}
      {!currentUser && (
        <NavLink to="/login"
        onClick={() => setHamburgerIsOpen(false)}>Login</NavLink>
      )}


      {/* These links are available to every admin role.
      ProtectedRoute still checks whether the user can access them. */}
      {currentUser && (
        <>
          <NavLink to={`/admin/restaurants/${restaurant_slug}/dashboard`}
          onClick={() => setHamburgerIsOpen(false)}
          >Dashboard</NavLink>

          <NavLink to={`/admin/restaurants/${restaurant_slug}/wines/availability`}
          onClick={() => setHamburgerIsOpen(false)}> Availability</NavLink>
        </>
      )}


      {/* Staff cannot see wine and food management links.
      Owner, Manager and Sommelier can access these pages. */}
      {currentUser && currentUser.role !== "staff" && (
        <>
          <NavLink to={`/admin/restaurants/${restaurant_slug}/wines/price`}
          onClick={() => setHamburgerIsOpen(false)}> Update Price</NavLink>

          <NavLink to={`/admin/restaurants/${restaurant_slug}/wines/delete`}
          onClick={() => setHamburgerIsOpen(false)}> Delete Wine</NavLink>

          <NavLink to={`/admin/restaurants/${restaurant_slug}/wines/upload`}
          onClick={() => setHamburgerIsOpen(false)}>Upload Wines</NavLink>

          <NavLink to={`/admin/restaurants/${restaurant_slug}/food/foodupload`}
          onClick={() => setHamburgerIsOpen(false)}>Upload Dish </NavLink>

          <NavLink to={`/admin/restaurants/${restaurant_slug}/food/dishdeletion`}
          onClick={() => setHamburgerIsOpen(false)}> Delete Dish</NavLink>

          <NavLink to={`/admin/restaurants/${restaurant_slug}/food/update`}
          onClick={() => setHamburgerIsOpen(false)}> Update Dish</NavLink>
        </>
      )}

      {/* Only Owner and Manager can access user management. */}
      {currentUser && ["owner", "manager"].includes(currentUser.role) && (
          <NavLink to={`/admin/restaurants/${restaurant_slug}/users/add`}
          onClick={() => setHamburgerIsOpen(false)}> Add Users</NavLink>
      )}


      {/* Shows Logout only when a user is logged in. */}
      {currentUser && (
        <button className="admin-logout-button" type="button" onClick={handleLogout}
        >
            Logout
        </button>
      )}
</div>
    </nav>
  );
}

export default AdminNavbar;