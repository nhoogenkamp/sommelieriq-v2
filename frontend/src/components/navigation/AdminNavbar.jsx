import { NavLink, useParams} from "react-router-dom";

function AdminNavbar () {
    const {restaurantId} = useParams();
    return (
        <nav>
            {/* This is currently the main public page. */}
            <NavLink to="/login">
                Login
            </NavLink>

            <NavLink to={`/admin/restaurants/${restaurantId}/dashboard`}>
                Dashboard
            </NavLink>

            <NavLink to={`/admin/restaurants/${restaurantId}/wines/availability`}>
                Availability
            </NavLink>
        </nav>
    );
}

export default AdminNavbar ;