import { NavLink } from "react-router-dom";

function PublicNavbar() {
    return (
        <nav>
            <NavLink to="/">
                Home
            </NavLink>
        
            <NavLink to="/restaurants">
                Restaurants
            </NavLink>
            
        </nav>
    );
}

export default PublicNavbar;