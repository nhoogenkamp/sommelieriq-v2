import { createContext, useCallback, useMemo, useState } from "react";

// https://react.dev/reference/react/createContext
// similar to https://react.dev/reference/react/useContext
const AuthContext = createContext(null);

function AuthProvider({ children }) {

  // Stores the currently logged-in user's information.
  const [currentUser, setCurrentUser] = useState(null);

  // Stores the user information returned by the backend after a successful login.
  // https://react.dev/reference/react/useCallback
  const login = useCallback((response) => {
    setCurrentUser({
      username: response.username,
      restaurantId: response.restaurant_id,
      role: response.role,
    });
  }, []);

  // Makes the current user and login function available through AuthContext.
  // https://react.dev/reference/react/useMemo
  const contextValue = useMemo(() => ({
    currentUser,
    login
  }), [currentUser, login]);

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