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