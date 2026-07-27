import { NavLink } from "react-router-dom";

function PublicNavbar() {
    return (
        <nav>
            {/* This is currently the main public page. */}
            <NavLink to="/restaurants">
                Restaurants
            </NavLink>
        </nav>
    );
}

export default PublicNavbar;