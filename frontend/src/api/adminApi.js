const API_URL = import.meta.env.VITE_FLASK_API;

// Sends the username and password to Flask.
export function loginAdmin(username, password) {
  const entry = {
    username: username,
    password: password,
  };

  return fetch(`${API_URL}/adminLogin`, {
    method: "POST",
    credentials: "include",
    body: JSON.stringify(entry),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then(function (response) {
      return response.json().then(function (json) {
        if (!response.ok) {
          throw new Error(json.error);
        }

        return json;
      });
    });
}

// Checks if they already has an active Flask session.
export function checkAdmin() {
  return fetch(`${API_URL}/checkAdmin`, {
    method: "GET",
    credentials: "include",
  })
    .then(function (response) {
      return response.json().then(function (json) {

        // 401 is expected when there is no active login session.
        if (response.status === 401) {
          return json;
        }
        // Other failed responses should still be treated as errors.
        if (!response.ok) {
          throw new Error(json.error);
        }

        return json;
      });
    });
}

// Logs out of the Flask session.
export function logoutAdmin() {
  return fetch(`${API_URL}/logout`, {
    method: "POST",
    credentials: "include",
  })
    .then(function (response) {
      return response.json().then(function (json) {

        if (!response.ok) {
          throw new Error(json.error);
        }

        return json;
      });
    });
}

// Sends the password reset token and new password to Flask.
export function resetPassword(token, password) {
  return fetch(`${API_URL}/reset-password`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      token: token,
      password: password
    })
  })
    .then(function (response) {
      return response.json().then(function (json) {

        if (!response.ok) {
          throw new Error(json.error);
        }

        return json;
      });
    });
}