import { Outlet } from "react-router-dom";
import AdminNavbar  from "../components/navigation/AdminNavbar";
import PublicFooter from "../components/navigation/PublicFooter";

function AdminLayout() {
    return (
        <>
            {/* This stays visible on all admin pages just like public navbar in publiclayout. */}
            <AdminNavbar  />

            <main>
                {/* Displays whichever public child page matches the URL.
                https://reactrouter.com/api/components/Outlet */}
                <Outlet />
            </main>

            {/* This also stays visible on all public pages. */}
            <PublicFooter />
        </>
    );
}
export default AdminLayout;