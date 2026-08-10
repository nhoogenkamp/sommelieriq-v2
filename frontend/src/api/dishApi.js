const API_URL = import.meta.env.VITE_FLASK_API;

// Delete a dish
export function deleteDish(entry) {
  return fetch(`${API_URL}/deleteDish`, {
    method: "DELETE",
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

// Gets all dishes for one restaurant.
export function getDishes(restaurantId) {
  return fetch(`${API_URL}/getDishes`, {
    method: "POST",
    credentials: "include",
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