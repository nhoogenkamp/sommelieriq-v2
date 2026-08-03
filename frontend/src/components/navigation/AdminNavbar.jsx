import { NavLink } from "react-router-dom";

function AdminNavbar () {
    return (
        <nav>
            {/* This is currently the main public page. */}
            <NavLink to="/login">
                Login
            </NavLink>

            <NavLink to="/Dashboard">
                Dashboard
            </NavLink>
        </nav>
    );
}

export default AdminNavbar ;