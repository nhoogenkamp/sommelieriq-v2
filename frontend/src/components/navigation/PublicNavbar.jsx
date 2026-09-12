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
            
            <NavLink to="/how-it-works">
                How It Works
            </NavLink>

            <NavLink to="/pricing">
                Pricing
            </NavLink>
        </nav>
    );
}

export default PublicNavbar;