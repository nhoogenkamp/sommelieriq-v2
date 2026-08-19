import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { addAdmin } from "../../api/adminApi";
import { AuthContext } from "../../context/AuthContext";


function AddUser() {
    // Stores the username, email and role entered in the form.
    // https://react.dev/reference/react/useState
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("staff");

    // Stores validation errors without hiding the form.
    const [validationError, setValidationError] = useState("");

    // Reads the currently logged-in admin from AuthContext.
    // https://react.dev/reference/react/useContext
    const { currentUser } = useContext(AuthContext);
    // Used to move to another React route after adding a user.
    // https://reactrouter.com/api/hooks/useNavigate
    const navigate = useNavigate();

    async function submitUser(event) {
        // Stops the form from refreshing the page.
        // https://developer.mozilla.org/en-US/docs/Web/API/Event/preventDefault
        event.preventDefault();

        try {
        setValidationError("");
        await addAdmin(username, email, role);

        // Clears the form after successfully creating a user.
        setUsername("");
        setEmail("");
        setRole("staff");

        // Return to dashboard after successfully creating the user.
        navigate(
            `/admin/restaurants/${currentUser.restaurant_id}/dashboard`
        );

        } catch (error) {
        setValidationError(error.message);
        }
    }

    return (
        <section>
        <form className="login-form" onSubmit={submitUser}>
            <h1>Add User</h1>

            <p>
            Please enter the new user's details.
            They will receive an email to set their password.
            </p>

            <label htmlFor="username"> Username</label>
            <input
            id="username"
            type="text"
            placeholder="Enter Username"
            value={username}
            onChange={(event) =>
                setUsername(event.target.value)
            }
            required
            />


            <label htmlFor="email"> Email </label>
            <input
            id="email"
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(event) =>
                setEmail(event.target.value)
            }
            required
            />

            <label htmlFor="role"> Role</label>
            <select
            id="role"
            value={role}
            onChange={(event) =>
                setRole(event.target.value)
            }
            required
            >

            <option value="staff">
                Staff
            </option>

            <option value="sommelier">
                Sommelier
            </option>

            <option value="manager">
                Manager
            </option>

            {/* Managers cannot create Owner accounts. */}
            {currentUser?.role === "owner" && (
                <option value="owner">
                Owner
                </option>
            )}
            </select>

            <button type="submit">
            Add User
            </button>

            {/* Shows the validation error but keeps the form visible. */}
            {validationError && (
            <p>{validationError}</p>
            )}

        </form>
        </section>
    );
}

export default AddUser;