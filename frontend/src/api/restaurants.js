const API_URL = import.meta.env.VITE_FLASK_API;


// Get all restaurants for the public restaurant page
export function getPublicRestaurants() {
  return fetch(`${API_URL}/restaurants`, {
    method: "GET",
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