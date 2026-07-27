import { Outlet } from "react-router-dom";
import PublicNavbar from "../components/navigation/PublicNavbar";
import PublicFooter from "../components/navigation/PublicFooter";

function PublicLayout() {
    return (
        <>
            {/* This stays visible on all public pages. */}
            <PublicNavbar />

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
export default PublicLayout;
