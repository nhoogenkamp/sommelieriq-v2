import { createContext, useCallback, useMemo, useState, useEffect } from "react";
import { checkAdmin, logoutAdmin } from "../api/adminApi";

// https://react.dev/reference/react/createContext
// similar to https://react.dev/reference/react/useContext
const AuthContext = createContext(null);

function AuthProvider({ children }) {
    
    // Stores the currently logged-in user's information.
    const [currentUser, setCurrentUser] = useState(null);

    // Stores whether AuthContext is still checking the existing login session.
    const [isLoading, setIsLoading] = useState(true);

    // Stores the user information returned by the backend after a successful login.
    // https://react.dev/reference/react/useCallback
    const login = useCallback((response) => {
        setCurrentUser({
        username: response.username,
        restaurantId: response.restaurant_id,
        restaurant_slug: response.restaurant_slug,
        role: response.role,
        });
    }, []);

    // Logs the user out of the Flask session and removes the user information from AuthContext.
    const logout = useCallback(async () => {
    await logoutAdmin();
    setCurrentUser(null);
    }, []);

    // Checks if an existing Flask login session is available when React loads.
    // https://react.dev/reference/react/useEffect
    useEffect(() => {
        async function checkExistingLogin() {
        try {
            setIsLoading(true);
            const admin = await checkAdmin();

            if (admin.logged_in) {
            setCurrentUser({
                username: admin.username,
                restaurantId: admin.restaurant_id,
                restaurant_slug: admin.restaurant_slug,
                role: admin.role,
            });
            }

        } catch (error) {
            console.log(error.message);

        } finally {
            setIsLoading(false);
        }
        }
        checkExistingLogin();

    }, []);

    // Makes the current user and login function available through AuthContext.
    // https://react.dev/reference/react/useMemo
    const contextValue = useMemo(() => ({
        currentUser,
        login,
        logout,
        isLoading
    }), [currentUser, login, logout, isLoading]);

    // children represents the components placed inside AuthProvider.
    // These components will be able to access the values in AuthContext.
    // https://react.dev/learn/passing-props-to-a-component#passing-jsx-as-children
    return (
        <AuthContext.Provider value={contextValue}>
        {children}
        </AuthContext.Provider>
    );
}

export { AuthContext, AuthProvider };