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
                Upload Food
            </NavLink>      

            <NavLink to={`/admin/restaurants/${restaurantId}/food/dishdeletion`}>
                Delete Dish
            </NavLink>                       
        </nav>
    );
}

export default AdminNavbar ;