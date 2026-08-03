const API_URL = import.meta.env.VITE_FLASK_API;

// Sends the username and password to Flask.
export async function loginAdmin(username, password) {
  const response = await fetch(`${API_URL}/adminLogin`, {
    method: "POST",
    // Includes the Flask session cookie.
    credentials: "include",
    headers: {"Content-Type": "application/json",},
    body: JSON.stringify({
      username: username,
      password: password,
    }),
  });

  const data = await response.json();

  // Uses the error message returned by Flask.
  if (!response.ok) {
    throw new Error(data.error || "Unable to login.");
  }
  return data;
}