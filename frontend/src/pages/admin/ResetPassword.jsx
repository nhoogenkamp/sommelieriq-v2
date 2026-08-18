import React, { useState } from "react";
import { useSearchParams } from "react-router-dom";

import { resetPassword } from "../../api/adminApi";

// Reset password React example:
// https://git.cardiff.ac.uk/c22065407/group-8-cflt/-/blob/17-as-the-player-i-would-like-the-rest-of-the-game-implemented-so-i-can-play-it-all-2/src/Pages/ResetPassword.jsx
//
// React Router search parameters:
// https://reactrouter.com/start/declarative/url-values


const ResetPassword = () => {

    const [searchParams] = useSearchParams();
    // Get password reset token from URL.
    const token = searchParams.get("token");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");


    const handleSubmit = (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }

        resetPassword(token, password)
            .then(function (result) {

                setMessage(result.message);

                // Redirect to login page if password reset is successful.
                if (result.redirect) {
                    window.location.href = result.redirect;
                }

            })
            .catch(function (error) {

                console.error("Error:", error);

                setMessage(
                    error.message || "An error occurred. Please try again."
                );

            });
    };


    return (
        <div className="reset-password-container">
            <div className="reset-password-card">
                <h2>Reset Password</h2>
                {message && <p className="reset-password-message"> {message}</p>
                }

                <form onSubmit={handleSubmit}>

                    <div className="form-group">
                        <label htmlFor="password">
                            New Password
                        </label>

                        <input
                            type="password"
                            id="password"
                            placeholder="Enter new password"
                            value={password}
                            onChange={(e) =>
                                setPassword(e.target.value)
                            }
                            required
                        />

                    </div>

                    <div className="form-group">

                        <label htmlFor="confirmPassword">
                            Confirm New Password
                        </label>

                        <input
                            type="password"
                            id="confirmPassword"
                            placeholder="Confirm new password"
                            value={confirmPassword}
                            onChange={(e) =>
                                setConfirmPassword(e.target.value)
                            }
                            required
                        />

                    </div>

                    <button type="submit">
                        Reset Password
                    </button>

                </form>

            </div>

        </div>
    );
};


export default ResetPassword;